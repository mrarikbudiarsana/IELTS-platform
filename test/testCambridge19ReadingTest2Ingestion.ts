import {
  ingestCambridge19ReadingTest2,
  getCambridge19ReadingTest2Data,
} from '../server/ingestCambridge19ReadingTest2';
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

// Official answer key from Cambridge IELTS 19 Academic Reading Test 2
const OFFICIAL_KEY: Record<number, string | string[]> = {
  // Passage 1
  1: 'piston',
  2: 'coal',
  3: 'workshops',
  4: 'labour', // acceptedAlternatives: ['labour', 'labor']
  5: 'quality',
  6: 'railways', // acceptedAlternatives: ['railways', 'railway']
  7: 'sanitation',
  8: 'NOT GIVEN',
  9: 'FALSE',
  10: 'NOT GIVEN',
  11: 'TRUE',
  12: 'TRUE',
  13: 'NOT GIVEN',

  // Passage 2
  14: 'D',
  15: 'F',
  16: 'A',
  17: 'C',
  18: 'F',
  19: 'injury',
  20: 'serves',
  21: 'excitement',
  22: 'Visualisation', // acceptedAlternatives: ['Visualisation', 'visualisation', 'Visualization', 'visualization']
  23: ['B', 'D'],
  24: ['B', 'D'],
  25: ['A', 'E'],
  26: ['A', 'E'],

  // Passage 3
  27: 'H',
  28: 'A',
  29: 'C',
  30: 'B',
  31: 'J',
  32: 'I',
  33: 'YES',
  34: 'NOT GIVEN',
  35: 'YES',
  36: 'NOT GIVEN',
  37: 'NO',
  38: 'C',
  39: 'B',
  40: 'D',
};

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 19 ACADEMIC READING TEST 2 VERIFICATION ===\n');

  console.log('1. Validating data structure...');
  const testData = getCambridge19ReadingTest2Data();
  assert(testData.title === 'Cambridge IELTS 19 Academic Reading Test 2', 'Title mismatch');
  assert(testData.passages.length === 3, 'Must have exactly 3 passages');
  const totalQCount = testData.questionGroups.reduce((n, g) => n + g.questions.length, 0);
  assert(totalQCount === 40, `Must have exactly 40 questions, found ${totalQCount}`);
  console.log('   ✓ 3 passages and 40 questions correctly structured');

  console.log('\n2. Ingesting into local SQLite database...');
  const result = await ingestCambridge19ReadingTest2();
  assert(result.status === 'published' && result.totalQuestions === 40, 'Ingestion result invalid');
  console.log(`   ✓ Ingested test ID: ${result.testId}, version ID: ${result.versionId}`);

  console.log('\n3. Verifying local SQLite database records...');
  const testRecord = await getTestById(result.testId);
  assert(
    testRecord && testRecord.title === 'Cambridge IELTS 19 Academic Reading Test 2',
    'Test record missing'
  );
  assert(
    testRecord!.isFreeTier === true && testRecord!.status === 'published',
    'Test should be published and free tier'
  );
  const versionRecord = await getVersionById(result.versionId);
  assert(versionRecord && versionRecord.passages.length === 3, 'Version must have 3 passages');
  assert(versionRecord!.questionGroups.length === 9, 'Must have 9 question groups');
  assert(versionRecord!.totalQuestions === 40, 'Total questions must be 40');
  console.log('   ✓ Database records verified');

  console.log('\n4. Verifying all 40 answer keys against the official Cambridge 19 key...');
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
  // Q4: labor / labour
  const q4 = allQuestions.find((item) => item.questionNumber === 4);
  assert(q4?.acceptedAlternatives?.includes('labor'), 'Q4 must accept "labor"');
  const markQ4 = markStudentAnswer({
    questionType: 'note_completion',
    userAnswer: 'labor',
    answerKey: q4!.answerKey,
    acceptedAlternatives: q4!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markQ4.isCorrect && markQ4.mark === 1, 'Q4 must score 1 mark for "labor"');

  // Q6: railway / railways
  const q6 = allQuestions.find((item) => item.questionNumber === 6);
  assert(q6?.acceptedAlternatives?.includes('railway'), 'Q6 must accept "railway"');
  const markQ6 = markStudentAnswer({
    questionType: 'note_completion',
    userAnswer: 'railway',
    answerKey: q6!.answerKey,
    acceptedAlternatives: q6!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markQ6.isCorrect && markQ6.mark === 1, 'Q6 must score 1 mark for "railway"');

  // Q22: visualization
  const q22 = allQuestions.find((item) => item.questionNumber === 22);
  assert(q22?.acceptedAlternatives?.includes('visualization'), 'Q22 must accept "visualization"');
  const markQ22 = markStudentAnswer({
    questionType: 'sentence_completion',
    userAnswer: 'visualization',
    answerKey: q22!.answerKey,
    acceptedAlternatives: q22!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markQ22.isCorrect && markQ22.mark === 1, 'Q22 must score 1 mark for "visualization"');
  console.log('   ✓ Accepted alternatives verified (labor, railway, visualization)');

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
    '\n>>> ALL CAMBRIDGE IELTS 19 ACADEMIC READING TEST 2 VERIFICATION TESTS PASSED SUCCESSFULLY! <<<\n'
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
