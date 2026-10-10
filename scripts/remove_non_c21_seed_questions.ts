import Database from 'better-sqlite3';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envPath = path.resolve('.env.local');
const env: Record<string, string> = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
  });
}

const sqliteDb = new Database('./data/ielts_platform.sqlite');

async function main() {
  console.log('======================================================');
  console.log(' PURGING ALL SEED QUESTIONS EXCEPT CAMBRIDGE 21');
  console.log('======================================================\n');

  // --- 1. LOCAL SQLITE PURGE ---
  console.log('--- 1. Purging local SQLite database ---');

  const c21Reading = sqliteDb
    .prepare("SELECT * FROM reading_tests WHERE title LIKE '%Cambridge%21%' LIMIT 1")
    .get() as any;
  const c21Listening = sqliteDb
    .prepare("SELECT * FROM listening_tests WHERE title LIKE '%Cambridge%21%' LIMIT 1")
    .get() as any;

  if (!c21Reading) {
    throw new Error('Cambridge 21 Reading test not found in SQLite!');
  }
  if (!c21Listening) {
    throw new Error('Cambridge 21 Listening test not found in SQLite!');
  }

  console.log(`Retaining Reading Test: "${c21Reading.title}" (ID: ${c21Reading.id})`);
  console.log(`Retaining Listening Test: "${c21Listening.title}" (ID: ${c21Listening.id})`);

  const c21ReadingVersion = sqliteDb
    .prepare("SELECT id FROM reading_test_versions WHERE test_id = ? LIMIT 1")
    .get(c21Reading.id) as any;
  const c21ListeningVersion = sqliteDb
    .prepare("SELECT id FROM listening_test_versions WHERE test_id = ? LIMIT 1")
    .get(c21Listening.id) as any;

  // Turn off foreign keys temporarily for clean deletion
  sqliteDb.pragma('foreign_keys = OFF');

  // Purge non-C21 Reading
  const nonC21ReadingTests = sqliteDb
    .prepare('SELECT id, title FROM reading_tests WHERE id != ?')
    .all(c21Reading.id) as any[];
  console.log(`Removing ${nonC21ReadingTests.length} non-C21 reading tests from SQLite...`);

  sqliteDb.prepare(`
    DELETE FROM reading_answers
    WHERE attempt_id IN (SELECT id FROM reading_attempts WHERE test_id != ?)
  `).run(c21Reading.id);

  sqliteDb.prepare('DELETE FROM reading_attempts WHERE test_id != ?').run(c21Reading.id);
  sqliteDb.prepare('DELETE FROM reading_test_versions WHERE test_id != ?').run(c21Reading.id);
  sqliteDb.prepare('DELETE FROM reading_tests WHERE id != ?').run(c21Reading.id);

  // Update test_packages references
  sqliteDb.prepare(`
    UPDATE test_packages
    SET reading_test_id = ?, reading_version_id = ?
    WHERE reading_test_id IS NOT NULL AND reading_test_id != ?
  `).run(c21Reading.id, c21ReadingVersion?.id || null, c21Reading.id);

  // Purge non-C21 Listening
  const nonC21ListeningTests = sqliteDb
    .prepare('SELECT id, title FROM listening_tests WHERE id != ?')
    .all(c21Listening.id) as any[];
  console.log(`Removing ${nonC21ListeningTests.length} non-C21 listening tests from SQLite...`);

  sqliteDb.prepare(`
    DELETE FROM listening_answers
    WHERE attempt_id IN (SELECT id FROM listening_attempts WHERE test_id != ?)
  `).run(c21Listening.id);

  sqliteDb.prepare('DELETE FROM listening_attempts WHERE test_id != ?').run(c21Listening.id);
  sqliteDb.prepare('DELETE FROM listening_test_versions WHERE test_id != ?').run(c21Listening.id);
  sqliteDb.prepare('DELETE FROM listening_tests WHERE id != ?').run(c21Listening.id);

  // Update test_packages references
  sqliteDb.prepare(`
    UPDATE test_packages
    SET listening_test_id = ?, listening_version_id = ?
    WHERE listening_test_id IS NOT NULL AND listening_test_id != ?
  `).run(c21Listening.id, c21ListeningVersion?.id || null, c21Listening.id);

  sqliteDb.pragma('foreign_keys = ON');

  // Verify SQLite remaining tests
  const remainingReading = sqliteDb.prepare('SELECT id, title, status FROM reading_tests').all();
  const remainingListening = sqliteDb.prepare('SELECT id, title, status FROM listening_tests').all();
  console.log('\nSQLite Reading tests remaining:', remainingReading);
  console.log('SQLite Listening tests remaining:', remainingListening);

  // --- 2. SUPABASE POSTGRESQL PURGE ---
  console.log('\n--- 2. Purging Supabase PostgreSQL database ---');
  if (!env.DATABASE_URL) {
    console.warn('DATABASE_URL not found in .env.local; skipping remote purge.');
    return;
  }

  const pgClient = new Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();
  console.log('Connected to Supabase PostgreSQL.');

  // Find non-C21 listening tests in Supabase
  const sbListening = await pgClient.query('SELECT id, title FROM listening_tests');
  console.log('Current Supabase Listening Tests:', sbListening.rows);

  const nonC21SbListening = sbListening.rows.filter(
    (t) => !t.title.includes('Cambridge') && !t.title.includes('21')
  );

  for (const t of nonC21SbListening) {
    console.log(`Removing non-C21 listening test from Supabase: "${t.title}" (ID: ${t.id})...`);
    try {
      await pgClient.query('DELETE FROM listening_attempts WHERE test_id = $1', [t.id]);
    } catch (e) {
      // table might not exist
    }
    await pgClient.query('DELETE FROM listening_test_versions WHERE test_id = $1', [t.id]);
    await pgClient.query('DELETE FROM listening_tests WHERE id = $1', [t.id]);
    console.log(`✓ Removed "${t.title}"`);
  }

  // Find non-C21 reading tests in Supabase
  const sbReading = await pgClient.query('SELECT id, title FROM reading_tests');
  console.log('Current Supabase Reading Tests:', sbReading.rows);

  const nonC21SbReading = sbReading.rows.filter(
    (t) => !t.title.includes('Cambridge') && !t.title.includes('21')
  );

  for (const t of nonC21SbReading) {
    console.log(`Removing non-C21 reading test from Supabase: "${t.title}" (ID: ${t.id})...`);
    try {
      await pgClient.query('DELETE FROM reading_attempts WHERE test_id = $1', [t.id]);
    } catch (e) {
      // table might not exist
    }
    await pgClient.query('DELETE FROM reading_test_versions WHERE test_id = $1', [t.id]);
    await pgClient.query('DELETE FROM reading_tests WHERE id = $1', [t.id]);
    console.log(`✓ Removed "${t.title}"`);
  }

  // Verify Supabase
  const finalSbReading = await pgClient.query('SELECT id, title, status FROM reading_tests');
  const finalSbListening = await pgClient.query('SELECT id, title, status FROM listening_tests');
  console.log('\nFinal Supabase Reading Tests:', finalSbReading.rows);
  console.log('Final Supabase Listening Tests:', finalSbListening.rows);

  await pgClient.end();
  console.log('\nPurge successfully completed! Only Cambridge 21 tests and questions remain.');
}

main().catch((err) => {
  console.error('Error during purge:', err);
  process.exit(1);
});
