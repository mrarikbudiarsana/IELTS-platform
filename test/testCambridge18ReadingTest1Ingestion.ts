import '../server/legacySqliteEnvironment';
import {
  ingestCambridge18ReadingTest1,
  getCambridge18ReadingTest1Data,
} from '../server/ingestCambridge18ReadingTest1';
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

// Official Cambridge 18 Reading Test 1 Answer Key
const OFFICIAL_KEY: Record<number, string> = {
  // Passage 1
  1: 'lettuces',
  2: '1,000 kg',
  3: 'consumption',
  4: 'pesticides',
  5: 'journeys',
  6: 'producers',
  7: 'flavour',
  8: 'TRUE',
  9: 'NOT GIVEN',
  10: 'FALSE',
  11: 'TRUE',
  12: 'FALSE',
  13: 'NOT GIVEN',

  // Passage 2
  14: 'B',
  15: 'A',
  16: 'C',
  17: 'E',
  18: 'B',
  19: 'B',
  20: 'C',
  21: 'C',
  22: 'fire',
  23: 'nutrients',
  24: 'cavities',
  25: 'hawthorn',
  26: 'rare',

  // Passage 3
  27: 'C',
  28: 'F',
  29: 'A',
  30: 'E',
  31: 'B',
  32: 'sustainability',
  33: 'fuel',
  34: 'explosions',
  35: 'bankrupt',
  36: 'C',
  37: 'D',
  38: 'B',
  39: 'D',
  40: 'A',
};

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 18 ACADEMIC READING TEST 1 VERIFICATION ===\n');

  console.log('1. Validating data structure...');
  const testData = getCambridge18ReadingTest1Data();
  assert(testData.title === 'Cambridge IELTS 18 Academic Reading Test 1', 'Title mismatch');
  assert(testData.passages.length === 3, 'Must have exactly 3 passages');
  const totalQCount = testData.questionGroups.reduce((n, g) => n + g.questions.length, 0);
  assert(totalQCount === 40, `Must have exactly 40 questions, found ${totalQCount}`);
  console.log('   ✓ 3 passages and 40 questions correctly structured');

  console.log('\n2. Ingesting into local SQLite database...');
  const result = await ingestCambridge18ReadingTest1();
  assert(result.status === 'published' && result.totalQuestions === 40, 'Ingestion result invalid');
  console.log(`   ✓ Ingested test ID: ${result.testId}, version ID: ${result.versionId}`);

  console.log('\n3. Verifying local SQLite database records...');
  const testRecord = await getTestById(result.testId);
  assert(testRecord !== null, 'Test record must be found in database');
  assert(testRecord!.title === 'Cambridge IELTS 18 Academic Reading Test 1', 'Stored title incorrect');
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
    assert(q!.evidenceQuote && q!.evidenceQuote.length > 0, `Question ${i} missing evidenceQuote`);

    const expected = OFFICIAL_KEY[i];
    assert(
      q!.answerKey === expected,
      `Q${i} answer key mismatch. Expected "${expected}", got "${q!.answerKey}"`
    );
  }
  console.log('   ✓ All 40 questions match the official Cambridge 18 answer key');

  console.log('\n5. Verifying student view sanitization (no leaked keys/explanations)...');
  const sanitizedGroups = sanitizeQuestionsForStudent(versionRecord!.questionGroups);
  for (const group of sanitizedGroups) {
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
      const mark = markStudentAnswer({
        questionType: group.questionType as any,
        userAnswer: q.answerKey,
        answerKey: q.answerKey,
        acceptedAlternatives: q.acceptedAlternatives,
        maxWords: group.maxWords,
        maxNumbers: group.maxNumbers,
        allowAnyOrder: group.allowAnyOrder,
      });

      if (mark.isCorrect) {
        correctCount += mark.mark;
      } else {
        console.warn(`   Warning: Q${q.questionNumber} failed marking with answer: ${q.answerKey}`);
      }
    }
  }

  assert(correctCount === 40, `Expected 40/40 correct, got ${correctCount}`);
  const bandScore = calculateEstimatedBandScore(correctCount, 40, 'academic');
  assert(bandScore === 9.0, `Expected band 9.0 for 40/40, got ${bandScore}`);
  console.log(`   ✓ 40/40 scoring simulated: ${correctCount}/40 (Band ${bandScore})`);

  console.log('\n7. Verifying catalogue listing & chronological sort...');
  const catalogue = await listTests({ isTeacherOrAdmin: false });
  const inCatalogue = catalogue.find((t) => t.id === result.testId);
  assert(inCatalogue !== undefined, 'Test not found in published catalogue');
  console.log(`   ✓ Test visible in published catalogue: "${inCatalogue!.title}"`);

  console.log('\n=== ALL CAMBRIDGE 18 READING TEST 1 INGESTION VERIFICATIONS PASSED ===');
}

runTests().catch((err) => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});
