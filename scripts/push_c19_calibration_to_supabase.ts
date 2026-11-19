import '../server/legacySqliteEnvironment';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { db } from '../server/db';
import { CAMBRIDGE_19_WRITING_TASKS } from '../server/ingestCambridge19WritingTests';

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

interface RawSample {
  id: string;
  test: number;
  task: 1 | 2;
  band_score: number;
  candidate_response: string;
  examiner_comment: string;
}

interface CalibrationSeed {
  id: string;
  source: 'official_ielts';
  taskType: 'academic_task_1' | 'task_2';
  taskNumber: 1 | 2;
  subtype: string;
  title: string;
  prompt: string;
  visualGroundTruth?: string;
  candidateScript: string;
  overallBand: number;
  examinerComment: string;
  keyTakeaways: string[];
}

const SAMPLE_META: Record<
  string,
  { title: string; keyTakeaways: string[] }
> = {
  test_1_task_1: {
    title: 'Cambridge 19 Test 1 Task 1 (Social Centre Activities in Melbourne) - Band 6.5',
    keyTakeaways: [
      'Logical paragraphing with a clear overview and controlled past simple; minor spelling slips, missing articles, and preposition errors keep it at Band 6.5.',
    ],
  },
  test_1_task_2: {
    title: 'Cambridge 19 Test 1 Task 2 (Competition vs Cooperation) - Band 6.0',
    keyTakeaways: [
      'Engaging response with some higher-level vocabulary, but lack of paragraphing and focusing mainly on cooperation rather than comparing both views cap it at Band 6.0.',
    ],
  },
  test_2_task_1: {
    title: 'Cambridge 19 Test 2 Task 1 (Porth Harbour 2000 vs Today) - Band 6.5',
    keyTakeaways: [
      'Covers main map changes logically with good linking; a minor factual slip (extra hotel on the private beach) and plural/verb-form errors limit grammatical accuracy to Band 6.5.',
    ],
  },
  test_2_task_2: {
    title: 'Cambridge 19 Test 2 Task 2 (Shorter Working Week) - Band 6.0',
    keyTakeaways: [
      'Clear position and logical organisation with effective collocations; ideas need fuller extension and minor preposition/structure errors remain.',
    ],
  },
  test_3_task_1: {
    title: 'Cambridge 19 Test 3 Task 1 (Biofuel Production: Ethanol) - Band 6.5',
    keyTakeaways: [
      'Follows the process logically with good sequencing linkers and complex clauses; spelling slips and an overview that does not summarise the main stages hold it at Band 6.5.',
    ],
  },
  test_3_task_2: {
    title: 'Cambridge 19 Test 3 Task 2 (Saving Money for the Future) - Band 7.0',
    keyTakeaways: [
      'Strong position, natural collocations, and multi-clause sentences achieve Band 7.0; separated single-sentence paragraphs at the end and an advice-style conclusion prevent Band 8.',
    ],
  },
  test_4_task_1: {
    title: 'Cambridge 19 Test 4 Task 1 (Dance Classes in Australia) - Band 5.0',
    keyTakeaways: [
      'Reports the data in sequence, but mechanical listing, repetitive phrasing, limited linking devices, and frequent grammatical errors cap the score at Band 5.0.',
    ],
  },
  test_4_task_2: {
    title: 'Cambridge 19 Test 4 Task 2 (Global Food in Supermarkets) - Band 6.0',
    keyTakeaways: [
      'Clear position with relevant examples, but short underdeveloped paragraphs, spelling errors, grammatical slips, and an incomplete conclusion limit the score to Band 6.0.',
    ],
  },
};

function buildCalibrationSamples(): CalibrationSeed[] {
  const rawPath = path.join(__dirname, 'c19_writing_samples.json');
  const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8')) as { samples: RawSample[] };

  return rawData.samples.map((s) => {
    // CAMBRIDGE_19_WRITING_TASKS has 2 tasks per test: index (test - 1) * 2 + (task - 1)
    const taskSeed = CAMBRIDGE_19_WRITING_TASKS[(s.test - 1) * 2 + (s.task - 1)];
    if (!taskSeed) {
      throw new Error(`Missing task seed for test ${s.test} task ${s.task}`);
    }
    const meta = SAMPLE_META[s.id];
    if (!meta) {
      throw new Error(`Missing metadata for sample ${s.id}`);
    }
    const bandTag = Math.round(s.band_score * 10);
    const id = `cambridge-19-t${s.test}-w${s.task}-band${bandTag}`;

    return {
      id,
      source: 'official_ielts',
      taskType: taskSeed.taskType === 'academic_task_1' ? 'academic_task_1' : 'task_2',
      taskNumber: s.task,
      subtype: taskSeed.subtype,
      title: meta.title,
      prompt: taskSeed.prompt.replace(/\n+/g, ' '),
      visualGroundTruth: taskSeed.teacherVisualDescription,
      candidateScript: s.candidate_response,
      overallBand: s.band_score,
      examinerComment: s.examiner_comment,
      keyTakeaways: meta.keyTakeaways,
    };
  });
}

async function main() {
  const C19_CALIBRATION_SAMPLES = buildCalibrationSamples();
  const now = new Date().toISOString();

  // 1. Local SQLite
  for (const s of C19_CALIBRATION_SAMPLES) {
    const wordCount = s.candidateScript.trim().split(/\s+/).filter(Boolean).length;
    const existing = await db
      .prepare('SELECT id FROM writing_calibration_samples WHERE id = ?')
      .get(s.id);
    if (existing) {
      await db
        .prepare(
          `UPDATE writing_calibration_samples
           SET source = ?, task_type = ?, task_number = ?, subtype = ?, title = ?, prompt = ?,
               visual_ground_truth = ?, candidate_script = ?, word_count = ?, overall_band = ?,
               examiner_comment = ?, key_takeaways_json = ?
           WHERE id = ?`
        )
        .run(
          s.source,
          s.taskType,
          s.taskNumber,
          s.subtype,
          s.title,
          s.prompt,
          s.visualGroundTruth || null,
          s.candidateScript,
          wordCount,
          s.overallBand,
          s.examinerComment,
          JSON.stringify(s.keyTakeaways),
          s.id
        );
    } else {
      await db
        .prepare(
          `INSERT INTO writing_calibration_samples (
            id, source, task_type, task_number, subtype, title, prompt, visual_ground_truth,
            candidate_script, word_count, overall_band, examiner_comment, key_takeaways_json, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          s.id,
          s.source,
          s.taskType,
          s.taskNumber,
          s.subtype,
          s.title,
          s.prompt,
          s.visualGroundTruth || null,
          s.candidateScript,
          wordCount,
          s.overallBand,
          s.examinerComment,
          JSON.stringify(s.keyTakeaways),
          now
        );
    }
  }
  console.log(`Seeded ${C19_CALIBRATION_SAMPLES.length} Cambridge 19 calibration samples in SQLite.`);

  // 2. Supabase PostgreSQL
  if (!env.DATABASE_URL) {
    console.warn('DATABASE_URL missing; skipping Supabase.');
    return;
  }

  const pgClient = new Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();

  await pgClient.query(`
    CREATE TABLE IF NOT EXISTS writing_calibration_samples (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL DEFAULT 'custom_teacher',
      task_type TEXT NOT NULL,
      task_number INTEGER NOT NULL,
      subtype TEXT NOT NULL,
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      visual_ground_truth TEXT,
      candidate_script TEXT NOT NULL,
      word_count INTEGER NOT NULL DEFAULT 0,
      overall_band DOUBLE PRECISION NOT NULL,
      score_ta_tr DOUBLE PRECISION,
      score_cc DOUBLE PRECISION,
      score_lr DOUBLE PRECISION,
      score_gra DOUBLE PRECISION,
      examiner_comment TEXT NOT NULL,
      key_takeaways_json TEXT NOT NULL DEFAULT '[]',
      created_by_id TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_writing_calibration_type ON writing_calibration_samples(task_type, subtype, overall_band);
  `);

  for (const s of C19_CALIBRATION_SAMPLES) {
    const wordCount = s.candidateScript.trim().split(/\s+/).filter(Boolean).length;
    await pgClient.query(
      `INSERT INTO writing_calibration_samples (
        id, source, task_type, task_number, subtype, title, prompt, visual_ground_truth,
        candidate_script, word_count, overall_band, examiner_comment, key_takeaways_json, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO UPDATE SET
        source = EXCLUDED.source,
        task_type = EXCLUDED.task_type,
        task_number = EXCLUDED.task_number,
        subtype = EXCLUDED.subtype,
        title = EXCLUDED.title,
        prompt = EXCLUDED.prompt,
        visual_ground_truth = EXCLUDED.visual_ground_truth,
        candidate_script = EXCLUDED.candidate_script,
        word_count = EXCLUDED.word_count,
        overall_band = EXCLUDED.overall_band,
        examiner_comment = EXCLUDED.examiner_comment,
        key_takeaways_json = EXCLUDED.key_takeaways_json`,
      [
        s.id,
        s.source,
        s.taskType,
        s.taskNumber,
        s.subtype,
        s.title,
        s.prompt,
        s.visualGroundTruth || null,
        s.candidateScript,
        wordCount,
        s.overallBand,
        s.examinerComment,
        JSON.stringify(s.keyTakeaways),
        now,
      ]
    );
  }

  const countRes = await pgClient.query(
    "SELECT id, title, overall_band, word_count FROM writing_calibration_samples WHERE id LIKE 'cambridge-19-%' ORDER BY id"
  );
  console.log(`Verified ${countRes.rows.length} Cambridge 19 calibration samples in Supabase:`);
  for (const row of countRes.rows) {
    console.log(` - [${row.overall_band}] ${row.id} (${row.word_count} words): ${row.title}`);
  }
  await pgClient.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
