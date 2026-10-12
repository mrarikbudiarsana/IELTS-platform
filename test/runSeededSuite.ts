import { seedLocalDatabase } from '../server/seedLocalDatabase';
async function main() {
  await seedLocalDatabase();
  await import('./runAll');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
