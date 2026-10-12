import { ingestCambridge21Test4, getCambridge21Test4Data } from '../server/ingestCambridge21Test4';
import { db } from '../server/db';
import { getTestById, getVersionById, listTests, sanitizeQuestionsForStudent } from '../server/readingService';
import { markStudentAnswer, calculateEstimatedBandScore } from '../shared/scoring';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 21 TEST 4 VERIFICATION ===\n');

  // Step 1: Validate data structure
  console.log('1. Validating Cambridge 21 test data structure...');
  const testData = getCambridge21Test4Data();
  assert(testData.title === 'Cambridge IELTS 21 Academic Reading Test 4', 'Title mismatch');
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
  const result = (await ingestCambridge21Test4());
  assert(result.testId, 'Test ID must be generated');
  assert(result.versionId, 'Version ID must be generated');
  assert(result.status === 'published', 'Must be published');
  assert(result.totalQuestions === 40, 'Must have 40 total questions');
  console.log(`   ✓ Ingested successfully with Test ID: ${result.testId}, Version ID: ${result.versionId}`);

  // Step 3: Verify DB retrieval
  console.log('\n3. Verifying database records...');
  const testRecord = (await getTestById(result.testId));
  assert(testRecord !== null, 'Test record must exist in DB');
  assert(testRecord!.title === 'Cambridge IELTS 21 Academic Reading Test 4', 'Title must match');
  assert(testRecord!.isFreeTier === true, 'Test should be accessible in free tier');
  assert(testRecord!.status === 'published', 'Status must be published');

  const versionRecord = (await getVersionById(result.versionId));
  assert(versionRecord !== null, 'Version record must exist in DB');
  assert(versionRecord!.passages.length === 3, 'Must have 3 passages in version');
  assert(versionRecord!.questionGroups.length === 9, 'Must have 9 question groups');
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
  const studentCatalogue = (await listTests({ isTeacherOrAdmin: false }));
  const foundInCatalogue = studentCatalogue.find((t) => t.id === result.testId);
  assert(foundInCatalogue !== undefined, 'Cambridge 21 Test 4 must be visible in student catalogue');
  console.log(`   ✓ Found in student catalogue: "${foundInCatalogue!.title}"`);

  // Step 7: Simulate Scoring & Official Band Assessment
  console.log('\n7. Verifying IELTS marking engine and official band score conversion...');
  
  // Test perfect 40/40 score
  let perfectRaw = 0;
  for (const group of versionRecord!.questionGroups) {
    for (const q of group.questions) {
      const markRes = markStudentAnswer({
        questionType: group.questionType as any,
        userAnswer: q.answerKey,
        answerKey: q.answerKey,
        acceptedAlternatives: q.acceptedAlternatives,
        maxWords: group.maxWords,
        maxNumbers: group.maxNumbers,
      });
      if (markRes.isCorrect) perfectRaw += markRes.mark;
    }
  }
  assert(perfectRaw === 40, `Perfect score should be 40/40, got ${perfectRaw}`);
  const band40 = calculateEstimatedBandScore(perfectRaw, 40, 'academic');
  assert(band40 === 9.0, `Band for 40/40 should be 9.0, got ${band40}`);
  console.log(`   ✓ Perfect 40/40 answers marked correctly -> Band ${band40}`);

  // Test 30/40 score (Band 7.0 for Academic Reading)
  const band30 = calculateEstimatedBandScore(30, 40, 'academic');
  assert(band30 === 7.0, `Band for 30/40 should be 7.0, got ${band30}`);
  console.log(`   ✓ 30/40 answers mapped correctly -> Band ${band30}`);

  // Test 23/40 score (Band 6.0 for Academic Reading)
  const band23 = calculateEstimatedBandScore(23, 40, 'academic');
  assert(band23 === 6.0, `Band for 23/40 should be 6.0, got ${band23}`);
  console.log(`   ✓ 23/40 answers mapped correctly -> Band ${band23}`);

  // Test alternative acceptable answers
  // Q8: 'cow dung' or 'dung'
  const q8Group = versionRecord!.questionGroups.find((g) => g.id === 'c21-t4-g2')!;
  const q8 = q8Group.questions.find((q) => q.questionNumber === 8)!;
  const q8AltMark = markStudentAnswer({
    questionType: q8Group.questionType as any,
    userAnswer: 'dung',
    answerKey: q8.answerKey,
    acceptedAlternatives: q8.acceptedAlternatives,
    maxWords: q8Group.maxWords,
  });
  assert(q8AltMark.isCorrect, 'Accepted alternative "dung" should be marked correct for Q8');

  // Q9: 'fermentation' or 'fermentation process'
  const q9 = q8Group.questions.find((q) => q.questionNumber === 9)!;
  const q9AltMark = markStudentAnswer({
    questionType: q8Group.questionType as any,
    userAnswer: 'fermentation process',
    answerKey: q9.answerKey,
    acceptedAlternatives: q9.acceptedAlternatives,
    maxWords: q8Group.maxWords,
  });
  assert(q9AltMark.isCorrect, 'Accepted alternative "fermentation process" should be marked correct for Q9');
  console.log('   ✓ Accepted alternatives for completion questions verified');

  console.log('\n=== ALL VERIFICATION CHECKS PASSED SUCCESSFULLY ===');
}

async function runEntryPoint() {
await runTests();

}
export const testCompleted = runEntryPoint();
testCompleted.catch(error => { console.error(error); process.exitCode = 1; });
