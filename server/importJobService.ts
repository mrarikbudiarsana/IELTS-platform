import { randomUUID, createHash } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { JWT_SECRET } from './auth';
import { extractReadingPdf, extractReadingText, PdfImportError, validateImportPdf } from './readingPdfImportService';
import { extractEditorPdf, extractEditorText } from './textImportService';
import { TEXT_IMPORT_MAX_CHARS } from '../shared/readingPdfImport';

export type ImportSkill = 'reading' | 'listening' | 'writing' | 'speaking';
export type ImportSource = 'text' | 'pdf';
const lifetime = 12 * 60 * 1000;
let ready: Promise<void> | undefined;

// Additive initialization also supports existing hosted databases without a manual migration.
async function ensureTable() {
  await (ready ||= db.transaction(async () => {
    if (process.env.DATABASE_URL && process.env.DATABASE_PROVIDER !== 'sqlite') {
      await db.prepare('SELECT pg_advisory_xact_lock(?)').get(2026101301);
    }
    await db.exec(`CREATE TABLE IF NOT EXISTS question_import_jobs (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL, skill TEXT NOT NULL, source TEXT NOT NULL,
      fingerprint TEXT NOT NULL, active_key TEXT UNIQUE, status TEXT NOT NULL,
      input_json TEXT, result_json TEXT, error TEXT, created_at TEXT NOT NULL, expires_at TEXT NOT NULL
    )`);
    await db.exec('CREATE INDEX IF NOT EXISTS question_import_jobs_expiry ON question_import_jobs(expires_at)');
    if (process.env.DATABASE_URL && process.env.DATABASE_PROVIDER !== 'sqlite') {
      await db.exec('ALTER TABLE question_import_jobs ENABLE ROW LEVEL SECURITY');
      await db.exec(`DO $$ BEGIN
          IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON question_import_jobs FROM anon; END IF;
          IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON question_import_jobs FROM authenticated; END IF;
        END $$;`);
    }
  })().catch(error => { ready = undefined; throw error; }));
}

export async function startImportJob(userId: string, skill: string, source: string, body: any) {
  if (!['reading', 'listening', 'writing', 'speaking'].includes(skill) || !['text', 'pdf'].includes(source)) {
    throw new PdfImportError('Unknown import section or source.', 404);
  }
  if (source === 'pdf') await validateImportPdf(body);
  else {
    if (!body || typeof body.text !== 'string' || !body.text.trim()) throw new PdfImportError('Paste the test text to import.');
    if (body.text.length > TEXT_IMPORT_MAX_CHARS) throw new PdfImportError('Pasted text must be at most 60,000 characters.');
    if (typeof body.focus !== 'string' || body.focus.length > 2000) throw new PdfImportError('Selection notes must be at most 2,000 characters.');
  }
  if (!process.env.OPENAI_API_KEY?.trim()) throw new PdfImportError('Import is unavailable. Ask the administrator to configure OPENAI_API_KEY.', 503);
  await ensureTable();
  const now = new Date().toISOString();
  await db.prepare('DELETE FROM question_import_jobs WHERE expires_at < ?').run(now);
  const input = source === 'pdf' ? { pdfBase64: body.pdfBase64, focus: body.focus } : { text: body.text.trim(), focus: body.focus };
  const fingerprint = createHash('sha256').update(JSON.stringify({ skill, source, input })).digest('hex');
  const id = randomUUID();
  const inserted = await db.prepare(`INSERT INTO question_import_jobs
    (id, user_id, skill, source, fingerprint, active_key, status, input_json, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, 'queued', ?, ?, ?) ON CONFLICT (active_key) DO NOTHING`)
    .run(id, userId, skill, source, fingerprint, userId, JSON.stringify(input), now, new Date(Date.now() + lifetime).toISOString());
  if (!inserted.changes) {
    const current = await db.prepare('SELECT id, fingerprint FROM question_import_jobs WHERE active_key = ?').get(userId);
    if (current?.fingerprint === fingerprint) return { jobId: current.id };
    throw new PdfImportError('A test import is already running for your account. Please wait.', 429);
  }
  if (!process.env.NETLIFY) {
    setImmediate(() => { processImportJob(id).catch(error => console.error('Import worker failed:', error.name)); });
  }
  return { jobId: id };
}

export async function getImportJob(userId: string, id: string) {
  await ensureTable();
  const job = await db.prepare('SELECT * FROM question_import_jobs WHERE id = ? AND user_id = ?').get(id, userId);
  if (!job) throw new PdfImportError('Import not found. Extract the source again.', 404);
  if (job.expires_at < new Date().toISOString()) {
    await db.prepare('DELETE FROM question_import_jobs WHERE id = ? AND user_id = ?').run(id, userId);
    throw new PdfImportError('Import expired. Extract the source again.', 410);
  }
  return { status: job.status, ...(job.status === 'completed' ? { result: JSON.parse(job.result_json) } : {}),
    // The authorized browser invokes the same-origin worker with its existing Netlify session.
    // A server self-fetch cannot pass through protected-site login. Grant only this job.
    ...(job.status === 'queued' && process.env.NETLIFY ? { dispatch: {
      path: '/.netlify/functions/import-questions-background',
      token: jwt.sign({ jobId: id }, JWT_SECRET, { algorithm: 'HS256', audience: 'import-worker', expiresIn: '15m' }),
    } } : {}),
    ...(job.status === 'failed' ? { error: job.error } : {}) };
}

export async function processImportJob(id: string) {
  await ensureTable();
  const claimed = await db.prepare(`UPDATE question_import_jobs SET status = 'processing'
    WHERE id = ? AND status = 'queued' AND expires_at > ?`).run(id, new Date().toISOString());
  if (!claimed.changes) return; // Netlify retries must not repeat provider calls.
  const job = await db.prepare('SELECT * FROM question_import_jobs WHERE id = ?').get(id);
  try {
    const body = JSON.parse(job.input_json);
    const result = job.skill === 'reading'
      ? await (job.source === 'pdf' ? extractReadingPdf(body) : extractReadingText(body))
      : await (job.source === 'pdf' ? extractEditorPdf(job.skill, body) : extractEditorText(job.skill, body));
    await db.prepare(`UPDATE question_import_jobs SET status = 'completed', result_json = ?, input_json = NULL,
      active_key = NULL, expires_at = ? WHERE id = ?`).run(JSON.stringify(result), new Date(Date.now() + 60 * 60 * 1000).toISOString(), id);
  } catch (error) {
    await db.prepare(`UPDATE question_import_jobs SET status = 'failed', error = ?, input_json = NULL,
      active_key = NULL WHERE id = ?`).run(error instanceof PdfImportError ? error.message : 'Extraction failed. Please retry.', id);
  }
}
