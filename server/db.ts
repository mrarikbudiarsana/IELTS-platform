import './environment';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Pool, PoolClient } from 'pg';
import fs from 'node:fs';
import type Database from 'better-sqlite3';
import { toPostgresSql } from './postgresSql';

const postgres = Boolean(process.env.DATABASE_URL) && process.env.DATABASE_PROVIDER !== 'sqlite';
if (process.env.NETLIFY && !postgres) throw new Error('Netlify requires DATABASE_URL for Supabase PostgreSQL.');
const context = new AsyncLocalStorage<PoolClient>();
const sqliteContext = new AsyncLocalStorage<boolean>();
let sqlite: Database.Database | undefined;
let pool: Pool | undefined;
export function useTestPool(testPool: Pool) {
  if (process.env.NODE_ENV !== 'test') throw new Error('Test database injection is only available in tests.');
  pool = testPool;
}
function getPool() {
  const ca = process.env.DATABASE_SSL_CA?.replace(/\\n/g, '\n') || (process.env.DATABASE_SSL_CA_FILE ? fs.readFileSync(process.env.DATABASE_SSL_CA_FILE, 'utf8') : undefined);
  return pool ||= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000,
    allowExitOnIdle: true,
    ssl: process.env.DATABASE_SSL === 'false' ? false : {
      rejectUnauthorized: true,
      ...(ca ? { ca } : {}),
    },
  });
}
async function getSqlite() {
  if (!sqlite) sqlite = (await import('./sqliteSchema')).db;
  return sqlite;
}
async function query(sql: string, args: any[]) {
  const values = args.map(value => value === undefined ? null : typeof value === 'boolean' ? Number(value) : value);
  const result = await (context.getStore() || getPool()).query(toPostgresSql(sql), values);
  return { rows: result.rows.map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => {
    const field = result.fields.find(field => field.name === key);
    return [key, field?.dataTypeID === 20 && typeof value === 'string' && Number.isSafeInteger(Number(value)) ? Number(value) : value];
  }))), changes: result.rowCount || 0 };
}

// The shared asynchronous interface also keeps local SQLite tests available.
export const db = {
  prepare(sql: string) {
    return {
      async get(...args: any[]): Promise<any> {
        if (postgres) return (await query(sql, args)).rows[0];
        return (await getSqlite()).prepare(sql).get(...args);
      },
      async all(...args: any[]): Promise<any[]> {
        if (postgres) return (await query(sql, args)).rows;
        return (await getSqlite()).prepare(sql).all(...args);
      },
      async run(...args: any[]) {
        if (postgres) return { changes: (await query(sql, args)).changes };
        return (await getSqlite()).prepare(sql).run(...args);
      },
    };
  },
  async exec(sql: string) {
    if (postgres) { await (context.getStore() || getPool()).query(toPostgresSql(sql)); return; }
    (await getSqlite()).exec(sql);
  },
  transaction<T>(work: (...args: any[]) => T | Promise<T>) {
    return async (...args: any[]): Promise<T> => {
      if (postgres) {
        if (context.getStore()) return work(...args);
        const client = await getPool().connect();
        try {
          await client.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
          const value = await context.run(client, () => work(...args));
          await client.query('COMMIT');
          return value;
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally { client.release(); }
      }
      if (sqliteContext.getStore()) return work(...args);
      const local = await getSqlite();
      local.exec('BEGIN IMMEDIATE');
      try {
        const value = await sqliteContext.run(true, () => work(...args));
        local.exec('COMMIT');
        return value;
      } catch (error) { local.exec('ROLLBACK'); throw error; }
    };
  },
  async close() {
    if (pool) await pool.end();
    if (sqlite) sqlite.close();
  },
  async pragma(sql: string) {
    if (postgres) throw new Error('SQLite PRAGMA is not supported on PostgreSQL.');
    return (await getSqlite()).pragma(sql);
  },
};

export async function initDatabase() {
  if (postgres) {
    await query('SELECT id FROM users LIMIT 0', []);
  } else {
    (await import('./sqliteSchema')).initDatabase();
  }
}
