import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { hashPassword } from './auth';
import { createClass, enrolStudentInClass } from './classService';
import { createTestPackage, createAssignment } from './assignmentService';

export function seedClassDatabase() {
  const existingClasses = db.prepare('SELECT COUNT(*) as count FROM classes').get() as any;
  if (existingClasses.count > 0) {
    console.log('Class data already seeded, skipping.');
    return;
  }

  console.log('Seeding Milestone 3 classes, test packages, and assignments...');

  // 1. Ensure teacher and student demo users exist
  let teacherUser = db.prepare("SELECT * FROM users WHERE role IN ('teacher', 'admin') LIMIT 1").get() as any;
  if (!teacherUser) {
    const teacherId = uuidv4();
    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, created_at)
      VALUES (?, 'teacher1@ieltsmastery.com', ?, 'Arik B (Lead Instructor)', 'teacher', 'academic', datetime('now'))
    `).run(teacherId, hashPassword('Pass1234!'));
    teacherUser = { id: teacherId, full_name: 'Arik B (Lead Instructor)', email: 'teacher1@ieltsmastery.com' };
  }

  let studentUser = db.prepare("SELECT * FROM users WHERE role = 'student' LIMIT 1").get() as any;
  if (!studentUser) {
    const studentId = uuidv4();
    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, target_band, created_at)
      VALUES (?, 'student1@ieltsmastery.com', ?, 'Sam Learner', 'student', 'academic', 7.5, datetime('now'))
    `).run(studentId, hashPassword('Pass1234!'));
    studentUser = { id: studentId, full_name: 'Sam Learner', email: 'student1@ieltsmastery.com' };
  }

  // 2. Fetch existing pre-test Reading and Listening tests
  const preReadingTest = db.prepare("SELECT * FROM reading_tests WHERE test_type = 'academic' ORDER BY created_at ASC LIMIT 1").get() as any;
  const preListeningTest = db.prepare("SELECT * FROM listening_tests ORDER BY created_at ASC LIMIT 1").get() as any;

  if (!preReadingTest || !preListeningTest) {
    console.warn('Pre-test materials not found in database; cannot seed test packages.');
    return;
  }

  // 4. Create Pre-Test Package and Post-Test Package using official Cambridge 21 tests
  const preTestPackage = createTestPackage(teacherUser.id, {
    title: 'Diagnostic Pre-Test Package (Academic Cohort)',
    packageType: 'pre_test',
    testType: 'academic',
    readingTestId: preReadingTest.id,
    listeningTestId: preListeningTest.id,
  });

  const postTestPackage = createTestPackage(teacherUser.id, {
    title: 'Protected Post-Test Package (Academic Cohort)',
    packageType: 'post_test',
    testType: 'academic',
    readingTestId: preReadingTest.id,
    listeningTestId: preListeningTest.id,
  });

  // 5. Create Demonstration Class
  const demoClass = createClass(teacherUser.id, {
    title: 'October 2026 Academic IELTS Intensive Class',
    description: '4-week cohort class covering complete pre-test diagnostics, structured reading and listening practice, and protected post-test progress assessment.',
    testType: 'academic',
  });

  // 6. Enrol demonstration students in the class
  enrolStudentInClass(demoClass.id, studentUser.id);

  // 7. Create Assignments for this class:
  // Assignment A: Pre-Test (released, due in 7 days)
  const preAssign = createAssignment(teacherUser.id, demoClass.id, {
    title: 'Diagnostic Pre-Test (Full Reading & Listening)',
    instructions: 'Complete this initial diagnostic mock under exam conditions before Week 1 lessons. This establishes your baseline score.',
    purpose: 'pre_test',
    packageId: preTestPackage.id,
    mode: 'mock',
    releaseAt: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
    deadlineAt: new Date(Date.now() + 7 * 86400 * 1000).toISOString(), // 7 days from now
    attemptLimit: 1,
    isReleased: true,
  });

  // Assignment B: Practice (Sectional practice, due in 14 days)
  const practiceReadingTest = db.prepare("SELECT * FROM reading_tests WHERE test_type = 'general' LIMIT 1").get() as any;
  if (practiceReadingTest) {
    createAssignment(teacherUser.id, demoClass.id, {
      title: 'Course Practice: Workplace Texts & Table Completion',
      instructions: 'Untimed practice assignment focusing on scanning technique and table gap fills. Retries permitted.',
      purpose: 'practice',
      skill: 'reading',
      testId: practiceReadingTest.id,
      mode: 'practice',
      releaseAt: new Date().toISOString(),
      deadlineAt: new Date(Date.now() + 14 * 86400 * 1000).toISOString(),
      attemptLimit: 3,
      isReleased: true,
    });
  }

  // Assignment C: Protected Post-Test (Awaiting teacher release / unreleased!)
  const postAssign = createAssignment(teacherUser.id, demoClass.id, {
    title: 'Protected Post-Test (Final Class Evaluation)',
    instructions: 'Final course exit evaluation. Tests your gains in Reading and Listening following the 4-week preparation program.',
    purpose: 'post_test',
    packageId: postTestPackage.id,
    mode: 'mock',
    releaseAt: new Date(Date.now() + 28 * 86400 * 1000).toISOString(), // 28 days later
    deadlineAt: new Date(Date.now() + 35 * 86400 * 1000).toISOString(),
    attemptLimit: 1,
    isReleased: false, // PROTECTED: unreleased until teacher explicitly clicks "Release Post-Test"!
  });

  console.log(`Milestone 3 Seed Completed: Class "${demoClass.title}" created with invitation code "${demoClass.invitationCode}".`);
}
