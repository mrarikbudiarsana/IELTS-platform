import { seedLocalDatabase } from '../server/seedLocalDatabase';
import { seedTestUsers } from './seedUsers';
async function main() {
  await seedTestUsers();
  await seedLocalDatabase();
  await import('./runAll');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
