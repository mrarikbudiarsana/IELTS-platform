import assert from 'assert';
import { v4 as uuidv4 } from 'uuid';
import { db, initDatabase } from '../server/db';
import { hashPassword } from '../server/auth';
import {
  createClass,
  updateClass,
  getClassById,
  listTeacherClasses,
  listStudentClasses,
  enrolStudentByCode,
  enrolStudentByEmail,
  removeStudentFromClass,
  listClassEnrolments,
  isStudentInClass,
} from '../server/classService';
import {
  createTestPackage,
  getTestPackageById,
  listTestPackages,
  createAssignment,
  releasePostTestAssignment,
  getAssignmentById,
  isTestReservedInUnreleasedPostTest,
  listClassAssignments,
  startOrResumePackageAttempt,
  getPackageAttemptById,
  linkSkillToPackageAttempt,
  getPrePostComparison,
  getClassOverview,
} from '../server/assignmentService';
import { createReadingTest, publishTestVersion } from '../server/readingService';
import { createListeningTest, publishListeningTestVersion } from '../server/listeningService';
import { startOrResumeAttempt, saveStudentAnswer, submitAttempt } from '../server/attemptService';
import { startOrResumeListeningAttempt, saveListeningAnswer, submitListeningAttempt } from '../server/listeningAttemptService';

console.log('\n======================================================');
console.log('  RUNNING IELTS CLASS & JOURNEY VERIFICATION SUITE   ');
console.log('======================================================\n');

async function runEntryPoint() {
(await initDatabase());

// -----------------------------------------------------------------
// Test Helper: Provision Users
// -----------------------------------------------------------------
const testTeacherId = uuidv4();
const testTeacherEmail = `teacher_${Date.now()}@test.com`;
(await db.prepare(`
  INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, created_at)
  VALUES (?, ?, ?, 'Teacher Testington', 'teacher', 'academic', datetime('now'))
`).run(testTeacherId, testTeacherEmail, hashPassword('Pass1234!')));

const otherTeacherId = uuidv4();
(await db.prepare(`
  INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, created_at)
  VALUES (?, ?, ?, 'Other Instructor', 'teacher', 'academic', datetime('now'))
`).run(otherTeacherId, `other_${Date.now()}@test.com`, hashPassword('Pass1234!')));

const student1Id = uuidv4();
const student1Email = `student1_${Date.now()}@test.com`;
(await db.prepare(`
  INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, created_at)
  VALUES (?, ?, ?, 'Alice Learner', 'student', 'academic', datetime('now'))
`).run(student1Id, student1Email, hashPassword('Pass1234!')));

const student2Id = uuidv4();
const student2Email = `student2_${Date.now()}@test.com`;
(await db.prepare(`
  INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, created_at)
  VALUES (?, ?, ?, 'Bob Learner', 'student', 'academic', datetime('now'))
`).run(student2Id, student2Email, hashPassword('Pass1234!')));

// Helper: Provision distinct test materials for Pre and Post
const preReadingRes = (await createReadingTest({
  title: `Pre-Test Reading ${Date.now()}`,
  testType: 'academic',
  category: 'mock',
  timeLimitMinutes: 60,
  createdById: testTeacherId,
  passages: [
    {
      id: 'pre_p1',
      passageNumber: 1,
      title: 'Pre-Test Passage 1',
      paragraphs: [{ id: 'pre_para_a', label: 'A', content: 'This is the diagnostic pre-test passage text.' }],
    },
  ],
  questionGroups: [
    {
      id: 'pre_qg1',
      passageId: 'pre_p1',
      instructions: 'Choose True, False or Not Given',
      questionType: 'true_false_not_given',
      startQuestionNumber: 1,
      endQuestionNumber: 1,
      questions: [
        {
          id: 'pre_q1',
          questionNumber: 1,
          prompt: 'The diagnostic text exists.',
          answerKey: 'TRUE',
          explanation: 'Evidence directly in paragraph A.',
        },
      ],
    },
  ],
}));
(await publishTestVersion(preReadingRes.test.id, preReadingRes.version.id));

const postReadingRes = (await createReadingTest({
  title: `Post-Test Reading ${Date.now()}`,
  testType: 'academic',
  category: 'mock',
  timeLimitMinutes: 60,
  createdById: testTeacherId,
  passages: [
    {
      id: 'post_p1',
      passageNumber: 1,
      title: 'Post-Test Passage 1',
      paragraphs: [{ id: 'post_para_a', label: 'A', content: 'This is the exit post-test passage text.' }],
    },
  ],
  questionGroups: [
    {
      id: 'post_qg1',
      passageId: 'post_p1',
      instructions: 'Choose True, False or Not Given',
      questionType: 'true_false_not_given',
      startQuestionNumber: 1,
      endQuestionNumber: 1,
      questions: [
        {
          id: 'post_q1',
          questionNumber: 1,
          prompt: 'The exit post-test text exists.',
          answerKey: 'TRUE',
          explanation: 'Evidence directly in paragraph A.',
        },
      ],
    },
  ],
}));
(await publishTestVersion(postReadingRes.test.id, postReadingRes.version.id));

const preListeningRes = (await createListeningTest({
  title: `Pre-Test Listening ${Date.now()}`,
  category: 'mock',
  audioMode: 'part_audios',
  timeLimitMinutes: 30,
  createdById: testTeacherId,
  parts: [
    {
      partNumber: 1,
      title: 'Pre Part 1',
      audioUrl: '/audio/pre-test.mp3',
      transcript: 'Hello and welcome to the pre-test registration.',
      questionGroupIds: ['pre_l_qg1'],
    },
  ],
  questionGroups: [
    {
      id: 'pre_l_qg1',
      partNumber: 1,
      instructions: 'Complete sentences with ONE WORD',
      questionType: 'sentence_completion',
      startQuestionNumber: 1,
      endQuestionNumber: 1,
      questions: [
        {
          id: 'pre_l_q1',
          questionNumber: 1,
          prompt: 'Candidate name is [1].',
          answerKey: 'Smith',
          explanation: 'Spelled S-M-I-T-H.',
        },
      ],
    },
  ],
}));
(await publishListeningTestVersion(preListeningRes.test.id, preListeningRes.version.id));

const postListeningRes = (await createListeningTest({
  title: `Post-Test Listening ${Date.now()}`,
  category: 'mock',
  audioMode: 'part_audios',
  timeLimitMinutes: 30,
  createdById: testTeacherId,
  parts: [
    {
      partNumber: 1,
      title: 'Post Part 1',
      audioUrl: '/audio/post-test.mp3',
      transcript: 'Exit interview for post-test analysis.',
      questionGroupIds: ['post_l_qg1'],
    },
  ],
  questionGroups: [
    {
      id: 'post_l_qg1',
      partNumber: 1,
      instructions: 'Complete sentences with ONE WORD',
      questionType: 'sentence_completion',
      startQuestionNumber: 1,
      endQuestionNumber: 1,
      questions: [
        {
          id: 'post_l_q1',
          questionNumber: 1,
          prompt: 'Course code is [1].',
          answerKey: 'IELTS',
          explanation: 'Code is IELTS.',
        },
      ],
    },
  ],
}));
(await publishListeningTestVersion(postListeningRes.test.id, postListeningRes.version.id));

// -----------------------------------------------------------------
// Check 1: Class Creation & Permission Isolation
// -----------------------------------------------------------------
console.log('CHECK 1: Class Creation & Teacher Role Authorization');
const class1 = (await createClass(testTeacherId, {
  title: 'IELTS Academic Cohort Alpha',
  description: '8-week intensive preparation program',
  testType: 'academic',
}));

assert.ok(class1.id, 'Class ID must be generated');
assert.strictEqual(class1.teacherId, testTeacherId, 'Teacher ID must match creator');
assert.ok(class1.invitationCode.startsWith('CLASS-'), 'Invitation code formatted correctly');
assert.strictEqual(class1.testType, 'academic', 'Test type must be academic');

// Update class permissions: other teacher cannot edit class1
let errorThrown = false;
try {
  (await updateClass(class1.id, otherTeacherId, { title: 'Unauthorized Edit' }));
} catch (e: any) {
  errorThrown = true;
  assert.ok(e.message.includes('permission'), 'Must reject unauthorized teacher update');
}
assert.ok(errorThrown, 'Should block unauthorized update');

// Teacher list filtering
const teacher1Classes = (await listTeacherClasses(testTeacherId));
assert.strictEqual(teacher1Classes.length, 1, 'Teacher 1 should have exactly 1 class');
const teacher2Classes = (await listTeacherClasses(otherTeacherId));
assert.strictEqual(teacher2Classes.length, 0, 'Teacher 2 should have 0 classes');
console.log('  ✔ Class creation, invitation codes, and teacher permissions verified.');

// -----------------------------------------------------------------
// Check 2: Enrolment, Student Isolation, and Safe Removal
// -----------------------------------------------------------------
console.log('CHECK 2: Protected Enrolment, Code Joining, and Non-destructive Removal');

// Student 1 joins via invitation code
const joinedClass = (await enrolStudentByCode(student1Id, class1.invitationCode));
assert.strictEqual(joinedClass.id, class1.id, 'Joined class ID must match');
assert.ok((await isStudentInClass(class1.id, student1Id)), 'Student 1 must be confirmed in class');

// Teacher invites Student 2 by email
const enrolment2 = (await enrolStudentByEmail(testTeacherId, class1.id, student2Email));
assert.strictEqual(enrolment2.studentId, student2Id, 'Enrolled student ID matches student 2');
assert.ok((await isStudentInClass(class1.id, student2Id)), 'Student 2 must be confirmed in class');

// Student class visibility
const student1Classes = (await listStudentClasses(student1Id));
assert.strictEqual(student1Classes.length, 1, 'Student 1 should see enrolled class');
assert.strictEqual(student1Classes[0].id, class1.id);

// Roster verification
const roster = (await listClassEnrolments(testTeacherId, class1.id));
assert.strictEqual(roster.length, 2, 'Roster must contain 2 enrolled students');

// Non-destructive removal: remove Student 2
(await removeStudentFromClass(testTeacherId, class1.id, student2Id));
assert.strictEqual((await isStudentInClass(class1.id, student2Id)), false, 'Student 2 must not be active');

// Verify student account still exists intact!
const student2User = (await db.prepare('SELECT * FROM users WHERE id = ?').get(student2Id)) as any;
assert.ok(student2User, 'Student 2 user account must NOT be deleted upon class removal');

// Re-enrol Student 2 for upcoming tests
(await enrolStudentByEmail(testTeacherId, class1.id, student2Email));
assert.ok((await isStudentInClass(class1.id, student2Id)), 'Student 2 re-enroled');
console.log('  ✔ Enrolment by code and email verified; student removal preserves user account.');

// -----------------------------------------------------------------
// Check 3: Multi-Skill Test Packages & 4-Skill Slot Integrity
// -----------------------------------------------------------------
console.log('CHECK 3: Multi-Skill Test Packages & Skill Slot Specification');

const prePackage = (await createTestPackage(testTeacherId, {
  title: 'Diagnostic Pre-Test Package',
  packageType: 'pre_test',
  testType: 'academic',
  readingTestId: preReadingRes.test.id,
  listeningTestId: preListeningRes.test.id,
}));

assert.strictEqual(prePackage.writingStatus, 'not_implemented', 'Writing slot must be not_implemented');
assert.strictEqual(prePackage.speakingStatus, 'not_implemented', 'Speaking slot must be not_implemented');
assert.strictEqual(prePackage.readingTestId, preReadingRes.test.id);
assert.strictEqual(prePackage.listeningTestId, preListeningRes.test.id);

const postPackage = (await createTestPackage(testTeacherId, {
  title: 'Final Exit Post-Test Package',
  packageType: 'post_test',
  testType: 'academic',
  readingTestId: postReadingRes.test.id,
  listeningTestId: postListeningRes.test.id,
}));

assert.strictEqual(postPackage.packageType, 'post_test');
assert.strictEqual(postPackage.writingStatus, 'not_implemented');
assert.strictEqual(postPackage.speakingStatus, 'not_implemented');
console.log('  ✔ Multi-skill test packages and unsimulated Writing/Speaking slots confirmed.');

// -----------------------------------------------------------------
// Check 4: Pre-Test vs Post-Test Overlap Warning
// -----------------------------------------------------------------
console.log('CHECK 4: Material Overlap Detection Between Pre and Post Tests');

// Assign Pre-test first
const { assignment: preAssignment } = (await createAssignment(testTeacherId, class1.id, {
  title: 'Diagnostic Pre-Test Exam Rehearsal',
  purpose: 'pre_test',
  packageId: prePackage.id,
  mode: 'mock',
  attemptLimit: 1,
  isReleased: true,
}));
assert.strictEqual(preAssignment.purpose, 'pre_test');

// Attempt to assign Post-Test using the SAME pre-test package -> must trigger warning!
const overlappingResult = (await createAssignment(testTeacherId, class1.id, {
  title: 'Invalid Overlapping Post-Test',
  purpose: 'post_test',
  packageId: prePackage.id,
  mode: 'mock',
  attemptLimit: 1,
  isReleased: false,
}));
assert.ok(overlappingResult.warning, 'Warning must be returned when materials overlap');
assert.ok(overlappingResult.warning.includes('Overlapping material detected'), 'Warning text matches pedagogical policy');
// Clean up the invalid overlapping test assignment so it doesn't reserve prePackage materials
(await db.prepare('DELETE FROM assignments WHERE id = ?').run(overlappingResult.assignment.id));

// Now create the proper distinct Post-Test assignment (initially unreleased)
const { assignment: postAssignment, warning: noWarning } = (await createAssignment(testTeacherId, class1.id, {
  title: 'Final Exit Post-Test Exam Rehearsal',
  purpose: 'post_test',
  packageId: postPackage.id,
  mode: 'mock',
  attemptLimit: 1,
  isReleased: false, // Protected unreleased state
}));
assert.strictEqual(noWarning, undefined, 'No warning when post-test uses distinct materials');
assert.strictEqual(postAssignment.isReleased, false, 'Post-test must initially be unreleased');
console.log('  ✔ Content overlap detection and non-equivalence warnings verified.');

// -----------------------------------------------------------------
// Check 5: Protected Post-Test Content Isolation (Security Guard)
// -----------------------------------------------------------------
console.log('CHECK 5: Protected Post-Test Isolation (Catalogue & Direct Access Guards)');

// Check reservation detector
assert.strictEqual((await isTestReservedInUnreleasedPostTest(postReadingRes.test.id)), true, 'Post reading test must be identified as reserved');
assert.strictEqual((await isTestReservedInUnreleasedPostTest(postListeningRes.test.id)), true, 'Post listening test must be identified as reserved');
assert.strictEqual((await isTestReservedInUnreleasedPostTest(preReadingRes.test.id)), false, 'Pre reading test is released, not reserved unreleased');

// Direct attempt start on post-reading test by learner must be blocked!
let postReadingBlocked = false;
try {
  (await startOrResumeAttempt({
    userId: student1Id,
    testId: postReadingRes.test.id,
    modeOverride: 'mock',
  }));
} catch (e: any) {
  postReadingBlocked = true;
  assert.ok(e.message.includes('reserved') || e.message.includes('unreleased'), 'Rejects direct start of reserved test');
}
assert.ok(postReadingBlocked, 'Learner direct start of unreleased post reading must be blocked');

// Direct attempt start on post-listening test by learner must be blocked!
let postListeningBlocked = false;
try {
  (await startOrResumeListeningAttempt({
    userId: student1Id,
    testId: postListeningRes.test.id,
    modeOverride: 'mock',
  }));
} catch (e: any) {
  postListeningBlocked = true;
  assert.ok(e.message.includes('reserved') || e.message.includes('unreleased'), 'Rejects direct start of reserved listening test');
}
assert.ok(postListeningBlocked, 'Learner direct start of unreleased post listening must be blocked');

// Starting package attempt on unreleased post-test must be blocked!
let packageStartBlocked = false;
try {
  (await startOrResumePackageAttempt(postAssignment.id, student1Id));
} catch (e: any) {
  packageStartBlocked = true;
  assert.ok(e.message.includes('not been released'), 'Rejects package start when unreleased');
}
assert.ok(packageStartBlocked, 'Starting unreleased post-test package attempt must be blocked');
console.log('  ✔ Reserved post-test content is strictly inaccessible to learners before release.');

// -----------------------------------------------------------------
// Check 6: Executing Pre-Test Package & Linking Skill Attempts
// -----------------------------------------------------------------
console.log('CHECK 6: Pre-Test Package Attempt Execution & Skill Linking');

// Student 1 starts pre-test package
const prePkgAttemptResult = (await startOrResumePackageAttempt(preAssignment.id, student1Id, 'exam_rehearsal'));
const prePkgAttemptId = prePkgAttemptResult.packageAttempt.id;
assert.ok(prePkgAttemptId, 'Pre-test package attempt started');
assert.strictEqual(prePkgAttemptResult.packageAttempt.status, 'in_progress');

// Student 1 takes pre-test Reading attempt under this assignment & package
const preReadAttemptResult = (await startOrResumeAttempt({
  userId: student1Id,
  testId: preReadingRes.test.id,
  modeOverride: 'mock',
  assignmentId: preAssignment.id,
  packageAttemptId: prePkgAttemptId,
}));
(await saveStudentAnswer({
  attemptId: preReadAttemptResult.attempt.id,
  userId: student1Id,
  questionNumber: 1,
  questionId: 'pre_q1',
  userAnswer: 'TRUE',
}));
// Submit reading attempt with correct answer (1/1)
const submittedReadAttempt = (await submitAttempt({
  attemptId: preReadAttemptResult.attempt.id,
  userId: student1Id,
}));
assert.strictEqual(submittedReadAttempt.rawScore, 1);

// Link to package
(await linkSkillToPackageAttempt(prePkgAttemptId, 'reading', submittedReadAttempt.id));

// Student 1 takes pre-test Listening attempt under this assignment & package
const preListAttemptResult = (await startOrResumeListeningAttempt({
  userId: student1Id,
  testId: preListeningRes.test.id,
  modeOverride: 'mock',
  assignmentId: preAssignment.id,
  packageAttemptId: prePkgAttemptId,
}));
(await saveListeningAnswer({
  attemptId: preListAttemptResult.attempt.id,
  userId: student1Id,
  questionNumber: 1,
  questionId: 'pre_l_q1',
  userAnswer: 'Smith',
}));
// Submit listening attempt with correct answer (1/1)
const submittedListAttempt = (await submitListeningAttempt({
  attemptId: preListAttemptResult.attempt.id,
  userId: student1Id,
}));
assert.strictEqual(submittedListAttempt.rawScore, 1);

// Link to package
(await linkSkillToPackageAttempt(prePkgAttemptId, 'listening', submittedListAttempt.id));

// Verify package attempt reflects linked skills and completion
const updatedPrePkgAttempt = (await getPackageAttemptById(prePkgAttemptId, student1Id));
assert.strictEqual(updatedPrePkgAttempt.readingAttemptId, submittedReadAttempt.id);
assert.strictEqual(updatedPrePkgAttempt.listeningAttemptId, submittedListAttempt.id);
assert.strictEqual(updatedPrePkgAttempt.status, 'completed', 'Package attempt should auto-complete when executable skills are finished');
console.log('  ✔ Pre-test package attempt and skill linking executed cleanly.');

// -----------------------------------------------------------------
// Check 7: Server-Side Attempt Limits
// -----------------------------------------------------------------
console.log('CHECK 7: Server-Side Attempt Limit Enforcement');

let attemptLimitBlocked = false;
try {
  // Pre-test had attemptLimit = 1; second attempt must be rejected!
  (await startOrResumePackageAttempt(preAssignment.id, student1Id));
} catch (e: any) {
  attemptLimitBlocked = true;
  assert.ok(e.message.includes('Attempt limit reached'), 'Must throw attempt limit reached');
}
assert.ok(attemptLimitBlocked, 'Enforces strict attempt limit on package attempt');
console.log('  ✔ Strict server-side assignment attempt limit verified.');

// -----------------------------------------------------------------
// Check 8: Explicit Teacher Release of Post-Test & Execution
// -----------------------------------------------------------------
console.log('CHECK 8: Explicit Teacher Release and Post-Test Execution');

// Teacher explicitly releases post-test
const releasedPostAssignment = (await releasePostTestAssignment(testTeacherId, postAssignment.id));
assert.strictEqual(releasedPostAssignment.isReleased, true, 'Post-test must now be marked released');

// Now student can start post-test package attempt!
const postPkgAttemptResult = (await startOrResumePackageAttempt(postAssignment.id, student1Id, 'exam_rehearsal'));
const postPkgAttemptId = postPkgAttemptResult.packageAttempt.id;
assert.ok(postPkgAttemptId, 'Post-test package attempt started after teacher release');

// Student completes post-test reading
const postReadAttemptResult = (await startOrResumeAttempt({
  userId: student1Id,
  testId: postReadingRes.test.id,
  modeOverride: 'mock',
  assignmentId: postAssignment.id,
  packageAttemptId: postPkgAttemptId,
}));
(await saveStudentAnswer({
  attemptId: postReadAttemptResult.attempt.id,
  userId: student1Id,
  questionNumber: 1,
  questionId: 'post_q1',
  userAnswer: 'TRUE',
}));
const submittedPostRead = (await submitAttempt({
  attemptId: postReadAttemptResult.attempt.id,
  userId: student1Id,
}));
(await linkSkillToPackageAttempt(postPkgAttemptId, 'reading', submittedPostRead.id));

// Student completes post-test listening
const postListAttemptResult = (await startOrResumeListeningAttempt({
  userId: student1Id,
  testId: postListeningRes.test.id,
  modeOverride: 'mock',
  assignmentId: postAssignment.id,
  packageAttemptId: postPkgAttemptId,
}));
(await saveListeningAnswer({
  attemptId: postListAttemptResult.attempt.id,
  userId: student1Id,
  questionNumber: 1,
  questionId: 'post_l_q1',
  userAnswer: 'IELTS',
}));
const submittedPostList = (await submitListeningAttempt({
  attemptId: postListAttemptResult.attempt.id,
  userId: student1Id,
}));
(await linkSkillToPackageAttempt(postPkgAttemptId, 'listening', submittedPostList.id));

const updatedPostPkg = (await getPackageAttemptById(postPkgAttemptId, student1Id));
assert.strictEqual(updatedPostPkg.status, 'completed');
console.log('  ✔ Post-test explicit release and execution verified.');

// -----------------------------------------------------------------
// Check 9: Pre/Post Diagnostic Comparison Report & Pedagogical Notes
// -----------------------------------------------------------------
console.log('CHECK 9: Diagnostic Pre/Post Comparison Report & Pedagogical Disclaimer');

const comparisonReport = (await getPrePostComparison(class1.id, student1Id, student1Id, 'student'));
assert.strictEqual(comparisonReport.studentId, student1Id);
assert.strictEqual(comparisonReport.preTest.skills.reading.status, 'completed');
assert.strictEqual(comparisonReport.preTest.skills.listening.status, 'completed');
assert.strictEqual(comparisonReport.preTest.skills.writing.status, 'not_implemented');
assert.strictEqual(comparisonReport.preTest.skills.speaking.status, 'not_implemented');

assert.strictEqual(comparisonReport.postTest.skills.reading.status, 'completed');
assert.strictEqual(comparisonReport.postTest.skills.listening.status, 'completed');
assert.strictEqual(comparisonReport.postTest.skills.writing.status, 'not_implemented');
assert.strictEqual(comparisonReport.postTest.skills.speaking.status, 'not_implemented');

// Verify deltas
assert.ok(comparisonReport.deltas.readingRawDelta !== undefined, 'Reading raw delta computed');
assert.ok(comparisonReport.deltas.listeningRawDelta !== undefined, 'Listening raw delta computed');

// Verify Pedagogical Note
assert.ok(
  comparisonReport.pedagogicalNote.includes('learning progress'),
  'Note explains score changes must not be attributed solely to learning progress'
);
assert.ok(
  comparisonReport.pedagogicalNote.includes('test variation'),
  'Note notes test variation between test versions'
);
assert.ok(
  comparisonReport.pedagogicalNote.includes('Writing and Speaking remain to be implemented'),
  'Note notes overall band cannot be computed without Writing & Speaking'
);

// Verify Overview Diagnostics for Teacher
const overview = (await getClassOverview(class1.id, testTeacherId));
assert.strictEqual(overview.classId, class1.id);
assert.ok(overview.totalStudents >= 2, 'Overview reflects enrolled students');
assert.ok(overview.assignments.length >= 2, 'Overview reflects assignments');
console.log('  ✔ Pre/Post comparison report and pedagogical guard rails verified.');

console.log('\n======================================================');
console.log('  ALL 9 CLASS & JOURNEY CHECKS PASSED (100%)!       ');
console.log('======================================================\n');

// Clean up ephemeral tests created for this test run
const testIdsToClean = [preReadingRes.test.id, postReadingRes.test.id];
const listeningIdsToClean = [preListeningRes.test.id, postListeningRes.test.id];

if (process.env.DATABASE_PROVIDER === 'sqlite') {
(await db.pragma('foreign_keys = OFF'));
(await db.prepare(`DELETE FROM reading_answers WHERE attempt_id IN (SELECT id FROM reading_attempts WHERE test_id IN (?, ?))`).run(...testIdsToClean));
(await db.prepare(`DELETE FROM reading_attempts WHERE test_id IN (?, ?)`).run(...testIdsToClean));
(await db.prepare(`DELETE FROM reading_test_versions WHERE test_id IN (?, ?)`).run(...testIdsToClean));
(await db.prepare(`DELETE FROM reading_tests WHERE id IN (?, ?)`).run(...testIdsToClean));

(await db.prepare(`DELETE FROM listening_answers WHERE attempt_id IN (SELECT id FROM listening_attempts WHERE test_id IN (?, ?))`).run(...listeningIdsToClean));
(await db.prepare(`DELETE FROM listening_attempts WHERE test_id IN (?, ?)`).run(...listeningIdsToClean));
(await db.prepare(`DELETE FROM listening_test_versions WHERE test_id IN (?, ?)`).run(...listeningIdsToClean));
(await db.prepare(`DELETE FROM listening_tests WHERE id IN (?, ?)`).run(...listeningIdsToClean));
(await db.pragma('foreign_keys = ON'));
}

}
export const testCompleted = runEntryPoint();
testCompleted.catch(error => { console.error(error); process.exitCode = 1; });
