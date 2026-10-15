import { seedDatabase } from './seed';
import { db } from './db';
import { retiredDemoEmails } from './retiredDemoAccounts';
import { seedListeningDatabase } from './listeningSeed';
import { seedCommercialProductsAndCodes } from './commercialSeed';
import { ingestCambridge21Test1 } from './ingestCambridge21Test1';
import { ingestCambridge21Test2 } from './ingestCambridge21Test2';
import { ingestCambridge21Test3 } from './ingestCambridge21Test3';
import { ingestCambridge21Test4 } from './ingestCambridge21Test4';
import { ingestCambridge21ListeningTest1 } from './ingestCambridge21ListeningTest1';
import { ingestCambridge21ListeningTest2 } from './ingestCambridge21ListeningTest2';
import { ingestCambridge21ListeningTest3 } from './ingestCambridge21ListeningTest3';
import { ingestCambridge21ListeningTest4 } from './ingestCambridge21ListeningTest4';
import { ingestCambridge19ListeningTest1 } from './ingestCambridge19ListeningTest1';
import { ingestCambridge19ListeningTest2 } from './ingestCambridge19ListeningTest2';
import { ingestCambridge19ListeningTest3 } from './ingestCambridge19ListeningTest3';
import { ingestCambridge19ReadingTest1 } from './ingestCambridge19ReadingTest1';
import { ingestCambridge19ReadingTest2 } from './ingestCambridge19ReadingTest2';
import { ingestCambridge19ReadingTest3 } from './ingestCambridge19ReadingTest3';

export async function seedLocalDatabase() {
  await seedDatabase();
  const placeholders = retiredDemoEmails.map(() => '?').join(',');
  const author = await db.prepare(`SELECT id FROM users WHERE role IN ('admin', 'teacher') AND LOWER(email) NOT IN (${placeholders}) LIMIT 1`).get(...retiredDemoEmails);
  if (!author) {
    console.log('Create a real administrator account before initializing local test content.');
    return;
  }
  await seedListeningDatabase();
  await seedCommercialProductsAndCodes();
  await ingestCambridge21Test1();
  await ingestCambridge21Test2();
  await ingestCambridge21Test3();
  await ingestCambridge21Test4();
  await ingestCambridge21ListeningTest1();
  await ingestCambridge21ListeningTest2();
  await ingestCambridge21ListeningTest3();
  await ingestCambridge21ListeningTest4();
  await ingestCambridge19ListeningTest1();
  await ingestCambridge19ListeningTest2();
  await ingestCambridge19ListeningTest3();
  await ingestCambridge19ReadingTest1();
  await ingestCambridge19ReadingTest2();
  await ingestCambridge19ReadingTest3();
}
