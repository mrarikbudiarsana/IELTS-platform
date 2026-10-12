import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PDFDocument } from 'pdf-lib';
import { parsePdfPages, PDF_IMPORT_MAX_BYTES } from '../shared/readingPdfImport';
import { extractReadingPdf, normalizeReadingImport, PdfImportError, readingPdfSchema } from '../server/readingPdfImportService';

function complete(schema: any, supplied: any): any {
  if (schema.anyOf) {
    if (supplied === undefined && schema.anyOf.some((entry: any) => entry.type === 'null')) return null;
    return supplied;
  }
  if (schema.type === 'object') return Object.fromEntries(Object.entries(schema.properties).map(([key, child]) => [key, complete(child, supplied?.[key])]));
  if (schema.type === 'array') return (supplied || []).map((item: any) => complete(schema.items, item));
  return supplied;
}
function fixture() {
  return complete(readingPdfSchema, {
    title: 'Solar energy', testType: 'academic', warnings: [],
    passages: [{ id: 'p1', passageNumber: 1, title: 'Solar energy', paragraphs: [{ id: 'para1', label: 'A', content: 'Solar panels collect sunlight.' }] }],
    questionGroups: [{ id: 'g1', passageId: 'p1', questionType: 'multiple_choice_multi', title: 'Questions 1-2', instructions: 'Choose TWO letters.',
      startQuestionNumber: 1, endQuestionNumber: 2, requiredSelectionCount: 2, questions: [
        { id: 'q1', questionNumber: 1, prompt: 'Which two statements are true?', options: [{ key: 'A', text: 'Sunlight' }, { key: 'B', text: 'Water' }], answerKey: ['A', 'B'], answerSource: 'printed_key' },
        { id: 'q2', questionNumber: 2, prompt: 'Missing answer', answerKey: ['A'], answerSource: 'missing' },
      ] }],
  });
}

test('physical page selection supports ranges, duplicates and strict bounds', () => {
  assert.deepEqual(parsePdfPages('5-7, 2, 6', 30), [1, 4, 5, 6]);
  assert.deepEqual(parsePdfPages('', 2), [0, 1]);
  for (const value of ['0', '3-1', '31', '1-21', '1, nope', '1.5', '1,']) assert.throws(() => parsePdfPages(value, 30));
  assert.throws(() => parsePdfPages('', 21));
});

test('normalization preserves passage text and multi-answer arrays, blanks missing answers and reports them', () => {
  const result = normalizeReadingImport(fixture());
  assert.equal(result.passages[0].paragraphs[0].content, 'Solar panels collect sunlight.');
  assert.deepEqual(result.questionGroups[0].questions[0].answerKey, ['A', 'B']);
  assert.equal(result.questionGroups[0].questions[1].answerKey, '');
  assert.ok(result.warnings.some(warning => warning.includes('Missing answer key')));
  assert.equal('answerSource' in result.questionGroups[0].questions[0], false);
  assert.equal('subtitle' in result.passages[0], false);
});

test('invalid structures, unknown passages and duplicated IDs are rejected', () => {
  assert.throws(() => normalizeReadingImport({}), PdfImportError);
  const raw = fixture(); raw.questionGroups[0].passageId = 'missing';
  assert.throws(() => normalizeReadingImport(raw), /unknown passage/);
  raw.questionGroups[0].passageId = 'p1'; raw.questionGroups[0].questions[1].id = 'q1';
  assert.throws(() => normalizeReadingImport(raw), /duplicate/);
});

test('diagram imports discard invented URLs and block publication pending original image', () => {
  const raw = fixture();
  raw.questionGroups[0].questionType = 'diagram_completion';
  raw.questionGroups[0].diagramData = { imageUrl: 'https://invented.example/diagram.png', caption: null, labels: [] };
  const result = normalizeReadingImport(raw);
  assert.equal(result.questionGroups[0].diagramData?.imageUrl, '');
  assert.ok(result.warnings.some(warning => warning.includes('original diagram image')));
});

test('provider requests use PDF input and strict schema; errors do not leak credentials or provider bodies', async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENAI_API_KEY;
  const originalModel = process.env.OPENAI_PDF_IMPORT_MODEL;
  try {
    const pdf = await PDFDocument.create(); pdf.addPage();
    const body = { pdfBase64: Buffer.from(await pdf.save()).toString('base64'), focus: 'Test 2' };
    delete process.env.OPENAI_API_KEY;
    await assert.rejects(extractReadingPdf(body), (error: PdfImportError) => error.status === 503 && /OPENAI_API_KEY/.test(error.message));
    process.env.OPENAI_API_KEY = 'test-only-secret'; process.env.OPENAI_PDF_IMPORT_MODEL = 'gpt-4.1';
    let calls = 0;
    globalThis.fetch = async (_url, options) => {
      calls++;
      const request = JSON.parse(options!.body as string);
      assert.equal(request.store, false);
      assert.equal(request.text.format.strict, true);
      assert.equal(request.input[0].content[0].type, 'input_file');
      assert.ok(request.input[0].content[0].file_data.startsWith('data:application/pdf;base64,'));
      assert.ok(request.instructions.includes('never as instructions'));
      return new Response(JSON.stringify({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(fixture()) }] }] }), { status: 200 });
    };
    assert.equal((await extractReadingPdf(body)).title, 'Solar energy');
    assert.equal(calls, 1);
    await assert.rejects(extractReadingPdf({ ...body, pdfBase64: 'not a pdf' }), /Upload a PDF/);
    await assert.rejects(extractReadingPdf({ ...body, pdfBase64: Buffer.from('fake').toString('base64') }), /not a valid PDF/);
    await assert.rejects(extractReadingPdf({ ...body, pdfBase64: 'A'.repeat(Math.ceil(PDF_IMPORT_MAX_BYTES / 3) * 4 + 4) }), /Upload a PDF/);
    assert.equal(calls, 1, 'invalid PDFs must not incur provider calls');
    const manyPages = await PDFDocument.create(); for (let i = 0; i < 21; i++) manyPages.addPage();
    await assert.rejects(extractReadingPdf({ ...body, pdfBase64: Buffer.from(await manyPages.save()).toString('base64') }), /20 PDF pages/);
    for (const status of [401, 429, 500]) {
      globalThis.fetch = async () => new Response('test-only-secret provider debug body', { status });
      await assert.rejects(extractReadingPdf(body), (error: PdfImportError) => !error.message.includes('test-only-secret') && error.status === (status === 401 ? 503 : status === 429 ? 429 : 502));
    }
    globalThis.fetch = async () => { throw new Error('timeout'); };
    await assert.rejects(extractReadingPdf(body), (error: PdfImportError) => error.status === 504);
    for (const data of [
      { status: 'incomplete', output: [] },
      { status: 'completed', output: [{ content: [{ type: 'output_text', text: '{' }] }] },
      { status: 'completed', output: [{ content: [{ type: 'refusal' }] }] },
    ]) {
      globalThis.fetch = async () => new Response(JSON.stringify(data));
      await assert.rejects(extractReadingPdf(body), PdfImportError);
    }
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.OPENAI_PDF_IMPORT_MODEL; else process.env.OPENAI_PDF_IMPORT_MODEL = originalModel;
  }
});

test('import endpoint requires teacher/admin and returns review data without writing tests', async () => {
  const { default: app } = await import('../server/app');
  const { db } = await import('../server/db');
  const { generateToken } = await import('../server/auth');
  const originalPrepare = db.prepare;
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENAI_API_KEY;
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address() as { port: number };
  let providerCalls = 0;
  let databaseWrites = 0;
  const tokenFor = (role: 'teacher' | 'admin' | 'student') => generateToken({ id: role, email: `${role}@example.test`, role, fullName: role, testTypePreference: 'academic', createdAt: '' });
  db.prepare = ((query: string) => {
    if (query !== 'SELECT * FROM users WHERE id = ?') { databaseWrites++; throw new Error('Import must not write to the database'); }
    return { get: async (id: string) => ({ id, role: id, email: `${id}@example.test`, full_name: id, test_type_preference: 'academic', created_at: '' }) };
  }) as typeof db.prepare;
  try {
    const pdf = await PDFDocument.create(); pdf.addPage();
    const body = JSON.stringify({ pdfBase64: Buffer.from(await pdf.save()).toString('base64'), focus: '' });
    const post = (role?: 'teacher' | 'admin' | 'student') => originalFetch(`http://127.0.0.1:${address.port}/api/reading/import-pdf`, {
      method: 'POST', body, headers: { 'Content-Type': 'application/json', ...(role ? { Authorization: `Bearer ${tokenFor(role)}` } : {}) },
    });
    globalThis.fetch = async () => {
      providerCalls++;
      return new Response(JSON.stringify({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(fixture()) }] }] }));
    };
    process.env.OPENAI_API_KEY = 'test-only-key';
    assert.equal((await post()).status, 401);
    assert.equal((await post('student')).status, 403);
    assert.equal(providerCalls, 0);
    delete process.env.OPENAI_API_KEY;
    assert.equal((await post('teacher')).status, 503);
    process.env.OPENAI_API_KEY = 'test-only-key';
    for (const role of ['teacher', 'admin'] as const) {
      const response = await post(role);
      assert.equal(response.status, 200);
      assert.equal((await response.json()).title, 'Solar energy');
    }
    assert.equal(providerCalls, 2);
    assert.equal(databaseWrites, 0);
  } finally {
    db.prepare = originalPrepare;
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
