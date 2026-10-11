import { sortTestsChronological, parseCambridgeTestInfo } from '../shared/testOrder';
import { listTests } from '../server/readingService';
import { listListeningTests } from '../server/listeningService';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

console.log('=== RUNNING CHRONOLOGICAL TEST ORDER VERIFICATION ===\n');

// 1. Verify parser
console.log('1. Verifying Cambridge title parser...');
const p1 = parseCambridgeTestInfo('Cambridge IELTS 21 Academic Reading Test 4');
assert(p1?.series === 21 && p1?.testNumber === 4, 'Failed to parse C21 Test 4');

const p2 = parseCambridgeTestInfo('Cambridge 21 Academic Listening Test 1');
assert(p2?.series === 21 && p2?.testNumber === 1, 'Failed to parse C21 Test 1');

const p3 = parseCambridgeTestInfo('Cambridge IELTS 20 Academic Reading Test 3');
assert(p3?.series === 20 && p3?.testNumber === 3, 'Failed to parse C20 Test 3');
console.log('   ✓ Title parser verified');

// 2. Verify sorting logic
console.log('\n2. Verifying test order comparator: Latest series first, and 4 -> 1 within series...');
const inputTests = [
  { title: 'Cambridge IELTS 21 Academic Reading Test 1' },
  { title: 'Cambridge IELTS 20 Academic Reading Test 4' },
  { title: 'Cambridge IELTS 21 Academic Reading Test 4' },
  { title: 'Cambridge IELTS 21 Academic Reading Test 2' },
  { title: 'Cambridge IELTS 20 Academic Reading Test 1' },
];

const sorted = sortTestsChronological(inputTests);
const expectedTitles = [
  'Cambridge IELTS 21 Academic Reading Test 4',
  'Cambridge IELTS 21 Academic Reading Test 2',
  'Cambridge IELTS 21 Academic Reading Test 1',
  'Cambridge IELTS 20 Academic Reading Test 4',
  'Cambridge IELTS 20 Academic Reading Test 1',
];

assert(
  JSON.stringify(sorted.map((t) => t.title)) === JSON.stringify(expectedTitles),
  `Order mismatch:\nGot: ${JSON.stringify(sorted.map((t) => t.title), null, 2)}\nExpected: ${JSON.stringify(expectedTitles, null, 2)}`
);
console.log('   ✓ Chronological order verified: Cambridge 21 (Test 4 -> Test 2 -> Test 1) then Cambridge 20');

// 3. Verify actual reading service output
console.log('\n3. Verifying actual Reading catalogue order from server readingService...');
const readingTests = listTests({ isTeacherOrAdmin: false });
const c21ReadingTitles = readingTests
  .map((t) => t.title)
  .filter((title) => title.includes('Cambridge'));

console.log('Actual Reading catalogue order:', c21ReadingTitles);
assert(c21ReadingTitles[0].includes('Test 4'), 'First test must be Test 4');
assert(c21ReadingTitles[1].includes('Test 3'), 'Second test must be Test 3');
assert(c21ReadingTitles[2].includes('Test 2'), 'Third test must be Test 2');
assert(c21ReadingTitles[3].includes('Test 1'), 'Fourth test must be Test 1');
console.log('   ✓ Actual Reading catalogue order is strictly Test 4 -> Test 3 -> Test 2 -> Test 1');

// 4. Verify actual listening service output
console.log('\n4. Verifying actual Listening catalogue order from server listeningService...');
const listeningTests = listListeningTests({ isTeacherOrAdmin: false });
const c21ListeningTitles = listeningTests
  .map((t) => t.title)
  .filter((title) => title.includes('Cambridge'));

console.log('Actual Listening catalogue order:', c21ListeningTitles);
assert(c21ListeningTitles[0].includes('Test 4'), 'First listening test must be Test 4 (latest)');
assert(c21ListeningTitles[1].includes('Test 3'), 'Second listening test must be Test 3');
assert(c21ListeningTitles[2].includes('Test 2'), 'Third listening test must be Test 2');
assert(c21ListeningTitles[3].includes('Test 1'), 'Fourth listening test must be Test 1 (earliest)');
console.log('   ✓ Actual Listening catalogue order is strictly Test 4 -> Test 3 -> Test 2 -> Test 1');

console.log('\n======================================================');
console.log('🎉 ALL CHRONOLOGICAL TEST ORDER VERIFICATIONS PASSED! 🎉');
console.log('======================================================\n');
