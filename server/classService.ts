import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import {
  ClassItem,
  ClassEnrolment,
  ClassTestType,
} from '../shared/types';

// Helper to generate a friendly invitation code
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CLASS-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Creates a new class taught by an authorized teacher.
 */
export function createClass(
  teacherId: string,
  data: { title: string; description?: string; testType: ClassTestType }
): ClassItem {
  if (!data.title || !data.title.trim()) {
    throw new Error('Class title is required.');
  }

  const id = uuidv4();
  const invitationCode = generateInviteCode();

  db.prepare(`
    INSERT INTO classes (id, title, description, teacher_id, test_type, invitation_code, is_archived, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))
  `).run(id, data.title.trim(), data.description ? data.description.trim() : null, teacherId, data.testType, invitationCode);

  return getClassById(id);
}

/**
 * Updates an existing class.
 */
export function updateClass(
  classId: string,
  teacherId: string,
  data: { title?: string; description?: string; testType?: ClassTestType; isArchived?: boolean },
  isAdmin = false
): ClassItem {
  const classRow = db.prepare('SELECT * FROM classes WHERE id = ?').get(classId) as any;
  if (!classRow) {
    throw new Error('Class not found.');
  }

  if (!isAdmin && classRow.teacher_id !== teacherId) {
    throw new Error('You do not have permission to edit this class.');
  }

  const title = data.title !== undefined ? data.title.trim() : classRow.title;
  const description = data.description !== undefined ? data.description?.trim() : classRow.description;
  const testType = data.testType !== undefined ? data.testType : classRow.test_type;
  const isArchived = data.isArchived !== undefined ? (data.isArchived ? 1 : 0) : classRow.is_archived;

  db.prepare(`
    UPDATE classes
    SET title = ?, description = ?, test_type = ?, is_archived = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(title, description, testType, isArchived, classId);

  return getClassById(classId);
}

/**
 * Gets class by ID with teacher details and student count.
 */
export function getClassById(classId: string): ClassItem {
  const row = db.prepare(`
    SELECT c.*, u.full_name as teacher_name,
      (SELECT COUNT(*) FROM class_enrolments ce WHERE ce.class_id = c.id AND ce.status = 'active') as student_count
    FROM classes c
    JOIN users u ON c.teacher_id = u.id
    WHERE c.id = ?
  `).get(classId) as any;

  if (!row) {
    throw new Error('Class not found.');
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    teacherId: row.teacher_id,
    teacherName: row.teacher_name,
    testType: row.test_type as ClassTestType,
    invitationCode: row.invitation_code,
    isArchived: Boolean(row.is_archived),
    studentCount: row.student_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Lists all classes taught by a teacher.
 */
export function listTeacherClasses(teacherId: string, isAdmin = false): ClassItem[] {
  let rows: any[];
  if (isAdmin) {
    rows = db.prepare(`
      SELECT c.*, u.full_name as teacher_name,
        (SELECT COUNT(*) FROM class_enrolments ce WHERE ce.class_id = c.id AND ce.status = 'active') as student_count
      FROM classes c
      JOIN users u ON c.teacher_id = u.id
      ORDER BY c.created_at DESC
    `).all();
  } else {
    rows = db.prepare(`
      SELECT c.*, u.full_name as teacher_name,
        (SELECT COUNT(*) FROM class_enrolments ce WHERE ce.class_id = c.id AND ce.status = 'active') as student_count
      FROM classes c
      JOIN users u ON c.teacher_id = u.id
      WHERE c.teacher_id = ?
      ORDER BY c.created_at DESC
    `).all(teacherId);
  }

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    teacherId: row.teacher_id,
    teacherName: row.teacher_name,
    testType: row.test_type as ClassTestType,
    invitationCode: row.invitation_code,
    isArchived: Boolean(row.is_archived),
    studentCount: row.student_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

/**
 * Lists all classes that a student is actively enrolled in.
 */
export function listStudentClasses(studentId: string): ClassItem[] {
  const rows = db.prepare(`
    SELECT c.*, u.full_name as teacher_name,
      (SELECT COUNT(*) FROM class_enrolments ce WHERE ce.class_id = c.id AND ce.status = 'active') as student_count
    FROM classes c
    JOIN users u ON c.teacher_id = u.id
    JOIN class_enrolments ce ON ce.class_id = c.id
    WHERE ce.student_id = ? AND ce.status = 'active' AND c.is_archived = 0
    ORDER BY ce.enrolled_at DESC
  `).all(studentId) as any[];

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    teacherId: row.teacher_id,
    teacherName: row.teacher_name,
    testType: row.test_type as ClassTestType,
    invitationCode: row.invitation_code,
    isArchived: Boolean(row.is_archived),
    studentCount: row.student_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

/**
 * Enrols a student via class invitation code.
 */
export function enrolStudentByCode(studentId: string, invitationCode: string): ClassItem {
  const classRow = db.prepare('SELECT * FROM classes WHERE invitation_code = ? AND is_archived = 0').get(invitationCode.trim().toUpperCase()) as any;
  if (!classRow) {
    throw new Error('Invalid or inactive class invitation code.');
  }

  enrolStudentInClass(classRow.id, studentId);
  return getClassById(classRow.id);
}

/**
 * Enrols a student by email (invoked by teacher).
 */
export function enrolStudentByEmail(teacherId: string, classId: string, studentEmail: string, isAdmin = false): ClassEnrolment {
  const classRow = db.prepare('SELECT * FROM classes WHERE id = ?').get(classId) as any;
  if (!classRow) {
    throw new Error('Class not found.');
  }

  if (!isAdmin && classRow.teacher_id !== teacherId) {
    throw new Error('You do not have permission to enrol students in this class.');
  }

  const studentUser = db.prepare('SELECT * FROM users WHERE email = ?').get(studentEmail.trim().toLowerCase()) as any;
  if (!studentUser) {
    throw new Error(`No registered account found with email "${studentEmail}". Please ask learner to register first.`);
  }

  if (studentUser.role !== 'student') {
    throw new Error('Only registered student accounts can be enrolled in classes.');
  }

  return enrolStudentInClass(classId, studentUser.id);
}

/**
 * Internal helper to enrol or reactivate student enrolment in class.
 */
export function enrolStudentInClass(classId: string, studentId: string): ClassEnrolment {
  const existing = db.prepare('SELECT * FROM class_enrolments WHERE class_id = ? AND student_id = ?').get(classId, studentId) as any;

  if (existing) {
    if (existing.status === 'active') {
      // Already actively enrolled
      return getClassEnrolment(existing.id);
    }
    // Reactivate previously removed enrolment
    db.prepare(`
      UPDATE class_enrolments
      SET status = 'active', removed_at = NULL, enrolled_at = datetime('now')
      WHERE id = ?
    `).run(existing.id);
    return getClassEnrolment(existing.id);
  }

  const id = uuidv4();
  db.prepare(`
    INSERT INTO class_enrolments (id, class_id, student_id, status, enrolled_at)
    VALUES (?, ?, ?, 'active', datetime('now'))
  `).run(id, classId, studentId);

  return getClassEnrolment(id);
}

/**
 * Removes a student from a class without deleting their account or historical work.
 */
export function removeStudentFromClass(teacherId: string, classId: string, studentId: string, isAdmin = false): void {
  const classRow = db.prepare('SELECT * FROM classes WHERE id = ?').get(classId) as any;
  if (!classRow) {
    throw new Error('Class not found.');
  }

  if (!isAdmin && classRow.teacher_id !== teacherId) {
    throw new Error('You do not have permission to manage this class.');
  }

  db.prepare(`
    UPDATE class_enrolments
    SET status = 'removed', removed_at = datetime('now')
    WHERE class_id = ? AND student_id = ?
  `).run(classId, studentId);
}

/**
 * Gets a single enrolment record.
 */
export function getClassEnrolment(enrolmentId: string): ClassEnrolment {
  const row = db.prepare(`
    SELECT ce.*, u.full_name as student_name, u.email as student_email
    FROM class_enrolments ce
    JOIN users u ON ce.student_id = u.id
    WHERE ce.id = ?
  `).get(enrolmentId) as any;

  if (!row) {
    throw new Error('Enrolment not found.');
  }

  return {
    id: row.id,
    classId: row.class_id,
    studentId: row.student_id,
    studentName: row.student_name,
    studentEmail: row.student_email,
    status: row.status,
    enrolledAt: row.enrolled_at,
    removedAt: row.removed_at || undefined,
  };
}

/**
 * Lists all enrolments in a class for teacher view.
 */
export function listClassEnrolments(teacherId: string, classId: string, isAdmin = false): ClassEnrolment[] {
  const classRow = db.prepare('SELECT * FROM classes WHERE id = ?').get(classId) as any;
  if (!classRow) {
    throw new Error('Class not found.');
  }

  if (!isAdmin && classRow.teacher_id !== teacherId) {
    throw new Error('You do not have permission to view enrolments for this class.');
  }

  const rows = db.prepare(`
    SELECT ce.*, u.full_name as student_name, u.email as student_email
    FROM class_enrolments ce
    JOIN users u ON ce.student_id = u.id
    WHERE ce.class_id = ?
    ORDER BY ce.status ASC, ce.enrolled_at DESC
  `).all(classId) as any[];

  return rows.map((r) => ({
    id: r.id,
    classId: r.class_id,
    studentId: r.student_id,
    studentName: r.student_name,
    studentEmail: r.student_email,
    status: r.status,
    enrolledAt: r.enrolled_at,
    removedAt: r.removed_at || undefined,
  }));
}

/**
 * Checks if a learner is an active member of a class.
 */
export function isStudentInClass(classId: string, studentId: string): boolean {
  const row = db.prepare(`
    SELECT 1 FROM class_enrolments
    WHERE class_id = ? AND student_id = ? AND status = 'active'
  `).get(classId, studentId);
  return Boolean(row);
}
