import '../server/environment';
import { db } from '../server/db';
async function main() {
  try {
    const result = await db.prepare('SELECT 1 AS connected').get();
    const tables = await db.prepare("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name").all();
    console.log(JSON.stringify({connected:result.connected === 1, tables:tables.map(row => row.table_name)}));
  } finally { await db.close(); }
}
main().catch(error => { console.error('Database check failed:', error.code || error.name); process.exitCode = 1; });
