import '../server/legacySqliteEnvironment';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  CAMBRIDGE_18_SPEAKING_SETS,
  ingestCambridge18SpeakingTests,
} from '../server/ingestCambridge18SpeakingTests';

const envPath = path.join(__dirname, '../.env.local');
const env: Record<string, string> = {};
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
  });
}

async function main() {
  console.log('--- 1. Ingesting Cambridge 18 Speaking Tests 1-4 into local SQLite ---');
  const localResult = await ingestCambridge18SpeakingTests();
  console.log('Local SQLite ingestion successful:', localResult);

  if (!env.DATABASE_URL) {
    console.warn('DATABASE_URL not found in .env.local; skipping Supabase push.');
    return;
  }

  console.log('\n--- 2. Connecting to Supabase PostgreSQL ---');
  const pgClient = new Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();
  console.log('Connected to Supabase PostgreSQL.');

  const userRes = await pgClient.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  const fallbackRes =
    userRes.rows.length > 0 ? userRes : await pgClient.query('SELECT id FROM users LIMIT 1');
  const adminId = fallbackRes.rows[0]?.id;
  if (!adminId) {
    throw new Error('No users found in Supabase PostgreSQL to assign as created_by_id.');
  }

  const now = new Date().toISOString();
  let created = 0;
  let updated = 0;

  for (const item of CAMBRIDGE_18_SPEAKING_SETS) {
    const existingRes = await pgClient.query('SELECT id FROM speaking_sets WHERE title = $1', [
      item.title,
    ]);

    if (existingRes.rows.length > 0) {
      const setId = existingRes.rows[0].id;
      await pgClient.query(
        `UPDATE speaking_sets
         SET status = 'published',
             is_free_tier = 1,
             updated_at = $1
         WHERE id = $2`,
        [now, setId]
      );

      const versionRes = await pgClient.query(
        'SELECT id FROM speaking_set_versions WHERE set_id = $1 ORDER BY version_number DESC LIMIT 1',
        [setId]
      );

      if (versionRes.rows.length > 0) {
        await pgClient.query(
          `UPDATE speaking_set_versions
           SET status = 'published',
               part1_topics_json = $1,
               part2_cue_card_json = $2,
               part3_discussion_json = $3,
               teacher_notes = $4,
               validation_errors_json = '[]',
               published_at = $5
           WHERE id = $6`,
          [
            JSON.stringify(item.part1Topics),
            JSON.stringify(item.part2CueCard),
            JSON.stringify(item.part3Discussion),
            item.teacherNotes || null,
            now,
            versionRes.rows[0].id,
          ]
        );
      }

      updated++;
      console.log(`Updated in Supabase: ${item.title}`);
    } else {
      const setId = uuidv4();
      const versionId = uuidv4();

      await pgClient.query(
        `INSERT INTO speaking_sets (
          id, title, current_version_number, status, created_by_id, is_free_tier, created_at, updated_at
        ) VALUES ($1, $2, 1, 'published', $3, 1, $4, $5)`,
        [setId, item.title, adminId, now, now]
      );

      await pgClient.query(
        `INSERT INTO speaking_set_versions (
          id, set_id, version_number, status,
          part1_topics_json, part2_cue_card_json, part3_discussion_json,
          teacher_notes, validation_errors_json, published_at, created_at
        ) VALUES ($1, $2, 1, 'published', $3, $4, $5, $6, '[]', $7, $8)`,
        [
          versionId,
          setId,
          JSON.stringify(item.part1Topics),
          JSON.stringify(item.part2CueCard),
          JSON.stringify(item.part3Discussion),
          item.teacherNotes || null,
          now,
          now,
        ]
      );

      created++;
      console.log(`Created in Supabase: ${item.title}`);
    }
  }

  await pgClient.end();
  console.log(`\nSupabase push complete: created=${created}, updated=${updated}`);
}

main().catch((err) => {
  console.error('Failed to push Cambridge 18 Speaking tests:', err);
  process.exit(1);
});
