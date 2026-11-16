import '../server/legacySqliteEnvironment';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  CAMBRIDGE_16_WRITING_TASKS,
  ingestCambridge16WritingTests,
} from '../server/ingestCambridge16WritingTests';

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
  console.log('--- 1. Ingesting Cambridge 16 Writing Tests 1-4 into local SQLite ---');
  const localResult = await ingestCambridge16WritingTests();
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
  console.log(`Using admin author ID: ${adminId}`);

  const now = new Date().toISOString();

  for (const item of CAMBRIDGE_16_WRITING_TASKS) {
    const existingTaskRes = await pgClient.query(
      'SELECT id FROM writing_tasks WHERE title = $1 LIMIT 1',
      [item.title]
    );

    const imagesJson = item.images ? JSON.stringify(item.images) : null;

    if (existingTaskRes.rows.length > 0) {
      const taskId = existingTaskRes.rows[0].id;
      console.log(`Updating existing writing task ${taskId}: ${item.title}`);

      await pgClient.query(
        `UPDATE writing_tasks
         SET task_type = $1,
             task_number = $2,
             test_type = $3,
             status = 'published',
             is_free_tier = 1,
             updated_at = $4
         WHERE id = $5`,
        [item.taskType, item.taskNumber, item.testType, now, taskId]
      );

      const versionRes = await pgClient.query(
        'SELECT id FROM writing_task_versions WHERE task_id = $1 ORDER BY version_number DESC LIMIT 1',
        [taskId]
      );

      if (versionRes.rows.length > 0) {
        const versionId = versionRes.rows[0].id;
        await pgClient.query(
          `UPDATE writing_task_versions
           SET status = 'published',
               task_type = $1,
               task_number = $2,
               test_type = $3,
               subtype = $4,
               title = $5,
               prompt = $6,
               instructions = $7,
               min_words = $8,
               suggested_time_minutes = $9,
               images_json = $10,
               teacher_visual_description = $11,
               model_response = $12,
               teacher_assessment_guidance = $13,
               published_at = COALESCE(published_at, $14)
           WHERE id = $15`,
          [
            item.taskType,
            item.taskNumber,
            item.testType,
            item.subtype,
            item.title,
            item.prompt,
            item.instructions,
            item.minWords,
            item.suggestedTimeMinutes,
            imagesJson,
            item.teacherVisualDescription || null,
            item.modelResponse,
            item.teacherAssessmentGuidance,
            now,
            versionId,
          ]
        );
      } else {
        const versionId = uuidv4();
        await pgClient.query(
          `INSERT INTO writing_task_versions (
            id, task_id, version_number, status, task_type, task_number, test_type,
            subtype, title, prompt, instructions, min_words, suggested_time_minutes,
            images_json, structured_data_json, teacher_visual_description,
            model_response, teacher_assessment_guidance, validation_errors_json, published_at, created_at
          ) VALUES ($1, $2, 1, 'published', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NULL, $13, $14, $15, '[]', $16, $16)`,
          [
            versionId,
            taskId,
            item.taskType,
            item.taskNumber,
            item.testType,
            item.subtype,
            item.title,
            item.prompt,
            item.instructions,
            item.minWords,
            item.suggestedTimeMinutes,
            imagesJson,
            item.teacherVisualDescription || null,
            item.modelResponse,
            item.teacherAssessmentGuidance,
            now,
          ]
        );
      }
    } else {
      const taskId = uuidv4();
      const versionId = uuidv4();
      console.log(`Inserting new writing task ${taskId}: ${item.title}`);

      await pgClient.query(
        `INSERT INTO writing_tasks (
          id, title, task_type, task_number, test_type, current_version_number, status, created_by_id, is_free_tier, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, 1, 'published', $6, 1, $7, $7)`,
        [taskId, item.title, item.taskType, item.taskNumber, item.testType, adminId, now]
      );

      await pgClient.query(
        `INSERT INTO writing_task_versions (
          id, task_id, version_number, status, task_type, task_number, test_type,
          subtype, title, prompt, instructions, min_words, suggested_time_minutes,
          images_json, structured_data_json, teacher_visual_description,
          model_response, teacher_assessment_guidance, validation_errors_json, published_at, created_at
        ) VALUES ($1, $2, 1, 'published', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NULL, $13, $14, $15, '[]', $16, $16)`,
        [
          versionId,
          taskId,
          item.taskType,
          item.taskNumber,
          item.testType,
          item.subtype,
          item.title,
          item.prompt,
          item.instructions,
          item.minWords,
          item.suggestedTimeMinutes,
          imagesJson,
          item.teacherVisualDescription || null,
          item.modelResponse,
          item.teacherAssessmentGuidance,
          now,
        ]
      );
    }
  }

  console.log('\n--- 3. Verifying Supabase Records ---');
  const verifyRes = await pgClient.query(
    `SELECT wt.id, wt.title, wt.task_type, wt.task_number, wt.status, wt.is_free_tier, wtv.images_json
     FROM writing_tasks wt
     JOIN writing_task_versions wtv ON wtv.task_id = wt.id
     WHERE wt.title LIKE 'Cambridge IELTS 16 Academic Writing Test%'
     ORDER BY wt.title`
  );
  console.log(`Verified ${verifyRes.rows.length} Cambridge 16 Writing tasks in Supabase:`);
  for (const row of verifyRes.rows) {
    console.log(
      ` - [${row.status}] [free=${row.is_free_tier}] ${row.title} (images: ${row.images_json ? 'yes' : 'none'})`
    );
  }

  await pgClient.end();
  console.log('\n✓ Push to Supabase completed successfully!');
}

main().catch((err) => {
  console.error('Error during push to Supabase:', err);
  process.exit(1);
});
