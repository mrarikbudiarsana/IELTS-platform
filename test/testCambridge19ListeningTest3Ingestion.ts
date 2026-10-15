import fs from 'fs';
import path from 'path';
import {
  ingestCambridge19ListeningTest3,
  getCambridge19ListeningTest3Data,
} from '../server/ingestCambridge19ListeningTest3';
import {
  getListeningTestById,
  getListeningVersionById,
  listListeningTests,
  sanitizeListeningForStudent,
} from '../server/listeningService';
import { markStudentAnswer, calculateEstimatedListeningBandScore } from '../shared/scoring';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

// Official Cambridge 19 Listening Test 3 Answer Key from uploaded image
const OFFICIAL_KEY: Record<number, string | string[]> = {
  // Part 1
  1: 'harbour', // accepted: 'harbour', 'harbor'
  2: 'bridge',
  3: '3.30', // accepted: '3.30', '3:30', 'three thirty', 'half 3', 'half past 3', etc.
  4: 'Rose', // accepted: 'Rose', 'rose'
  5: 'sign',
  6: 'purple',
  7: 'samphire',
  8: 'melon',
  9: 'coconut',
  10: 'strawberry',

  // Part 2
  11: 'C',
  12: 'D',
  13: 'F',
  14: 'G',
  15: 'B',
  16: 'H',
  17: ['D', 'E'],
  18: ['D', 'E'],
  19: ['B', 'C'],
  20: ['B', 'C'],

  // Part 3
  21: 'C',
  22: 'B',
  23: 'A',
  24: 'A',
  25: 'C',
  26: 'C',
  27: 'H',
  28: 'E',
  29: 'B',
  30: 'F',

  // Part 4
  31: 'clothing',
  32: 'mouths',
  33: 'salt',
  34: 'toothpaste',
  35: 'fertilisers', // accepted: 'fertilisers', 'fertilizers'
  36: 'nutrients',
  37: 'growth',
  38: 'weight',
  39: 'acid',
  40: 'society',
};

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 19 ACADEMIC LISTENING TEST 3 VERIFICATION ===\n');

  console.log('1. Validating data structure...');
  const testData = getCambridge19ListeningTest3Data();
  assert(testData.title === 'Cambridge IELTS 19 Academic Listening Test 3', 'Title mismatch');
  assert(testData.parts.length === 4, 'Must have exactly 4 parts');
  const totalQCount = testData.questionGroups.reduce((n, g) => n + g.questions.length, 0);
  assert(totalQCount === 40, `Must have exactly 40 questions, found ${totalQCount}`);
  console.log('   ✓ 4 parts and 40 questions correctly structured');

  console.log('\n2. Verifying generated audio files on disk...');
  for (const part of testData.parts) {
    const audioRelative = part.audioUrl.replace(/^\//, '');
    const clientPath = path.join(process.cwd(), 'client', 'public', audioRelative);
    assert(fs.existsSync(clientPath), `Client audio file not found: ${clientPath}`);
    const size = fs.statSync(clientPath).size;
    assert(size > 500000, `Audio file too small: ${clientPath} (${size} bytes)`);
    console.log(`   ✓ Part ${part.partNumber} audio present: ${audioRelative} (${size} bytes)`);
  }

  console.log('\n3. Ingesting into local SQLite database...');
  const result = await ingestCambridge19ListeningTest3();
  assert(result.status === 'published' && result.totalQuestions === 40, 'Ingestion result invalid');
  console.log(`   ✓ Ingested test ID: ${result.testId}, version ID: ${result.versionId}`);

  console.log('\n4. Verifying local SQLite database records...');
  const testRecord = await getListeningTestById(result.testId);
  assert(
    testRecord && testRecord.title === 'Cambridge IELTS 19 Academic Listening Test 3',
    'Test record missing'
  );
  assert(
    testRecord!.isFreeTier === true && testRecord!.status === 'published',
    'Test should be published and free tier'
  );
  const versionRecord = await getListeningVersionById(result.versionId);
  assert(versionRecord && versionRecord.parts.length === 4, 'Version must have 4 parts');
  assert(versionRecord!.questionGroups.length === 8, 'Must have 8 question groups');
  assert(versionRecord!.totalQuestions === 40, 'Total questions must be 40');
  console.log('   ✓ Database records verified');

  console.log('\n5. Verifying all 40 answer keys against the official Cambridge 19 key...');
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

  console.log('\n6. Verifying accepted alternatives...');
  // Q1: harbor
  const q1 = allQuestions.find((item) => item.questionNumber === 1);
  assert(q1?.acceptedAlternatives?.includes('harbor'), 'Q1 must accept "harbor"');
  const markQ1 = markStudentAnswer({
    questionType: 'note_completion',
    userAnswer: 'harbor',
    answerKey: q1!.answerKey,
    acceptedAlternatives: q1!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markQ1.isCorrect && markQ1.mark === 1, 'Q1 must score 1 mark for "harbor"');

  // Q3: three thirty
  const q3 = allQuestions.find((item) => item.questionNumber === 3);
  assert(q3?.acceptedAlternatives?.includes('three thirty'), 'Q3 must accept "three thirty"');
  const markQ3 = markStudentAnswer({
    questionType: 'note_completion',
    userAnswer: 'three thirty',
    answerKey: q3!.answerKey,
    acceptedAlternatives: q3!.acceptedAlternatives,
  });
  assert(markQ3.isCorrect && markQ3.mark === 1, 'Q3 must score 1 mark for "three thirty"');

  // Q35: fertilizers
  const q35 = allQuestions.find((item) => item.questionNumber === 35);
  assert(q35?.acceptedAlternatives?.includes('fertilizers'), 'Q35 must accept "fertilizers"');
  const markQ35 = markStudentAnswer({
    questionType: 'note_completion',
    userAnswer: 'fertilizers',
    answerKey: q35!.answerKey,
    acceptedAlternatives: q35!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markQ35.isCorrect && markQ35.mark === 1, 'Q35 must score 1 mark for "fertilizers"');
  console.log('   ✓ Accepted alternatives verified (harbor, three thirty, fertilizers)');

  console.log('\n7. Verifying student payload sanitization...');
  const sanitized = sanitizeListeningForStudent(
    versionRecord!.questionGroups,
    versionRecord!.parts
  );
  for (const part of sanitized.parts) {
    assert((part as any).transcript === undefined, 'Sanitized part leaked transcript');
  }
  for (const group of sanitized.questionGroups) {
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

  console.log('\n8. Verifying catalogue visibility...');
  const found = (await listListeningTests({ isTeacherOrAdmin: false })).find(
    (t) => t.id === result.testId
  );
  assert(found !== undefined, 'Test must appear in student catalogue');
  console.log(`   ✓ Visible: "${found!.title}"`);

  console.log('\n9. Running perfect 40/40 scoring simulation...');
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
  assert(calculateEstimatedListeningBandScore(40, 40) === 9.0, '40/40 must yield Band 9.0');
  console.log('   ✓ 40/40 -> Band 9.0');

  console.log(
    '\n>>> ALL CAMBRIDGE IELTS 19 ACADEMIC LISTENING TEST 3 VERIFICATION TESTS PASSED SUCCESSFULLY! <<<\n'
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
