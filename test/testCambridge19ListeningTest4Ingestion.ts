import '../server/legacySqliteEnvironment';
import fs from 'fs';
import path from 'path';
import {
  ingestCambridge19ListeningTest4,
  getCambridge19ListeningTest4Data,
} from '../server/ingestCambridge19ListeningTest4';
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

// Official Cambridge 19 Listening Test 4 Answer Key
const OFFICIAL_KEY: Record<number, string | string[]> = {
  // Part 1
  1: 'Kaeden',
  2: 'lockers', // accepted: 'lockers', 'locker'
  3: 'passport',
  4: 'uniform',
  5: 'third', // accepted: 'third', '3rd', '3'
  6: '0412665903',
  7: 'yellow',
  8: 'plastic',
  9: 'ice',
  10: 'gloves',

  // Part 2
  11: ['C', 'E'],
  12: ['C', 'E'],
  13: ['A', 'D'],
  14: ['A', 'D'],
  15: 'A',
  16: 'B',
  17: 'C',
  18: 'A',
  19: 'C',
  20: 'B',

  // Part 3
  21: 'A',
  22: 'C',
  23: 'A',
  24: 'B',
  25: 'C',
  26: 'D',
  27: 'F',
  28: 'A',
  29: 'C',
  30: 'G',

  // Part 4
  31: 'competition',
  32: 'food',
  33: 'disease',
  34: 'agriculture',
  35: 'maps',
  36: 'cattle',
  37: 'speed',
  38: 'monkeys',
  39: 'fishing',
  40: 'flooding',
};

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 19 ACADEMIC LISTENING TEST 4 VERIFICATION ===\n');

  console.log('1. Validating data structure...');
  const testData = getCambridge19ListeningTest4Data();
  assert(testData.title === 'Cambridge IELTS 19 Academic Listening Test 4', 'Title mismatch');
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
  const result = await ingestCambridge19ListeningTest4();
  assert(result.status === 'published' && result.totalQuestions === 40, 'Ingestion result invalid');
  console.log(`   ✓ Ingested test ID: ${result.testId}, version ID: ${result.versionId}`);

  console.log('\n4. Verifying local SQLite database records...');
  const testRecord = await getListeningTestById(result.testId);
  assert(
    testRecord && testRecord.title === 'Cambridge IELTS 19 Academic Listening Test 4',
    'Test record missing'
  );
  assert(
    testRecord!.isFreeTier === true && testRecord!.status === 'published',
    'Test should be published and free tier'
  );
  const versionRecord = await getListeningVersionById(result.versionId);
  assert(versionRecord && versionRecord.parts.length === 4, 'Version must have 4 parts');
  assert(versionRecord!.questionGroups.length === 9, 'Must have 9 question groups');
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
  // Q2: locker
  const q2 = allQuestions.find((item) => item.questionNumber === 2);
  assert(q2?.acceptedAlternatives?.includes('locker'), 'Q2 must accept "locker"');
  const markQ2 = markStudentAnswer({
    questionType: 'note_completion',
    userAnswer: 'locker',
    answerKey: q2!.answerKey,
    acceptedAlternatives: q2!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markQ2.isCorrect && markQ2.mark === 1, 'Q2 must score 1 mark for "locker"');

  // Q5: 3rd
  const q5 = allQuestions.find((item) => item.questionNumber === 5);
  assert(q5?.acceptedAlternatives?.includes('3rd'), 'Q5 must accept "3rd"');
  const markQ5 = markStudentAnswer({
    questionType: 'note_completion',
    userAnswer: '3rd',
    answerKey: q5!.answerKey,
    acceptedAlternatives: q5!.acceptedAlternatives,
  });
  assert(markQ5.isCorrect && markQ5.mark === 1, 'Q5 must score 1 mark for "3rd"');

  // Q38: monkey
  const q38 = allQuestions.find((item) => item.questionNumber === 38);
  assert(q38?.acceptedAlternatives?.includes('monkey'), 'Q38 must accept "monkey"');
  const markQ38 = markStudentAnswer({
    questionType: 'note_completion',
    userAnswer: 'monkey',
    answerKey: q38!.answerKey,
    acceptedAlternatives: q38!.acceptedAlternatives,
    maxWords: 1,
  });
  assert(markQ38.isCorrect && markQ38.mark === 1, 'Q38 must score 1 mark for "monkey"');
  console.log('   ✓ Accepted alternatives verified (locker, 3rd, monkey)');

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
    '\n>>> ALL CAMBRIDGE IELTS 19 ACADEMIC LISTENING TEST 4 VERIFICATION TESTS PASSED SUCCESSFULLY! <<<\n'
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
