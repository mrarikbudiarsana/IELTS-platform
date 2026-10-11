import { ingestCambridge21Test3, getCambridge21Test3Data } from '../server/ingestCambridge21Test3';
import { db } from '../server/db';
import { getTestById, getVersionById, listTests, sanitizeQuestionsForStudent } from '../server/readingService';
import { markStudentAnswer, calculateEstimatedBandScore } from '../shared/scoring';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 21 READING TEST 3 VERIFICATION ===\n');

  // Step 1: Validate data structure
  console.log('1. Validating Cambridge 21 Reading Test 3 data structure...');
  const testData = getCambridge21Test3Data();
  assert(testData.title === 'Cambridge IELTS 21 Academic Reading Test 3', 'Title mismatch');
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
  const result = ingestCambridge21Test3();
  assert(result.testId, 'Test ID must be generated');
  assert(result.versionId, 'Version ID must be generated');
  assert(result.status === 'published', 'Must be published');
  assert(result.totalQuestions === 40, 'Must have 40 total questions');
  console.log(`   ✓ Ingested successfully with Test ID: ${result.testId}, Version ID: ${result.versionId}`);

  // Step 3: Verify DB retrieval
  console.log('\n3. Verifying database records...');
  const testRecord = getTestById(result.testId);
  assert(testRecord !== null, 'Test record must exist in DB');
  assert(testRecord!.title === 'Cambridge IELTS 21 Academic Reading Test 3', 'Title must match');
  assert(testRecord!.isFreeTier === true, 'Test should be accessible in free tier');
  assert(testRecord!.status === 'published', 'Status must be published');

  const versionRecord = getVersionById(result.versionId);
  assert(versionRecord !== null, 'Version record must exist in DB');
  assert(versionRecord!.passages.length === 3, 'Must have 3 passages in version');
  assert(versionRecord!.questionGroups.length === 7, 'Must have 7 question groups');
  assert(versionRecord!.totalQuestions === 40, 'Total questions must be 40');
  console.log('   ✓ Database records verified');

  // Step 4: Verify question sequence and integrity
  console.log('\n4. Verifying question sequence 1–40 and answer keys...');
  const allQuestions = versionRecord!.questionGroups.flatMap((g) => g.questions);
  for (let i = 1; i <= 40; i++) {
    const q = allQuestions.find((item) => item.questionNumber === i);
    assert(q !== undefined, `Question ${i} must exist`);
    assert(q!.prompt && q!.prompt.length > 0, `Question ${i} must have prompt`);
    assert(q!.answerKey !== undefined && q!.answerKey !== '', `Question ${i} must have an answerKey`);
    assert(q!.explanation && q!.explanation.length > 0, `Question ${i} must have an explanation`);
    assert(q!.evidenceQuote && q!.evidenceQuote.length > 0, `Question ${i} must have an evidenceQuote`);
  }

  // Verify official answer keys match user answer sheet exactly
  const expectedAnswers: Record<number, string> = {
    1: 'dust',
    2: 'blood',
    3: 'coat',
    4: 'horns',
    5: 'habitat',
    6: 'routes',
    7: 'streams',
    8: 'FALSE',
    9: 'FALSE',
    10: 'TRUE',
    11: 'NOT GIVEN',
    12: 'TRUE',
    13: 'NOT GIVEN',
    14: 'NOT GIVEN',
    15: 'FALSE',
    16: 'NOT GIVEN',
    17: 'TRUE',
    18: 'FALSE',
    19: 'lanes',
    20: 'boarding',
    21: 'wheelchairs',
    22: 'fuel',
    23: 'flood',
    24: 'smartcards',
    25: 'gates',
    26: 'queues',
    27: 'A',
    28: 'A',
    29: 'D',
    30: 'A',
    31: 'E',
    32: 'F',
    33: 'D',
    34: 'B',
    35: 'NO',
    36: 'NOT GIVEN',
    37: 'NOT GIVEN',
    38: 'YES',
    39: 'YES',
    40: 'NO',
  };

  for (const [qNumStr, expectedAns] of Object.entries(expectedAnswers)) {
    const qNum = parseInt(qNumStr, 10);
    const q = allQuestions.find((item) => item.questionNumber === qNum);
    assert(q!.answerKey === expectedAns, `Question ${qNum} expected ${expectedAns}, found ${q!.answerKey}`);
  }
  console.log('   ✓ All 40 official answer keys verified against official Cambridge 21 answer key');

  // Step 5: Test Student scrubbing (no answers leaked)
  console.log('\n5. Verifying question sanitization for student delivery...');
  const sanitizedGroups = sanitizeQuestionsForStudent(versionRecord!.questionGroups);
  const sanitizedQuestions = sanitizedGroups.flatMap((g) => g.questions);
  for (const sq of sanitizedQuestions) {
    assert(sq.answerKey === undefined, `Sanitized question ${sq.questionNumber} must not leak answerKey`);
    assert(sq.explanation === undefined, `Sanitized question ${sq.questionNumber} must not leak explanation`);
    assert(sq.evidenceQuote === undefined, `Sanitized question ${sq.questionNumber} must not leak evidenceQuote`);
  }
  console.log('   ✓ Student payload safely scrubbed');

  // Step 6: Test scoring calculation
  console.log('\n6. Testing scoring with official band scale...');
  let totalScore = 0;
  for (let i = 1; i <= 40; i++) {
    const q = allQuestions.find((item) => item.questionNumber === i)!;
    const isCorrect = markStudentAnswer(expectedAnswers[i], q.answerKey, q.acceptedAlternatives);
    if (isCorrect) totalScore++;
  }
  assert(totalScore === 40, `Full answer sheet should score 40, got ${totalScore}`);
  const band = calculateEstimatedBandScore(totalScore, 40, 'academic');
  assert(band === 9.0, `Score 40 should be Band 9.0, got ${band}`);
  console.log(`   ✓ Scoring validated: 40/40 produces Band ${band}`);

  console.log('\n Cambridge IELTS 21 Academic Reading Test 3 Ingestion Verified Successfully!\n');
}

runTests().catch((err) => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});
