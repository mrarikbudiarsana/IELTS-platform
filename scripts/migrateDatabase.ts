import '../server/environment';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { db } from '../server/db';

async function main() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_PROVIDER === 'sqlite') throw new Error('Set DATABASE_URL to your Supabase PostgreSQL connection string.');
  try {
    await db.transaction(async () => {
      await db.prepare('SELECT pg_advisory_xact_lock(?)').get(2026101201);
      await db.exec(`CREATE TABLE IF NOT EXISTS public._ielts_migrations (id TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT now()); ALTER TABLE public._ielts_migrations ENABLE ROW LEVEL SECURITY;`);
      for (const file of fs.readdirSync('supabase/migrations').filter(name => /^\d+_.*\.sql$/.test(name)).sort()) {
        const id = file.slice(0, -4);
        const sql = fs.readFileSync('supabase/migrations/' + file, 'utf8');
        const checksum = createHash('sha256').update(sql).digest('hex');
        const applied = await db.prepare('SELECT checksum FROM public._ielts_migrations WHERE id = ?').get(id);
        if (applied) {
          if (applied.checksum !== checksum) throw new Error('Migration checksum changed for ' + id);
          continue;
        }
        await db.exec(sql);
        await db.prepare('INSERT INTO public._ielts_migrations (id, checksum) VALUES (?, ?)').run(id, checksum);
        console.log('Applied ' + id);
      }
    })();
  } finally { await db.close(); }
}
main().catch(error => { console.error('Database migration failed:', error.code || error.message); process.exitCode = 1; });
