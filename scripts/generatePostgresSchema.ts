import fs from 'node:fs';
import { toPostgresSql } from '../server/postgresSql';

async function main() {
  process.env.SQLITE_MEMORY = 'true';
  const { db, initDatabase } = await import('../server/sqliteSchema');
  initDatabase();
  const tables = db.prepare("SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all() as {name:string;sql:string}[];
  const creates: string[] = [], columns: string[] = [], foreignKeys: string[] = [], privacy: string[] = [];
  for (const table of tables) {
    let sql = table.sql.replace(/CREATE TABLE\s+("?\w+"?)/i, 'CREATE TABLE IF NOT EXISTS $1');
    let fkIndex = 0;
    sql = sql.replace(/,?\s*FOREIGN KEY\s*\([^)]+\)\s*REFERENCES\s+("?\w+"?)\s*\([^)]+\)(\s+ON DELETE (?:CASCADE|SET NULL|RESTRICT))?/gi, '');
    sql = sql.replace(/\s+REFERENCES\s+("?\w+"?)\s*\([^)]+\)(\s+ON DELETE (?:CASCADE|SET NULL|RESTRICT))?/gi, '');
    const fks = db.prepare(`PRAGMA foreign_key_list("${table.name}")`).all() as any[];
    for (const fk of fks) {
      const name = `${table.name}_fk_${fkIndex++}`;
      foreignKeys.push(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${name}' AND conrelid = 'public.${table.name}'::regclass) THEN ALTER TABLE public.${table.name} ADD CONSTRAINT ${name} FOREIGN KEY ("${fk.from}") REFERENCES public.${fk.table} ("${fk.to}") ON DELETE ${fk.on_delete}; END IF; END $$;`);
    }
    sql = sql.replace(/,\s*\)/g, '\n)');
    creates.push(toPostgresSql(sql) + ';');
    const info = db.prepare(`PRAGMA table_info("${table.name}")`).all() as any[];
    for (const column of info) {
      const defaultSql = column.dflt_value === null ? '' : ' DEFAULT ' + toPostgresSql(column.dflt_value);
      columns.push(`ALTER TABLE public.${table.name} ADD COLUMN IF NOT EXISTS "${column.name}" ${column.type}${defaultSql}${column.notnull ? ' NOT NULL' : ''};`);
    }
    privacy.push(`ALTER TABLE public.${table.name} ENABLE ROW LEVEL SECURITY;\nDO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON public.${table.name} FROM anon; END IF; IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON public.${table.name} FROM authenticated; END IF; END $$;`);
  }
  const indexes = (db.prepare("SELECT sql FROM sqlite_master WHERE type = 'index' AND sql IS NOT NULL").all() as {sql:string}[]).map(row => row.sql.replace(/CREATE INDEX /i,'CREATE INDEX IF NOT EXISTS ') + ';');
  fs.mkdirSync('supabase/migrations', {recursive:true});
  const normalizeTimestamps = `DO $$ DECLARE field RECORD; BEGIN
    FOR field IN SELECT table_name, column_name, column_default FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name IN (${tables.map(table => `'${table.name}'`).join(',')})
      AND data_type IN ('timestamp with time zone', 'timestamp without time zone') LOOP
      EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I DROP DEFAULT', field.table_name, field.column_name);
      EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I TYPE TEXT USING to_char(%I::timestamptz AT TIME ZONE ''UTC'', ''YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'')', field.table_name, field.column_name, field.column_name);
      IF field.column_default IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I SET DEFAULT to_char(clock_timestamp() AT TIME ZONE ''UTC'', ''YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'')', field.table_name, field.column_name);
      END IF;
    END LOOP;
    FOR field IN SELECT table_name, column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name IN (${tables.map(table => `'${table.name}'`).join(',')})
      AND data_type = 'text' AND (column_name LIKE '%_at' OR column_name LIKE '%_until' OR column_name = 'reset_token_expires') LOOP
      EXECUTE format('UPDATE public.%I SET %I = to_char(%I::timestamp AT TIME ZONE ''UTC'' AT TIME ZONE ''UTC'', ''YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'') WHERE %I ~ ''^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}''', field.table_name, field.column_name, field.column_name, field.column_name);
    END LOOP;
  END $$;`;
  fs.writeFileSync('supabase/migrations/001_platform.sql', '-- Complete application schema. Access goes through the authenticated API.\n' + [...creates,normalizeTimestamps,...columns,...foreignKeys,...indexes,...privacy].join('\n\n') + '\n');
  console.log(`Generated schema for ${tables.length} tables.`);
  db.close();
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
