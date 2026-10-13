import { prepareImportPdf } from './importPdf';
import { useEffect, useRef, useState } from 'react';
import { Sparkles, LoaderCircle, X } from 'lucide-react';
import { api } from '../api';
import { QuestionRenderer } from './QuestionRenderer';
import { TEXT_IMPORT_MAX_CHARS, type ReadingPdfImportResult } from '../../../shared/readingPdfImport';

export function ReadingPdfImporter({ onApply, disabled }: {
  onApply: (result: ReadingPdfImportResult) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState<'pdf' | 'text'>('text');
  const [sourceText, setSourceText] = useState('');
  const [pages, setPages] = useState('');
  const [focus, setFocus] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ReadingPdfImportResult | null>(null);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  const extract = async () => {
    if (busy || disabled || (source === 'pdf' ? !file : !sourceText.trim())) return;
    setBusy(true); setError(''); setResult(null);
    try {
      if (source === 'text') {
        const imported = await api.importReadingText({ text: sourceText, focus });
        if (mounted.current) setResult(imported);
        return;
      }
      if (!file) return;
      const pdfBase64 = await prepareImportPdf(file, pages);
      const imported = await api.importReadingPdf({ pdfBase64, focus });
      if (mounted.current) setResult(imported);
    } catch (err) {
      if (mounted.current) setError(err instanceof Error ? err.message : 'Reading import failed. Please retry.');
    } finally { if (mounted.current) setBusy(false); }
  };

  const inputClass = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm';
  return (
    <section className="mb-6 rounded-2xl border border-indigo-200 bg-white p-4 shadow-2xs">
      <button type="button" disabled={busy || disabled} onClick={() => setOpen(!open)}
        aria-expanded={open} className="flex items-center gap-2 font-bold text-sm text-indigo-700 disabled:opacity-50">
        <Sparkles className="w-4 h-4" /> Import text or PDF with AI
      </button>
      {open && <div className="mt-4 space-y-4">
        <div className="flex gap-2" role="group" aria-label="Import source">
          {(['text', 'pdf'] as const).map(value => <button key={value} type="button" disabled={busy}
            aria-pressed={source === value} onClick={() => { setSource(value); setResult(null); setError(''); }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${source === value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'} disabled:opacity-50`}>
            {value === 'text' ? 'Paste text' : 'Upload PDF'}
          </button>)}
        </div>
        <p className="text-sm text-slate-600">{source === 'text'
          ? 'Paste one Reading test with passages, questions, options and its answer key if available. Text is sent to OpenAI using a lower-cost model by default, without PDF page images. AI formats the supplied questions into an editable test; missing answers are flagged for review.'
          : 'Upload one Reading test, including its answer key if available. Selected pages are sent to OpenAI for extraction. Review the result before saving a draft.'}</p>
        {source === 'text' ? <label className="block space-y-1 text-sm font-medium text-slate-700">Reading test text
          <textarea value={sourceText} maxLength={TEXT_IMPORT_MAX_CHARS} rows={12} disabled={busy}
            onChange={e => { setSourceText(e.target.value); setResult(null); setError(''); }}
            placeholder="Paste the passage, numbered questions, answer options and answer key here..." className={inputClass} />
          <span className="block text-xs text-slate-500">{sourceText.length.toLocaleString()} / {TEXT_IMPORT_MAX_CHARS.toLocaleString()} characters. Include only the test you want to import to keep usage down.</span>
        </label> : <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium text-slate-700">Reading PDF
            <input type="file" accept=".pdf,application/pdf" disabled={busy} className={inputClass}
              onChange={e => { setFile(e.target.files?.[0] || null); setResult(null); setError(''); }} />
            <span className="block text-xs text-slate-500">Up to 30 MB locally; selected pages must be under 3 MB.</span>
          </label>
          <label className="space-y-1 text-sm font-medium text-slate-700">PDF pages
            <input value={pages} disabled={busy} onChange={e => { setPages(e.target.value); setResult(null); }}
              placeholder="Example: 5-12, 28 (blank = all pages)" className={inputClass} />
            <span className="block text-xs text-slate-500">Up to 20 pages. Count from the PDF’s first page, including the cover.</span>
          </label>
        </div>}
        <label className="block space-y-1 text-sm font-medium text-slate-700">Which test should be extracted? (optional)
          <input value={focus} maxLength={2000} disabled={busy} onChange={e => { setFocus(e.target.value); setResult(null); }}
            placeholder="Example: Academic Reading Test 2; answer key is on the last selected page" className={inputClass} />
        </label>
        <button type="button" onClick={extract} disabled={(source === 'pdf' ? !file : !sourceText.trim()) || busy || disabled}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
          {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {busy ? 'Extracting questions…' : 'Extract and review'}
        </button>
        {busy && <p role="status" className="text-sm text-slate-600">Extraction may take up to 90 seconds. Keep this editor open.</p>}
        {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        {result && <div className="space-y-4 border-t border-slate-200 pt-4">
          <h3 className="font-bold text-slate-900">Review: {result.title}</h3>
          <p className="text-sm text-slate-600">{result.testType === 'academic' ? 'Academic' : 'General Training'} · {result.passages.length} passages · {result.questionGroups.reduce((n, g) => n + g.questions.length, 0)} questions. Check wording, options and answers against the {source === 'text' ? 'pasted text' : 'PDF'}.</p>
          {result.warnings.length > 0 && <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-bold mb-2">Needs review</p>
            <ul className="list-disc pl-5 space-y-1">{result.warnings.map((warning, i) => <li key={i}>{warning}</li>)}</ul>
          </div>}
          <div className="max-h-[32rem] overflow-y-auto space-y-4 rounded-xl border border-slate-200 p-4">
            {result.passages.map(passage => <details key={passage.id} open>
              <summary className="font-bold cursor-pointer">Passage {passage.passageNumber}: {passage.title}</summary>
              {passage.subtitle && <p className="text-sm italic mt-2">{passage.subtitle}</p>}
              {passage.introduction && <p className="text-sm whitespace-pre-wrap mt-2">{passage.introduction}</p>}
              {passage.paragraphs.map(p => <p key={p.id} className="my-3 text-sm whitespace-pre-wrap"><strong>{p.label} </strong>{p.content}</p>)}
              {passage.shortTexts?.map(t => <div key={t.id} className="my-3 text-sm whitespace-pre-wrap"><strong>{t.title}</strong><p>{t.content}</p>{t.paragraphs?.map(p => <p key={p.id}>{p.label} {p.content}</p>)}</div>)}
              {result.questionGroups.filter(g => g.passageId === passage.id).map(group => <div key={group.id} className="mt-4 rounded-lg border border-slate-200 p-3">
                <fieldset disabled aria-label="Extracted question preview">
                  <QuestionRenderer group={group} answers={{}} onAnswerChange={() => {}} onToggleFlag={() => {}} activeQuestionNumber={0} />
                </fieldset>
                <p className="mt-3 text-sm font-semibold text-emerald-800">Extracted answer key</p>
                <ul className="text-sm space-y-1">{group.questions.map(q => <li key={q.id}>Q{q.questionNumber}: {Array.isArray(q.answerKey) ? q.answerKey.join(', ') || 'Missing — enter in editor' : q.answerKey || 'Missing — enter in editor'}</li>)}</ul>
              </div>)}
            </details>)}
          </div>
          <p className="text-sm text-slate-600">Applying replaces the current passages and questions in this editor. It does not save or publish. You can edit the content and fill missing answers before saving.</p>
          <div className="flex gap-3">
            <button type="button" disabled={disabled} onClick={() => { onApply(result); setResult(null); setOpen(false); }}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Use in editor</button>
            <button type="button" onClick={() => setResult(null)} className="flex items-center gap-1 text-sm text-slate-600"><X className="w-4 h-4" /> Discard extraction</button>
          </div>
        </div>}
      </div>}
    </section>
  );
}
