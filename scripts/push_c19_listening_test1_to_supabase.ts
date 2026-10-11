import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { getCambridge19ListeningTest1Data, ingestCambridge19ListeningTest1 } from '../server/ingestCambridge19ListeningTest1';

// Read .env.local
const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) {
    env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
});

async function main() {
  console.log('--- 1. Ingesting Cambridge 19 Listening Test 1 into local SQLite ---');
  const localResult = ingestCambridge19ListeningTest1();
  console.log('Local SQLite ingestion successful:', localResult);

  console.log('\n--- 2. Connecting to Supabase PostgreSQL ---');
  const pgClient = new Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await pgClient.connect();
  console.log('Connected to Supabase PostgreSQL.');

  const testData = getCambridge19ListeningTest1Data();

  // Find admin user in Supabase
  const userRes = await pgClient.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  const adminId = userRes.rows[0]?.id || 'f8b2e30a-ae78-435a-b9d3-a22f34452016';

  console.log(`Using admin author ID: ${adminId}`);

  // Check if test already exists in Supabase
  const existingTestRes = await pgClient.query(
    "SELECT id FROM listening_tests WHERE title LIKE '%Cambridge%19%Listening%Test 1%' OR title = $1 LIMIT 1",
    [testData.title]
  );

  let testId = existingTestRes.rows[0]?.id || localResult.testId;
  let versionId = localResult.versionId;

  const now = new Date().toISOString();

  if (existingTestRes.rows.length > 0) {
    console.log(`Updating existing test ${testId} in Supabase...`);
    await pgClient.query(
      `UPDATE listening_tests
       SET title = $1,
           category = $2,
           audio_mode = $3,
           time_limit_minutes = $4,
           status = 'published',
           is_free_tier = 1,
           updated_at = $5
       WHERE id = $6`,
      [testData.title, testData.category, testData.audioMode, testData.timeLimitMinutes, now, testId]
    );

    // Check version
    const versionRes = await pgClient.query(
      `SELECT id FROM listening_test_versions WHERE test_id = $1 ORDER BY version_number DESC LIMIT 1`,
      [testId]
    );

    if (versionRes.rows.length > 0) {
      versionId = versionRes.rows[0].id;
      console.log(`Updating existing version ${versionId} in Supabase...`);
      await pgClient.query(
        `UPDATE listening_test_versions
         SET parts_json = $1,
             question_groups_json = $2,
             total_questions = 40,
             audio_config_json = $3,
             status = 'published'
         WHERE id = $4`,
        [
          JSON.stringify(testData.parts),
          JSON.stringify(testData.questionGroups),
          JSON.stringify(testData.audioConfig),
          versionId
        ]
      );
    } else {
      console.log(`Creating new version for existing test ${testId} in Supabase...`);
      await pgClient.query(
        `INSERT INTO listening_test_versions (
          id, test_id, version_number, parts_json, question_groups_json,
          total_questions, audio_config_json, status, created_at
        ) VALUES ($1, $2, 1, $3, $4, 40, $5, 'published', $6)`,
        [
          versionId,
          testId,
          JSON.stringify(testData.parts),
          JSON.stringify(testData.questionGroups),
          JSON.stringify(testData.audioConfig),
          now
        ]
      );
    }
  } else {
    console.log(`Creating new test ${testId} and version in Supabase...`);
    await pgClient.query(
      `INSERT INTO listening_tests (
        id, title, category, audio_mode, time_limit_minutes,
        current_version_number, status, created_by_id, is_free_tier, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, 1, 'published', $6, 1, $7, $7)`,
      [testId, testData.title, testData.category, testData.audioMode, testData.timeLimitMinutes, adminId, now]
    );

    await pgClient.query(
      `INSERT INTO listening_test_versions (
        id, test_id, version_number, parts_json, question_groups_json,
        total_questions, audio_config_json, status, created_at
      ) VALUES ($1, $2, 1, $3, $4, 40, $5, 'published', $6)`,
      [
        versionId,
        testId,
        JSON.stringify(testData.parts),
        JSON.stringify(testData.questionGroups),
        JSON.stringify(testData.audioConfig),
        now
      ]
    );
  }

  console.log('\n--- 3. Verifying pushed test in Supabase ---');
  const verifyTest = await pgClient.query('SELECT id, title, status, is_free_tier FROM listening_tests WHERE id = $1', [testId]);
  const verifyVer = await pgClient.query('SELECT id, parts_json, question_groups_json, total_questions FROM listening_test_versions WHERE test_id = $1', [testId]);

  console.log('Verified listening_tests row:', verifyTest.rows[0]);
  const groups = JSON.parse(verifyVer.rows[0].question_groups_json);
  const parts = JSON.parse(verifyVer.rows[0].parts_json);
  const allQuestions = groups.flatMap((g: any) => g.questions);

  console.log('Verified listening_test_versions row:');
  console.log(`  - Version ID: ${verifyVer.rows[0].id}`);
  console.log(`  - Parts count: ${parts.length}`);
  console.log(`  - Question groups count: ${groups.length}`);
  console.log(`  - Total questions count: ${allQuestions.length}`);
  console.log(`  - Q1 -> answerKey: ${allQuestions[0].answerKey}`);
  console.log(`  - Q10 -> answerKey: ${allQuestions.find((q: any) => q.questionNumber === 10)?.answerKey}`);
  console.log(`  - Q20 -> answerKey: ${allQuestions.find((q: any) => q.questionNumber === 20)?.answerKey}`);
  console.log(`  - Q30 -> answerKey: ${allQuestions.find((q: any) => q.questionNumber === 30)?.answerKey}`);
  console.log(`  - Q40 -> answerKey: ${allQuestions[allQuestions.length - 1].answerKey}`);

  await pgClient.end();
  console.log('\n>>> Successfully pushed Cambridge 19 Academic Listening Test 1 to Supabase! <<<');
}

main().catch(err => {
  console.error('Error pushing Cambridge 19 Listening Test 1 to Supabase:', err);
  process.exit(1);
});

