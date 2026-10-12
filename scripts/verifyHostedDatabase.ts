import '../server/environment';
import { db, initDatabase } from '../server/db';
import { listTests } from '../server/readingService';
import { listListeningTests } from '../server/listeningService';
import { getAdminCommercialSummary } from '../server/commercialService';

async function main() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_PROVIDER === 'sqlite') throw new Error('Verification requires the hosted PostgreSQL database.');
  try {
    await initDatabase();
    const users = await db.prepare('SELECT COUNT(*) AS count FROM users').get();
    const reading = await listTests({isTeacherOrAdmin:true});
    const listening = await listListeningTests({isTeacherOrAdmin:true});
    const commercial = await getAdminCommercialSummary();
    const privacy = await db.prepare("SELECT COUNT(*) AS count FROM pg_class WHERE relnamespace = 'public'::regnamespace AND relkind = 'r' AND NOT relrowsecurity").get();
    const migration = await db.prepare('SELECT id FROM public._ielts_migrations ORDER BY id').all();
    console.log(JSON.stringify({users:users.count,readingTests:reading.length,listeningTests:listening.length,commercialSummaryReadable:Boolean(commercial),publicTablesWithoutRls:privacy.count,migrations:migration.map(row=>row.id)}));
  } finally { await db.close(); }
}
main().catch(error => { console.error('Hosted database verification failed:',error.code || error.message); process.exitCode = 1; });
