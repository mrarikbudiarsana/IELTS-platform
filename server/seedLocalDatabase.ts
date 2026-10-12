import { seedDatabase } from './seed';
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

export async function seedLocalDatabase() {
  await seedDatabase();
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
}
