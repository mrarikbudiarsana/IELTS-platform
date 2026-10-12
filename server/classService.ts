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
export async function createClass(
  teacherId: string,
  data: { title: string; description?: string; testType: ClassTestType }
): Promise<ClassItem> {
  if (!data.title || !data.title.trim()) {
    throw new Error('Class title is required.');
  }

  const id = uuidv4();
  const invitationCode = generateInviteCode();

  (await db.prepare(`
    INSERT INTO classes (id, title, description, teacher_id, test_type, invitation_code, is_archived, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))
  `).run(id, data.title.trim(), data.description ? data.description.trim() : null, teacherId, data.testType, invitationCode));

  return (await getClassById(id));
}

/**
 * Updates an existing class.
 */
export async function updateClass(
  classId: string,
  teacherId: string,
  data: { title?: string; description?: string; testType?: ClassTestType; isArchived?: boolean },
  isAdmin = false
): Promise<ClassItem> {
  const classRow = (await db.prepare('SELECT * FROM classes WHERE id = ?').get(classId)) as any;
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

  (await db.prepare(`
    UPDATE classes
    SET title = ?, description = ?, test_type = ?, is_archived = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(title, description, testType, isArchived, classId));

  return (await getClassById(classId));
}

/**
 * Gets class by ID with teacher details and student count.
 */
export async function getClassById(classId: string): Promise<ClassItem> {
  const row = (await db.prepare(`
    SELECT c.*, u.full_name as teacher_name,
      (SELECT COUNT(*) FROM class_enrolments ce WHERE ce.class_id = c.id AND ce.status = 'active') as student_count
    FROM classes c
    JOIN users u ON c.teacher_id = u.id
    WHERE c.id = ?
  `).get(classId)) as any;

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
export async function listTeacherClasses(teacherId: string, isAdmin = false): Promise<ClassItem[]> {
  let rows: any[];
  if (isAdmin) {
    rows = (await db.prepare(`
      SELECT c.*, u.full_name as teacher_name,
        (SELECT COUNT(*) FROM class_enrolments ce WHERE ce.class_id = c.id AND ce.status = 'active') as student_count
      FROM classes c
      JOIN users u ON c.teacher_id = u.id
      ORDER BY c.created_at DESC
    `).all());
  } else {
    rows = (await db.prepare(`
      SELECT c.*, u.full_name as teacher_name,
        (SELECT COUNT(*) FROM class_enrolments ce WHERE ce.class_id = c.id AND ce.status = 'active') as student_count
      FROM classes c
      JOIN users u ON c.teacher_id = u.id
      WHERE c.teacher_id = ?
      ORDER BY c.created_at DESC
    `).all(teacherId));
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
export async function listStudentClasses(studentId: string): Promise<ClassItem[]> {
  const rows = (await db.prepare(`
    SELECT c.*, u.full_name as teacher_name,
      (SELECT COUNT(*) FROM class_enrolments ce WHERE ce.class_id = c.id AND ce.status = 'active') as student_count
    FROM classes c
    JOIN users u ON c.teacher_id = u.id
    JOIN class_enrolments ce ON ce.class_id = c.id
    WHERE ce.student_id = ? AND ce.status = 'active' AND c.is_archived = 0
    ORDER BY ce.enrolled_at DESC
  `).all(studentId)) as any[];

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
export async function enrolStudentByCode(studentId: string, invitationCode: string): Promise<ClassItem> {
  const classRow = (await db.prepare('SELECT * FROM classes WHERE invitation_code = ? AND is_archived = 0').get(invitationCode.trim().toUpperCase())) as any;
  if (!classRow) {
    throw new Error('Invalid or inactive class invitation code.');
  }

  (await enrolStudentInClass(classRow.id, studentId));
  return (await getClassById(classRow.id));
}

/**
 * Enrols a student by email (invoked by teacher).
 */
export async function enrolStudentByEmail(teacherId: string, classId: string, studentEmail: string, isAdmin = false): Promise<ClassEnrolment> {
  const classRow = (await db.prepare('SELECT * FROM classes WHERE id = ?').get(classId)) as any;
  if (!classRow) {
    throw new Error('Class not found.');
  }

  if (!isAdmin && classRow.teacher_id !== teacherId) {
    throw new Error('You do not have permission to enrol students in this class.');
  }

  const studentUser = (await db.prepare('SELECT * FROM users WHERE email = ?').get(studentEmail.trim().toLowerCase())) as any;
  if (!studentUser) {
    throw new Error(`No registered account found with email "${studentEmail}". Please ask learner to register first.`);
  }

  if (studentUser.role !== 'student') {
    throw new Error('Only registered student accounts can be enrolled in classes.');
  }

  return (await enrolStudentInClass(classId, studentUser.id));
}

/**
 * Internal helper to enrol or reactivate student enrolment in class.
 */
export async function enrolStudentInClass(classId: string, studentId: string): Promise<ClassEnrolment> {
  const existing = (await db.prepare('SELECT * FROM class_enrolments WHERE class_id = ? AND student_id = ?').get(classId, studentId)) as any;

  if (existing) {
    if (existing.status === 'active') {
      // Already actively enrolled
      return (await getClassEnrolment(existing.id));
    }
    // Reactivate previously removed enrolment
    (await db.prepare(`
      UPDATE class_enrolments
      SET status = 'active', removed_at = NULL, enrolled_at = datetime('now')
      WHERE id = ?
    `).run(existing.id));
    return (await getClassEnrolment(existing.id));
  }

  const id = uuidv4();
  (await db.prepare(`
    INSERT INTO class_enrolments (id, class_id, student_id, status, enrolled_at)
    VALUES (?, ?, ?, 'active', datetime('now'))
  `).run(id, classId, studentId));

  return (await getClassEnrolment(id));
}

/**
 * Removes a student from a class without deleting their account or historical work.
 */
export async function removeStudentFromClass(teacherId: string, classId: string, studentId: string, isAdmin = false): Promise<void> {
  const classRow = (await db.prepare('SELECT * FROM classes WHERE id = ?').get(classId)) as any;
  if (!classRow) {
    throw new Error('Class not found.');
  }

  if (!isAdmin && classRow.teacher_id !== teacherId) {
    throw new Error('You do not have permission to manage this class.');
  }

  (await db.prepare(`
    UPDATE class_enrolments
    SET status = 'removed', removed_at = datetime('now')
    WHERE class_id = ? AND student_id = ?
  `).run(classId, studentId));
}

/**
 * Gets a single enrolment record.
 */
export async function getClassEnrolment(enrolmentId: string): Promise<ClassEnrolment> {
  const row = (await db.prepare(`
    SELECT ce.*, u.full_name as student_name, u.email as student_email
    FROM class_enrolments ce
    JOIN users u ON ce.student_id = u.id
    WHERE ce.id = ?
  `).get(enrolmentId)) as any;

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
export async function listClassEnrolments(teacherId: string, classId: string, isAdmin = false): Promise<ClassEnrolment[]> {
  const classRow = (await db.prepare('SELECT * FROM classes WHERE id = ?').get(classId)) as any;
  if (!classRow) {
    throw new Error('Class not found.');
  }

  if (!isAdmin && classRow.teacher_id !== teacherId) {
    throw new Error('You do not have permission to view enrolments for this class.');
  }

  const rows = (await db.prepare(`
    SELECT ce.*, u.full_name as student_name, u.email as student_email
    FROM class_enrolments ce
    JOIN users u ON ce.student_id = u.id
    WHERE ce.class_id = ?
    ORDER BY ce.status ASC, ce.enrolled_at DESC
  `).all(classId)) as any[];

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
export async function isStudentInClass(classId: string, studentId: string): Promise<boolean> {
  const row = (await db.prepare(`
    SELECT 1 FROM class_enrolments
    WHERE class_id = ? AND student_id = ? AND status = 'active'
  `).get(classId, studentId));
  return Boolean(row);
}
