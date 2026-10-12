import { ingestCambridge19ListeningTest1, getCambridge19ListeningTest1Data } from '../server/ingestCambridge19ListeningTest1';
import { getListeningTestById, getListeningVersionById, listListeningTests, sanitizeListeningForStudent } from '../server/listeningService';
import { markStudentAnswer, calculateEstimatedBandScore } from '../shared/scoring';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

// Official answer key (Cambridge IELTS 19, Listening Test 1)
const OFFICIAL_KEY: Record<number, string | string[]> = {
  1: '69', 2: 'stream', 3: 'data', 4: 'map', 5: 'visitors', 6: 'sounds', 7: 'freedom', 8: 'skills', 9: '4.95', 10: 'leaders',
  11: 'B', 12: 'A', 13: 'B', 14: 'C', 15: 'A', 16: 'G', 17: 'C', 18: 'B', 19: 'D', 20: 'A',
  21: ['B', 'D'], 22: ['B', 'D'], 23: ['A', 'E'], 24: ['A', 'E'],
  25: 'D', 26: 'G', 27: 'C', 28: 'B', 29: 'F', 30: 'H',
  31: 'walls', 32: 'son', 33: 'fuel', 34: 'oxygen', 35: 'rectangular', 36: 'lamps', 37: 'family', 38: 'winter', 39: 'soil', 40: 'rain',
};

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 19 LISTENING TEST 1 VERIFICATION ===\n');

  console.log('1. Validating data structure...');
  const testData = getCambridge19ListeningTest1Data();
  assert(testData.title === 'Cambridge IELTS 19 Academic Listening Test 1', 'Title mismatch');
  assert(testData.parts.length === 4, 'Must have exactly 4 parts');
  const totalQCount = testData.questionGroups.reduce((n, g) => n + g.questions.length, 0);
  assert(totalQCount === 40, `Must have exactly 40 questions, found ${totalQCount}`);
  console.log('   ✓ 4 parts and 40 questions correctly structured');

  console.log('\n2. Ingesting into platform database...');
  const result = (await ingestCambridge19ListeningTest1());
  assert(result.status === 'published' && result.totalQuestions === 40, 'Ingestion result invalid');
  console.log(`   ✓ Ingested: ${result.testId}`);

  console.log('\n3. Verifying database records...');
  const testRecord = (await getListeningTestById(result.testId));
  assert(testRecord && testRecord.title === 'Cambridge IELTS 19 Academic Listening Test 1', 'Test record missing');
  assert(testRecord!.isFreeTier === true && testRecord!.status === 'published', 'Test should be published and free tier');
  const versionRecord = (await getListeningVersionById(result.versionId));
  assert(versionRecord && versionRecord.parts.length === 4, 'Version must have 4 parts');
  assert(versionRecord!.questionGroups.length === 7, 'Must have 7 question groups');
  assert(versionRecord!.totalQuestions === 40, 'Total questions must be 40');
  console.log('   ✓ Database records verified');

  console.log('\n4. Verifying map labelling configuration (Questions 16–20)...');
  const mapGroup = versionRecord!.questionGroups.find((g) => g.questionType === 'plan_map_diagram_labelling');
  assert(mapGroup && mapGroup.mapData?.imageUrl, 'Map group must have an image');
  assert(mapGroup!.optionsList!.length === 8, 'Map must have options A–H');
  console.log('   ✓ Farley House map configured with options A–H');

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
      assert(mark.isCorrect && mark.mark === 1, `Q${q.questionNumber} failed to self-score`);
      totalScore += mark.mark;
    }
  }
  assert(totalScore === 40, `Full score must be 40, got ${totalScore}`);
  assert(calculateEstimatedBandScore(40, 40, 'academic') === 9.0, '40/40 must yield Band 9.0');
  console.log('   ✓ 40/40 -> Band 9');

  console.log('\n>>> ALL CAMBRIDGE IELTS 19 LISTENING TEST 1 VERIFICATION TESTS PASSED SUCCESSFULLY! <<<\n');
}

async function runEntryPoint() {
await runTests();

}
export const testCompleted = runEntryPoint();
testCompleted.catch(error => { console.error(error); process.exitCode = 1; });
