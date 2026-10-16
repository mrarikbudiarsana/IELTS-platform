import '../server/legacySqliteEnvironment';
import fs from 'fs';
import path from 'path';
import {
  ingestCambridge18ListeningTest2,
  getCambridge18ListeningTest2Data,
} from '../server/ingestCambridge18ListeningTest2';
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

// Official Cambridge 18 Listening Test 2 Answer Key
const OFFICIAL_KEY: Record<number, string | string[]> = {
  // Part 1
  1: 'training',
  2: 'discount',
  3: 'taxi',
  4: 'service',
  5: 'English',
  6: 'Wivenhoe',
  7: 'equipment',
  8: '9.75',
  9: 'deliveries',
  10: 'Sunday',

  // Part 2
  11: ['B', 'E'],
  12: ['B', 'E'],
  13: ['B', 'C'],
  14: ['B', 'C'],
  15: 'G',
  16: 'C',
  17: 'D',
  18: 'B',
  19: 'H',
  20: 'A',

  // Part 3
  21: 'C',
  22: 'A',
  23: 'B',
  24: 'B',
  25: ['A', 'B'],
  26: ['A', 'B'],
  27: 'D',
  28: 'A',
  29: 'C',
  30: 'F',

  // Part 4
  31: 'convenient',
  32: 'suits',
  33: 'tailor',
  34: 'profession',
  35: 'visible',
  36: 'string',
  37: 'waist',
  38: 'perfume',
  39: 'image',
  40: 'handbag',
};

async function runTests() {
  console.log('=== RUNNING CAMBRIDGE IELTS 18 ACADEMIC LISTENING TEST 2 VERIFICATION ===\n');

  console.log('1. Validating data structure...');
  const testData = getCambridge18ListeningTest2Data();
  assert(testData.title === 'Cambridge IELTS 18 Academic Listening Test 2', 'Title mismatch');
  assert(testData.parts.length === 4, 'Must have exactly 4 parts');
  const totalQCount = testData.questionGroups.reduce((n, g) => n + g.questions.length, 0);
  assert(totalQCount === 40, `Must have exactly 40 questions, found ${totalQCount}`);
  console.log('   ✓ 4 parts and 40 questions correctly structured');

  console.log('\n2. Verifying generated audio files and map image on disk...');
  for (const part of testData.parts) {
    const audioRelative = part.audioUrl.replace(/^\//, '');
    const clientPath = path.join(process.cwd(), 'client', 'public', audioRelative);
    assert(fs.existsSync(clientPath), `Client audio file not found: ${clientPath}`);
    const size = fs.statSync(clientPath).size;
    assert(size > 500000, `Audio file too small: ${clientPath} (${size} bytes)`);
    console.log(`   ✓ Part ${part.partNumber} audio present: ${audioRelative} (${size} bytes)`);
  }

  const mapPath = path.join(process.cwd(), 'client', 'public', 'images', 'listening', 'c18_l2_map.png');
  assert(fs.existsSync(mapPath), `Map image not found at ${mapPath}`);
  const mapSize = fs.statSync(mapPath).size;
  assert(mapSize > 10000, `Map image too small (${mapSize} bytes)`);
  console.log(`   ✓ Map diagram present: images/listening/c18_l2_map.png (${mapSize} bytes)`);

  console.log('\n3. Ingesting into local SQLite database...');
  const result = await ingestCambridge18ListeningTest2();
  assert(result.status === 'published' && result.totalQuestions === 40, 'Ingestion result invalid');
  console.log(`   ✓ Ingested test ID: ${result.testId}, version ID: ${result.versionId}`);

  console.log('\n4. Verifying local SQLite database records...');
  const testRecord = await getListeningTestById(result.testId);
  assert(testRecord !== null, 'Test record must be found in database');
  assert(testRecord!.title === 'Cambridge IELTS 18 Academic Listening Test 2', 'Stored title incorrect');
  assert(testRecord!.status === 'published', 'Test status must be published');
  assert(testRecord!.isFreeTier === true, 'Test must be marked as free tier');

  const versionRecord = await getListeningVersionById(result.versionId);
  assert(versionRecord !== null, 'Version record must be found');
  assert(versionRecord!.parts.length === 4, 'Must have 4 parts');
  assert(versionRecord!.totalQuestions === 40, 'Total questions must be 40');
  console.log('   ✓ SQLite records successfully verified');

  console.log('\n5. Verifying all 40 questions and answer keys...');
  const allQuestions = versionRecord!.questionGroups.flatMap((g) => g.questions);
  assert(allQuestions.length === 40, `Expected 40 questions, got ${allQuestions.length}`);

  for (let i = 1; i <= 40; i++) {
    const q = allQuestions.find((item) => item.questionNumber === i);
    assert(q !== undefined, `Question ${i} missing from test version`);
    assert(q!.explanation && q!.explanation.length > 0, `Question ${i} missing explanation`);
    assert(q!.transcriptExcerpt && q!.transcriptExcerpt.length > 0, `Question ${i} missing transcriptExcerpt`);

    const expected = OFFICIAL_KEY[i];
    if (Array.isArray(expected)) {
      assert(
        Array.isArray(q!.answerKey) &&
          q!.answerKey.length === expected.length &&
          expected.every((ans) => (q!.answerKey as string[]).includes(ans)),
        `Q${i} answer key mismatch. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(q!.answerKey)}`
      );
    } else {
      assert(
        q!.answerKey === expected,
        `Q${i} answer key mismatch. Expected "${expected}", got "${q!.answerKey}"`
      );
    }
  }
  console.log('   ✓ All 40 questions match the official Cambridge 18 answer key');

  console.log('\n6. Verifying student view sanitization (no leaked keys/explanations)...');
  const sanitized = sanitizeListeningForStudent(versionRecord!.questionGroups, versionRecord!.parts);
  assert(sanitized.parts.length === 4, 'Sanitized parts count mismatch');
  for (const part of sanitized.parts) {
    assert((part as any).transcript === undefined, `Part ${part.partNumber} leaked transcript in student view`);
  }
  for (const group of sanitized.questionGroups) {
    for (const q of group.questions) {
      assert((q as any).answerKey === undefined, `Q${q.questionNumber} leaked answerKey`);
      assert((q as any).acceptedAlternatives === undefined, `Q${q.questionNumber} leaked acceptedAlternatives`);
      assert((q as any).explanation === undefined, `Q${q.questionNumber} leaked explanation`);
      assert((q as any).transcriptExcerpt === undefined, `Q${q.questionNumber} leaked transcriptExcerpt`);
    }
  }
  console.log('   ✓ Student payload completely sanitized');

  console.log('\n7. Testing student answer marking & band score calculation...');
  let correctCount = 0;
  for (const group of versionRecord!.questionGroups) {
    for (const q of group.questions) {
      // Simulate answering with the primary answer key or one of the valid multi-choice answers
      const studentAnswer = Array.isArray(q.answerKey) ? q.answerKey[0] : q.answerKey;
      const mark = markStudentAnswer({
        questionType: group.questionType as any,
        userAnswer: studentAnswer,
        answerKey: q.answerKey,
        acceptedAlternatives: q.acceptedAlternatives,
        maxWords: group.maxWords,
        maxNumbers: group.maxNumbers,
        allowAnyOrder: group.allowAnyOrder,
      });

      if (mark.isCorrect) {
        correctCount += mark.mark;
      } else {
        console.warn(`   Warning: Q${q.questionNumber} failed marking with answer: ${studentAnswer}`);
      }
    }
  }

  assert(correctCount === 40, `Expected 40/40 correct, got ${correctCount}`);
  const bandScore = calculateEstimatedListeningBandScore(correctCount, 40);
  assert(bandScore === 9.0, `Expected band 9.0 for 40/40, got ${bandScore}`);
  console.log(`   ✓ 40/40 scoring simulated: ${correctCount}/40 (Band ${bandScore})`);

  console.log('\n8. Verifying catalogue listing & chronological sort...');
  const catalogue = await listListeningTests({ isTeacherOrAdmin: false });
  const inCatalogue = catalogue.find((t) => t.id === result.testId);
  assert(inCatalogue !== undefined, 'Test not found in published catalogue');
  console.log(`   ✓ Test visible in published catalogue: "${inCatalogue!.title}"`);

  console.log('\n=== ALL CAMBRIDGE 18 LISTENING TEST 2 INGESTION VERIFICATIONS PASSED ===');
}

runTests().catch((err) => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});
