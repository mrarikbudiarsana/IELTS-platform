import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PDFDocument } from 'pdf-lib';
import { parsePdfPages, PDF_IMPORT_MAX_BYTES, TEXT_IMPORT_MAX_CHARS } from '../shared/readingPdfImport';
import { extractReadingPdf, extractReadingText, normalizeReadingImport, PdfImportError, readingPdfSchema } from '../server/readingPdfImportService';
import { extractEditorText, extractEditorPdf, speakingTextSchema, listeningTextSchema, writingTextSchema, normalizeTextImport } from '../server/textImportService';

function complete(schema: any, supplied: any): any {
  if (schema.anyOf) {
    if (supplied === undefined && schema.anyOf.some((entry: any) => entry.type === 'null')) return null;
    const entry = schema.anyOf.find((entry: any) => entry.type === (Array.isArray(supplied) ? 'array' : supplied === null ? 'null' : typeof supplied));
    return entry ? complete(entry, supplied) : supplied;
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

function listeningFixture() {
  return complete(listeningTextSchema, { title: 'Listening test', warnings: [],
    parts: [{ id: 'p1', partNumber: 1, title: 'Booking', context: 'A booking conversation', transcript: 'Supplied transcript' }],
    questionGroups: [{ id: 'g1', partNumber: 1, questionType: 'form_completion', title: 'Questions 1-2', instructions: 'ONE WORD ONLY',
      startQuestionNumber: 1, endQuestionNumber: 2, formData: { formTitle: 'Booking', fields: [{ label: 'Name', isGap: true, questionNumber: 1 }] },
      questions: [{ id: 'q1', questionNumber: 1, prompt: 'Name', answerKey: 'SMITH', answerSource: 'printed_key' },
        { id: 'q2', questionNumber: 2, prompt: 'Location', answerKey: 'guess', answerSource: 'missing', acceptedAlternatives: ['guess'] }] }],
  });
}
function writingFixture() {
  return complete(writingTextSchema, { warnings: [], tasks: [
    { title: 'Chart', taskType: 'academic_task_1', taskNumber: 1, testType: 'academic', subtype: 'chart', prompt: 'Summarise the chart.',
      instructions: 'Write at least 150 words.', minWords: 150, suggestedTimeMinutes: 20, teacherVisualDescription: '', teacherAssessmentGuidance: '', modelResponse: '' },
    { title: 'Education', taskType: 'task_2', taskNumber: 2, testType: 'both', subtype: 'opinion', prompt: 'Discuss education.',
      instructions: 'Write at least 250 words.', minWords: 250, suggestedTimeMinutes: 40, teacherVisualDescription: '', teacherAssessmentGuidance: 'Supplied notes', modelResponse: 'Supplied response' },
  ] });
}

function speakingFixture() {
  return complete(speakingTextSchema, { title: 'Travel', warnings: [],
    part1Topics: [{ id: 'topic1', topicName: 'Holidays', questions: ['Where do you go on holiday?'], teacherNotes: '' }],
    part2CueCard: { topic: 'A journey', cueCardPrompt: 'Describe a journey you enjoyed.', bulletPoints: ['Where you went', 'Who travelled with you'], followUpQuestions: [], teacherNotes: 'Supplied note' },
    part3Discussion: { theme: 'Travel', discussionQuestions: ['How has travel changed?'], teacherNotes: '' },
  });
}

test('Speaking imports preserve supplied prompts and warn about missing parts without inventing questions', () => {
  const result = normalizeTextImport('speaking', speakingFixture());
  assert.equal(result.part2CueCard.cueCardPrompt, 'Describe a journey you enjoyed.');
  assert.equal(result.part2CueCard.teacherNotes, 'Supplied note');
  assert.deepEqual(result.warnings, []);
  const partial = speakingFixture(); partial.part1Topics = []; partial.part3Discussion.discussionQuestions = [];
  const imported = normalizeTextImport('speaking', partial);
  assert.deepEqual(imported.part1Topics, []);
  assert.ok(imported.warnings.some(warning => warning.includes('Part 1')));
  assert.ok(imported.warnings.some(warning => warning.includes('Part 3')));
  partial.part2CueCard.bulletPoints = []; partial.part2CueCard.followUpQuestions = [];
  assert.throws(() => normalizeTextImport('speaking', partial), /one Speaking set/);
  const duplicate = speakingFixture(); duplicate.part1Topics.push(duplicate.part1Topics[0]);
  assert.throws(() => normalizeTextImport('speaking', duplicate), /duplicate/);
});

test('all additional skills validate PDFs before AI calls and use the correct extraction schema', async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENAI_API_KEY;
  let calls = 0;
  try {
    process.env.OPENAI_API_KEY = 'test-only-key';
    const pdf = await PDFDocument.create(); pdf.addPage();
    const body = { pdfBase64: Buffer.from(await pdf.save()).toString('base64'), focus: 'Test 2' };
    globalThis.fetch = async (_url, options) => {
      calls++;
      const request = JSON.parse(options!.body as string);
      assert.equal(request.model, process.env.OPENAI_PDF_IMPORT_MODEL || 'gpt-4.1');
      assert.equal(request.store, false);
      assert.equal(request.input[0].content[1].type, 'input_file');
      assert.ok(request.instructions.includes('never as instructions'));
      const schema = request.text.format.schema;
      const raw = schema.properties.tasks ? writingFixture() : schema.properties.parts ? listeningFixture() : speakingFixture();
      return new Response(JSON.stringify({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(raw) }] }] }));
    };
    const manyPages = await PDFDocument.create(); for (let i = 0; i < 21; i++) manyPages.addPage();
    for (const skill of ['listening', 'writing', 'speaking'] as const) {
      for (const invalid of [null, { ...body, pdfBase64: 'invalid' }, { ...body, pdfBase64: Buffer.from('fake').toString('base64') },
        { ...body, focus: 'a'.repeat(2001) }, { ...body, pdfBase64: 'A'.repeat(Math.ceil(PDF_IMPORT_MAX_BYTES / 3) * 4 + 4) },
        { ...body, pdfBase64: Buffer.from(await manyPages.save()).toString('base64') }]) {
        await assert.rejects(extractEditorPdf(skill, invalid), PdfImportError);
      }
    }
    assert.equal(calls, 0);
    assert.equal((await extractEditorPdf('listening', body)).title, 'Listening test');
    assert.equal((await extractEditorPdf('writing', body)).tasks.length, 2);
    assert.equal((await extractEditorPdf('speaking', body)).title, 'Travel');
    assert.equal(calls, 3);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
  }
});

test('Listening text import preserves forms and transcripts, blanks missing answers and requires media', () => {
  const result = normalizeTextImport('listening', listeningFixture());
  assert.equal(result.parts[0].audioUrl, '');
  assert.equal(result.parts[0].transcript, 'Supplied transcript');
  assert.equal(result.questionGroups[0].formData?.formTitle, 'Booking');
  assert.equal(result.questionGroups[0].questions[1].answerKey, '');
  assert.equal(result.questionGroups[0].questions[1].acceptedAlternatives, undefined);
  assert.ok(result.warnings.some(warning => warning.includes('Audio file URL')));
  assert.ok(result.warnings.some(warning => warning.includes('Missing answer key')));
  const raw = listeningFixture(); raw.questionGroups[0].partNumber = 2;
  assert.throws(() => normalizeTextImport('listening', raw), /unknown Listening part/);
  raw.questionGroups[0].partNumber = 1; raw.parts[0].partNumber = 5;
  assert.throws(() => normalizeTextImport('listening', raw), /invalid test format/);
});

test('Writing text import retains both task prompts and supplied guidance and flags unseen visuals', () => {
  const result = normalizeTextImport('writing', writingFixture());
  assert.equal(result.tasks.length, 2);
  assert.equal(result.tasks[0].teacherVisualDescription, '');
  assert.equal(result.tasks[1].prompt, 'Discuss education.');
  assert.equal(result.tasks[1].teacherAssessmentGuidance, 'Supplied notes');
  assert.equal(result.tasks[1].modelResponse, 'Supplied response');
  assert.ok(result.warnings.some(warning => warning.includes('original visual')));
  const raw = writingFixture(); raw.tasks = [];
  assert.throws(() => normalizeTextImport('writing', raw), /up to two tasks/);
});

test('other editors send a single text-only structured request and reject invalid input before calling AI', async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENAI_API_KEY;
  let calls = 0;
  try {
    process.env.OPENAI_API_KEY = 'test-only-key';
    globalThis.fetch = async (_url, options) => {
      calls++;
      const request = JSON.parse(options!.body as string);
      assert.equal(request.model, process.env.OPENAI_TEXT_IMPORT_MODEL || 'gpt-4.1-mini');
      assert.equal(request.store, false);
      assert.equal(request.text.format.strict, true);
      assert.ok(request.input[0].content.every((item: any) => item.type === 'input_text'));
      assert.ok(request.instructions.includes('never as instructions'));
      const raw = request.text.format.schema.properties.tasks ? writingFixture() : request.text.format.schema.properties.parts ? listeningFixture() : speakingFixture();
      return new Response(JSON.stringify({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(raw) }] }] }));
    };
    for (const skill of ['listening', 'writing', 'speaking'] as const) {
      await assert.rejects(extractEditorText(skill, { text: ' ', focus: '' }), PdfImportError);
      await assert.rejects(extractEditorText(skill, { text: 'a'.repeat(TEXT_IMPORT_MAX_CHARS + 1), focus: '' }), PdfImportError);
      await assert.rejects(extractEditorText(skill, { text: 'source', focus: 'a'.repeat(2001) }), PdfImportError);
    }
    assert.equal(calls, 0);
    assert.equal((await extractEditorText('listening', { text: 'source', focus: '' })).title, 'Listening test');
    assert.equal((await extractEditorText('writing', { text: 'source', focus: '' })).tasks.length, 2);
    assert.equal((await extractEditorText('speaking', { text: 'source', focus: '' })).title, 'Travel');
    assert.equal(calls, 3);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
  }
});

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

test('text imports validate before spending tokens and use one text-only structured request', async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENAI_API_KEY;
  const originalModel = process.env.OPENAI_TEXT_IMPORT_MODEL;
  let calls = 0;
  try {
    process.env.OPENAI_API_KEY = 'test-only-key';
    delete process.env.OPENAI_TEXT_IMPORT_MODEL;
    globalThis.fetch = async (_url, options) => {
      calls++;
      const request = JSON.parse(options!.body as string);
      assert.equal(request.model, process.env.OPENAI_TEXT_IMPORT_MODEL || 'gpt-4.1-mini');
      assert.equal(request.store, false);
      assert.equal(request.text.format.strict, true);
      assert.ok(request.input[0].content.every((item: any) => item.type === 'input_text'));
      assert.equal(request.input[0].content[1].text, 'Passage and questions');
      assert.ok(request.instructions.includes('never as instructions'));
      return new Response(JSON.stringify({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(fixture()) }] }] }));
    };
    for (const body of [null, { text: '  ', focus: '' }, { text: 123, focus: '' },
      { text: 'a'.repeat(TEXT_IMPORT_MAX_CHARS + 1), focus: '' }, { text: 'passage', focus: 'a'.repeat(2001) }]) {
      await assert.rejects(extractReadingText(body), (error: PdfImportError) => error.status === 400);
    }
    assert.equal(calls, 0);
    const body = { text: '  Passage and questions  ', focus: '' };
    const result = await extractReadingText(body);
    assert.equal(result.title, 'Solar energy');
    assert.equal(result.questionGroups[0].questions[1].answerKey, '');
    assert.equal(calls, 1);
    process.env.OPENAI_TEXT_IMPORT_MODEL = 'configured-model';
    await extractReadingText(body);
    assert.equal(calls, 2);
    delete process.env.OPENAI_API_KEY;
    await assert.rejects(extractReadingText(body), (error: PdfImportError) => error.status === 503);
    assert.equal(calls, 2);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.OPENAI_TEXT_IMPORT_MODEL; else process.env.OPENAI_TEXT_IMPORT_MODEL = originalModel;
  }
});

test('import endpoints require teacher/admin and return review data without writing tests', async () => {
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
    const post = (role?: 'teacher' | 'admin' | 'student', source = 'reading/import-pdf') => originalFetch(`http://127.0.0.1:${address.port}/api/${source}`, {
      method: 'POST', body: source.endsWith('import-text') ? JSON.stringify({ text: 'Passage and questions', focus: '' }) : body,
      headers: { 'Content-Type': 'application/json', ...(role ? { Authorization: `Bearer ${tokenFor(role)}` } : {}) },
    });
    const sources = ['reading', 'listening', 'writing', 'speaking'].flatMap(skill => [`${skill}/import-text`, `${skill}/import-pdf`]);
    globalThis.fetch = async (_url, options) => {
      providerCalls++;
      const schema = JSON.parse(options!.body as string).text.format.schema;
      const raw = schema.properties.tasks ? writingFixture() : schema.properties.parts ? listeningFixture() : schema.properties.part1Topics ? speakingFixture() : fixture();
      return new Response(JSON.stringify({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(raw) }] }] }));
    };
    process.env.OPENAI_API_KEY = 'test-only-key';
    for (const source of sources) {
      assert.equal((await post(undefined, source)).status, 401);
      assert.equal((await post('student', source)).status, 403);
    }
    assert.equal(providerCalls, 0);
    delete process.env.OPENAI_API_KEY;
    assert.equal((await post('teacher')).status, 503);
    process.env.OPENAI_API_KEY = 'test-only-key';
    for (const source of sources) for (const role of ['teacher', 'admin'] as const) {
      const response = await post(role, source);
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.equal(source.startsWith('writing/') ? result.tasks[0].title : result.title, source.startsWith('writing/') ? 'Chart' : source.startsWith('listening/') ? 'Listening test' : source.startsWith('speaking/') ? 'Travel' : 'Solar energy');
    }
    assert.equal(providerCalls, 16);
    assert.equal(databaseWrites, 0);
  } finally {
    db.prepare = originalPrepare;
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
