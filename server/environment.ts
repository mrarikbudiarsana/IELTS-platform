import dotenv from 'dotenv';
import path from 'node:path';

if (!process.env.NETLIFY) {
  dotenv.config({ path: path.resolve(__dirname, '../.env.local'), quiet: true });
  dotenv.config({ quiet: true });
}
