import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { isRetiredDemoAccount } from '../server/retiredDemoAccounts';

test('retired demo account matching is case insensitive and leaves real accounts available', () => {
  assert.equal(isRetiredDemoAccount(' Student@IELTSPlatform.test '), true);
  assert.equal(isRetiredDemoAccount('admin@example.com'), false);
  assert.equal(isRetiredDemoAccount(undefined), false);
});

test('startup creates no demo users; retired credentials and sessions are denied while real admins work', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'ielts-demo-retirement-'));
  process.env.DATABASE_PROVIDER = 'sqlite';
  process.env.SQLITE_DATA_DIR = directory;
  // Explicitly avoid inherited bootstrap values when testing an empty installation.
  delete process.env.INITIAL_ADMIN_EMAIL;
  delete process.env.INITIAL_ADMIN_PASSWORD;
  const { db, initDatabase } = await import('../server/db');
  const { seedDatabase } = await import('../server/seed');
  const { hashPassword, generateToken, mapUserRow } = await import('../server/auth');
  const { default: app } = await import('../server/app');
  let server: ReturnType<typeof app.listen> | undefined;
  try {
    await initDatabase();
    await seedDatabase();
    assert.equal((await db.prepare('SELECT COUNT(*) AS count FROM users').get()).count, 0);
    process.env.INITIAL_ADMIN_EMAIL = 'owner@fixtures.invalid';
    process.env.INITIAL_ADMIN_PASSWORD = 'OwnerFixturePassword123!';
    await seedDatabase();
    await seedDatabase();
    assert.equal((await db.prepare('SELECT COUNT(*) AS count FROM users').get()).count, 1);
    const owner = await db.prepare('SELECT * FROM users WHERE email = ?').get('owner@fixtures.invalid');
    assert.equal(owner.role, 'admin');
    await db.prepare("INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, 'admin')")
      .run('retired-demo', 'arik@ieltsplatform.test', hashPassword('OldDemoFixturePassword123!'), 'Retired Demo');
    const retired = await db.prepare('SELECT * FROM users WHERE id = ?').get('retired-demo');
    server = app.listen(0, '127.0.0.1');
    await new Promise<void>(resolve => server!.once('listening', resolve));
    const port = (server.address() as { port: number }).port;
    const request = (endpoint: string, body?: any, token?: string) => fetch(`http://127.0.0.1:${port}/api/${endpoint}`, {
      method: body ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    assert.equal((await request('auth/login', { email: 'arik@ieltsplatform.test', password: 'OldDemoFixturePassword123!' })).status, 401);
    assert.equal((await request('auth/me', undefined, generateToken(mapUserRow(retired)))).status, 401);
    assert.equal((await request('auth/register', { email: ' Student@ieltsplatform.test ', password: 'FixturePassword123!', fullName: 'Test' })).status, 400);
    assert.equal((await request('auth/forgot-password', { email: 'arik@ieltsplatform.test' })).status, 200);
    assert.equal((await db.prepare('SELECT reset_token FROM users WHERE id = ?').get(retired.id)).reset_token, null);
    const login = await request('auth/login', { email: 'owner@fixtures.invalid', password: 'OwnerFixturePassword123!' });
    assert.equal(login.status, 200);
    const { token } = await login.json();
    assert.equal((await request('auth/me', undefined, token)).status, 200);
    const users = await request('admin/users', undefined, token);
    assert.equal(users.status, 200);
    assert.deepEqual((await users.json()).users.map((user: any) => user.email), ['owner@fixtures.invalid']);
    assert.equal((await db.prepare('SELECT COUNT(*) AS count FROM users').get()).count, 2, 'retain records for history and ownership');
  } finally {
    if (server) await new Promise<void>((resolve, reject) => server!.close(error => error ? reject(error) : resolve()));
    await db.close();
    rmSync(directory, { recursive: true, force: true });
  }
});
