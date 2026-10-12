import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = process.env.SQLITE_DATA_DIR || path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'ielts_platform.sqlite');
export const db = new Database(process.env.SQLITE_MEMORY === 'true' ? ':memory:' : dbPath);

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

    -- Writing Tasks (container)
    CREATE TABLE IF NOT EXISTS writing_tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      task_type TEXT NOT NULL CHECK(task_type IN ('academic_task_1', 'gt_task_1', 'task_2')),
      task_number INTEGER NOT NULL CHECK(task_number IN (1, 2)),
      test_type TEXT NOT NULL CHECK(test_type IN ('academic', 'general', 'both')),
      current_version_number INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      created_by_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (created_by_id) REFERENCES users(id)
    );

    -- Writing Task Versions (immutable snapshot when published)
    CREATE TABLE IF NOT EXISTS writing_task_versions (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      version_number INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'archived')),
      task_type TEXT NOT NULL CHECK(task_type IN ('academic_task_1', 'gt_task_1', 'task_2')),
      task_number INTEGER NOT NULL CHECK(task_number IN (1, 2)),
      test_type TEXT NOT NULL CHECK(test_type IN ('academic', 'general', 'both')),
      subtype TEXT,
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      instructions TEXT NOT NULL,
      min_words INTEGER NOT NULL DEFAULT 150,
      suggested_time_minutes INTEGER NOT NULL DEFAULT 20,
      images_json TEXT,
      structured_data_json TEXT,
      teacher_visual_description TEXT,
      model_response TEXT,
      teacher_assessment_guidance TEXT,
      validation_errors_json TEXT,
      published_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (task_id) REFERENCES writing_tasks(id) ON DELETE CASCADE,
      UNIQUE(task_id, version_number)
    );

    -- Student Writing Attempts
    CREATE TABLE IF NOT EXISTS writing_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      mode TEXT NOT NULL CHECK(mode IN ('practice', 'mock')),
      assignment_id TEXT,
      package_attempt_id TEXT,
      task1_id TEXT,
      task1_version_id TEXT,
      task2_id TEXT,
      task2_version_id TEXT,
      status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress', 'submitted', 'expired')),
      duration_minutes INTEGER NOT NULL DEFAULT 60,
      deadline_at TEXT,
      task1_band REAL,
      task2_band REAL,
      overall_writing_band REAL,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      submitted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (assignment_id) REFERENCES assignments(id),
      FOREIGN KEY (package_attempt_id) REFERENCES package_attempts(id),
      FOREIGN KEY (task1_id) REFERENCES writing_tasks(id),
      FOREIGN KEY (task1_version_id) REFERENCES writing_task_versions(id),
      FOREIGN KEY (task2_id) REFERENCES writing_tasks(id),
      FOREIGN KEY (task2_version_id) REFERENCES writing_task_versions(id)
    );

    -- Student Writing Responses (autosaved drafts and locked versions)
    CREATE TABLE IF NOT EXISTS writing_responses (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL,
      task_id TEXT NOT NULL,
      task_version_id TEXT NOT NULL,
      task_number INTEGER NOT NULL CHECK(task_number IN (1, 2)),
      response_text TEXT NOT NULL DEFAULT '',
      word_count INTEGER NOT NULL DEFAULT 0,
      version INTEGER NOT NULL DEFAULT 1,
      parent_response_id TEXT,
      is_locked INTEGER NOT NULL DEFAULT 0,
      last_saved_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (attempt_id) REFERENCES writing_attempts(id) ON DELETE CASCADE,
      FOREIGN KEY (task_id) REFERENCES writing_tasks(id),
      FOREIGN KEY (task_version_id) REFERENCES writing_task_versions(id),
      FOREIGN KEY (parent_response_id) REFERENCES writing_responses(id)
    );

    -- Writing AI Assessments (queued evaluation results)
    CREATE TABLE IF NOT EXISTS writing_assessments (
      id TEXT PRIMARY KEY,
      response_id TEXT NOT NULL,
      attempt_id TEXT NOT NULL,
      task_number INTEGER NOT NULL CHECK(task_number IN (1, 2)),
      status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued', 'processing', 'completed', 'failed')),
      task_type TEXT NOT NULL,
      task_band REAL,
      score_ta_tr REAL,
      score_cc REAL,
      score_lr REAL,
      score_gra REAL,
      feedback_ta_tr TEXT,
      feedback_cc TEXT,
      feedback_lr TEXT,
      feedback_gra TEXT,
      evidence_quotes_json TEXT,
      strengths_json TEXT,
      improvements_json TEXT,
      corrections_json TEXT,
      overall_feedback TEXT,
      is_simulated INTEGER NOT NULL DEFAULT 0,
      error_message TEXT,
      prompt_tokens INTEGER,
      completion_tokens INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      FOREIGN KEY (response_id) REFERENCES writing_responses(id) ON DELETE CASCADE,
      FOREIGN KEY (attempt_id) REFERENCES writing_attempts(id) ON DELETE CASCADE
    );

    -- Auditable Allowance Ledger for AI assessments
    CREATE TABLE IF NOT EXISTS writing_allowance_ledger (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      balance_after INTEGER NOT NULL,
      transaction_type TEXT NOT NULL CHECK(transaction_type IN ('grant', 'reservation', 'consumption', 'release')),
      assessment_id TEXT,
      response_id TEXT,
      idempotency_key TEXT UNIQUE,
      notes TEXT,
      created_by_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (created_by_id) REFERENCES users(id)
    );

    -- Live AI Speaking Sessions (Milestone 6)
    CREATE TABLE IF NOT EXISTS speaking_ai_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      assignment_id TEXT,
      package_attempt_id TEXT,
      set_id TEXT,
      set_version_id TEXT,
      mode TEXT NOT NULL DEFAULT 'mock' CHECK(mode IN ('practice', 'mock')),
      stage TEXT NOT NULL DEFAULT 'setup' CHECK(stage IN ('setup', 'part_1', 'part_2_prep', 'part_2_speaking', 'part_3', 'completed', 'abandoned')),
      current_part INTEGER NOT NULL DEFAULT 1 CHECK(current_part IN (1, 2, 3)),
      current_question_index INTEGER NOT NULL DEFAULT 0,
      part2_notes TEXT,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      was_interrupted INTEGER NOT NULL DEFAULT 0,
      interruption_count INTEGER NOT NULL DEFAULT 0,
      assessment_id TEXT,
      allowance_reserved INTEGER NOT NULL DEFAULT 0,
      allowance_consumed INTEGER NOT NULL DEFAULT 0,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (assignment_id) REFERENCES assignments(id),
      FOREIGN KEY (package_attempt_id) REFERENCES package_attempts(id),
      FOREIGN KEY (set_id) REFERENCES speaking_sets(id),
      FOREIGN KEY (set_version_id) REFERENCES speaking_set_versions(id)
    );

    -- Audio turns recorded during Speaking session
    CREATE TABLE IF NOT EXISTS speaking_audio_turns (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      part INTEGER NOT NULL CHECK(part IN (1, 2, 3)),
      turn_number INTEGER NOT NULL,
      speaker TEXT NOT NULL CHECK(speaker IN ('examiner', 'candidate')),
      text TEXT NOT NULL,
      audio_url TEXT,
      duration_seconds REAL NOT NULL DEFAULT 0,
      timestamp_seconds REAL NOT NULL DEFAULT 0,
      is_follow_up INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (session_id) REFERENCES speaking_ai_sessions(id) ON DELETE CASCADE
    );

    -- Dedicated Speaking AI Allowance Ledger (1 session = 1 test + feedback)
    CREATE TABLE IF NOT EXISTS speaking_allowance_ledger (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      balance_after INTEGER NOT NULL,
      transaction_type TEXT NOT NULL CHECK(transaction_type IN ('grant', 'reservation', 'consumption', 'release')),
      session_id TEXT,
      assessment_id TEXT,
      idempotency_key TEXT UNIQUE,
      notes TEXT,
      created_by_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (created_by_id) REFERENCES users(id)
    );

    -- Commercial Products (Milestone 7)
    CREATE TABLE IF NOT EXISTS commercial_products (
      id TEXT PRIMARY KEY,
      sku TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      product_type TEXT NOT NULL CHECK(product_type IN ('paid_plan', 'writing_assessment', 'speaking_session', 'bundle')),
      price_amount INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'IDR',
      duration_days INTEGER,
      writing_allowances INTEGER NOT NULL DEFAULT 0,
      speaking_allowances INTEGER NOT NULL DEFAULT 0,
      grants_catalogue_access INTEGER NOT NULL DEFAULT 0,
      renewal_type TEXT NOT NULL DEFAULT 'manual' CHECK(renewal_type IN ('manual', 'recurring')),
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Commercial Orders
    CREATE TABLE IF NOT EXISTS commercial_orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_sku TEXT NOT NULL,
      product_title TEXT NOT NULL,
      gross_amount INTEGER NOT NULL,
      currency TEXT NOT NULL,
      payment_provider TEXT NOT NULL DEFAULT 'midtrans',
      provider_transaction_id TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'failed', 'cancelled', 'expired', 'refunded', 'disputed')),
      payment_method TEXT,
      paid_at TEXT,
      refunded_at TEXT,
      refund_amount INTEGER,
      refund_reason TEXT,
      checkout_url TEXT,
      metadata_json TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES commercial_products(id)
    );

    -- Commercial Entitlement Grants (audited source of every access grant)
    CREATE TABLE IF NOT EXISTS commercial_entitlement_grants (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      source_type TEXT NOT NULL CHECK(source_type IN ('purchase', 'teacher_code', 'admin_adjustment')),
      source_id TEXT NOT NULL,
      grant_type TEXT NOT NULL CHECK(grant_type IN ('catalogue_access', 'writing_allowance', 'speaking_allowance', 'protected_prepost')),
      amount INTEGER NOT NULL DEFAULT 1,
      valid_from TEXT NOT NULL,
      valid_until TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'expired', 'revoked')),
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Teacher Codes
    CREATE TABLE IF NOT EXISTS teacher_codes (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      description TEXT,
      redemption_deadline_at TEXT,
      access_duration_days INTEGER NOT NULL DEFAULT 30,
      max_redemptions INTEGER NOT NULL DEFAULT 50,
      redemption_count INTEGER NOT NULL DEFAULT 0,
      class_id TEXT,
      grants_catalogue_access INTEGER NOT NULL DEFAULT 1,
      writing_allowances INTEGER NOT NULL DEFAULT 0,
      speaking_allowances INTEGER NOT NULL DEFAULT 0,
      protected_prepost_allowances INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'revoked', 'exhausted')),
      created_by_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
      FOREIGN KEY (created_by_id) REFERENCES users(id)
    );

    -- Teacher Code Redemptions (1 redemption per learner rule)
    CREATE TABLE IF NOT EXISTS teacher_code_redemptions (
      id TEXT PRIMARY KEY,
      code_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      redeemed_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (code_id) REFERENCES teacher_codes(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(code_id, user_id)
    );

    -- User Subscriptions (Plan subscriptions)
    CREATE TABLE IF NOT EXISTS user_subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      order_id TEXT,
      code_id TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'cancelled', 'expired')),
      valid_from TEXT NOT NULL,
      valid_until TEXT NOT NULL,
      renewal_type TEXT NOT NULL DEFAULT 'manual' CHECK(renewal_type IN ('manual', 'recurring')),
      cancelled_at TEXT,
      cancellation_reason TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (plan_id) REFERENCES commercial_products(id),
      FOREIGN KEY (order_id) REFERENCES commercial_orders(id),
      FOREIGN KEY (code_id) REFERENCES teacher_codes(id)
    );

    -- Payment Webhook Events (Idempotency log)
    CREATE TABLE IF NOT EXISTS payment_webhook_events (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      provider_event_id TEXT UNIQUE,
      order_id TEXT,
      event_type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      is_processed INTEGER NOT NULL DEFAULT 0,
      processed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
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
    CREATE INDEX IF NOT EXISTS idx_speaking_ai_sessions_user ON speaking_ai_sessions(user_id, stage);
    CREATE INDEX IF NOT EXISTS idx_speaking_audio_turns_session ON speaking_audio_turns(session_id, turn_number);
    CREATE INDEX IF NOT EXISTS idx_speaking_allowance_user ON speaking_allowance_ledger(user_id);

    CREATE INDEX IF NOT EXISTS idx_writing_tasks_status ON writing_tasks(status, task_type);
    CREATE INDEX IF NOT EXISTS idx_writing_task_versions ON writing_task_versions(task_id, version_number);
    CREATE INDEX IF NOT EXISTS idx_writing_attempts_user ON writing_attempts(user_id, status);
    CREATE INDEX IF NOT EXISTS idx_writing_responses_attempt ON writing_responses(attempt_id, task_number);
    CREATE INDEX IF NOT EXISTS idx_writing_assessments_response ON writing_assessments(response_id);
    CREATE INDEX IF NOT EXISTS idx_writing_allowance_user ON writing_allowance_ledger(user_id);

    CREATE INDEX IF NOT EXISTS idx_commercial_products_status ON commercial_products(status, product_type);
    CREATE INDEX IF NOT EXISTS idx_commercial_orders_user ON commercial_orders(user_id, status);
    CREATE INDEX IF NOT EXISTS idx_commercial_orders_status ON commercial_orders(status);
    CREATE INDEX IF NOT EXISTS idx_commercial_grants_user ON commercial_entitlement_grants(user_id, status);
    CREATE INDEX IF NOT EXISTS idx_teacher_codes_code ON teacher_codes(code, status);
    CREATE INDEX IF NOT EXISTS idx_teacher_code_redemptions_user ON teacher_code_redemptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id, status);
    CREATE INDEX IF NOT EXISTS idx_webhook_events_order ON payment_webhook_events(order_id);
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
    if (!pkgAttemptCols.some((col) => col.name === 'writing_attempt_id')) {
      db.exec('ALTER TABLE package_attempts ADD COLUMN writing_attempt_id TEXT REFERENCES writing_attempts(id);');
    }
  } catch (err) {
    console.warn('Note: package_attempts column check/alter', err);
  }

  try {
    const testPkgCols = db.prepare("PRAGMA table_info(test_packages)").all() as any[];
    if (!testPkgCols.some((col) => col.name === 'speaking_set_id')) {
      db.exec('ALTER TABLE test_packages ADD COLUMN speaking_set_id TEXT REFERENCES speaking_sets(id);');
    }
    if (!testPkgCols.some((col) => col.name === 'speaking_set_version_id')) {
      db.exec('ALTER TABLE test_packages ADD COLUMN speaking_set_version_id TEXT REFERENCES speaking_set_versions(id);');
    }
    if (!testPkgCols.some((col) => col.name === 'writing_task1_id')) {
      db.exec('ALTER TABLE test_packages ADD COLUMN writing_task1_id TEXT REFERENCES writing_tasks(id);');
    }
    if (!testPkgCols.some((col) => col.name === 'writing_task1_version_id')) {
      db.exec('ALTER TABLE test_packages ADD COLUMN writing_task1_version_id TEXT REFERENCES writing_task_versions(id);');
    }
    if (!testPkgCols.some((col) => col.name === 'writing_task2_id')) {
      db.exec('ALTER TABLE test_packages ADD COLUMN writing_task2_id TEXT REFERENCES writing_tasks(id);');
    }
    if (!testPkgCols.some((col) => col.name === 'writing_task2_version_id')) {
      db.exec('ALTER TABLE test_packages ADD COLUMN writing_task2_version_id TEXT REFERENCES writing_task_versions(id);');
    }
  } catch (err) {
    console.warn('Note: test_packages writing/speaking columns check/alter', err);
  }

  // Safe migration for assignments.skill check constraint
  try {
    const tableSql = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='assignments'").get() as any;
    if (tableSql && (!tableSql.sql.includes("'speaking'") || !tableSql.sql.includes("'writing'"))) {
      db.pragma('foreign_keys = OFF');
      db.exec(`
        CREATE TABLE assignments_new (
          id TEXT PRIMARY KEY,
          class_id TEXT NOT NULL,
          title TEXT NOT NULL,
          instructions TEXT,
          purpose TEXT NOT NULL CHECK(purpose IN ('pre_test', 'practice', 'post_test')),
          package_id TEXT,
          skill TEXT CHECK(skill IN ('reading', 'listening', 'writing', 'speaking', 'all')),
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

  // Safe column migrations for speaking Milestone 6
  try {
    const spkAssessCols = db.prepare("PRAGMA table_info(speaking_assessments)").all() as any[];
    if (!spkAssessCols.some((c) => c.name === 'evidence_quotes_json')) {
      db.exec('ALTER TABLE speaking_assessments ADD COLUMN evidence_quotes_json TEXT;');
    }
    if (!spkAssessCols.some((c) => c.name === 'suggested_practice_json')) {
      db.exec('ALTER TABLE speaking_assessments ADD COLUMN suggested_practice_json TEXT;');
    }
    if (!spkAssessCols.some((c) => c.name === 'acoustic_observations_json')) {
      db.exec('ALTER TABLE speaking_assessments ADD COLUMN acoustic_observations_json TEXT;');
    }
    if (!spkAssessCols.some((c) => c.name === 'is_simulated')) {
      db.exec('ALTER TABLE speaking_assessments ADD COLUMN is_simulated INTEGER DEFAULT 0;');
    }
    if (!spkAssessCols.some((c) => c.name === 'provider_model')) {
      db.exec('ALTER TABLE speaking_assessments ADD COLUMN provider_model TEXT;');
    }
    if (!spkAssessCols.some((c) => c.name === 'session_id')) {
      db.exec('ALTER TABLE speaking_assessments ADD COLUMN session_id TEXT REFERENCES speaking_ai_sessions(id);');
    }
    if (!spkAssessCols.some((c) => c.name === 'was_interrupted')) {
      db.exec('ALTER TABLE speaking_assessments ADD COLUMN was_interrupted INTEGER DEFAULT 0;');
    }
    if (!spkAssessCols.some((c) => c.name === 'interruption_count')) {
      db.exec('ALTER TABLE speaking_assessments ADD COLUMN interruption_count INTEGER DEFAULT 0;');
    }
  } catch (err) {
    console.warn('Note: speaking_assessments column migrations', err);
  }

  try {
    const spkVerCols = db.prepare("PRAGMA table_info(speaking_set_versions)").all() as any[];
    if (!spkVerCols.some((c) => c.name === 'follow_up_guidance_json')) {
      db.exec('ALTER TABLE speaking_set_versions ADD COLUMN follow_up_guidance_json TEXT;');
    }
    if (!spkVerCols.some((c) => c.name === 'teacher_only_instructions')) {
      db.exec('ALTER TABLE speaking_set_versions ADD COLUMN teacher_only_instructions TEXT;');
    }
    if (!spkVerCols.some((c) => c.name === 'ai_instructions')) {
      db.exec('ALTER TABLE speaking_set_versions ADD COLUMN ai_instructions TEXT;');
    }
  } catch (err) {
    console.warn('Note: speaking_set_versions column migrations', err);
  }

  try {
    const assignCols = db.prepare("PRAGMA table_info(assignments)").all() as any[];
    if (!assignCols.some((c) => c.name === 'speaking_route')) {
      db.exec("ALTER TABLE assignments ADD COLUMN speaking_route TEXT DEFAULT 'student_choice';");
    }
  } catch (err) {
    console.warn('Note: assignments.speaking_route column migration', err);
  }

  try {
    const pkgAttemptCols = db.prepare("PRAGMA table_info(package_attempts)").all() as any[];
    if (!pkgAttemptCols.some((c) => c.name === 'speaking_ai_session_id')) {
      db.exec('ALTER TABLE package_attempts ADD COLUMN speaking_ai_session_id TEXT REFERENCES speaking_ai_sessions(id);');
    }
  } catch (err) {
    console.warn('Note: package_attempts.speaking_ai_session_id column migration', err);
  }

  try {
    const tableSql = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='speaking_allowance_ledger'").get() as any;
    if (tableSql && tableSql.sql && tableSql.sql.includes('REFERENCES speaking_ai_sessions')) {
      db.pragma('foreign_keys = OFF');
      db.exec(`
        CREATE TABLE speaking_allowance_ledger_new (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          amount INTEGER NOT NULL,
          balance_after INTEGER NOT NULL,
          transaction_type TEXT NOT NULL CHECK(transaction_type IN ('grant', 'reservation', 'consumption', 'release')),
          session_id TEXT,
          assessment_id TEXT,
          idempotency_key TEXT UNIQUE,
          notes TEXT,
          created_by_id TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (created_by_id) REFERENCES users(id)
        );
        INSERT INTO speaking_allowance_ledger_new SELECT * FROM speaking_allowance_ledger;
        DROP TABLE speaking_allowance_ledger;
        ALTER TABLE speaking_allowance_ledger_new RENAME TO speaking_allowance_ledger;
        CREATE INDEX IF NOT EXISTS idx_speaking_allowance_user ON speaking_allowance_ledger(user_id);
      `);
      db.pragma('foreign_keys = ON');
    }
  } catch (err) {
    console.warn('Note: speaking_allowance_ledger FK migration', err);
  }

  // Safe column migrations for Milestone 7: commercial access & free tier flags
  try {
    const userCols = db.prepare("PRAGMA table_info(users)").all() as any[];
    if (!userCols.some((c) => c.name === 'plan_type')) {
      db.exec("ALTER TABLE users ADD COLUMN plan_type TEXT NOT NULL DEFAULT 'free';");
    }
    if (!userCols.some((c) => c.name === 'plan_expires_at')) {
      db.exec("ALTER TABLE users ADD COLUMN plan_expires_at TEXT;");
    }

    const readingCols = db.prepare("PRAGMA table_info(reading_tests)").all() as any[];
    if (!readingCols.some((c) => c.name === 'is_free_tier')) {
      db.exec("ALTER TABLE reading_tests ADD COLUMN is_free_tier INTEGER NOT NULL DEFAULT 0;");
    }

    const listeningCols = db.prepare("PRAGMA table_info(listening_tests)").all() as any[];
    if (!listeningCols.some((c) => c.name === 'is_free_tier')) {
      db.exec("ALTER TABLE listening_tests ADD COLUMN is_free_tier INTEGER NOT NULL DEFAULT 0;");
    }

    const writingCols = db.prepare("PRAGMA table_info(writing_tasks)").all() as any[];
    if (!writingCols.some((c) => c.name === 'is_free_tier')) {
      db.exec("ALTER TABLE writing_tasks ADD COLUMN is_free_tier INTEGER NOT NULL DEFAULT 0;");
    }

    const speakingCols = db.prepare("PRAGMA table_info(speaking_sets)").all() as any[];
    if (!speakingCols.some((c) => c.name === 'is_free_tier')) {
      db.exec("ALTER TABLE speaking_sets ADD COLUMN is_free_tier INTEGER NOT NULL DEFAULT 0;");
    }
  } catch (err) {
    console.warn('Note: commercial columns migration', err);
  }
}
