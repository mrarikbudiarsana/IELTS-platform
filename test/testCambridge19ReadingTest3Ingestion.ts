import {
  ingestCambridge19ReadingTest3,
  getCambridge19ReadingTest3Data,
} from '../server/ingestCambridge19ReadingTest3';
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

// Official answer key from Cambridge IELTS 19 Academic Reading Test 3
const OFFICIAL_KEY: Record<number, string> = {
  // Passage 1: Questions 1–13
  1: 'FALSE',
  2: 'FALSE',
  3: 'TRUE',
  4: 'NOT GIVEN',
  5: 'TRUE',
  6: 'NOT GIVEN',
  7: 'FALSE',
  8: 'caves',
  9: 'stone',
  10: 'bones',
  11: 'beads',
  12: 'pottery',
  13: 'spices',

  // Passage 2: Questions 14–26
  14: 'G',
  15: 'A',
  16: 'H',
  17: 'B',
  18: 'carbon',
  19: 'fires',
  20: 'biodiversity',
  21: 'ditches',
  22: 'subsidence',
  23: 'A',
  24: 'C',
  25: 'D',
  26: 'B',

  // Passage 3: Questions 27–40
  27: 'D',
  28: 'A',
  29: 'C',
  30: 'B',
  31: 'C',
  32: 'E',
  33: 'F',
  34: 'B',
  35: 'NO',
  36: 'YES',
  37: 'NO',
  38: 'NOT GIVEN',
  39: 'NOT GIVEN',
  40: 'YES',
};

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 19 ACADEMIC READING TEST 3 VERIFICATION ===\n');

  console.log('1. Validating data structure...');
  const testData = getCambridge19ReadingTest3Data();
  assert(testData.title === 'Cambridge IELTS 19 Academic Reading Test 3', 'Title mismatch');
  assert(testData.passages.length === 3, 'Must have exactly 3 passages');
  const totalQCount = testData.questionGroups.reduce((n, g) => n + g.questions.length, 0);
  assert(totalQCount === 40, `Must have exactly 40 questions, found ${totalQCount}`);
  console.log('   ✓ 3 passages and 40 questions correctly structured');

  console.log('\n2. Ingesting into local SQLite database...');
  const result = await ingestCambridge19ReadingTest3();
  assert(result.status === 'published' && result.totalQuestions === 40, 'Ingestion result invalid');
  console.log(`   ✓ Ingested test ID: ${result.testId}, version ID: ${result.versionId}`);

  console.log('\n3. Verifying local SQLite database records...');
  const testRecord = await getTestById(result.testId);
  assert(
    testRecord && testRecord.title === 'Cambridge IELTS 19 Academic Reading Test 3',
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
    assert(
      JSON.stringify(q!.answerKey) === JSON.stringify(OFFICIAL_KEY[i]),
      `Q${i}: expected ${JSON.stringify(OFFICIAL_KEY[i])}, got ${JSON.stringify(q!.answerKey)}`
    );
  }
  console.log('   ✓ All 40 answers match the official Cambridge answer key');

  console.log('\n5. Verifying accepted alternatives...');
  // Q8: cave / caves
  const q8 = allQuestions.find((item) => item.questionNumber === 8);
  assert(q8?.acceptedAlternatives?.includes('cave'), 'Q8 must accept "cave"');
  const markQ8 = markStudentAnswer({
    questionType: 'note_completion',
    userAnswer: 'cave',
    answerKey: q8!.answerKey,
    acceptedAlternatives: q8!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markQ8.isCorrect && markQ8.mark === 1, 'Q8 must score 1 mark for "cave"');

  // Q10: bone / bones
  const q10 = allQuestions.find((item) => item.questionNumber === 10);
  assert(q10?.acceptedAlternatives?.includes('bone'), 'Q10 must accept "bone"');
  const markQ10 = markStudentAnswer({
    questionType: 'note_completion',
    userAnswer: 'bone',
    answerKey: q10!.answerKey,
    acceptedAlternatives: q10!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markQ10.isCorrect && markQ10.mark === 1, 'Q10 must score 1 mark for "bone"');

  // Q19: fire / fires
  const q19 = allQuestions.find((item) => item.questionNumber === 19);
  assert(q19?.acceptedAlternatives?.includes('fire'), 'Q19 must accept "fire"');
  const markQ19 = markStudentAnswer({
    questionType: 'sentence_completion',
    userAnswer: 'fire',
    answerKey: q19!.answerKey,
    acceptedAlternatives: q19!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markQ19.isCorrect && markQ19.mark === 1, 'Q19 must score 1 mark for "fire"');

  // Q21: ditch / ditches
  const q21 = allQuestions.find((item) => item.questionNumber === 21);
  assert(q21?.acceptedAlternatives?.includes('ditch'), 'Q21 must accept "ditch"');
  const markQ21 = markStudentAnswer({
    questionType: 'sentence_completion',
    userAnswer: 'ditch',
    answerKey: q21!.answerKey,
    acceptedAlternatives: q21!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markQ21.isCorrect && markQ21.mark === 1, 'Q21 must score 1 mark for "ditch"');
  console.log('   ✓ Accepted alternatives verified (cave, bone, fire, ditch)');

  console.log('\n6. Verifying student payload sanitization...');
  const sanitized = sanitizeQuestionsForStudent(versionRecord!.questionGroups);
  for (const group of sanitized) {
    for (const q of group.questions) {
      assert((q as any).answerKey === undefined, `Q${q.questionNumber} leaked answerKey`);
      assert((q as any).explanation === undefined, `Q${q.questionNumber} leaked explanation`);
      assert(
        (q as any).acceptedAlternatives === undefined,
        `Q${q.questionNumber} leaked acceptedAlternatives`
      );
    }
  }
  console.log('   ✓ Student payloads securely scrubbed');

  console.log('\n7. Verifying catalogue visibility...');
  const found = (await listTests({ isTeacherOrAdmin: false })).find((t) => t.id === result.testId);
  assert(found !== undefined, 'Test must appear in student catalogue');
  console.log(`   ✓ Visible: "${found!.title}"`);

  console.log('\n8. Running perfect 40/40 scoring simulation...');
  let totalScore = 0;
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
      assert(
        mark.isCorrect && mark.mark === 1,
        `Q${q.questionNumber} failed to self-score: ${JSON.stringify(mark)}`
      );
      totalScore += mark.mark;
    }
  }
  assert(totalScore === 40, `Full score must be 40, got ${totalScore}`);
  assert(calculateEstimatedBandScore(40, 40, 'academic') === 9.0, '40/40 must yield Band 9.0');
  console.log('   ✓ 40/40 -> Band 9.0');

  console.log(
    '\n>>> ALL CAMBRIDGE IELTS 19 ACADEMIC READING TEST 3 VERIFICATION TESTS PASSED SUCCESSFULLY! <<<\n'
  );
}

async function runEntryPoint() {
  await runTests();
}

export const testCompleted = runEntryPoint();
testCompleted.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
