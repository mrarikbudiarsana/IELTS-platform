const Database = require('better-sqlite3');
const db = new Database('./data/ielts_platform.sqlite');

const c21Tests = db.prepare("SELECT * FROM reading_tests WHERE title LIKE '%21%'").all();
console.log('Cambridge 21 Reading Tests:', c21Tests);

const officialListening = db.prepare("SELECT * FROM listening_tests WHERE title LIKE '%Official%' OR title LIKE '%Cambridge%'").all();
console.log('\nOfficial Listening Tests:', officialListening);
