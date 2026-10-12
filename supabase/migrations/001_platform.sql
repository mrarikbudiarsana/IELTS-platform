-- Complete application schema. Access goes through the authenticated API.
CREATE TABLE IF NOT EXISTS assignment_access_grants (
      id TEXT PRIMARY KEY,
      assignment_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      UNIQUE(assignment_id, student_id)
    );

CREATE TABLE IF NOT EXISTS "assignments" (
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
          created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
          updated_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')), speaking_route TEXT DEFAULT 'student_choice'
        );

CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      details_json TEXT,
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

CREATE TABLE IF NOT EXISTS class_enrolments (
      id TEXT PRIMARY KEY,
      class_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'removed')),
      enrolled_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      removed_at TEXT,
      UNIQUE(class_id, student_id)
    );

CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      teacher_id TEXT NOT NULL,
      test_type TEXT NOT NULL CHECK(test_type IN ('academic', 'general')),
      invitation_code TEXT UNIQUE NOT NULL,
      is_archived INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      updated_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      updated_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      updated_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

CREATE TABLE IF NOT EXISTS listening_answers (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      question_number INTEGER NOT NULL,
      user_answer_json TEXT NOT NULL,
      is_flagged INTEGER NOT NULL DEFAULT 0,
      is_correct INTEGER,
      mark REAL,
      saved_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      UNIQUE(attempt_id, question_number)
    );

CREATE TABLE IF NOT EXISTS listening_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      test_id TEXT NOT NULL,
      version_id TEXT NOT NULL,
      test_title TEXT NOT NULL,
      mode TEXT NOT NULL CHECK(mode IN ('practice', 'mock')),
      status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress', 'submitted', 'expired')),
      started_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')), assignment_id TEXT
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      UNIQUE(test_id, version_number)
    );

CREATE TABLE IF NOT EXISTS listening_tests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('practice', 'mock')),
      audio_mode TEXT NOT NULL DEFAULT 'part_audios' CHECK(audio_mode IN ('single_audio', 'part_audios')),
      time_limit_minutes INTEGER NOT NULL DEFAULT 40,
      current_version_number INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      created_by_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      updated_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')), is_free_tier INTEGER NOT NULL DEFAULT 0
    );

CREATE TABLE IF NOT EXISTS package_attempts (
      id TEXT PRIMARY KEY,
      package_id TEXT NOT NULL,
      assignment_id TEXT,
      user_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress', 'completed')),
      mode TEXT NOT NULL CHECK(mode IN ('exam_rehearsal', 'flexible_preparation')),
      reading_attempt_id TEXT,
      listening_attempt_id TEXT,
      started_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      completed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')), speaking_assessment_id TEXT, writing_attempt_id TEXT, speaking_ai_session_id TEXT
    );

CREATE TABLE IF NOT EXISTS payment_webhook_events (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      provider_event_id TEXT UNIQUE,
      order_id TEXT,
      event_type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      is_processed INTEGER NOT NULL DEFAULT 0,
      processed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

CREATE TABLE IF NOT EXISTS reading_answers (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      question_number INTEGER NOT NULL,
      user_answer_json TEXT NOT NULL,
      is_flagged INTEGER NOT NULL DEFAULT 0,
      is_correct INTEGER,
      mark REAL,
      saved_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      UNIQUE(attempt_id, question_number)
    );

CREATE TABLE IF NOT EXISTS reading_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      test_id TEXT NOT NULL,
      version_id TEXT NOT NULL,
      test_title TEXT NOT NULL,
      test_type TEXT NOT NULL,
      mode TEXT NOT NULL CHECK(mode IN ('practice', 'mock')),
      status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress', 'submitted', 'expired')),
      started_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      deadline_at TEXT,
      submitted_at TEXT,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      raw_score REAL,
      total_questions INTEGER NOT NULL,
      band_score REAL,
      is_first_attempt INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')), assignment_id TEXT
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      UNIQUE(test_id, version_number)
    );

CREATE TABLE IF NOT EXISTS reading_tests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      test_type TEXT NOT NULL CHECK(test_type IN ('academic', 'general')),
      category TEXT NOT NULL CHECK(category IN ('practice', 'mock')),
      time_limit_minutes INTEGER NOT NULL DEFAULT 60,
      current_version_number INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      created_by_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      updated_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')), is_free_tier INTEGER NOT NULL DEFAULT 0
    );

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
      started_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      completed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      updated_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      updated_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')), evidence_quotes_json TEXT, suggested_practice_json TEXT, acoustic_observations_json TEXT, is_simulated INTEGER DEFAULT 0, provider_model TEXT, session_id TEXT, was_interrupted INTEGER DEFAULT 0, interruption_count INTEGER DEFAULT 0
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

CREATE TABLE IF NOT EXISTS speaking_score_corrections (
      id TEXT PRIMARY KEY,
      assessment_id TEXT NOT NULL,
      teacher_id TEXT NOT NULL,
      previous_scores_json TEXT NOT NULL,
      updated_scores_json TEXT NOT NULL,
      reason TEXT NOT NULL,
      corrected_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')), follow_up_guidance_json TEXT, teacher_only_instructions TEXT, ai_instructions TEXT,
      UNIQUE(set_id, version_number)
    );

CREATE TABLE IF NOT EXISTS speaking_sets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      current_version_number INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      created_by_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      updated_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')), is_free_tier INTEGER NOT NULL DEFAULT 0
    );

CREATE TABLE IF NOT EXISTS teacher_code_redemptions (
      id TEXT PRIMARY KEY,
      code_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      redeemed_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      UNIQUE(code_id, user_id)
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      updated_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')), speaking_set_id TEXT, speaking_set_version_id TEXT, writing_task1_id TEXT, writing_task1_version_id TEXT, writing_task2_id TEXT, writing_task2_version_id TEXT
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      updated_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    , plan_type TEXT NOT NULL DEFAULT 'free', plan_expires_at TEXT);

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      completed_at TEXT
    );

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
      started_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      submitted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      updated_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

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
      last_saved_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      updated_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    );

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
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      UNIQUE(task_id, version_number)
    );

CREATE TABLE IF NOT EXISTS writing_tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      task_type TEXT NOT NULL CHECK(task_type IN ('academic_task_1', 'gt_task_1', 'task_2')),
      task_number INTEGER NOT NULL CHECK(task_number IN (1, 2)),
      test_type TEXT NOT NULL CHECK(test_type IN ('academic', 'general', 'both')),
      current_version_number INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      created_by_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      updated_at TEXT NOT NULL DEFAULT (to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')), is_free_tier INTEGER NOT NULL DEFAULT 0
    );

DO $$ DECLARE field RECORD; BEGIN
    FOR field IN SELECT table_name, column_name, column_default FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name IN ('assignment_access_grants','assignments','audit_logs','class_enrolments','classes','commercial_entitlement_grants','commercial_orders','commercial_products','listening_answers','listening_attempts','listening_test_versions','listening_tests','package_attempts','payment_webhook_events','reading_answers','reading_attempts','reading_test_versions','reading_tests','speaking_ai_sessions','speaking_allowance_ledger','speaking_assessments','speaking_audio_turns','speaking_score_corrections','speaking_set_versions','speaking_sets','teacher_code_redemptions','teacher_codes','test_packages','user_subscriptions','users','writing_allowance_ledger','writing_assessments','writing_attempts','writing_responses','writing_task_versions','writing_tasks')
      AND data_type IN ('timestamp with time zone', 'timestamp without time zone') LOOP
      EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I DROP DEFAULT', field.table_name, field.column_name);
      EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I TYPE TEXT USING to_char(%I::timestamptz AT TIME ZONE ''UTC'', ''YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'')', field.table_name, field.column_name, field.column_name);
      IF field.column_default IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I SET DEFAULT to_char(clock_timestamp() AT TIME ZONE ''UTC'', ''YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'')', field.table_name, field.column_name);
      END IF;
    END LOOP;
    FOR field IN SELECT table_name, column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name IN ('assignment_access_grants','assignments','audit_logs','class_enrolments','classes','commercial_entitlement_grants','commercial_orders','commercial_products','listening_answers','listening_attempts','listening_test_versions','listening_tests','package_attempts','payment_webhook_events','reading_answers','reading_attempts','reading_test_versions','reading_tests','speaking_ai_sessions','speaking_allowance_ledger','speaking_assessments','speaking_audio_turns','speaking_score_corrections','speaking_set_versions','speaking_sets','teacher_code_redemptions','teacher_codes','test_packages','user_subscriptions','users','writing_allowance_ledger','writing_assessments','writing_attempts','writing_responses','writing_task_versions','writing_tasks')
      AND data_type = 'text' AND (column_name LIKE '%_at' OR column_name LIKE '%_until' OR column_name = 'reset_token_expires') LOOP
      EXECUTE format('UPDATE public.%I SET %I = to_char(%I::timestamp AT TIME ZONE ''UTC'' AT TIME ZONE ''UTC'', ''YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'') WHERE %I ~ ''^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}''', field.table_name, field.column_name, field.column_name, field.column_name);
    END LOOP;
  END $$;

ALTER TABLE public.assignment_access_grants ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.assignment_access_grants ADD COLUMN IF NOT EXISTS "assignment_id" TEXT NOT NULL;

ALTER TABLE public.assignment_access_grants ADD COLUMN IF NOT EXISTS "student_id" TEXT NOT NULL;

ALTER TABLE public.assignment_access_grants ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "class_id" TEXT NOT NULL;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "instructions" TEXT;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "purpose" TEXT NOT NULL;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "package_id" TEXT;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "skill" TEXT;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "test_id" TEXT;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "version_id" TEXT;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "mode" TEXT DEFAULT 'mock' NOT NULL;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "release_at" TEXT NOT NULL;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "deadline_at" TEXT;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "attempt_limit" INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "is_released" INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "created_by_id" TEXT NOT NULL;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "updated_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS "speaking_route" TEXT DEFAULT 'student_choice';

ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS "user_id" TEXT;

ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS "action" TEXT NOT NULL;

ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS "target_type" TEXT NOT NULL;

ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS "target_id" TEXT NOT NULL;

ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS "details_json" TEXT;

ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.class_enrolments ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.class_enrolments ADD COLUMN IF NOT EXISTS "class_id" TEXT NOT NULL;

ALTER TABLE public.class_enrolments ADD COLUMN IF NOT EXISTS "student_id" TEXT NOT NULL;

ALTER TABLE public.class_enrolments ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'active' NOT NULL;

ALTER TABLE public.class_enrolments ADD COLUMN IF NOT EXISTS "enrolled_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.class_enrolments ADD COLUMN IF NOT EXISTS "removed_at" TEXT;

ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL;

ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS "description" TEXT;

ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS "teacher_id" TEXT NOT NULL;

ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS "test_type" TEXT NOT NULL;

ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS "invitation_code" TEXT NOT NULL;

ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS "is_archived" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS "updated_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.commercial_entitlement_grants ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.commercial_entitlement_grants ADD COLUMN IF NOT EXISTS "user_id" TEXT NOT NULL;

ALTER TABLE public.commercial_entitlement_grants ADD COLUMN IF NOT EXISTS "source_type" TEXT NOT NULL;

ALTER TABLE public.commercial_entitlement_grants ADD COLUMN IF NOT EXISTS "source_id" TEXT NOT NULL;

ALTER TABLE public.commercial_entitlement_grants ADD COLUMN IF NOT EXISTS "grant_type" TEXT NOT NULL;

ALTER TABLE public.commercial_entitlement_grants ADD COLUMN IF NOT EXISTS "amount" INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE public.commercial_entitlement_grants ADD COLUMN IF NOT EXISTS "valid_from" TEXT NOT NULL;

ALTER TABLE public.commercial_entitlement_grants ADD COLUMN IF NOT EXISTS "valid_until" TEXT;

ALTER TABLE public.commercial_entitlement_grants ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'active' NOT NULL;

ALTER TABLE public.commercial_entitlement_grants ADD COLUMN IF NOT EXISTS "notes" TEXT;

ALTER TABLE public.commercial_entitlement_grants ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "user_id" TEXT NOT NULL;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "product_id" TEXT NOT NULL;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "product_sku" TEXT NOT NULL;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "product_title" TEXT NOT NULL;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "gross_amount" INTEGER NOT NULL;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "payment_provider" TEXT DEFAULT 'midtrans' NOT NULL;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "provider_transaction_id" TEXT;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'pending' NOT NULL;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "payment_method" TEXT;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "paid_at" TEXT;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "refunded_at" TEXT;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "refund_amount" INTEGER;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "refund_reason" TEXT;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "checkout_url" TEXT;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "metadata_json" TEXT;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.commercial_orders ADD COLUMN IF NOT EXISTS "updated_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "sku" TEXT NOT NULL;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "description" TEXT;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "product_type" TEXT NOT NULL;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "price_amount" INTEGER NOT NULL;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "currency" TEXT DEFAULT 'IDR' NOT NULL;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "duration_days" INTEGER;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "writing_allowances" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "speaking_allowances" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "grants_catalogue_access" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "renewal_type" TEXT DEFAULT 'manual' NOT NULL;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'draft' NOT NULL;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.commercial_products ADD COLUMN IF NOT EXISTS "updated_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.listening_answers ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.listening_answers ADD COLUMN IF NOT EXISTS "attempt_id" TEXT NOT NULL;

ALTER TABLE public.listening_answers ADD COLUMN IF NOT EXISTS "question_id" TEXT NOT NULL;

ALTER TABLE public.listening_answers ADD COLUMN IF NOT EXISTS "question_number" INTEGER NOT NULL;

ALTER TABLE public.listening_answers ADD COLUMN IF NOT EXISTS "user_answer_json" TEXT NOT NULL;

ALTER TABLE public.listening_answers ADD COLUMN IF NOT EXISTS "is_flagged" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.listening_answers ADD COLUMN IF NOT EXISTS "is_correct" INTEGER;

ALTER TABLE public.listening_answers ADD COLUMN IF NOT EXISTS "mark" REAL;

ALTER TABLE public.listening_answers ADD COLUMN IF NOT EXISTS "saved_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "user_id" TEXT NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "test_id" TEXT NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "version_id" TEXT NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "test_title" TEXT NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "mode" TEXT NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'in_progress' NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "started_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "deadline_at" TEXT;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "submitted_at" TEXT;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "duration_seconds" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "raw_score" REAL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "total_questions" INTEGER NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "band_score" REAL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "is_first_attempt" INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "was_interrupted" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "interruption_count" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "replay_count" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "interruption_events_json" TEXT DEFAULT '[]';

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS "assignment_id" TEXT;

ALTER TABLE public.listening_test_versions ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.listening_test_versions ADD COLUMN IF NOT EXISTS "test_id" TEXT NOT NULL;

ALTER TABLE public.listening_test_versions ADD COLUMN IF NOT EXISTS "version_number" INTEGER NOT NULL;

ALTER TABLE public.listening_test_versions ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL;

ALTER TABLE public.listening_test_versions ADD COLUMN IF NOT EXISTS "parts_json" TEXT NOT NULL;

ALTER TABLE public.listening_test_versions ADD COLUMN IF NOT EXISTS "question_groups_json" TEXT NOT NULL;

ALTER TABLE public.listening_test_versions ADD COLUMN IF NOT EXISTS "total_questions" INTEGER NOT NULL;

ALTER TABLE public.listening_test_versions ADD COLUMN IF NOT EXISTS "audio_config_json" TEXT NOT NULL;

ALTER TABLE public.listening_test_versions ADD COLUMN IF NOT EXISTS "validation_errors_json" TEXT;

ALTER TABLE public.listening_test_versions ADD COLUMN IF NOT EXISTS "published_at" TEXT;

ALTER TABLE public.listening_test_versions ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.listening_tests ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.listening_tests ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL;

ALTER TABLE public.listening_tests ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL;

ALTER TABLE public.listening_tests ADD COLUMN IF NOT EXISTS "audio_mode" TEXT DEFAULT 'part_audios' NOT NULL;

ALTER TABLE public.listening_tests ADD COLUMN IF NOT EXISTS "time_limit_minutes" INTEGER DEFAULT 40 NOT NULL;

ALTER TABLE public.listening_tests ADD COLUMN IF NOT EXISTS "current_version_number" INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE public.listening_tests ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'draft' NOT NULL;

ALTER TABLE public.listening_tests ADD COLUMN IF NOT EXISTS "created_by_id" TEXT NOT NULL;

ALTER TABLE public.listening_tests ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.listening_tests ADD COLUMN IF NOT EXISTS "updated_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.listening_tests ADD COLUMN IF NOT EXISTS "is_free_tier" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.package_attempts ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.package_attempts ADD COLUMN IF NOT EXISTS "package_id" TEXT NOT NULL;

ALTER TABLE public.package_attempts ADD COLUMN IF NOT EXISTS "assignment_id" TEXT;

ALTER TABLE public.package_attempts ADD COLUMN IF NOT EXISTS "user_id" TEXT NOT NULL;

ALTER TABLE public.package_attempts ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'in_progress' NOT NULL;

ALTER TABLE public.package_attempts ADD COLUMN IF NOT EXISTS "mode" TEXT NOT NULL;

ALTER TABLE public.package_attempts ADD COLUMN IF NOT EXISTS "reading_attempt_id" TEXT;

ALTER TABLE public.package_attempts ADD COLUMN IF NOT EXISTS "listening_attempt_id" TEXT;

ALTER TABLE public.package_attempts ADD COLUMN IF NOT EXISTS "started_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.package_attempts ADD COLUMN IF NOT EXISTS "completed_at" TEXT;

ALTER TABLE public.package_attempts ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.package_attempts ADD COLUMN IF NOT EXISTS "speaking_assessment_id" TEXT;

ALTER TABLE public.package_attempts ADD COLUMN IF NOT EXISTS "writing_attempt_id" TEXT;

ALTER TABLE public.package_attempts ADD COLUMN IF NOT EXISTS "speaking_ai_session_id" TEXT;

ALTER TABLE public.payment_webhook_events ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.payment_webhook_events ADD COLUMN IF NOT EXISTS "provider" TEXT NOT NULL;

ALTER TABLE public.payment_webhook_events ADD COLUMN IF NOT EXISTS "provider_event_id" TEXT;

ALTER TABLE public.payment_webhook_events ADD COLUMN IF NOT EXISTS "order_id" TEXT;

ALTER TABLE public.payment_webhook_events ADD COLUMN IF NOT EXISTS "event_type" TEXT NOT NULL;

ALTER TABLE public.payment_webhook_events ADD COLUMN IF NOT EXISTS "payload_json" TEXT NOT NULL;

ALTER TABLE public.payment_webhook_events ADD COLUMN IF NOT EXISTS "is_processed" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.payment_webhook_events ADD COLUMN IF NOT EXISTS "processed_at" TEXT;

ALTER TABLE public.payment_webhook_events ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.reading_answers ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.reading_answers ADD COLUMN IF NOT EXISTS "attempt_id" TEXT NOT NULL;

ALTER TABLE public.reading_answers ADD COLUMN IF NOT EXISTS "question_id" TEXT NOT NULL;

ALTER TABLE public.reading_answers ADD COLUMN IF NOT EXISTS "question_number" INTEGER NOT NULL;

ALTER TABLE public.reading_answers ADD COLUMN IF NOT EXISTS "user_answer_json" TEXT NOT NULL;

ALTER TABLE public.reading_answers ADD COLUMN IF NOT EXISTS "is_flagged" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.reading_answers ADD COLUMN IF NOT EXISTS "is_correct" INTEGER;

ALTER TABLE public.reading_answers ADD COLUMN IF NOT EXISTS "mark" REAL;

ALTER TABLE public.reading_answers ADD COLUMN IF NOT EXISTS "saved_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "user_id" TEXT NOT NULL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "test_id" TEXT NOT NULL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "version_id" TEXT NOT NULL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "test_title" TEXT NOT NULL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "test_type" TEXT NOT NULL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "mode" TEXT NOT NULL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'in_progress' NOT NULL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "started_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "deadline_at" TEXT;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "submitted_at" TEXT;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "duration_seconds" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "raw_score" REAL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "total_questions" INTEGER NOT NULL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "band_score" REAL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "is_first_attempt" INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS "assignment_id" TEXT;

ALTER TABLE public.reading_test_versions ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.reading_test_versions ADD COLUMN IF NOT EXISTS "test_id" TEXT NOT NULL;

ALTER TABLE public.reading_test_versions ADD COLUMN IF NOT EXISTS "version_number" INTEGER NOT NULL;

ALTER TABLE public.reading_test_versions ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL;

ALTER TABLE public.reading_test_versions ADD COLUMN IF NOT EXISTS "passages_json" TEXT NOT NULL;

ALTER TABLE public.reading_test_versions ADD COLUMN IF NOT EXISTS "question_groups_json" TEXT NOT NULL;

ALTER TABLE public.reading_test_versions ADD COLUMN IF NOT EXISTS "total_questions" INTEGER NOT NULL;

ALTER TABLE public.reading_test_versions ADD COLUMN IF NOT EXISTS "validation_errors_json" TEXT;

ALTER TABLE public.reading_test_versions ADD COLUMN IF NOT EXISTS "published_at" TEXT;

ALTER TABLE public.reading_test_versions ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.reading_tests ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.reading_tests ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL;

ALTER TABLE public.reading_tests ADD COLUMN IF NOT EXISTS "test_type" TEXT NOT NULL;

ALTER TABLE public.reading_tests ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL;

ALTER TABLE public.reading_tests ADD COLUMN IF NOT EXISTS "time_limit_minutes" INTEGER DEFAULT 60 NOT NULL;

ALTER TABLE public.reading_tests ADD COLUMN IF NOT EXISTS "current_version_number" INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE public.reading_tests ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'draft' NOT NULL;

ALTER TABLE public.reading_tests ADD COLUMN IF NOT EXISTS "created_by_id" TEXT NOT NULL;

ALTER TABLE public.reading_tests ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.reading_tests ADD COLUMN IF NOT EXISTS "updated_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.reading_tests ADD COLUMN IF NOT EXISTS "is_free_tier" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "user_id" TEXT NOT NULL;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "assignment_id" TEXT;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "package_attempt_id" TEXT;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "set_id" TEXT;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "set_version_id" TEXT;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "mode" TEXT DEFAULT 'mock' NOT NULL;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "stage" TEXT DEFAULT 'setup' NOT NULL;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "current_part" INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "current_question_index" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "part2_notes" TEXT;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "duration_seconds" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "was_interrupted" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "interruption_count" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "assessment_id" TEXT;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "allowance_reserved" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "allowance_consumed" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "started_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "completed_at" TEXT;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.speaking_ai_sessions ADD COLUMN IF NOT EXISTS "updated_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.speaking_allowance_ledger ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.speaking_allowance_ledger ADD COLUMN IF NOT EXISTS "user_id" TEXT NOT NULL;

ALTER TABLE public.speaking_allowance_ledger ADD COLUMN IF NOT EXISTS "amount" INTEGER NOT NULL;

ALTER TABLE public.speaking_allowance_ledger ADD COLUMN IF NOT EXISTS "balance_after" INTEGER NOT NULL;

ALTER TABLE public.speaking_allowance_ledger ADD COLUMN IF NOT EXISTS "transaction_type" TEXT NOT NULL;

ALTER TABLE public.speaking_allowance_ledger ADD COLUMN IF NOT EXISTS "session_id" TEXT;

ALTER TABLE public.speaking_allowance_ledger ADD COLUMN IF NOT EXISTS "assessment_id" TEXT;

ALTER TABLE public.speaking_allowance_ledger ADD COLUMN IF NOT EXISTS "idempotency_key" TEXT;

ALTER TABLE public.speaking_allowance_ledger ADD COLUMN IF NOT EXISTS "notes" TEXT;

ALTER TABLE public.speaking_allowance_ledger ADD COLUMN IF NOT EXISTS "created_by_id" TEXT;

ALTER TABLE public.speaking_allowance_ledger ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "student_id" TEXT NOT NULL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "teacher_id" TEXT NOT NULL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "class_id" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "assignment_id" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "package_attempt_id" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "set_id" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "set_version_id" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "custom_topic" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "session_type" TEXT NOT NULL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "parts_covered_json" TEXT NOT NULL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "session_date" TEXT NOT NULL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'draft' NOT NULL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "assessor_type" TEXT DEFAULT 'teacher' NOT NULL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "criterion_fluency_coherence" REAL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "criterion_lexical_resource" REAL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "criterion_grammatical_range" REAL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "criterion_pronunciation" REAL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "overall_band" REAL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "strengths" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "improvement_priorities" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "part_comments_json" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "teacher_private_notes" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "recording_url" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "recording_retention_acknowledged" INTEGER DEFAULT 0;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "released_at" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "updated_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "evidence_quotes_json" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "suggested_practice_json" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "acoustic_observations_json" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "is_simulated" INTEGER DEFAULT 0;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "provider_model" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "session_id" TEXT;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "was_interrupted" INTEGER DEFAULT 0;

ALTER TABLE public.speaking_assessments ADD COLUMN IF NOT EXISTS "interruption_count" INTEGER DEFAULT 0;

ALTER TABLE public.speaking_audio_turns ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.speaking_audio_turns ADD COLUMN IF NOT EXISTS "session_id" TEXT NOT NULL;

ALTER TABLE public.speaking_audio_turns ADD COLUMN IF NOT EXISTS "part" INTEGER NOT NULL;

ALTER TABLE public.speaking_audio_turns ADD COLUMN IF NOT EXISTS "turn_number" INTEGER NOT NULL;

ALTER TABLE public.speaking_audio_turns ADD COLUMN IF NOT EXISTS "speaker" TEXT NOT NULL;

ALTER TABLE public.speaking_audio_turns ADD COLUMN IF NOT EXISTS "text" TEXT NOT NULL;

ALTER TABLE public.speaking_audio_turns ADD COLUMN IF NOT EXISTS "audio_url" TEXT;

ALTER TABLE public.speaking_audio_turns ADD COLUMN IF NOT EXISTS "duration_seconds" REAL DEFAULT 0 NOT NULL;

ALTER TABLE public.speaking_audio_turns ADD COLUMN IF NOT EXISTS "timestamp_seconds" REAL DEFAULT 0 NOT NULL;

ALTER TABLE public.speaking_audio_turns ADD COLUMN IF NOT EXISTS "is_follow_up" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.speaking_audio_turns ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.speaking_score_corrections ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.speaking_score_corrections ADD COLUMN IF NOT EXISTS "assessment_id" TEXT NOT NULL;

ALTER TABLE public.speaking_score_corrections ADD COLUMN IF NOT EXISTS "teacher_id" TEXT NOT NULL;

ALTER TABLE public.speaking_score_corrections ADD COLUMN IF NOT EXISTS "previous_scores_json" TEXT NOT NULL;

ALTER TABLE public.speaking_score_corrections ADD COLUMN IF NOT EXISTS "updated_scores_json" TEXT NOT NULL;

ALTER TABLE public.speaking_score_corrections ADD COLUMN IF NOT EXISTS "reason" TEXT NOT NULL;

ALTER TABLE public.speaking_score_corrections ADD COLUMN IF NOT EXISTS "corrected_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.speaking_set_versions ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.speaking_set_versions ADD COLUMN IF NOT EXISTS "set_id" TEXT NOT NULL;

ALTER TABLE public.speaking_set_versions ADD COLUMN IF NOT EXISTS "version_number" INTEGER NOT NULL;

ALTER TABLE public.speaking_set_versions ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL;

ALTER TABLE public.speaking_set_versions ADD COLUMN IF NOT EXISTS "part1_topics_json" TEXT NOT NULL;

ALTER TABLE public.speaking_set_versions ADD COLUMN IF NOT EXISTS "part2_cue_card_json" TEXT NOT NULL;

ALTER TABLE public.speaking_set_versions ADD COLUMN IF NOT EXISTS "part3_discussion_json" TEXT NOT NULL;

ALTER TABLE public.speaking_set_versions ADD COLUMN IF NOT EXISTS "teacher_notes" TEXT;

ALTER TABLE public.speaking_set_versions ADD COLUMN IF NOT EXISTS "validation_errors_json" TEXT;

ALTER TABLE public.speaking_set_versions ADD COLUMN IF NOT EXISTS "published_at" TEXT;

ALTER TABLE public.speaking_set_versions ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.speaking_set_versions ADD COLUMN IF NOT EXISTS "follow_up_guidance_json" TEXT;

ALTER TABLE public.speaking_set_versions ADD COLUMN IF NOT EXISTS "teacher_only_instructions" TEXT;

ALTER TABLE public.speaking_set_versions ADD COLUMN IF NOT EXISTS "ai_instructions" TEXT;

ALTER TABLE public.speaking_sets ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.speaking_sets ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL;

ALTER TABLE public.speaking_sets ADD COLUMN IF NOT EXISTS "current_version_number" INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE public.speaking_sets ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'draft' NOT NULL;

ALTER TABLE public.speaking_sets ADD COLUMN IF NOT EXISTS "created_by_id" TEXT NOT NULL;

ALTER TABLE public.speaking_sets ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.speaking_sets ADD COLUMN IF NOT EXISTS "updated_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.speaking_sets ADD COLUMN IF NOT EXISTS "is_free_tier" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.teacher_code_redemptions ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.teacher_code_redemptions ADD COLUMN IF NOT EXISTS "code_id" TEXT NOT NULL;

ALTER TABLE public.teacher_code_redemptions ADD COLUMN IF NOT EXISTS "user_id" TEXT NOT NULL;

ALTER TABLE public.teacher_code_redemptions ADD COLUMN IF NOT EXISTS "redeemed_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "code" TEXT NOT NULL;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "label" TEXT NOT NULL;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "description" TEXT;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "redemption_deadline_at" TEXT;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "access_duration_days" INTEGER DEFAULT 30 NOT NULL;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "max_redemptions" INTEGER DEFAULT 50 NOT NULL;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "redemption_count" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "class_id" TEXT;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "grants_catalogue_access" INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "writing_allowances" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "speaking_allowances" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "protected_prepost_allowances" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'active' NOT NULL;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "created_by_id" TEXT NOT NULL;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.teacher_codes ADD COLUMN IF NOT EXISTS "updated_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "package_type" TEXT NOT NULL;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "test_type" TEXT NOT NULL;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "listening_test_id" TEXT;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "listening_version_id" TEXT;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "reading_test_id" TEXT;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "reading_version_id" TEXT;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "writing_status" TEXT DEFAULT 'not_implemented' NOT NULL;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "speaking_status" TEXT DEFAULT 'not_implemented' NOT NULL;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "created_by_id" TEXT NOT NULL;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "speaking_set_id" TEXT;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "speaking_set_version_id" TEXT;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "writing_task1_id" TEXT;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "writing_task1_version_id" TEXT;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "writing_task2_id" TEXT;

ALTER TABLE public.test_packages ADD COLUMN IF NOT EXISTS "writing_task2_version_id" TEXT;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS "user_id" TEXT NOT NULL;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS "plan_id" TEXT NOT NULL;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS "order_id" TEXT;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS "code_id" TEXT;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'active' NOT NULL;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS "valid_from" TEXT NOT NULL;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS "valid_until" TEXT NOT NULL;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS "renewal_type" TEXT DEFAULT 'manual' NOT NULL;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS "cancelled_at" TEXT;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS "cancellation_reason" TEXT;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS "updated_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "email" TEXT NOT NULL;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "password_hash" TEXT NOT NULL;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "full_name" TEXT NOT NULL;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "test_type_preference" TEXT DEFAULT 'not_sure' NOT NULL;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "target_band" REAL;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "test_date" TEXT;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "reset_token" TEXT;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "reset_token_expires" TEXT;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "plan_type" TEXT DEFAULT 'free' NOT NULL;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "plan_expires_at" TEXT;

ALTER TABLE public.writing_allowance_ledger ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.writing_allowance_ledger ADD COLUMN IF NOT EXISTS "user_id" TEXT NOT NULL;

ALTER TABLE public.writing_allowance_ledger ADD COLUMN IF NOT EXISTS "amount" INTEGER NOT NULL;

ALTER TABLE public.writing_allowance_ledger ADD COLUMN IF NOT EXISTS "balance_after" INTEGER NOT NULL;

ALTER TABLE public.writing_allowance_ledger ADD COLUMN IF NOT EXISTS "transaction_type" TEXT NOT NULL;

ALTER TABLE public.writing_allowance_ledger ADD COLUMN IF NOT EXISTS "assessment_id" TEXT;

ALTER TABLE public.writing_allowance_ledger ADD COLUMN IF NOT EXISTS "response_id" TEXT;

ALTER TABLE public.writing_allowance_ledger ADD COLUMN IF NOT EXISTS "idempotency_key" TEXT;

ALTER TABLE public.writing_allowance_ledger ADD COLUMN IF NOT EXISTS "notes" TEXT;

ALTER TABLE public.writing_allowance_ledger ADD COLUMN IF NOT EXISTS "created_by_id" TEXT;

ALTER TABLE public.writing_allowance_ledger ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "response_id" TEXT NOT NULL;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "attempt_id" TEXT NOT NULL;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "task_number" INTEGER NOT NULL;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'queued' NOT NULL;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "task_type" TEXT NOT NULL;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "task_band" REAL;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "score_ta_tr" REAL;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "score_cc" REAL;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "score_lr" REAL;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "score_gra" REAL;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "feedback_ta_tr" TEXT;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "feedback_cc" TEXT;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "feedback_lr" TEXT;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "feedback_gra" TEXT;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "evidence_quotes_json" TEXT;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "strengths_json" TEXT;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "improvements_json" TEXT;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "corrections_json" TEXT;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "overall_feedback" TEXT;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "is_simulated" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "error_message" TEXT;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "prompt_tokens" INTEGER;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "completion_tokens" INTEGER;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.writing_assessments ADD COLUMN IF NOT EXISTS "completed_at" TEXT;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "user_id" TEXT NOT NULL;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "mode" TEXT NOT NULL;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "assignment_id" TEXT;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "package_attempt_id" TEXT;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "task1_id" TEXT;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "task1_version_id" TEXT;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "task2_id" TEXT;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "task2_version_id" TEXT;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'in_progress' NOT NULL;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "duration_minutes" INTEGER DEFAULT 60 NOT NULL;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "deadline_at" TEXT;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "task1_band" REAL;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "task2_band" REAL;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "overall_writing_band" REAL;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "started_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "submitted_at" TEXT;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.writing_attempts ADD COLUMN IF NOT EXISTS "updated_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.writing_responses ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.writing_responses ADD COLUMN IF NOT EXISTS "attempt_id" TEXT NOT NULL;

ALTER TABLE public.writing_responses ADD COLUMN IF NOT EXISTS "task_id" TEXT NOT NULL;

ALTER TABLE public.writing_responses ADD COLUMN IF NOT EXISTS "task_version_id" TEXT NOT NULL;

ALTER TABLE public.writing_responses ADD COLUMN IF NOT EXISTS "task_number" INTEGER NOT NULL;

ALTER TABLE public.writing_responses ADD COLUMN IF NOT EXISTS "response_text" TEXT DEFAULT '' NOT NULL;

ALTER TABLE public.writing_responses ADD COLUMN IF NOT EXISTS "word_count" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.writing_responses ADD COLUMN IF NOT EXISTS "version" INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE public.writing_responses ADD COLUMN IF NOT EXISTS "parent_response_id" TEXT;

ALTER TABLE public.writing_responses ADD COLUMN IF NOT EXISTS "is_locked" INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.writing_responses ADD COLUMN IF NOT EXISTS "last_saved_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.writing_responses ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.writing_responses ADD COLUMN IF NOT EXISTS "updated_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "task_id" TEXT NOT NULL;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "version_number" INTEGER NOT NULL;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "task_type" TEXT NOT NULL;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "task_number" INTEGER NOT NULL;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "test_type" TEXT NOT NULL;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "subtype" TEXT;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "prompt" TEXT NOT NULL;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "instructions" TEXT NOT NULL;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "min_words" INTEGER DEFAULT 150 NOT NULL;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "suggested_time_minutes" INTEGER DEFAULT 20 NOT NULL;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "images_json" TEXT;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "structured_data_json" TEXT;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "teacher_visual_description" TEXT;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "model_response" TEXT;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "teacher_assessment_guidance" TEXT;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "validation_errors_json" TEXT;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "published_at" TEXT;

ALTER TABLE public.writing_task_versions ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.writing_tasks ADD COLUMN IF NOT EXISTS "id" TEXT;

ALTER TABLE public.writing_tasks ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL;

ALTER TABLE public.writing_tasks ADD COLUMN IF NOT EXISTS "task_type" TEXT NOT NULL;

ALTER TABLE public.writing_tasks ADD COLUMN IF NOT EXISTS "task_number" INTEGER NOT NULL;

ALTER TABLE public.writing_tasks ADD COLUMN IF NOT EXISTS "test_type" TEXT NOT NULL;

ALTER TABLE public.writing_tasks ADD COLUMN IF NOT EXISTS "current_version_number" INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE public.writing_tasks ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'draft' NOT NULL;

ALTER TABLE public.writing_tasks ADD COLUMN IF NOT EXISTS "created_by_id" TEXT NOT NULL;

ALTER TABLE public.writing_tasks ADD COLUMN IF NOT EXISTS "created_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.writing_tasks ADD COLUMN IF NOT EXISTS "updated_at" TEXT DEFAULT to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL;

ALTER TABLE public.writing_tasks ADD COLUMN IF NOT EXISTS "is_free_tier" INTEGER DEFAULT 0 NOT NULL;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assignment_access_grants_fk_0' AND conrelid = 'public.assignment_access_grants'::regclass) THEN ALTER TABLE public.assignment_access_grants ADD CONSTRAINT assignment_access_grants_fk_0 FOREIGN KEY ("student_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assignment_access_grants_fk_1' AND conrelid = 'public.assignment_access_grants'::regclass) THEN ALTER TABLE public.assignment_access_grants ADD CONSTRAINT assignment_access_grants_fk_1 FOREIGN KEY ("assignment_id") REFERENCES public.assignments ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assignments_fk_0' AND conrelid = 'public.assignments'::regclass) THEN ALTER TABLE public.assignments ADD CONSTRAINT assignments_fk_0 FOREIGN KEY ("created_by_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assignments_fk_1' AND conrelid = 'public.assignments'::regclass) THEN ALTER TABLE public.assignments ADD CONSTRAINT assignments_fk_1 FOREIGN KEY ("package_id") REFERENCES public.test_packages ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assignments_fk_2' AND conrelid = 'public.assignments'::regclass) THEN ALTER TABLE public.assignments ADD CONSTRAINT assignments_fk_2 FOREIGN KEY ("class_id") REFERENCES public.classes ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'class_enrolments_fk_0' AND conrelid = 'public.class_enrolments'::regclass) THEN ALTER TABLE public.class_enrolments ADD CONSTRAINT class_enrolments_fk_0 FOREIGN KEY ("student_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'class_enrolments_fk_1' AND conrelid = 'public.class_enrolments'::regclass) THEN ALTER TABLE public.class_enrolments ADD CONSTRAINT class_enrolments_fk_1 FOREIGN KEY ("class_id") REFERENCES public.classes ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'classes_fk_0' AND conrelid = 'public.classes'::regclass) THEN ALTER TABLE public.classes ADD CONSTRAINT classes_fk_0 FOREIGN KEY ("teacher_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commercial_entitlement_grants_fk_0' AND conrelid = 'public.commercial_entitlement_grants'::regclass) THEN ALTER TABLE public.commercial_entitlement_grants ADD CONSTRAINT commercial_entitlement_grants_fk_0 FOREIGN KEY ("user_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commercial_orders_fk_0' AND conrelid = 'public.commercial_orders'::regclass) THEN ALTER TABLE public.commercial_orders ADD CONSTRAINT commercial_orders_fk_0 FOREIGN KEY ("product_id") REFERENCES public.commercial_products ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commercial_orders_fk_1' AND conrelid = 'public.commercial_orders'::regclass) THEN ALTER TABLE public.commercial_orders ADD CONSTRAINT commercial_orders_fk_1 FOREIGN KEY ("user_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'listening_answers_fk_0' AND conrelid = 'public.listening_answers'::regclass) THEN ALTER TABLE public.listening_answers ADD CONSTRAINT listening_answers_fk_0 FOREIGN KEY ("attempt_id") REFERENCES public.listening_attempts ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'listening_attempts_fk_0' AND conrelid = 'public.listening_attempts'::regclass) THEN ALTER TABLE public.listening_attempts ADD CONSTRAINT listening_attempts_fk_0 FOREIGN KEY ("version_id") REFERENCES public.listening_test_versions ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'listening_attempts_fk_1' AND conrelid = 'public.listening_attempts'::regclass) THEN ALTER TABLE public.listening_attempts ADD CONSTRAINT listening_attempts_fk_1 FOREIGN KEY ("test_id") REFERENCES public.listening_tests ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'listening_attempts_fk_2' AND conrelid = 'public.listening_attempts'::regclass) THEN ALTER TABLE public.listening_attempts ADD CONSTRAINT listening_attempts_fk_2 FOREIGN KEY ("user_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'listening_attempts_fk_3' AND conrelid = 'public.listening_attempts'::regclass) THEN ALTER TABLE public.listening_attempts ADD CONSTRAINT listening_attempts_fk_3 FOREIGN KEY ("assignment_id") REFERENCES public.assignments ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'listening_test_versions_fk_0' AND conrelid = 'public.listening_test_versions'::regclass) THEN ALTER TABLE public.listening_test_versions ADD CONSTRAINT listening_test_versions_fk_0 FOREIGN KEY ("test_id") REFERENCES public.listening_tests ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'listening_tests_fk_0' AND conrelid = 'public.listening_tests'::regclass) THEN ALTER TABLE public.listening_tests ADD CONSTRAINT listening_tests_fk_0 FOREIGN KEY ("created_by_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'package_attempts_fk_0' AND conrelid = 'public.package_attempts'::regclass) THEN ALTER TABLE public.package_attempts ADD CONSTRAINT package_attempts_fk_0 FOREIGN KEY ("listening_attempt_id") REFERENCES public.listening_attempts ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'package_attempts_fk_1' AND conrelid = 'public.package_attempts'::regclass) THEN ALTER TABLE public.package_attempts ADD CONSTRAINT package_attempts_fk_1 FOREIGN KEY ("reading_attempt_id") REFERENCES public.reading_attempts ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'package_attempts_fk_2' AND conrelid = 'public.package_attempts'::regclass) THEN ALTER TABLE public.package_attempts ADD CONSTRAINT package_attempts_fk_2 FOREIGN KEY ("user_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'package_attempts_fk_3' AND conrelid = 'public.package_attempts'::regclass) THEN ALTER TABLE public.package_attempts ADD CONSTRAINT package_attempts_fk_3 FOREIGN KEY ("assignment_id") REFERENCES public.assignments ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'package_attempts_fk_4' AND conrelid = 'public.package_attempts'::regclass) THEN ALTER TABLE public.package_attempts ADD CONSTRAINT package_attempts_fk_4 FOREIGN KEY ("package_id") REFERENCES public.test_packages ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'package_attempts_fk_5' AND conrelid = 'public.package_attempts'::regclass) THEN ALTER TABLE public.package_attempts ADD CONSTRAINT package_attempts_fk_5 FOREIGN KEY ("speaking_ai_session_id") REFERENCES public.speaking_ai_sessions ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'package_attempts_fk_6' AND conrelid = 'public.package_attempts'::regclass) THEN ALTER TABLE public.package_attempts ADD CONSTRAINT package_attempts_fk_6 FOREIGN KEY ("writing_attempt_id") REFERENCES public.writing_attempts ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'package_attempts_fk_7' AND conrelid = 'public.package_attempts'::regclass) THEN ALTER TABLE public.package_attempts ADD CONSTRAINT package_attempts_fk_7 FOREIGN KEY ("speaking_assessment_id") REFERENCES public.speaking_assessments ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reading_answers_fk_0' AND conrelid = 'public.reading_answers'::regclass) THEN ALTER TABLE public.reading_answers ADD CONSTRAINT reading_answers_fk_0 FOREIGN KEY ("attempt_id") REFERENCES public.reading_attempts ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reading_attempts_fk_0' AND conrelid = 'public.reading_attempts'::regclass) THEN ALTER TABLE public.reading_attempts ADD CONSTRAINT reading_attempts_fk_0 FOREIGN KEY ("version_id") REFERENCES public.reading_test_versions ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reading_attempts_fk_1' AND conrelid = 'public.reading_attempts'::regclass) THEN ALTER TABLE public.reading_attempts ADD CONSTRAINT reading_attempts_fk_1 FOREIGN KEY ("test_id") REFERENCES public.reading_tests ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reading_attempts_fk_2' AND conrelid = 'public.reading_attempts'::regclass) THEN ALTER TABLE public.reading_attempts ADD CONSTRAINT reading_attempts_fk_2 FOREIGN KEY ("user_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reading_attempts_fk_3' AND conrelid = 'public.reading_attempts'::regclass) THEN ALTER TABLE public.reading_attempts ADD CONSTRAINT reading_attempts_fk_3 FOREIGN KEY ("assignment_id") REFERENCES public.assignments ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reading_test_versions_fk_0' AND conrelid = 'public.reading_test_versions'::regclass) THEN ALTER TABLE public.reading_test_versions ADD CONSTRAINT reading_test_versions_fk_0 FOREIGN KEY ("test_id") REFERENCES public.reading_tests ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reading_tests_fk_0' AND conrelid = 'public.reading_tests'::regclass) THEN ALTER TABLE public.reading_tests ADD CONSTRAINT reading_tests_fk_0 FOREIGN KEY ("created_by_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_ai_sessions_fk_0' AND conrelid = 'public.speaking_ai_sessions'::regclass) THEN ALTER TABLE public.speaking_ai_sessions ADD CONSTRAINT speaking_ai_sessions_fk_0 FOREIGN KEY ("set_version_id") REFERENCES public.speaking_set_versions ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_ai_sessions_fk_1' AND conrelid = 'public.speaking_ai_sessions'::regclass) THEN ALTER TABLE public.speaking_ai_sessions ADD CONSTRAINT speaking_ai_sessions_fk_1 FOREIGN KEY ("set_id") REFERENCES public.speaking_sets ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_ai_sessions_fk_2' AND conrelid = 'public.speaking_ai_sessions'::regclass) THEN ALTER TABLE public.speaking_ai_sessions ADD CONSTRAINT speaking_ai_sessions_fk_2 FOREIGN KEY ("package_attempt_id") REFERENCES public.package_attempts ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_ai_sessions_fk_3' AND conrelid = 'public.speaking_ai_sessions'::regclass) THEN ALTER TABLE public.speaking_ai_sessions ADD CONSTRAINT speaking_ai_sessions_fk_3 FOREIGN KEY ("assignment_id") REFERENCES public.assignments ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_ai_sessions_fk_4' AND conrelid = 'public.speaking_ai_sessions'::regclass) THEN ALTER TABLE public.speaking_ai_sessions ADD CONSTRAINT speaking_ai_sessions_fk_4 FOREIGN KEY ("user_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_allowance_ledger_fk_0' AND conrelid = 'public.speaking_allowance_ledger'::regclass) THEN ALTER TABLE public.speaking_allowance_ledger ADD CONSTRAINT speaking_allowance_ledger_fk_0 FOREIGN KEY ("created_by_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_allowance_ledger_fk_1' AND conrelid = 'public.speaking_allowance_ledger'::regclass) THEN ALTER TABLE public.speaking_allowance_ledger ADD CONSTRAINT speaking_allowance_ledger_fk_1 FOREIGN KEY ("user_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_assessments_fk_0' AND conrelid = 'public.speaking_assessments'::regclass) THEN ALTER TABLE public.speaking_assessments ADD CONSTRAINT speaking_assessments_fk_0 FOREIGN KEY ("set_version_id") REFERENCES public.speaking_set_versions ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_assessments_fk_1' AND conrelid = 'public.speaking_assessments'::regclass) THEN ALTER TABLE public.speaking_assessments ADD CONSTRAINT speaking_assessments_fk_1 FOREIGN KEY ("set_id") REFERENCES public.speaking_sets ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_assessments_fk_2' AND conrelid = 'public.speaking_assessments'::regclass) THEN ALTER TABLE public.speaking_assessments ADD CONSTRAINT speaking_assessments_fk_2 FOREIGN KEY ("package_attempt_id") REFERENCES public.package_attempts ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_assessments_fk_3' AND conrelid = 'public.speaking_assessments'::regclass) THEN ALTER TABLE public.speaking_assessments ADD CONSTRAINT speaking_assessments_fk_3 FOREIGN KEY ("assignment_id") REFERENCES public.assignments ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_assessments_fk_4' AND conrelid = 'public.speaking_assessments'::regclass) THEN ALTER TABLE public.speaking_assessments ADD CONSTRAINT speaking_assessments_fk_4 FOREIGN KEY ("class_id") REFERENCES public.classes ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_assessments_fk_5' AND conrelid = 'public.speaking_assessments'::regclass) THEN ALTER TABLE public.speaking_assessments ADD CONSTRAINT speaking_assessments_fk_5 FOREIGN KEY ("teacher_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_assessments_fk_6' AND conrelid = 'public.speaking_assessments'::regclass) THEN ALTER TABLE public.speaking_assessments ADD CONSTRAINT speaking_assessments_fk_6 FOREIGN KEY ("student_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_assessments_fk_7' AND conrelid = 'public.speaking_assessments'::regclass) THEN ALTER TABLE public.speaking_assessments ADD CONSTRAINT speaking_assessments_fk_7 FOREIGN KEY ("session_id") REFERENCES public.speaking_ai_sessions ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_audio_turns_fk_0' AND conrelid = 'public.speaking_audio_turns'::regclass) THEN ALTER TABLE public.speaking_audio_turns ADD CONSTRAINT speaking_audio_turns_fk_0 FOREIGN KEY ("session_id") REFERENCES public.speaking_ai_sessions ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_score_corrections_fk_0' AND conrelid = 'public.speaking_score_corrections'::regclass) THEN ALTER TABLE public.speaking_score_corrections ADD CONSTRAINT speaking_score_corrections_fk_0 FOREIGN KEY ("teacher_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_score_corrections_fk_1' AND conrelid = 'public.speaking_score_corrections'::regclass) THEN ALTER TABLE public.speaking_score_corrections ADD CONSTRAINT speaking_score_corrections_fk_1 FOREIGN KEY ("assessment_id") REFERENCES public.speaking_assessments ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_set_versions_fk_0' AND conrelid = 'public.speaking_set_versions'::regclass) THEN ALTER TABLE public.speaking_set_versions ADD CONSTRAINT speaking_set_versions_fk_0 FOREIGN KEY ("set_id") REFERENCES public.speaking_sets ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speaking_sets_fk_0' AND conrelid = 'public.speaking_sets'::regclass) THEN ALTER TABLE public.speaking_sets ADD CONSTRAINT speaking_sets_fk_0 FOREIGN KEY ("created_by_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'teacher_code_redemptions_fk_0' AND conrelid = 'public.teacher_code_redemptions'::regclass) THEN ALTER TABLE public.teacher_code_redemptions ADD CONSTRAINT teacher_code_redemptions_fk_0 FOREIGN KEY ("user_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'teacher_code_redemptions_fk_1' AND conrelid = 'public.teacher_code_redemptions'::regclass) THEN ALTER TABLE public.teacher_code_redemptions ADD CONSTRAINT teacher_code_redemptions_fk_1 FOREIGN KEY ("code_id") REFERENCES public.teacher_codes ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'teacher_codes_fk_0' AND conrelid = 'public.teacher_codes'::regclass) THEN ALTER TABLE public.teacher_codes ADD CONSTRAINT teacher_codes_fk_0 FOREIGN KEY ("created_by_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'teacher_codes_fk_1' AND conrelid = 'public.teacher_codes'::regclass) THEN ALTER TABLE public.teacher_codes ADD CONSTRAINT teacher_codes_fk_1 FOREIGN KEY ("class_id") REFERENCES public.classes ("id") ON DELETE SET NULL; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'test_packages_fk_0' AND conrelid = 'public.test_packages'::regclass) THEN ALTER TABLE public.test_packages ADD CONSTRAINT test_packages_fk_0 FOREIGN KEY ("reading_version_id") REFERENCES public.reading_test_versions ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'test_packages_fk_1' AND conrelid = 'public.test_packages'::regclass) THEN ALTER TABLE public.test_packages ADD CONSTRAINT test_packages_fk_1 FOREIGN KEY ("reading_test_id") REFERENCES public.reading_tests ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'test_packages_fk_2' AND conrelid = 'public.test_packages'::regclass) THEN ALTER TABLE public.test_packages ADD CONSTRAINT test_packages_fk_2 FOREIGN KEY ("listening_version_id") REFERENCES public.listening_test_versions ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'test_packages_fk_3' AND conrelid = 'public.test_packages'::regclass) THEN ALTER TABLE public.test_packages ADD CONSTRAINT test_packages_fk_3 FOREIGN KEY ("listening_test_id") REFERENCES public.listening_tests ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'test_packages_fk_4' AND conrelid = 'public.test_packages'::regclass) THEN ALTER TABLE public.test_packages ADD CONSTRAINT test_packages_fk_4 FOREIGN KEY ("created_by_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'test_packages_fk_5' AND conrelid = 'public.test_packages'::regclass) THEN ALTER TABLE public.test_packages ADD CONSTRAINT test_packages_fk_5 FOREIGN KEY ("writing_task2_version_id") REFERENCES public.writing_task_versions ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'test_packages_fk_6' AND conrelid = 'public.test_packages'::regclass) THEN ALTER TABLE public.test_packages ADD CONSTRAINT test_packages_fk_6 FOREIGN KEY ("writing_task2_id") REFERENCES public.writing_tasks ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'test_packages_fk_7' AND conrelid = 'public.test_packages'::regclass) THEN ALTER TABLE public.test_packages ADD CONSTRAINT test_packages_fk_7 FOREIGN KEY ("writing_task1_version_id") REFERENCES public.writing_task_versions ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'test_packages_fk_8' AND conrelid = 'public.test_packages'::regclass) THEN ALTER TABLE public.test_packages ADD CONSTRAINT test_packages_fk_8 FOREIGN KEY ("writing_task1_id") REFERENCES public.writing_tasks ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'test_packages_fk_9' AND conrelid = 'public.test_packages'::regclass) THEN ALTER TABLE public.test_packages ADD CONSTRAINT test_packages_fk_9 FOREIGN KEY ("speaking_set_version_id") REFERENCES public.speaking_set_versions ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'test_packages_fk_10' AND conrelid = 'public.test_packages'::regclass) THEN ALTER TABLE public.test_packages ADD CONSTRAINT test_packages_fk_10 FOREIGN KEY ("speaking_set_id") REFERENCES public.speaking_sets ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_subscriptions_fk_0' AND conrelid = 'public.user_subscriptions'::regclass) THEN ALTER TABLE public.user_subscriptions ADD CONSTRAINT user_subscriptions_fk_0 FOREIGN KEY ("code_id") REFERENCES public.teacher_codes ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_subscriptions_fk_1' AND conrelid = 'public.user_subscriptions'::regclass) THEN ALTER TABLE public.user_subscriptions ADD CONSTRAINT user_subscriptions_fk_1 FOREIGN KEY ("order_id") REFERENCES public.commercial_orders ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_subscriptions_fk_2' AND conrelid = 'public.user_subscriptions'::regclass) THEN ALTER TABLE public.user_subscriptions ADD CONSTRAINT user_subscriptions_fk_2 FOREIGN KEY ("plan_id") REFERENCES public.commercial_products ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_subscriptions_fk_3' AND conrelid = 'public.user_subscriptions'::regclass) THEN ALTER TABLE public.user_subscriptions ADD CONSTRAINT user_subscriptions_fk_3 FOREIGN KEY ("user_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_allowance_ledger_fk_0' AND conrelid = 'public.writing_allowance_ledger'::regclass) THEN ALTER TABLE public.writing_allowance_ledger ADD CONSTRAINT writing_allowance_ledger_fk_0 FOREIGN KEY ("created_by_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_allowance_ledger_fk_1' AND conrelid = 'public.writing_allowance_ledger'::regclass) THEN ALTER TABLE public.writing_allowance_ledger ADD CONSTRAINT writing_allowance_ledger_fk_1 FOREIGN KEY ("user_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_assessments_fk_0' AND conrelid = 'public.writing_assessments'::regclass) THEN ALTER TABLE public.writing_assessments ADD CONSTRAINT writing_assessments_fk_0 FOREIGN KEY ("attempt_id") REFERENCES public.writing_attempts ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_assessments_fk_1' AND conrelid = 'public.writing_assessments'::regclass) THEN ALTER TABLE public.writing_assessments ADD CONSTRAINT writing_assessments_fk_1 FOREIGN KEY ("response_id") REFERENCES public.writing_responses ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_attempts_fk_0' AND conrelid = 'public.writing_attempts'::regclass) THEN ALTER TABLE public.writing_attempts ADD CONSTRAINT writing_attempts_fk_0 FOREIGN KEY ("task2_version_id") REFERENCES public.writing_task_versions ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_attempts_fk_1' AND conrelid = 'public.writing_attempts'::regclass) THEN ALTER TABLE public.writing_attempts ADD CONSTRAINT writing_attempts_fk_1 FOREIGN KEY ("task2_id") REFERENCES public.writing_tasks ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_attempts_fk_2' AND conrelid = 'public.writing_attempts'::regclass) THEN ALTER TABLE public.writing_attempts ADD CONSTRAINT writing_attempts_fk_2 FOREIGN KEY ("task1_version_id") REFERENCES public.writing_task_versions ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_attempts_fk_3' AND conrelid = 'public.writing_attempts'::regclass) THEN ALTER TABLE public.writing_attempts ADD CONSTRAINT writing_attempts_fk_3 FOREIGN KEY ("task1_id") REFERENCES public.writing_tasks ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_attempts_fk_4' AND conrelid = 'public.writing_attempts'::regclass) THEN ALTER TABLE public.writing_attempts ADD CONSTRAINT writing_attempts_fk_4 FOREIGN KEY ("package_attempt_id") REFERENCES public.package_attempts ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_attempts_fk_5' AND conrelid = 'public.writing_attempts'::regclass) THEN ALTER TABLE public.writing_attempts ADD CONSTRAINT writing_attempts_fk_5 FOREIGN KEY ("assignment_id") REFERENCES public.assignments ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_attempts_fk_6' AND conrelid = 'public.writing_attempts'::regclass) THEN ALTER TABLE public.writing_attempts ADD CONSTRAINT writing_attempts_fk_6 FOREIGN KEY ("user_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_responses_fk_0' AND conrelid = 'public.writing_responses'::regclass) THEN ALTER TABLE public.writing_responses ADD CONSTRAINT writing_responses_fk_0 FOREIGN KEY ("parent_response_id") REFERENCES public.writing_responses ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_responses_fk_1' AND conrelid = 'public.writing_responses'::regclass) THEN ALTER TABLE public.writing_responses ADD CONSTRAINT writing_responses_fk_1 FOREIGN KEY ("task_version_id") REFERENCES public.writing_task_versions ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_responses_fk_2' AND conrelid = 'public.writing_responses'::regclass) THEN ALTER TABLE public.writing_responses ADD CONSTRAINT writing_responses_fk_2 FOREIGN KEY ("task_id") REFERENCES public.writing_tasks ("id") ON DELETE NO ACTION; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_responses_fk_3' AND conrelid = 'public.writing_responses'::regclass) THEN ALTER TABLE public.writing_responses ADD CONSTRAINT writing_responses_fk_3 FOREIGN KEY ("attempt_id") REFERENCES public.writing_attempts ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_task_versions_fk_0' AND conrelid = 'public.writing_task_versions'::regclass) THEN ALTER TABLE public.writing_task_versions ADD CONSTRAINT writing_task_versions_fk_0 FOREIGN KEY ("task_id") REFERENCES public.writing_tasks ("id") ON DELETE CASCADE; END IF; END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writing_tasks_fk_0' AND conrelid = 'public.writing_tasks'::regclass) THEN ALTER TABLE public.writing_tasks ADD CONSTRAINT writing_tasks_fk_0 FOREIGN KEY ("created_by_id") REFERENCES public.users ("id") ON DELETE NO ACTION; END IF; END $$;

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

CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id, purpose);

ALTER TABLE public.assignment_access_grants ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.assignment_access_grants FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.assignment_access_grants FROM authenticated; END IF; END $$;

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.assignments FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.assignments FROM authenticated; END IF; END $$;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.audit_logs FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.audit_logs FROM authenticated; END IF; END $$;

ALTER TABLE public.class_enrolments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.class_enrolments FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.class_enrolments FROM authenticated; END IF; END $$;

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.classes FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.classes FROM authenticated; END IF; END $$;

ALTER TABLE public.commercial_entitlement_grants ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.commercial_entitlement_grants FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.commercial_entitlement_grants FROM authenticated; END IF; END $$;

ALTER TABLE public.commercial_orders ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.commercial_orders FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.commercial_orders FROM authenticated; END IF; END $$;

ALTER TABLE public.commercial_products ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.commercial_products FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.commercial_products FROM authenticated; END IF; END $$;

ALTER TABLE public.listening_answers ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.listening_answers FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.listening_answers FROM authenticated; END IF; END $$;

ALTER TABLE public.listening_attempts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.listening_attempts FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.listening_attempts FROM authenticated; END IF; END $$;

ALTER TABLE public.listening_test_versions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.listening_test_versions FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.listening_test_versions FROM authenticated; END IF; END $$;

ALTER TABLE public.listening_tests ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.listening_tests FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.listening_tests FROM authenticated; END IF; END $$;

ALTER TABLE public.package_attempts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.package_attempts FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.package_attempts FROM authenticated; END IF; END $$;

ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.payment_webhook_events FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.payment_webhook_events FROM authenticated; END IF; END $$;

ALTER TABLE public.reading_answers ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.reading_answers FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.reading_answers FROM authenticated; END IF; END $$;

ALTER TABLE public.reading_attempts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.reading_attempts FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.reading_attempts FROM authenticated; END IF; END $$;

ALTER TABLE public.reading_test_versions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.reading_test_versions FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.reading_test_versions FROM authenticated; END IF; END $$;

ALTER TABLE public.reading_tests ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.reading_tests FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.reading_tests FROM authenticated; END IF; END $$;

ALTER TABLE public.speaking_ai_sessions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.speaking_ai_sessions FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.speaking_ai_sessions FROM authenticated; END IF; END $$;

ALTER TABLE public.speaking_allowance_ledger ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.speaking_allowance_ledger FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.speaking_allowance_ledger FROM authenticated; END IF; END $$;

ALTER TABLE public.speaking_assessments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.speaking_assessments FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.speaking_assessments FROM authenticated; END IF; END $$;

ALTER TABLE public.speaking_audio_turns ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.speaking_audio_turns FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.speaking_audio_turns FROM authenticated; END IF; END $$;

ALTER TABLE public.speaking_score_corrections ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.speaking_score_corrections FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.speaking_score_corrections FROM authenticated; END IF; END $$;

ALTER TABLE public.speaking_set_versions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.speaking_set_versions FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.speaking_set_versions FROM authenticated; END IF; END $$;

ALTER TABLE public.speaking_sets ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.speaking_sets FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.speaking_sets FROM authenticated; END IF; END $$;

ALTER TABLE public.teacher_code_redemptions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.teacher_code_redemptions FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.teacher_code_redemptions FROM authenticated; END IF; END $$;

ALTER TABLE public.teacher_codes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.teacher_codes FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.teacher_codes FROM authenticated; END IF; END $$;

ALTER TABLE public.test_packages ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.test_packages FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.test_packages FROM authenticated; END IF; END $$;

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.user_subscriptions FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.user_subscriptions FROM authenticated; END IF; END $$;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.users FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.users FROM authenticated; END IF; END $$;

ALTER TABLE public.writing_allowance_ledger ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.writing_allowance_ledger FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.writing_allowance_ledger FROM authenticated; END IF; END $$;

ALTER TABLE public.writing_assessments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.writing_assessments FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.writing_assessments FROM authenticated; END IF; END $$;

ALTER TABLE public.writing_attempts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.writing_attempts FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.writing_attempts FROM authenticated; END IF; END $$;

ALTER TABLE public.writing_responses ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.writing_responses FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.writing_responses FROM authenticated; END IF; END $$;

ALTER TABLE public.writing_task_versions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.writing_task_versions FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.writing_task_versions FROM authenticated; END IF; END $$;

ALTER TABLE public.writing_tasks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.writing_tasks FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.writing_tasks FROM authenticated; END IF; END $$;
