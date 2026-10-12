import './environment';
import app from './app';
import { initDatabase } from './db';
import { seedLocalDatabase } from './seedLocalDatabase';

async function main() {
  await initDatabase();
  if (process.env.DATABASE_PROVIDER === 'sqlite' || !process.env.DATABASE_URL) await seedLocalDatabase();
  const port = Number(process.env.PORT || 4000);
  app.listen(port, '0.0.0.0', () => console.log('IELTS Platform listening on port ' + port));
}
main().catch(error => { console.error('Server startup failed:', error.message); process.exitCode = 1; });
