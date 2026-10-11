import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import {
  ReadingTest,
  ReadingTestVersion,
  ReadingPassage,
  QuestionGroup,
  PublicationStatus,
  ReadingTestType,
  TestMode,
} from '../shared/types';
import { sortTestsChronological } from '../shared/testOrder';

export function validateTestVersion(
  passages: ReadingPassage[],
  questionGroups: QuestionGroup[]
): string[] {
  const errors: string[] = [];

  if (!passages || passages.length === 0) {
    errors.push('At least one reading passage or section is required');
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

    if (group.questionType === 'multiple_choice_single' || group.questionType === 'multiple_choice_multi') {
      for (const q of group.questions) {
        if (!q.options || q.options.length < 2) {
          errors.push(`Question ${q.questionNumber}: Multiple choice questions must have at least 2 options`);
        }
      }
    }

    if (
      (group.questionType === 'matching_headings' ||
        group.questionType === 'matching_features' ||
        group.questionType === 'matching_sentence_endings' ||
        group.questionType === 'summary_completion_options') &&
      (!group.optionsList || group.optionsList.length === 0)
    ) {
      errors.push(`Question group "${group.title}": Matching format requires an options list`);
    }

    if (group.questionType === 'table_completion' && !group.tableData) {
      errors.push(`Question group "${group.title}": Table completion requires table rows and columns`);
    }

    if (group.questionType === 'flow_chart_completion' && (!group.flowChartSteps || group.flowChartSteps.length === 0)) {
      errors.push(`Question group "${group.title}": Flow-chart completion requires flowchart steps`);
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
 * Strips all answer keys, accepted alternatives, explanations, and evidence quotes
 * from the questions payload for students taking the test.
 */
export function sanitizeQuestionsForStudent(questionGroups: QuestionGroup[]): QuestionGroup[] {
  return questionGroups.map((group) => ({
    ...group,
    questions: group.questions.map((q) => {
      const sanitized = { ...q };
      delete (sanitized as any).answerKey;
      delete (sanitized as any).acceptedAlternatives;
      delete (sanitized as any).explanation;
      delete (sanitized as any).evidenceQuote;
      delete (sanitized as any).whyCorrect;
      delete (sanitized as any).whyIncorrect;
      delete (sanitized as any).commonTrap;
      delete (sanitized as any).keyParaphrases;
      delete (sanitized as any).distractorAnalysis;
      return sanitized;
    }),
  }));
}

export function createReadingTest(params: {
  title: string;
  testType: ReadingTestType;
  category: TestMode;
  timeLimitMinutes?: number;
  createdById: string;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
}): { test: ReadingTest; version: ReadingTestVersion } {
  const testId = uuidv4();
  const versionId = uuidv4();
  const now = new Date().toISOString();

  let totalQuestions = 0;
  for (const g of params.questionGroups) {
    totalQuestions += g.questions?.length || 0;
  }

  const validationErrors = validateTestVersion(params.passages, params.questionGroups);

  const insertTest = db.prepare(`
    INSERT INTO reading_tests (
      id, title, test_type, category, time_limit_minutes,
      current_version_number, status, created_by_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertVersion = db.prepare(`
    INSERT INTO reading_test_versions (
      id, test_id, version_number, status, passages_json,
      question_groups_json, total_questions, validation_errors_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    insertTest.run(
      testId,
      params.title,
      params.testType,
      params.category,
      params.timeLimitMinutes || 60,
      1,
      'draft',
      params.createdById,
      now,
      now
    );

    insertVersion.run(
      versionId,
      testId,
      1,
      'draft',
      JSON.stringify(params.passages),
      JSON.stringify(params.questionGroups),
      totalQuestions,
      JSON.stringify(validationErrors),
      now
    );
  });

  tx();

  const test: ReadingTest = {
    id: testId,
    title: params.title,
    testType: params.testType,
    category: params.category,
    timeLimitMinutes: params.timeLimitMinutes || 60,
    currentVersionNumber: 1,
    status: 'draft',
    latestVersionId: versionId,
    totalQuestions,
    createdById: params.createdById,
    createdAt: now,
    updatedAt: now,
  };

  const version: ReadingTestVersion = {
    id: versionId,
    testId,
    versionNumber: 1,
    status: 'draft',
    passages: params.passages,
    questionGroups: params.questionGroups,
    totalQuestions,
    validationErrors,
    createdAt: now,
  };

  return { test, version };
}

export function updateDraftVersion(params: {
  testId: string;
  versionId: string;
  title?: string;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
  timeLimitMinutes?: number;
}): { version: ReadingTestVersion; errors: string[] } {
  const versionRow = db.prepare('SELECT * FROM reading_test_versions WHERE id = ? AND test_id = ?').get(
    params.versionId,
    params.testId
  ) as any;

  if (!versionRow) {
    throw new Error('Test version not found');
  }

  if (versionRow.status === 'published') {
    throw new Error('Published versions are immutable. You must create a new version to make edits.');
  }

  let totalQuestions = 0;
  for (const g of params.questionGroups) {
    totalQuestions += g.questions?.length || 0;
  }

  const validationErrors = validateTestVersion(params.passages, params.questionGroups);

  const tx = db.transaction(() => {
    if (params.title || params.timeLimitMinutes) {
      db.prepare(`
        UPDATE reading_tests
        SET title = COALESCE(?, title),
            time_limit_minutes = COALESCE(?, time_limit_minutes),
            updated_at = datetime('now')
        WHERE id = ?
      `).run(params.title || null, params.timeLimitMinutes || null, params.testId);
    }

    db.prepare(`
      UPDATE reading_test_versions
      SET passages_json = ?,
          question_groups_json = ?,
          total_questions = ?,
          validation_errors_json = ?
      WHERE id = ?
    `).run(
      JSON.stringify(params.passages),
      JSON.stringify(params.questionGroups),
      totalQuestions,
      JSON.stringify(validationErrors),
      params.versionId
    );
  });

  tx();

  return {
    version: {
      id: params.versionId,
      testId: params.testId,
      versionNumber: versionRow.version_number,
      status: versionRow.status,
      passages: params.passages,
      questionGroups: params.questionGroups,
      totalQuestions,
      validationErrors,
      createdAt: versionRow.created_at,
    },
    errors: validationErrors,
  };
}

/**
 * Creates a new draft version when a teacher wishes to edit a published test.
 * Preserves historical versions and their attempts completely.
 */
export function forkNewDraftVersion(testId: string): ReadingTestVersion {
  const test = db.prepare('SELECT * FROM reading_tests WHERE id = ?').get(testId) as any;
  if (!test) throw new Error('Test not found');

  const latestVersion = db
    .prepare('SELECT * FROM reading_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1')
    .get(testId) as any;

  if (!latestVersion) throw new Error('No existing versions found');

  const newVersionNumber = latestVersion.version_number + 1;
  const newVersionId = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO reading_test_versions (
      id, test_id, version_number, status, passages_json,
      question_groups_json, total_questions, validation_errors_json, created_at
    ) VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?)
  `).run(
    newVersionId,
    testId,
    newVersionNumber,
    latestVersion.passages_json,
    latestVersion.question_groups_json,
    latestVersion.total_questions,
    latestVersion.validation_errors_json,
    now
  );

  db.prepare(`
    UPDATE reading_tests
    SET current_version_number = ?,
        updated_at = ?
    WHERE id = ?
  `).run(newVersionNumber, now, testId);

  return {
    id: newVersionId,
    testId,
    versionNumber: newVersionNumber,
    status: 'draft',
    passages: JSON.parse(latestVersion.passages_json),
    questionGroups: JSON.parse(latestVersion.question_groups_json),
    totalQuestions: latestVersion.total_questions,
    validationErrors: JSON.parse(latestVersion.validation_errors_json || '[]'),
    createdAt: now,
  };
}

export function publishTestVersion(testId: string, versionId: string): void {
  const versionRow = db.prepare('SELECT * FROM reading_test_versions WHERE id = ? AND test_id = ?').get(
    versionId,
    testId
  ) as any;

  if (!versionRow) throw new Error('Version not found');

  const passages = JSON.parse(versionRow.passages_json);
  const groups = JSON.parse(versionRow.question_groups_json);
  const validationErrors = validateTestVersion(passages, groups);

  if (validationErrors.length > 0) {
    throw new Error(`Cannot publish: Test has validation errors:\n- ${validationErrors.join('\n- ')}`);
  }

  const now = new Date().toISOString();

  const tx = db.transaction(() => {
    // Set this version to published
    db.prepare(`
      UPDATE reading_test_versions
      SET status = 'published',
          published_at = ?
      WHERE id = ?
    `).run(now, versionId);

    // Update parent test status
    db.prepare(`
      UPDATE reading_tests
      SET status = 'published',
          current_version_number = ?,
          updated_at = ?
      WHERE id = ?
    `).run(versionRow.version_number, now, testId);
  });

  tx();
}

export function archiveTest(testId: string): void {
  db.prepare(`
    UPDATE reading_tests
    SET status = 'archived',
        updated_at = datetime('now')
    WHERE id = ?
  `).run(testId);
}

export function getTestById(testId: string): ReadingTest | null {
  const row = db.prepare('SELECT * FROM reading_tests WHERE id = ?').get(testId) as any;
  if (!row) return null;

  const latestVersion = db
    .prepare('SELECT * FROM reading_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1')
    .get(testId) as any;

  let passageCount = 0;
  let questionGroupsSummary: any[] = [];
  if (latestVersion) {
    try {
      const passages = JSON.parse(latestVersion.passages_json || '[]');
      const groups = JSON.parse(latestVersion.question_groups_json || '[]');
      passageCount = passages.length;
      questionGroupsSummary = groups.map((g: any) => ({
        id: g.id,
        questionType: g.questionType,
        passageId: g.passageId,
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
    testType: row.test_type,
    category: row.category,
    timeLimitMinutes: row.time_limit_minutes,
    currentVersionNumber: row.current_version_number,
    status: row.status,
    latestVersionId: latestVersion ? latestVersion.id : '',
    totalQuestions: latestVersion ? latestVersion.total_questions : 0,
    passageCount,
    questionGroupsSummary,
    createdById: row.created_by_id,
    isFreeTier: Boolean(row.is_free_tier),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listTests(params: {
  isTeacherOrAdmin: boolean;
  testType?: ReadingTestType;
  category?: TestMode;
}): ReadingTest[] {
  let query = 'SELECT * FROM reading_tests WHERE 1=1';
  const args: any[] = [];

  if (!params.isTeacherOrAdmin) {
    query += " AND status = 'published'";
  }

  if (params.testType) {
    query += ' AND test_type = ?';
    args.push(params.testType);
  }

  if (params.category) {
    query += ' AND category = ?';
    args.push(params.category);
  }

  query += ' ORDER BY created_at DESC';

  const rows = db.prepare(query).all(...args) as any[];

  const tests = rows
    .filter((row) => {
      if (params.isTeacherOrAdmin) return true;
      // Filter out scratch automated test titles with epoch timestamps
      if (/\b\d{10,}\b/.test(row.title)) return false;
      // Protected post-test check: hide if reserved in an unreleased post-test
      const isReserved = db.prepare(`
        SELECT 1 FROM assignments a
        LEFT JOIN test_packages tp ON a.package_id = tp.id
        WHERE a.purpose = 'post_test'
          AND (a.is_released = 0 OR a.release_at > datetime('now'))
          AND (a.test_id = ? OR tp.reading_test_id = ?)
        LIMIT 1
      `).get(row.id, row.id);
      return !isReserved;
    })
    .map((row) => {
      const latestVersion = db
        .prepare('SELECT * FROM reading_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1')
        .get(row.id) as any;
      let passageCount = 0;
      let questionGroupsSummary: any[] = [];
    if (latestVersion) {
      try {
        const passages = JSON.parse(latestVersion.passages_json || '[]');
        const groups = JSON.parse(latestVersion.question_groups_json || '[]');
        passageCount = passages.length;
        questionGroupsSummary = groups.map((g: any) => ({
          id: g.id,
          questionType: g.questionType,
          passageId: g.passageId,
          startQuestionNumber: g.startQuestionNumber,
          endQuestionNumber: g.endQuestionNumber,
          questionCount: g.questions?.length || (g.endQuestionNumber - g.startQuestionNumber + 1),
        }));
      } catch (e) {
        // ignore parse errors
      }
    }

    return {
      id: row.id,
      title: row.title,
      testType: row.test_type,
      category: row.category,
      timeLimitMinutes: row.time_limit_minutes,
      currentVersionNumber: row.current_version_number,
      status: row.status,
      latestVersionId: latestVersion ? latestVersion.id : '',
      totalQuestions: latestVersion ? latestVersion.total_questions : 0,
      passageCount,
      questionGroupsSummary,
      createdById: row.created_by_id,
      isFreeTier: Boolean(row.is_free_tier),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });

  return sortTestsChronological(tests);
}

export function getVersionById(versionId: string): ReadingTestVersion | null {
  const row = db.prepare('SELECT * FROM reading_test_versions WHERE id = ?').get(versionId) as any;
  if (!row) return null;

  return {
    id: row.id,
    testId: row.test_id,
    versionNumber: row.version_number,
    status: row.status,
    passages: JSON.parse(row.passages_json),
    questionGroups: JSON.parse(row.question_groups_json),
    totalQuestions: row.total_questions,
    validationErrors: JSON.parse(row.validation_errors_json || '[]'),
    publishedAt: row.published_at || undefined,
    createdAt: row.created_at,
  };
}
