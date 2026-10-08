import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import {
  Assignment,
  AssignmentPurpose,
  TestPackage,
  PackageAttempt,
  PackageType,
  PackageMode,
  ClassTestType,
  TestMode,
  PrePostComparisonReport,
  SkillComparisonItem,
  SpeakingAssessment,
} from '../shared/types';
import { isStudentInClass } from './classService';
import { formatMakassarDateTime, isOverdue } from '../shared/dateUtils';
import { startOrResumeAttempt } from './attemptService';
import { startOrResumeListeningAttempt } from './listeningAttemptService';
import { getSpeakingAssessmentById } from './speakingService';
import { getWritingAttemptById } from './writingService';
import { calculateIeltsFourSkillOverallBand } from '../shared/scoring';

// -------------------------------------------------------------
// TEST PACKAGES (4-SKILL SLOTS / FIXED VERSIONS)
// -------------------------------------------------------------

export function createTestPackage(
  teacherId: string,
  data: {
    title: string;
    packageType: PackageType;
    testType: ClassTestType;
    listeningTestId?: string;
    listeningVersionId?: string;
    readingTestId?: string;
    readingVersionId?: string;
    writingTask1Id?: string;
    writingTask1VersionId?: string;
    writingTask2Id?: string;
    writingTask2VersionId?: string;
    speakingSetId?: string;
    speakingSetVersionId?: string;
  }
): TestPackage {
  if (!data.title || !data.title.trim()) {
    throw new Error('Test package title is required.');
  }

  // Validate reading version if provided
  if (data.readingTestId && !data.readingVersionId) {
    const readingVersion = db.prepare('SELECT id FROM reading_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1').get(data.readingTestId) as any;
    if (readingVersion) {
      data.readingVersionId = readingVersion.id;
    }
  }

  // Validate listening version if provided
  if (data.listeningTestId && !data.listeningVersionId) {
    const listeningVersion = db.prepare('SELECT id FROM listening_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1').get(data.listeningTestId) as any;
    if (listeningVersion) {
      data.listeningVersionId = listeningVersion.id;
    }
  }

  // Validate writing task versions if provided
  if (data.writingTask1Id && !data.writingTask1VersionId) {
    const w1Version = db.prepare('SELECT id FROM writing_task_versions WHERE task_id = ? ORDER BY version_number DESC LIMIT 1').get(data.writingTask1Id) as any;
    if (w1Version) {
      data.writingTask1VersionId = w1Version.id;
    }
  }
  if (data.writingTask2Id && !data.writingTask2VersionId) {
    const w2Version = db.prepare('SELECT id FROM writing_task_versions WHERE task_id = ? ORDER BY version_number DESC LIMIT 1').get(data.writingTask2Id) as any;
    if (w2Version) {
      data.writingTask2VersionId = w2Version.id;
    }
  }

  // Validate speaking set version if provided
  if (data.speakingSetId && !data.speakingSetVersionId) {
    const speakingVersion = db.prepare('SELECT id FROM speaking_set_versions WHERE set_id = ? ORDER BY version_number DESC LIMIT 1').get(data.speakingSetId) as any;
    if (speakingVersion) {
      data.speakingSetVersionId = speakingVersion.id;
    }
  }

  const writingStatus = (data.writingTask1Id || data.writingTask2Id) ? 'configured' : 'not_implemented';
  const speakingStatus = data.speakingSetId ? 'configured' : 'not_implemented';

  const id = uuidv4();
  db.prepare(`
    INSERT INTO test_packages (
      id, title, package_type, test_type,
      listening_test_id, listening_version_id,
      reading_test_id, reading_version_id,
      writing_task1_id, writing_task1_version_id,
      writing_task2_id, writing_task2_version_id,
      speaking_set_id, speaking_set_version_id,
      writing_status, speaking_status,
      created_by_id, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    id,
    data.title.trim(),
    data.packageType,
    data.testType,
    data.listeningTestId || null,
    data.listeningVersionId || null,
    data.readingTestId || null,
    data.readingVersionId || null,
    data.writingTask1Id || null,
    data.writingTask1VersionId || null,
    data.writingTask2Id || null,
    data.writingTask2VersionId || null,
    data.speakingSetId || null,
    data.speakingSetVersionId || null,
    writingStatus,
    speakingStatus,
    teacherId
  );

  return getTestPackageById(id);
}

export function getTestPackageById(packageId: string): TestPackage {
  const row = db.prepare(`
    SELECT tp.*,
      rt.title as reading_test_title,
      lt.title as listening_test_title,
      wt1.title as writing_task1_title,
      wt2.title as writing_task2_title,
      ss.title as speaking_set_title
    FROM test_packages tp
    LEFT JOIN reading_tests rt ON tp.reading_test_id = rt.id
    LEFT JOIN listening_tests lt ON tp.listening_test_id = lt.id
    LEFT JOIN writing_tasks wt1 ON tp.writing_task1_id = wt1.id
    LEFT JOIN writing_tasks wt2 ON tp.writing_task2_id = wt2.id
    LEFT JOIN speaking_sets ss ON tp.speaking_set_id = ss.id
    WHERE tp.id = ?
  `).get(packageId) as any;

  if (!row) {
    throw new Error('Test package not found.');
  }

  return {
    id: row.id,
    title: row.title,
    packageType: row.package_type as PackageType,
    testType: row.test_type as ClassTestType,
    listeningTestId: row.listening_test_id || undefined,
    listeningVersionId: row.listening_version_id || undefined,
    listeningTestTitle: row.listening_test_title || undefined,
    readingTestId: row.reading_test_id || undefined,
    readingVersionId: row.reading_version_id || undefined,
    readingTestTitle: row.reading_test_title || undefined,
    writingTask1Id: row.writing_task1_id || undefined,
    writingTask1VersionId: row.writing_task1_version_id || undefined,
    writingTask1Title: row.writing_task1_title || undefined,
    writingTask2Id: row.writing_task2_id || undefined,
    writingTask2VersionId: row.writing_task2_version_id || undefined,
    writingTask2Title: row.writing_task2_title || undefined,
    speakingSetId: row.speaking_set_id || undefined,
    speakingSetVersionId: row.speaking_set_version_id || undefined,
    speakingSetTitle: row.speaking_set_title || undefined,
    writingStatus: (row.writing_task1_id || row.writing_task2_id) ? 'configured' : 'not_implemented',
    speakingStatus: row.speaking_set_id ? 'configured' : 'not_implemented',
    createdById: row.created_by_id,
    createdAt: row.created_at,
  };
}

export function listTestPackages(testType?: ClassTestType): TestPackage[] {
  let query = `
    SELECT tp.*,
      rt.title as reading_test_title,
      lt.title as listening_test_title,
      wt1.title as writing_task1_title,
      wt2.title as writing_task2_title,
      ss.title as speaking_set_title
    FROM test_packages tp
    LEFT JOIN reading_tests rt ON tp.reading_test_id = rt.id
    LEFT JOIN listening_tests lt ON tp.listening_test_id = lt.id
    LEFT JOIN writing_tasks wt1 ON tp.writing_task1_id = wt1.id
    LEFT JOIN writing_tasks wt2 ON tp.writing_task2_id = wt2.id
    LEFT JOIN speaking_sets ss ON tp.speaking_set_id = ss.id
  `;
  const params: any[] = [];
  if (testType) {
    query += ' WHERE tp.test_type = ?';
    params.push(testType);
  }
  query += ' ORDER BY tp.created_at DESC';

  const rows = db.prepare(query).all(...params) as any[];
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    packageType: row.package_type as PackageType,
    testType: row.test_type as ClassTestType,
    listeningTestId: row.listening_test_id || undefined,
    listeningVersionId: row.listening_version_id || undefined,
    listeningTestTitle: row.listening_test_title || undefined,
    readingTestId: row.reading_test_id || undefined,
    readingVersionId: row.reading_version_id || undefined,
    readingTestTitle: row.reading_test_title || undefined,
    writingTask1Id: row.writing_task1_id || undefined,
    writingTask1VersionId: row.writing_task1_version_id || undefined,
    writingTask1Title: row.writing_task1_title || undefined,
    writingTask2Id: row.writing_task2_id || undefined,
    writingTask2VersionId: row.writing_task2_version_id || undefined,
    writingTask2Title: row.writing_task2_title || undefined,
    speakingSetId: row.speaking_set_id || undefined,
    speakingSetVersionId: row.speaking_set_version_id || undefined,
    speakingSetTitle: row.speaking_set_title || undefined,
    writingStatus: (row.writing_task1_id || row.writing_task2_id) ? 'configured' : 'not_implemented',
    speakingStatus: row.speaking_set_id ? 'configured' : 'not_implemented',
    createdById: row.created_by_id,
    createdAt: row.created_at,
  }));
}

// -------------------------------------------------------------
// ASSIGNMENTS & PROTECTED POST-TEST CONTENT
// -------------------------------------------------------------

export function createAssignment(
  teacherId: string,
  classId: string,
  data: {
    title: string;
    instructions?: string;
    purpose: AssignmentPurpose;
    packageId?: string;
    skill?: 'reading' | 'listening' | 'speaking' | 'all';
    testId?: string;
    versionId?: string;
    mode?: TestMode;
    releaseAt?: string;
    deadlineAt?: string;
    attemptLimit?: number;
    isReleased?: boolean;
    studentIds?: string[];
  },
  isAdmin = false
): { assignment: Assignment; warning?: string } {
  const classRow = db.prepare('SELECT * FROM classes WHERE id = ?').get(classId) as any;
  if (!classRow) {
    throw new Error('Class not found.');
  }

  if (!isAdmin && classRow.teacher_id !== teacherId) {
    throw new Error('You do not have permission to assign work in this class.');
  }

  if (!data.title || !data.title.trim()) {
    throw new Error('Assignment title is required.');
  }

  // Material overlap check between pre-test and post-test
  let warning: string | undefined;
  if (data.purpose === 'post_test') {
    const existingPreTest = db.prepare(`
      SELECT a.*, tp.reading_test_id, tp.listening_test_id, tp.speaking_set_id
      FROM assignments a
      LEFT JOIN test_packages tp ON a.package_id = tp.id
      WHERE a.class_id = ? AND a.purpose = 'pre_test'
      LIMIT 1
    `).get(classId) as any;

    if (existingPreTest && data.packageId) {
      const postPkg = getTestPackageById(data.packageId);
      if (
        (postPkg.readingTestId && postPkg.readingTestId === existingPreTest.reading_test_id) ||
        (postPkg.listeningTestId && postPkg.listeningTestId === existingPreTest.listening_test_id) ||
        (postPkg.speakingSetId && postPkg.speakingSetId === existingPreTest.speaking_set_id)
      ) {
        warning =
          'Overlapping material detected: The selected post-test package contains the same test material as the class pre-test. Pre-test and post-test must use different comparable content to assess learning accurately. Difficulty equivalence is not assumed without verified standardization.';
      }
    }
  }

  // Release policy: post-test requires explicit teacher release
  const isReleased = data.purpose === 'post_test' ? Boolean(data.isReleased) : data.isReleased !== undefined ? Boolean(data.isReleased) : true;
  const releaseAt = data.releaseAt || new Date().toISOString();
  const attemptLimit = data.attemptLimit && data.attemptLimit > 0 ? data.attemptLimit : (data.purpose === 'practice' ? 3 : 1);
  const mode = data.mode || (data.purpose === 'practice' ? 'practice' : 'mock');

  const id = uuidv4();
  db.prepare(`
    INSERT INTO assignments (
      id, class_id, title, instructions, purpose,
      package_id, skill, test_id, version_id,
      mode, release_at, deadline_at, attempt_limit, is_released,
      created_by_id, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    id,
    classId,
    data.title.trim(),
    data.instructions ? data.instructions.trim() : null,
    data.purpose,
    data.packageId || null,
    data.skill || (data.packageId ? 'all' : 'reading'),
    data.testId || null,
    data.versionId || null,
    mode,
    releaseAt,
    data.deadlineAt || null,
    attemptLimit,
    isReleased ? 1 : 0,
    teacherId
  );

  // If specific students targeted, insert access grants
  if (data.studentIds && data.studentIds.length > 0) {
    const insertGrant = db.prepare('INSERT OR IGNORE INTO assignment_access_grants (id, assignment_id, student_id) VALUES (?, ?, ?)');
    for (const sId of data.studentIds) {
      insertGrant.run(uuidv4(), id, sId);
    }
  }

  return { assignment: getAssignmentById(id), warning };
}

export function releasePostTestAssignment(teacherId: string, assignmentId: string, isAdmin = false): Assignment {
  const row = db.prepare(`
    SELECT a.*, c.teacher_id
    FROM assignments a
    JOIN classes c ON a.class_id = c.id
    WHERE a.id = ?
  `).get(assignmentId) as any;

  if (!row) {
    throw new Error('Assignment not found.');
  }

  if (!isAdmin && row.teacher_id !== teacherId) {
    throw new Error('You do not have permission to release this post-test.');
  }

  db.prepare(`
    UPDATE assignments
    SET is_released = 1, release_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ?
  `).run(assignmentId);

  return getAssignmentById(assignmentId);
}

export function getAssignmentById(assignmentId: string, studentId?: string): Assignment {
  const row = db.prepare(`
    SELECT a.*,
      c.title as class_title,
      tp.title as package_title,
      rt.title as reading_title,
      lt.title as listening_title,
      ss.title as speaking_title
    FROM assignments a
    JOIN classes c ON a.class_id = c.id
    LEFT JOIN test_packages tp ON a.package_id = tp.id
    LEFT JOIN reading_tests rt ON a.test_id = rt.id
    LEFT JOIN listening_tests lt ON a.test_id = lt.id
    LEFT JOIN speaking_sets ss ON a.test_id = ss.id
    WHERE a.id = ?
  `).get(assignmentId) as any;

  if (!row) {
    throw new Error('Assignment not found.');
  }

  const assignment: Assignment = {
    id: row.id,
    classId: row.class_id,
    classTitle: row.class_title,
    title: row.title,
    instructions: row.instructions || undefined,
    purpose: row.purpose as AssignmentPurpose,
    packageId: row.package_id || undefined,
    packageTitle: row.package_title || undefined,
    skill: row.skill || undefined,
    testId: row.test_id || undefined,
    testTitle: row.reading_title || row.listening_title || row.speaking_title || undefined,
    versionId: row.version_id || undefined,
    mode: row.mode as TestMode,
    releaseAt: row.release_at,
    deadlineAt: row.deadline_at || undefined,
    attemptLimit: row.attempt_limit,
    isReleased: Boolean(row.is_released),
    createdById: row.created_by_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (studentId) {
    populateStudentAssignmentStatus(assignment, studentId);
  }

  return assignment;
}

/**
 * Checks if a test is reserved in an unreleased post-test assignment.
 * When true, student access through practice catalogue or direct URL is strictly BLOCKED.
 */
export function isTestReservedInUnreleasedPostTest(testId: string): boolean {
  const row = db.prepare(`
    SELECT 1 FROM assignments a
    LEFT JOIN test_packages tp ON a.package_id = tp.id
    WHERE a.purpose = 'post_test'
      AND (a.is_released = 0 OR a.release_at > datetime('now'))
      AND (
        a.test_id = ?
        OR tp.reading_test_id = ?
        OR tp.listening_test_id = ?
        OR tp.speaking_set_id = ?
      )
    LIMIT 1
  `).get(testId, testId, testId, testId);

  return Boolean(row);
}

/**
 * Lists all assignments for a class with student completion or teacher submission stats.
 */
export function listClassAssignments(
  classId: string,
  userId: string,
  userRole: string
): Assignment[] {
  const isTeacherOrAdmin = userRole === 'teacher' || userRole === 'admin';

  if (!isTeacherOrAdmin) {
    // Verify student is active member
    if (!isStudentInClass(classId, userId)) {
      throw new Error('You are not enrolled in this class.');
    }
  }

  const rows = db.prepare(`
    SELECT a.*,
      c.title as class_title,
      tp.title as package_title,
      rt.title as reading_title,
      lt.title as listening_title
    FROM assignments a
    JOIN classes c ON a.class_id = c.id
    LEFT JOIN test_packages tp ON a.package_id = tp.id
    LEFT JOIN reading_tests rt ON a.test_id = rt.id
    LEFT JOIN listening_tests lt ON a.test_id = lt.id
    WHERE a.class_id = ?
    ORDER BY
      CASE a.purpose
        WHEN 'pre_test' THEN 1
        WHEN 'practice' THEN 2
        WHEN 'post_test' THEN 3
        ELSE 4
      END,
      a.created_at ASC
  `).all(classId) as any[];

  return rows.map((row) => {
    const a: Assignment = {
      id: row.id,
      classId: row.class_id,
      classTitle: row.class_title,
      title: row.title,
      instructions: row.instructions || undefined,
      purpose: row.purpose as AssignmentPurpose,
      packageId: row.package_id || undefined,
      packageTitle: row.package_title || undefined,
      skill: row.skill || undefined,
      testId: row.test_id || undefined,
      testTitle: row.reading_title || row.listening_title || undefined,
      versionId: row.version_id || undefined,
      mode: row.mode as TestMode,
      releaseAt: row.release_at,
      deadlineAt: row.deadline_at || undefined,
      attemptLimit: row.attempt_limit,
      isReleased: Boolean(row.is_released),
      createdById: row.created_by_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    if (!isTeacherOrAdmin) {
      populateStudentAssignmentStatus(a, userId);
    }
    return a;
  });
}

function populateStudentAssignmentStatus(a: Assignment, studentId: string): void {
  // If package assignment
  if (a.packageId) {
    const pkgAttempts = db.prepare(`
      SELECT * FROM package_attempts
      WHERE assignment_id = ? AND user_id = ?
      ORDER BY started_at DESC
    `).all(a.id, studentId) as any[];

    a.studentAttemptCount = pkgAttempts.length;

    if (!a.isReleased || new Date(a.releaseAt).getTime() > Date.now()) {
      a.studentStatus = 'not_started';
      return;
    }

    if (pkgAttempts.length === 0) {
      a.studentStatus = isOverdue(a.deadlineAt) ? 'overdue' : 'not_started';
      return;
    }

    const latest = pkgAttempts[0];
    a.activeAttemptId = latest.id;
    if (latest.status === 'completed') {
      a.studentStatus = 'submitted';
    } else {
      a.studentStatus = isOverdue(a.deadlineAt) ? 'overdue' : 'in_progress';
    }
  } else if (a.skill === 'speaking') {
    // Speaking assessment assignment
    const assessment = db.prepare(`
      SELECT * FROM speaking_assessments
      WHERE assignment_id = ? AND student_id = ?
      ORDER BY updated_at DESC LIMIT 1
    `).get(a.id, studentId) as any;

    if (!a.isReleased || new Date(a.releaseAt).getTime() > Date.now()) {
      a.studentStatus = 'not_started';
      return;
    }

    if (!assessment) {
      a.studentAttemptCount = 0;
      a.studentStatus = isOverdue(a.deadlineAt) ? 'overdue' : 'not_started';
      return;
    }

    a.studentAttemptCount = 1;
    a.speakingAssessmentId = assessment.id;
    a.speakingSessionStatus = assessment.status; // 'draft' | 'released'
    if (assessment.status === 'released') {
      a.studentStatus = 'submitted';
      a.lastAttemptBand = assessment.overall_band !== null ? assessment.overall_band : undefined;
    } else {
      a.studentStatus = isOverdue(a.deadlineAt) ? 'overdue' : 'in_progress';
    }
    return;
  } else if (a.skill === 'writing') {
    // Writing assignment
    const attempts = db.prepare(`
      SELECT * FROM writing_attempts
      WHERE assignment_id = ? AND user_id = ?
      ORDER BY started_at DESC
    `).all(a.id, studentId) as any[];

    a.studentAttemptCount = attempts.length;

    if (!a.isReleased || new Date(a.releaseAt).getTime() > Date.now()) {
      a.studentStatus = 'not_started';
      return;
    }

    if (attempts.length === 0) {
      a.studentStatus = isOverdue(a.deadlineAt) ? 'overdue' : 'not_started';
      return;
    }

    const latest = attempts[0];
    a.activeAttemptId = latest.id;
    if (latest.status === 'submitted' || latest.status === 'expired') {
      a.studentStatus = 'submitted';
      a.lastAttemptBand = latest.overall_writing_band !== null ? latest.overall_writing_band : undefined;
    } else {
      a.studentStatus = isOverdue(a.deadlineAt) ? 'overdue' : 'in_progress';
    }
    return;
  } else {
    // Reading or Listening single skill assignment
    let attempts: any[] = [];
    if (a.skill === 'listening') {
      attempts = db.prepare(`
        SELECT * FROM listening_attempts
        WHERE assignment_id = ? AND user_id = ?
        ORDER BY started_at DESC
      `).all(a.id, studentId) as any[];
    } else {
      attempts = db.prepare(`
        SELECT * FROM reading_attempts
        WHERE assignment_id = ? AND user_id = ?
        ORDER BY started_at DESC
      `).all(a.id, studentId) as any[];
    }

    a.studentAttemptCount = attempts.length;

    if (!a.isReleased || new Date(a.releaseAt).getTime() > Date.now()) {
      a.studentStatus = 'not_started';
      return;
    }

    if (attempts.length === 0) {
      a.studentStatus = isOverdue(a.deadlineAt) ? 'overdue' : 'not_started';
      return;
    }

    const latest = attempts[0];
    a.activeAttemptId = latest.id;
    if (latest.status === 'submitted' || latest.status === 'expired') {
      a.studentStatus = 'submitted';
      a.lastAttemptScore = latest.raw_score;
      a.lastAttemptTotal = latest.total_questions;
      a.lastAttemptBand = latest.band_score;
    } else {
      a.studentStatus = isOverdue(a.deadlineAt) ? 'overdue' : 'in_progress';
    }
  }
}

// -------------------------------------------------------------
// PACKAGE ATTEMPTS & SKILL TRANSITIONS
// -------------------------------------------------------------

export function startOrResumePackageAttempt(
  assignmentId: string,
  userId: string,
  mode: PackageMode = 'exam_rehearsal'
): { packageAttempt: PackageAttempt; testPackage: TestPackage } {
  const assignment = getAssignmentById(assignmentId, userId);

  // Check student enrolment in class
  if (!isStudentInClass(assignment.classId, userId)) {
    throw new Error('You are not actively enrolled in this class.');
  }

  // Check release status: if post-test and unreleased, strictly reject
  if (!assignment.isReleased || new Date(assignment.releaseAt).getTime() > Date.now()) {
    throw new Error('This post-test assignment has not been released yet.');
  }

  if (!assignment.packageId) {
    throw new Error('This assignment is not configured with a multi-skill test package.');
  }

  const testPackage = getTestPackageById(assignment.packageId);

  // Check existing attempts
  const existingAttempts = db.prepare(`
    SELECT * FROM package_attempts
    WHERE assignment_id = ? AND user_id = ?
    ORDER BY started_at DESC
  `).all(assignmentId, userId) as any[];

  // If in progress, resume it
  const activeAttempt = existingAttempts.find((att) => att.status === 'in_progress');
  if (activeAttempt) {
    return {
      packageAttempt: mapPackageAttemptRow(activeAttempt),
      testPackage,
    };
  }

  // Attempt limit check
  if (existingAttempts.length >= assignment.attemptLimit) {
    throw new Error(`Attempt limit reached (${assignment.attemptLimit} allowed).`);
  }

  // Create new package attempt
  const id = uuidv4();
  db.prepare(`
    INSERT INTO package_attempts (
      id, package_id, assignment_id, user_id, status, mode, started_at, created_at
    )
    VALUES (?, ?, ?, ?, 'in_progress', ?, datetime('now'), datetime('now'))
  `).run(id, testPackage.id, assignmentId, userId, mode);

  const created = db.prepare('SELECT * FROM package_attempts WHERE id = ?').get(id) as any;
  return {
    packageAttempt: mapPackageAttemptRow(created),
    testPackage,
  };
}

export function getPackageAttemptById(attemptId: string, userId: string, isAdminOrTeacher = false): PackageAttempt {
  const row = db.prepare(`
    SELECT pa.*, tp.title as package_title, u.full_name as user_name
    FROM package_attempts pa
    JOIN test_packages tp ON pa.package_id = tp.id
    JOIN users u ON pa.user_id = u.id
    WHERE pa.id = ?
  `).get(attemptId) as any;

  if (!row) {
    throw new Error('Package attempt not found.');
  }

  if (!isAdminOrTeacher && row.user_id !== userId) {
    throw new Error('Access forbidden to this attempt.');
  }

  return mapPackageAttemptRow(row);
}

function mapPackageAttemptRow(row: any): PackageAttempt {
  let readingAttempt: any;
  let listeningAttempt: any;
  let writingAttempt: any;
  let speakingAssessment: SpeakingAssessment | undefined;

  if (row.reading_attempt_id) {
    readingAttempt = db.prepare('SELECT * FROM reading_attempts WHERE id = ?').get(row.reading_attempt_id);
  }
  if (row.listening_attempt_id) {
    listeningAttempt = db.prepare('SELECT * FROM listening_attempts WHERE id = ?').get(row.listening_attempt_id);
  }
  if (row.writing_attempt_id) {
    writingAttempt = getWritingAttemptById(row.writing_attempt_id) || undefined;
  }
  if (row.speaking_assessment_id) {
    speakingAssessment = getSpeakingAssessmentById(row.speaking_assessment_id, row.user_id, 'teacher') || undefined;
  }

  return {
    id: row.id,
    packageId: row.package_id,
    packageTitle: row.package_title || undefined,
    assignmentId: row.assignment_id || undefined,
    userId: row.user_id,
    userName: row.user_name || undefined,
    status: row.status,
    mode: row.mode as PackageMode,
    readingAttemptId: row.reading_attempt_id || undefined,
    readingAttempt: readingAttempt ? {
      id: readingAttempt.id,
      userId: readingAttempt.user_id,
      testId: readingAttempt.test_id,
      versionId: readingAttempt.version_id,
      testTitle: readingAttempt.test_title,
      testType: readingAttempt.test_type,
      mode: readingAttempt.mode,
      status: readingAttempt.status,
      startedAt: readingAttempt.started_at,
      deadlineAt: readingAttempt.deadline_at,
      submittedAt: readingAttempt.submitted_at,
      durationSeconds: readingAttempt.duration_seconds,
      rawScore: readingAttempt.raw_score,
      totalQuestions: readingAttempt.total_questions,
      bandScore: readingAttempt.band_score,
      isFirstAttempt: Boolean(readingAttempt.is_first_attempt),
      answers: {},
    } : undefined,
    listeningAttemptId: row.listening_attempt_id || undefined,
    listeningAttempt: listeningAttempt ? {
      id: listeningAttempt.id,
      userId: listeningAttempt.user_id,
      testId: listeningAttempt.test_id,
      versionId: listeningAttempt.version_id,
      testTitle: listeningAttempt.test_title,
      mode: listeningAttempt.mode,
      status: listeningAttempt.status,
      startedAt: listeningAttempt.started_at,
      deadlineAt: listeningAttempt.deadline_at,
      submittedAt: listeningAttempt.submitted_at,
      durationSeconds: listeningAttempt.duration_seconds,
      rawScore: listeningAttempt.raw_score,
      totalQuestions: listeningAttempt.total_questions,
      bandScore: listeningAttempt.band_score,
      isFirstAttempt: Boolean(listeningAttempt.is_first_attempt),
      wasInterrupted: Boolean(listeningAttempt.was_interrupted),
      interruptionCount: listeningAttempt.interruption_count,
      replayCount: listeningAttempt.replay_count,
      interruptionEvents: [],
      answers: {},
    } : undefined,
    writingAttemptId: row.writing_attempt_id || undefined,
    writingAttempt,
    speakingAssessmentId: row.speaking_assessment_id || undefined,
    speakingAssessment,
    startedAt: row.started_at,
    completedAt: row.completed_at || undefined,
    createdAt: row.created_at,
  };
}

/**
 * Links a specific skill attempt (reading, listening, writing, or speaking) to the package attempt.
 */
export function linkSkillToPackageAttempt(
  packageAttemptId: string,
  skill: 'reading' | 'listening' | 'writing' | 'speaking',
  skillAttemptId: string
): void {
  const col =
    skill === 'reading'
      ? 'reading_attempt_id'
      : skill === 'listening'
      ? 'listening_attempt_id'
      : skill === 'writing'
      ? 'writing_attempt_id'
      : 'speaking_assessment_id';

  db.prepare(`
    UPDATE package_attempts
    SET ${col} = ?
    WHERE id = ?
  `).run(skillAttemptId, packageAttemptId);

  // Check if all available skills are now completed
  const current = db.prepare('SELECT * FROM package_attempts WHERE id = ?').get(packageAttemptId) as any;
  if (current) {
    const pkg = getTestPackageById(current.package_id);
    let allDone = true;
    if (pkg.readingTestId) {
      const r = current.reading_attempt_id ? db.prepare('SELECT status FROM reading_attempts WHERE id = ?').get(current.reading_attempt_id) as any : null;
      if (!r || (r.status !== 'submitted' && r.status !== 'expired')) allDone = false;
    }
    if (pkg.listeningTestId) {
      const l = current.listening_attempt_id ? db.prepare('SELECT status FROM listening_attempts WHERE id = ?').get(current.listening_attempt_id) as any : null;
      if (!l || (l.status !== 'submitted' && l.status !== 'expired')) allDone = false;
    }
    if (pkg.writingTask1Id || pkg.writingTask2Id) {
      const w = current.writing_attempt_id ? db.prepare('SELECT status FROM writing_attempts WHERE id = ?').get(current.writing_attempt_id) as any : null;
      if (!w || (w.status !== 'submitted' && w.status !== 'expired')) allDone = false;
    }
    if (pkg.speakingSetId) {
      const s = current.speaking_assessment_id ? db.prepare('SELECT status FROM speaking_assessments WHERE id = ?').get(current.speaking_assessment_id) as any : null;
      if (!s || s.status !== 'released') allDone = false;
    }

    if (allDone) {
      db.prepare(`
        UPDATE package_attempts
        SET status = 'completed', completed_at = datetime('now')
        WHERE id = ?
      `).run(packageAttemptId);
    }
  }
}

// -------------------------------------------------------------
// PRE-TEST / POST-TEST COMPARISON REPORT
// -------------------------------------------------------------

export function getPrePostComparison(
  classId: string,
  studentId: string,
  requestingUserId: string,
  requestingUserRole: string
): PrePostComparisonReport {
  const isTeacherOrAdmin = requestingUserRole === 'teacher' || requestingUserRole === 'admin';
  if (!isTeacherOrAdmin && requestingUserId !== studentId) {
    throw new Error('Access forbidden to comparison report.');
  }

  const classRow = db.prepare('SELECT * FROM classes WHERE id = ?').get(classId) as any;
  if (!classRow) {
    throw new Error('Class not found.');
  }

  const studentRow = db.prepare('SELECT * FROM users WHERE id = ?').get(studentId) as any;
  if (!studentRow) {
    throw new Error('Student not found.');
  }

  // Find Pre-test assignment and Post-test assignment for this class
  const preAssignment = db.prepare("SELECT * FROM assignments WHERE class_id = ? AND purpose = 'pre_test' LIMIT 1").get(classId) as any;
  const postAssignment = db.prepare("SELECT * FROM assignments WHERE class_id = ? AND purpose = 'post_test' LIMIT 1").get(classId) as any;

  const prePkg = preAssignment?.package_id ? getTestPackageById(preAssignment.package_id) : null;
  const postPkg = postAssignment?.package_id ? getTestPackageById(postAssignment.package_id) : null;

  const preSkills: Record<'reading' | 'listening' | 'writing' | 'speaking', SkillComparisonItem> = {
    reading: { skill: 'reading', status: prePkg?.readingTestId ? 'not_started' : 'not_implemented' },
    listening: { skill: 'listening', status: prePkg?.listeningTestId ? 'not_started' : 'not_implemented' },
    writing: { skill: 'writing', status: prePkg?.writingStatus === 'configured' ? 'not_started' : 'not_implemented' },
    speaking: { skill: 'speaking', status: prePkg?.speakingStatus === 'configured' ? 'not_started' : 'not_implemented' },
  };

  const postSkills: Record<'reading' | 'listening' | 'writing' | 'speaking', SkillComparisonItem> = {
    reading: { skill: 'reading', status: postPkg?.readingTestId ? 'not_started' : 'not_implemented' },
    listening: { skill: 'listening', status: postPkg?.listeningTestId ? 'not_started' : 'not_implemented' },
    writing: { skill: 'writing', status: postPkg?.writingStatus === 'configured' ? 'not_started' : 'not_implemented' },
    speaking: { skill: 'speaking', status: postPkg?.speakingStatus === 'configured' ? 'not_started' : 'not_implemented' },
  };

  // Populate pre-test skills
  if (preAssignment) {
    populateAssignmentSkillResults(preAssignment.id, studentId, preSkills);
  }

  // Populate post-test skills
  if (postAssignment) {
    populateAssignmentSkillResults(postAssignment.id, studentId, postSkills);
  }

  // Calculate Deltas for completed skills
  const deltas: {
    readingRawDelta?: number;
    readingBandDelta?: number;
    listeningRawDelta?: number;
    listeningBandDelta?: number;
    writingBandDelta?: number;
    speakingBandDelta?: number;
    overallBandDelta?: number;
  } = {};

  if (
    preSkills.reading.status === 'completed' &&
    postSkills.reading.status === 'completed' &&
    preSkills.reading.rawScore !== undefined &&
    postSkills.reading.rawScore !== undefined
  ) {
    deltas.readingRawDelta = Number((postSkills.reading.rawScore - preSkills.reading.rawScore).toFixed(1));
    if (preSkills.reading.bandScore !== undefined && postSkills.reading.bandScore !== undefined) {
      deltas.readingBandDelta = Number((postSkills.reading.bandScore - preSkills.reading.bandScore).toFixed(1));
    }
  }

  if (
    preSkills.listening.status === 'completed' &&
    postSkills.listening.status === 'completed' &&
    preSkills.listening.rawScore !== undefined &&
    postSkills.listening.rawScore !== undefined
  ) {
    deltas.listeningRawDelta = Number((postSkills.listening.rawScore - preSkills.listening.rawScore).toFixed(1));
    if (preSkills.listening.bandScore !== undefined && postSkills.listening.bandScore !== undefined) {
      deltas.listeningBandDelta = Number((postSkills.listening.bandScore - preSkills.listening.bandScore).toFixed(1));
    }
  }

  if (
    preSkills.writing.status === 'completed' &&
    postSkills.writing.status === 'completed' &&
    preSkills.writing.bandScore !== undefined &&
    postSkills.writing.bandScore !== undefined
  ) {
    deltas.writingBandDelta = Number((postSkills.writing.bandScore - preSkills.writing.bandScore).toFixed(1));
  }

  if (
    preSkills.speaking.status === 'completed' &&
    postSkills.speaking.status === 'completed' &&
    preSkills.speaking.bandScore !== undefined &&
    postSkills.speaking.bandScore !== undefined
  ) {
    deltas.speakingBandDelta = Number((postSkills.speaking.bandScore - preSkills.speaking.bandScore).toFixed(1));
  }

  // 4-Skill Overall Band calculations
  const overallBandPre = calculateIeltsFourSkillOverallBand(
    preSkills.listening.bandScore,
    preSkills.reading.bandScore,
    preSkills.writing.bandScore,
    preSkills.speaking.bandScore
  );

  const overallBandPost = calculateIeltsFourSkillOverallBand(
    postSkills.listening.bandScore,
    postSkills.reading.bandScore,
    postSkills.writing.bandScore,
    postSkills.speaking.bandScore
  );

  if (overallBandPre !== undefined && overallBandPost !== undefined) {
    deltas.overallBandDelta = Number((overallBandPost - overallBandPre).toFixed(1));
  }

  const allFourComplete = overallBandPre !== undefined && overallBandPost !== undefined;
  const pedagogicalNote = allFourComplete
    ? 'Note: Overall Band score represents the official IELTS arithmetic mean across Listening, Reading, Writing, and Speaking, rounded according to official IELTS half-band rounding rules. Score differences reflect performance on these specific test versions under their respective test conditions. Score differences should not be uncritically attributed solely to learning progress without accounting for test variation and test conditions.'
    : 'Note: Score differences reflect performance on these specific test versions under their respective test conditions. Score differences should not be uncritically attributed solely to learning progress without accounting for test variation and test conditions. No overall 4-skill band is calculated because Writing and Speaking remain to be implemented in full or completed.';

  return {
    studentId,
    studentName: studentRow.full_name,
    studentEmail: studentRow.email,
    classId,
    classTitle: classRow.title,
    testType: classRow.test_type as ClassTestType,
    preTest: {
      packageId: preAssignment?.package_id,
      packageTitle: preAssignment?.title || 'Pre-Test',
      skills: preSkills,
    },
    postTest: {
      packageId: postAssignment?.package_id,
      packageTitle: postAssignment?.title || 'Post-Test',
      isReleased: Boolean(postAssignment?.is_released),
      skills: postSkills,
    },
    deltas,
    overallBandPre,
    overallBandPost,
    pedagogicalNote,
  };
}

function populateAssignmentSkillResults(
  assignmentId: string,
  studentId: string,
  skills: Record<'reading' | 'listening' | 'writing' | 'speaking', SkillComparisonItem>
): void {
  // Check reading attempts for this assignment
  const readingAtt = db.prepare(`
    SELECT ra.*, rtv.version_number
    FROM reading_attempts ra
    LEFT JOIN reading_test_versions rtv ON ra.version_id = rtv.id
    WHERE ra.assignment_id = ? AND ra.user_id = ?
    ORDER BY ra.started_at DESC LIMIT 1
  `).get(assignmentId, studentId) as any;

  if (readingAtt) {
    skills.reading = {
      skill: 'reading',
      status: readingAtt.status === 'submitted' || readingAtt.status === 'expired' ? 'completed' : 'in_progress',
      testTitle: readingAtt.test_title,
      versionNumber: readingAtt.version_number,
      rawScore: readingAtt.raw_score,
      totalQuestions: readingAtt.total_questions,
      bandScore: readingAtt.band_score,
      completedAt: formatMakassarDateTime(readingAtt.submitted_at || readingAtt.started_at),
      mode: readingAtt.mode as TestMode,
      isFirstAttempt: Boolean(readingAtt.is_first_attempt),
    };
  }

  // Check listening attempts for this assignment
  const listeningAtt = db.prepare(`
    SELECT la.*, ltv.version_number
    FROM listening_attempts la
    LEFT JOIN listening_test_versions ltv ON la.version_id = ltv.id
    WHERE la.assignment_id = ? AND la.user_id = ?
    ORDER BY la.started_at DESC LIMIT 1
  `).get(assignmentId, studentId) as any;

  if (listeningAtt) {
    skills.listening = {
      skill: 'listening',
      status: listeningAtt.status === 'submitted' || listeningAtt.status === 'expired' ? 'completed' : 'in_progress',
      testTitle: listeningAtt.test_title,
      versionNumber: listeningAtt.version_number,
      rawScore: listeningAtt.raw_score,
      totalQuestions: listeningAtt.total_questions,
      bandScore: listeningAtt.band_score,
      completedAt: formatMakassarDateTime(listeningAtt.submitted_at || listeningAtt.started_at),
      mode: listeningAtt.mode as TestMode,
      wasInterrupted: Boolean(listeningAtt.was_interrupted),
      isFirstAttempt: Boolean(listeningAtt.is_first_attempt),
    };
  }

  // Check writing attempts for this assignment or linked package attempt
  const writingAtt = db.prepare(`
    SELECT wa.*, wt1.title as task1_title, wt2.title as task2_title
    FROM writing_attempts wa
    LEFT JOIN writing_tasks wt1 ON wa.task1_id = wt1.id
    LEFT JOIN writing_tasks wt2 ON wa.task2_id = wt2.id
    WHERE (wa.assignment_id = ? OR wa.package_attempt_id IN (
      SELECT id FROM package_attempts WHERE assignment_id = ?
    ))
    AND wa.user_id = ?
    ORDER BY wa.started_at DESC LIMIT 1
  `).get(assignmentId, assignmentId, studentId) as any;

  if (writingAtt) {
    const isCompleted = writingAtt.status === 'submitted' || writingAtt.status === 'expired';
    const titleParts = [writingAtt.task1_title, writingAtt.task2_title].filter(Boolean);
    skills.writing = {
      skill: 'writing',
      status: isCompleted ? 'completed' : 'in_progress',
      testTitle: titleParts.length > 0 ? titleParts.join(' & ') : 'Writing Assessment',
      bandScore: writingAtt.overall_writing_band !== null && writingAtt.overall_writing_band !== undefined ? writingAtt.overall_writing_band : undefined,
      writingTask1Band: writingAtt.task1_band !== null && writingAtt.task1_band !== undefined ? writingAtt.task1_band : undefined,
      writingTask2Band: writingAtt.task2_band !== null && writingAtt.task2_band !== undefined ? writingAtt.task2_band : undefined,
      writingOverallBand: writingAtt.overall_writing_band !== null && writingAtt.overall_writing_band !== undefined ? writingAtt.overall_writing_band : undefined,
      assessor: 'AI Assessment',
      completedAt: formatMakassarDateTime(writingAtt.submitted_at || writingAtt.started_at),
      mode: writingAtt.mode as TestMode,
    };
  }

  // Check speaking assessments for this assignment or linked package attempt
  const speakingAss = db.prepare(`
    SELECT sa.*, ss.title as set_title, ssv.version_number
    FROM speaking_assessments sa
    LEFT JOIN speaking_sets ss ON sa.set_id = ss.id
    LEFT JOIN speaking_set_versions ssv ON sa.set_version_id = ssv.id
    WHERE (sa.assignment_id = ? OR sa.package_attempt_id IN (
      SELECT id FROM package_attempts WHERE assignment_id = ?
    ))
    AND sa.student_id = ?
    AND sa.status = 'released'
    ORDER BY sa.session_date DESC LIMIT 1
  `).get(assignmentId, assignmentId, studentId) as any;

  if (speakingAss) {
    const corrCount = db.prepare('SELECT count(*) as count FROM speaking_score_corrections WHERE assessment_id = ?').get(speakingAss.id) as any;
    skills.speaking = {
      skill: 'speaking',
      status: 'completed',
      testTitle: speakingAss.set_title || speakingAss.custom_topic || 'Teacher Speaking Assessment',
      versionNumber: speakingAss.version_number || undefined,
      bandScore: speakingAss.overall_band !== null ? speakingAss.overall_band : undefined,
      criteria: {
        fluencyCoherence: speakingAss.criterion_fluency_coherence ?? undefined,
        lexicalResource: speakingAss.criterion_lexical_resource ?? undefined,
        grammaticalRange: speakingAss.criterion_grammatical_range ?? undefined,
        pronunciation: speakingAss.criterion_pronunciation ?? undefined,
      },
      assessor: speakingAss.assessor_type === 'ai' ? 'AI Assessment' : 'Teacher assessment',
      sessionType: speakingAss.session_type,
      correctionCount: corrCount?.count || 0,
      completedAt: formatMakassarDateTime(speakingAss.released_at || speakingAss.session_date),
    };
  } else {
    // If not released but there's a draft
    const draftSpeaking = db.prepare(`
      SELECT 1 FROM speaking_assessments sa
      WHERE (sa.assignment_id = ? OR sa.package_attempt_id IN (
        SELECT id FROM package_attempts WHERE assignment_id = ?
      ))
      AND sa.student_id = ?
      LIMIT 1
    `).get(assignmentId, assignmentId, studentId);
    if (draftSpeaking) {
      skills.speaking = {
        skill: 'speaking',
        status: 'in_progress',
      };
    }
  }
}

// -------------------------------------------------------------
// TEACHER CLASS ANALYTICS & OVERVIEW
// -------------------------------------------------------------

export function getClassOverview(classId: string, teacherId: string, isAdmin = false) {
  const classRow = db.prepare('SELECT * FROM classes WHERE id = ?').get(classId) as any;
  if (!classRow) {
    throw new Error('Class not found.');
  }

  if (!isAdmin && classRow.teacher_id !== teacherId) {
    throw new Error('You do not have permission to view overview for this class.');
  }

  // Get enrolled active students
  const students = db.prepare(`
    SELECT u.id, u.full_name, u.email, ce.enrolled_at
    FROM class_enrolments ce
    JOIN users u ON ce.student_id = u.id
    WHERE ce.class_id = ? AND ce.status = 'active'
    ORDER BY u.full_name ASC
  `).all(classId) as any[];

  // Get assignments
  const assignments = listClassAssignments(classId, teacherId, 'teacher');

  const preTestAssign = assignments.find((a) => a.purpose === 'pre_test');
  const postTestAssign = assignments.find((a) => a.purpose === 'post_test');

  // Compute assignment breakdown stats
  const assignmentStats = assignments.map((a) => {
    let submitted = 0;
    let inProgress = 0;
    let notStarted = 0;
    let overdue = 0;
    let totalScore = 0;
    let totalBands = 0;
    let scoredCount = 0;

    for (const student of students) {
      const copy = { ...a };
      populateStudentAssignmentStatus(copy, student.id);
      if (copy.studentStatus === 'submitted') {
        submitted++;
        if (copy.lastAttemptScore !== undefined) {
          totalScore += copy.lastAttemptScore;
          scoredCount++;
        }
        if (copy.lastAttemptBand !== undefined) {
          totalBands += copy.lastAttemptBand;
        }
      } else if (copy.studentStatus === 'in_progress') {
        inProgress++;
      } else if (copy.studentStatus === 'overdue') {
        overdue++;
      } else {
        notStarted++;
      }
    }

    return {
      id: a.id,
      title: a.title,
      purpose: a.purpose,
      mode: a.mode,
      releaseAt: a.releaseAt,
      deadlineAt: a.deadlineAt,
      isReleased: a.isReleased,
      stats: {
        submitted,
        inProgress,
        notStarted,
        overdue,
        averageRawScore: scoredCount > 0 ? Number((totalScore / scoredCount).toFixed(1)) : undefined,
        averageBandScore: scoredCount > 0 && totalBands > 0 ? Number((totalBands / scoredCount).toFixed(1)) : undefined,
      },
    };
  });

  // Compute student progress rows
  let preTestCompletedCount = 0;
  let postTestCompletedCount = 0;

  const studentsProgress = students.map((s) => {
    let preStatus: 'completed' | 'in_progress' | 'not_started' = 'not_started';
    let postStatus: 'completed' | 'in_progress' | 'not_started' | 'awaiting_release' = 'not_started';
    let completedCount = 0;
    let overdueCount = 0;

    if (preTestAssign) {
      const p = { ...preTestAssign };
      populateStudentAssignmentStatus(p, s.id);
      if (p.studentStatus === 'submitted') {
        preStatus = 'completed';
        preTestCompletedCount++;
      } else if (p.studentStatus === 'in_progress') {
        preStatus = 'in_progress';
      }
    }

    if (postTestAssign) {
      if (!postTestAssign.isReleased || new Date(postTestAssign.releaseAt).getTime() > Date.now()) {
        postStatus = 'awaiting_release';
      } else {
        const p = { ...postTestAssign };
        populateStudentAssignmentStatus(p, s.id);
        if (p.studentStatus === 'submitted') {
          postStatus = 'completed';
          postTestCompletedCount++;
        } else if (p.studentStatus === 'in_progress') {
          postStatus = 'in_progress';
        }
      }
    }

    for (const a of assignments) {
      const copy = { ...a };
      populateStudentAssignmentStatus(copy, s.id);
      if (copy.studentStatus === 'submitted') completedCount++;
      if (copy.studentStatus === 'overdue') overdueCount++;
    }

    return {
      studentId: s.id,
      studentName: s.full_name,
      studentEmail: s.email,
      enrolledAt: formatMakassarDateTime(s.enrolled_at),
      preTestStatus: preStatus,
      postTestStatus: postStatus,
      completedAssignmentsCount: completedCount,
      overdueAssignmentsCount: overdueCount,
    };
  });

  // Calculate question type difficulty from answers submitted in this class
  const classAssignmentIds = assignments.map((a) => a.id);
  const typeMap: Record<string, { total: number; correct: number }> = {};

  if (classAssignmentIds.length > 0) {
    const placeholders = classAssignmentIds.map(() => '?').join(',');
    // Reading answers in this class
    const readingAnsRows = db.prepare(`
      SELECT ans.is_correct, ans.question_number, rtv.question_groups_json
      FROM reading_answers ans
      JOIN reading_attempts att ON ans.attempt_id = att.id
      JOIN reading_test_versions rtv ON att.version_id = rtv.id
      WHERE att.assignment_id IN (${placeholders})
    `).all(...classAssignmentIds) as any[];

    for (const row of readingAnsRows) {
      try {
        const groups = JSON.parse(row.question_groups_json || '[]');
        const g = groups.find((grp: any) =>
          grp.questions?.some((q: any) => q.questionNumber === row.question_number)
        );
        const qType = g ? g.questionType : 'reading_other';
        if (!typeMap[qType]) typeMap[qType] = { total: 0, correct: 0 };
        typeMap[qType].total++;
        if (row.is_correct) typeMap[qType].correct++;
      } catch (e) {
        // ignore parse error
      }
    }

    // Listening answers in this class
    const listeningAnsRows = db.prepare(`
      SELECT ans.is_correct, ans.question_number, ltv.question_groups_json
      FROM listening_answers ans
      JOIN listening_attempts att ON ans.attempt_id = att.id
      JOIN listening_test_versions ltv ON att.version_id = ltv.id
      WHERE att.assignment_id IN (${placeholders})
    `).all(...classAssignmentIds) as any[];

    for (const row of listeningAnsRows) {
      try {
        const groups = JSON.parse(row.question_groups_json || '[]');
        const g = groups.find((grp: any) =>
          grp.questions?.some((q: any) => q.questionNumber === row.question_number)
        );
        const qType = g ? g.questionType : 'listening_other';
        if (!typeMap[qType]) typeMap[qType] = { total: 0, correct: 0 };
        typeMap[qType].total++;
        if (row.is_correct) typeMap[qType].correct++;
      } catch (e) {
        // ignore parse error
      }
    }
  }

  const difficultQuestionTypes = Object.entries(typeMap)
    .map(([qType, stats]) => ({
      questionType: qType.replace(/_/g, ' '),
      totalAnswered: stats.total,
      correctCount: stats.correct,
      accuracyPct: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }))
    .sort((a, b) => a.accuracyPct - b.accuracyPct);

  return {
    classId,
    classTitle: classRow.title,
    testType: classRow.test_type as ClassTestType,
    totalStudents: students.length,
    preTestCompletedCount,
    postTestCompletedCount,
    assignments: assignmentStats,
    studentsProgress,
    difficultQuestionTypes,
    missingSkillAssessments: {
      writing: 'not_implemented',
      speaking: 'not_implemented',
    },
  };
}
