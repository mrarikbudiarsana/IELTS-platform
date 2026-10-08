import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { hashPassword } from './auth';
import { createReadingTest, publishTestVersion } from './readingService';
import { createListeningTest, publishListeningTestVersion } from './listeningService';
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

  // 3. Create distinct POST-TEST materials (reading & listening) so pre-test and post-test have different content!
  console.log('Creating distinct post-test evaluation materials...');

  // Distinct Post-Test Reading Test
  const postReadingRes = createReadingTest({
    title: 'Academic Reading Post-Test: Autonomous Marine Exploration',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    createdById: teacherUser.id,
    passages: [
      {
        id: 'post_p1',
        passageNumber: 1,
        title: 'Autonomous Marine Exploration Platforms',
        subtitle: 'Robotic oceanic gliders and seafloor acoustics',
        paragraphs: [
          {
            id: 'post_para_a',
            label: 'A',
            content: 'Oceanographic research vessels are costly to operate. In response, maritime engineering institutions developed underwater buoyancy gliders. These torpedo-shaped vessels navigate ocean depths without engine propellers by periodically altering their internal volume using an oil-filled external bladder.'
          },
          {
            id: 'post_para_b',
            label: 'B',
            content: 'Deep ocean acoustic tomography monitors temperature fluctuations across vast ocean basins. High-frequency sonar sensors map seismic activity along oceanic rifts with unprecedented spatial accuracy.'
          }
        ]
      }
    ],
    questionGroups: [
      {
        id: 'post_qg1',
        passageId: 'post_p1',
        questionType: 'true_false_not_given',
        title: 'Questions 1–3',
        instructions: 'Do the following statements agree with the information in Passage 1?\nWrite TRUE, FALSE, or NOT GIVEN.',
        startQuestionNumber: 1,
        endQuestionNumber: 3,
        questions: [
          {
            id: 'post_q1',
            questionNumber: 1,
            prompt: 'Underwater buoyancy gliders rely on conventional engine propellers to navigate ocean depths.',
            answerKey: 'FALSE',
            explanation: 'Paragraph A states they navigate without engine propellers by altering internal volume.',
            paragraphRef: 'A'
          },
          {
            id: 'post_q2',
            questionNumber: 2,
            prompt: 'Oil-filled bladders assist gliders in adjusting their buoyancy.',
            answerKey: 'TRUE',
            explanation: 'Paragraph A mentions periodically altering internal volume using an oil-filled external bladder.',
            paragraphRef: 'A'
          },
          {
            id: 'post_q3',
            questionNumber: 3,
            prompt: 'Acoustic tomography was originally invented for military submarine communications.',
            answerKey: 'NOT GIVEN',
            explanation: 'Paragraph B mentions acoustic tomography for temperature, but not its military invention origin.',
            paragraphRef: 'B'
          }
        ]
      }
    ]
  });
  publishTestVersion(postReadingRes.test.id, postReadingRes.version.id);

  // Distinct Post-Test Listening Test
  const postListeningRes = createListeningTest({
    title: 'IELTS Listening Post-Test: Harbor Environmental Assessment',
    category: 'mock',
    timeLimitMinutes: 35,
    createdById: teacherUser.id,
    parts: [
      {
        id: 'post_lpart1',
        partNumber: 1,
        title: 'Harbor Research Station Induction',
        context: 'An induction briefing for new research volunteers at the harbor marine station.',
        audioUrl: '/audio/listening_part3_student_project.wav',
        containsIntroPauses: true,
        introPauseSeconds: 30,
        checkPauseSeconds: 30,
        transcript: 'Welcome to the Harbor Marine Station. Safety badges must be worn at all times in the wet laboratory. Water samples are catalogued every weekday at nine in the morning.'
      }
    ],
    questionGroups: [
      {
        id: 'post_lqg1',
        partNumber: 1,
        questionType: 'form_completion',
        title: 'Questions 1–2',
        instructions: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS for each answer.',
        wordLimitRule: 'NO MORE THAN TWO WORDS',
        startQuestionNumber: 1,
        endQuestionNumber: 2,
        questions: [
          {
            id: 'post_lq1',
            questionNumber: 1,
            prompt: 'Identification required in wet laboratory',
            answerKey: 'SAFETY BADGES',
            acceptedAlternatives: ['safety badge', 'safety badges'],
            explanation: 'Speaker states safety badges must be worn at all times in the wet laboratory.',
            audioTimestampSeconds: 15
          },
          {
            id: 'post_lq2',
            questionNumber: 2,
            prompt: 'Routine water collection time',
            answerKey: 'NINE',
            acceptedAlternatives: ['9', 'nine am', '9 am'],
            explanation: 'Speaker confirms water samples are catalogued every weekday at nine in the morning.',
            audioTimestampSeconds: 30
          }
        ]
      }
    ]
  });
  publishListeningTestVersion(postListeningRes.test.id, postListeningRes.version.id);

  // 4. Create Pre-Test Package and Post-Test Package
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
    readingTestId: postReadingRes.test.id,
    listeningTestId: postListeningRes.test.id,
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
