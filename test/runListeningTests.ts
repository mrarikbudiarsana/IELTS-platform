import assert from 'assert';
import { db, initDatabase } from '../server/db';
import { hashPassword, verifyPassword, mapUserRow } from '../server/auth';
import {
  createListeningTest,
  publishListeningTestVersion,
  forkNewListeningDraftVersion,
  listListeningTests,
  getListeningVersionById,
  getListeningTestById,
  sanitizeListeningForStudent,
} from '../server/listeningService';
import {
  startOrResumeListeningAttempt,
  saveListeningAnswer,
  recordListeningInterruption,
  submitListeningAttempt,
  getListeningAttemptById,
} from '../server/listeningAttemptService';
import {
  markStudentAnswer,
  calculateEstimatedListeningBandScore,
  validateWordLimit,
} from '../shared/scoring';
import { v4 as uuidv4 } from 'uuid';

import { seedListeningDatabase } from '../server/listeningSeed';

console.log('======================================================');
console.log('  RUNNING IELTS LISTENING PLATFORM VERIFICATION SUITE ');
console.log('======================================================\n');

async function runListeningTests() {
  initDatabase();
  seedListeningDatabase();

  // ---------------------------------------------------------------
  // TEST 1: User & Learner Isolation for Listening
  // ---------------------------------------------------------------
  console.log('TEST 1: Listening Catalogue Access & Role Isolation');
  const studentTests = listListeningTests({ isTeacherOrAdmin: false });
  for (const t of studentTests) {
    assert.strictEqual(t.status, 'published', 'Student must only see published listening tests');
  }
  const teacherTests = listListeningTests({ isTeacherOrAdmin: true });
  assert.ok(teacherTests.length >= studentTests.length, 'Teacher sees drafts and published');
  console.log(`  ✔ Content visibility filtered: Students see ${studentTests.length} published listening tests.`);

  // Find 40-question listening mock
  const publishedMock = studentTests.find((t) => t.category === 'mock' && t.totalQuestions === 40);
  assert.ok(publishedMock, '40-question Listening mock must exist');

  // ---------------------------------------------------------------
  // TEST 2: Answer Keys, Transcripts & Timestamps Scrubbing
  // ---------------------------------------------------------------
  console.log('TEST 2: Answer-Key & Transcript Protection During In-Progress Attempts');
  const testStudentId = uuidv4();
  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, created_at)
    VALUES (?, ?, ?, ?, 'student', datetime('now'))
  `).run(testStudentId, `listen_student_${Date.now()}@test.com`, hashPassword('Pass123!'), 'Listening Student');

  const { attempt, testVersion: sanitizedTest } = startOrResumeListeningAttempt({
    userId: testStudentId,
    testId: publishedMock.id,
    modeOverride: 'mock',
  });

  assert.strictEqual(attempt.status, 'in_progress', 'Attempt must be in_progress');

  // Check all parts for transcript scrubbing
  for (const part of sanitizedTest.parts) {
    assert.strictEqual(part.transcript, undefined, `Part ${part.partNumber} transcript leaked!`);
    assert.strictEqual(part.transcriptTimestamps, undefined, `Part ${part.partNumber} transcriptTimestamps leaked!`);
  }

  // Check all question groups for answerKey scrubbing
  for (const group of sanitizedTest.questionGroups) {
    for (const q of group.questions) {
      assert.strictEqual(q.answerKey, undefined, `Q${q.questionNumber} answerKey leaked!`);
      assert.strictEqual(q.acceptedAlternatives, undefined, `Q${q.questionNumber} acceptedAlternatives leaked!`);
      assert.strictEqual(q.explanation, undefined, `Q${q.questionNumber} explanation leaked!`);
      assert.strictEqual(q.transcriptExcerpt, undefined, `Q${q.questionNumber} transcriptExcerpt leaked!`);
      assert.strictEqual(q.audioTimestampSeconds, undefined, `Q${q.questionNumber} audioTimestampSeconds leaked!`);
    }
  }
  console.log('  ✔ All answer keys, explanations, transcripts, and timestamps are strictly scrubbed from active attempt.');

  // ---------------------------------------------------------------
  // TEST 3: Marking Engine for All 11 Listening Question Formats
  // ---------------------------------------------------------------
  console.log('TEST 3: Objective Marking Engine for All 11 Listening Formats');

  // 1. Form Completion (Name spelling exact match)
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'form_completion',
      userAnswer: 'Campbell',
      answerKey: 'Campbell',
    }).isCorrect,
    true,
    'Form completion exact name match failed'
  );

  // 2. Form Completion with Accepted Alternatives (Date variations)
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'form_completion',
      userAnswer: '14 October',
      answerKey: '14th October',
      acceptedAlternatives: ['14 October', 'October 14'],
    }).isCorrect,
    true,
    'Accepted alternative date match failed'
  );

  // 3. Plan, Map, and Diagram Labelling (Letter A-G)
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'plan_map_diagram_labelling',
      userAnswer: 'a',
      answerKey: 'A',
    }).isCorrect,
    true,
    'Map labelling letter match failed'
  );

  // 4. Multiple Choice Single
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'listening_multiple_choice_single',
      userAnswer: 'B',
      answerKey: 'B',
    }).isCorrect,
    true,
    'MC Single match failed'
  );

  // 5. Multiple Choice Multi-Select (Unordered set match)
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'listening_multiple_choice_multi',
      userAnswer: ['D', 'B'],
      answerKey: ['B', 'D'],
      allowAnyOrder: true,
    }).isCorrect,
    true,
    'MC Multi unordered match failed'
  );

  // 6. Matching
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'matching',
      userAnswer: 'C',
      answerKey: 'C',
    }).isCorrect,
    true,
    'Matching format match failed'
  );

  // 7. Table Completion
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'table_completion',
      userAnswer: 'baby seat',
      answerKey: 'baby seat',
      acceptedAlternatives: ['infant seat'],
    }).isCorrect,
    true,
    'Table completion match failed'
  );

  // 8. Flow-Chart Completion
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'flow_chart_completion',
      userAnswer: 'water-flow meter',
      answerKey: 'water-flow meter',
      acceptedAlternatives: ['water flow meter'],
    }).isCorrect,
    true,
    'Flow-chart completion match failed'
  );

  // 9. Note Completion with Word Limit
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'note_completion',
      userAnswer: 'subterranean',
      answerKey: 'subterranean',
      maxWords: 1,
    }).isCorrect,
    true,
    'Note completion 1-word limit match failed'
  );
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'note_completion',
      userAnswer: 'deep subterranean rock', // 3 words
      answerKey: 'subterranean',
      maxWords: 1,
    }).isCorrect,
    false,
    'Note completion exceeding word limit must be rejected'
  );

  // 10. Summary Completion
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'summary_completion',
      userAnswer: 'combustion',
      answerKey: 'combustion',
    }).isCorrect,
    true,
    'Summary completion match failed'
  );

  // 11. Short Answer Questions
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'short_answer',
      userAnswer: 'groundwater aquifers',
      answerKey: 'groundwater aquifers',
      acceptedAlternatives: ['groundwater'],
    }).isCorrect,
    true,
    'Short answer match failed'
  );

  // Rejection of broad fuzzy matching (spelling mistakes)
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'short_answer',
      userAnswer: 'polyethilene', // misspelling
      answerKey: 'polyethylene',
    }).isCorrect,
    false,
    'Fuzzy matching must reject misspelled words'
  );

  console.log('  ✔ All 11 Listening question formats marked correctly with strict IELTS rules.');

  // ---------------------------------------------------------------
  // TEST 4: Official IELTS Listening Band Score Estimator
  // ---------------------------------------------------------------
  console.log('TEST 4: Official IELTS Listening Band Score Calibration');
  assert.strictEqual(calculateEstimatedListeningBandScore(40, 40), 9.0, 'Listening 40 -> 9.0');
  assert.strictEqual(calculateEstimatedListeningBandScore(37, 40), 8.5, 'Listening 37 -> 8.5');
  assert.strictEqual(calculateEstimatedListeningBandScore(35, 40), 8.0, 'Listening 35 -> 8.0');
  assert.strictEqual(calculateEstimatedListeningBandScore(30, 40), 7.0, 'Listening 30 -> 7.0');
  assert.strictEqual(calculateEstimatedListeningBandScore(23, 40), 6.0, 'Listening 23 -> 6.0');
  assert.strictEqual(calculateEstimatedListeningBandScore(16, 40), 5.0, 'Listening 16 -> 5.0');
  // Short practice returns null:
  assert.strictEqual(calculateEstimatedListeningBandScore(8, 10), null, 'Short practice must return null band');
  console.log('  ✔ Official Listening 0-40 band thresholds and practice guards validated.');

  // ---------------------------------------------------------------
  // TEST 5: Autosave & State Recovery on Refresh
  // ---------------------------------------------------------------
  console.log('TEST 5: Real-time Autosave & State Recovery');
  saveListeningAnswer({
    attemptId: attempt.id,
    userId: testStudentId,
    questionNumber: 1,
    questionId: sanitizedTest.questionGroups[0].questions[0].id,
    userAnswer: 'Campbell',
    isFlagged: false,
  });

  saveListeningAnswer({
    attemptId: attempt.id,
    userId: testStudentId,
    questionNumber: 11,
    questionId: sanitizedTest.questionGroups[2].questions[0].id,
    userAnswer: 'A',
    isFlagged: true,
  });

  // Reconnect / resume
  const resumed = startOrResumeListeningAttempt({
    userId: testStudentId,
    testId: publishedMock.id,
    isReconnection: true,
  });

  assert.strictEqual(resumed.attempt.id, attempt.id, 'Resumed attempt must match ID');
  assert.strictEqual(resumed.attempt.answers[1].userAnswer, 'Campbell', 'Q1 restored');
  assert.strictEqual(resumed.attempt.answers[11].userAnswer, 'A', 'Q11 restored');
  assert.strictEqual(resumed.attempt.answers[11].isFlagged, true, 'Q11 flag restored');
  console.log('  ✔ Answers and flag state restored seamlessly upon session reload.');

  // ---------------------------------------------------------------
  // TEST 6: Audio Interruption Policy & Replay Tracking
  // ---------------------------------------------------------------
  console.log('TEST 6: Audio Interruption and Recovery Tracking Policy');
  assert.strictEqual(resumed.attempt.wasInterrupted, true, 'Reload must mark wasInterrupted = true');
  assert.ok(resumed.attempt.interruptionCount >= 1, 'Interruption count must increment');

  // Record an audio playback error event
  recordListeningInterruption({
    attemptId: attempt.id,
    userId: testStudentId,
    type: 'audio_error',
    detail: 'Audio playback stalled due to packet drop; recovery initiated',
    didReplay: true,
  });

  const interruptedAttempt = getListeningAttemptById(attempt.id, testStudentId)!;
  assert.strictEqual(interruptedAttempt.wasInterrupted, true);
  assert.strictEqual(interruptedAttempt.replayCount, 1, 'Replay count tracked');
  assert.ok(interruptedAttempt.interruptionEvents.length >= 2, 'Events logged with detail');
  console.log('  ✔ Audio interruptions and permitted replays tracked in auditable event log.');

  // ---------------------------------------------------------------
  // TEST 7: Submission & Results Analytics with Transcript Excerpts
  // ---------------------------------------------------------------
  console.log('TEST 7: Submission & Performance by Question Type');
  const submitted = submitListeningAttempt({
    attemptId: attempt.id,
    userId: testStudentId,
  });

  assert.strictEqual(submitted.status, 'submitted');
  assert.ok(submitted.results && submitted.results.length === 40, 'All 40 results returned');

  const q1 = submitted.results!.find((r) => r.questionNumber === 1)!;
  assert.strictEqual(q1.isCorrect, true);
  assert.strictEqual(q1.transcriptExcerpt, 'Yes, it is Campbell, that is C-A-M-P-B-E-L-L.');
  assert.strictEqual(q1.audioTimestampSeconds, 15);

  assert.ok(submitted.performanceByType, 'performanceByType breakdown must exist');
  console.log('  ✔ Submission evaluated, transcript excerpts linked, and question type breakdown computed.');

  // ---------------------------------------------------------------
  // TEST 8: Versioning Immutability
  // ---------------------------------------------------------------
  console.log('TEST 8: Listening Content Versioning Immutability');
  const beforeTest = getListeningTestById(publishedMock.id)!;
  const forked = forkNewListeningDraftVersion(publishedMock.id);
  assert.strictEqual(forked.versionNumber, beforeTest.currentVersionNumber + 1);
  assert.strictEqual(forked.status, 'draft');

  const pastAttempt = getListeningAttemptById(attempt.id, testStudentId)!;
  assert.strictEqual(pastAttempt.versionId, publishedMock.latestVersionId, 'Past attempt preserves original version');
  console.log('  ✔ Published listening tests remain immutable; new drafts preserve attempt histories.');

  console.log('\n======================================================');
  console.log('  ALL LISTENING VERIFICATION CHECKS PASSED (100%)!   ');
  console.log('======================================================\n');
}

runListeningTests().catch((err) => {
  console.error('Listening verification failed:', err);
  process.exit(1);
});
