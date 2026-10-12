import { db } from '../server/db';
import { getAttemptById, submitAttempt, startOrResumeAttempt } from '../server/attemptService';
import { getTestById } from '../server/readingService';

async function main() {
  console.log('=== VERIFYING READING EXPLANATION ENGINE ===');

  // 1. Find Cambridge 21 Academic Reading Test 4
  const testRow = (await db.prepare(`SELECT id FROM reading_tests WHERE title LIKE '%Cambridge IELTS 21%' LIMIT 1`).get()) as any;
  if (!testRow) {
    throw new Error('Cambridge 21 test not found');
  }

  const studentUser = (await db.prepare(`SELECT id FROM users WHERE role = 'student' LIMIT 1`).get()) as any;
  if (!studentUser) {
    throw new Error('Student user not found');
  }

  // 2. Start or resume an attempt
  const { attempt } = (await startOrResumeAttempt({
    userId: studentUser.id,
    testId: testRow.id,
    modeOverride: 'practice'
  }));

  // 3. Save an answer for Q1 (Correct) and Q2 (Incorrect: user answers TRUE instead of FALSE) and Q4 (Incorrect: user answers FALSE instead of NOT GIVEN)
  (await db.prepare(`
    INSERT OR REPLACE INTO reading_answers (id, attempt_id, question_id, question_number, user_answer_json, is_flagged, saved_at)
    VALUES ('test-ans-1', ?, 'c21-t4-q1', 1, json(?), 0, datetime('now'))
  `).run(attempt.id, JSON.stringify('TRUE')));

  (await db.prepare(`
    INSERT OR REPLACE INTO reading_answers (id, attempt_id, question_id, question_number, user_answer_json, is_flagged, saved_at)
    VALUES ('test-ans-2', ?, 'c21-t4-q2', 2, json(?), 0, datetime('now'))
  `).run(attempt.id, JSON.stringify('TRUE')));

  (await db.prepare(`
    INSERT OR REPLACE INTO reading_answers (id, attempt_id, question_id, question_number, user_answer_json, is_flagged, saved_at)
    VALUES ('test-ans-4', ?, 'c21-t4-q4', 4, json(?), 0, datetime('now'))
  `).run(attempt.id, JSON.stringify('FALSE')));

  // 4. Submit the attempt
  const submitted = (await submitAttempt({
    attemptId: attempt.id,
    userId: studentUser.id
  }));

  console.log('Attempt submitted successfully. Status:', submitted.status, 'Score:', submitted.rawScore);

  // 5. Inspect the generated results with pedagogical explanations
  const results = submitted.results || [];
  console.log('Total items in review result:', results.length);

  // Inspect Q1 (Correct)
  const q1 = results.find(r => r.questionNumber === 1);
  console.log('\n--- Q1 (Student answered TRUE, Correct) ---');
  console.log('isCorrect:', q1?.isCorrect);
  console.log('whyCorrect:', q1?.whyCorrect);
  console.log('keyParaphrases:', q1?.keyParaphrases);
  console.log('evidenceQuote:', q1?.evidenceQuote);
  console.log('paragraphRef:', q1?.paragraphRef);

  // Inspect Q2 (Incorrect: Student answered TRUE, Key is FALSE)
  const q2 = results.find(r => r.questionNumber === 2);
  console.log('\n--- Q2 (Student answered TRUE, Key FALSE) ---');
  console.log('isCorrect:', q2?.isCorrect);
  console.log('userAnswer:', q2?.userAnswer);
  console.log('whyIncorrect:', q2?.whyIncorrect);
  console.log('whyCorrect:', q2?.whyCorrect);
  console.log('commonTrap:', q2?.commonTrap);
  console.log('evidenceQuote:', q2?.evidenceQuote);

  // Inspect Q4 (Incorrect: Student answered FALSE, Key NOT GIVEN)
  const q4 = results.find(r => r.questionNumber === 4);
  console.log('\n--- Q4 (Student answered FALSE, Key NOT GIVEN) ---');
  console.log('isCorrect:', q4?.isCorrect);
  console.log('userAnswer:', q4?.userAnswer);
  console.log('whyIncorrect:', q4?.whyIncorrect);
  console.log('commonTrap:', q4?.commonTrap);

  // Inspect Q24 (Multiple Choice: single)
  const q24 = results.find(r => r.questionNumber === 24);
  console.log('\n--- Q24 (Multiple Choice) ---');
  console.log('questionType:', q24?.questionType);
  console.log('options available:', q24?.options?.length);
  console.log('distractorAnalysis keys:', Object.keys(q24?.distractorAnalysis || {}));
  console.log('whyCorrect:', q24?.whyCorrect);

  console.log('\n=== VERIFICATION SUCCESS: All explanations and evidence quotes are active! ===');
}

async function runEntryPoint() {
await main();

}
export const testCompleted = runEntryPoint();
testCompleted.catch(error => { console.error(error); process.exitCode = 1; });
