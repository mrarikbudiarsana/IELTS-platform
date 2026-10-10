const Database = require('better-sqlite3');
const db = new Database('./data/ielts_platform.sqlite');

console.log('Distinct Reading Titles:');
console.log(db.prepare("SELECT DISTINCT title, id FROM reading_tests").all());

console.log('\nDistinct Listening Titles:');
console.log(db.prepare("SELECT DISTINCT title, id FROM listening_tests").all());

console.log('\nCore accounts:');
console.log(db.prepare("SELECT id, email, full_name, role FROM users WHERE email LIKE '%@ieltsplatform.test' OR email LIKE '%@gmail.com'").all());
