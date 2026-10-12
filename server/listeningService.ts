import { asyncFilter } from './asyncCollections';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import {
  ListeningTest,
  ListeningTestVersion,
  ListeningPart,
  QuestionGroup,
  ListeningAudioConfig,
  PublicationStatus,
  TestMode,
} from '../shared/types';
import { sortTestsChronological } from '../shared/testOrder';

export function validateListeningTestVersion(
  parts: ListeningPart[],
  questionGroups: QuestionGroup[],
  audioConfig?: ListeningAudioConfig
): string[] {
  const errors: string[] = [];

  if (!parts || parts.length === 0) {
    errors.push('At least one listening part is required');
  }

  for (const p of parts || []) {
    if (!p.title) errors.push(`Part ${p.partNumber}: Title is required`);
    if (!p.audioUrl) errors.push(`Part ${p.partNumber}: Audio file URL is required`);
  }

  if (!questionGroups || questionGroups.length === 0) {
    errors.push('At least one question group is required');
  }

  const seenQuestionNumbers = new Set<number>();
  let totalQuestionsCount = 0;

  for (const group of questionGroups || []) {
    if (!group.questions || group.questions.length === 0) {
      errors.push(`Question group "${group.title || group.questionType}" has no questions`);
      continue;
    }

    if (
      group.questionType === 'listening_multiple_choice_single' ||
      group.questionType === 'listening_multiple_choice_multi'
    ) {
      for (const q of group.questions) {
        if (!q.options || q.options.length < 2) {
          errors.push(`Question ${q.questionNumber}: Multiple choice must have at least 2 options`);
        }
      }
    }

    if (
      (group.questionType === 'matching' || group.questionType === 'plan_map_diagram_labelling') &&
      (!group.optionsList || group.optionsList.length === 0)
    ) {
      errors.push(`Question group "${group.title}": Format requires an options list`);
    }

    if (group.questionType === 'plan_map_diagram_labelling' && !group.mapData?.imageUrl) {
      errors.push(`Question group "${group.title}": Plan/map labelling requires a map image`);
    }

    if (group.questionType === 'form_completion' && (!group.formData || group.formData.fields.length === 0)) {
      errors.push(`Question group "${group.title}": Form completion requires form fields`);
    }

    if (group.questionType === 'table_completion' && !group.tableData) {
      errors.push(`Question group "${group.title}": Table completion requires table rows`);
    }

    if (group.questionType === 'flow_chart_completion' && (!group.flowChartSteps || group.flowChartSteps.length === 0)) {
      errors.push(`Question group "${group.title}": Flow chart completion requires steps`);
    }

    for (const q of group.questions) {
      totalQuestionsCount++;
      if (seenQuestionNumbers.has(q.questionNumber)) {
        errors.push(`Duplicate question number ${q.questionNumber} detected`);
      }
      seenQuestionNumbers.add(q.questionNumber);

      if (
        q.answerKey === undefined ||
        q.answerKey === null ||
        (typeof q.answerKey === 'string' && q.answerKey.trim() === '') ||
        (Array.isArray(q.answerKey) && q.answerKey.length === 0)
      ) {
        errors.push(`Question ${q.questionNumber}: Missing answer key`);
      }
    }
  }

  // Check continuous numbering from 1 to total
  for (let i = 1; i <= totalQuestionsCount; i++) {
    if (!seenQuestionNumbers.has(i)) {
      errors.push(`Missing question number ${i} in sequence (expected continuous 1 to ${totalQuestionsCount})`);
    }
  }

  return errors;
}

/**
 * Strips all answer keys, accepted alternatives, explanations, transcripts,
 * and review timestamps from the Listening payload during active student attempts.
 */
export function sanitizeListeningForStudent(
  questionGroups: QuestionGroup[],
  parts: ListeningPart[]
): { questionGroups: QuestionGroup[]; parts: ListeningPart[] } {
  const sanitizedGroups = questionGroups.map((group) => ({
    ...group,
    questions: group.questions.map((q) => {
      const sanitized = { ...q };
      delete (sanitized as any).answerKey;
      delete (sanitized as any).acceptedAlternatives;
      delete (sanitized as any).explanation;
      delete (sanitized as any).evidenceQuote;
      delete (sanitized as any).transcriptExcerpt;
      delete (sanitized as any).audioTimestampSeconds;
      return sanitized;
    }),
  }));

  const sanitizedParts = parts.map((part) => {
    const sanitized = { ...part };
    delete (sanitized as any).transcript;
    delete (sanitized as any).transcriptTimestamps;
    return sanitized;
  });

  return { questionGroups: sanitizedGroups, parts: sanitizedParts };
}

export async function createListeningTest(params: {
  title: string;
  category: TestMode;
  audioMode?: 'single_audio' | 'part_audios';
  timeLimitMinutes?: number;
  createdById: string;
  parts: ListeningPart[];
  questionGroups: QuestionGroup[];
  audioConfig?: ListeningAudioConfig;
}): Promise<{ test: ListeningTest; version: ListeningTestVersion }> {
  const testId = uuidv4();
  const versionId = uuidv4();
  const now = new Date().toISOString();

  let totalQuestions = 0;
  for (const g of params.questionGroups) {
    totalQuestions += g.questions?.length || 0;
  }

  const audioConfig: ListeningAudioConfig = params.audioConfig || {
    audioMode: params.audioMode || 'part_audios',
    postTestCheckTimeSeconds: 120,
  };

  const validationErrors = validateListeningTestVersion(
    params.parts,
    params.questionGroups,
    audioConfig
  );

  const insertTest = db.prepare(`
    INSERT INTO listening_tests (
      id, title, category, audio_mode, time_limit_minutes,
      current_version_number, status, created_by_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertVersion = db.prepare(`
    INSERT INTO listening_test_versions (
      id, test_id, version_number, status, parts_json,
      question_groups_json, total_questions, audio_config_json, validation_errors_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(async () => {
    (await insertTest.run(
      testId,
      params.title,
      params.category,
      audioConfig.audioMode,
      params.timeLimitMinutes || 40,
      1,
      'draft',
      params.createdById,
      now,
      now
    ));

    (await insertVersion.run(
      versionId,
      testId,
      1,
      'draft',
      JSON.stringify(params.parts),
      JSON.stringify(params.questionGroups),
      totalQuestions,
      JSON.stringify(audioConfig),
      JSON.stringify(validationErrors),
      now
    ));
  });

  (await tx());

  const test: ListeningTest = {
    id: testId,
    title: params.title,
    category: params.category,
    audioMode: audioConfig.audioMode,
    timeLimitMinutes: params.timeLimitMinutes || 40,
    currentVersionNumber: 1,
    status: 'draft',
    latestVersionId: versionId,
    totalQuestions,
    createdById: params.createdById,
    createdAt: now,
    updatedAt: now,
  };

  const version: ListeningTestVersion = {
    id: versionId,
    testId,
    versionNumber: 1,
    status: 'draft',
    parts: params.parts,
    questionGroups: params.questionGroups,
    totalQuestions,
    audioConfig,
    validationErrors,
    createdAt: now,
  };

  return { test, version };
}

export async function updateListeningDraftVersion(params: {
  testId: string;
  versionId: string;
  title?: string;
  parts: ListeningPart[];
  questionGroups: QuestionGroup[];
  audioConfig?: ListeningAudioConfig;
  timeLimitMinutes?: number;
}): Promise<{ version: ListeningTestVersion; errors: string[] }> {
  const versionRow = (await db.prepare('SELECT * FROM listening_test_versions WHERE id = ? AND test_id = ?').get(
    params.versionId,
    params.testId
  )) as any;

  if (!versionRow) {
    throw new Error('Listening test version not found');
  }

  if (versionRow.status === 'published') {
    throw new Error('Published versions are immutable. You must create a new version to make edits.');
  }

  let totalQuestions = 0;
  for (const g of params.questionGroups) {
    totalQuestions += g.questions?.length || 0;
  }

  const audioConfig = params.audioConfig || JSON.parse(versionRow.audio_config_json);
  const validationErrors = validateListeningTestVersion(params.parts, params.questionGroups, audioConfig);

  const tx = db.transaction(async () => {
    if (params.title || params.timeLimitMinutes) {
      (await db.prepare(`
        UPDATE listening_tests
        SET title = COALESCE(?, title),
            time_limit_minutes = COALESCE(?, time_limit_minutes),
            updated_at = datetime('now')
        WHERE id = ?
      `).run(params.title || null, params.timeLimitMinutes || null, params.testId));
    }

    (await db.prepare(`
      UPDATE listening_test_versions
      SET parts_json = ?,
          question_groups_json = ?,
          total_questions = ?,
          audio_config_json = ?,
          validation_errors_json = ?
      WHERE id = ?
    `).run(
      JSON.stringify(params.parts),
      JSON.stringify(params.questionGroups),
      totalQuestions,
      JSON.stringify(audioConfig),
      JSON.stringify(validationErrors),
      params.versionId
    ));
  });

  (await tx());

  return {
    version: {
      id: params.versionId,
      testId: params.testId,
      versionNumber: versionRow.version_number,
      status: versionRow.status,
      parts: params.parts,
      questionGroups: params.questionGroups,
      totalQuestions,
      audioConfig,
      validationErrors,
      createdAt: versionRow.created_at,
    },
    errors: validationErrors,
  };
}

export async function forkNewListeningDraftVersion(testId: string): Promise<ListeningTestVersion> {
  const test = (await db.prepare('SELECT * FROM listening_tests WHERE id = ?').get(testId)) as any;
  if (!test) throw new Error('Listening test not found');

  const latestVersion = (await db
    .prepare('SELECT * FROM listening_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1')
    .get(testId)) as any;

  if (!latestVersion) throw new Error('No existing versions found');

  const newVersionNumber = latestVersion.version_number + 1;
  const newVersionId = uuidv4();
  const now = new Date().toISOString();

  (await db.prepare(`
    INSERT INTO listening_test_versions (
      id, test_id, version_number, status, parts_json,
      question_groups_json, total_questions, audio_config_json, validation_errors_json, created_at
    ) VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?)
  `).run(
    newVersionId,
    testId,
    newVersionNumber,
    latestVersion.parts_json,
    latestVersion.question_groups_json,
    latestVersion.total_questions,
    latestVersion.audio_config_json,
    latestVersion.validation_errors_json,
    now
  ));

  (await db.prepare(`
    UPDATE listening_tests
    SET current_version_number = ?,
        updated_at = ?
    WHERE id = ?
  `).run(newVersionNumber, now, testId));

  return {
    id: newVersionId,
    testId,
    versionNumber: newVersionNumber,
    status: 'draft',
    parts: JSON.parse(latestVersion.parts_json),
    questionGroups: JSON.parse(latestVersion.question_groups_json),
    totalQuestions: latestVersion.total_questions,
    audioConfig: JSON.parse(latestVersion.audio_config_json),
    validationErrors: JSON.parse(latestVersion.validation_errors_json || '[]'),
    createdAt: now,
  };
}

export async function publishListeningTestVersion(testId: string, versionId: string): Promise<void> {
  const versionRow = (await db.prepare('SELECT * FROM listening_test_versions WHERE id = ? AND test_id = ?').get(
    versionId,
    testId
  )) as any;

  if (!versionRow) throw new Error('Version not found');

  const parts = JSON.parse(versionRow.parts_json);
  const groups = JSON.parse(versionRow.question_groups_json);
  const audioConfig = JSON.parse(versionRow.audio_config_json);
  const validationErrors = validateListeningTestVersion(parts, groups, audioConfig);

  if (validationErrors.length > 0) {
    throw new Error(`Cannot publish: Test has validation errors:\n- ${validationErrors.join('\n- ')}`);
  }

  const now = new Date().toISOString();

  const tx = db.transaction(async () => {
    (await db.prepare(`
      UPDATE listening_test_versions
      SET status = 'published',
          published_at = ?
      WHERE id = ?
    `).run(now, versionId));

    (await db.prepare(`
      UPDATE listening_tests
      SET status = 'published',
          current_version_number = ?,
          updated_at = ?
      WHERE id = ?
    `).run(versionRow.version_number, now, testId));
  });

  (await tx());
}

export async function archiveListeningTest(testId: string): Promise<void> {
  (await db.prepare(`
    UPDATE listening_tests
    SET status = 'archived',
        updated_at = datetime('now')
    WHERE id = ?
  `).run(testId));
}

export async function getListeningTestById(testId: string): Promise<ListeningTest | null> {
  const row = (await db.prepare('SELECT * FROM listening_tests WHERE id = ?').get(testId)) as any;
  if (!row) return null;

  const latestVersion = (await db
    .prepare('SELECT * FROM listening_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1')
    .get(testId)) as any;

  let partCount = 0;
  let questionGroupsSummary: any[] = [];
  if (latestVersion) {
    try {
      const parts = JSON.parse(latestVersion.parts_json || '[]');
      const groups = JSON.parse(latestVersion.question_groups_json || '[]');
      partCount = parts.length;
      questionGroupsSummary = groups.map((g: any) => ({
        id: g.id,
        questionType: g.questionType,
        partNumber: g.partNumber,
        startQuestionNumber: g.startQuestionNumber,
        endQuestionNumber: g.endQuestionNumber,
        questionCount: g.questions?.length || (g.endQuestionNumber - g.startQuestionNumber + 1),
      }));
    } catch (e) {
      // ignore
    }
  }

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    audioMode: row.audio_mode,
    timeLimitMinutes: row.time_limit_minutes,
    currentVersionNumber: row.current_version_number,
    status: row.status,
    latestVersionId: latestVersion ? latestVersion.id : '',
    totalQuestions: latestVersion ? latestVersion.total_questions : 0,
    partCount,
    questionGroupsSummary,
    createdById: row.created_by_id,
    isFreeTier: Boolean(row.is_free_tier),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listListeningTests(params: {
  isTeacherOrAdmin: boolean;
  category?: TestMode;
}): Promise<ListeningTest[]> {
  let query = 'SELECT * FROM listening_tests WHERE 1=1';
  const args: any[] = [];

  if (!params.isTeacherOrAdmin) {
    query += " AND status = 'published'";
  }

  if (params.category) {
    query += ' AND category = ?';
    args.push(params.category);
  }

  query += ' ORDER BY created_at DESC';

  const rows = (await db.prepare(query).all(...args)) as any[];

  const tests = (await Promise.all((await asyncFilter(rows, async (row) => {
      if (params.isTeacherOrAdmin) return true;
      // Filter out scratch automated test titles with epoch timestamps
      if (/\b\d{10,}\b/.test(row.title)) return false;
      // Protected post-test check: hide if reserved in an unreleased post-test
      const isReserved = (await db.prepare(`
        SELECT 1 FROM assignments a
        LEFT JOIN test_packages tp ON a.package_id = tp.id
        WHERE a.purpose = 'post_test'
          AND (a.is_released = 0 OR a.release_at > datetime('now'))
          AND (a.test_id = ? OR tp.listening_test_id = ?)
        LIMIT 1
      `).get(row.id, row.id));
      return !isReserved;
    }))
    .map(async (row) => {
      const latestVersion = (await db
        .prepare('SELECT * FROM listening_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1')
        .get(row.id)) as any;

      let partCount = 0;
      let questionGroupsSummary: any[] = [];
      if (latestVersion) {
        try {
          const parts = JSON.parse(latestVersion.parts_json || '[]');
          const groups = JSON.parse(latestVersion.question_groups_json || '[]');
          partCount = parts.length;
          questionGroupsSummary = groups.map((g: any) => ({
            id: g.id,
            questionType: g.questionType,
            partNumber: g.partNumber,
            startQuestionNumber: g.startQuestionNumber,
            endQuestionNumber: g.endQuestionNumber,
            questionCount: g.questions?.length || (g.endQuestionNumber - g.startQuestionNumber + 1),
          }));
        } catch (e) {
          // ignore
        }
      }

      return {
        id: row.id,
        title: row.title,
        category: row.category,
        audioMode: row.audio_mode,
        timeLimitMinutes: row.time_limit_minutes,
        currentVersionNumber: row.current_version_number,
        status: row.status,
        latestVersionId: latestVersion ? latestVersion.id : '',
        totalQuestions: latestVersion ? latestVersion.total_questions : 0,
        partCount,
        questionGroupsSummary,
        createdById: row.created_by_id,
        isFreeTier: Boolean(row.is_free_tier),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    })));

  return sortTestsChronological(tests);
}

export async function getListeningVersionById(versionId: string): Promise<ListeningTestVersion | null> {
  const row = (await db.prepare('SELECT * FROM listening_test_versions WHERE id = ?').get(versionId)) as any;
  if (!row) return null;

  return {
    id: row.id,
    testId: row.test_id,
    versionNumber: row.version_number,
    status: row.status,
    parts: JSON.parse(row.parts_json),
    questionGroups: JSON.parse(row.question_groups_json),
    totalQuestions: row.total_questions,
    audioConfig: JSON.parse(row.audio_config_json || '{}'),
    validationErrors: JSON.parse(row.validation_errors_json || '[]'),
    publishedAt: row.published_at || undefined,
    createdAt: row.created_at,
  };
}
