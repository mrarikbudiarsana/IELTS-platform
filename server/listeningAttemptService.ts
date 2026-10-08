import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import {
  ListeningAttempt,
  StudentAnswer,
  AttemptItemResult,
  QuestionGroup,
  QuestionItem,
  InterruptionEvent,
} from '../shared/types';
import {
  getListeningVersionById,
  getListeningTestById,
  sanitizeListeningForStudent,
} from './listeningService';
import {
  markStudentAnswer,
  calculateEstimatedListeningBandScore,
} from '../shared/scoring';

export function startOrResumeListeningAttempt(params: {
  userId: string;
  testId: string;
  modeOverride?: 'practice' | 'mock';
  isReconnection?: boolean;
  assignmentId?: string;
  packageAttemptId?: string;
}): { attempt: ListeningAttempt; testVersion: any } {
  // If attempting independently without assignment, ensure test is not reserved in an unreleased post-test
  if (!params.assignmentId) {
    const isReserved = db.prepare(`
      SELECT 1 FROM assignments a
      LEFT JOIN test_packages tp ON a.package_id = tp.id
      WHERE a.purpose = 'post_test'
        AND (a.is_released = 0 OR a.release_at > datetime('now'))
        AND (a.test_id = ? OR tp.listening_test_id = ?)
      LIMIT 1
    `).get(params.testId, params.testId);

    if (isReserved) {
      throw new Error('This test material is reserved for a protected post-test and has not been released by your teacher.');
    }
  }

  const test = getListeningTestById(params.testId);
  if (!test) throw new Error('Listening test not found');
  if (test.status !== 'published') {
    throw new Error('Test is not published');
  }

  const latestVersion = getListeningVersionById(test.latestVersionId);
  if (!latestVersion) throw new Error('Published test version not found');

  // Check if active in_progress attempt exists
  const existingRow = db
    .prepare(`
      SELECT * FROM listening_attempts
      WHERE user_id = ? AND test_id = ? AND status = 'in_progress'
      ORDER BY started_at DESC LIMIT 1
    `)
    .get(params.userId, params.testId) as any;

  if (existingRow) {
    const now = new Date();
    // Check server deadline
    if (existingRow.deadline_at && new Date(existingRow.deadline_at) < now) {
      submitListeningAttempt({
        attemptId: existingRow.id,
        userId: params.userId,
        forceExpired: true,
      });
      return startNewListeningAttempt(params, test, latestVersion);
    }

    // Attempt is being resumed: record interruption if this was a refresh/reconnect
    const currentEvents: InterruptionEvent[] = JSON.parse(existingRow.interruption_events_json || '[]');
    currentEvents.push({
      timestamp: now.toISOString(),
      type: 'reload',
      detail: 'Session reconnected / page refreshed during active attempt',
    });

    db.prepare(`
      UPDATE listening_attempts
      SET was_interrupted = 1,
          interruption_count = interruption_count + 1,
          interruption_events_json = ?
      WHERE id = ?
    `).run(JSON.stringify(currentEvents), existingRow.id);

    const attempt = getListeningAttemptById(existingRow.id, params.userId)!;
    const sanitized = sanitizeListeningForStudent(
      latestVersion.questionGroups,
      latestVersion.parts
    );

    return {
      attempt,
      testVersion: {
        ...latestVersion,
        questionGroups: sanitized.questionGroups,
        parts: sanitized.parts,
      },
    };
  }

  return startNewListeningAttempt(params, test, latestVersion);
}

function startNewListeningAttempt(
  params: {
    userId: string;
    testId: string;
    modeOverride?: 'practice' | 'mock';
    assignmentId?: string;
    packageAttemptId?: string;
  },
  test: any,
  version: any
) {
  const attemptId = uuidv4();
  const now = new Date();
  const mode = params.modeOverride || test.category;

  let deadlineAt: string | null = null;
  if (mode === 'mock') {
    // Official timeline calculation:
    // Audio duration + pauses (approx 30 mins) + 120s final check time
    let totalMinutes = test.timeLimitMinutes || 35;
    const deadlineDate = new Date(now.getTime() + totalMinutes * 60 * 1000);
    deadlineAt = deadlineDate.toISOString();
  }

  // Check if first attempt
  const pastAttemptsCount = db
    .prepare(`
      SELECT COUNT(*) as count FROM listening_attempts
      WHERE user_id = ? AND test_id = ? AND status IN ('submitted', 'expired')
    `)
    .get(params.userId, params.testId) as any;

  const isFirstAttempt = pastAttemptsCount.count === 0 ? 1 : 0;

  db.prepare(`
    INSERT INTO listening_attempts (
      id, user_id, test_id, version_id, test_title,
      mode, status, started_at, deadline_at, duration_seconds,
      total_questions, is_first_attempt, was_interrupted,
      interruption_count, replay_count, interruption_events_json, assignment_id, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'in_progress', ?, ?, 0, ?, ?, 0, 0, 0, '[]', ?, ?)
  `).run(
    attemptId,
    params.userId,
    params.testId,
    version.id,
    test.title,
    mode,
    now.toISOString(),
    deadlineAt,
    version.totalQuestions,
    isFirstAttempt,
    params.assignmentId || null,
    now.toISOString()
  );

  // If package attempt provided, link it
  if (params.packageAttemptId) {
    db.prepare(`
      UPDATE package_attempts
      SET listening_attempt_id = ?
      WHERE id = ?
    `).run(attemptId, params.packageAttemptId);
  }

  const attempt = getListeningAttemptById(attemptId, params.userId)!;
  const sanitized = sanitizeListeningForStudent(
    version.questionGroups,
    version.parts
  );

  return {
    attempt,
    testVersion: {
      ...version,
      questionGroups: sanitized.questionGroups,
      parts: sanitized.parts,
    },
  };
}

export function recordListeningInterruption(params: {
  attemptId: string;
  userId: string;
  type: 'disconnect' | 'reload' | 'audio_error' | 'manual_pause_recovered';
  detail?: string;
  didReplay?: boolean;
}): { success: boolean } {
  const row = db
    .prepare('SELECT * FROM listening_attempts WHERE id = ? AND user_id = ?')
    .get(params.attemptId, params.userId) as any;

  if (!row || row.status !== 'in_progress') return { success: false };

  const events: InterruptionEvent[] = JSON.parse(row.interruption_events_json || '[]');
  events.push({
    timestamp: new Date().toISOString(),
    type: params.type,
    detail: params.detail,
  });

  const replayIncrement = params.didReplay ? 1 : 0;

  db.prepare(`
    UPDATE listening_attempts
    SET was_interrupted = 1,
        interruption_count = interruption_count + 1,
        replay_count = replay_count + ?,
        interruption_events_json = ?
    WHERE id = ?
  `).run(replayIncrement, JSON.stringify(events), params.attemptId);

  return { success: true };
}

export function saveListeningAnswer(params: {
  attemptId: string;
  userId: string;
  questionNumber: number;
  questionId: string;
  userAnswer: string | string[];
  isFlagged?: boolean;
}): { saved: boolean; isExpired?: boolean } {
  const attemptRow = db
    .prepare('SELECT * FROM listening_attempts WHERE id = ? AND user_id = ?')
    .get(params.attemptId, params.userId) as any;

  if (!attemptRow) throw new Error('Attempt not found or access forbidden');

  if (attemptRow.status !== 'in_progress') {
    return { saved: false, isExpired: true };
  }

  // Check server-enforced deadline
  if (attemptRow.deadline_at && new Date(attemptRow.deadline_at) < new Date()) {
    submitListeningAttempt({ attemptId: params.attemptId, userId: params.userId, forceExpired: true });
    return { saved: false, isExpired: true };
  }

  const now = new Date().toISOString();
  const answerId = uuidv4();
  const answerJson = JSON.stringify(params.userAnswer);
  const flagged = params.isFlagged ? 1 : 0;

  db.prepare(`
    INSERT INTO listening_answers (
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

export function submitListeningAttempt(params: {
  attemptId: string;
  userId: string;
  forceExpired?: boolean;
}): ListeningAttempt {
  const attemptRow = db
    .prepare('SELECT * FROM listening_attempts WHERE id = ? AND user_id = ?')
    .get(params.attemptId, params.userId) as any;

  if (!attemptRow) throw new Error('Attempt not found or access forbidden');

  if (attemptRow.status === 'submitted' || attemptRow.status === 'expired') {
    return getListeningAttemptById(params.attemptId, params.userId)!;
  }

  const version = getListeningVersionById(attemptRow.version_id);
  if (!version) throw new Error('Listening test version not found');

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

  const answerRows = db
    .prepare('SELECT * FROM listening_answers WHERE attempt_id = ?')
    .all(params.attemptId) as any[];

  const studentAnswersMap = new Map<number, any>();
  for (const row of answerRows) {
    studentAnswersMap.set(row.question_number, row);
  }

  let totalRawScore = 0;
  const itemResults: AttemptItemResult[] = [];
  const performanceByType: Record<string, { correct: number; total: number }> = {};

  const updateAnswerMark = db.prepare(`
    UPDATE listening_answers
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
        db.prepare(`
          INSERT INTO listening_answers (
            id, attempt_id, question_id, question_number, user_answer_json,
            is_flagged, is_correct, mark, saved_at
          ) VALUES (?, ?, ?, ?, ?, 0, 0, 0, datetime('now'))
        `).run(uuidv4(), params.attemptId, question.id, qNum, JSON.stringify(''));
      }

      totalRawScore += markResult.mark;

      // Group type analytics
      const qTypeStr = group.questionType.replace('listening_', '');
      if (!performanceByType[qTypeStr]) {
        performanceByType[qTypeStr] = { correct: 0, total: 0 };
      }
      performanceByType[qTypeStr].total++;
      if (markResult.isCorrect) {
        performanceByType[qTypeStr].correct++;
      }

      itemResults.push({
        questionId: question.id,
        questionNumber: qNum,
        questionType: group.questionType,
        partNumber: group.partNumber || 1,
        userAnswer: studentAns,
        isCorrect: markResult.isCorrect,
        mark: markResult.mark,
        answerKey: question.answerKey,
        acceptedAlternatives: question.acceptedAlternatives || [],
        explanation: question.explanation,
        transcriptExcerpt: question.transcriptExcerpt,
        audioTimestampSeconds: question.audioTimestampSeconds,
      });
    }

    const finalStatus = params.forceExpired ? 'expired' : 'submitted';
    const estimatedBand = calculateEstimatedListeningBandScore(
      totalRawScore,
      version.totalQuestions
    );

    db.prepare(`
      UPDATE listening_attempts
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

  return getListeningAttemptById(params.attemptId, params.userId)!;
}

export function getListeningAttemptById(attemptId: string, userId: string): ListeningAttempt | null {
  const attemptRow = db
    .prepare('SELECT * FROM listening_attempts WHERE id = ? AND user_id = ?')
    .get(attemptId, userId) as any;

  if (!attemptRow) return null;

  const answerRows = db
    .prepare('SELECT * FROM listening_answers WHERE attempt_id = ?')
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
  let performanceByType: Record<string, { correct: number; total: number }> | undefined = undefined;

  // Answers, transcripts, and explanations ONLY delivered after submission or expiry!
  if (attemptRow.status === 'submitted' || attemptRow.status === 'expired') {
    const version = getListeningVersionById(attemptRow.version_id);
    if (version) {
      const questionMap = new Map<number, { question: QuestionItem; group: QuestionGroup }>();
      for (const g of version.questionGroups) {
        for (const q of g.questions) {
          questionMap.set(q.questionNumber, { question: q, group: g });
        }
      }

      results = [];
      performanceByType = {};

      for (const row of answerRows) {
        const item = questionMap.get(row.question_number);
        if (item) {
          const { question, group } = item;
          const isCorrect = row.is_correct === 1;

          results.push({
            questionId: question.id,
            questionNumber: row.question_number,
            questionType: group.questionType,
            partNumber: group.partNumber || 1,
            userAnswer: JSON.parse(row.user_answer_json),
            isCorrect,
            mark: Number(row.mark || 0),
            answerKey: question.answerKey,
            acceptedAlternatives: question.acceptedAlternatives || [],
            explanation: question.explanation,
            transcriptExcerpt: question.transcriptExcerpt,
            audioTimestampSeconds: question.audioTimestampSeconds,
          });

          const qTypeStr = group.questionType.replace('listening_', '');
          if (!performanceByType[qTypeStr]) {
            performanceByType[qTypeStr] = { correct: 0, total: 0 };
          }
          performanceByType[qTypeStr].total++;
          if (isCorrect) performanceByType[qTypeStr].correct++;
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
    wasInterrupted: attemptRow.was_interrupted === 1,
    interruptionCount: attemptRow.interruption_count,
    replayCount: attemptRow.replay_count,
    interruptionEvents: JSON.parse(attemptRow.interruption_events_json || '[]'),
    answers,
    results,
    performanceByType,
  };
}

export function listUserListeningAttempts(userId: string): ListeningAttempt[] {
  const rows = db
    .prepare('SELECT * FROM listening_attempts WHERE user_id = ? ORDER BY started_at DESC')
    .all(userId) as any[];

  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    testId: r.test_id,
    versionId: r.version_id,
    testTitle: r.test_title,
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
    wasInterrupted: r.was_interrupted === 1,
    interruptionCount: r.interruption_count,
    replayCount: r.replay_count,
    interruptionEvents: JSON.parse(r.interruption_events_json || '[]'),
    answers: {},
  }));
}
