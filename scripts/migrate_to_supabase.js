const { Client } = require('pg');
const Database = require('better-sqlite3');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) {
    env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
});

const sqliteDb = new Database('./data/ielts_platform.sqlite');
const pgClient = new Client({
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  console.log('Connecting to Supabase PostgreSQL...');
  await pgClient.connect();

  console.log('--- 1. Creating Database Schema in Supabase ---');
  await pgClient.query(`
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
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
      created_by_id TEXT NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      is_free_tier INTEGER NOT NULL DEFAULT 0
    );

    -- Reading test versions
    CREATE TABLE IF NOT EXISTS reading_test_versions (
      id TEXT PRIMARY KEY,
      test_id TEXT NOT NULL REFERENCES reading_tests(id) ON DELETE CASCADE,
      version_number INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'archived')),
      passages_json TEXT NOT NULL,
      question_groups_json TEXT NOT NULL,
      total_questions INTEGER NOT NULL,
      validation_errors_json TEXT,
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(test_id, version_number)
    );

    -- Listening tests
    CREATE TABLE IF NOT EXISTS listening_tests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('practice', 'mock')),
      audio_mode TEXT NOT NULL DEFAULT 'part_audios' CHECK(audio_mode IN ('single_audio', 'part_audios')),
      time_limit_minutes INTEGER NOT NULL DEFAULT 40,
      current_version_number INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      created_by_id TEXT NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      is_free_tier INTEGER NOT NULL DEFAULT 0
    );

    -- Listening test versions
    CREATE TABLE IF NOT EXISTS listening_test_versions (
      id TEXT PRIMARY KEY,
      test_id TEXT NOT NULL REFERENCES listening_tests(id) ON DELETE CASCADE,
      version_number INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'archived')),
      parts_json TEXT NOT NULL,
      question_groups_json TEXT NOT NULL,
      total_questions INTEGER NOT NULL,
      audio_config_json TEXT NOT NULL,
      validation_errors_json TEXT,
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(test_id, version_number)
    );

    -- Writing tasks
    CREATE TABLE IF NOT EXISTS writing_tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      task_type TEXT NOT NULL CHECK(task_type IN ('academic_task_1', 'gt_task_1', 'task_2')),
      task_number INTEGER NOT NULL CHECK(task_number IN (1, 2)),
      test_type TEXT NOT NULL CHECK(test_type IN ('academic', 'general', 'both')),
      current_version_number INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      created_by_id TEXT NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      is_free_tier INTEGER NOT NULL DEFAULT 0
    );

    -- Writing task versions
    CREATE TABLE IF NOT EXISTS writing_task_versions (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES writing_tasks(id) ON DELETE CASCADE,
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
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(task_id, version_number)
    );

    -- Speaking sets
    CREATE TABLE IF NOT EXISTS speaking_sets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      current_version_number INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      created_by_id TEXT NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      is_free_tier INTEGER NOT NULL DEFAULT 0
    );

    -- Speaking set versions
    CREATE TABLE IF NOT EXISTS speaking_set_versions (
      id TEXT PRIMARY KEY,
      set_id TEXT NOT NULL REFERENCES speaking_sets(id) ON DELETE CASCADE,
      version_number INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'archived')),
      part1_topics_json TEXT NOT NULL,
      part2_cue_card_json TEXT NOT NULL,
      part3_discussion_json TEXT NOT NULL,
      teacher_notes TEXT,
      validation_errors_json TEXT,
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(set_id, version_number)
    );

    -- Student Reading Attempts
    CREATE TABLE IF NOT EXISTS reading_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      test_id TEXT NOT NULL REFERENCES reading_tests(id),
      version_id TEXT NOT NULL REFERENCES reading_test_versions(id),
      test_title TEXT NOT NULL,
      test_type TEXT NOT NULL,
      mode TEXT NOT NULL CHECK(mode IN ('practice', 'mock')),
      status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress', 'submitted', 'expired')),
      started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deadline_at TIMESTAMPTZ,
      submitted_at TIMESTAMPTZ,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      raw_score REAL,
      total_questions INTEGER NOT NULL,
      band_score REAL,
      is_first_attempt INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Student Listening Attempts
    CREATE TABLE IF NOT EXISTS listening_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      test_id TEXT NOT NULL REFERENCES listening_tests(id),
      version_id TEXT NOT NULL REFERENCES listening_test_versions(id),
      test_title TEXT NOT NULL,
      mode TEXT NOT NULL CHECK(mode IN ('practice', 'mock')),
      status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress', 'submitted', 'expired')),
      started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deadline_at TIMESTAMPTZ,
      submitted_at TIMESTAMPTZ,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      raw_score REAL,
      total_questions INTEGER NOT NULL,
      band_score REAL,
      is_first_attempt INTEGER NOT NULL DEFAULT 1,
      was_interrupted INTEGER NOT NULL DEFAULT 0,
      interruption_count INTEGER NOT NULL DEFAULT 0,
      replay_count INTEGER NOT NULL DEFAULT 0,
      interruption_events_json TEXT DEFAULT '[]',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  console.log('Schema created successfully.');

  console.log('\n--- 2. Migrating Core Users ---');
  const coreUsers = sqliteDb.prepare(`
    SELECT * FROM users
    WHERE email IN ('arik@ieltsplatform.test', 'student@ieltsplatform.test', 'independent@ieltsplatform.test')
  `).all();

  for (const u of coreUsers) {
    await pgClient.query(`
      INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, target_band, test_date, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role
    `, [u.id, u.email, u.password_hash, u.full_name, u.role, u.test_type_preference || 'not_sure', u.target_band, u.test_date, u.created_at || new Date().toISOString()]);
    console.log(`✓ User migrated: ${u.email} (${u.role})`);
  }

  console.log('\n--- 3. Migrating Cambridge 21 Academic Reading Test 4 ---');
  const c21Reading = sqliteDb.prepare("SELECT * FROM reading_tests WHERE title LIKE '%Cambridge IELTS 21%' LIMIT 1").get();
  if (c21Reading) {
    await pgClient.query(`
      INSERT INTO reading_tests (id, title, test_type, category, time_limit_minutes, current_version_number, status, created_by_id, created_at, updated_at, is_free_tier)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status
    `, [c21Reading.id, c21Reading.title, c21Reading.test_type, c21Reading.category, c21Reading.time_limit_minutes, c21Reading.current_version_number, c21Reading.status, c21Reading.created_by_id, c21Reading.created_at, c21Reading.updated_at, c21Reading.is_free_tier]);

    const c21Versions = sqliteDb.prepare("SELECT * FROM reading_test_versions WHERE test_id = ?").all(c21Reading.id);
    for (const v of c21Versions) {
      await pgClient.query(`
        INSERT INTO reading_test_versions (id, test_id, version_number, status, passages_json, question_groups_json, total_questions, validation_errors_json, published_at, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          passages_json = EXCLUDED.passages_json,
          question_groups_json = EXCLUDED.question_groups_json
      `, [v.id, v.test_id, v.version_number, v.status, v.passages_json, v.question_groups_json, v.total_questions, v.validation_errors_json, v.published_at, v.created_at]);
      console.log(`✓ Version ${v.version_number} migrated (${v.total_questions} questions)`);
    }
    console.log(`✓ Cambridge 21 Reading migrated: "${c21Reading.title}"`);
  }

  console.log('\n--- 4. Migrating Official Cambridge Listening Test 1 ---');
  const cListening = sqliteDb.prepare("SELECT * FROM listening_tests WHERE title LIKE '%Official%' OR title LIKE '%Cambridge%' LIMIT 1").get();
  if (cListening) {
    await pgClient.query(`
      INSERT INTO listening_tests (id, title, category, audio_mode, time_limit_minutes, current_version_number, status, created_by_id, created_at, updated_at, is_free_tier)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status
    `, [cListening.id, cListening.title, cListening.category, cListening.audio_mode, cListening.time_limit_minutes, cListening.current_version_number, cListening.status, cListening.created_by_id, cListening.created_at, cListening.updated_at, cListening.is_free_tier]);

    const lVersions = sqliteDb.prepare("SELECT * FROM listening_test_versions WHERE test_id = ?").all(cListening.id);
    for (const v of lVersions) {
      await pgClient.query(`
        INSERT INTO listening_test_versions (id, test_id, version_number, status, parts_json, question_groups_json, total_questions, audio_config_json, validation_errors_json, published_at, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          parts_json = EXCLUDED.parts_json,
          question_groups_json = EXCLUDED.question_groups_json
      `, [v.id, v.test_id, v.version_number, v.status, v.parts_json, v.question_groups_json, v.total_questions, v.audio_config_json, v.validation_errors_json, v.published_at, v.created_at]);
      console.log(`✓ Listening Version ${v.version_number} migrated`);
    }
    console.log(`✓ Official Listening migrated: "${cListening.title}"`);
  }

  console.log('\n--- 5. Verification: Querying Supabase Database ---');
  const uCount = await pgClient.query('SELECT count(*) FROM users');
  const rCount = await pgClient.query('SELECT title, total_questions FROM reading_tests t JOIN reading_test_versions v ON t.id = v.test_id WHERE v.status = \'published\'');
  const lCount = await pgClient.query('SELECT title, total_questions FROM listening_tests t JOIN listening_test_versions v ON t.id = v.test_id WHERE v.status = \'published\'');

  console.log(`Users in Supabase: ${uCount.rows[0].count}`);
  console.log('Reading in Supabase:', rCount.rows);
  console.log('Listening in Supabase:', lCount.rows);

  await pgClient.end();
  console.log('\nMigration to Supabase completed cleanly with NO test clutter!');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
