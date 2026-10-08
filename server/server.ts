import express from 'express';
import cors from 'cors';
import path from 'path';
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
import { ClassTestType } from '../shared/types';

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
  res.json({ status: 'ok', milestones: ['reading', 'listening', 'classes'] });
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
seedClassDatabase();

app.listen(PORT, () => {
  console.log(`IELTS Platform API server listening on http://localhost:${PORT}`);
});

export default app;
