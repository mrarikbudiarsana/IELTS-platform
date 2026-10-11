import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config();

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { db, initDatabase } from './db';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  generateResetToken,
  authMiddleware,
  requireRole,
  AuthenticatedRequest,
  mapUserRow,
  TEACHER_SETUP_SECRET,
} from './auth';
import {
  createReadingTest,
  updateDraftVersion,
  forkNewDraftVersion,
  publishTestVersion,
  archiveTest,
  getTestById,
  listTests,
  getVersionById,
  sanitizeQuestionsForStudent,
} from './readingService';
import {
  startOrResumeAttempt,
  saveStudentAnswer,
  submitAttempt,
  getAttemptById,
  listUserAttempts,
} from './attemptService';
import {
  createListeningTest,
  updateListeningDraftVersion,
  forkNewListeningDraftVersion,
  publishListeningTestVersion,
  archiveListeningTest,
  getListeningTestById,
  listListeningTests,
  getListeningVersionById,
  sanitizeListeningForStudent,
} from './listeningService';
import {
  startOrResumeListeningAttempt,
  saveListeningAnswer,
  recordListeningInterruption,
  submitListeningAttempt,
  getListeningAttemptById,
  listUserListeningAttempts,
} from './listeningAttemptService';
import { seedDatabase } from './seed';
import { seedListeningDatabase } from './listeningSeed';
import { seedClassDatabase } from './classSeed';
import { ingestCambridge21Test1 } from './ingestCambridge21Test1';
import { ingestCambridge21Test2 } from './ingestCambridge21Test2';
import { ingestCambridge21Test4 } from './ingestCambridge21Test4';
import { ingestCambridge21ListeningTest1 } from './ingestCambridge21ListeningTest1';
import { ingestCambridge21ListeningTest2 } from './ingestCambridge21ListeningTest2';
import { ingestCambridge21ListeningTest3 } from './ingestCambridge21ListeningTest3';
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
} from './classService';
import {
  createTestPackage,
  getTestPackageById,
  listTestPackages,
  createAssignment,
  releasePostTestAssignment,
  getAssignmentById,
  listClassAssignments,
  startOrResumePackageAttempt,
  getPackageAttemptById,
  getPrePostComparison,
  getClassOverview,
} from './assignmentService';
import { seedSpeakingDatabase } from './speakingSeed';
import {
  createSpeakingSet,
  updateSpeakingDraftVersion,
  publishSpeakingSetVersion,
  forkSpeakingDraftVersion,
  archiveSpeakingSet,
  getSpeakingSetById,
  getSpeakingSetVersionById,
  listSpeakingSets,
  recordSpeakingAssessment,
  releaseSpeakingAssessment,
  correctReleasedSpeakingScores,
  getSpeakingAssessmentById,
  listTeacherAssessmentQueue,
  listStudentSpeakingAssessments,
} from './speakingService';
import {
  runVoiceTrial,
  mintRealtimeSessionToken,
  startOrRecoverSpeakingSession,
  getSpeakingSessionById,
  advanceSessionStage,
  savePart2ScratchpadNotes,
  submitCandidateTurn,
  finishAndAssessSpeakingSession,
  abandonSpeakingSession,
} from './aiSpeakingService';
import {
  getUserSpeakingAllowanceBalance,
  grantSpeakingAllowance,
} from './speakingAllowanceService';
import { seedWritingData } from './writingSeed';
import {
  createWritingTask,
  updateWritingTaskDraft,
  publishWritingTask,
  forkWritingTaskVersion,
  archiveWritingTask,
  getWritingTaskById,
  listWritingTasks,
  startOrResumeWritingAttempt,
  saveWritingDraftResponse,
  submitWritingAttempt,
  createResponseRevision,
  getWritingAttemptById,
  listUserWritingAttempts,
  getWritingResponseById,
} from './writingService';
import { requestAiWritingAssessment } from './aiWritingService';
import {
  getUserAllowanceBalance,
  listAllowanceLedger,
  grantTestingAllowance,
} from './allowanceService';
import { ClassTestType } from '../shared/types';
import { seedCommercialProductsAndCodes } from './commercialSeed';
import {
  createProduct,
  updateProduct,
  publishProduct,
  archiveProduct,
  listProducts,
  getProductById,
  getCheckoutPreview,
  createOrder,
  getOrderById,
  listUserOrders,
  processPaymentWebhook,
  reconcileOrder,
  refundOrder,
  createTeacherCode,
  updateTeacherCode,
  revokeTeacherCode,
  listTeacherCodes,
  previewTeacherCode,
  redeemTeacherCode,
  getUserCommercialSummary,
  getAdminCommercialSummary,
  adjustUserBalance,
  canUserAccessTest,
} from './commercialService';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure public diagrams directory exists
const diagramsDir = path.resolve(__dirname, '../public/diagrams');
if (!fs.existsSync(diagramsDir)) {
  fs.mkdirSync(diagramsDir, { recursive: true });
}

// Serve static assets (diagrams, audio, etc.)
app.use(express.static(path.resolve(__dirname, '../public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', milestones: ['reading', 'listening', 'classes', 'speaking', 'writing'] });
});

// -------------------------------------------------------------
// AUTHENTICATION & ACCOUNTS ENDPOINTS
// -------------------------------------------------------------

// Public registration (STRICTLY assigns 'student' role only)
app.post('/api/auth/register', (req, res) => {
  const { email, password, fullName, testTypePreference, targetBand, testDate } = req.body;

  if (!email || !password || !fullName) {
    res.status(400).json({ error: 'Email, password, and full name are required' });
    return;
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists' });
    return;
  }

  const userId = uuidv4();
  const passwordHash = hashPassword(password);
  const normalizedEmail = email.toLowerCase().trim();
  const cleanTestType = ['academic', 'general', 'not_sure'].includes(testTypePreference)
    ? testTypePreference
    : 'not_sure';

  // Enforcement: Public registration CANNOT set role to teacher or admin
  const assignedRole = 'student';

  db.prepare(`
    INSERT INTO users (
      id, email, password_hash, full_name, role,
      test_type_preference, target_band, test_date, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    userId,
    normalizedEmail,
    passwordHash,
    fullName.trim(),
    assignedRole,
    cleanTestType,
    targetBand || null,
    testDate || null
  );

  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const user = mapUserRow(row);
  const token = generateToken(user);

  res.status(201).json({ user, token });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim()) as any;
  if (!row) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  if (!verifyPassword(password, row.password_hash)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const user = mapUserRow(row);
  const token = generateToken(user);

  res.json({ user, token });
});

// Current user profile
app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

// Update user profile (target band, test date, preference)
app.patch('/api/auth/profile', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { targetBand, testDate, testTypePreference } = req.body;
  const updates: string[] = [];
  const params: any[] = [];

  if (targetBand !== undefined) {
    updates.push('target_band = ?');
    params.push(targetBand === null || targetBand === '' ? null : Number(targetBand));
  }
  if (testDate !== undefined) {
    updates.push('test_date = ?');
    params.push(testDate === null || testDate === '' ? null : String(testDate));
  }
  if (testTypePreference !== undefined) {
    updates.push('test_type_preference = ?');
    params.push(String(testTypePreference));
  }

  if (updates.length > 0) {
    params.push(req.user!.id);
    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }

  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user!.id);
  const user = mapUserRow(row);
  res.json({ user });
});

// Request password reset token
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const row = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim()) as any;
  if (!row) {
    // Return generic success to prevent email enumeration
    res.json({ message: 'If an account exists, a recovery token has been generated.' });
    return;
  }

  const { token, expiresAt } = generateResetToken();
  db.prepare(`
    UPDATE users
    SET reset_token = ?, reset_token_expires = ?
    WHERE id = ?
  `).run(token, expiresAt, row.id);

  // In production, send email. In development/pilot, return token for verification
  res.json({
    message: 'Recovery token generated successfully',
    resetToken: token,
    expiresAt,
  });
});

// Reset password with token
app.post('/api/auth/reset-password', (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) {
    res.status(400).json({ error: 'Reset token and new password are required' });
    return;
  }

  const row = db
    .prepare('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > datetime(\'now\')')
    .get(resetToken) as any;

  if (!row) {
    res.status(400).json({ error: 'Invalid or expired password reset token' });
    return;
  }

  const newHash = hashPassword(newPassword);
  db.prepare(`
    UPDATE users
    SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL
    WHERE id = ?
  `).run(newHash, row.id);

  res.json({ message: 'Password has been reset successfully. Please log in with your new password.' });
});

// Protected privilege elevation: Grants teacher or admin rights via server secret or admin action
app.post('/api/auth/elevate', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { secretKey, targetRole } = req.body;
  if (!['teacher', 'admin'].includes(targetRole)) {
    res.status(400).json({ error: 'Target role must be teacher or admin' });
    return;
  }

  // Check if caller is already an admin OR provided the correct protected server setup key
  const isSuperAdmin = req.user?.role === 'admin';
  const providedValidSecret = secretKey && secretKey === TEACHER_SETUP_SECRET;

  if (!isSuperAdmin && !providedValidSecret) {
    res.status(403).json({ error: 'Invalid authorization or setup secret for role elevation' });
    return;
  }

  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(targetRole, req.user!.id);

  // Audit log
  db.prepare(`
    INSERT INTO audit_logs (id, user_id, action, target_type, target_id, details_json, created_at)
    VALUES (?, ?, 'ROLE_ELEVATED', 'user', ?, ?, datetime('now'))
  `).run(uuidv4(), req.user!.id, req.user!.id, JSON.stringify({ newRole: targetRole, bySecret: !isSuperAdmin }));

  const updatedRow = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user!.id);
  const updatedUser = mapUserRow(updatedRow);
  const token = generateToken(updatedUser);

  res.json({
    message: `Account successfully elevated to ${targetRole}`,
    user: updatedUser,
    token,
  });
});

// -------------------------------------------------------------
// READING TESTS & CONTENT MANAGEMENT
// -------------------------------------------------------------

// List reading tests
app.get('/api/reading/tests', authMiddleware, (req: AuthenticatedRequest, res) => {
  const isTeacherOrAdmin = req.user!.role === 'teacher' || req.user!.role === 'admin';
  const testType = req.query.testType as any;
  const category = req.query.category as any;

  const tests = listTests({ isTeacherOrAdmin, testType, category });
  res.json({ tests });
});

// Get test details (For teacher: includes answer keys. For student: scrubs answers if active)
app.get('/api/reading/tests/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const test = getTestById(req.params.id);
  if (!test) {
    res.status(404).json({ error: 'Test not found' });
    return;
  }

  const isTeacherOrAdmin = req.user!.role === 'teacher' || req.user!.role === 'admin';
  if (!isTeacherOrAdmin && test.status !== 'published') {
    res.status(403).json({ error: 'Access forbidden: test is not published' });
    return;
  }

  const version = getVersionById(test.latestVersionId);
  if (!version) {
    res.status(404).json({ error: 'Test version not found' });
    return;
  }

  // If student is browsing, scrub answer keys
  let returnedVersion = version;
  if (!isTeacherOrAdmin) {
    returnedVersion = {
      ...version,
      questionGroups: sanitizeQuestionsForStudent(version.questionGroups),
    };
  }

  res.json({ test, version: returnedVersion });
});

// Create new draft test (Teacher/Admin only)
app.post('/api/reading/tests', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  const { title, testType, category, timeLimitMinutes, passages, questionGroups } = req.body;

  if (!title || !testType || !category) {
    res.status(400).json({ error: 'Title, testType, and category are required' });
    return;
  }

  const result = createReadingTest({
    title,
    testType,
    category,
    timeLimitMinutes,
    createdById: req.user!.id,
    passages: passages || [],
    questionGroups: questionGroups || [],
  });

  res.status(201).json(result);
});

// Update draft test version (Teacher/Admin only)
app.put('/api/reading/tests/:id/versions/:versionId', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const { title, passages, questionGroups, timeLimitMinutes } = req.body;
    const result = updateDraftVersion({
      testId: req.params.id,
      versionId: req.params.versionId,
      title,
      passages,
      questionGroups,
      timeLimitMinutes,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Fork new draft version from published test (Teacher/Admin only)
app.post('/api/reading/tests/:id/fork', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const newVersion = forkNewDraftVersion(req.params.id);
    res.json({ message: 'New draft version created', version: newVersion });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Publish test version (Teacher/Admin only)
app.post('/api/reading/tests/:id/versions/:versionId/publish', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    publishTestVersion(req.params.id, req.params.versionId);
    res.json({ message: 'Test version published successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Archive test (Teacher/Admin only)
app.post('/api/reading/tests/:id/archive', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  archiveTest(req.params.id);
  res.json({ message: 'Test archived successfully' });
});

// -------------------------------------------------------------
// STUDENT TEST ATTEMPTS & TEST RUNNER
// -------------------------------------------------------------

// Start or resume test attempt
app.post('/api/reading/tests/:id/start', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const modeOverride = req.body.modeOverride;
    const result = startOrResumeAttempt({
      userId: req.user!.id,
      testId: req.params.id,
      modeOverride,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Autosave student answer
app.post('/api/attempts/:id/save', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const { questionNumber, questionId, userAnswer, isFlagged } = req.body;
    if (questionNumber === undefined || !questionId) {
      res.status(400).json({ error: 'questionNumber and questionId are required' });
      return;
    }

    const result = saveStudentAnswer({
      attemptId: req.params.id,
      userId: req.user!.id,
      questionNumber: Number(questionNumber),
      questionId,
      userAnswer,
      isFlagged,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Submit attempt
app.post('/api/attempts/:id/submit', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const result = submitAttempt({
      attemptId: req.params.id,
      userId: req.user!.id,
    });
    res.json({ attempt: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get single attempt details (Learner data isolation enforced)
app.get('/api/attempts/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const isTeacherOrAdmin = req.user!.role === 'teacher' || req.user!.role === 'admin';

  let attempt = getAttemptById(req.params.id, req.user!.id);

  // If teacher/admin, allow inspecting student's submitted attempt
  if (!attempt && isTeacherOrAdmin) {
    const row = db.prepare('SELECT user_id FROM reading_attempts WHERE id = ?').get(req.params.id) as any;
    if (row) {
      attempt = getAttemptById(req.params.id, row.user_id);
    }
  }

  if (!attempt) {
    res.status(404).json({ error: 'Attempt not found or access forbidden' });
    return;
  }

  // Also fetch the test version to render questions
  const version = getVersionById(attempt.versionId);

  // If in progress, scrub questions!
  let renderedVersion = version;
  if (attempt.status === 'in_progress' && version) {
    renderedVersion = {
      ...version,
      questionGroups: sanitizeQuestionsForStudent(version.questionGroups),
    };
  }

  res.json({ attempt, testVersion: renderedVersion });
});

// List student's past attempts
app.get('/api/attempts', authMiddleware, (req: AuthenticatedRequest, res) => {
  const attempts = listUserAttempts(req.user!.id);
  res.json({ attempts });
});

// -------------------------------------------------------------
// ADMIN & TEACHER REVIEW
// -------------------------------------------------------------

// List all users (Admin only)
app.get('/api/admin/users', authMiddleware, requireRole('admin'), (_req, res) => {
  const rows = db.prepare('SELECT id, email, full_name, role, test_type_preference, created_at FROM users ORDER BY created_at DESC').all();
  res.json({ users: rows });
});

// Promote/modify user role (Admin only)
app.post('/api/admin/users/:id/role', authMiddleware, requireRole('admin'), (req: AuthenticatedRequest, res) => {
  const { role } = req.body;
  if (!['student', 'teacher', 'admin'].includes(role)) {
    res.status(400).json({ error: 'Invalid role specified' });
    return;
  }

  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);

  db.prepare(`
    INSERT INTO audit_logs (id, user_id, action, target_type, target_id, details_json, created_at)
    VALUES (?, ?, 'ADMIN_ROLE_CHANGE', 'user', ?, ?, datetime('now'))
  `).run(uuidv4(), req.user!.id, req.params.id, JSON.stringify({ newRole: role }));

  res.json({ message: `Role updated to ${role} successfully` });
});

// List student submitted reading attempts for teacher review (Teacher/Admin only)
app.get('/api/teacher/attempts', authMiddleware, requireRole('teacher', 'admin'), (_req, res) => {
  const rows = db
    .prepare(`
      SELECT a.*, u.full_name as student_name, u.email as student_email
      FROM reading_attempts a
      JOIN users u ON a.user_id = u.id
      WHERE a.status IN ('submitted', 'expired')
      ORDER BY a.submitted_at DESC
      LIMIT 100
    `)
    .all() as any[];

  res.json({ attempts: rows });
});

// -------------------------------------------------------------
// LISTENING TESTS & CONTENT MANAGEMENT
// -------------------------------------------------------------
app.get('/api/listening/tests', authMiddleware, (req: AuthenticatedRequest, res) => {
  const isTeacherOrAdmin = req.user!.role === 'teacher' || req.user!.role === 'admin';
  const category = req.query.category as any;
  const tests = listListeningTests({ isTeacherOrAdmin, category });
  res.json({ tests });
});

app.get('/api/listening/tests/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const test = getListeningTestById(req.params.id);
  if (!test) {
    res.status(404).json({ error: 'Listening test not found' });
    return;
  }
  const isTeacherOrAdmin = req.user!.role === 'teacher' || req.user!.role === 'admin';
  if (!isTeacherOrAdmin && test.status !== 'published') {
    res.status(403).json({ error: 'Access forbidden: test is not published' });
    return;
  }
  const version = getListeningVersionById(test.latestVersionId);
  if (!version) {
    res.status(404).json({ error: 'Test version not found' });
    return;
  }
  let returnedVersion = version;
  if (!isTeacherOrAdmin) {
    const sanitized = sanitizeListeningForStudent(version.questionGroups, version.parts);
    returnedVersion = {
      ...version,
      questionGroups: sanitized.questionGroups,
      parts: sanitized.parts,
    };
  }
  res.json({ test, version: returnedVersion });
});

app.post('/api/listening/tests', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  const { title, category, audioMode, timeLimitMinutes, parts, questionGroups, audioConfig } = req.body;
  if (!title || !category) {
    res.status(400).json({ error: 'Title and category are required' });
    return;
  }
  const result = createListeningTest({
    title,
    category,
    audioMode,
    timeLimitMinutes,
    createdById: req.user!.id,
    parts: parts || [],
    questionGroups: questionGroups || [],
    audioConfig,
  });
  res.status(201).json(result);
});

app.put('/api/listening/tests/:id/versions/:versionId', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const { title, parts, questionGroups, audioConfig, timeLimitMinutes } = req.body;
    const result = updateListeningDraftVersion({
      testId: req.params.id,
      versionId: req.params.versionId,
      title,
      parts,
      questionGroups,
      audioConfig,
      timeLimitMinutes,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/listening/tests/:id/fork', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const newVersion = forkNewListeningDraftVersion(req.params.id);
    res.json({ message: 'New draft version created', version: newVersion });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/listening/tests/:id/versions/:versionId/publish', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    publishListeningTestVersion(req.params.id, req.params.versionId);
    res.json({ message: 'Listening test version published successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/listening/tests/:id/archive', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  archiveListeningTest(req.params.id);
  res.json({ message: 'Listening test archived successfully' });
});

// -------------------------------------------------------------
// STUDENT LISTENING TEST ATTEMPTS & TEST RUNNER
// -------------------------------------------------------------
app.post('/api/listening/tests/:id/start', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const modeOverride = req.body.modeOverride;
    const result = startOrResumeListeningAttempt({
      userId: req.user!.id,
      testId: req.params.id,
      modeOverride,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/listening/attempts/:id/save', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const { questionNumber, questionId, userAnswer, isFlagged } = req.body;
    if (questionNumber === undefined || !questionId) {
      res.status(400).json({ error: 'questionNumber and questionId are required' });
      return;
    }
    const result = saveListeningAnswer({
      attemptId: req.params.id,
      userId: req.user!.id,
      questionNumber: Number(questionNumber),
      questionId,
      userAnswer,
      isFlagged,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/listening/attempts/:id/interruption', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { type, detail, didReplay } = req.body;
  const result = recordListeningInterruption({
    attemptId: req.params.id,
    userId: req.user!.id,
    type: type || 'audio_error',
    detail,
    didReplay,
  });
  res.json(result);
});

app.post('/api/listening/attempts/:id/submit', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const result = submitListeningAttempt({
      attemptId: req.params.id,
      userId: req.user!.id,
    });
    res.json({ attempt: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/listening/attempts/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const isTeacherOrAdmin = req.user!.role === 'teacher' || req.user!.role === 'admin';
  let attempt = getListeningAttemptById(req.params.id, req.user!.id);
  if (!attempt && isTeacherOrAdmin) {
    const row = db.prepare('SELECT user_id FROM listening_attempts WHERE id = ?').get(req.params.id) as any;
    if (row) {
      attempt = getListeningAttemptById(req.params.id, row.user_id);
    }
  }
  if (!attempt) {
    res.status(404).json({ error: 'Attempt not found or access forbidden' });
    return;
  }
  const version = getListeningVersionById(attempt.versionId);
  let renderedVersion = version;
  if (attempt.status === 'in_progress' && version) {
    const sanitized = sanitizeListeningForStudent(version.questionGroups, version.parts);
    renderedVersion = {
      ...version,
      questionGroups: sanitized.questionGroups,
      parts: sanitized.parts,
    };
  }
  res.json({ attempt, testVersion: renderedVersion });
});

app.get('/api/listening/attempts', authMiddleware, (req: AuthenticatedRequest, res) => {
  const attempts = listUserListeningAttempts(req.user!.id);
  res.json({ attempts });
});

app.get('/api/teacher/listening-attempts', authMiddleware, requireRole('teacher', 'admin'), (_req, res) => {
  const rows = db
    .prepare(`
      SELECT a.*, u.full_name as student_name, u.email as student_email
      FROM listening_attempts a
      JOIN users u ON a.user_id = u.id
      WHERE a.status IN ('submitted', 'expired')
      ORDER BY a.submitted_at DESC
      LIMIT 100
    `)
    .all() as any[];
  res.json({ attempts: rows });
});

// -------------------------------------------------------------
// MILESTONE 3: CLASSES, PACKAGES, ASSIGNMENTS & COMPARISON
// -------------------------------------------------------------

// --- Classes ---
// GET /api/classes - lists teacher's classes if teacher/admin, or enrolled classes if student
app.get('/api/classes', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    if (req.user!.role === 'teacher' || req.user!.role === 'admin') {
      const classes = listTeacherClasses(req.user!.id, req.user!.role === 'admin');
      res.json({ classes });
    } else {
      const classes = listStudentClasses(req.user!.id);
      res.json({ classes });
    }
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/classes - create a new class (teachers/admins)
app.post('/api/classes', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const newClass = createClass(req.user!.id, req.body);
    res.status(201).json({ class: newClass });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/classes/:id - get class details
app.get('/api/classes/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const classItem = getClassById(req.params.id);
    // Student can only access if enrolled
    if (req.user!.role === 'student' && !isStudentInClass(req.params.id, req.user!.id)) {
      res.status(403).json({ error: 'You are not enrolled in this class.' });
      return;
    }
    // Teacher can only view if owns class or is admin
    if (req.user!.role === 'teacher' && classItem.teacherId !== req.user!.id) {
      res.status(403).json({ error: 'You do not have access to this class.' });
      return;
    }
    res.json({ class: classItem });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// PUT /api/classes/:id - update class
app.put('/api/classes/:id', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const updated = updateClass(req.params.id, req.user!.id, req.body, req.user!.role === 'admin');
    res.json({ class: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/classes/join - student joins via invitation code
app.post('/api/classes/join', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const { invitationCode } = req.body;
    if (!invitationCode) {
      res.status(400).json({ error: 'Invitation code is required.' });
      return;
    }
    const joinedClass = enrolStudentByCode(req.user!.id, invitationCode);
    res.json({ class: joinedClass, message: `Successfully enrolled in ${joinedClass.title}` });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/classes/:id/enrol - teacher enrols student by email
app.post('/api/classes/:id/enrol', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Student email is required.' });
      return;
    }
    const enrolment = enrolStudentByEmail(req.user!.id, req.params.id, email, req.user!.role === 'admin');
    res.status(201).json({ enrolment, message: 'Student successfully enrolled.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/classes/:id/enrolments/:studentId - teacher removes student
app.delete('/api/classes/:id/enrolments/:studentId', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    removeStudentFromClass(req.user!.id, req.params.id, req.params.studentId, req.user!.role === 'admin');
    res.json({ message: 'Student removed from class. Historical attempts preserved.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/classes/:id/enrolments - list roster
app.get('/api/classes/:id/enrolments', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const enrolments = listClassEnrolments(req.user!.id, req.params.id, req.user!.role === 'admin');
    res.json({ enrolments });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/classes/:id/overview - class analytics & overview
app.get('/api/classes/:id/overview', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const overview = getClassOverview(req.params.id, req.user!.id, req.user!.role === 'admin');
    res.json(overview);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- Test Packages ---
// POST /api/test-packages - create test package
app.post('/api/test-packages', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const pkg = createTestPackage(req.user!.id, req.body);
    res.status(201).json({ testPackage: pkg });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/test-packages - list test packages
app.get('/api/test-packages', authMiddleware, (req, res) => {
  try {
    const packages = listTestPackages(req.query.testType as any);
    res.json({ testPackages: packages });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/test-packages/:id - get package by id
app.get('/api/test-packages/:id', authMiddleware, (req, res) => {
  try {
    const pkg = getTestPackageById(req.params.id);
    res.json({ testPackage: pkg });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// --- Assignments ---
// POST /api/classes/:id/assignments - create assignment
app.post('/api/classes/:id/assignments', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const { assignment, warning } = createAssignment(req.user!.id, req.params.id, req.body, req.user!.role === 'admin');
    res.status(201).json({ assignment, warning });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/classes/:id/assignments - list assignments for class
app.get('/api/classes/:id/assignments', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const assignments = listClassAssignments(req.params.id, req.user!.id, req.user!.role);
    res.json({ assignments });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/assignments/:id - get single assignment
app.get('/api/assignments/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const assignment = getAssignmentById(req.params.id, req.user!.id);
    res.json({ assignment });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// POST /api/assignments/:id/release - explicit teacher release of post-test
app.post('/api/assignments/:id/release', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const assignment = releasePostTestAssignment(req.user!.id, req.params.id, req.user!.role === 'admin');
    res.json({ assignment, message: 'Post-test successfully released to class students.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/assignments/:id/start-package - start or resume package attempt
app.post('/api/assignments/:id/start-package', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const { mode } = req.body;
    const result = startOrResumePackageAttempt(req.params.id, req.user!.id, mode);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/package-attempts/:id - get package attempt
app.get('/api/package-attempts/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const attempt = getPackageAttemptById(req.params.id, req.user!.id, req.user!.role === 'teacher' || req.user!.role === 'admin');
    res.json({ packageAttempt: attempt });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/classes/:classId/students/:studentId/comparison - pre/post diagnostic comparison report
app.get('/api/classes/:classId/students/:studentId/comparison', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const report = getPrePostComparison(req.params.classId, req.params.studentId, req.user!.id, req.user!.role);
    res.json({ report });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// SPEAKING ASSESSMENT & CONTENT EDITOR ROUTES
// -------------------------------------------------------------

// POST /api/speaking/sets - create speaking set
app.post('/api/speaking/sets', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const result = createSpeakingSet(req.user!.id, req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/speaking/sets - list speaking sets
app.get('/api/speaking/sets', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const sets = listSpeakingSets(req.user!.role, {
      status: req.query.status as any,
      includeArchived: req.query.includeArchived === 'true',
    });
    res.json({ sets });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/speaking/sets/:id - get single speaking set
app.get('/api/speaking/sets/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const set = getSpeakingSetById(req.params.id);
    if (!set) {
      res.status(404).json({ error: 'Speaking set not found' });
      return;
    }
    res.json({ set });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/speaking/sets/:id/versions/:versionId - get specific speaking version
app.get('/api/speaking/sets/:id/versions/:versionId', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const version = getSpeakingSetVersionById(req.params.versionId);
    if (!version) {
      res.status(404).json({ error: 'Speaking set version not found' });
      return;
    }
    res.json({ version });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/speaking/sets/:id/versions/:versionId - update draft version
app.put('/api/speaking/sets/:id/versions/:versionId', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const result = updateSpeakingDraftVersion({
      setId: req.params.id,
      versionId: req.params.versionId,
      ...req.body,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/speaking/sets/:id/publish - publish version
app.post('/api/speaking/sets/:id/publish', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const { versionId } = req.body;
    if (!versionId) {
      res.status(400).json({ error: 'versionId is required' });
      return;
    }
    publishSpeakingSetVersion(req.params.id, versionId);
    res.json({ message: 'Speaking set version published successfully.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/speaking/sets/:id/fork - fork new draft
app.post('/api/speaking/sets/:id/fork', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const version = forkSpeakingDraftVersion(req.params.id);
    res.status(201).json({ version });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/speaking/sets/:id/archive - archive set
app.post('/api/speaking/sets/:id/archive', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    archiveSpeakingSet(req.params.id);
    res.json({ message: 'Speaking set archived.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/speaking/assessments - record draft or release assessment
app.post('/api/speaking/assessments', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const assessment = recordSpeakingAssessment(req.user!.id, req.body, req.user!.role === 'admin');
    res.status(201).json({ assessment });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/speaking/assessments/:id/release - explicit release
app.post('/api/speaking/assessments/:id/release', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const assessment = releaseSpeakingAssessment(req.user!.id, req.params.id, req.user!.role === 'admin');
    res.json({ assessment, message: 'Assessment released successfully to student.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/speaking/assessments/:id/correct - correct released scores with audit trail
app.post('/api/speaking/assessments/:id/correct', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const assessment = correctReleasedSpeakingScores(req.user!.id, req.params.id, req.body, req.user!.role === 'admin');
    res.json({ assessment, message: 'Speaking scores corrected and audited successfully.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/speaking/assessments/:id - get assessment (draft privacy enforced)
app.get('/api/speaking/assessments/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const assessment = getSpeakingAssessmentById(req.params.id, req.user!.id, req.user!.role);
    if (!assessment) {
      res.status(404).json({ error: 'Assessment not found' });
      return;
    }
    res.json({ assessment });
  } catch (err: any) {
    const status = err.message.includes('draft state') || err.message.includes('forbidden') ? 403 : 400;
    res.status(status).json({ error: err.message });
  }
});

// GET /api/speaking/teacher/queue - teacher queue
app.get('/api/speaking/teacher/queue', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const queue = listTeacherAssessmentQueue(req.user!.id, req.query as any, req.user!.role === 'admin');
    res.json({ queue });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/speaking/my-assessments - student's released assessments
app.get('/api/speaking/my-assessments', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const assessments = listStudentSpeakingAssessments(req.user!.id);
    res.json({ assessments });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// LIVE AI SPEAKING SIMULATION & ASSESSMENT (MILESTONE 6)
// -------------------------------------------------------------

// POST /api/speaking/voice-trial - Pre-flight mic/speaker test (0 allowance cost)
app.post('/api/speaking/voice-trial', async (req, res) => {
  try {
    const result = await runVoiceTrial(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/speaking/realtime/token - Mint short-lived WebRTC session token
app.post('/api/speaking/realtime/token', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const tokenData = await mintRealtimeSessionToken();
    res.json(tokenData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/speaking/sessions - Start or recover an AI Speaking simulation session
app.post('/api/speaking/sessions', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const session = startOrRecoverSpeakingSession({
      userId: req.user!.id,
      setId: req.body.setId,
      setVersionId: req.body.setVersionId,
      assignmentId: req.body.assignmentId,
      packageAttemptId: req.body.packageAttemptId,
      mode: req.body.mode || 'mock',
    });
    res.status(201).json({ session });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/speaking/sessions/:id - Get session state and audio turns
app.get('/api/speaking/sessions/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const session = getSpeakingSessionById(req.params.id);
    if (!session) {
      res.status(404).json({ error: 'Speaking session not found' });
      return;
    }
    const isOwner = session.userId === req.user!.id;
    const isTeacherOrAdmin = req.user!.role === 'teacher' || req.user!.role === 'admin';
    if (!isOwner && !isTeacherOrAdmin) {
      res.status(403).json({ error: 'Unauthorized access to speaking session' });
      return;
    }
    res.json({ session });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/speaking/sessions/:id/stage - Advance session stage
app.post('/api/speaking/sessions/:id/stage', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const { targetStage } = req.body;
    if (!targetStage) {
      res.status(400).json({ error: 'targetStage is required' });
      return;
    }
    const session = advanceSessionStage(req.params.id, req.user!.id, targetStage);
    res.json({ session });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/speaking/sessions/:id/part2-notes - Save Part 2 scratchpad notes
app.post('/api/speaking/sessions/:id/part2-notes', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const { notes } = req.body;
    savePart2ScratchpadNotes(req.params.id, req.user!.id, notes || '');
    res.json({ message: 'Part 2 notes saved successfully.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/speaking/sessions/:id/turn - Submit candidate speech & receive examiner response
app.post('/api/speaking/sessions/:id/turn', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const result = await submitCandidateTurn({
      sessionId: req.params.id,
      userId: req.user!.id,
      candidateText: req.body.candidateText,
      audioBase64: req.body.audioBase64,
      durationSeconds: req.body.durationSeconds,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/speaking/sessions/:id/finish - Complete session and run AI assessment
app.post('/api/speaking/sessions/:id/finish', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const assessment = await finishAndAssessSpeakingSession(req.params.id, req.user!.id);
    res.json({ assessment, message: 'AI Speaking assessment generated successfully.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/speaking/sessions/:id/abandon - Abandon session & refund reserved allowance
app.post('/api/speaking/sessions/:id/abandon', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    abandonSpeakingSession(req.params.id, req.user!.id, req.body.reason);
    res.json({ message: 'Speaking session cancelled and allowance refunded.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/speaking/allowances/balance - Get current user's Speaking allowance balance
app.get('/api/speaking/allowances/balance', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const balance = getUserSpeakingAllowanceBalance(req.user!.id);
    res.json({ balance });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/speaking/allowances/grant - Grant allowances (Teacher/Admin only)
app.post('/api/speaking/allowances/grant', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const { userId, amount, notes } = req.body;
    if (!userId || !amount) {
      res.status(400).json({ error: 'userId and positive amount are required.' });
      return;
    }
    const ledgerEntry = grantSpeakingAllowance({
      adminId: req.user!.id,
      userId,
      amount: Number(amount),
      notes,
    });
    const balance = getUserSpeakingAllowanceBalance(userId);
    res.status(201).json({ ledgerEntry, balance });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// WRITING TASKS (TEACHER & STUDENT API)
// -------------------------------------------------------------

// GET /api/writing/tasks - list tasks
app.get('/api/writing/tasks', (req: any, res) => {
  try {
    const userRole = (req.user?.role || 'student') as 'student' | 'teacher' | 'admin';
    const tasks = listWritingTasks({
      status: req.query.status as any,
      taskType: req.query.taskType as any,
      testType: req.query.testType as any,
      taskNumber: req.query.taskNumber ? (Number(req.query.taskNumber) as any) : undefined,
      userRole,
    });
    res.json({ tasks });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/writing/tasks/:id - get single task
app.get('/api/writing/tasks/:id', (req: any, res) => {
  try {
    const userRole = (req.user?.role || 'student') as 'student' | 'teacher' | 'admin';
    const task = getWritingTaskById(req.params.id, userRole);
    if (!task) return res.status(404).json({ error: 'Writing task not found' });
    res.json({ task });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/writing/tasks - create new writing task
app.post('/api/writing/tasks', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const task = createWritingTask({
      createdById: req.user!.id,
      title: req.body.title,
      taskType: req.body.taskType,
      taskNumber: req.body.taskNumber,
      testType: req.body.testType,
      subtype: req.body.subtype,
      prompt: req.body.prompt,
      instructions: req.body.instructions,
      minWords: req.body.minWords,
      suggestedTimeMinutes: req.body.suggestedTimeMinutes,
      images: req.body.images,
      structuredData: req.body.structuredData,
      teacherVisualDescription: req.body.teacherVisualDescription,
      modelResponse: req.body.modelResponse,
      teacherAssessmentGuidance: req.body.teacherAssessmentGuidance,
    });
    res.status(201).json({ task });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/writing/tasks/:id/draft - update draft
app.put('/api/writing/tasks/:id/draft', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const task = updateWritingTaskDraft(req.params.id, req.body);
    res.json({ task });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/writing/tasks/:id/publish - publish draft
app.post('/api/writing/tasks/:id/publish', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const task = publishWritingTask(req.params.id);
    res.json({ task });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/writing/tasks/:id/fork - fork new draft version
app.post('/api/writing/tasks/:id/fork', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const task = forkWritingTaskVersion(req.params.id);
    res.json({ task });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/writing/tasks/:id/archive - archive task
app.post('/api/writing/tasks/:id/archive', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const task = archiveWritingTask(req.params.id);
    res.json({ task });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// STUDENT WRITING ATTEMPTS, RESPONSES & REVISIONS
// -------------------------------------------------------------

// POST /api/writing/attempts - start or resume attempt
app.post('/api/writing/attempts', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const attempt = startOrResumeWritingAttempt({
      userId: req.user!.id,
      mode: req.body.mode || 'practice',
      task1Id: req.body.task1Id,
      task2Id: req.body.task2Id,
      assignmentId: req.body.assignmentId,
      packageAttemptId: req.body.packageAttemptId,
    });
    res.json({ attempt });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/writing/attempts/:id - get full attempt
app.get('/api/writing/attempts/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const attempt = getWritingAttemptById(req.params.id);
    if (!attempt) return res.status(404).json({ error: 'Writing attempt not found' });
    if (req.user!.role === 'student' && attempt.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Access forbidden to this attempt.' });
    }
    res.json({ attempt });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/writing/attempts - get current student's writing attempts
app.get('/api/writing/attempts', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const attempts = listUserWritingAttempts(req.user!.id);
    res.json({ attempts });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/writing/attempts/:id/save - autosave draft response
app.post('/api/writing/attempts/:id/save', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const result = saveWritingDraftResponse({
      attemptId: req.params.id,
      taskNumber: req.body.taskNumber,
      responseText: req.body.responseText,
      userId: req.user!.id,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/writing/attempts/:id/submit - submit attempt and lock responses
app.post('/api/writing/attempts/:id/submit', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const attempt = submitWritingAttempt(req.params.id, req.user!.id);
    res.json({ attempt });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/writing/attempts/:id/revisions - fork revision draft
app.post('/api/writing/attempts/:id/revisions', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const response = createResponseRevision({
      attemptId: req.params.id,
      taskNumber: req.body.taskNumber,
      userId: req.user!.id,
    });
    res.json({ response });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// AI WRITING ASSESSMENT & AUDITABLE ALLOWANCE LEDGER
// -------------------------------------------------------------

// POST /api/writing/assessments/request - request AI evaluation
app.post('/api/writing/assessments/request', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const assessment = await requestAiWritingAssessment({
      responseId: req.body.responseId,
      userId: req.user!.id,
    });
    res.json({ assessment });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/writing/assessments/:id - get assessment status & results
app.get('/api/writing/assessments/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const row = db.prepare('SELECT * FROM writing_assessments WHERE id = ?').get(req.params.id) as any;
    if (!row) return res.status(404).json({ error: 'Assessment not found' });

    // Check attempt ownership if student
    const attempt = db.prepare('SELECT user_id FROM writing_attempts WHERE id = ?').get(row.attempt_id) as any;
    if (req.user!.role === 'student' && attempt?.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Access forbidden.' });
    }

    res.json({
      assessment: {
        id: row.id,
        responseId: row.response_id,
        attemptId: row.attempt_id,
        taskNumber: row.task_number,
        status: row.status,
        taskType: row.task_type,
        taskBand: row.task_band,
        criteria:
          row.score_ta_tr !== null
            ? {
                taskAchievementOrResponse: row.score_ta_tr,
                coherenceCohesion: row.score_cc,
                lexicalResource: row.score_lr,
                grammaticalRange: row.score_gra,
              }
            : undefined,
        criterionFeedback: {
          taskAchievementOrResponse: row.feedback_ta_tr || undefined,
          coherenceCohesion: row.feedback_cc || undefined,
          lexicalResource: row.feedback_lr || undefined,
          grammaticalRange: row.feedback_gra || undefined,
        },
        evidenceQuotes: row.evidence_quotes_json ? JSON.parse(row.evidence_quotes_json) : undefined,
        strengths: row.strengths_json ? JSON.parse(row.strengths_json) : undefined,
        improvements: row.improvements_json ? JSON.parse(row.improvements_json) : undefined,
        corrections: row.corrections_json ? JSON.parse(row.corrections_json) : undefined,
        overallFeedback: row.overall_feedback || undefined,
        isSimulated: Boolean(row.is_simulated),
        errorMessage: row.error_message || undefined,
        createdAt: row.created_at,
        completedAt: row.completed_at || undefined,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/writing/allowances/balance - get user's balance
app.get('/api/writing/allowances/balance', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const balance = getUserAllowanceBalance(req.user!.id);
    res.json({ balance });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/writing/allowances/ledger - get user's ledger transactions
app.get('/api/writing/allowances/ledger', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const ledger = listAllowanceLedger(req.user!.id);
    res.json({ ledger });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/writing/allowances/grant - grant allowance (teacher/admin only)
app.post('/api/writing/allowances/grant', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const entry = grantTestingAllowance({
      adminId: req.user!.id,
      userId: req.body.userId,
      amount: Number(req.body.amount),
      notes: req.body.notes,
    });
    res.json({ entry, balance: getUserAllowanceBalance(req.body.userId) });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// COMMERCIAL PRODUCTS (ADMIN & PUBLIC/LEARNER)
// -------------------------------------------------------------

// GET /api/commerce/products - list products
app.get('/api/commerce/products', (req, res) => {
  try {
    // If auth header present, check if staff
    let isStaff = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = (req as any).jwt?.verify ? (req as any).jwt.verify(token) : null;
        if (decoded?.role === 'admin' || decoded?.role === 'teacher') isStaff = true;
      } catch {
        // ignore
      }
    }
    const products = listProducts(isStaff);
    res.json({ products });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/commerce/products - create product (admin)
app.post('/api/commerce/products', authMiddleware, requireRole('admin'), (req: AuthenticatedRequest, res) => {
  try {
    const product = createProduct(req.user!.id, req.body);
    res.status(201).json({ product });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/commerce/products/:id - update product (admin)
app.put('/api/commerce/products/:id', authMiddleware, requireRole('admin'), (req: AuthenticatedRequest, res) => {
  try {
    const product = updateProduct(req.user!.id, req.params.id, req.body);
    res.json({ product });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/commerce/products/:id/publish - publish product (admin)
app.post('/api/commerce/products/:id/publish', authMiddleware, requireRole('admin'), (req: AuthenticatedRequest, res) => {
  try {
    const product = publishProduct(req.user!.id, req.params.id);
    res.json({ product });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/commerce/products/:id/archive - archive product (admin)
app.post('/api/commerce/products/:id/archive', authMiddleware, requireRole('admin'), (req: AuthenticatedRequest, res) => {
  try {
    const product = archiveProduct(req.user!.id, req.params.id);
    res.json({ product });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// CHECKOUT & ORDERS
// -------------------------------------------------------------

// GET /api/commerce/checkout/preview/:productId - pre-payment price disclosure
app.get('/api/commerce/checkout/preview/:productId', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const preview = getCheckoutPreview(req.user!.id, req.params.productId);
    res.json(preview);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/commerce/checkout/create-order - create order on server
app.post('/api/commerce/checkout/create-order', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { productId, provider = 'midtrans' } = req.body;
    const result = await createOrder(req.user!.id, productId, provider);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/commerce/orders/my - list user orders
app.get('/api/commerce/orders/my', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const orders = listUserOrders(req.user!.id);
    res.json({ orders });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/commerce/orders/:id - get single order
app.get('/api/commerce/orders/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const order = getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    if (order.userId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized.' });
    }
    res.json({ order });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/commerce/orders/:id/reconcile - reconcile missed notifications
app.post('/api/commerce/orders/:id/reconcile', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const order = getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    if (order.userId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized.' });
    }
    const reconciled = await reconcileOrder(req.params.id);
    res.json({ order: reconciled });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/commerce/orders/:id/refund - refund order (admin only)
app.post('/api/commerce/orders/:id/refund', authMiddleware, requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { reason, amount } = req.body;
    const result = await refundOrder({
      adminId: req.user!.id,
      orderId: req.params.id,
      reason,
      amount,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// WEBHOOK NOTIFICATIONS (IDEMPOTENT & SIGNED)
// -------------------------------------------------------------

// POST /api/commerce/webhooks/midtrans - Midtrans gateway callback
app.post('/api/commerce/webhooks/midtrans', async (req, res) => {
  try {
    const signature = (req.headers['x-midtrans-signature'] || req.headers['signature-key']) as string | undefined;
    const result = await processPaymentWebhook('midtrans', req.body, signature);
    res.json(result);
  } catch (err: any) {
    console.warn('Midtrans webhook processing error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// POST /api/commerce/webhooks/mock - Mock gateway callback for testing
app.post('/api/commerce/webhooks/mock', async (req, res) => {
  try {
    const result = await processPaymentWebhook('mock', req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// TEACHER CODES
// -------------------------------------------------------------

// GET /api/commerce/codes - list teacher codes (staff only)
app.get('/api/commerce/codes', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const codes = listTeacherCodes(true);
    res.json({ codes });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/commerce/codes - create teacher code (staff only)
app.post('/api/commerce/codes', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const code = createTeacherCode(req.user!.id, req.body);
    res.status(201).json({ code });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/commerce/codes/:id - update teacher code (staff only)
app.put('/api/commerce/codes/:id', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const code = updateTeacherCode(req.user!.id, req.params.id, req.body);
    res.json({ code });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/commerce/codes/:id/revoke - revoke teacher code (staff only)
app.post('/api/commerce/codes/:id/revoke', authMiddleware, requireRole('teacher', 'admin'), (req: AuthenticatedRequest, res) => {
  try {
    const code = revokeTeacherCode(req.user!.id, req.params.id);
    res.json({ code });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/commerce/codes/:code/preview - preview code benefits (learner)
app.get('/api/commerce/codes/:code/preview', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const preview = previewTeacherCode(req.params.code);
    res.json(preview);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/commerce/codes/redeem - redeem code atomically (learner)
app.post('/api/commerce/codes/redeem', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const result = redeemTeacherCode(req.user!.id, req.body.code);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// USER COMMERCIAL ENTITLEMENTS & ADMIN SUMMARY
// -------------------------------------------------------------

// GET /api/commerce/entitlements/my - get current user's commercial summary
app.get('/api/commerce/entitlements/my', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const summary = getUserCommercialSummary(req.user!.id);
    res.json(summary);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/commerce/admin/summary - admin financial and entitlement summary
app.get('/api/commerce/admin/summary', authMiddleware, requireRole('admin'), (req: AuthenticatedRequest, res) => {
  try {
    const summary = getAdminCommercialSummary();
    res.json(summary);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/commerce/admin/adjust-balance - reasoned audited balance adjustment
app.post('/api/commerce/admin/adjust-balance', authMiddleware, requireRole('admin'), (req: AuthenticatedRequest, res) => {
  try {
    const { userId, skill, amount, reason } = req.body;
    const result = adjustUserBalance({
      adminId: req.user!.id,
      userId,
      skill,
      amount: Number(amount),
      reason,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Serve compiled React frontend if present
const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Initialize database and start listening
initDatabase();
seedDatabase();
seedListeningDatabase();
// seedClassDatabase(); // Disabled to keep classes clean for user creation
seedSpeakingDatabase();
seedWritingData();
seedCommercialProductsAndCodes();
ingestCambridge21Test1();
ingestCambridge21Test2();
ingestCambridge21Test4();
ingestCambridge21ListeningTest1();
ingestCambridge21ListeningTest2();
ingestCambridge21ListeningTest3();

app.listen(PORT, () => {
  console.log(`IELTS Platform API server listening on http://localhost:${PORT}`);
});

export default app;

