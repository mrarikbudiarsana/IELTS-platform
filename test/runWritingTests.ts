import { db, initDatabase } from '../server/db';
import {
  createWritingTask,
  updateWritingTaskDraft,
  publishWritingTask,
  forkWritingTaskVersion,
  getWritingTaskById,
  listWritingTasks,
  startOrResumeWritingAttempt,
  saveWritingDraftResponse,
  submitWritingAttempt,
  createResponseRevision,
  getWritingAttemptById,
  getWritingResponseById,
} from '../server/writingService';
import {
  getUserAllowanceBalance,
  grantTestingAllowance,
  reserveAllowance,
  consumeAllowance,
  releaseAllowance,
} from '../server/allowanceService';
import {
  requestAiWritingAssessment,
  processAssessmentJob,
} from '../server/aiWritingService';
import {
  calculateIeltsWritingTaskBand,
  calculateIeltsWritingOverallBand,
  calculateIeltsFourSkillOverallBand,
  countWords,
  roundIeltsBand,
} from '../shared/scoring';
import {
  createTestPackage,
  getTestPackageById,
  getPrePostComparison,
} from '../server/assignmentService';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${msg}`);
  }
}

async function runWritingTestSuite() {
  console.log('\n--- MILESTONE 5: WRITING WORKSPACE & AI ASSESSMENT TEST SUITE ---');

  initDatabase();

  const teacher = db.prepare("SELECT id FROM users WHERE role = 'teacher' LIMIT 1").get() as any;
  const student = db.prepare("SELECT id FROM users WHERE role = 'student' LIMIT 1").get() as any;
  const admin = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as any;

  if (!teacher || !student || !admin) {
    console.error('Missing seed users for writing tests.');
    process.exit(1);
  }

  // 1. Official Scoring Calculations & Task 2 Weighting
  console.log('\n1. Official IELTS Writing Scoring & 4-Skill Band Calculations:');

  // Task band rounding
  const taskBand1 = calculateIeltsWritingTaskBand(6.5, 6.0, 7.0, 6.5); // Mean: 6.5
  assert(taskBand1 === 6.5, `Task band calculation matches official arithmetic mean (expected 6.5, got ${taskBand1})`);

  const taskBand2 = calculateIeltsWritingTaskBand(7.0, 6.5, 6.5, 6.5); // Mean: 6.625 -> 6.5
  assert(taskBand2 === 6.5, `Task band 6.625 rounds to 6.5 (got ${taskBand2})`);

  const taskBand3 = calculateIeltsWritingTaskBand(6.5, 7.0, 7.0, 6.5); // Mean: 6.75 -> 7.0
  assert(taskBand3 === 7.0, `Task band 6.75 rounds up to 7.0 (got ${taskBand3})`);

  // Overall Writing Band with Task 2 double weighting: (T1 + 2*T2) / 3
  // Example 1: T1 = 6.0, T2 = 7.0 -> (6 + 14)/3 = 6.666... -> rounds to 6.5
  const writingOverall1 = calculateIeltsWritingOverallBand(6.0, 7.0);
  assert(writingOverall1 === 6.5, `Writing overall: (6.0 + 2*7.0)/3 = 6.667 rounds to 6.5 (got ${writingOverall1})`);

  // Example 2: T1 = 6.0, T2 = 7.5 -> (6 + 15)/3 = 7.0
  const writingOverall2 = calculateIeltsWritingOverallBand(6.0, 7.5);
  assert(writingOverall2 === 7.0, `Writing overall: (6.0 + 2*7.5)/3 = 7.0 (got ${writingOverall2})`);

  // Example 3: T1 = 7.5, T2 = 6.0 -> (7.5 + 12)/3 = 6.5
  const writingOverall3 = calculateIeltsWritingOverallBand(7.5, 6.0);
  assert(writingOverall3 === 6.5, `Writing overall with lower T2: (7.5 + 2*6.0)/3 = 6.5 (got ${writingOverall3})`);

  // Four-Skill Overall Band: (L + R + W + S) / 4
  // Example: L=7.5, R=7.0, W=6.5, S=6.5 -> (27.5)/4 = 6.875 -> rounds to 7.0
  const fourSkill1 = calculateIeltsFourSkillOverallBand(7.5, 7.0, 6.5, 6.5);
  assert(fourSkill1 === 7.0, `Four-skill overall: (7.5 + 7.0 + 6.5 + 6.5)/4 = 6.875 rounds to 7.0 (got ${fourSkill1})`);

  // Example: L=6.5, R=6.0, W=6.0, S=6.0 -> (24.5)/4 = 6.125 -> rounds to 6.0
  const fourSkill2 = calculateIeltsFourSkillOverallBand(6.5, 6.0, 6.0, 6.0);
  assert(fourSkill2 === 6.0, `Four-skill overall: 6.125 rounds to 6.0 (got ${fourSkill2})`);

  // 2. Task Authoring & Visual Grounding Validation
  console.log('\n2. Task Authoring & Teacher-Verified Visual Grounding:');

  let validationFailedAsExpected = false;
  try {
    const ungroundedTask = createWritingTask({
      createdById: teacher.id,
      title: 'Invalid Academic Task 1 Without Grounding',
      taskType: 'academic_task_1',
      taskNumber: 1,
      testType: 'academic',
      prompt: 'Summarise the information by selecting and reporting the main features of the chart.',
      instructions: 'Spend 20 minutes, write 150 words.',
      minWords: 150,
      // No teacherVisualDescription provided!
    });
    publishWritingTask(ungroundedTask.id);
  } catch (err: any) {
    if (err.message.includes('teacher-verified visual description')) {
      validationFailedAsExpected = true;
    }
  }
  assert(
    validationFailedAsExpected,
    'Academic Task 1 cannot be published without a teacher-verified visual grounding description'
  );

  // Author and publish properly grounded task
  const validTask = createWritingTask({
    createdById: teacher.id,
    title: 'Test Bar Chart of Agricultural Production',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    prompt: 'The chart shows crop production in metric tons from 2010 to 2020 in three provinces.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    teacherVisualDescription:
      'Verified visual data: Province A wheat production grew from 50k to 90k metric tons. Province B remained constant at 40k. Province C dropped from 80k to 30k. Overall production rose marginally.',
    teacherAssessmentGuidance: 'Confidential: Ensure candidate identifies Province C decline.',
    modelResponse: 'Model answer for crop production...',
  });

  const publishedTask = publishWritingTask(validTask.id);
  assert(publishedTask.status === 'published', 'Task with visual grounding publishes successfully');

  // Verify student view scrubs confidential guidance
  const studentView = getWritingTaskById(publishedTask.id, 'student')!;
  const latestStudentVersion = studentView.versions![studentView.versions!.length - 1];
  assert(
    latestStudentVersion.teacherAssessmentGuidance === undefined,
    'Confidential teacher guidance is scrubbed from student task view'
  );
  assert(
    latestStudentVersion.modelResponse === undefined,
    'Unreleased model answer is scrubbed from student task view'
  );

  // Verify teacher view preserves guidance
  const teacherView = getWritingTaskById(publishedTask.id, 'teacher')!;
  const latestTeacherVersion = teacherView.versions![teacherView.versions!.length - 1];
  assert(
    latestTeacherVersion.teacherAssessmentGuidance !== undefined,
    'Teacher view retains confidential assessment guidance'
  );

  // 3. Auditable Allowance Ledger
  console.log('\n3. Auditable Allowance Ledger & Invariants:');

  const initialBalance = getUserAllowanceBalance(student.id);
  console.log(`     Student starting allowance: ${initialBalance.available}`);

  // Admin grants 3 allowances
  grantTestingAllowance({
    adminId: admin.id,
    userId: student.id,
    amount: 3,
    notes: 'Unit test allowance grant',
  });

  const afterGrantBalance = getUserAllowanceBalance(student.id);
  assert(
    afterGrantBalance.available === initialBalance.available + 3,
    `Admin grant increases available allowance by 3 (from ${initialBalance.available} to ${afterGrantBalance.available})`
  );

  // Reserve allowance
  const fakeAssessmentId = 'test-assess-' + Date.now();
  const fakeResponseId = 'test-resp-' + Date.now();
  reserveAllowance({
    userId: student.id,
    assessmentId: fakeAssessmentId,
    responseId: fakeResponseId,
    idempotencyKey: `idem-${fakeAssessmentId}`,
  });

  const afterReserveBalance = getUserAllowanceBalance(student.id);
  assert(
    afterReserveBalance.available === afterGrantBalance.available - 1,
    `Reservation decrements available balance by 1 (now ${afterReserveBalance.available})`
  );

  // Idempotent duplicate reservation does not double charge
  reserveAllowance({
    userId: student.id,
    assessmentId: fakeAssessmentId,
    responseId: fakeResponseId,
    idempotencyKey: `idem-${fakeAssessmentId}`,
  });
  const afterDuplicateReserve = getUserAllowanceBalance(student.id);
  assert(
    afterDuplicateReserve.available === afterReserveBalance.available,
    'Idempotent reservation request does not deduct extra allowance'
  );

  // Release on failure restores balance
  releaseAllowance({
    userId: student.id,
    assessmentId: fakeAssessmentId,
    responseId: fakeResponseId,
    reason: 'Simulated API failure',
  });
  const afterReleaseBalance = getUserAllowanceBalance(student.id);
  assert(
    afterReleaseBalance.available === afterGrantBalance.available,
    'Failed assessment releases reserved allowance back to candidate'
  );

  // 4. Student Workspace, Autosave & 60-Minute Shared Mock Timer
  console.log('\n4. Student Workspace, Autosave & Shared Mock Timer:');

  // Find a task 1 and a task 2 (or create one for test execution)
  let tasks = listWritingTasks({ status: 'published', userRole: 'student' });
  let task1 = tasks.find((t) => t.taskNumber === 1);
  let task2 = tasks.find((t) => t.taskNumber === 2);

  if (!task2) {
    const createdT2 = createWritingTask({
      createdById: teacher.id,
      title: 'Test Essay Task 2',
      taskType: 'task_2',
      taskNumber: 2,
      testType: 'academic',
      prompt: 'Some people think that universities should provide graduates with the knowledge and skills needed in the workplace.',
      instructions: 'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
      minWords: 250,
      teacherAssessmentGuidance: 'Assess argument coherence and paragraph balance.',
    });
    publishWritingTask(createdT2.id);
    tasks = listWritingTasks({ status: 'published', userRole: 'student' });
    task2 = tasks.find((t) => t.taskNumber === 2);
  }

  assert(task1 !== undefined && task2 !== undefined, 'Found published Task 1 and Task 2 for mock test');

  // Start 2-task full mock
  const attempt = startOrResumeWritingAttempt({
    userId: student.id,
    mode: 'mock',
    task1Id: task1!.id,
    task2Id: task2!.id,
  });

  assert(attempt.status === 'in_progress', 'Writing attempt started in in_progress state');
  assert(attempt.durationMinutes === 60, 'Full mock duration is server-set to 60 minutes');
  assert(attempt.deadlineAt !== undefined, 'Server-enforced deadline is set for timed mock');

  const nowMs = Date.now();
  const deadlineMs = new Date(attempt.deadlineAt!).getTime();
  const diffMinutes = Math.round((deadlineMs - nowMs) / (60 * 1000));
  assert(diffMinutes >= 59 && diffMinutes <= 60, `Deadline is 60 minutes from start (${diffMinutes} min)`);

  // Autosave Task 1 response
  const sampleTask1Text =
    'The provided bar chart outlines key metrics regarding clean energy expenditures from 2015 to 2025. Overall, solar investment expanded dramatically, outperforming wind power by 2025. In contrast, hydroelectric investment remained constant across the decade.\n\nIn 2015, solar was valued at $120 billion while wind reached $100 billion. Over the decade, solar surged to $350 billion while wind grew to $250 billion. Consequently, both sectors drove market growth.';
  const save1 = saveWritingDraftResponse({
    attemptId: attempt.id,
    taskNumber: 1,
    responseText: sampleTask1Text,
    userId: student.id,
  });

  const wordCount1 = countWords(sampleTask1Text);
  assert(save1.wordCount === wordCount1, `Live autosave calculates exact word count (${save1.wordCount} words)`);

  // Autosave Task 2 response
  const sampleTask2Text =
    'Artificial intelligence represents one of the most transformative technologies of modern times. On the one hand, critics argue that automation may disrupt traditional employment sectors. On the other hand, proponents argue that new specialized vocations will arise. In my perspective, prudent technological governance will foster substantial economic progress.';
  const save2 = saveWritingDraftResponse({
    attemptId: attempt.id,
    taskNumber: 2,
    responseText: sampleTask2Text,
    userId: student.id,
  });
  assert(save2.wordCount === countWords(sampleTask2Text), 'Task 2 draft saved independently');

  // Submit attempt -> locks responses
  const submittedAttempt = submitWritingAttempt(attempt.id, student.id);
  assert(submittedAttempt.status === 'submitted', 'Attempt status transitions to submitted');

  const refetchedAttempt = getWritingAttemptById(attempt.id)!;
  assert(refetchedAttempt.task1Response!.isLocked, 'Task 1 response is locked upon submission');
  assert(refetchedAttempt.task2Response!.isLocked, 'Task 2 response is locked upon submission');

  // Attempting to overwrite a locked response should fail
  let lockedEditFailed = false;
  try {
    saveWritingDraftResponse({
      attemptId: attempt.id,
      taskNumber: 1,
      responseText: 'Illegal post-submission modification',
      userId: student.id,
    });
  } catch (err: any) {
    if (err.message.includes('locked') || err.message.includes('already submitted')) {
      lockedEditFailed = true;
    }
  }
  assert(lockedEditFailed, 'Editing locked response throws authorization error');

  // Fork revision draft
  const revisionResponse = createResponseRevision({
    attemptId: attempt.id,
    taskNumber: 1,
    userId: student.id,
  });
  assert(revisionResponse.version === 2, 'Revision creates version 2 of student response');
  assert(
    revisionResponse.parentResponseId === refetchedAttempt.task1Response!.id,
    'Revision maintains pointer to parent locked response'
  );
  assert(!revisionResponse.isLocked, 'New revision draft is unlocked and editable');

  // 5. AI Evaluation Execution & Criterion Breakdown
  console.log('\n5. AI Writing Assessment Execution & Criteria Breakdown:');

  const t1ResponseId = refetchedAttempt.task1Response!.id;
  const initialStudentBalance = getUserAllowanceBalance(student.id).available;

  // Request AI assessment
  const aiReq = await requestAiWritingAssessment({
    responseId: t1ResponseId,
    userId: student.id,
  });

  assert(aiReq.status === 'queued' || aiReq.status === 'completed', 'AI assessment successfully queued');

  // Process assessment job synchronously
  await processAssessmentJob(aiReq.id);

  const updatedAttempt = getWritingAttemptById(attempt.id)!;
  const assessedResponse = getWritingResponseById(t1ResponseId)!;
  assert(assessedResponse.aiAssessment !== undefined, 'AI assessment attached to response');
  assert(assessedResponse.aiAssessment!.status === 'completed', 'Assessment status is completed');
  assert(assessedResponse.aiAssessment!.taskBand !== undefined, `Task Band assigned: ${assessedResponse.aiAssessment!.taskBand}`);
  assert(updatedAttempt.task1Band !== undefined, `Attempt task1Band synchronized: ${updatedAttempt.task1Band}`);

  const criteria = assessedResponse.aiAssessment!.criteria!;
  assert(
    criteria.taskAchievementOrResponse >= 1.0 && criteria.taskAchievementOrResponse <= 9.0,
    `Valid TA/TR band: ${criteria.taskAchievementOrResponse}`
  );
  assert(criteria.coherenceCohesion >= 1.0 && criteria.coherenceCohesion <= 9.0, `Valid CC band: ${criteria.coherenceCohesion}`);
  assert(criteria.lexicalResource >= 1.0 && criteria.lexicalResource <= 9.0, `Valid LR band: ${criteria.lexicalResource}`);
  assert(criteria.grammaticalRange >= 1.0 && criteria.grammaticalRange <= 9.0, `Valid GRA band: ${criteria.grammaticalRange}`);

  assert(
    Array.isArray(assessedResponse.aiAssessment!.evidenceQuotes) &&
      assessedResponse.aiAssessment!.evidenceQuotes.length > 0,
    'Includes evidence quotes extracted from candidate text'
  );

  assert(
    Array.isArray(assessedResponse.aiAssessment!.strengths) &&
      assessedResponse.aiAssessment!.strengths.length > 0,
    'Includes candidate strengths'
  );

  assert(
    Array.isArray(assessedResponse.aiAssessment!.improvements) &&
      assessedResponse.aiAssessment!.improvements.length > 0,
    'Includes prioritized actionable improvements'
  );

  const finalStudentBalance = getUserAllowanceBalance(student.id).available;
  assert(
    finalStudentBalance === initialStudentBalance - 1,
    `Completed assessment consumes exactly 1 allowance (balance: ${finalStudentBalance})`
  );

  // 6. TestPackage & Pre/Post Comparison 4-Skill Integration
  console.log('\n6. TestPackage & Pre/Post Comparison 4-Skill Integration:');

  const testPkg = createTestPackage(teacher.id, {
    title: 'Milestone 5 Full 4-Skill Demonstration Package',
    packageType: 'pre_test',
    testType: 'academic',
    writingTask1Id: task1!.id,
    writingTask2Id: task2!.id,
  });

  const retrievedPkg = getTestPackageById(testPkg.id);
  assert(retrievedPkg.writingStatus === 'configured', 'TestPackage writingStatus is configured');
  assert(retrievedPkg.writingTask1Id === task1!.id, 'TestPackage retains writingTask1Id');
  assert(retrievedPkg.writingTask2Id === task2!.id, 'TestPackage retains writingTask2Id');

  console.log(`\nWriting Tests Completed: ${passed} passed, ${failed} failed.`);

  // Clean up created scratch tasks and test packages so seeds remain authentic C21 only
  try {
    db.prepare('DELETE FROM test_packages WHERE id = ?').run(testPkg.id);
    db.prepare('DELETE FROM writing_task_versions WHERE task_id IN (?, ?)').run(task1!.id, task2!.id);
    db.prepare('DELETE FROM writing_tasks WHERE id IN (?, ?)').run(task1!.id, task2!.id);
  } catch (cleanErr) {
    // Ignore cleanup error
  }

  if (failed > 0) {
    process.exit(1);
  }
}

runWritingTestSuite().catch((err) => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});
