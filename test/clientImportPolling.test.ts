import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { transformSync } from 'esbuild';

function client(fetch: typeof globalThis.fetch, entries: [string, string][] = []) {
  const storage = new Map(entries);
  const module = { exports: {} as { api: any } };
  let elapsed = 0;
  class Clock extends Date { static now() { return elapsed; } }
  const code = transformSync(readFileSync('client/src/api.ts', 'utf8'), {
    loader: 'ts', format: 'cjs', define: { 'import.meta.env.VITE_API_URL': '""' },
  }).code;
  runInNewContext(code, { module, fetch, AbortSignal, Date: Clock, atob, encodeURIComponent,
    localStorage: { getItem: (key: string) => storage.get(key) || null,
      setItem: (key: string, value: string) => storage.set(key, value), removeItem: (key: string) => storage.delete(key) },
    // Simulate slow extraction beyond the former request timeout without sleeping.
    setTimeout: (callback: () => void) => { elapsed += 61_000; queueMicrotask(callback); },
  });
  return { api: module.exports.api, storage, elapsed: () => elapsed };
}
const token = `test.${Buffer.from(JSON.stringify({ id: 'teacher1' })).toString('base64url')}.test`;
const pendingKey = 'ielts_import_teacher1_listening';

test('client tolerates slow imports and transient polling failures without repeating extraction', async () => {
  const requests: { url: string; method?: string }[] = [];
  const responses = [new Response(JSON.stringify({ jobId: 'job1' }), { status: 202 }),
    new Response('Gateway timeout', { status: 504 }), new Response(JSON.stringify({ status: 'processing' })),
    new Response(JSON.stringify({ status: 'completed', result: { title: 'Imported Listening' } }))];
  const state = client(async (url, options) => {
    requests.push({ url: String(url), method: options?.method });
    if (options?.method === 'POST') assert.equal(JSON.parse(options.body as string).pdfBase64, 'test-pdf');
    else assert.equal(state.storage.get(pendingKey), 'job1', 'job id must persist for refresh recovery');
    return responses.shift()!;
  }, [['ielts_auth_token', token]]);
  const imported = await state.api.importEditorPdf('listening', { pdfBase64: 'test-pdf', focus: '' });
  assert.equal(imported.title, 'Imported Listening');
  assert.ok(state.elapsed() > 100_000);
  assert.equal(requests.filter(request => request.method === 'POST').length, 1);
  assert.equal(requests[0].url, '/api/imports/listening/pdf');
  assert.ok(requests.slice(1).every(request => request.url === '/api/imports/job1'));
  assert.equal(state.storage.has(pendingKey), false);
});

test('refresh resumes the persisted job; terminal errors release the saved job id', async () => {
  let calls = 0;
  const state = client(async (url, options) => {
    calls++; assert.equal(String(url), '/api/imports/job2'); assert.notEqual(options?.method, 'POST');
    return new Response(JSON.stringify({ status: 'completed', result: { title: 'Recovered import' } }));
  }, [['ielts_auth_token', token], [pendingKey, 'job2']]);
  assert.equal((await state.api.resumeEditorImport('listening')).title, 'Recovered import');
  assert.equal(calls, 1); assert.equal(state.api.resumeEditorImport('listening'), null);

  const failed = client(async () => new Response(JSON.stringify({ status: 'failed', error: 'Source was unreadable.' })),
    [['ielts_auth_token', token], [pendingKey, 'job3']]);
  await assert.rejects(failed.api.resumeEditorImport('listening'), /Source was unreadable/);
  assert.equal(failed.storage.has(pendingKey), false);
});
