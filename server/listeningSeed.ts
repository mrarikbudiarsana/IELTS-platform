import { initDatabase } from './db';
import { ingestCambridge21ListeningTest1 } from './ingestCambridge21ListeningTest1';

export function seedListeningDatabase() {
  initDatabase();
  // Cambridge 21 Academic Listening Test 1 is the official listening test for the platform
  ingestCambridge21ListeningTest1();
}
