import assert from 'node:assert/strict';
import { startPostgres } from './postgresHarness';
import { toPostgresSql } from '../server/postgresSql';

async function main() {
  const pg = await startPostgres();
  try {
  const { db, initDatabase } = await import('../server/db');
  const { seedLocalDatabase } = await import('../server/seedLocalDatabase');
  await initDatabase();
  await seedLocalDatabase();
  const { listTests, getVersionById } = await import('../server/readingService');
  const { listListeningTests } = await import('../server/listeningService');
  const { hashPassword } = await import('../server/auth');
  const { startOrResumeAttempt, saveStudentAnswer, submitAttempt } = await import('../server/attemptService');
  const { grantTestingAllowance, getUserAllowanceBalance, reserveAllowance } = await import('../server/allowanceService');
  const { createClass, enrolStudentByEmail } = await import('../server/classService');
  const { getClassOverview } = await import('../server/assignmentService');
  const teacher = await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
  await db.prepare("INSERT INTO users (id, email, password_hash, full_name, role, plan_type) VALUES (?, ?, ?, ?, 'student', 'paid_plan')").run('pg-student', 'pg-student@test.invalid', hashPassword('PgTestOnlyPassword!'), 'Postgres Student');
  const reading = await listTests({isTeacherOrAdmin:false});
  const listening = await listListeningTests({isTeacherOrAdmin:false});
  assert.equal(reading.length, 4);
  assert.equal(listening.length, 5);
  const test = reading[0];
  const { attempt, testVersion } = await startOrResumeAttempt({userId:'pg-student',testId:test.id});
  assert.equal(testVersion.questionGroups[0].questions[0].answerKey, undefined);
  const original = await getVersionById(attempt.versionId);
  const question = original!.questionGroups[0].questions[0];
  await saveStudentAnswer({userId:'pg-student',attemptId:attempt.id,questionId:question.id,questionNumber:question.questionNumber,userAnswer:question.answerKey,isFlagged:false});
  const submitted = await submitAttempt({userId:'pg-student',attemptId:attempt.id});
  assert.equal(submitted.status, 'submitted');
  assert.ok(submitted.rawScore! > 0);
  const createdClass = await createClass(teacher.id,{title:'Postgres Class',testType:'academic'});
  await enrolStudentByEmail(teacher.id,createdClass.id,'pg-student@test.invalid');
  const overview = await getClassOverview(createdClass.id,teacher.id);
  assert.equal(overview.totalStudents,1);
  await grantTestingAllowance({userId:'pg-student',adminId:teacher.id,amount:3,notes:'PG test'});
  assert.equal((await getUserAllowanceBalance('pg-student')).available,3);
  await reserveAllowance({userId:'pg-student',assessmentId:'pg-assessment',responseId:'pg-response',idempotencyKey:'pg-reserve'});
  await reserveAllowance({userId:'pg-student',assessmentId:'pg-assessment',responseId:'pg-response',idempotencyKey:'pg-reserve'});
  assert.equal((await getUserAllowanceBalance('pg-student')).available,2);
  await assert.rejects(db.transaction(async () => {
    await db.prepare("UPDATE users SET full_name = ? WHERE id = ?").run('Rolled back','pg-student');
    throw new Error('rollback test');
  })(),/rollback test/);
  assert.equal((await db.prepare('SELECT full_name FROM users WHERE id = ?').get('pg-student')).full_name,'Postgres Student');
  const past = new Date(Date.now()-60000).toISOString();
  const future = new Date(Date.now()+60000).toISOString();
  assert.equal((await db.prepare("SELECT CASE WHEN ? < datetime('now') AND ? > datetime('now') THEN 1 ELSE 0 END AS correct").get(past,future)).correct,1);
  assert.equal(toPostgresSql("SELECT '?' AS literal, ? AS bound -- ?\n"),"SELECT '?' AS literal, $1 AS bound -- ?\n");
  const privacy = await pg.query("SELECT count(*)::integer AS count FROM pg_class WHERE relnamespace = 'public'::regnamespace AND relkind = 'r' AND NOT relrowsecurity");
  assert.equal((privacy.rows[0] as any).count,0);
  await pg.exec('ALTER TABLE public.users ADD COLUMN migration_test TEXT;');
  await pg.exec("ALTER TABLE public.users ALTER COLUMN created_at DROP DEFAULT; ALTER TABLE public.users ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at::timestamptz; ALTER TABLE public.users ALTER COLUMN created_at SET DEFAULT now();");
  await pg.exec((await import('node:fs')).readFileSync('supabase/migrations/001_platform.sql','utf8'));
  assert.equal((await db.prepare('SELECT full_name FROM users WHERE id = ?').get('pg-student')).full_name,'Postgres Student');
  console.log('PostgreSQL integration passed: schema, seeds, reading, listening catalogue, class overview, allowances, rollback, SQL binding, RLS, and repeat migration.');
  } finally { await pg.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
