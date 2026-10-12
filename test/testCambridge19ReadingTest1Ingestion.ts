import { ingestCambridge19ReadingTest1, getCambridge19ReadingTest1Data } from '../server/ingestCambridge19ReadingTest1';
import { getTestById, getVersionById, listTests, sanitizeQuestionsForStudent } from '../server/readingService';
import { markStudentAnswer, calculateEstimatedBandScore } from '../shared/scoring';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

// Official answer key from Cambridge IELTS 19 Academic Reading Test 1
const OFFICIAL_KEY: Record<number, string | string[]> = {
  // Passage 1
  1: 'FALSE',
  2: 'FALSE',
  3: 'NOT GIVEN',
  4: 'FALSE',
  5: 'NOT GIVEN',
  6: 'TRUE',
  7: 'TRUE',
  8: 'paint',
  9: 'topspin',
  10: 'training',
  11: 'intestines', // acceptedAlternatives: ['gut']
  12: 'weights',
  13: 'grips',

  // Passage 2
  14: 'D',
  15: 'G',
  16: 'C',
  17: 'A',
  18: 'G',
  19: 'B',
  20: ['B', 'D'],
  21: ['B', 'D'],
  22: ['C', 'E'],
  23: ['C', 'E'],
  24: 'grain',
  25: 'punishment',
  26: 'ransom',

  // Passage 3
  27: 'D',
  28: 'A',
  29: 'C',
  30: 'D',
  31: 'G',
  32: 'J',
  33: 'H',
  34: 'B',
  35: 'E',
  36: 'C',
  37: 'YES',
  38: 'NOT GIVEN',
  39: 'NO',
  40: 'NOT GIVEN',
};

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 19 ACADEMIC READING TEST 1 VERIFICATION ===\n');

  console.log('1. Validating data structure...');
  const testData = getCambridge19ReadingTest1Data();
  assert(testData.title === 'Cambridge IELTS 19 Academic Reading Test 1', 'Title mismatch');
  assert(testData.passages.length === 3, 'Must have exactly 3 passages');
  const totalQCount = testData.questionGroups.reduce((n, g) => n + g.questions.length, 0);
  assert(totalQCount === 40, `Must have exactly 40 questions, found ${totalQCount}`);
  console.log('   ✓ 3 passages and 40 questions correctly structured');

  console.log('\n2. Ingesting into local SQLite database...');
  const result = (await ingestCambridge19ReadingTest1());
  assert(result.status === 'published' && result.totalQuestions === 40, 'Ingestion result invalid');
  console.log(`   ✓ Ingested test ID: ${result.testId}, version ID: ${result.versionId}`);

  console.log('\n3. Verifying local SQLite database records...');
  const testRecord = (await getTestById(result.testId));
  assert(testRecord && testRecord.title === 'Cambridge IELTS 19 Academic Reading Test 1', 'Test record missing');
  assert(testRecord!.isFreeTier === true && testRecord!.status === 'published', 'Test should be published and free tier');
  const versionRecord = (await getVersionById(result.versionId));
  assert(versionRecord && versionRecord.passages.length === 3, 'Version must have 3 passages');
  assert(versionRecord!.questionGroups.length === 9, 'Must have 9 question groups');
  assert(versionRecord!.totalQuestions === 40, 'Total questions must be 40');
  console.log('   ✓ Database records verified');

  console.log('\n4. Verifying all 40 answer keys against the official key...');
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

  console.log('\n5. Verifying accepted alternatives (e.g. Q11 intestines/gut)...');
  const q11 = allQuestions.find((item) => item.questionNumber === 11);
  assert(q11?.acceptedAlternatives?.includes('gut'), 'Q11 must accept "gut" as alternative');
  const markGut = markStudentAnswer({
    questionType: 'note_completion',
    userAnswer: 'gut',
    answerKey: q11!.answerKey,
    acceptedAlternatives: q11!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markGut.isCorrect && markGut.mark === 1, 'Q11 must score 1 mark for "gut"');
  console.log('   ✓ Q11 acceptedAlternatives verified');

  console.log('\n6. Verifying student payload sanitization...');
  const sanitized = sanitizeQuestionsForStudent(versionRecord!.questionGroups);
  for (const group of sanitized) {
    for (const q of group.questions) {
      assert((q as any).answerKey === undefined, `Q${q.questionNumber} leaked answerKey`);
      assert((q as any).explanation === undefined, `Q${q.questionNumber} leaked explanation`);
      assert((q as any).acceptedAlternatives === undefined, `Q${q.questionNumber} leaked acceptedAlternatives`);
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
      assert(mark.isCorrect && mark.mark === 1, `Q${q.questionNumber} failed to self-score: ${JSON.stringify(mark)}`);
      totalScore += mark.mark;
    }
  }
  assert(totalScore === 40, `Full score must be 40, got ${totalScore}`);
  assert(calculateEstimatedBandScore(40, 40, 'academic') === 9.0, '40/40 must yield Band 9.0');
  console.log('   ✓ 40/40 -> Band 9.0');

  console.log('\n>>> ALL CAMBRIDGE IELTS 19 ACADEMIC READING TEST 1 VERIFICATION TESTS PASSED SUCCESSFULLY! <<<\n');
}

async function runEntryPoint() {
await runTests();

}
export const testCompleted = runEntryPoint();
testCompleted.catch(error => { console.error(error); process.exitCode = 1; });
