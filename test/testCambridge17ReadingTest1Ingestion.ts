import '../server/legacySqliteEnvironment';
import {
  ingestCambridge17ReadingTest1,
  getCambridge17ReadingTest1Data,
} from '../server/ingestCambridge17ReadingTest1';
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

// Official Cambridge 17 Reading Test 1 Answer Key
const OFFICIAL_KEY: Record<number, string | string[]> = {
  // Passage 1: Questions 1-13
  1: 'population',
  2: 'suburbs',
  3: 'businessmen',
  4: 'funding',
  5: 'press',
  6: 'soil',
  7: 'FALSE',
  8: 'NOT GIVEN',
  9: 'TRUE',
  10: 'TRUE',
  11: 'FALSE',
  12: 'FALSE',
  13: 'NOT GIVEN',

  // Passage 2: Questions 14-26
  14: 'A',
  15: 'F',
  16: 'E',
  17: 'D',
  18: 'fortress',
  19: 'bullfights',
  20: 'opera',
  21: 'salt',
  22: 'shops',
  23: ['C', 'D'],
  24: ['C', 'D'],
  25: ['B', 'E'],
  26: ['B', 'E'],

  // Passage 3: Questions 27-40
  27: 'H',
  28: 'J',
  29: 'F',
  30: 'B',
  31: 'D',
  32: 'NOT GIVEN',
  33: 'NO',
  34: 'NO',
  35: 'YES',
  36: 'B',
  37: 'C',
  38: 'A',
  39: 'B',
  40: 'D',
};

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 17 ACADEMIC READING TEST 1 VERIFICATION ===\n');

  console.log('1. Validating data structure...');
  const testData = getCambridge17ReadingTest1Data();
  assert(testData.title === 'Cambridge IELTS 17 Academic Reading Test 1', 'Title mismatch');
  assert(testData.passages.length === 3, 'Must have exactly 3 passages');
  const totalQCount = testData.questionGroups.reduce((n, g) => n + g.questions.length, 0);
  assert(totalQCount === 40, `Must have exactly 40 questions, found ${totalQCount}`);
  console.log('   ✓ 3 passages and 40 questions correctly structured');

  console.log('\n2. Ingesting into local SQLite database...');
  const result = await ingestCambridge17ReadingTest1();
  assert(result.status === 'published' && result.totalQuestions === 40, 'Ingestion result invalid');
  console.log(`   ✓ Ingested test ID: ${result.testId}, version ID: ${result.versionId}`);

  console.log('\n3. Verifying local SQLite database records...');
  const testRecord = await getTestById(result.testId);
  assert(testRecord !== null, 'Test record must be found in database');
  assert(testRecord!.title === 'Cambridge IELTS 17 Academic Reading Test 1', 'Stored title incorrect');
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
  console.log('   ✓ All 40 questions match the official Cambridge 17 Reading Test 1 answer key');

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
  assert(bandScore === 9.0, `Expected band 9.0 for 40/40, got ${bandScore}`);
  console.log(`   ✓ 40/40 scoring simulated: ${correctCount}/40 (Band ${bandScore})`);

  console.log('\n7. Verifying catalogue listing & searchability...');
  const catalogue = await listTests({ isTeacherOrAdmin: false });
  const inCatalogue = catalogue.find((t) => t.id === result.testId);
  assert(inCatalogue !== undefined, 'Test not found in published catalogue');
  console.log(`   ✓ Test visible in published catalogue: "${inCatalogue!.title}"`);

  console.log('\n=== ALL CAMBRIDGE 17 READING TEST 1 INGESTION VERIFICATIONS PASSED ===');
}

runTests().catch((err) => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});
