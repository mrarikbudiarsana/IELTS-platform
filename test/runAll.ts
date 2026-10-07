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

console.log('\n=============================================================');
console.log('  ALL PLATFORM MODULE TESTS (READING & LISTENING) PASSED!     ');
console.log('=============================================================\n');
