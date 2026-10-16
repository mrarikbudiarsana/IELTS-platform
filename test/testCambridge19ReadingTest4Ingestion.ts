import {
  ingestCambridge19ReadingTest4,
  getCambridge19ReadingTest4Data,
} from '../server/ingestCambridge19ReadingTest4';
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

// Official answer key from Cambridge IELTS 19 Academic Reading Test 4
const OFFICIAL_KEY: Record<number, string> = {
  // Passage 1: Questions 1–13
  1: 'FALSE',
  2: 'TRUE',
  3: 'FALSE',
  4: 'NOT GIVEN',
  5: 'FALSE',
  6: 'TRUE',
  7: 'colonies',
  8: 'spring',
  9: 'endangered',
  10: 'habitats',
  11: 'Europe',
  12: 'southern',
  13: 'diet',

  // Passage 2: Questions 14–26
  14: 'C',
  15: 'F',
  16: 'E',
  17: 'D',
  18: 'D',
  19: 'B',
  20: 'A',
  21: 'E',
  22: 'B',
  23: 'C',
  24: 'waste',
  25: 'machinery',
  26: 'caution',

  // Passage 3: Questions 27–40
  27: 'C',
  28: 'C',
  29: 'B',
  30: 'A',
  31: 'egalitarianism',
  32: 'status',
  33: 'hunting',
  34: 'domineering',
  35: 'autonomy',
  36: 'NOT GIVEN',
  37: 'NO',
  38: 'YES',
  39: 'NOT GIVEN',
  40: 'NO',
};

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 19 ACADEMIC READING TEST 4 VERIFICATION ===\n');

  console.log('1. Validating data structure...');
  const testData = getCambridge19ReadingTest4Data();
  assert(testData.title === 'Cambridge IELTS 19 Academic Reading Test 4', 'Title mismatch');
  assert(testData.passages.length === 3, 'Must have exactly 3 passages');
  const totalQCount = testData.questionGroups.reduce((n, g) => n + g.questions.length, 0);
  assert(totalQCount === 40, `Must have exactly 40 questions, found ${totalQCount}`);
  console.log('   ✓ 3 passages and 40 questions correctly structured');

  console.log('\n2. Ingesting into local SQLite database...');
  const result = await ingestCambridge19ReadingTest4();
  assert(result.status === 'published' && result.totalQuestions === 40, 'Ingestion result invalid');
  console.log(`   ✓ Ingested test ID: ${result.testId}, version ID: ${result.versionId}`);

  console.log('\n3. Verifying local SQLite database records...');
  const testRecord = await getTestById(result.testId);
  assert(
    testRecord && testRecord.title === 'Cambridge IELTS 19 Academic Reading Test 4',
    'Test record missing'
  );
  assert(
    testRecord!.isFreeTier === true && testRecord!.status === 'published',
    'Test should be published and free tier'
  );
  const versionRecord = await getVersionById(result.versionId);
  assert(versionRecord && versionRecord.passages.length === 3, 'Version must have 3 passages');
  assert(versionRecord!.questionGroups.length === 8, 'Must have 8 question groups');
  assert(versionRecord!.totalQuestions === 40, 'Total questions must be 40');
  console.log('   ✓ Database records verified');

  console.log('\n4. Verifying all 40 answer keys against official Cambridge key...');
  const allQuestions = versionRecord!.questionGroups.flatMap((g) => g.questions);
  for (let i = 1; i <= 40; i++) {
    const q = allQuestions.find((item) => item.questionNumber === i);
    assert(q !== undefined, `Question ${i} must exist`);
    assert(q!.explanation && q!.explanation.length > 0, `Question ${i} must have explanation`);
    // Check main answerKey or acceptedAlternatives contains the official answer
    const keyMatches =
      q!.answerKey === OFFICIAL_KEY[i] ||
      (q!.acceptedAlternatives && q!.acceptedAlternatives.includes(OFFICIAL_KEY[i]));
    assert(
      keyMatches,
      `Q${i}: expected ${JSON.stringify(OFFICIAL_KEY[i])}, got ${JSON.stringify(q!.answerKey)}`
    );
  }
  console.log('   ✓ All 40 answers match the official Cambridge answer key');

  console.log('\n5. Verifying accepted alternatives...');
  // Q7: colonies / colony
  const q7 = allQuestions.find((item) => item.questionNumber === 7);
  assert(q7?.acceptedAlternatives?.includes('colony'), 'Q7 must accept "colony"');
  const markQ7 = markStudentAnswer({
    questionType: 'note_completion',
    userAnswer: 'colony',
    answerKey: q7!.answerKey,
    acceptedAlternatives: q7!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markQ7.isCorrect && markQ7.mark === 1, 'Q7 must score 1 mark for "colony"');

  // Q10: habitat / habitats
  const q10 = allQuestions.find((item) => item.questionNumber === 10);
  assert(q10?.acceptedAlternatives?.includes('habitat'), 'Q10 must accept "habitat"');
  const markQ10 = markStudentAnswer({
    questionType: 'note_completion',
    userAnswer: 'habitat',
    answerKey: q10!.answerKey,
    acceptedAlternatives: q10!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markQ10.isCorrect && markQ10.mark === 1, 'Q10 must score 1 mark for "habitat"');

  // Case insensitivity: e.g. "EUROPE" for Q11
  const q11 = allQuestions.find((item) => item.questionNumber === 11);
  const markQ11 = markStudentAnswer({
    questionType: 'note_completion',
    userAnswer: 'europe',
    answerKey: q11!.answerKey,
    acceptedAlternatives: q11!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markQ11.isCorrect && markQ11.mark === 1, 'Q11 must be case-insensitive for "europe"');
  console.log('   ✓ Accepted alternatives verified');

  console.log('\n6. Simulating complete student test submission (40/40)...');
  let rawScore = 0;
  for (let i = 1; i <= 40; i++) {
    const q = allQuestions.find((item) => item.questionNumber === i)!;
    const g = versionRecord!.questionGroups.find((group) =>
      group.questions.some((item) => item.id === q.id)
    )!;

    const markResult = markStudentAnswer({
      questionType: g.questionType,
      userAnswer: OFFICIAL_KEY[i],
      answerKey: q.answerKey,
      acceptedAlternatives: q.acceptedAlternatives,
      maxWords: g.maxWords,
      maxNumbers: g.maxNumbers,
    });

    if (markResult.isCorrect) {
      rawScore += markResult.mark;
    } else {
      console.error(`Mismatch on Q${i}:`, markResult, 'User Answer:', OFFICIAL_KEY[i], 'Key:', q.answerKey);
    }
  }

  assert(rawScore === 40, `Expected 40/40, got ${rawScore}/40`);
  const band = calculateEstimatedBandScore(rawScore, 40, 'academic');
  assert(band === 9.0, `Expected band 9.0, got ${band}`);
  console.log(`   ✓ 40/40 correct answers scored raw: ${rawScore}/40 -> Band: ${band}`);

  console.log('\n7. Verifying question sanitization for students...');
  const sanitized = sanitizeQuestionsForStudent(versionRecord!.questionGroups);
  for (const group of sanitized) {
    for (const q of group.questions) {
      assert((q as any).answerKey === undefined, `Q${q.questionNumber} leaked answerKey`);
      assert(
        (q as any).acceptedAlternatives === undefined,
        `Q${q.questionNumber} leaked acceptedAlternatives`
      );
      assert((q as any).explanation === undefined, `Q${q.questionNumber} leaked explanation`);
      assert((q as any).evidenceQuote === undefined, `Q${q.questionNumber} leaked evidenceQuote`);
    }
  }
  console.log('   ✓ No answers, explanations, or quotes leaked to student view');

  console.log('\n8. Verifying listTests includes the test...');
  const tests = await listTests({ isTeacherOrAdmin: false });
  const found = tests.find((t) => t.title === 'Cambridge IELTS 19 Academic Reading Test 4');
  assert(found !== undefined, 'Cambridge IELTS 19 Academic Reading Test 4 must be listed');
  console.log('   ✓ Test visible in test catalog');

  console.log('\n✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('\n❌ VERIFICATION TEST FAILED:', err);
  process.exit(1);
});
