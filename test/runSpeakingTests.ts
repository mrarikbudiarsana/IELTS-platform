import assert from 'assert';
import { v4 as uuidv4 } from 'uuid';
import { db, initDatabase } from '../server/db';
import {
  calculateIeltsSpeakingBand,
  validateSpeakingCriterionScore,
} from '../shared/scoring';
import {
  createSpeakingSet,
  updateSpeakingDraftVersion,
  publishSpeakingSetVersion,
  forkSpeakingDraftVersion,
  archiveSpeakingSet,
  getSpeakingSetById,
  recordSpeakingAssessment,
  releaseSpeakingAssessment,
  correctReleasedSpeakingScores,
  getSpeakingAssessmentById,
  listTeacherAssessmentQueue,
  listStudentSpeakingAssessments,
} from '../server/speakingService';
import {
  createClass,
  enrolStudentByEmail,
} from '../server/classService';
import {
  createTestPackage,
  createAssignment,
  startOrResumePackageAttempt,
  getPrePostComparison,
} from '../server/assignmentService';

console.log('\n======================================================');
console.log('  RUNNING IELTS SPEAKING PLATFORM VERIFICATION SUITE  ');
console.log('======================================================\n');

initDatabase();

// ---------------------------------------------------------------------
// TEST USERS SETUP
// ---------------------------------------------------------------------
const teacherId = uuidv4();
const student1Id = uuidv4();
const student2Id = uuidv4();

const teacherEmail = `elena_speaking_${Date.now()}@test.com`;
const student1Email = `marcus_speaking_${Date.now()}@test.com`;
const student2Email = `chloe_speaking_${Date.now()}@test.com`;

db.prepare(`
  INSERT INTO users (id, email, password_hash, full_name, role)
  VALUES (?, ?, 'dummy_hash', 'Teacher Elena Speaking', 'teacher')
`).run(teacherId, teacherEmail);

db.prepare(`
  INSERT INTO users (id, email, password_hash, full_name, role)
  VALUES (?, ?, 'dummy_hash', 'Student Marcus Speaking', 'student')
`).run(student1Id, student1Email);

db.prepare(`
  INSERT INTO users (id, email, password_hash, full_name, role)
  VALUES (?, ?, 'dummy_hash', 'Student Chloe Speaking', 'student')
`).run(student2Id, student2Email);

// =====================================================================
// CHECK 1: Official IELTS Speaking Scoring Engine Calibration
// =====================================================================
console.log('CHECK 1: Official IELTS Speaking Scoring Engine Calibration');

// Test official IELTS rounding rule:
// mean = (FC + LR + GRA + P) / 4
// If fractional part ends in .25 -> round UP to .5
// If fractional part ends in .75 -> round UP to whole band (+1.0)
// If fractional part < .25 -> round down to .0
// If fractional part >= .25 && < .75 -> round to .5
// If fractional part >= .75 -> round up to next 1.0

// Case 1: (6.0 + 6.0 + 6.0 + 7.0) / 4 = 6.25 -> 6.5
assert.strictEqual(calculateIeltsSpeakingBand(6.0, 6.0, 6.0, 7.0), 6.5, 'Avg 6.25 rounds up to 6.5');

// Case 2: (6.0 + 7.0 + 7.0 + 7.0) / 4 = 6.75 -> 7.0
assert.strictEqual(calculateIeltsSpeakingBand(6.0, 7.0, 7.0, 7.0), 7.0, 'Avg 6.75 rounds up to 7.0');

// Case 3: (6.0 + 6.5 + 6.0 + 6.0) / 4 = 6.125 -> 6.0 (less than .25 rounds down to .0)
assert.strictEqual(calculateIeltsSpeakingBand(6.0, 6.5, 6.0, 6.0), 6.0, 'Avg 6.125 rounds down to 6.0');

// Case 4: (7.0 + 7.5 + 7.5 + 7.5) / 4 = 7.375 -> 7.5 (between .25 and .75 rounds to .5)
assert.strictEqual(calculateIeltsSpeakingBand(7.0, 7.5, 7.5, 7.5), 7.5, 'Avg 7.375 rounds to 7.5');

// Case 5: (6.5 + 6.5 + 6.5 + 7.0) / 4 = 6.625 -> 6.5 (between .25 and .75 rounds to .5)
assert.strictEqual(calculateIeltsSpeakingBand(6.5, 6.5, 6.5, 7.0), 6.5, 'Avg 6.625 rounds to 6.5');

// Case 6: (8.0 + 8.5 + 8.5 + 9.0) / 4 = 8.5 -> 8.5
assert.strictEqual(calculateIeltsSpeakingBand(8.0, 8.5, 8.5, 9.0), 8.5, 'Avg 8.5 remains 8.5');

// Criterion Validation
assert.strictEqual(validateSpeakingCriterionScore(6.5).valid, true, '6.5 is valid criterion score');
assert.strictEqual(validateSpeakingCriterionScore(9.0).valid, true, '9.0 is valid criterion score');
assert.strictEqual(validateSpeakingCriterionScore(1.0).valid, true, '1.0 is valid criterion score');
assert.strictEqual(validateSpeakingCriterionScore(6.3).valid, false, '6.3 is rejected (not 0.5 step)');
assert.strictEqual(validateSpeakingCriterionScore(9.5).valid, false, '9.5 is rejected (> 9.0)');
assert.strictEqual(validateSpeakingCriterionScore(0.5).valid, false, '0.5 is rejected (< 1.0)');

console.log('  ✔ Verified official IELTS rounding and criterion calibration.');

// =====================================================================
// CHECK 2: Speaking Content Editor & Version Immutability
// =====================================================================
console.log('CHECK 2: Speaking Content Editor & Version Immutability');

const createdSet = createSpeakingSet(teacherId, {
  title: 'Environmental Conservation & Habitat Restoration',
  part1Topics: [
    {
      id: 'p1_t1',
      topicName: 'Nature and Wildlife',
      questions: ['Do you enjoy spending time in nature?', 'What kind of wild animals are found in your country?'],
    },
  ],
  part2CueCard: {
    id: 'p2_c1',
    topic: 'Describe an environmental project or initiative you know about.',
    preparationTimeSeconds: 60,
    speakingTimeMinutes: 2,
    bulletPoints: ['What the initiative is', 'Who organises it', 'What goals it aims to achieve', 'And explain your opinion of it'],
  },
  part3Discussion: {
    id: 'p3_d1',
    theme: 'Global Ecology and Individual Responsibility',
    discussionQuestions: [
      'What responsibility do individual citizens have to protect endangered species?',
      'Should economic development take priority over environmental preservation?',
    ],
  },
  teacherNotes: 'Version 1 initial draft.',
});

assert.strictEqual(createdSet.set.status, 'draft');
assert.strictEqual(createdSet.set.currentVersionNumber, 1);

// Publish Version 1
publishSpeakingSetVersion(createdSet.set.id, createdSet.version.id);
const pubSet = getSpeakingSetById(createdSet.set.id);
assert.strictEqual(pubSet?.status, 'published');

// Fork new Draft Version 2
const v2 = forkSpeakingDraftVersion(createdSet.set.id);
assert.strictEqual(v2.versionNumber, 2);
assert.strictEqual(v2.status, 'draft');

// Update Draft Version 2
const updatedV2 = updateSpeakingDraftVersion({
  setId: createdSet.set.id,
  versionId: v2.id,
  part1Topics: [
    {
      id: 'p1_t1',
      topicName: 'Nature and Wildlife (Updated)',
      questions: ['Do you often visit national parks?', 'Have you noticed changes in local wildlife?'],
    },
  ],
  part2CueCard: v2.part2CueCard,
  part3Discussion: v2.part3Discussion,
  teacherNotes: 'Updated prompts for spring cohort.',
});
assert.strictEqual(updatedV2.errors.length, 0);

// Publish Version 2: Version 1 should now be archived
publishSpeakingSetVersion(createdSet.set.id, v2.id);
const v1Row = db.prepare('SELECT status FROM speaking_set_versions WHERE id = ?').get(createdSet.version.id) as any;
const v2Row = db.prepare('SELECT status FROM speaking_set_versions WHERE id = ?').get(v2.id) as any;
assert.strictEqual(v1Row.status, 'archived', 'Old published version is archived');
assert.strictEqual(v2Row.status, 'published', 'New version is published');

console.log('  ✔ Speaking set creation, editing, forking, and version immutability verified.');

// =====================================================================
// CHECK 3: Teacher-Led Assessment Draft & Learner Draft Privacy Guard
// =====================================================================
console.log('CHECK 3: Teacher-Led Assessment Draft & Learner Draft Privacy Guard');

const draftAssessment = recordSpeakingAssessment(teacherId, {
  studentId: student1Id,
  sessionType: 'complete_mock',
  partsCovered: ['part1', 'part2', 'part3'],
  sessionDate: '2026-10-10T10:00:00Z',
  status: 'draft',
  setId: createdSet.set.id,
  setVersionId: v2.id,
  criteria: {
    fluencyCoherence: 6.5,
    lexicalResource: 6.0,
    grammaticalRange: 6.5,
    pronunciation: 7.0,
  },
  strengths: 'Very natural hesitation phenomena; strong cohesive discourse markers.',
  improvementPriorities: 'Extend range of complex dependent clauses in Part 3.',
  teacherPrivateNotes: 'CONFIDENTIAL: Student expressed anxiety about Part 3 topic.',
});

assert.strictEqual(draftAssessment.status, 'draft');
assert.strictEqual(draftAssessment.overallBand, 6.5); // (6.5+6.0+6.5+7.0)/4 = 6.5

// Teacher CAN view draft and private notes
const teacherView = getSpeakingAssessmentById(draftAssessment.id, teacherId, 'teacher');
assert.strictEqual(teacherView?.teacherPrivateNotes, 'CONFIDENTIAL: Student expressed anxiety about Part 3 topic.');

// Student CANNOT view draft before release: MUST throw 403 Forbidden
assert.throws(() => {
  getSpeakingAssessmentById(draftAssessment.id, student1Id, 'student');
}, /draft state and has not been released/, 'Student is blocked from accessing draft assessment');

console.log('  ✔ Draft saving, criteria calculation, and student draft privacy guard verified.');

// =====================================================================
// CHECK 4: Assessment Release & Private Notes Scrubbing for Student
// =====================================================================
console.log('CHECK 4: Assessment Release & Private Notes Scrubbing for Student');

const releasedAssessment = releaseSpeakingAssessment(teacherId, draftAssessment.id);
assert.strictEqual(releasedAssessment.status, 'released');

// Student CAN now view released assessment
const studentView = getSpeakingAssessmentById(draftAssessment.id, student1Id, 'student');
assert.ok(studentView, 'Student can view released assessment');
assert.strictEqual(studentView?.overallBand, 6.5);
assert.strictEqual(studentView?.strengths, 'Very natural hesitation phenomena; strong cohesive discourse markers.');
// Private notes MUST be strictly scrubbed for student!
assert.strictEqual(studentView?.teacherPrivateNotes, undefined, 'Teacher private notes stripped for student');

console.log('  ✔ Explicit release and learner view private notes scrubbing verified.');

// =====================================================================
// CHECK 5: Incomplete Criterion Guard for Complete Mock Release
// =====================================================================
console.log('CHECK 5: Incomplete Criterion Guard for Complete Mock Release');

const incompleteAssessment = recordSpeakingAssessment(teacherId, {
  studentId: student2Id,
  sessionType: 'complete_mock',
  partsCovered: ['part1', 'part2', 'part3'],
  sessionDate: '2026-10-10T11:00:00Z',
  status: 'draft',
  customTopic: 'Art, Architecture, and Public Sculptures',
  criteria: {
    fluencyCoherence: 6.0,
    lexicalResource: 6.5,
    // missing grammaticalRange and pronunciation
  },
});

assert.strictEqual(incompleteAssessment.overallBand, undefined, 'Incomplete criteria produces no overall band');

// Attempting to release complete mock without all 4 criteria must be rejected!
assert.throws(() => {
  releaseSpeakingAssessment(teacherId, incompleteAssessment.id);
}, /Cannot release complete mock assessment without all four criterion scores/, 'Release rejected without 4 criteria');

console.log('  ✔ Complete mock incomplete criteria release guard verified.');

// =====================================================================
// CHECK 6: Partial Practice Isolation (No Overall Band / Labelled Partial)
// =====================================================================
console.log('CHECK 6: Partial Practice Isolation (No Overall Band / Labelled Partial)');

const partialAssessment = recordSpeakingAssessment(teacherId, {
  studentId: student2Id,
  sessionType: 'partial_practice',
  partsCovered: ['part2'],
  sessionDate: '2026-10-10T12:00:00Z',
  status: 'released',
  customTopic: 'Part 2 Cue Card Diagnostic Only',
  criteria: {
    fluencyCoherence: 7.0,
    lexicalResource: 7.0,
    grammaticalRange: 6.5,
    pronunciation: 7.0,
  },
  partComments: {
    part2: 'Spoke smoothly for 1 minute 50 seconds. Good timing.',
  },
  strengths: 'Strong narrative pace in Part 2.',
});

assert.strictEqual(partialAssessment.sessionType, 'partial_practice');
// Invariant: Partial practice NEVER calculates an overall band!
assert.strictEqual(partialAssessment.overallBand, undefined, 'Partial practice produces no overall band');

const studentPartialView = getSpeakingAssessmentById(partialAssessment.id, student2Id, 'student');
assert.strictEqual(studentPartialView?.sessionType, 'partial_practice');
assert.strictEqual(studentPartialView?.overallBand, undefined);

console.log('  ✔ Partial practice correctly isolated without overall band.');

// =====================================================================
// CHECK 7: Transparent Score Corrections & Audit History
// =====================================================================
console.log('CHECK 7: Transparent Score Corrections & Audit History');

// Released assessment has (FC: 6.5, LR: 6.0, GRA: 6.5, P: 7.0) -> 6.5
// Teacher corrects LR from 6.0 to 7.0 upon review of recorded notes
// New mean: (6.5 + 7.0 + 6.5 + 7.0) / 4 = 6.75 -> 7.0
const corrected = correctReleasedSpeakingScores(teacherId, draftAssessment.id, {
  updatedScores: {
    fluencyCoherence: 6.5,
    lexicalResource: 7.0,
    grammaticalRange: 6.5,
    pronunciation: 7.0,
  },
  reason: 'Second listening to notes confirmed candidate used advanced idiomatic travel vocabulary (e.g., "off the beaten track", "unspoilt landscape") appropriately.',
});

assert.strictEqual(corrected.overallBand, 7.0, 'Recalculated band from 6.75 is 7.0');
assert.strictEqual(corrected.criteria?.lexicalResource, 7.0);

// Verify audit history is present
const auditAssessment = getSpeakingAssessmentById(draftAssessment.id, teacherId, 'teacher');
assert.ok(auditAssessment?.corrections && auditAssessment.corrections.length >= 1, 'Audit trail recorded');
const latestCorrection = auditAssessment!.corrections![0];
assert.strictEqual(latestCorrection.previousScores.lexicalResource, 6.0);
assert.strictEqual(latestCorrection.previousScores.overallBand, 6.5);
assert.strictEqual(latestCorrection.updatedScores.lexicalResource, 7.0);
assert.strictEqual(latestCorrection.updatedScores.overallBand, 7.0);
assert.ok(latestCorrection.reason.includes('idiomatic travel vocabulary'));

console.log('  ✔ Score correction and transparent audit history verified.');

// =====================================================================
// CHECK 8: Audio Recording Optionality & Disclosure Retention Policy
// =====================================================================
console.log('CHECK 8: Audio Recording Optionality & Disclosure Retention Policy');

// Score without audio recording
const noAudioAssessment = recordSpeakingAssessment(teacherId, {
  studentId: student1Id,
  sessionType: 'complete_mock',
  partsCovered: ['part1', 'part2', 'part3'],
  sessionDate: '2026-10-11T09:00:00Z',
  status: 'released',
  customTopic: 'Teacher Own Questions: Transportation & Urban Mobility',
  criteria: {
    fluencyCoherence: 7.0,
    lexicalResource: 7.0,
    grammaticalRange: 7.0,
    pronunciation: 7.0,
  },
  recordingUrl: undefined, // no audio
  recordingRetentionAcknowledged: false,
});
assert.strictEqual(noAudioAssessment.recordingUrl, undefined);
assert.strictEqual(noAudioAssessment.overallBand, 7.0);

// Score WITH optional audio recording and retention acknowledgement
const withAudioAssessment = recordSpeakingAssessment(teacherId, {
  studentId: student2Id,
  sessionType: 'complete_mock',
  partsCovered: ['part1', 'part2', 'part3'],
  sessionDate: '2026-10-11T10:00:00Z',
  status: 'released',
  customTopic: 'Teacher Own Questions: Literature & Reading Habits',
  criteria: {
    fluencyCoherence: 6.0,
    lexicalResource: 6.0,
    grammaticalRange: 6.0,
    pronunciation: 6.0,
  },
  recordingUrl: '/audio/speaking_mock_student2_20261011.mp3',
  recordingRetentionAcknowledged: true,
});
assert.strictEqual(withAudioAssessment.recordingUrl, '/audio/speaking_mock_student2_20261011.mp3');
assert.strictEqual(withAudioAssessment.recordingRetentionAcknowledged, true);

console.log('  ✔ Audio recording optionality and retention policy acknowledgement verified.');

// =====================================================================
// CHECK 9: Pre/Post Test Journey Integration & Speaking Delta
// =====================================================================
console.log('CHECK 9: Pre/Post Test Journey Integration & Speaking Delta');

// Create class and enrol student1
const testClass = createClass(teacherId, {
  title: 'IELTS Speaking Masterclass - Pre/Post Cohort',
  testType: 'academic',
  description: 'Cohort testing Speaking progression.',
});
enrolStudentByEmail(teacherId, testClass.id, student1Email, false);

// Create Pre-Test Package with Speaking Set
const prePackage = createTestPackage(teacherId, {
  title: 'Diagnostic Pre-Test Package with Speaking',
  packageType: 'pre_test',
  testType: 'academic',
  speakingSetId: createdSet.set.id,
  speakingSetVersionId: v2.id,
});
assert.strictEqual(prePackage.speakingStatus, 'configured');

// Create Post-Test Package with Speaking Set
const postPackage = createTestPackage(teacherId, {
  title: 'Exit Post-Test Package with Speaking',
  packageType: 'post_test',
  testType: 'academic',
  speakingSetId: createdSet.set.id,
  speakingSetVersionId: v2.id,
});

// Create Pre-Test and Post-Test Assignments
const preAssignment = createAssignment(teacherId, testClass.id, {
  title: 'Cohort Diagnostic Pre-Test',
  purpose: 'pre_test',
  packageId: prePackage.id,
  isReleased: true,
});

const postAssignment = createAssignment(teacherId, testClass.id, {
  title: 'Cohort Exit Post-Test',
  purpose: 'post_test',
  packageId: postPackage.id,
  isReleased: true,
});

// Record Pre-Test Speaking Assessment: Overall Band 6.0
recordSpeakingAssessment(teacherId, {
  studentId: student1Id,
  classId: testClass.id,
  assignmentId: preAssignment.assignment.id,
  setId: createdSet.set.id,
  setVersionId: v2.id,
  sessionType: 'complete_mock',
  partsCovered: ['part1', 'part2', 'part3'],
  sessionDate: '2026-09-01T10:00:00Z',
  status: 'released',
  criteria: {
    fluencyCoherence: 6.0,
    lexicalResource: 6.0,
    grammaticalRange: 6.0,
    pronunciation: 6.0,
  },
});

// Record Post-Test Speaking Assessment: Overall Band 7.0
recordSpeakingAssessment(teacherId, {
  studentId: student1Id,
  classId: testClass.id,
  assignmentId: postAssignment.assignment.id,
  setId: createdSet.set.id,
  setVersionId: v2.id,
  sessionType: 'complete_mock',
  partsCovered: ['part1', 'part2', 'part3'],
  sessionDate: '2026-10-12T10:00:00Z',
  status: 'released',
  criteria: {
    fluencyCoherence: 7.0,
    lexicalResource: 7.0,
    grammaticalRange: 7.0,
    pronunciation: 7.0,
  },
});

// Retrieve Pre/Post Comparison Report
const report = getPrePostComparison(testClass.id, student1Id, teacherId, 'teacher');
assert.strictEqual(report.preTest.skills.speaking.status, 'completed');
assert.strictEqual(report.preTest.skills.speaking.bandScore, 6.0);
assert.strictEqual(report.preTest.skills.speaking.assessor, 'Teacher assessment');

assert.strictEqual(report.postTest.skills.speaking.status, 'completed');
assert.strictEqual(report.postTest.skills.speaking.bandScore, 7.0);

// Speaking Band Delta must be 7.0 - 6.0 = +1.0
assert.strictEqual(report.deltas.speakingBandDelta, 1.0, 'Speaking band delta is +1.0');

console.log('  ✔ Pre/Post journey Speaking integration and band delta calculation verified.');

// =====================================================================
// CHECK 10: Teacher Queue & Student Assessment List
// =====================================================================
console.log('CHECK 10: Teacher Queue & Student Assessment List');

const teacherQueue = listTeacherAssessmentQueue(teacherId);
assert.ok(teacherQueue.length >= 3, 'Teacher queue lists created assessments');

const studentAssessments = listStudentSpeakingAssessments(student1Id);
assert.ok(studentAssessments.length >= 2, 'Student lists released assessments');
// All student assessments must be released
for (const a of studentAssessments) {
  assert.strictEqual(a.status, 'released');
}

console.log('  ✔ Teacher assessment queue and student assessment list verified.');

console.log('\n======================================================');
console.log('  ALL 10 SPEAKING VERIFICATION CHECKS PASSED (100%)!  ');
console.log('======================================================\n');
