import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { WritingTaskType, WritingTaskSubtype, WritingTaskNumber } from '../shared/types';
import { countWords, validateWritingCriterionScore } from '../shared/scoring';
import {
  BUILTIN_WRITING_CALIBRATION_SAMPLES,
  TASK_1_BAND_DESCRIPTORS,
  TASK_2_BAND_DESCRIPTORS,
  IELTS_WRITING_CORE_PRINCIPLES,
  WritingCalibrationSample,
  selectCalibrationSamplesForPrompt,
} from '../shared/writingRubricAndCalibration';

/**
 * Lists all calibration samples (combining custom teacher-added database samples
 * with the built-in Official IELTS & IELTS Advantage calibration knowledge base).
 */
export async function listCalibrationSamples(filter?: {
  taskType?: WritingTaskType;
  subtype?: string;
  source?: 'official_ielts' | 'ielts_advantage' | 'custom_teacher';
}): Promise<WritingCalibrationSample[]> {
  let customRows: any[] = [];
  try {
    customRows = await db
      .prepare('SELECT * FROM writing_calibration_samples ORDER BY created_at DESC')
      .all();
  } catch {
    // Graceful fallback if table is not yet migrated on an external database
    customRows = [];
  }

  const customSamples: WritingCalibrationSample[] = customRows.map(mapCalibrationRow);

  // Merge custom samples first, avoiding duplicate IDs with built-in samples
  const customIds = new Set(customSamples.map((s) => s.id));
  const combined = [
    ...customSamples,
    ...BUILTIN_WRITING_CALIBRATION_SAMPLES.filter((b) => !customIds.has(b.id)),
  ];

  return combined.filter((item) => {
    if (filter?.taskType && item.taskType !== filter.taskType) return false;
    if (filter?.subtype && item.subtype !== filter.subtype) return false;
    if (filter?.source && item.source !== filter.source) return false;
    return true;
  });
}

/**
 * Adds a new custom calibration sample to the internal knowledge base so the AI
 * evaluator immediately uses it to ground future assessments.
 */
export async function createCalibrationSample(params: {
  createdById?: string;
  source?: 'official_ielts' | 'ielts_advantage' | 'custom_teacher';
  taskType: WritingTaskType;
  taskNumber?: WritingTaskNumber;
  subtype: WritingTaskSubtype | string;
  title: string;
  prompt: string;
  visualGroundTruth?: string;
  candidateScript: string;
  overallBand: number;
  criteria?: {
    taOrTr: number;
    cc: number;
    lr: number;
    gra: number;
  };
  examinerComment: string;
  keyTakeaways?: string[];
}): Promise<WritingCalibrationSample> {
  if (!params.title || params.title.trim().length < 3) {
    throw new Error('Sample title is required.');
  }
  if (!params.prompt || params.prompt.trim().length < 10) {
    throw new Error('Task prompt is required.');
  }
  if (!params.candidateScript || params.candidateScript.trim().length < 10) {
    throw new Error('Candidate script is required.');
  }
  if (!params.examinerComment || params.examinerComment.trim().length < 5) {
    throw new Error('Examiner comment / rationale is required.');
  }

  const bandCheck = validateWritingCriterionScore(Number(params.overallBand));
  if (!bandCheck.valid) {
    throw new Error(`Invalid overall band score: ${bandCheck.error}`);
  }

  const id = uuidv4();
  const taskNumber: WritingTaskNumber =
    params.taskNumber || (params.taskType === 'task_2' ? 2 : 1);
  const wordCount = countWords(params.candidateScript);
  const source = params.source || 'custom_teacher';
  const takeaways = Array.isArray(params.keyTakeaways)
    ? params.keyTakeaways.filter((t) => t && t.trim().length > 0)
    : [];

  await db
    .prepare(
      `INSERT INTO writing_calibration_samples (
        id, source, task_type, task_number, subtype, title, prompt,
        visual_ground_truth, candidate_script, word_count, overall_band,
        score_ta_tr, score_cc, score_lr, score_gra, examiner_comment,
        key_takeaways_json, created_by_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    )
    .run(
      id,
      source,
      params.taskType,
      taskNumber,
      params.subtype || 'chart',
      params.title.trim(),
      params.prompt.trim(),
      params.visualGroundTruth?.trim() || null,
      params.candidateScript.trim(),
      wordCount,
      Number(params.overallBand),
      params.criteria?.taOrTr ?? null,
      params.criteria?.cc ?? null,
      params.criteria?.lr ?? null,
      params.criteria?.gra ?? null,
      params.examinerComment.trim(),
      JSON.stringify(takeaways),
      params.createdById || null
    );

  const row = await db
    .prepare('SELECT * FROM writing_calibration_samples WHERE id = ?')
    .get(id);
  return mapCalibrationRow(row);
}

/**
 * Deletes a custom teacher-added calibration sample.
 * Built-in Official IELTS and IELTS Advantage anchors are protected.
 */
export async function deleteCalibrationSample(id: string): Promise<void> {
  const isBuiltin = BUILTIN_WRITING_CALIBRATION_SAMPLES.some((b) => b.id === id);
  if (isBuiltin) {
    throw new Error('Built-in official calibration samples cannot be deleted.');
  }
  await db.prepare('DELETE FROM writing_calibration_samples WHERE id = ?').run(id);
}

/**
 * Returns the complete May 2023 Band Descriptors, Core Marking Principles, and calibration stats.
 */
export async function getWritingRubricOverview() {
  const allSamples = await listCalibrationSamples();
  return {
    version: 'IELTS Official Band Descriptors (Updated May 2023) + IELTS Advantage Calibration',
    corePrinciples: IELTS_WRITING_CORE_PRINCIPLES,
    task1Descriptors: TASK_1_BAND_DESCRIPTORS,
    task2Descriptors: TASK_2_BAND_DESCRIPTORS,
    sampleCounts: {
      total: allSamples.length,
      officialIelts: allSamples.filter((s) => s.source === 'official_ielts').length,
      ieltsAdvantage: allSamples.filter((s) => s.source === 'ielts_advantage').length,
      customTeacher: allSamples.filter((s) => s.source === 'custom_teacher').length,
    },
  };
}

/**
 * Retrieves the best few-shot calibration anchors for a given task type and subtype,
 * including any custom samples stored in the database.
 */
export async function getCalibrationAnchorsForEvaluation(params: {
  taskType: WritingTaskType;
  subtype?: WritingTaskSubtype | string;
  maxSamples?: number;
}): Promise<WritingCalibrationSample[]> {
  let customSamples: WritingCalibrationSample[] = [];
  try {
    const rows = await db
      .prepare('SELECT * FROM writing_calibration_samples WHERE task_type = ? ORDER BY created_at DESC')
      .all(params.taskType);
    customSamples = rows.map(mapCalibrationRow);
  } catch {
    customSamples = [];
  }

  return selectCalibrationSamplesForPrompt({
    taskType: params.taskType,
    subtype: params.subtype,
    customSamples,
    maxSamples: params.maxSamples ?? 3,
  });
}

function mapCalibrationRow(row: any): WritingCalibrationSample {
  return {
    id: row.id,
    source: row.source,
    taskType: row.task_type,
    taskNumber: row.task_number,
    subtype: row.subtype,
    title: row.title,
    prompt: row.prompt,
    visualGroundTruth: row.visual_ground_truth || undefined,
    candidateScript: row.candidate_script,
    wordCount: row.word_count,
    overallBand: Number(row.overall_band),
    criteria:
      row.score_ta_tr !== null && row.score_ta_tr !== undefined
        ? {
            taOrTr: Number(row.score_ta_tr),
            cc: Number(row.score_cc),
            lr: Number(row.score_lr),
            gra: Number(row.score_gra),
          }
        : undefined,
    examinerComment: row.examiner_comment,
    keyTakeaways: row.key_takeaways_json ? JSON.parse(row.key_takeaways_json) : [],
    createdAt: row.created_at,
  };
}
