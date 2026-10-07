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
  `);
}
