const Database = require('better-sqlite3');
const db = new Database('./data/ielts_platform.sqlite');

console.log('--- READING TESTS WITH 21 ---');
console.log(db.prepare("SELECT id, title, status FROM reading_tests WHERE title LIKE '%21%'").all());

console.log('\n--- ALL READING TESTS ---');
console.log(db.prepare("SELECT id, title, status FROM reading_tests").all());

console.log('\n--- ALL LISTENING TESTS ---');
console.log(db.prepare("SELECT id, title, status FROM listening_tests").all());

console.log('\n--- WRITING TASKS ---');
console.log(db.prepare("SELECT id, title, task_type, status FROM writing_tasks").all());

console.log('\n--- SPEAKING SETS ---');
console.log(db.prepare("SELECT id, title, status FROM speaking_sets LIMIT 5").all());

console.log('\n--- CORE USERS ---');
console.log(db.prepare("SELECT id, email, full_name, role FROM users WHERE email IN ('student@ieltsplatform.test', 'teacher@ieltsplatform.test', 'admin@ieltsplatform.test')").all());
