import { initDatabase } from './db';
import { ingestCambridge21ListeningTest1 } from './ingestCambridge21ListeningTest1';

export async function seedListeningDatabase() {
  (await initDatabase());
  // Cambridge 21 Academic Listening Test 1 is the official listening test for the platform
  (await ingestCambridge21ListeningTest1());
}
