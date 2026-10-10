import { db } from './db';
import { v4 as uuidv4 } from 'uuid';
import {
  WritingTask,
  WritingTaskVersion,
  WritingAttempt,
  WritingResponse,
  PublicationStatus,
  WritingTaskType,
  WritingTestType,
  WritingTaskNumber,
  WritingTaskSubtype,
  TestMode,
  AttemptStatus,
} from '../shared/types';
import { countWords } from '../shared/scoring';

/**
 * Validates a Writing Task Version before publishing.
 */
export function validateWritingTaskVersion(data: Partial<WritingTaskVersion>): string[] {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Task title is required.');
  }

  if (!data.prompt || data.prompt.trim().length < 20) {
    errors.push('Task prompt must be at least 20 characters.');
  }

  if (!data.instructions || data.instructions.trim().length === 0) {
    errors.push('Task instructions are required.');
  }

  if (!data.taskNumber || (data.taskNumber !== 1 && data.taskNumber !== 2)) {
    errors.push('Task number must be 1 or 2.');
  }

  if (data.taskNumber === 1 && data.taskType === 'academic_task_1') {
    // Require teacher-verified visual grounding description for Academic Task 1
    if (!data.teacherVisualDescription || data.teacherVisualDescription.trim().length < 30) {
      errors.push(
        'Academic Task 1 requires a teacher-verified visual description (at least 30 characters) to ground factual scoring and prevent AI hallucinations.'
      );
    }
  }

  if (data.minWords !== undefined && data.minWords < 50) {
    errors.push('Minimum word count must be at least 50 words.');
  }

  return errors;
}

/**
 * Creates a new Writing Task and initial draft version.
 */
export function createWritingTask(params: {
  createdById: string;
  title: string;
  taskType: WritingTaskType;
  taskNumber: WritingTaskNumber;
  testType: WritingTestType;
  subtype?: WritingTaskSubtype;
  prompt: string;
  instructions: string;
  minWords?: number;
  suggestedTimeMinutes?: number;
  images?: string[];
  structuredData?: any;
  teacherVisualDescription?: string;
  modelResponse?: string;
  teacherAssessmentGuidance?: string;
}): WritingTask {
  const taskId = uuidv4();
  const versionId = uuidv4();
  const minWords = params.minWords || (params.taskNumber === 1 ? 150 : 250);
  const suggestedTime = params.suggestedTimeMinutes || (params.taskNumber === 1 ? 20 : 40);

  const txn = db.transaction(() => {
    db.prepare(
      `INSERT INTO writing_tasks (
        id, title, task_type, task_number, test_type, current_version_number, status, created_by_id
      ) VALUES (?, ?, ?, ?, ?, 1, 'draft', ?)`
    ).run(taskId, params.title, params.taskType, params.taskNumber, params.testType, params.createdById);

    db.prepare(
      `INSERT INTO writing_task_versions (
        id, task_id, version_number, status, task_type, task_number, test_type,
        subtype, title, prompt, instructions, min_words, suggested_time_minutes,
        images_json, structured_data_json, teacher_visual_description,
        model_response, teacher_assessment_guidance
      ) VALUES (?, ?, 1, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      versionId,
      taskId,
      params.taskType,
      params.taskNumber,
      params.testType,
      params.subtype || null,
      params.title,
      params.prompt,
      params.instructions,
      minWords,
      suggestedTime,
      params.images ? JSON.stringify(params.images) : null,
      params.structuredData ? JSON.stringify(params.structuredData) : null,
      params.teacherVisualDescription || null,
      params.modelResponse || null,
      params.teacherAssessmentGuidance || null
    );

    return getWritingTaskById(taskId, 'teacher')!;
  });

  return txn();
}

/**
 * Updates a draft Writing Task version.
 */
export function updateWritingTaskDraft(
  taskId: string,
  params: Partial<WritingTaskVersion>
): WritingTask {
  const task = db.prepare('SELECT * FROM writing_tasks WHERE id = ?').get(taskId) as any;
  if (!task) throw new Error('Writing task not found.');

  const draftVersion = db
    .prepare('SELECT * FROM writing_task_versions WHERE task_id = ? AND status = ?')
    .get(taskId, 'draft') as any;

  if (!draftVersion) {
    throw new Error('No draft version available to edit. Fork a new version first.');
  }

  const updatedTitle = params.title !== undefined ? params.title : draftVersion.title;
  const updatedPrompt = params.prompt !== undefined ? params.prompt : draftVersion.prompt;
  const updatedInstructions =
    params.instructions !== undefined ? params.instructions : draftVersion.instructions;
  const updatedMinWords =
    params.minWords !== undefined ? params.minWords : draftVersion.min_words;
  const updatedSuggestedTime =
    params.suggestedTimeMinutes !== undefined
      ? params.suggestedTimeMinutes
      : draftVersion.suggested_time_minutes;
  const updatedSubtype = params.subtype !== undefined ? params.subtype : draftVersion.subtype;
  const updatedImages =
    params.images !== undefined ? JSON.stringify(params.images) : draftVersion.images_json;
  const updatedStructuredData =
    params.structuredData !== undefined
      ? JSON.stringify(params.structuredData)
      : draftVersion.structured_data_json;
  const updatedVisualDescription =
    params.teacherVisualDescription !== undefined
      ? params.teacherVisualDescription
      : draftVersion.teacher_visual_description;
  const updatedModelResponse =
    params.modelResponse !== undefined ? params.modelResponse : draftVersion.model_response;
  const updatedGuidance =
    params.teacherAssessmentGuidance !== undefined
      ? params.teacherAssessmentGuidance
      : draftVersion.teacher_assessment_guidance;

  const txn = db.transaction(() => {
    db.prepare(
      `UPDATE writing_tasks 
       SET title = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).run(updatedTitle, taskId);

    db.prepare(
      `UPDATE writing_task_versions
       SET title = ?, prompt = ?, instructions = ?, min_words = ?,
           suggested_time_minutes = ?, subtype = ?, images_json = ?,
           structured_data_json = ?, teacher_visual_description = ?,
           model_response = ?, teacher_assessment_guidance = ?
       WHERE id = ?`
    ).run(
      updatedTitle,
      updatedPrompt,
      updatedInstructions,
      updatedMinWords,
      updatedSuggestedTime,
      updatedSubtype,
      updatedImages,
      updatedStructuredData,
      updatedVisualDescription,
      updatedModelResponse,
      updatedGuidance,
      draftVersion.id
    );

    return getWritingTaskById(taskId, 'teacher')!;
  });

  return txn();
}

/**
 * Publishes a draft Writing Task version.
 */
export function publishWritingTask(taskId: string): WritingTask {
  const task = db.prepare('SELECT * FROM writing_tasks WHERE id = ?').get(taskId) as any;
  if (!task) throw new Error('Writing task not found.');

  const draftVersion = db
    .prepare('SELECT * FROM writing_task_versions WHERE task_id = ? AND status = ?')
    .get(taskId, 'draft') as any;

  if (!draftVersion) {
    throw new Error('No draft version found to publish.');
  }

  const mappedDraft = mapVersionRow(draftVersion, 'teacher');
  const validationErrors = validateWritingTaskVersion(mappedDraft);
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed: ${validationErrors.join('; ')}`);
  }

  const txn = db.transaction(() => {
    db.prepare(
      `UPDATE writing_task_versions 
       SET status = 'published', published_at = datetime('now'), validation_errors_json = NULL
       WHERE id = ?`
    ).run(draftVersion.id);

    db.prepare(
      `UPDATE writing_tasks
       SET status = 'published', updated_at = datetime('now')
       WHERE id = ?`
    ).run(taskId);

    return getWritingTaskById(taskId, 'teacher')!;
  });

  return txn();
}

/**
 * Forks a new draft version from the latest published version.
 */
export function forkWritingTaskVersion(taskId: string): WritingTask {
  const task = db.prepare('SELECT * FROM writing_tasks WHERE id = ?').get(taskId) as any;
  if (!task) throw new Error('Writing task not found.');

  const existingDraft = db
    .prepare('SELECT id FROM writing_task_versions WHERE task_id = ? AND status = ?')
    .get(taskId, 'draft');

  if (existingDraft) {
    throw new Error('A draft version already exists for this task.');
  }

  const latest = db
    .prepare(
      'SELECT * FROM writing_task_versions WHERE task_id = ? ORDER BY version_number DESC LIMIT 1'
    )
    .get(taskId) as any;

  if (!latest) throw new Error('No existing versions found to fork.');

  const newVersionNumber = latest.version_number + 1;
  const newVersionId = uuidv4();

  const txn = db.transaction(() => {
    db.prepare(
      `INSERT INTO writing_task_versions (
        id, task_id, version_number, status, task_type, task_number, test_type,
        subtype, title, prompt, instructions, min_words, suggested_time_minutes,
        images_json, structured_data_json, teacher_visual_description,
        model_response, teacher_assessment_guidance
      ) VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      newVersionId,
      taskId,
      newVersionNumber,
      latest.task_type,
      latest.task_number,
      latest.test_type,
      latest.subtype,
      latest.title,
      latest.prompt,
      latest.instructions,
      latest.min_words,
      latest.suggested_time_minutes,
      latest.images_json,
      latest.structured_data_json,
      latest.teacher_visual_description,
      latest.model_response,
      latest.teacher_assessment_guidance
    );

    db.prepare(
      `UPDATE writing_tasks
       SET current_version_number = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).run(newVersionNumber, taskId);

    return getWritingTaskById(taskId, 'teacher')!;
  });

  return txn();
}

/**
 * Archives a Writing task.
 */
export function archiveWritingTask(taskId: string): WritingTask {
  db.prepare(`UPDATE writing_tasks SET status = 'archived', updated_at = datetime('now') WHERE id = ?`).run(taskId);
  return getWritingTaskById(taskId, 'teacher')!;
}

/**
 * Retrieves a Writing task by ID.
 * When accessed by students, scrubs confidential teacher assessment guidance and unreleased model answers.
 */
export function getWritingTaskById(taskId: string, userRole: 'student' | 'teacher' | 'admin'): WritingTask | null {
  const row = db.prepare('SELECT * FROM writing_tasks WHERE id = ?').get(taskId) as any;
  if (!row) return null;

  const versionRows = db
    .prepare('SELECT * FROM writing_task_versions WHERE task_id = ? ORDER BY version_number ASC')
    .all(taskId) as any[];

  const versions = versionRows.map((v) => mapVersionRow(v, userRole));
  const latestVersion = versions[versions.length - 1];

  return {
    id: row.id,
    title: row.title,
    taskType: row.task_type,
    taskNumber: row.task_number,
    testType: row.test_type,
    currentVersionNumber: row.current_version_number,
    status: row.status,
    latestVersionId: latestVersion ? latestVersion.id : '',
    createdById: row.created_by_id,
    isFreeTier: Boolean(row.is_free_tier),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    versions,
  };
}

/**
 * Lists Writing tasks with optional filters.
 */
export function listWritingTasks(filter: {
  status?: PublicationStatus;
  taskType?: WritingTaskType;
  testType?: WritingTestType;
  taskNumber?: WritingTaskNumber;
  userRole: 'student' | 'teacher' | 'admin';
}): WritingTask[] {
  let query = 'SELECT * FROM writing_tasks WHERE 1=1';
  const params: any[] = [];

  if (filter.status) {
    query += ' AND status = ?';
    params.push(filter.status);
  } else if (filter.userRole === 'student') {
    query += " AND status = 'published'";
  }

  if (filter.taskType) {
    query += ' AND task_type = ?';
    params.push(filter.taskType);
  }

  if (filter.taskNumber) {
    query += ' AND task_number = ?';
    params.push(filter.taskNumber);
  }

  if (filter.testType) {
    query += ' AND (test_type = ? OR test_type = "both")';
    params.push(filter.testType);
  }

  query += ' ORDER BY created_at DESC';

  const rows = db.prepare(query).all(...params) as any[];
  return rows.map((r) => getWritingTaskById(r.id, filter.userRole)!);
}

// -------------------------------------------------------------
// STUDENT WRITING ATTEMPTS & RESPONSES
// -------------------------------------------------------------

/**
 * Starts or resumes a student Writing attempt.
 * For full mocks (Task 1 + Task 2), sets a shared server deadline of 60 minutes.
 * Handles autosaved response draft persistence.
 */
export function startOrResumeWritingAttempt(params: {
  userId: string;
  mode: TestMode;
  task1Id?: string;
  task2Id?: string;
  assignmentId?: string;
  packageAttemptId?: string;
}): WritingAttempt {
  const { userId, mode, task1Id, task2Id, assignmentId, packageAttemptId } = params;

  if (!task1Id && !task2Id) {
    throw new Error('At least one writing task (Task 1 or Task 2) must be specified.');
  }

  // Check for existing in-progress attempt for this context
  let existingQuery = `
    SELECT * FROM writing_attempts 
    WHERE user_id = ? AND status = 'in_progress'
  `;
  const existingParams: any[] = [userId];

  if (assignmentId) {
    existingQuery += ' AND assignment_id = ?';
    existingParams.push(assignmentId);
  } else if (packageAttemptId) {
    existingQuery += ' AND package_attempt_id = ?';
    existingParams.push(packageAttemptId);
  } else {
    // Standalone practice
    if (task1Id && task2Id) {
      existingQuery += ' AND task1_id = ? AND task2_id = ?';
      existingParams.push(task1Id, task2Id);
    } else if (task1Id) {
      existingQuery += ' AND task1_id = ? AND task2_id IS NULL';
      existingParams.push(task1Id);
    } else if (task2Id) {
      existingQuery += ' AND task2_id = ? AND task1_id IS NULL';
      existingParams.push(task2Id);
    }
  }

  const existingAttempt = db.prepare(existingQuery).get(...existingParams) as any;

  if (existingAttempt) {
    // Check if timed attempt has expired
    if (existingAttempt.deadline_at) {
      const deadline = new Date(existingAttempt.deadline_at).getTime();
      const now = Date.now();
      if (now > deadline) {
        // Automatically submit expired attempt
        return submitWritingAttempt(existingAttempt.id, userId);
      }
    }
    return getWritingAttemptById(existingAttempt.id)!;
  }

  // Determine latest published versions for the tasks
  let task1VersionId: string | undefined;
  let task2VersionId: string | undefined;
  let durationMinutes = 60; // Standard for full mock

  if (task1Id) {
    const t1v = db
      .prepare(
        `SELECT id FROM writing_task_versions 
         WHERE task_id = ? AND status = 'published' 
         ORDER BY version_number DESC LIMIT 1`
      )
      .get(task1Id) as any;
    if (!t1v) throw new Error(`Task 1 (${task1Id}) does not have a published version.`);
    task1VersionId = t1v.id;
  }

  if (task2Id) {
    const t2v = db
      .prepare(
        `SELECT id FROM writing_task_versions 
         WHERE task_id = ? AND status = 'published' 
         ORDER BY version_number DESC LIMIT 1`
      )
      .get(task2Id) as any;
    if (!t2v) throw new Error(`Task 2 (${task2Id}) does not have a published version.`);
    task2VersionId = t2v.id;
  }

  if (task1Id && !task2Id) durationMinutes = 20;
  if (!task1Id && task2Id) durationMinutes = 40;

  const attemptId = uuidv4();
  const startedAt = new Date().toISOString();
  let deadlineAt: string | null = null;

  if (mode === 'mock') {
    const deadlineDate = new Date(Date.now() + durationMinutes * 60 * 1000);
    deadlineAt = deadlineDate.toISOString();
  }

  const txn = db.transaction(() => {
    db.prepare(
      `INSERT INTO writing_attempts (
        id, user_id, mode, assignment_id, package_attempt_id,
        task1_id, task1_version_id, task2_id, task2_version_id,
        status, duration_minutes, deadline_at, started_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'in_progress', ?, ?, ?)`
    ).run(
      attemptId,
      userId,
      mode,
      assignmentId || null,
      packageAttemptId || null,
      task1Id || null,
      task1VersionId || null,
      task2Id || null,
      task2VersionId || null,
      durationMinutes,
      deadlineAt,
      startedAt
    );

    // Initial response slots
    if (task1Id && task1VersionId) {
      db.prepare(
        `INSERT INTO writing_responses (
          id, attempt_id, task_id, task_version_id, task_number, response_text, word_count, version, is_locked
        ) VALUES (?, ?, ?, ?, 1, '', 0, 1, 0)`
      ).run(uuidv4(), attemptId, task1Id, task1VersionId);
    }

    if (task2Id && task2VersionId) {
      db.prepare(
        `INSERT INTO writing_responses (
          id, attempt_id, task_id, task_version_id, task_number, response_text, word_count, version, is_locked
        ) VALUES (?, ?, ?, ?, 2, '', 0, 1, 0)`
      ).run(uuidv4(), attemptId, task2Id, task2VersionId);
    }

    // Link into package_attempt if part of pre/post package
    if (packageAttemptId) {
      db.prepare(`UPDATE package_attempts SET writing_attempt_id = ? WHERE id = ?`).run(
        attemptId,
        packageAttemptId
      );
    }

    return getWritingAttemptById(attemptId)!;
  });

  return txn();
}

/**
 * Autosaves student response draft for Task 1 or Task 2.
 */
export function saveWritingDraftResponse(params: {
  attemptId: string;
  taskNumber: WritingTaskNumber;
  responseText: string;
  userId: string;
}): { responseId: string; wordCount: number; lastSavedAt: string } {
  const { attemptId, taskNumber, responseText, userId } = params;

  const attempt = db.prepare('SELECT * FROM writing_attempts WHERE id = ?').get(attemptId) as any;
  if (!attempt) throw new Error('Writing attempt not found.');
  if (attempt.user_id !== userId) throw new Error('Unauthorized attempt access.');

  if (attempt.status !== 'in_progress') {
    throw new Error(`Cannot save: attempt is already ${attempt.status}.`);
  }

  // Check deadline
  if (attempt.deadline_at) {
    const deadline = new Date(attempt.deadline_at).getTime();
    if (Date.now() > deadline) {
      submitWritingAttempt(attemptId, userId);
      throw new Error('Time has expired for this test. Your work has been submitted.');
    }
  }

  // Find the active (unlocked, latest version) response for this taskNumber
  const response = db
    .prepare(
      `SELECT * FROM writing_responses 
       WHERE attempt_id = ? AND task_number = ? 
       ORDER BY version DESC LIMIT 1`
    )
    .get(attemptId, taskNumber) as any;

  if (!response) {
    throw new Error(`No response record found for task ${taskNumber}.`);
  }

  if (response.is_locked) {
    throw new Error('This response is locked and cannot be edited. Create a revision instead.');
  }

  const wordCount = countWords(responseText);
  const now = new Date().toISOString();

  db.prepare(
    `UPDATE writing_responses 
     SET response_text = ?, word_count = ?, last_saved_at = ?, updated_at = ?
     WHERE id = ?`
  ).run(responseText, wordCount, now, now, response.id);

  return {
    responseId: response.id,
    wordCount,
    lastSavedAt: now,
  };
}

/**
 * Submits a Writing attempt, locking the responses.
 */
export function submitWritingAttempt(attemptId: string, userId: string): WritingAttempt {
  const attempt = db.prepare('SELECT * FROM writing_attempts WHERE id = ?').get(attemptId) as any;
  if (!attempt) throw new Error('Writing attempt not found.');
  if (attempt.user_id !== userId) throw new Error('Unauthorized attempt access.');

  const now = new Date().toISOString();

  const txn = db.transaction(() => {
    // Lock all responses for this attempt
    db.prepare(`UPDATE writing_responses SET is_locked = 1, updated_at = ? WHERE attempt_id = ?`).run(
      now,
      attemptId
    );

    // Update attempt status
    db.prepare(
      `UPDATE writing_attempts 
       SET status = 'submitted', submitted_at = ?, updated_at = ? 
       WHERE id = ?`
    ).run(now, now, attemptId);

    return getWritingAttemptById(attemptId)!;
  });

  return txn();
}

/**
 * Creates a new response revision draft for practice review without altering original assessed work.
 */
export function createResponseRevision(params: {
  attemptId: string;
  taskNumber: WritingTaskNumber;
  userId: string;
}): WritingResponse {
  const { attemptId, taskNumber, userId } = params;

  const attempt = db.prepare('SELECT * FROM writing_attempts WHERE id = ?').get(attemptId) as any;
  if (!attempt) throw new Error('Writing attempt not found.');
  if (attempt.user_id !== userId) throw new Error('Unauthorized attempt access.');

  const latestResponse = db
    .prepare(
      `SELECT * FROM writing_responses 
       WHERE attempt_id = ? AND task_number = ? 
       ORDER BY version DESC LIMIT 1`
    )
    .get(attemptId, taskNumber) as any;

  if (!latestResponse) {
    throw new Error('No previous response found to revise.');
  }

  const newResponseId = uuidv4();
  const newVersion = latestResponse.version + 1;
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO writing_responses (
      id, attempt_id, task_id, task_version_id, task_number, response_text,
      word_count, version, parent_response_id, is_locked, last_saved_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`
  ).run(
    newResponseId,
    attemptId,
    latestResponse.task_id,
    latestResponse.task_version_id,
    taskNumber,
    latestResponse.response_text,
    latestResponse.word_count,
    newVersion,
    latestResponse.id,
    now,
    now,
    now
  );

  return mapResponseRow(
    db.prepare('SELECT * FROM writing_responses WHERE id = ?').get(newResponseId) as any
  );
}

/**
 * Retrieves a full Writing Attempt by ID including responses and assessments.
 */
export function getWritingAttemptById(attemptId: string): WritingAttempt | null {
  const row = db.prepare('SELECT * FROM writing_attempts WHERE id = ?').get(attemptId) as any;
  if (!row) return null;

  const user = db.prepare('SELECT full_name FROM users WHERE id = ?').get(row.user_id) as any;

  // Retrieve responses (latest version for each task number)
  const task1ResponseRow = db
    .prepare(
      `SELECT * FROM writing_responses 
       WHERE attempt_id = ? AND task_number = 1 
       ORDER BY version DESC LIMIT 1`
    )
    .get(attemptId) as any;

  const task2ResponseRow = db
    .prepare(
      `SELECT * FROM writing_responses 
       WHERE attempt_id = ? AND task_number = 2 
       ORDER BY version DESC LIMIT 1`
    )
    .get(attemptId) as any;

  const task1Response = task1ResponseRow ? mapResponseRow(task1ResponseRow) : undefined;
  const task2Response = task2ResponseRow ? mapResponseRow(task2ResponseRow) : undefined;

  // Task titles
  let task1Title: string | undefined;
  let task2Title: string | undefined;
  if (row.task1_id) {
    const t = db.prepare('SELECT title FROM writing_tasks WHERE id = ?').get(row.task1_id) as any;
    if (t) task1Title = t.title;
  }
  if (row.task2_id) {
    const t = db.prepare('SELECT title FROM writing_tasks WHERE id = ?').get(row.task2_id) as any;
    if (t) task2Title = t.title;
  }

  return {
    id: row.id,
    userId: row.user_id,
    userName: user ? user.full_name : undefined,
    mode: row.mode,
    assignmentId: row.assignment_id || undefined,
    packageAttemptId: row.package_attempt_id || undefined,
    task1Id: row.task1_id || undefined,
    task1VersionId: row.task1_version_id || undefined,
    task1Title,
    task2Id: row.task2_id || undefined,
    task2VersionId: row.task2_version_id || undefined,
    task2Title,
    status: row.status,
    task1Response,
    task2Response,
    durationMinutes: row.duration_minutes,
    deadlineAt: row.deadline_at || undefined,
    task1Band: row.task1_band !== null && row.task1_band !== undefined ? row.task1_band : undefined,
    task2Band: row.task2_band !== null && row.task2_band !== undefined ? row.task2_band : undefined,
    overallWritingBand:
      row.overall_writing_band !== null && row.overall_writing_band !== undefined
        ? row.overall_writing_band
        : undefined,
    startedAt: row.started_at,
    submittedAt: row.submitted_at || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Retrieves a response by ID.
 */
export function getWritingResponseById(responseId: string): WritingResponse | null {
  const row = db.prepare('SELECT * FROM writing_responses WHERE id = ?').get(responseId) as any;
  if (!row) return null;
  return mapResponseRow(row);
}

// -------------------------------------------------------------
// ROW MAPPERS & SANITIZATION
// -------------------------------------------------------------

function mapVersionRow(row: any, userRole: 'student' | 'teacher' | 'admin'): WritingTaskVersion {
  const isStudent = userRole === 'student';

  return {
    id: row.id,
    taskId: row.task_id,
    versionNumber: row.version_number,
    status: row.status,
    taskType: row.task_type,
    taskNumber: row.task_number,
    testType: row.test_type,
    subtype: row.subtype || undefined,
    title: row.title,
    prompt: row.prompt,
    instructions: row.instructions,
    minWords: row.min_words,
    suggestedTimeMinutes: row.suggested_time_minutes,
    images: row.images_json ? JSON.parse(row.images_json) : undefined,
    structuredData: row.structured_data_json ? JSON.parse(row.structured_data_json) : undefined,
    teacherVisualDescription: isStudent ? undefined : row.teacher_visual_description || undefined,
    modelResponse: isStudent ? undefined : row.model_response || undefined,
    teacherAssessmentGuidance: isStudent ? undefined : row.teacher_assessment_guidance || undefined,
    validationErrors: row.validation_errors_json
      ? JSON.parse(row.validation_errors_json)
      : undefined,
    publishedAt: row.published_at || undefined,
    createdAt: row.created_at,
  };
}

function mapResponseRow(row: any): WritingResponse {
  // Check if AI assessment exists for this response
  const assessmentRow = db
    .prepare('SELECT * FROM writing_assessments WHERE response_id = ?')
    .get(row.id) as any;

  let aiAssessment = undefined;
  if (assessmentRow) {
    aiAssessment = {
      id: assessmentRow.id,
      responseId: assessmentRow.response_id,
      attemptId: assessmentRow.attempt_id,
      taskNumber: assessmentRow.task_number,
      status: assessmentRow.status,
      taskType: assessmentRow.task_type,
      taskBand: assessmentRow.task_band !== null ? assessmentRow.task_band : undefined,
      criteria:
        assessmentRow.score_ta_tr !== null
          ? {
              taskAchievementOrResponse: assessmentRow.score_ta_tr,
              coherenceCohesion: assessmentRow.score_cc,
              lexicalResource: assessmentRow.score_lr,
              grammaticalRange: assessmentRow.score_gra,
            }
          : undefined,
      criterionFeedback: {
        taskAchievementOrResponse: assessmentRow.feedback_ta_tr || undefined,
        coherenceCohesion: assessmentRow.feedback_cc || undefined,
        lexicalResource: assessmentRow.feedback_lr || undefined,
        grammaticalRange: assessmentRow.feedback_gra || undefined,
      },
      evidenceQuotes: assessmentRow.evidence_quotes_json
        ? JSON.parse(assessmentRow.evidence_quotes_json)
        : undefined,
      strengths: assessmentRow.strengths_json
        ? JSON.parse(assessmentRow.strengths_json)
        : undefined,
      improvements: assessmentRow.improvements_json
        ? JSON.parse(assessmentRow.improvements_json)
        : undefined,
      corrections: assessmentRow.corrections_json
        ? JSON.parse(assessmentRow.corrections_json)
        : undefined,
      overallFeedback: assessmentRow.overall_feedback || undefined,
      isSimulated: Boolean(assessmentRow.is_simulated),
      errorMessage: assessmentRow.error_message || undefined,
      promptTokens: assessmentRow.prompt_tokens || undefined,
      completionTokens: assessmentRow.completion_tokens || undefined,
      createdAt: assessmentRow.created_at,
      completedAt: assessmentRow.completed_at || undefined,
    };
  }

  return {
    id: row.id,
    attemptId: row.attempt_id,
    taskId: row.task_id,
    taskVersionId: row.task_version_id,
    taskNumber: row.task_number,
    responseText: row.response_text,
    wordCount: row.word_count,
    version: row.version,
    parentResponseId: row.parent_response_id || undefined,
    isLocked: Boolean(row.is_locked),
    aiAssessment,
    lastSavedAt: row.last_saved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
