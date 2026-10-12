import { startPostgres } from './postgresHarness';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
async function main() {
  const pg = await startPostgres();
  try {
    const { seedLocalDatabase } = await import('../server/seedLocalDatabase');
    await seedLocalDatabase();
    const { db } = await import('../server/db');
    await db.prepare("INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, 'test-only', 'Test Teacher', 'teacher')").run('pg-fixture-teacher','pg-fixture-teacher@test.invalid');
    const file = process.argv[2];
    if (!file || !file.startsWith('test/')) throw new Error('Expected a test module.');
    const tests = await import(pathToFileURL(path.resolve(file)).href);
    await tests.testCompleted;
  } finally { await pg.close(); }
}
main().catch(error => { console.error(error.code || error.message); process.exitCode = 1; });
