import '../server/legacySqliteEnvironment';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import {
  getCambridge17ReadingTest4Data,
  ingestCambridge17ReadingTest4,
} from '../server/ingestCambridge17ReadingTest4';

// Read .env.local
const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env: Record<string, string> = {};
envFile.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) {
    env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
});

async function main() {
  console.log('--- 1. Ingesting Cambridge 17 Reading Test 4 into local SQLite ---');
  const localResult = await ingestCambridge17ReadingTest4();
  console.log('Local SQLite ingestion successful:', localResult);

  console.log('\n--- 2. Connecting to Supabase PostgreSQL ---');
  const pgClient = new Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();
  console.log('Connected to Supabase PostgreSQL.');

  const testData = getCambridge17ReadingTest4Data();

  // Find admin user in Supabase
  const userRes = await pgClient.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  const adminId = userRes.rows[0]?.id || 'f8b2e30a-ae78-435a-b9d3-a22f34452016';
  console.log(`Using admin author ID: ${adminId}`);

  // Check if test already exists in Supabase
  const existingTestRes = await pgClient.query(
    "SELECT id FROM reading_tests WHERE title LIKE '%Cambridge%17%Academic%Reading%Test 4%' OR title = $1 LIMIT 1",
    [testData.title]
  );

  let testId = existingTestRes.rows[0]?.id || localResult.testId;
  let versionId = localResult.versionId;
  const now = new Date().toISOString();

  if (existingTestRes.rows.length > 0) {
    console.log(`Updating existing test ${testId} in Supabase...`);
    await pgClient.query(
      `UPDATE reading_tests
       SET title = $1,
           category = $2,
           status = 'published',
           is_free_tier = 1,
           updated_at = $3
       WHERE id = $4`,
      [testData.title, testData.category, now, testId]
    );

    // Check version
    const versionRes = await pgClient.query(
      `SELECT id FROM reading_test_versions WHERE test_id = $1 ORDER BY version_number DESC LIMIT 1`,
      [testId]
    );

    if (versionRes.rows.length > 0) {
      versionId = versionRes.rows[0].id;
      console.log(`Updating existing version ${versionId} in Supabase...`);
      await pgClient.query(
        `UPDATE reading_test_versions
         SET passages_json = $1,
             question_groups_json = $2,
             total_questions = 40,
             status = 'published'
         WHERE id = $3`,
        [
          JSON.stringify(testData.passages),
          JSON.stringify(testData.questionGroups),
          versionId,
        ]
      );
    } else {
      console.log(`Creating new version for existing test ${testId} in Supabase...`);
      await pgClient.query(
        `INSERT INTO reading_test_versions (
          id, test_id, version_number, status, passages_json, question_groups_json,
          total_questions, validation_errors_json, published_at, created_at
        ) VALUES ($1, $2, 1, 'published', $3, $4, 40, '[]', $5, $5)`,
        [
          versionId,
          testId,
          JSON.stringify(testData.passages),
          JSON.stringify(testData.questionGroups),
          now,
        ]
      );
    }
  } else {
    console.log(`Inserting new test ${testId} into Supabase...`);
    await pgClient.query(
      `INSERT INTO reading_tests (
        id, title, test_type, category, time_limit_minutes,
        current_version_number, status, created_by_id, is_free_tier, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, 1, 'published', $6, 1, $7, $7)`,
      [
        testId,
        testData.title,
        testData.testType,
        testData.category,
        testData.timeLimitMinutes,
        adminId,
        now,
      ]
    );

    console.log(`Inserting version ${versionId} into Supabase...`);
    await pgClient.query(
      `INSERT INTO reading_test_versions (
        id, test_id, version_number, status, passages_json, question_groups_json,
        total_questions, validation_errors_json, published_at, created_at
      ) VALUES ($1, $2, 1, 'published', $3, $4, 40, '[]', $5, $5)`,
      [
        versionId,
        testId,
        JSON.stringify(testData.passages),
        JSON.stringify(testData.questionGroups),
        now,
      ]
    );
  }

  console.log('\n--- 3. Verifying Supabase Records ---');
  const checkTest = await pgClient.query('SELECT * FROM reading_tests WHERE id = $1', [testId]);
  console.log('Test in Supabase:', {
    id: checkTest.rows[0]?.id,
    title: checkTest.rows[0]?.title,
    status: checkTest.rows[0]?.status,
    is_free_tier: checkTest.rows[0]?.is_free_tier,
  });

  const checkVersion = await pgClient.query(
    'SELECT id, test_id, version_number, status, total_questions FROM reading_test_versions WHERE test_id = $1',
    [testId]
  );
  console.log('Version in Supabase:', checkVersion.rows[0]);

  await pgClient.end();
  console.log('\n✓ Push to Supabase completed successfully!');
}

main().catch((err) => {
  console.error('Error during push to Supabase:', err);
  process.exit(1);
});
