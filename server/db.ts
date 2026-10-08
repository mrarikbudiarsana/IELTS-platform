import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'ielts_platform.sqlite');
export const db = new Database(dbPath);

// Enable WAL mode for high concurrency and performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'teacher', 'admin')),
      test_type_preference TEXT NOT NULL DEFAULT 'not_sure',
      target_band REAL,
      test_date TEXT,
      reset_token TEXT,
      reset_token_expires TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Reading tests (container)
    CREATE TABLE IF NOT EXISTS reading_tests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      test_type TEXT NOT NULL CHECK(test_type IN ('academic', 'general')),
      category TEXT NOT NULL CHECK(category IN ('practice', 'mock')),
      time_limit_minutes INTEGER NOT NULL DEFAULT 60,
      current_version_number INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      created_by_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (created_by_id) REFERENCES users(id)
    );

    -- Reading test versions (immutable snapshots when published)
    CREATE TABLE IF NOT EXISTS reading_test_versions (
      id TEXT PRIMARY KEY,
      test_id TEXT NOT NULL,
      version_number INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'archived')),
      passages_json TEXT NOT NULL,
      question_groups_json TEXT NOT NULL,
      total_questions INTEGER NOT NULL,
      validation_errors_json TEXT,
      published_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (test_id) REFERENCES reading_tests(id) ON DELETE CASCADE,
      UNIQUE(test_id, version_number)
    );

    -- Student test attempts
    CREATE TABLE IF NOT EXISTS reading_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      test_id TEXT NOT NULL,
      version_id TEXT NOT NULL,
      test_title TEXT NOT NULL,
      test_type TEXT NOT NULL,
      mode TEXT NOT NULL CHECK(mode IN ('practice', 'mock')),
      status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress', 'submitted', 'expired')),
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      deadline_at TEXT,
      submitted_at TEXT,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      raw_score REAL,
      total_questions INTEGER NOT NULL,
      band_score REAL,
      is_first_attempt INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (test_id) REFERENCES reading_tests(id),
      FOREIGN KEY (version_id) REFERENCES reading_test_versions(id)
    );

    -- Student answers per attempt (autosaved and queried)
    CREATE TABLE IF NOT EXISTS reading_answers (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      question_number INTEGER NOT NULL,
      user_answer_json TEXT NOT NULL,
      is_flagged INTEGER NOT NULL DEFAULT 0,
      is_correct INTEGER,
      mark REAL,
      saved_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (attempt_id) REFERENCES reading_attempts(id) ON DELETE CASCADE,
      UNIQUE(attempt_id, question_number)
    );

    -- Audit log for sensitive role elevations and version changes
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      details_json TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Listening tests (container)
    CREATE TABLE IF NOT EXISTS listening_tests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('practice', 'mock')),
      audio_mode TEXT NOT NULL DEFAULT 'part_audios' CHECK(audio_mode IN ('single_audio', 'part_audios')),
      time_limit_minutes INTEGER NOT NULL DEFAULT 40,
      current_version_number INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      created_by_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (created_by_id) REFERENCES users(id)
    );

    -- Listening test versions (immutable snapshots when published)
    CREATE TABLE IF NOT EXISTS listening_test_versions (
      id TEXT PRIMARY KEY,
      test_id TEXT NOT NULL,
      version_number INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'archived')),
      parts_json TEXT NOT NULL,
      question_groups_json TEXT NOT NULL,
      total_questions INTEGER NOT NULL,
      audio_config_json TEXT NOT NULL,
      validation_errors_json TEXT,
      published_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (test_id) REFERENCES listening_tests(id) ON DELETE CASCADE,
      UNIQUE(test_id, version_number)
    );

    -- Student listening attempts
    CREATE TABLE IF NOT EXISTS listening_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      test_id TEXT NOT NULL,
      version_id TEXT NOT NULL,
      test_title TEXT NOT NULL,
      mode TEXT NOT NULL CHECK(mode IN ('practice', 'mock')),
      status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress', 'submitted', 'expired')),
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      deadline_at TEXT,
      submitted_at TEXT,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      raw_score REAL,
      total_questions INTEGER NOT NULL,
      band_score REAL,
      is_first_attempt INTEGER NOT NULL DEFAULT 1,
      was_interrupted INTEGER NOT NULL DEFAULT 0,
      interruption_count INTEGER NOT NULL DEFAULT 0,
      replay_count INTEGER NOT NULL DEFAULT 0,
      interruption_events_json TEXT DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (test_id) REFERENCES listening_tests(id),
      FOREIGN KEY (version_id) REFERENCES listening_test_versions(id)
    );

    -- Student listening answers per attempt
    CREATE TABLE IF NOT EXISTS listening_answers (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      question_number INTEGER NOT NULL,
      user_answer_json TEXT NOT NULL,
      is_flagged INTEGER NOT NULL DEFAULT 0,
      is_correct INTEGER,
      mark REAL,
      saved_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (attempt_id) REFERENCES listening_attempts(id) ON DELETE CASCADE,
      UNIQUE(attempt_id, question_number)
    );

    -- -------------------------------------------------------------
    -- MILESTONE 3: CLASSES, ENROLMENTS, PACKAGES, ASSIGNMENTS
    -- -------------------------------------------------------------

    -- Classes table
    CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      teacher_id TEXT NOT NULL,
      test_type TEXT NOT NULL CHECK(test_type IN ('academic', 'general')),
      invitation_code TEXT UNIQUE NOT NULL,
      is_archived INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );

    -- Class enrolments (removing access preserves historical work)
    CREATE TABLE IF NOT EXISTS class_enrolments (
      id TEXT PRIMARY KEY,
      class_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'removed')),
      enrolled_at TEXT NOT NULL DEFAULT (datetime('now')),
      removed_at TEXT,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id),
      UNIQUE(class_id, student_id)
    );

    -- Test packages (connects four skill components; fixed versions)
    CREATE TABLE IF NOT EXISTS test_packages (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      package_type TEXT NOT NULL CHECK(package_type IN ('pre_test', 'post_test', 'full_mock')),
      test_type TEXT NOT NULL CHECK(test_type IN ('academic', 'general')),
      listening_test_id TEXT,
      listening_version_id TEXT,
      reading_test_id TEXT,
      reading_version_id TEXT,
      writing_status TEXT NOT NULL DEFAULT 'not_implemented',
      speaking_status TEXT NOT NULL DEFAULT 'not_implemented',
      created_by_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (created_by_id) REFERENCES users(id),
      FOREIGN KEY (listening_test_id) REFERENCES listening_tests(id),
      FOREIGN KEY (listening_version_id) REFERENCES listening_test_versions(id),
      FOREIGN KEY (reading_test_id) REFERENCES reading_tests(id),
      FOREIGN KEY (reading_version_id) REFERENCES reading_test_versions(id)
    );

    -- Assignments table
    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      class_id TEXT NOT NULL,
      title TEXT NOT NULL,
      instructions TEXT,
      purpose TEXT NOT NULL CHECK(purpose IN ('pre_test', 'practice', 'post_test')),
      package_id TEXT,
      skill TEXT CHECK(skill IN ('reading', 'listening', 'speaking', 'all')),
      test_id TEXT,
      version_id TEXT,
      mode TEXT NOT NULL DEFAULT 'mock' CHECK(mode IN ('mock', 'practice')),
      release_at TEXT NOT NULL,
      deadline_at TEXT,
      attempt_limit INTEGER NOT NULL DEFAULT 1,
      is_released INTEGER NOT NULL DEFAULT 1,
      created_by_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
      FOREIGN KEY (package_id) REFERENCES test_packages(id),
      FOREIGN KEY (created_by_id) REFERENCES users(id)
    );

    -- Assignment access grants (whole class if empty or specific learners)
    CREATE TABLE IF NOT EXISTS assignment_access_grants (
      id TEXT PRIMARY KEY,
      assignment_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id),
      UNIQUE(assignment_id, student_id)
    );

    -- Multi-skill package attempts
    CREATE TABLE IF NOT EXISTS package_attempts (
      id TEXT PRIMARY KEY,
      package_id TEXT NOT NULL,
      assignment_id TEXT,
      user_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress', 'completed')),
      mode TEXT NOT NULL CHECK(mode IN ('exam_rehearsal', 'flexible_preparation')),
      reading_attempt_id TEXT,
      listening_attempt_id TEXT,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (package_id) REFERENCES test_packages(id),
      FOREIGN KEY (assignment_id) REFERENCES assignments(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (reading_attempt_id) REFERENCES reading_attempts(id),
      FOREIGN KEY (listening_attempt_id) REFERENCES listening_attempts(id)
    );

    -- Speaking Sets (container)
    CREATE TABLE IF NOT EXISTS speaking_sets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      current_version_number INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      created_by_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (created_by_id) REFERENCES users(id)
    );

    -- Speaking Set Versions (immutable snapshot when published)
    CREATE TABLE IF NOT EXISTS speaking_set_versions (
      id TEXT PRIMARY KEY,
      set_id TEXT NOT NULL,
      version_number INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'archived')),
      part1_topics_json TEXT NOT NULL,
      part2_cue_card_json TEXT NOT NULL,
      part3_discussion_json TEXT NOT NULL,
      teacher_notes TEXT,
      validation_errors_json TEXT,
      published_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (set_id) REFERENCES speaking_sets(id) ON DELETE CASCADE,
      UNIQUE(set_id, version_number)
    );

    -- Speaking Assessments (Teacher-led or AI session records)
    CREATE TABLE IF NOT EXISTS speaking_assessments (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      teacher_id TEXT NOT NULL,
      class_id TEXT,
      assignment_id TEXT,
      package_attempt_id TEXT,
      set_id TEXT,
      set_version_id TEXT,
      custom_topic TEXT,
      session_type TEXT NOT NULL CHECK(session_type IN ('complete_mock', 'partial_practice')),
      parts_covered_json TEXT NOT NULL,
      session_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'released')),
      assessor_type TEXT NOT NULL DEFAULT 'teacher' CHECK(assessor_type IN ('teacher', 'ai')),
      criterion_fluency_coherence REAL,
      criterion_lexical_resource REAL,
      criterion_grammatical_range REAL,
      criterion_pronunciation REAL,
      overall_band REAL,
      strengths TEXT,
      improvement_priorities TEXT,
      part_comments_json TEXT,
      teacher_private_notes TEXT,
      recording_url TEXT,
      recording_retention_acknowledged INTEGER DEFAULT 0,
      released_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (teacher_id) REFERENCES users(id),
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (assignment_id) REFERENCES assignments(id),
      FOREIGN KEY (package_attempt_id) REFERENCES package_attempts(id),
      FOREIGN KEY (set_id) REFERENCES speaking_sets(id),
      FOREIGN KEY (set_version_id) REFERENCES speaking_set_versions(id)
    );

    -- Speaking Score Corrections Audit History
    CREATE TABLE IF NOT EXISTS speaking_score_corrections (
      id TEXT PRIMARY KEY,
      assessment_id TEXT NOT NULL,
      teacher_id TEXT NOT NULL,
      previous_scores_json TEXT NOT NULL,
      updated_scores_json TEXT NOT NULL,
      reason TEXT NOT NULL,
      corrected_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (assessment_id) REFERENCES speaking_assessments(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );

    -- Indices for high performance
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_reading_tests_status ON reading_tests(status, test_type);
    CREATE INDEX IF NOT EXISTS idx_test_versions_test ON reading_test_versions(test_id, version_number);
    CREATE INDEX IF NOT EXISTS idx_attempts_user ON reading_attempts(user_id, test_id);
    CREATE INDEX IF NOT EXISTS idx_answers_attempt ON reading_answers(attempt_id);

    CREATE INDEX IF NOT EXISTS idx_listening_tests_status ON listening_tests(status);
    CREATE INDEX IF NOT EXISTS idx_listening_versions_test ON listening_test_versions(test_id, version_number);
    CREATE INDEX IF NOT EXISTS idx_listening_attempts_user ON listening_attempts(user_id, test_id);
    CREATE INDEX IF NOT EXISTS idx_listening_answers_attempt ON listening_answers(attempt_id);

    CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);
    CREATE INDEX IF NOT EXISTS idx_class_enrolments_student ON class_enrolments(student_id, class_id);
    CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id, purpose);
    CREATE INDEX IF NOT EXISTS idx_package_attempts_user ON package_attempts(user_id, package_id);

    CREATE INDEX IF NOT EXISTS idx_speaking_sets_status ON speaking_sets(status);
    CREATE INDEX IF NOT EXISTS idx_speaking_set_versions ON speaking_set_versions(set_id, version_number);
    CREATE INDEX IF NOT EXISTS idx_speaking_assessments_student ON speaking_assessments(student_id, status);
    CREATE INDEX IF NOT EXISTS idx_speaking_assessments_teacher ON speaking_assessments(teacher_id, status);
    CREATE INDEX IF NOT EXISTS idx_speaking_assessments_assignment ON speaking_assessments(assignment_id, student_id);
    CREATE INDEX IF NOT EXISTS idx_speaking_corrections_assessment ON speaking_score_corrections(assessment_id);
  `);

  // Safe column migrations for assignment_id
  try {
    const readingColumns = db.prepare("PRAGMA table_info(reading_attempts)").all() as any[];
    if (!readingColumns.some((col) => col.name === 'assignment_id')) {
      db.exec('ALTER TABLE reading_attempts ADD COLUMN assignment_id TEXT REFERENCES assignments(id);');
    }
  } catch (err) {
    console.warn('Note: reading_attempts.assignment_id column check/alter', err);
  }

  try {
    const listeningColumns = db.prepare("PRAGMA table_info(listening_attempts)").all() as any[];
    if (!listeningColumns.some((col) => col.name === 'assignment_id')) {
      db.exec('ALTER TABLE listening_attempts ADD COLUMN assignment_id TEXT REFERENCES assignments(id);');
    }
  } catch (err) {
    console.warn('Note: listening_attempts.assignment_id column check/alter', err);
  }

  // Safe column migrations for speaking in package_attempts and test_packages
  try {
    const pkgAttemptCols = db.prepare("PRAGMA table_info(package_attempts)").all() as any[];
    if (!pkgAttemptCols.some((col) => col.name === 'speaking_assessment_id')) {
      db.exec('ALTER TABLE package_attempts ADD COLUMN speaking_assessment_id TEXT REFERENCES speaking_assessments(id);');
    }
  } catch (err) {
    console.warn('Note: package_attempts.speaking_assessment_id check/alter', err);
  }

  try {
    const testPkgCols = db.prepare("PRAGMA table_info(test_packages)").all() as any[];
    if (!testPkgCols.some((col) => col.name === 'speaking_set_id')) {
      db.exec('ALTER TABLE test_packages ADD COLUMN speaking_set_id TEXT REFERENCES speaking_sets(id);');
    }
    if (!testPkgCols.some((col) => col.name === 'speaking_set_version_id')) {
      db.exec('ALTER TABLE test_packages ADD COLUMN speaking_set_version_id TEXT REFERENCES speaking_set_versions(id);');
    }
  } catch (err) {
    console.warn('Note: test_packages speaking columns check/alter', err);
  }

  // Safe migration for assignments.skill check constraint
  try {
    const tableSql = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='assignments'").get() as any;
    if (tableSql && !tableSql.sql.includes("'speaking'")) {
      db.pragma('foreign_keys = OFF');
      db.exec(`
        CREATE TABLE assignments_new (
          id TEXT PRIMARY KEY,
          class_id TEXT NOT NULL,
          title TEXT NOT NULL,
          instructions TEXT,
          purpose TEXT NOT NULL CHECK(purpose IN ('pre_test', 'practice', 'post_test')),
          package_id TEXT,
          skill TEXT CHECK(skill IN ('reading', 'listening', 'speaking', 'all')),
          test_id TEXT,
          version_id TEXT,
          mode TEXT NOT NULL DEFAULT 'mock' CHECK(mode IN ('mock', 'practice')),
          release_at TEXT NOT NULL,
          deadline_at TEXT,
          attempt_limit INTEGER NOT NULL DEFAULT 1,
          is_released INTEGER NOT NULL DEFAULT 1,
          created_by_id TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
          FOREIGN KEY (package_id) REFERENCES test_packages(id),
          FOREIGN KEY (created_by_id) REFERENCES users(id)
        );
        INSERT INTO assignments_new SELECT * FROM assignments;
        DROP TABLE assignments;
        ALTER TABLE assignments_new RENAME TO assignments;
        CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id, purpose);
      `);
      db.pragma('foreign_keys = ON');
    }
  } catch (err) {
    console.warn('Note: assignments.skill check constraint migration', err);
  }
}

