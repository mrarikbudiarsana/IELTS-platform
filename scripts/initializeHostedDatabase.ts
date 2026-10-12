import '../server/environment';
import { randomUUID } from 'node:crypto';
import { db, initDatabase } from '../server/db';
import { hashPassword } from '../server/auth';
import { ingestCambridge21Test1, getCambridge21Test1Data } from '../server/ingestCambridge21Test1';
import { ingestCambridge21Test2, getCambridge21Test2Data } from '../server/ingestCambridge21Test2';
import { ingestCambridge21Test3, getCambridge21Test3Data } from '../server/ingestCambridge21Test3';
import { ingestCambridge21Test4, getCambridge21Test4Data } from '../server/ingestCambridge21Test4';
import { ingestCambridge21ListeningTest1, getCambridge21ListeningTest1Data } from '../server/ingestCambridge21ListeningTest1';
import { ingestCambridge21ListeningTest2, getCambridge21ListeningTest2Data } from '../server/ingestCambridge21ListeningTest2';
import { ingestCambridge21ListeningTest3, getCambridge21ListeningTest3Data } from '../server/ingestCambridge21ListeningTest3';
import { ingestCambridge21ListeningTest4, getCambridge21ListeningTest4Data } from '../server/ingestCambridge21ListeningTest4';
import { ingestCambridge19ListeningTest1, getCambridge19ListeningTest1Data } from '../server/ingestCambridge19ListeningTest1';
import { seedCommercialProductsAndCodes } from '../server/commercialSeed';

async function main() {
  const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!process.env.DATABASE_URL || process.env.DATABASE_PROVIDER === 'sqlite') throw new Error('Hosted initialization requires DATABASE_URL.');
  if (!email?.includes('@') || !password || password.length < 12) throw new Error('Set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD (at least 12 characters) in your local environment.');
  try {
    await initDatabase();
    await db.transaction(async () => {
      const user = await db.prepare('SELECT id, role FROM users WHERE email = ?').get(email);
      if (user && user.role !== 'admin') throw new Error('This email already belongs to a non-admin account.');
      const adminId = user?.id || randomUUID();
      if (user) await db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(password),adminId);
      else await db.prepare("INSERT INTO users (id,email,password_hash,full_name,role) VALUES (?,?,?,?,'admin')").run(adminId,email,hashPassword(password),'Platform Administrator');
      const reading = [[getCambridge21Test1Data,ingestCambridge21Test1],[getCambridge21Test2Data,ingestCambridge21Test2],[getCambridge21Test3Data,ingestCambridge21Test3],[getCambridge21Test4Data,ingestCambridge21Test4]] as const;
      const listening = [[getCambridge21ListeningTest1Data,ingestCambridge21ListeningTest1],[getCambridge21ListeningTest2Data,ingestCambridge21ListeningTest2],[getCambridge21ListeningTest3Data,ingestCambridge21ListeningTest3],[getCambridge21ListeningTest4Data,ingestCambridge21ListeningTest4],[getCambridge19ListeningTest1Data,ingestCambridge19ListeningTest1]] as const;
      for (const [data,ingest] of reading) if (!await db.prepare('SELECT id FROM reading_tests WHERE title = ?').get(data().title)) await ingest(adminId);
      for (const [data,ingest] of listening) if (!await db.prepare('SELECT id FROM listening_tests WHERE title = ?').get(data().title)) await ingest(adminId);
      await seedCommercialProductsAndCodes();
    })();
    console.log('Administrator credentials configured; missing Cambridge tests and pilot products added. Existing tests and attempts were preserved.');
  } finally { await db.close(); }
}
main().catch(error => { console.error('Hosted initialization failed:',error.code || error.message); process.exitCode = 1; });
