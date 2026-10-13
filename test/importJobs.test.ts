import assert from 'node:assert/strict';
import { test } from 'node:test';
import jwt from 'jsonwebtoken';
import { startPostgres } from './postgresHarness';

test('imports queue quickly, survive slow extraction, isolate owners and execute at most once', async () => {
  const pg = await startPostgres();
  const { startImportJob, getImportJob, processImportJob } = await import('../server/importJobService');
  const { listeningTextSchema } = await import('../server/textImportService');
  const { JWT_SECRET, generateToken } = await import('../server/auth');
  const { default: app } = await import('../server/app');
  const worker = await import('../netlify/functions/import-questions-background');
  const originalFetch = globalThis.fetch;
  const originalNetlify = process.env.NETLIFY;
  const originalUrl = process.env.URL;
  const originalDeploy = process.env.DEPLOY_PRIME_URL;
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const port = (server.address() as { port: number }).port;
  try {
    process.env.NETLIFY = 'true'; process.env.URL = 'https://test.invalid'; delete process.env.DEPLOY_PRIME_URL;
    process.env.OPENAI_API_KEY = 'test-only-key';
    let providerCalls = 0;
    let dispatchCalls = 0;
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    const fill = (schema: any, values: any): any => {
      if (schema.anyOf) return values === undefined ? null : values;
      if (schema.type === 'object') return Object.fromEntries(Object.entries(schema.properties).map(([key, child]) => [key, fill(child, values?.[key])]));
      if (schema.type === 'array') return (values || []).map((value: any) => fill(schema.items, value));
      return values;
    };
    const raw = fill(listeningTextSchema, { title: 'Listening import', warnings: [],
      parts: [{ id: 'p1', partNumber: 1, title: 'Booking', context: '', transcript: '' }],
      questionGroups: [{ id: 'g1', partNumber: 1, questionType: 'short_answer', title: 'Question 1', instructions: 'ONE WORD ONLY',
        startQuestionNumber: 1, endQuestionNumber: 1,
        questions: [{ id: 'q1', questionNumber: 1, prompt: 'Name?', answerKey: '', answerSource: 'missing' }] }],
    });
    globalThis.fetch = async (url, options) => {
      if (String(url).includes('import-questions-background')) {
        dispatchCalls++;
        return new Response('<title>Login Redirect</title>', { status: 401 });
      }
      providerCalls++;
      assert.ok(JSON.parse(options!.body as string).text.format.schema.properties.parts);
      await gate;
      return new Response(JSON.stringify({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(raw) }] }] }));
    };
    const body = { text: 'Listening questions', focus: '' };
    const job = await startImportJob('teacher1', 'listening', 'text', body);
    assert.equal(dispatchCalls, 0, 'server must not invoke a login-protected worker URL');
    assert.equal(providerCalls, 0, 'enqueue must return without waiting for AI');
    const queued = await getImportJob('teacher1', job.jobId);
    assert.equal(queued.status, 'queued');
    assert.equal(queued.dispatch?.path, '/.netlify/functions/import-questions-background');
    const grant = jwt.verify(queued.dispatch!.token, JWT_SECRET, { audience: 'import-worker' }) as jwt.JwtPayload;
    assert.equal(grant.jobId, job.jobId);
    assert.deepEqual(await startImportJob('teacher1', 'listening', 'text', body), job);
    assert.equal(dispatchCalls, 0, 'repeated enqueue must not self-fetch the protected site');
    await assert.rejects(startImportJob('teacher1', 'writing', 'text', body), (error: any) => error.status === 429);
    await assert.rejects(getImportJob('teacher2', job.jobId), (error: any) => error.status === 404);
    const running = processImportJob(job.jobId);
    // Observe the persisted claim while the provider remains blocked, without real-time sleeps.
    let status = 'queued';
    while (status === 'queued') { await new Promise(resolve => setImmediate(resolve)); status = (await getImportJob('teacher1', job.jobId)).status; }
    assert.equal(status, 'processing');
    await processImportJob(job.jobId);
    release(); await running;
    const result = await getImportJob('teacher1', job.jobId);
    assert.equal(result.status, 'completed');
    assert.equal(result.dispatch, undefined);
    assert.equal(result.result.title, 'Listening import');
    assert.equal(providerCalls, 1);
    await processImportJob(job.jobId); assert.equal(providerCalls, 1);
    const stored = (await pg.query('SELECT * FROM question_import_jobs WHERE id = $1', [job.jobId])).rows[0];
    assert.equal(stored.input_json, null); assert.equal(stored.active_key, null);
    assert.equal((await pg.query("SELECT count(*)::integer AS count FROM listening_tests")).rows[0].count, 0);
    assert.equal((await pg.query("SELECT relrowsecurity FROM pg_class WHERE relname = 'question_import_jobs'")).rows[0].relrowsecurity, true);

    assert.equal((await worker.handler({ httpMethod: 'GET' })).statusCode, 405);
    assert.equal((await worker.handler({ httpMethod: 'POST', headers: {}, body: '{}' })).statusCode, 401);
    const token = jwt.sign({ jobId: job.jobId }, JWT_SECRET, { audience: 'import-worker', expiresIn: '15m' });
    assert.equal((await worker.handler({ httpMethod: 'POST', headers: { authorization: `Bearer ${token}` }, body: JSON.stringify({ jobId: 'other' }) })).statusCode, 403);
    assert.equal((await worker.handler({ httpMethod: 'POST', headers: { authorization: `Bearer ${token}` }, body: JSON.stringify({ jobId: job.jobId }) })).statusCode, 200);

    for (const role of ['teacher', 'student'] as const) {
      await pg.query('INSERT INTO users (id,email,password_hash,full_name,role) VALUES ($1,$2,$3,$4,$5)', [role, `${role}@test.invalid`, 'test', role, role]);
    }
    const tokenFor = (role: 'teacher' | 'student') => generateToken({ id: role, role, email: `${role}@test.invalid`, fullName: role, testTypePreference: 'academic', createdAt: '' });
    const post = (role?: 'teacher' | 'student') => originalFetch(`http://127.0.0.1:${port}/api/imports/listening/text`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...(role ? { Authorization: `Bearer ${tokenFor(role)}` } : {}) }, body: JSON.stringify(body),
    });
    assert.equal((await post()).status, 401); assert.equal((await post('student')).status, 403);
    const accepted = await post('teacher'); assert.equal(accepted.status, 202);
    const acceptedJob = await accepted.json();
    const polled = await originalFetch(`http://127.0.0.1:${port}/api/imports/${acceptedJob.jobId}`, { headers: { Authorization: `Bearer ${tokenFor('teacher')}` } });
    assert.equal(polled.status, 200); assert.equal((await polled.json()).status, 'queued');

    globalThis.fetch = async () => new Response('', { status: 500 });
    const pending = await startImportJob('failed-dispatch', 'listening', 'text', body);
    assert.equal((await getImportJob('failed-dispatch', pending.jobId)).status, 'queued');
    await processImportJob(acceptedJob.jobId);
    assert.equal((await getImportJob('teacher', acceptedJob.jobId)).status, 'failed');
    await pg.query('UPDATE question_import_jobs SET expires_at = $1 WHERE id = $2', ['2000-01-01T00:00:00.000Z', job.jobId]);
    await assert.rejects(getImportJob('teacher1', job.jobId), (error: any) => error.status === 410);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalNetlify === undefined) delete process.env.NETLIFY; else process.env.NETLIFY = originalNetlify;
    if (originalUrl === undefined) delete process.env.URL; else process.env.URL = originalUrl;
    if (originalDeploy === undefined) delete process.env.DEPLOY_PRIME_URL; else process.env.DEPLOY_PRIME_URL = originalDeploy;
    await new Promise<void>(resolve => server.close(() => resolve()));
    await pg.close();
  }
});
