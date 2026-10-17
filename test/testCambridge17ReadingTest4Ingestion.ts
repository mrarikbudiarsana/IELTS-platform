import '../server/legacySqliteEnvironment';
import {
  ingestCambridge17ReadingTest4,
  getCambridge17ReadingTest4Data,
} from '../server/ingestCambridge17ReadingTest4';
import {
  getTestById,
  getVersionById,
  listTests,
  sanitizeQuestionsForStudent,
} from '../server/readingService';
import { markStudentAnswer, calculateEstimatedBandScore } from '../shared/scoring';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

// Official Cambridge 17 Reading Test 4 Answer Key
const OFFICIAL_KEY: Record<number, string | string[]> = {
  // Passage 1: Questions 1-13 (Bats to the rescue)
  1: 'FALSE',
  2: 'FALSE',
  3: 'NOT GIVEN',
  4: 'TRUE',
  5: 'NOT GIVEN',
  6: 'TRUE',
  7: 'droppings',
  8: 'coffee',
  9: 'mosquitoes',
  10: 'protein',
  11: 'unclean',
  12: 'culture',
  13: 'houses',

  // Passage 2: Questions 14-26 (Does education fuel economic growth?)
  14: 'E',
  15: 'A',
  16: 'D',
  17: 'F',
  18: 'C',
  19: 'descendants',
  20: 'sermon',
  21: 'fine',
  22: 'innovation',
  23: ['B', 'E'],
  24: ['B', 'E'],
  25: ['B', 'D'],
  26: ['B', 'D'],

  // Passage 3: Questions 27-40 (Timur Gareyev – blindfold chess champion)
  27: 'D',
  28: 'E',
  29: 'F',
  30: 'B',
  31: 'H',
  32: 'E',
  33: 'FALSE',
  34: 'NOT GIVEN',
  35: 'NOT GIVEN',
  36: 'TRUE',
  37: 'memory',
  38: 'numbers',
  39: 'communication',
  40: 'visual',
};

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 17 ACADEMIC READING TEST 4 VERIFICATION ===\n');

  console.log('1. Validating data structure...');
  const testData = getCambridge17ReadingTest4Data();
  assert(testData.title === 'Cambridge IELTS 17 Academic Reading Test 4', 'Title mismatch');
  assert(testData.passages.length === 3, 'Must have exactly 3 passages');
  const totalQCount = testData.questionGroups.reduce((n, g) => n + g.questions.length, 0);
  assert(totalQCount === 40, `Must have exactly 40 questions, found ${totalQCount}`);
  console.log('   ✓ 3 passages and 40 questions correctly structured');

  console.log('\n2. Ingesting into local SQLite database...');
  const result = await ingestCambridge17ReadingTest4();
  assert(result.status === 'published' && result.totalQuestions === 40, 'Ingestion result invalid');
  console.log(`   ✓ Ingested test ID: ${result.testId}, version ID: ${result.versionId}`);

  console.log('\n3. Verifying local SQLite database records...');
  const testRecord = await getTestById(result.testId);
  assert(testRecord !== null, 'Test record must be found in database');
  assert(testRecord!.title === 'Cambridge IELTS 17 Academic Reading Test 4', 'Stored title incorrect');
  assert(testRecord!.status === 'published', 'Test status must be published');
  assert(testRecord!.isFreeTier === true, 'Test must be marked as free tier');

  const versionRecord = await getVersionById(result.versionId);
  assert(versionRecord !== null, 'Version record must be found');
  assert(versionRecord!.passages.length === 3, 'Must have 3 passages');
  assert(versionRecord!.totalQuestions === 40, 'Total questions must be 40');
  console.log('   ✓ SQLite records successfully verified');

  console.log('\n4. Verifying all 40 questions and answer keys...');
  const allQuestions = versionRecord!.questionGroups.flatMap((g) => g.questions);
  assert(allQuestions.length === 40, `Expected 40 questions, got ${allQuestions.length}`);

  for (let i = 1; i <= 40; i++) {
    const q = allQuestions.find((item) => item.questionNumber === i);
    assert(q !== undefined, `Question ${i} missing from test version`);
    assert(q!.explanation && q!.explanation.length > 0, `Question ${i} missing explanation`);

    const expected = OFFICIAL_KEY[i];
    if (Array.isArray(expected)) {
      assert(
        Array.isArray(q!.answerKey) &&
          q!.answerKey.length === expected.length &&
          expected.every((ans) => (q!.answerKey as string[]).includes(ans)),
        `Q${i} answer key mismatch. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(q!.answerKey)}`
      );
    } else {
      assert(
        q!.answerKey === expected,
        `Q${i} answer key mismatch. Expected "${expected}", got "${q!.answerKey}"`
      );
    }
  }
  console.log('   ✓ All 40 questions match the official Cambridge 17 Reading Test 4 answer key');

  console.log('\n5. Verifying student view sanitization (no leaked keys/explanations)...');
  const sanitized = sanitizeQuestionsForStudent(versionRecord!.questionGroups);
  for (const group of sanitized) {
    for (const q of group.questions) {
      assert((q as any).answerKey === undefined, `Q${q.questionNumber} leaked answerKey`);
      assert((q as any).acceptedAlternatives === undefined, `Q${q.questionNumber} leaked acceptedAlternatives`);
      assert((q as any).explanation === undefined, `Q${q.questionNumber} leaked explanation`);
      assert((q as any).evidenceQuote === undefined, `Q${q.questionNumber} leaked evidenceQuote`);
    }
  }
  console.log('   ✓ Student payload completely sanitized');

  console.log('\n6. Testing student answer marking & band score calculation...');
  let correctCount = 0;
  for (const group of versionRecord!.questionGroups) {
    for (const q of group.questions) {
      const studentAnswer = Array.isArray(q.answerKey) ? q.answerKey[0] : q.answerKey;
      const mark = markStudentAnswer({
        questionType: group.questionType as any,
        userAnswer: studentAnswer,
        answerKey: q.answerKey,
        acceptedAlternatives: q.acceptedAlternatives,
        maxWords: group.maxWords,
        maxNumbers: group.maxNumbers,
        allowAnyOrder: group.allowAnyOrder,
      });

      if (mark.isCorrect) {
        correctCount += mark.mark;
      } else {
        console.warn(`   Warning: Q${q.questionNumber} failed marking with answer: ${studentAnswer}`);
      }
    }
  }

  assert(correctCount === 40, `Expected 40/40 correct, got ${correctCount}`);
  const bandScore = calculateEstimatedBandScore(correctCount, 40, 'academic');
  assert(bandScore === 9.0, `Expected Band 9.0 for 40/40, got Band ${bandScore}`);
  console.log(`   ✓ 40/40 correctly evaluated to Band ${bandScore}`);

  // Test accepted alternatives (e.g. Q9 'mosquitos', Q13 'bat houses')
  const q9 = allQuestions.find((q) => q.questionNumber === 9)!;
  const q9MarkAlt = markStudentAnswer({
    questionType: 'table_completion',
    userAnswer: 'mosquitos',
    answerKey: q9.answerKey,
    acceptedAlternatives: q9.acceptedAlternatives,
    maxWords: 1,
  });
  assert(q9MarkAlt.isCorrect, 'Q9 accepted alternative "mosquitos" failed to mark as correct');

  console.log('   ✓ Accepted alternative for Q9 ("mosquitos") successfully validated');

  console.log('\n7. Checking public catalogue visibility...');
  const tests = await listTests({ status: 'published', isFreeTier: true });
  const found = tests.find((t) => t.id === result.testId);
  assert(found !== undefined, 'Ingested test not visible in public catalogue');
  console.log(`   ✓ Found in catalogue: "${found!.title}"`);

  console.log('\n>>> ALL 7 TEST SUITES PASSED FOR CAMBRIDGE 17 READING TEST 4! <<<');
}

runTests().catch((err) => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});
