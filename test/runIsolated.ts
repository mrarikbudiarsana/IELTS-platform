import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const directory = mkdtempSync(path.join(tmpdir(), 'ielts-tests-'));
try {
  const result = spawnSync(process.execPath, ['--import', 'tsx', 'test/runSeededSuite.ts'], {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_PROVIDER: 'sqlite', SQLITE_DATA_DIR: directory },
  });
  process.exitCode = result.status ?? 1;
} finally { rmSync(directory, { recursive: true, force: true }); }
