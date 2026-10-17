import '../server/legacySqliteEnvironment';
import {
  ingestCambridge17ReadingTest3,
  getCambridge17ReadingTest3Data,
} from '../server/ingestCambridge17ReadingTest3';
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

// Official Cambridge 17 Reading Test 3 Answer Key
const OFFICIAL_KEY: Record<number, string | string[]> = {
  // Passage 1: Questions 1-13 (The thylacine)
  1: 'carnivorous',
  2: 'scent',
  3: 'pouch',
  4: 'fossil',
  5: 'habitat',
  6: 'TRUE',
  7: 'FALSE',
  8: 'NOT GIVEN',
  9: 'FALSE',
  10: 'NOT GIVEN',
  11: 'FALSE',
  12: 'TRUE',
  13: 'NOT GIVEN',

  // Passage 2: Questions 14-26 (Palm oil)
  14: 'F',
  15: 'G',
  16: 'A',
  17: 'H',
  18: 'B',
  19: 'E',
  20: 'C',
  21: ['B', 'C'],
  22: ['B', 'C'],
  23: 'solid',
  24: 'orangutan',
  25: 'carbon stocks',
  26: 'biodiversity',

  // Passage 3: Questions 27-40 (Building the Skyline: The Birth and Growth of Manhattan’s Skyscrapers)
  27: 'D',
  28: 'B',
  29: 'C',
  30: 'D',
  31: 'C',
  32: 'NO',
  33: 'YES',
  34: 'NOT GIVEN',
  35: 'NO',
  36: 'H',
  37: 'D',
  38: 'I',
  39: 'B',
  40: 'F',
};

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 17 ACADEMIC READING TEST 3 VERIFICATION ===\n');

  console.log('1. Validating data structure...');
  const testData = getCambridge17ReadingTest3Data();
  assert(testData.title === 'Cambridge IELTS 17 Academic Reading Test 3', 'Title mismatch');
  assert(testData.passages.length === 3, 'Must have exactly 3 passages');
  const totalQCount = testData.questionGroups.reduce((n, g) => n + g.questions.length, 0);
  assert(totalQCount === 40, `Must have exactly 40 questions, found ${totalQCount}`);
  console.log('   ✓ 3 passages and 40 questions correctly structured');

  console.log('\n2. Ingesting into local SQLite database...');
  const result = await ingestCambridge17ReadingTest3();
  assert(result.status === 'published' && result.totalQuestions === 40, 'Ingestion result invalid');
  console.log(`   ✓ Ingested test ID: ${result.testId}, version ID: ${result.versionId}`);

  console.log('\n3. Verifying local SQLite database records...');
  const testRecord = await getTestById(result.testId);
  assert(testRecord !== null, 'Test record must be found in database');
  assert(testRecord!.title === 'Cambridge IELTS 17 Academic Reading Test 3', 'Stored title incorrect');
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
  console.log('   ✓ All 40 questions match the official Cambridge 17 Reading Test 3 answer key');

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

  // Test accepted alternatives (e.g. Q24 'Sumatran orangutan', 'orang-utan')
  const q24 = allQuestions.find((q) => q.questionNumber === 24)!;
  const q24MarkAlt1 = markStudentAnswer({
    questionType: 'sentence_completion',
    userAnswer: 'Sumatran orangutan',
    answerKey: q24.answerKey,
    acceptedAlternatives: q24.acceptedAlternatives,
    maxWords: 2,
  });
  assert(q24MarkAlt1.isCorrect, 'Q24 accepted alternative "Sumatran orangutan" failed to mark as correct');

  const q24MarkAlt2 = markStudentAnswer({
    questionType: 'sentence_completion',
    userAnswer: 'orang-utan',
    answerKey: q24.answerKey,
    acceptedAlternatives: q24.acceptedAlternatives,
    maxWords: 2,
  });
  assert(q24MarkAlt2.isCorrect, 'Q24 accepted alternative "orang-utan" failed to mark as correct');
  console.log('   ✓ Accepted alternatives for Q24 ("Sumatran orangutan", "orang-utan") successfully validated');

  console.log('\n7. Checking public catalogue visibility...');
  const tests = await listTests({ status: 'published', isFreeTier: true });
  const found = tests.find((t) => t.id === result.testId);
  assert(found !== undefined, 'Ingested test not visible in public catalogue');
  console.log(`   ✓ Found in catalogue: "${found!.title}"`);

  console.log('\n>>> ALL 7 TEST SUITES PASSED FOR CAMBRIDGE 17 READING TEST 3! <<<');
}

runTests().catch((err) => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});
