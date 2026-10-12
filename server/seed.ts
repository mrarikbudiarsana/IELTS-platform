import { v4 as uuidv4 } from 'uuid';
import { db, initDatabase } from './db';
import { hashPassword } from './auth';

export async function seedDatabase() {
  (await initDatabase());

  const existingUsers = (await db.prepare('SELECT COUNT(*) as count FROM users').get()) as any;
  if (existingUsers.count > 0) {
    console.log('Database already has users, skipping user seed.');
    return;
  }

  console.log('Seeding initial core users...');

  // 1. Seed Teacher / Admin User
  const adminId = uuidv4();
  (await db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    adminId,
    'arik@ieltsplatform.test',
    hashPassword('Password123!'),
    'Arik B (Teacher & Admin)',
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
    'student@ieltsplatform.test',
    hashPassword('Password123!'),
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
    'independent@ieltsplatform.test',
    hashPassword('Password123!'),
    'Alex Independent',
    'student',
    'general',
    7.0
  ));

  console.log('Core platform users seeded successfully.');
}
