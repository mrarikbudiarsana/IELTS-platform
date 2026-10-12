import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import type { Pool } from 'pg';

export async function startPostgres() {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_PROVIDER = 'postgres';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
  const pg = new PGlite();
  await pg.exec(fs.readFileSync('supabase/migrations/001_platform.sql', 'utf8'));
  const { useTestPool } = await import('../server/db');
  const query = async (sql: string, values?: any[]) => {
    const result = await pg.query(sql, values);
    return { ...result, rowCount: result.affectedRows || 0 };
  };
  const client = { query, release() {} };
  useTestPool({ query, connect: async () => client, end: async () => pg.close() } as unknown as Pool);
  return pg;
}
