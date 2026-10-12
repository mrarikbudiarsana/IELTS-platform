import { spawnSync } from 'node:child_process';
const tests = ['runTests', 'runListeningTests', 'runClassTests', 'runSpeakingTests', 'runWritingTests', 'runAiSpeakingTests', 'runCommercialTests', 'testCambridge21Ingestion', 'testCambridge21ReadingTest1Ingestion', 'testCambridge21ListeningTest2Ingestion', 'testCambridge21ReadingTest2Ingestion', 'testCambridge21ReadingTest3Ingestion', 'testCambridge21ListeningTest3Ingestion', 'testCambridge21ListeningTest4Ingestion', 'testCambridge19ListeningTest1Ingestion', 'testChronologicalOrder'];
for (const test of tests) {
  const result = spawnSync(process.execPath, ['--import','tsx','test/runPostgresModule.ts',`test/${test}.ts`], {stdio:'inherit'});
  if (result.status !== 0) { process.exitCode = result.status || 1; break; }
}
if (!process.exitCode) console.log('All application suites passed on PostgreSQL.');
