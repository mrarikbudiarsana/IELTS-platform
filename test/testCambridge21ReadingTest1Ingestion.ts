import { ingestCambridge21Test1, getCambridge21Test1Data } from '../server/ingestCambridge21Test1';
import { db } from '../server/db';
import { getTestById, getVersionById, listTests, sanitizeQuestionsForStudent } from '../server/readingService';
import { markStudentAnswer, calculateEstimatedBandScore } from '../shared/scoring';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 21 TEST 1 VERIFICATION ===\n');

  // Step 1: Validate data structure
  console.log('1. Validating Cambridge 21 test 1 data structure...');
  const testData = getCambridge21Test1Data();
  assert(testData.title === 'Cambridge IELTS 21 Academic Reading Test 1', 'Title mismatch');
  assert(testData.testType === 'academic', 'Must be academic');
  assert(testData.category === 'mock', 'Must be mock category');
  assert(testData.passages.length === 3, 'Must have exactly 3 passages');

  let totalQCount = 0;
  for (const group of testData.questionGroups) {
    totalQCount += group.questions.length;
  }
  assert(totalQCount === 40, `Must have exactly 40 questions, found ${totalQCount}`);
  console.log('   ✓ 3 passages and 40 questions correctly structured');

  // Step 2: Ingest into database
  console.log('\n2. Ingesting into platform database...');
  const result = ingestCambridge21Test1();
  assert(result.testId, 'Test ID must be generated');
  assert(result.versionId, 'Version ID must be generated');
  assert(result.status === 'published', 'Must be published');
  assert(result.totalQuestions === 40, 'Must have 40 total questions');
  console.log(`   ✓ Ingested successfully with Test ID: ${result.testId}, Version ID: ${result.versionId}`);

  // Step 3: Verify DB retrieval
  console.log('\n3. Verifying database records...');
  const testRecord = getTestById(result.testId);
  assert(testRecord !== null, 'Test record must exist in DB');
  assert(testRecord!.title === 'Cambridge IELTS 21 Academic Reading Test 1', 'Title must match');
  assert(testRecord!.isFreeTier === true, 'Test should be accessible in free tier');
  assert(testRecord!.status === 'published', 'Status must be published');

  const versionRecord = getVersionById(result.versionId);
  assert(versionRecord !== null, 'Version record must exist in DB');
  assert(versionRecord!.passages.length === 3, 'Must have 3 passages in version');
  assert(versionRecord!.questionGroups.length === 8, 'Must have 8 question groups');
  assert(versionRecord!.totalQuestions === 40, 'Total questions must be 40');
  console.log('   ✓ Database records verified');

  // Step 4: Verify question sequence and integrity
  console.log('\n4. Verifying question sequence 1–40 and answer keys...');
  const allQuestions = versionRecord!.questionGroups.flatMap((g) => g.questions);
  for (let i = 1; i <= 40; i++) {
    const q = allQuestions.find((item) => item.questionNumber === i);
    assert(q !== undefined, `Question ${i} must exist`);
    assert(q!.prompt && q!.prompt.length > 0, `Question ${i} must have prompt`);
    assert(q!.answerKey !== undefined && q!.answerKey !== '', `Question ${i} must have answer key`);
    assert(q!.explanation && q!.explanation.length > 0, `Question ${i} must have explanation`);
  }
  console.log('   ✓ All 40 questions verified with prompts, keys, and explanations');

  // Step 5: Verify student sanitization (no leak of answer keys/explanations)
  console.log('\n5. Verifying security sanitization for test taker view...');
  const sanitized = sanitizeQuestionsForStudent(versionRecord!.questionGroups);
  for (const group of sanitized) {
    for (const q of group.questions) {
      assert((q as any).answerKey === undefined, `Sanitized question ${q.questionNumber} leaked answerKey`);
      assert((q as any).acceptedAlternatives === undefined, `Sanitized question ${q.questionNumber} leaked acceptedAlternatives`);
      assert((q as any).explanation === undefined, `Sanitized question ${q.questionNumber} leaked explanation`);
      assert((q as any).evidenceQuote === undefined, `Sanitized question ${q.questionNumber} leaked evidenceQuote`);
    }
  }
  console.log('   ✓ Student question payloads are 100% securely scrubbed');

  // Step 6: Verify Catalogue Listing
  console.log('\n6. Verifying student catalogue visibility...');
  const studentCatalogue = listTests({ isTeacherOrAdmin: false });
  const foundInCatalogue = studentCatalogue.find((t) => t.id === result.testId);
  assert(foundInCatalogue !== undefined, 'Ingested test must appear in catalogue list');
  console.log(`   ✓ Test visible in published catalogue: "${foundInCatalogue!.title}"`);

  // Step 7: Verify 40/40 scoring simulation
  console.log('\n7. Running perfect 40/40 score test against Cambridge 21 Test 1...');
  let totalScore = 0;
  for (const group of versionRecord!.questionGroups) {
    for (const q of group.questions) {
      const markResult = markStudentAnswer({
        questionType: group.questionType as any,
        userAnswer: q.answerKey,
        answerKey: q.answerKey,
        acceptedAlternatives: q.acceptedAlternatives,
        maxWords: group.maxWords,
        maxNumbers: group.maxNumbers,
      });
      assert(markResult.isCorrect === true, `Official answer key for Q${q.questionNumber} ("${q.answerKey}") failed to self-score`);
      assert(markResult.mark === 1, `Mark should be 1 for Q${q.questionNumber}`);
      totalScore += markResult.mark;
    }
  }
  assert(totalScore === 40, `Full score must be 40, got ${totalScore}`);

  const band = calculateEstimatedBandScore(40, 40, 'academic');
  assert(band === 9.0, `40/40 in Academic Reading must yield Band 9.0, got ${band}`);
  console.log(`   ✓ 40/40 correct answers scored exactly 40 marks -> Band ${band}`);

  console.log('\n>>> ALL CAMBRIDGE IELTS 21 TEST 1 VERIFICATION TESTS PASSED SUCCESSFULLY! <<<\n');
}

runTests().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
