import { v4 as uuidv4 } from 'uuid';
import { db, initDatabase } from '../server/db';
import { hashPassword } from '../server/auth';

export async function seedTestUsers() {
  (await initDatabase());

  const existingUsers = (await db.prepare('SELECT COUNT(*) as count FROM users').get()) as any;
  if (existingUsers.count > 0) {
    console.log('Database already has users, skipping user seed.');
    return;
  }

  console.log('Seeding isolated test users...');

  // 1. Seed Teacher / Admin User
  const adminId = uuidv4();
  (await db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    adminId,
    'seed-admin@fixtures.invalid',
    hashPassword('IsolatedFixturePassword123!'),
    'Fixture Administrator',
    'admin',
    'academic'
  ));

  // 2. Seed Student Users
  const student1Id = uuidv4();
  (await db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, target_band, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    student1Id,
    'seed-student@fixtures.invalid',
    hashPassword('IsolatedFixturePassword123!'),
    'Sam Learner',
    'student',
    'academic',
    7.5
  ));

  const student2Id = uuidv4();
  (await db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, target_band, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    student2Id,
    'seed-independent@fixtures.invalid',
    hashPassword('IsolatedFixturePassword123!'),
    'Alex Independent',
    'student',
    'general',
    7.0
  ));

  console.log('Isolated test users seeded successfully.');
}
