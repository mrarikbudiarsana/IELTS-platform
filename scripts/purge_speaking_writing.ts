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
  console.log(' PURGING ALL SPEAKING AND WRITING DATA');
  console.log('======================================================\n');

  // 1. LOCAL SQLITE PURGE
  console.log('--- 1. Purging SQLite Speaking & Writing Data ---');
  sqliteDb.pragma('foreign_keys = OFF');

  const speakingTables = [
    'speaking_score_corrections',
    'speaking_audio_turns',
    'speaking_ai_sessions',
    'speaking_assessments',
    'speaking_set_versions',
    'speaking_sets',
  ];

  for (const table of speakingTables) {
    try {
      const res = sqliteDb.prepare(`DELETE FROM ${table}`).run();
      console.log(`Deleted ${res.changes} rows from ${table}`);
    } catch (e: any) {
      console.log(`Table ${table}: ${e.message}`);
    }
  }

  const writingTables = [
    'writing_assessments',
    'writing_responses',
    'writing_attempts',
    'writing_task_versions',
    'writing_tasks',
  ];

  for (const table of writingTables) {
    try {
      const res = sqliteDb.prepare(`DELETE FROM ${table}`).run();
      console.log(`Deleted ${res.changes} rows from ${table}`);
    } catch (e: any) {
      console.log(`Table ${table}: ${e.message}`);
    }
  }

  // Clear references in test_packages
  try {
    sqliteDb.prepare(`
      UPDATE test_packages
      SET writing_task1_id = NULL,
          writing_task1_version_id = NULL,
          writing_task2_id = NULL,
          writing_task2_version_id = NULL,
          speaking_set_id = NULL,
          speaking_set_version_id = NULL,
          writing_status = 'not_implemented',
          speaking_status = 'not_implemented'
    `).run();
    console.log('Cleared speaking and writing pointers in test_packages');
  } catch (e: any) {
    console.log('Note on test_packages update:', e.message);
  }

  sqliteDb.pragma('foreign_keys = ON');

  console.log('\nRemaining SQLite Speaking sets count:', sqliteDb.prepare('SELECT count(*) as count FROM speaking_sets').get());
  console.log('Remaining SQLite Writing tasks count:', sqliteDb.prepare('SELECT count(*) as count FROM writing_tasks').get());

  // 2. SUPABASE POSTGRESQL PURGE
  console.log('\n--- 2. Purging Supabase PostgreSQL Speaking & Writing Data ---');
  if (!env.DATABASE_URL) {
    console.warn('DATABASE_URL not found; skipping remote purge.');
    return;
  }

  const pgClient = new Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();
  console.log('Connected to Supabase PostgreSQL.');

  const allSbTablesRes = await pgClient.query(`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
  `);
  const allSbTables = allSbTablesRes.rows.map((r: any) => r.table_name);
  console.log('Existing Supabase tables:', allSbTables);

  const sbSpeakingWritingTables = [
    'speaking_score_corrections',
    'speaking_audio_turns',
    'speaking_ai_sessions',
    'speaking_assessments',
    'speaking_set_versions',
    'speaking_sets',
    'writing_assessments',
    'writing_responses',
    'writing_attempts',
    'writing_task_versions',
    'writing_tasks',
  ];

  for (const t of sbSpeakingWritingTables) {
    if (allSbTables.includes(t)) {
      const res = await pgClient.query(`DELETE FROM ${t}`);
      console.log(`✓ Deleted ${res.rowCount} rows from Supabase table ${t}`);
    }
  }

  await pgClient.end();
  console.log('\nAll speaking and writing data successfully purged!');
}

main().catch((err) => {
  console.error('Error during purge:', err);
  process.exit(1);
});
