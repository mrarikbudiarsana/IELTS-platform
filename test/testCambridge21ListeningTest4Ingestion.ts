import { ingestCambridge21ListeningTest4, getCambridge21ListeningTest4Data } from '../server/ingestCambridge21ListeningTest4';
import { db } from '../server/db';
import { getListeningTestById, getListeningVersionById, listListeningTests, sanitizeListeningForStudent } from '../server/listeningService';
import { markStudentAnswer, calculateEstimatedBandScore } from '../shared/scoring';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 21 LISTENING TEST 4 VERIFICATION ===\n');

  // Step 1: Validate data structure
  console.log('1. Validating Cambridge 21 Listening Test 4 data structure...');
  const testData = getCambridge21ListeningTest4Data();
  assert(testData.title === 'Cambridge IELTS 21 Academic Listening Test 4', 'Title mismatch');
  assert(testData.category === 'mock', 'Must be mock category');
  assert(testData.parts.length === 4, 'Must have exactly 4 parts');

  let totalQCount = 0;
  for (const group of testData.questionGroups) {
    totalQCount += group.questions.length;
  }
  assert(totalQCount === 40, `Must have exactly 40 questions, found ${totalQCount}`);
  console.log('   ✓ 4 parts and 40 questions correctly structured');

  // Step 2: Ingest into database
  console.log('\n2. Ingesting into platform database...');
  const result = (await ingestCambridge21ListeningTest4());
  assert(result.testId, 'Test ID must be generated');
  assert(result.versionId, 'Version ID must be generated');
  assert(result.status === 'published', 'Must be published');
  assert(result.totalQuestions === 40, 'Must have 40 total questions');
  console.log(`   ✓ Ingested successfully with Test ID: ${result.testId}, Version ID: ${result.versionId}`);

  // Step 3: Verify DB retrieval
  console.log('\n3. Verifying database records...');
  const testRecord = (await getListeningTestById(result.testId));
  assert(testRecord !== null, 'Test record must exist in DB');
  assert(testRecord!.title === 'Cambridge IELTS 21 Academic Listening Test 4', 'Title must match');
  assert(testRecord!.isFreeTier === true, 'Test should be accessible in free tier');
  assert(testRecord!.status === 'published', 'Status must be published');

  const versionRecord = (await getListeningVersionById(result.versionId));
  assert(versionRecord !== null, 'Version record must exist in DB');
  assert(versionRecord!.parts.length === 4, 'Must have 4 parts in version');
  assert(versionRecord!.questionGroups.length === 7, 'Must have 7 question groups');
  assert(versionRecord!.totalQuestions === 40, 'Total questions must be 40');
  console.log('   ✓ Database records verified');

  // Step 4: Verify question sequence and integrity
  console.log('\n4. Verifying question sequence 1–40 and official answer keys...');
  const allQuestions = versionRecord!.questionGroups.flatMap((g) => g.questions);
  for (let i = 1; i <= 40; i++) {
    const q = allQuestions.find((item) => item.questionNumber === i);
    assert(q !== undefined, `Question ${i} must exist`);
    assert(q!.prompt && q!.prompt.length > 0, `Question ${i} must have prompt`);
    assert(q!.answerKey !== undefined, `Question ${i} must have answer key`);
    assert(q!.explanation && q!.explanation.length > 0, `Question ${i} must have explanation`);
  }
  console.log('   ✓ All 40 questions verified with prompts, keys, and explanations');

  // Specific check against provided answer key image
  assert(allQuestions.find((q) => q.questionNumber === 1)?.answerKey === 'Leigh', 'Q1 must be Leigh');
  assert(allQuestions.find((q) => q.questionNumber === 2)?.answerKey === 'motorbike', 'Q2 must be motorbike');
  assert(allQuestions.find((q) => q.questionNumber === 3)?.answerKey === 'hairdresser', 'Q3 must be hairdresser');
  assert(allQuestions.find((q) => q.questionNumber === 4)?.answerKey === 'suit', 'Q4 must be suit');
  assert(allQuestions.find((q) => q.questionNumber === 5)?.answerKey === 'laptop', 'Q5 must be laptop');
  assert(allQuestions.find((q) => q.questionNumber === 6)?.answerKey === 'Monday', 'Q6 must be Monday');
  assert(allQuestions.find((q) => q.questionNumber === 7)?.answerKey === 'coffee', 'Q7 must be coffee');
  assert(allQuestions.find((q) => q.questionNumber === 8)?.answerKey === 'books', 'Q8 must be books');
  assert(allQuestions.find((q) => q.questionNumber === 9)?.answerKey === 'plants', 'Q9 must be plants');
  assert(allQuestions.find((q) => q.questionNumber === 10)?.answerKey === 'cinema', 'Q10 must be cinema');

  const q15 = allQuestions.find((q) => q.questionNumber === 15);
  assert(q15?.answerKey === 'C', 'Q15 must be C');
  const q16 = allQuestions.find((q) => q.questionNumber === 16);
  assert(q16?.answerKey === 'G', 'Q16 must be G');
  const q17 = allQuestions.find((q) => q.questionNumber === 17);
  assert(q17?.answerKey === 'D', 'Q17 must be D');
  const q18 = allQuestions.find((q) => q.questionNumber === 18);
  assert(q18?.answerKey === 'A', 'Q18 must be A');
  const q19 = allQuestions.find((q) => q.questionNumber === 19);
  assert(q19?.answerKey === 'F', 'Q19 must be F');
  const q20 = allQuestions.find((q) => q.questionNumber === 20);
  assert(q20?.answerKey === 'B', 'Q20 must be B');

  assert(allQuestions.find((q) => q.questionNumber === 21)?.answerKey === 'B', 'Q21 must be B');
  assert(allQuestions.find((q) => q.questionNumber === 22)?.answerKey === 'A', 'Q22 must be A');
  assert(allQuestions.find((q) => q.questionNumber === 23)?.answerKey === 'B', 'Q23 must be B');
  assert(allQuestions.find((q) => q.questionNumber === 24)?.answerKey === 'B', 'Q24 must be B');
  assert(allQuestions.find((q) => q.questionNumber === 25)?.answerKey === 'E', 'Q25 must be E');
  assert(allQuestions.find((q) => q.questionNumber === 26)?.answerKey === 'I', 'Q26 must be I');
  assert(allQuestions.find((q) => q.questionNumber === 27)?.answerKey === 'A', 'Q27 must be A');
  assert(allQuestions.find((q) => q.questionNumber === 28)?.answerKey === 'D', 'Q28 must be D');
  assert(allQuestions.find((q) => q.questionNumber === 29)?.answerKey === 'H', 'Q29 must be H');
  assert(allQuestions.find((q) => q.questionNumber === 30)?.answerKey === 'G', 'Q30 must be G');

  assert(allQuestions.find((q) => q.questionNumber === 31)?.answerKey === 'routine', 'Q31 must be routine');
  assert(allQuestions.find((q) => q.questionNumber === 32)?.answerKey === 'trials', 'Q32 must be trials');
  assert(allQuestions.find((q) => q.questionNumber === 33)?.answerKey === 'calming', 'Q33 must be calming');
  assert(allQuestions.find((q) => q.questionNumber === 34)?.answerKey === 'pillows', 'Q34 must be pillows');
  assert(allQuestions.find((q) => q.questionNumber === 35)?.answerKey === 'anxiety', 'Q35 must be anxiety');
  assert(allQuestions.find((q) => q.questionNumber === 36)?.answerKey === 'medication', 'Q36 must be medication');
  assert(allQuestions.find((q) => q.questionNumber === 37)?.answerKey === 'awake', 'Q37 must be awake');
  assert(allQuestions.find((q) => q.questionNumber === 38)?.answerKey === 'distraction', 'Q38 must be distraction');
  assert(allQuestions.find((q) => q.questionNumber === 39)?.answerKey === 'nature', 'Q39 must be nature');
  assert(allQuestions.find((q) => q.questionNumber === 40)?.answerKey === 'volume', 'Q40 must be volume');
  console.log('   ✓ Exact answer key match verified against Cambridge official answers');

  // Step 5: Verify student sanitization (no leak of answer keys/transcripts)
  console.log('\n5. Verifying security sanitization for test taker view...');
  const sanitized = sanitizeListeningForStudent(versionRecord!.questionGroups, versionRecord!.parts);
  for (const part of sanitized.parts) {
    assert((part as any).transcript === undefined, 'Sanitized part leaked transcript');
    assert((part as any).transcriptTimestamps === undefined, 'Sanitized part leaked transcriptTimestamps');
  }
  for (const group of sanitized.questionGroups) {
    for (const q of group.questions) {
      assert((q as any).answerKey === undefined, `Sanitized question ${q.questionNumber} leaked answerKey`);
      assert((q as any).acceptedAlternatives === undefined, `Sanitized question ${q.questionNumber} leaked acceptedAlternatives`);
      assert((q as any).explanation === undefined, `Sanitized question ${q.questionNumber} leaked explanation`);
      assert((q as any).transcriptExcerpt === undefined, `Sanitized question ${q.questionNumber} leaked transcriptExcerpt`);
    }
  }
  console.log('   ✓ Student question and audio payloads are 100% securely scrubbed');

  // Step 6: Verify Catalogue Listing
  console.log('\n6. Verifying student catalogue visibility...');
  const studentCatalogue = (await listListeningTests({ isTeacherOrAdmin: false }));
  const foundInCatalogue = studentCatalogue.find((t) => t.id === result.testId);
  assert(foundInCatalogue !== undefined, 'Ingested test must appear in catalogue list');
  console.log(`   ✓ Test visible in published catalogue: "${foundInCatalogue!.title}"`);

  // Step 7: Verify 40/40 scoring simulation
  console.log('\n7. Running perfect 40/40 score test against Cambridge 21 Listening Test 4...');
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
        allowAnyOrder: group.allowAnyOrder,
      });
      assert(markResult.isCorrect === true, `Official answer key for Q${q.questionNumber} failed to self-score`);
      assert(markResult.mark === 1, `Mark should be 1 for Q${q.questionNumber}`);
      totalScore += markResult.mark;
    }
  }
  assert(totalScore === 40, `Full score must be 40, got ${totalScore}`);

  const band = calculateEstimatedBandScore(40, 40, 'academic');
  assert(band === 9.0, `40/40 in Listening must yield Band 9.0, got ${band}`);
  console.log(`   ✓ 40/40 correct answers scored exactly 40 marks -> Band ${band}`);

  console.log('\n>>> ALL CAMBRIDGE IELTS 21 LISTENING TEST 4 VERIFICATION TESTS PASSED SUCCESSFULLY! <<<\n');
}

async function runEntryPoint() {
await runTests();

}
export const testCompleted = runEntryPoint();
testCompleted.catch(error => { console.error(error); process.exitCode = 1; });
