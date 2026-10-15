import { ingestCambridge19ListeningTest2, getCambridge19ListeningTest2Data } from '../server/ingestCambridge19ListeningTest2';
import { getListeningTestById, getListeningVersionById, listListeningTests, sanitizeListeningForStudent } from '../server/listeningService';
import { markStudentAnswer } from '../shared/scoring';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

// Official answer key (Cambridge IELTS 19, Listening Test 2)
const OFFICIAL_KEY: Record<number, string | string[]> = {
  1: 'Mathieson', 2: 'beginners', 3: 'college', 4: 'New', 5: '11', 6: 'instrument', 7: 'ear', 8: 'clapping', 9: 'recording', 10: 'alone',
  11: 'A', 12: 'B', 13: 'A', 14: 'B', 15: 'C', 16: 'A',
  17: ['C', 'E'], 18: ['C', 'E'],
  19: ['A', 'B'], 20: ['A', 'B'],
  21: 'A', 22: 'B', 23: 'B', 24: 'B',
  25: 'E', 26: 'B', 27: 'A', 28: 'C',
  29: 'C', 30: 'A',
  31: 'move', 32: 'short', 33: 'discs', 34: 'oxygen', 35: 'tube', 36: 'temperatures', 37: 'protein', 38: 'space', 39: 'seaweed', 40: 'endangered',
};

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 19 LISTENING TEST 2 VERIFICATION ===\n');

  console.log('1. Validating data structure...');
  const testData = getCambridge19ListeningTest2Data();
  assert(testData.title === 'Cambridge IELTS 19 Academic Listening Test 2', 'Title mismatch');
  assert(testData.parts.length === 4, 'Must have exactly 4 parts');
  const totalQCount = testData.questionGroups.reduce((n, g) => n + g.questions.length, 0);
  assert(totalQCount === 40, `Must have exactly 40 questions, found ${totalQCount}`);
  console.log('   ✓ 4 parts and 40 questions correctly structured');

  console.log('\n2. Ingesting into platform database...');
  const result = (await ingestCambridge19ListeningTest2());
  assert(result.status === 'published' && result.totalQuestions === 40, 'Ingestion result invalid');
  console.log(`   ✓ Ingested: ${result.testId}`);

  console.log('\n3. Verifying database records...');
  const testRecord = (await getListeningTestById(result.testId));
  assert(testRecord && testRecord.title === 'Cambridge IELTS 19 Academic Listening Test 2', 'Test record missing');
  assert(testRecord!.isFreeTier === true && testRecord!.status === 'published', 'Test should be published and free tier');
  const versionRecord = (await getListeningVersionById(result.versionId));
  assert(versionRecord && versionRecord.parts.length === 4, 'Version must have 4 parts');
  assert(versionRecord!.questionGroups.length === 9, `Must have 9 question groups, found ${versionRecord!.questionGroups.length}`);
  assert(versionRecord!.totalQuestions === 40, 'Total questions must be 40');
  console.log('   ✓ Database records verified');

  console.log('\n4. Verifying form & table configuration...');
  const formGroup = versionRecord!.questionGroups.find((g) => g.questionType === 'form_completion');
  assert(formGroup && formGroup.formData?.fields.length === 7, 'Form group must have 7 fields');
  const tableGroup = versionRecord!.questionGroups.find((g) => g.questionType === 'table_completion');
  assert(tableGroup && tableGroup.tableData?.rows.length === 5, 'Table group must have 5 rows');
  console.log('   ✓ Guitar Group form and lesson table verified');

  console.log('\n5. Verifying all 40 answer keys against the official key...');
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

  console.log('\n6. Verifying student payload sanitization...');
  const sanitized = sanitizeListeningForStudent(versionRecord!.questionGroups, versionRecord!.parts);
  for (const part of sanitized.parts) {
    assert((part as any).transcript === undefined, 'Sanitized part leaked transcript');
  }
  for (const group of sanitized.questionGroups) {
    for (const q of group.questions) {
      assert((q as any).answerKey === undefined, `Q${q.questionNumber} leaked answerKey`);
      assert((q as any).explanation === undefined, `Q${q.questionNumber} leaked explanation`);
    }
  }
  console.log('   ✓ Student payloads securely scrubbed');

  console.log('\n7. Verifying catalogue visibility...');
  const found = (await listListeningTests({ isTeacherOrAdmin: false })).find((t) => t.id === result.testId);
  assert(found !== undefined, 'Test must appear in catalogue');
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
  console.log(`   ✓ Scoring simulation: ${totalScore}/40`);

  console.log('\n>>> All Cambridge IELTS 19 Academic Listening Test 2 verification tests PASSED! <<<');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
