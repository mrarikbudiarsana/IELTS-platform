import { v4 as uuidv4 } from 'uuid';
import { db, initDatabase } from './db';
import { hashPassword } from './auth';
import { isRetiredDemoAccount, retiredDemoEmails } from './retiredDemoAccounts';

export async function seedDatabase() {
  await initDatabase();
  const placeholders = retiredDemoEmails.map(() => '?').join(',');
  const existingAdmin = await db.prepare(`SELECT id FROM users WHERE role = 'admin' AND LOWER(email) NOT IN (${placeholders}) LIMIT 1`).get(...retiredDemoEmails);
  if (existingAdmin) return;

  const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!email && !password) return;
  if (!email?.includes('@') || !password || password.length < 12 || isRetiredDemoAccount(email)) {
    throw new Error('Set INITIAL_ADMIN_EMAIL to your own email and INITIAL_ADMIN_PASSWORD to at least 12 characters.');
  }
  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) throw new Error('The initial admin email belongs to an existing account. Promote it using an administrator or the database.');

  await db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, created_at)
    VALUES (?, ?, ?, ?, 'admin', 'academic', datetime('now'))
  `).run(uuidv4(), email, hashPassword(password), 'Platform Administrator');
  console.log('Initial administrator configured.');
}
