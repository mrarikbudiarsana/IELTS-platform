import { getCambridge21ListeningTest1Data, ingestCambridge21ListeningTest1 } from '../server/ingestCambridge21ListeningTest1';
import { db } from '../server/db';
import { getListeningTestById, getListeningVersionById, sanitizeListeningForStudent } from '../server/listeningService';
import { markStudentAnswer, calculateEstimatedListeningBandScore } from '../shared/scoring';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 21 LISTENING TEST 1 VERIFICATION ===\n');

  // Step 1: Validate data structure
  console.log('1. Validating Cambridge 21 Listening test data structure...');
  const testData = getCambridge21ListeningTest1Data();
  assert(testData.title === 'Cambridge IELTS 21 Academic Listening Test 1', 'Title mismatch');
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
  const result = (await ingestCambridge21ListeningTest1());
  assert(result.testId, 'Test ID must be generated');
  assert(result.versionId, 'Version ID must be generated');
  assert(result.status === 'published', 'Must be published');
  assert(result.totalQuestions === 40, 'Must have 40 total questions');
  console.log(`   ✓ Ingested successfully with Test ID: ${result.testId}, Version ID: ${result.versionId}`);

  // Step 3: Verify DB retrieval
  console.log('\n3. Verifying database records...');
  const testRecord = (await getListeningTestById(result.testId));
  assert(testRecord !== null, 'Test record must exist in DB');
  assert(testRecord!.title === 'Cambridge IELTS 21 Academic Listening Test 1', 'Title must match');
  assert(testRecord!.isFreeTier === true, 'Test should be accessible in free tier');
  assert(testRecord!.status === 'published', 'Status must be published');

  const versionRecord = (await getListeningVersionById(result.versionId));
  assert(versionRecord !== null, 'Version record must exist in DB');
  assert(versionRecord!.parts.length === 4, 'Must have 4 parts in version');
  assert(versionRecord!.questionGroups.length === 8, 'Must have 8 question groups');
  assert(versionRecord!.totalQuestions === 40, 'Total questions must be 40');
  console.log('   ✓ Database records verified');

  // Step 4: Verify question sequence and integrity
  console.log('\n4. Verifying question sequence 1–40 and answer keys...');
  const allQuestions = versionRecord!.questionGroups.flatMap((g) => g.questions);

  const expectedKeys: Record<number, string | string[]> = {
    1: '10',
    2: 'weather',
    3: 'safety',
    4: 'discount',
    5: 'dictionary',
    6: 'certificate',
    7: 'towel',
    8: 'café',
    9: 'videos',
    10: 'Lockers',
    11: 'A',
    12: 'B',
    13: 'A',
    14: 'A',
    15: 'A',
    16: 'C',
    17: 'C',
    18: 'A',
    19: 'B',
    20: 'C',
    21: ['B', 'D'],
    22: ['B', 'D'],
    23: ['C', 'E'],
    24: ['C', 'E'],
    25: 'G',
    26: 'B',
    27: 'F',
    28: 'H',
    29: 'A',
    30: 'E',
    31: 'metal',
    32: 'slow',
    33: 'demand',
    34: 'equator',
    35: 'recycle',
    36: 'fungus',
    37: 'weather',
    38: 'strong',
    39: 'roots',
    40: 'soil',
  };

  for (let i = 1; i <= 40; i++) {
    const q = allQuestions.find((item) => item.questionNumber === i);
    assert(q !== undefined, `Question ${i} must exist`);
    assert(q!.prompt && q!.prompt.length > 0, `Question ${i} must have prompt`);
    assert(q!.answerKey !== undefined, `Question ${i} must have an answer key`);

    if (Array.isArray(expectedKeys[i])) {
      assert(Array.isArray(q!.answerKey), `Question ${i} must have array answerKey`);
      assert(
        JSON.stringify((q!.answerKey as string[]).sort()) === JSON.stringify((expectedKeys[i] as string[]).sort()),
        `Question ${i} answer key mismatch`
      );
    } else {
      assert(q!.answerKey === expectedKeys[i], `Question ${i} answer key mismatch: expected ${expectedKeys[i]}, got ${q!.answerKey}`);
    }
  }
  console.log('   ✓ All 40 questions verified with exact answer keys');

  // Step 5: Test Student scrubbing
  console.log('\n5. Verifying answer scrubbing for student test-taking...');
  const { questionGroups: studentGroups } = sanitizeListeningForStudent(versionRecord!.questionGroups, versionRecord!.parts);
  const studentQuestions = studentGroups.flatMap((g) => g.questions);
  for (const sq of studentQuestions) {
    assert((sq as any).answerKey === undefined, `Student question ${sq.questionNumber} should not have answerKey`);
    assert((sq as any).explanation === undefined, `Student question ${sq.questionNumber} should not have explanation`);
  }
  console.log('   ✓ Security scrub verified (no answer keys leaked to student)');

  // Step 6: Test Scoring Simulation
  console.log('\n6. Testing marking engine simulation...');
  // Simulate 40 correct answers
  let score = 0;
  for (let i = 1; i <= 40; i++) {
    const q = allQuestions.find((item) => item.questionNumber === i)!;
    const group = versionRecord!.questionGroups.find((g) => g.questions.some((item) => item.id === q.id))!;
    let studentAns: any;
    if (i === 1) studentAns = 'ten'; // test alternative
    else if (i === 8) studentAns = 'cafe'; // test alternative
    else if (i === 10) studentAns = 'lockers'; // test case insensitivity
    else if (i === 21) studentAns = 'B';
    else if (i === 22) studentAns = 'D';
    else if (i === 23) studentAns = 'E';
    else if (i === 24) studentAns = 'C';
    else if (i === 31) studentAns = 'metals'; // test alternative
    else studentAns = q.answerKey;

    const markRes = markStudentAnswer({
      questionType: group.questionType,
      userAnswer: studentAns,
      answerKey: q.answerKey,
      acceptedAlternatives: q.acceptedAlternatives,
      maxWords: group.maxWords,
      maxNumbers: group.maxNumbers,
    });
    if (markRes.isCorrect) score += markRes.mark;
    else console.log(`Q${i} marked incorrect! studentAns: ${studentAns}, answerKey: ${q.answerKey}`);
  }

  assert(score === 40, `Score should be 40, got ${score}`);
  const band = calculateEstimatedListeningBandScore(score, 40);
  assert(band === 9.0, `Band score should be 9.0 for 40/40, got ${band}`);
  console.log(`   ✓ Marking engine verified: 40/40 correct -> Band ${band}`);

  console.log('\n======================================================');
  console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
}

async function runEntryPoint() {
await runTests();

}
export const testCompleted = runEntryPoint();
testCompleted.catch(error => { console.error(error); process.exitCode = 1; });
