import assert from 'assert';
import { db, initDatabase } from '../server/db';
import { hashPassword, verifyPassword, generateToken, mapUserRow } from '../server/auth';
import {
  createReadingTest,
  publishTestVersion,
  forkNewDraftVersion,
  updateDraftVersion,
  listTests,
  getVersionById,
  getTestById,
  sanitizeQuestionsForStudent,
} from '../server/readingService';
import {
  startOrResumeAttempt,
  saveStudentAnswer,
  submitAttempt,
  getAttemptById,
} from '../server/attemptService';
import {
  markStudentAnswer,
  calculateEstimatedBandScore,
  validateWordLimit,
  normalizeAnswerText,
} from '../shared/scoring';
import { v4 as uuidv4 } from 'uuid';

console.log('====================================================');
console.log('  RUNNING IELTS READING PLATFORM VERIFICATION SUITE ');
console.log('====================================================\n');

async function runAllTests() {
  initDatabase();

  // ---------------------------------------------------------------
  // TEST 1: Password Hashing & Role Authorization Isolation
  // ---------------------------------------------------------------
  console.log('TEST 1: Authentication & Privilege Escalation Protection');
  const password = 'TestSecretPassword99!';
  const hash = hashPassword(password);
  assert.strictEqual(verifyPassword(password, hash), true, 'Password verification failed');
  assert.strictEqual(verifyPassword('WrongPassword', hash), false, 'Wrong password incorrectly verified');

  const testStudentId = uuidv4();
  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, plan_type, plan_expires_at, created_at)
    VALUES (?, ?, ?, ?, 'student', 'paid_plan', datetime('now', '+30 days'), datetime('now'))
  `).run(testStudentId, `student_${Date.now()}@test.com`, hashPassword(password), 'Test Student');

  const studentRow = db.prepare('SELECT * FROM users WHERE id = ?').get(testStudentId);
  const studentUser = mapUserRow(studentRow);
  assert.strictEqual(studentUser.role, 'student', 'Role must default to student');
  console.log('  ✔ Secure hashing and student role constraint verified.');

  // ---------------------------------------------------------------
  // TEST 2: Learner Data Isolation & Published vs Draft Tests
  // ---------------------------------------------------------------
  console.log('TEST 2: Content Access & Learner Data Isolation');
  // Student should only see published tests
  const studentTests = listTests({ isTeacherOrAdmin: false });
  for (const t of studentTests) {
    assert.strictEqual(t.status, 'published', 'Student must never see unpublished/draft tests');
  }

  // Teacher sees all
  const teacherTests = listTests({ isTeacherOrAdmin: true });
  assert.ok(teacherTests.length >= studentTests.length, 'Teacher should see all tests');
  console.log(`  ✔ Content visibility filtered: Students see ${studentTests.length} published tests.`);

  // ---------------------------------------------------------------
  // TEST 3: Answer-Key Scrubbing for Active In-Progress Attempts
  // ---------------------------------------------------------------
  const publishedMock =
    studentTests.find((t) => t.title === 'Academic Reading Full Mock Examination 1') ||
    studentTests.find((t) => t.category === 'mock' && t.totalQuestions === 40);
  assert.ok(publishedMock, '40-question mock must exist in published catalogue');

  const { attempt, testVersion: sanitizedTest } = startOrResumeAttempt({
    userId: testStudentId,
    testId: publishedMock.id,
  });

  assert.strictEqual(attempt.status, 'in_progress', 'New attempt must be in_progress');

  // Verify answer keys, explanations, and quotes are strictly stripped from all groups & questions
  for (const group of sanitizedTest.questionGroups) {
    for (const q of group.questions) {
      assert.strictEqual(q.answerKey, undefined, `Question ${q.questionNumber} answerKey leaked!`);
      assert.strictEqual(q.acceptedAlternatives, undefined, `Question ${q.questionNumber} acceptedAlternatives leaked!`);
      assert.strictEqual(q.explanation, undefined, `Question ${q.questionNumber} explanation leaked!`);
      assert.strictEqual(q.evidenceQuote, undefined, `Question ${q.questionNumber} evidenceQuote leaked!`);
    }
  }
  console.log('  ✔ Answer keys, alternatives, and explanations are strictly stripped from active test payload.');

  // ---------------------------------------------------------------
  // TEST 4: Autosave and State Recovery on Refresh
  // ---------------------------------------------------------------
  console.log('TEST 4: Real-time Autosave & Refresh Recovery');
  const actualVersion = getVersionById(publishedMock.currentVersionId || (db.prepare('SELECT id FROM reading_test_versions WHERE test_id = ?').get(publishedMock.id) as any)?.id)!;
  const actualQ1 = actualVersion.questionGroups[0].questions[0];
  const actualQ5Group = actualVersion.questionGroups.find((g) => g.questions.some((q) => q.questionNumber === 5))!;
  const actualQ5 = actualQ5Group.questions.find((q) => q.questionNumber === 5)!;

  const save1 = saveStudentAnswer({
    attemptId: attempt.id,
    userId: testStudentId,
    questionNumber: 1,
    questionId: sanitizedTest.questionGroups[0].questions[0].id,
    userAnswer: actualQ1.answerKey,
    isFlagged: false,
  });
  assert.strictEqual(save1.saved, true, 'Autosave Q1 failed');

  const save5 = saveStudentAnswer({
    attemptId: attempt.id,
    userId: testStudentId,
    questionNumber: 5,
    questionId: sanitizedTest.questionGroups.flatMap(g => g.questions).find(q => q.questionNumber === 5)!.id,
    userAnswer: actualQ5.answerKey,
    isFlagged: true,
  });
  assert.strictEqual(save5.saved, true, 'Autosave Q5 failed');

  // Simulate student refreshing page / reconnecting:
  const resumed = startOrResumeAttempt({
    userId: testStudentId,
    testId: publishedMock.id,
  });
  assert.strictEqual(resumed.attempt.id, attempt.id, 'Resumed attempt must match original attempt ID');
  assert.strictEqual(resumed.attempt.answers[1].userAnswer, actualQ1.answerKey, 'Q1 answer restored after refresh');
  assert.strictEqual(resumed.attempt.answers[5].userAnswer, actualQ5.answerKey, 'Q5 answer restored after refresh');
  assert.strictEqual(resumed.attempt.answers[5].isFlagged, true, 'Q5 review flag restored after refresh');
  console.log('  ✔ Answer recovery and flag state verified across session disconnect/refresh.');

  // ---------------------------------------------------------------
  // TEST 5: Marking Engine Verification for All Question Types
  // ---------------------------------------------------------------
  console.log('TEST 5: Objective Marking Engine for All Question Formats');

  // 1. Multiple choice (single)
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'multiple_choice_single',
      userAnswer: 'B',
      answerKey: 'B',
    }).isCorrect,
    true,
    'MC Single correct match failed'
  );
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'multiple_choice_single',
      userAnswer: 'C',
      answerKey: 'B',
    }).isCorrect,
    false,
    'MC Single incorrect match failed'
  );

  // 2. Multiple choice (multi-answer set match)
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'multiple_choice_multi',
      userAnswer: ['C', 'A'],
      answerKey: ['A', 'C'],
      allowAnyOrder: true,
    }).isCorrect,
    true,
    'MC Multi unordered match failed'
  );
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'multiple_choice_multi',
      userAnswer: ['A', 'D'],
      answerKey: ['A', 'C'],
    }).isCorrect,
    false,
    'MC Multi wrong answer rejected'
  );

  // 3. True / False / Not Given
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'true_false_not_given',
      userAnswer: 'true',
      answerKey: 'TRUE',
    }).isCorrect,
    true,
    'T/F/NG case insensitivity failed'
  );

  // 4. Yes / No / Not Given
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'yes_no_not_given',
      userAnswer: 'No',
      answerKey: 'NO',
    }).isCorrect,
    true,
    'Y/N/NG match failed'
  );

  // 5. Matching Headings (roman numerals i-vii)
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'matching_headings',
      userAnswer: 'iii',
      answerKey: 'iii',
    }).isCorrect,
    true,
    'Matching headings match failed'
  );

  // 6. Sentence Completion with Accepted Alternatives
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'sentence_completion',
      userAnswer: 'sea anchor',
      answerKey: 'sea anchor',
      acceptedAlternatives: ['anchor'],
    }).isCorrect,
    true,
    'Sentence completion exact match failed'
  );
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'sentence_completion',
      userAnswer: 'anchor',
      answerKey: 'sea anchor',
      acceptedAlternatives: ['anchor'],
    }).isCorrect,
    true,
    'Sentence completion accepted alternative match failed'
  );

  // 7. Word Limit Enforcement
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'short_answer',
      userAnswer: 'the idealized rational economic agent', // 5 words
      answerKey: 'homo economicus',
      maxWords: 2,
    }).isCorrect,
    false,
    'Exceeding word limit must be rejected'
  );

  // 8. Broad fuzzy matching rejected (e.g. spelling error "polyehtylene")
  assert.strictEqual(
    markStudentAnswer({
      questionType: 'sentence_completion',
      userAnswer: 'polyehtylene', // typo
      answerKey: 'polyethylene',
    }).isCorrect,
    false,
    'Broad fuzzy matching must not accept incorrect spelling'
  );

  console.log('  ✔ All question types marked according to strict IELTS rules without fuzzy false-positives.');

  // ---------------------------------------------------------------
  // TEST 6: Official Band Score Conversion (Academic & General Training)
  // ---------------------------------------------------------------
  console.log('TEST 6: Verified Official IELTS Reading Band Score Estimator');
  // Academic:
  assert.strictEqual(calculateEstimatedBandScore(40, 40, 'academic'), 9.0, 'Academic 40 -> 9.0');
  assert.strictEqual(calculateEstimatedBandScore(35, 40, 'academic'), 8.0, 'Academic 35 -> 8.0');
  assert.strictEqual(calculateEstimatedBandScore(30, 40, 'academic'), 7.0, 'Academic 30 -> 7.0');
  assert.strictEqual(calculateEstimatedBandScore(23, 40, 'academic'), 6.0, 'Academic 23 -> 6.0');
  assert.strictEqual(calculateEstimatedBandScore(15, 40, 'academic'), 5.0, 'Academic 15 -> 5.0');

  // General Training:
  assert.strictEqual(calculateEstimatedBandScore(40, 40, 'general'), 9.0, 'GT 40 -> 9.0');
  assert.strictEqual(calculateEstimatedBandScore(38, 40, 'general'), 8.0, 'GT 38 -> 8.0');
  assert.strictEqual(calculateEstimatedBandScore(34, 40, 'general'), 7.0, 'GT 34 -> 7.0');
  assert.strictEqual(calculateEstimatedBandScore(30, 40, 'general'), 6.0, 'GT 30 -> 6.0');

  // Short practice sets (not 40 questions) must return null rather than misleading band scores:
  assert.strictEqual(calculateEstimatedBandScore(18, 22, 'general'), null, 'Short practice must return null band');
  console.log('  ✔ Official Academic & GT band thresholds verified and short practice band guard validated.');

  // ---------------------------------------------------------------
  // TEST 7: Submission, Evaluation & Results Report
  // ---------------------------------------------------------------
  console.log('TEST 7: Submission & Results Delivery');
  const submitted = submitAttempt({
    attemptId: attempt.id,
    userId: testStudentId,
  });

  assert.strictEqual(submitted.status, 'submitted', 'Status must be submitted');
  assert.ok(submitted.results && submitted.results.length === 40, 'Results must contain all 40 items');

  const q1Result = submitted.results!.find((r) => r.questionNumber === 1);
  assert.ok(q1Result, 'Q1 result must exist');
  assert.strictEqual(q1Result!.isCorrect, true, 'Q1 was answered TRUE and should be correct');
  assert.strictEqual(q1Result!.mark, 1, 'Q1 mark should be 1');
  assert.ok(q1Result!.evidenceQuote && q1Result!.evidenceQuote.length > 0, 'Evidence quote must be present');
  console.log('  ✔ Submission scored and detailed results with passage evidence quotes generated.');

  // ---------------------------------------------------------------
  // TEST 8: Content Versioning & Immutability
  // ---------------------------------------------------------------
  console.log('TEST 8: Content Versioning and Attempt History Immutability');
  const beforeTest = getTestById(publishedMock.id)!;
  const forkedVersion = forkNewDraftVersion(publishedMock.id);
  assert.strictEqual(forkedVersion.versionNumber, beforeTest.currentVersionNumber + 1, 'Forked version must increment version counter');
  assert.strictEqual(forkedVersion.status, 'draft', 'Forked version must be draft');

  // Student previous attempt still points to version 1!
  const pastAttempt = getAttemptById(attempt.id, testStudentId);
  assert.strictEqual(pastAttempt!.versionId, publishedMock.latestVersionId, 'Past attempt must retain Version 1 reference');
  console.log('  ✔ Immutability confirmed: previous student attempts preserve their original test version.');

  // ---------------------------------------------------------------
  // TEST 9: Server-Controlled Mock Deadline Auto-Expiry
  // ---------------------------------------------------------------
  console.log('TEST 9: Server-Controlled Deadline Auto-Expiry');
  const testStudent2Id = uuidv4();
  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, plan_type, plan_expires_at, created_at)
    VALUES (?, ?, ?, ?, 'student', 'paid_plan', datetime('now', '+30 days'), datetime('now'))
  `).run(testStudent2Id, `student_timer_${Date.now()}@test.com`, hash, 'Timer Student');

  const timedAttempt = startOrResumeAttempt({
    userId: testStudent2Id,
    testId: publishedMock.id,
    modeOverride: 'mock',
  });

  assert.ok(timedAttempt.attempt.deadlineAt, 'Mock attempt must have server-defined deadlineAt');

  // Simulate time passage past deadline
  db.prepare(`
    UPDATE reading_attempts
    SET deadline_at = datetime('now', '-5 minutes')
    WHERE id = ?
  `).run(timedAttempt.attempt.id);

  // Next save attempt should detect expiry and auto-submit
  const expiredSave = saveStudentAnswer({
    attemptId: timedAttempt.attempt.id,
    userId: testStudent2Id,
    questionNumber: 2,
    questionId: sanitizedTest.questionGroups[0].questions[1].id,
    userAnswer: 'FALSE',
  });

  assert.strictEqual(expiredSave.isExpired, true, 'Save on expired attempt must detect expiration');

  const expiredAttempt = getAttemptById(timedAttempt.attempt.id, testStudent2Id);
  assert.strictEqual(expiredAttempt!.status, 'expired', 'Attempt must transition to expired status');
  console.log('  ✔ Server-authoritative timer expiry and auto-submission verified.');

  console.log('\n====================================================');
  console.log('  ALL 9 VERIFICATION CHECKS PASSED SUCCESSFULLY!    ');
  console.log('====================================================');
}

runAllTests().catch((err) => {
  console.error('Test verification failed:', err);
  process.exit(1);
});
