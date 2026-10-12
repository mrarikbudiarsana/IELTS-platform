import '../server/environment';
import { performance } from 'node:perf_hooks';
import { db } from '../server/db';
import { listTests } from '../server/readingService';
import { listListeningTests } from '../server/listeningService';

async function main() {
  let queries = 0;
  const prepare = db.prepare.bind(db);
  db.prepare = sql => { queries++; return prepare(sql); };
  try {
    for (const skill of ['reading', 'listening'] as const) {
      for (let attempt = 0; attempt < 2; attempt++) {
        queries = 0;
        const start = performance.now();
        const tests = skill === 'reading' ? await listTests({isTeacherOrAdmin:false}) : await listListeningTests({isTeacherOrAdmin:false});
        console.log(JSON.stringify({skill,run:attempt+1,tests:tests.length,queries,durationMs:Math.round(performance.now()-start)}));
      }
    }
  } finally { await db.close(); }
}
main().catch(error => {console.error(error.code || error.message);process.exitCode=1;});
