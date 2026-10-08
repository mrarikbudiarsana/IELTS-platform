import { spawnSync } from 'child_process';
import path from 'path';

console.log('Running complete IELTS Test Verification Suite (Reading + Listening)...\n');

const res1 = spawnSync('npx', ['tsx', 'test/runTests.ts'], { stdio: 'inherit', shell: true });
if (res1.status !== 0) {
  process.exit(res1.status || 1);
}

const res2 = spawnSync('npx', ['tsx', 'test/runListeningTests.ts'], { stdio: 'inherit', shell: true });
if (res2.status !== 0) {
  process.exit(res2.status || 1);
}

const res3 = spawnSync('npx', ['tsx', 'test/runClassTests.ts'], { stdio: 'inherit', shell: true });
if (res3.status !== 0) {
  process.exit(res3.status || 1);
}

const res4 = spawnSync('npx', ['tsx', 'test/runSpeakingTests.ts'], { stdio: 'inherit', shell: true });
if (res4.status !== 0) {
  process.exit(res4.status || 1);
}

const res5 = spawnSync('npx', ['tsx', 'test/runWritingTests.ts'], { stdio: 'inherit', shell: true });
if (res5.status !== 0) {
  process.exit(res5.status || 1);
}

console.log('\n========================================================================');
console.log('  ALL PLATFORM MODULE TESTS (READING, LISTENING, CLASSES, SPEAKING & WRITING) PASSED! ');
console.log('========================================================================\n');
