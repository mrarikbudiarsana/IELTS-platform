import Database from 'better-sqlite3';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Read .env.local
const envPath = path.resolve('.env.local');
const env: Record<string, string> = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
  });
}

const sqliteDb = new Database('./data/ielts_platform.sqlite');

const DEMO_EMAILS = [
  'arik@ieltsplatform.test',
  'student@ieltsplatform.test',
  'independent@ieltsplatform.test',
];

async function main() {
  console.log('================================================================');
  console.log(' CLEANING ALL WRITING, SPEAKING, CLASSES & NON-DEMO USERS');
  console.log(' Preserving: Demo Teacher & Students, Cambridge Reading & Listening');
  console.log('================================================================\n');

  // ==========================================================================
  // 1. LOCAL SQLITE CLEANUP
  // ==========================================================================
  console.log('--- 1. Cleaning SQLite Database ---');
  sqliteDb.pragma('foreign_keys = OFF');

  // 1.1 Clean all Speaking tables
  const speakingTables = [
    'speaking_score_corrections',
    'speaking_audio_turns',
    'speaking_ai_sessions',
    'speaking_assessments',
    'speaking_set_versions',
    'speaking_sets',
    'speaking_allowance_ledger',
  ];
  for (const table of speakingTables) {
    try {
      const res = sqliteDb.prepare(`DELETE FROM ${table}`).run();
      console.log(`✓ Deleted ${res.changes} rows from ${table}`);
    } catch (e: any) {
      console.log(`Table ${table}: ${e.message}`);
    }
  }

  // 1.2 Clean all Writing tables
  const writingTables = [
    'writing_assessments',
    'writing_responses',
    'writing_attempts',
    'writing_task_versions',
    'writing_tasks',
    'writing_allowance_ledger',
  ];
  for (const table of writingTables) {
    try {
      const res = sqliteDb.prepare(`DELETE FROM ${table}`).run();
      console.log(`✓ Deleted ${res.changes} rows from ${table}`);
    } catch (e: any) {
      console.log(`Table ${table}: ${e.message}`);
    }
  }

  // 1.3 Clean all Classes, Enrolments, Assignments & Test Packages
  const classTables = [
    'package_attempts',
    'assignment_access_grants',
    'assignments',
    'class_enrolments',
    'classes',
    'test_packages',
  ];
  for (const table of classTables) {
    try {
      const res = sqliteDb.prepare(`DELETE FROM ${table}`).run();
      console.log(`✓ Deleted ${res.changes} rows from ${table}`);
    } catch (e: any) {
      console.log(`Table ${table}: ${e.message}`);
    }
  }

  // 1.4 Get list of user IDs to keep
  const demoUsers = sqliteDb.prepare(
    `SELECT id, email, role FROM users WHERE email IN (${DEMO_EMAILS.map(() => '?').join(',')})`
  ).all(...DEMO_EMAILS) as any[];

  const demoUserIds = new Set(demoUsers.map((u) => u.id));

  // 1.5 Clean non-demo user data across remaining user-dependent tables
  const userDependentTables = [
    'reading_answers',
    'reading_attempts',
    'listening_answers',
    'listening_attempts',
    'user_subscriptions',
    'commercial_orders',
    'commercial_entitlement_grants',
    'teacher_code_redemptions',
    'teacher_codes',
    'payment_webhook_events',
    'audit_logs',
  ];

  for (const table of userDependentTables) {
    try {
      // Check column name for user reference
      const cols = sqliteDb.prepare(`PRAGMA table_info(${table})`).all() as any[];
      const colNames = cols.map((c) => c.name);
      const userCol = colNames.find((c) => ['user_id', 'student_id', 'created_by_id', 'teacher_id'].includes(c));
      if (userCol) {
        const placeholders = Array.from(demoUserIds).map(() => '?').join(',');
        if (demoUserIds.size > 0) {
          const res = sqliteDb.prepare(`DELETE FROM ${table} WHERE ${userCol} NOT IN (${placeholders})`).run(...Array.from(demoUserIds));
          console.log(`✓ Deleted ${res.changes} non-demo rows from ${table}`);
        } else {
          const res = sqliteDb.prepare(`DELETE FROM ${table}`).run();
          console.log(`✓ Deleted ${res.changes} rows from ${table}`);
        }
      }
    } catch (e: any) {
      console.log(`Table ${table} cleanup note: ${e.message}`);
    }
  }

  // 1.6 Delete all non-demo users
  const placeholders = DEMO_EMAILS.map(() => '?').join(',');
  const deletedUsers = sqliteDb.prepare(
    `DELETE FROM users WHERE email NOT IN (${placeholders})`
  ).run(...DEMO_EMAILS);
  console.log(`✓ Deleted ${deletedUsers.changes} non-demo user records from SQLite.`);

  // 1.7 Ensure the core demo users exist in SQLite
  const passwordHash = bcrypt.hashSync('Password123!', 10);

  const ensureDemoUser = (email: string, fullName: string, role: string, testType = 'academic', targetBand = 7.5) => {
    const existing = sqliteDb.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (!existing) {
      const id = uuidv4();
      sqliteDb.prepare(`
        INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, target_band, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(id, email, passwordHash, fullName, role, testType, targetBand);
      console.log(`✓ Seeded demo user: ${email} (${role})`);
    } else {
      // Update password to ensure it's Password123!
      sqliteDb.prepare('UPDATE users SET password_hash = ? WHERE email = ?').run(passwordHash, email);
      console.log(`✓ Verified demo user: ${email} (${role})`);
    }
  };

  ensureDemoUser('arik@ieltsplatform.test', 'Arik B (Teacher & Admin)', 'admin', 'academic');
  ensureDemoUser('student@ieltsplatform.test', 'Sam Learner', 'student', 'academic', 7.5);
  ensureDemoUser('independent@ieltsplatform.test', 'Alex Independent', 'student', 'general', 7.0);

  sqliteDb.pragma('foreign_keys = ON');

  const finalUsers = sqliteDb.prepare('SELECT id, email, role, full_name FROM users').all();
  console.log('\nRemaining SQLite Users:', finalUsers);

  // ==========================================================================
  // 2. REMOTE SUPABASE POSTGRESQL CLEANUP
  // ==========================================================================
  console.log('\n--- 2. Cleaning Supabase PostgreSQL Database ---');
  if (!env.DATABASE_URL) {
    console.warn('DATABASE_URL not found; skipping remote Supabase cleanup.');
    return;
  }

  const pgClient = new Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();
  console.log('Connected to Supabase PostgreSQL.');

  const allSbTablesRes = await pgClient.query(`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
  `);
  const allSbTables = allSbTablesRes.rows.map((r: any) => r.table_name);

  // Disable FK triggers temporarily during cascade deletion if needed, or delete in reverse FK order
  const remoteTablesToDeleteAll = [
    'speaking_score_corrections',
    'speaking_audio_turns',
    'speaking_ai_sessions',
    'speaking_assessments',
    'speaking_set_versions',
    'speaking_sets',
    'speaking_allowance_ledger',
    'writing_assessments',
    'writing_responses',
    'writing_attempts',
    'writing_task_versions',
    'writing_tasks',
    'writing_allowance_ledger',
    'package_attempts',
    'assignment_access_grants',
    'assignments',
    'class_enrolments',
    'classes',
    'test_packages',
  ];

  for (const t of remoteTablesToDeleteAll) {
    if (allSbTables.includes(t)) {
      try {
        const res = await pgClient.query(`DELETE FROM "${t}"`);
        console.log(`✓ Supabase: Deleted ${res.rowCount} rows from ${t}`);
      } catch (err: any) {
        console.log(`Supabase table ${t}: ${err.message}`);
      }
    }
  }

  // Delete non-demo users in Supabase
  if (allSbTables.includes('users')) {
    try {
      // First clean attempts from non-demo users
      if (allSbTables.includes('reading_answers')) {
        await pgClient.query(`DELETE FROM "reading_answers" WHERE user_id NOT IN (SELECT id FROM users WHERE email = ANY($1))`, [DEMO_EMAILS]);
      }
      if (allSbTables.includes('reading_attempts')) {
        await pgClient.query(`DELETE FROM "reading_attempts" WHERE user_id NOT IN (SELECT id FROM users WHERE email = ANY($1))`, [DEMO_EMAILS]);
      }
      if (allSbTables.includes('listening_answers')) {
        await pgClient.query(`DELETE FROM "listening_answers" WHERE user_id NOT IN (SELECT id FROM users WHERE email = ANY($1))`, [DEMO_EMAILS]);
      }
      if (allSbTables.includes('listening_attempts')) {
        await pgClient.query(`DELETE FROM "listening_attempts" WHERE user_id NOT IN (SELECT id FROM users WHERE email = ANY($1))`, [DEMO_EMAILS]);
      }
      if (allSbTables.includes('user_subscriptions')) {
        await pgClient.query(`DELETE FROM "user_subscriptions" WHERE user_id NOT IN (SELECT id FROM users WHERE email = ANY($1))`, [DEMO_EMAILS]);
      }
      if (allSbTables.includes('commercial_orders')) {
        await pgClient.query(`DELETE FROM "commercial_orders" WHERE user_id NOT IN (SELECT id FROM users WHERE email = ANY($1))`, [DEMO_EMAILS]);
      }
      if (allSbTables.includes('commercial_entitlement_grants')) {
        await pgClient.query(`DELETE FROM "commercial_entitlement_grants" WHERE user_id NOT IN (SELECT id FROM users WHERE email = ANY($1))`, [DEMO_EMAILS]);
      }

      const res = await pgClient.query(`DELETE FROM "users" WHERE email NOT IN ($1, $2, $3)`, DEMO_EMAILS);
      console.log(`✓ Supabase: Deleted ${res.rowCount} non-demo user records.`);

      // Ensure demo users in Supabase
      for (const email of DEMO_EMAILS) {
        const check = await pgClient.query(`SELECT id FROM "users" WHERE email = $1`, [email]);
        if (check.rows.length === 0) {
          const role = email.includes('arik') ? 'admin' : 'student';
          const name = email.includes('arik') ? 'Arik B (Teacher & Admin)' : email.includes('independent') ? 'Alex Independent' : 'Sam Learner';
          await pgClient.query(`
            INSERT INTO "users" (id, email, password_hash, full_name, role, test_type_preference, created_at)
            VALUES ($1, $2, $3, $4, $5, 'academic', NOW())
          `, [uuidv4(), email, passwordHash, name, role]);
          console.log(`✓ Supabase: Seeded demo user ${email}`);
        } else {
          await pgClient.query(`UPDATE "users" SET password_hash = $1 WHERE email = $2`, [passwordHash, email]);
          console.log(`✓ Supabase: Verified demo user ${email}`);
        }
      }
    } catch (e: any) {
      console.log(`Supabase users cleanup: ${e.message}`);
    }
  }

  await pgClient.end();
  console.log('\n================================================================');
  console.log(' DATABASE CLEANUP COMPLETE!');
  console.log('================================================================');
}

main().catch((err) => {
  console.error('Fatal error during cleanup:', err);
  process.exit(1);
});
