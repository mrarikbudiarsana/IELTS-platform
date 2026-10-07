import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import {
  ReadingAttempt,
  StudentAnswer,
  AttemptItemResult,
  QuestionGroup,
  QuestionItem,
} from '../shared/types';
import {
  getVersionById,
  getTestById,
  sanitizeQuestionsForStudent,
} from './readingService';
import {
  markStudentAnswer,
  calculateEstimatedBandScore,
} from '../shared/scoring';

export function startOrResumeAttempt(params: {
  userId: string;
  testId: string;
  modeOverride?: 'practice' | 'mock';
}): { attempt: ReadingAttempt; testVersion: any } {
  const test = getTestById(params.testId);
  if (!test) throw new Error('Test not found');
  if (test.status !== 'published') {
    throw new Error('Test is not published');
  }

  const latestVersion = getVersionById(test.latestVersionId);
  if (!latestVersion) throw new Error('Published test version not found');

  // Check if user already has an active in_progress attempt
  const existingAttemptRow = db
    .prepare(`
      SELECT * FROM reading_attempts
      WHERE user_id = ? AND test_id = ? AND status = 'in_progress'
      ORDER BY started_at DESC LIMIT 1
    `)
    .get(params.userId, params.testId) as any;

  if (existingAttemptRow) {
    const now = new Date();
    // Check server deadline
    if (existingAttemptRow.deadline_at && new Date(existingAttemptRow.deadline_at) < now) {
      // Auto-submit expired attempt
      const finalized = submitAttempt({
        attemptId: existingAttemptRow.id,
        userId: params.userId,
        forceExpired: true,
      });
      // Start a new attempt since the previous was expired
      return startNewAttempt(params, test, latestVersion);
    }

    // Resume existing attempt
    const attempt = getAttemptById(existingAttemptRow.id, params.userId);
    const sanitizedGroups = sanitizeQuestionsForStudent(latestVersion.questionGroups);

    return {
      attempt: attempt!,
      testVersion: {
        ...latestVersion,
        questionGroups: sanitizedGroups,
      },
    };
  }

  return startNewAttempt(params, test, latestVersion);
}

function startNewAttempt(params: { userId: string; testId: string; modeOverride?: 'practice' | 'mock' }, test: any, version: any) {
  const attemptId = uuidv4();
  const now = new Date();
  const mode = params.modeOverride || test.category;

  let deadlineAt: string | null = null;
  if (mode === 'mock') {
    const minutes = test.timeLimitMinutes || 60;
    const deadlineDate = new Date(now.getTime() + minutes * 60 * 1000);
    deadlineAt = deadlineDate.toISOString();
  }

  // Check if first attempt
  const pastAttemptsCount = db
    .prepare(`
      SELECT COUNT(*) as count FROM reading_attempts
      WHERE user_id = ? AND test_id = ? AND status IN ('submitted', 'expired')
    `)
    .get(params.userId, params.testId) as any;

  const isFirstAttempt = pastAttemptsCount.count === 0 ? 1 : 0;

  db.prepare(`
    INSERT INTO reading_attempts (
      id, user_id, test_id, version_id, test_title, test_type,
      mode, status, started_at, deadline_at, duration_seconds,
      total_questions, is_first_attempt, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'in_progress', ?, ?, 0, ?, ?, ?)
  `).run(
    attemptId,
    params.userId,
    params.testId,
    version.id,
    test.title,
    test.testType,
    mode,
    now.toISOString(),
    deadlineAt,
    version.totalQuestions,
    isFirstAttempt,
    now.toISOString()
  );

  const attempt = getAttemptById(attemptId, params.userId)!;
  const sanitizedGroups = sanitizeQuestionsForStudent(version.questionGroups);

  return {
    attempt,
    testVersion: {
      ...version,
      questionGroups: sanitizedGroups,
    },
  };
}

export function saveStudentAnswer(params: {
  attemptId: string;
  userId: string;
  questionNumber: number;
  questionId: string;
  userAnswer: string | string[];
  isFlagged?: boolean;
}): { saved: boolean; isExpired?: boolean } {
  const attemptRow = db
    .prepare('SELECT * FROM reading_attempts WHERE id = ? AND user_id = ?')
    .get(params.attemptId, params.userId) as any;

  if (!attemptRow) throw new Error('Attempt not found or access forbidden');

  if (attemptRow.status !== 'in_progress') {
    return { saved: false, isExpired: true };
  }

  // Check server-enforced deadline
  if (attemptRow.deadline_at && new Date(attemptRow.deadline_at) < new Date()) {
    submitAttempt({ attemptId: params.attemptId, userId: params.userId, forceExpired: true });
    return { saved: false, isExpired: true };
  }

  const now = new Date().toISOString();
  const answerId = uuidv4();
  const answerJson = JSON.stringify(params.userAnswer);
  const flagged = params.isFlagged ? 1 : 0;

  db.prepare(`
    INSERT INTO reading_answers (
      id, attempt_id, question_id, question_number, user_answer_json, is_flagged, saved_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(attempt_id, question_number) DO UPDATE SET
      user_answer_json = excluded.user_answer_json,
      is_flagged = excluded.is_flagged,
      saved_at = excluded.saved_at
  `).run(
    answerId,
    params.attemptId,
    params.questionId,
    params.questionNumber,
    answerJson,
    flagged,
    now
  );

  return { saved: true };
}

export function submitAttempt(params: {
  attemptId: string;
  userId: string;
  forceExpired?: boolean;
}): ReadingAttempt {
  const attemptRow = db
    .prepare('SELECT * FROM reading_attempts WHERE id = ? AND user_id = ?')
    .get(params.attemptId, params.userId) as any;

  if (!attemptRow) throw new Error('Attempt not found or access forbidden');

  // If already submitted or expired, return current result
  if (attemptRow.status === 'submitted' || attemptRow.status === 'expired') {
    return getAttemptById(params.attemptId, params.userId)!;
  }

  const version = getVersionById(attemptRow.version_id);
  if (!version) throw new Error('Test version not found');

  const now = new Date();
  const startedAt = new Date(attemptRow.started_at);
  const durationSeconds = Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / 1000));

  // Build question map
  const questionMap = new Map<number, { question: QuestionItem; group: QuestionGroup }>();
  for (const group of version.questionGroups) {
    for (const q of group.questions) {
      questionMap.set(q.questionNumber, { question: q, group });
    }
  }

  // Load existing student answers
  const answerRows = db
    .prepare('SELECT * FROM reading_answers WHERE attempt_id = ?')
    .all(params.attemptId) as any[];

  const studentAnswersMap = new Map<number, any>();
  for (const row of answerRows) {
    studentAnswersMap.set(row.question_number, row);
  }

  let totalRawScore = 0;
  const itemResults: AttemptItemResult[] = [];

  const updateAnswerMark = db.prepare(`
    UPDATE reading_answers
    SET is_correct = ?, mark = ?
    WHERE attempt_id = ? AND question_number = ?
  `);

  const tx = db.transaction(() => {
    for (const [qNum, { question, group }] of questionMap.entries()) {
      const studentAnsRow = studentAnswersMap.get(qNum);
      const studentAns = studentAnsRow ? JSON.parse(studentAnsRow.user_answer_json) : '';

      const markResult = markStudentAnswer({
        questionType: group.questionType,
        userAnswer: studentAns,
        answerKey: question.answerKey,
        acceptedAlternatives: question.acceptedAlternatives,
        maxWords: group.maxWords,
        maxNumbers: group.maxNumbers,
        allowAnyOrder: group.allowAnyOrder,
      });

      if (studentAnsRow) {
        updateAnswerMark.run(
          markResult.isCorrect ? 1 : 0,
          markResult.mark,
          params.attemptId,
          qNum
        );
      } else {
        // Insert empty answer for unanswered question
        db.prepare(`
          INSERT INTO reading_answers (
            id, attempt_id, question_id, question_number, user_answer_json,
            is_flagged, is_correct, mark, saved_at
          ) VALUES (?, ?, ?, ?, ?, 0, 0, 0, datetime('now'))
        `).run(uuidv4(), params.attemptId, question.id, qNum, JSON.stringify(''));
      }

      totalRawScore += markResult.mark;

      itemResults.push({
        questionId: question.id,
        questionNumber: qNum,
        userAnswer: studentAns,
        isCorrect: markResult.isCorrect,
        mark: markResult.mark,
        answerKey: question.answerKey,
        acceptedAlternatives: question.acceptedAlternatives || [],
        explanation: question.explanation,
        evidenceQuote: question.evidenceQuote,
        paragraphRef: question.paragraphRef,
      });
    }

    const finalStatus = params.forceExpired ? 'expired' : 'submitted';
    const estimatedBand = calculateEstimatedBandScore(
      totalRawScore,
      version.totalQuestions,
      attemptRow.test_type
    );

    db.prepare(`
      UPDATE reading_attempts
      SET status = ?,
          submitted_at = ?,
          duration_seconds = ?,
          raw_score = ?,
          band_score = ?
      WHERE id = ?
    `).run(
      finalStatus,
      now.toISOString(),
      durationSeconds,
      totalRawScore,
      estimatedBand,
      params.attemptId
    );
  });

  tx();

  return getAttemptById(params.attemptId, params.userId)!;
}

export function getAttemptById(attemptId: string, userId: string): ReadingAttempt | null {
  const attemptRow = db
    .prepare('SELECT * FROM reading_attempts WHERE id = ? AND user_id = ?')
    .get(attemptId, userId) as any;

  if (!attemptRow) return null;

  const answerRows = db
    .prepare('SELECT * FROM reading_answers WHERE attempt_id = ?')
    .all(attemptId) as any[];

  const answers: Record<number, StudentAnswer> = {};
  for (const row of answerRows) {
    answers[row.question_number] = {
      questionId: row.question_id,
      questionNumber: row.question_number,
      userAnswer: JSON.parse(row.user_answer_json),
      isFlagged: row.is_flagged === 1,
      savedAt: row.saved_at,
    };
  }

  let results: AttemptItemResult[] | undefined = undefined;

  // Answers and explanations are ONLY delivered if attempt has been submitted or expired!
  if (attemptRow.status === 'submitted' || attemptRow.status === 'expired') {
    const version = getVersionById(attemptRow.version_id);
    if (version) {
      const questionMap = new Map<number, QuestionItem>();
      for (const g of version.questionGroups) {
        for (const q of g.questions) {
          questionMap.set(q.questionNumber, q);
        }
      }

      results = [];
      for (const row of answerRows) {
        const q = questionMap.get(row.question_number);
        if (q) {
          results.push({
            questionId: q.id,
            questionNumber: row.question_number,
            userAnswer: JSON.parse(row.user_answer_json),
            isCorrect: row.is_correct === 1,
            mark: Number(row.mark || 0),
            answerKey: q.answerKey,
            acceptedAlternatives: q.acceptedAlternatives || [],
            explanation: q.explanation,
            evidenceQuote: q.evidenceQuote,
            paragraphRef: q.paragraphRef,
          });
        }
      }
      results.sort((a, b) => a.questionNumber - b.questionNumber);
    }
  }

  return {
    id: attemptRow.id,
    userId: attemptRow.user_id,
    testId: attemptRow.test_id,
    versionId: attemptRow.version_id,
    testTitle: attemptRow.test_title,
    testType: attemptRow.test_type,
    mode: attemptRow.mode,
    status: attemptRow.status,
    startedAt: attemptRow.started_at,
    deadlineAt: attemptRow.deadline_at || undefined,
    submittedAt: attemptRow.submitted_at || undefined,
    durationSeconds: attemptRow.duration_seconds,
    rawScore: attemptRow.raw_score !== null ? Number(attemptRow.raw_score) : undefined,
    totalQuestions: attemptRow.total_questions,
    bandScore: attemptRow.band_score !== null ? Number(attemptRow.band_score) : undefined,
    isFirstAttempt: attemptRow.is_first_attempt === 1,
    answers,
    results,
  };
}

export function listUserAttempts(userId: string): ReadingAttempt[] {
  const rows = db
    .prepare('SELECT * FROM reading_attempts WHERE user_id = ? ORDER BY started_at DESC')
    .all(userId) as any[];

  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    testId: r.test_id,
    versionId: r.version_id,
    testTitle: r.test_title,
    testType: r.test_type,
    mode: r.mode,
    status: r.status,
    startedAt: r.started_at,
    deadlineAt: r.deadline_at || undefined,
    submittedAt: r.submitted_at || undefined,
    durationSeconds: r.duration_seconds,
    rawScore: r.raw_score !== null ? Number(r.raw_score) : undefined,
    totalQuestions: r.total_questions,
    bandScore: r.band_score !== null ? Number(r.band_score) : undefined,
    isFirstAttempt: r.is_first_attempt === 1,
    answers: {},
  }));
}
