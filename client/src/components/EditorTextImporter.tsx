import { useEffect, useRef, useState } from 'react';
import { LoaderCircle, Sparkles } from 'lucide-react';
import { api } from '../api';
import { TEXT_IMPORT_MAX_CHARS } from '../../../shared/readingPdfImport';
import type { ListeningTextImportResult, WritingTextImportResult, WritingImportedTask, SpeakingTextImportResult } from '../../../shared/textImport';
import { prepareImportPdf } from './importPdf';
import { ListeningQuestionRenderer } from './ListeningQuestionRenderer';

type Props = { disabled: boolean } & (
  { skill: 'listening'; onApply: (result: ListeningTextImportResult) => void } |
  { skill: 'speaking'; onApply: (result: SpeakingTextImportResult) => void } |
  { skill: 'writing'; onApply: (task: WritingImportedTask, warnings: string[]) => void }
);

export function EditorTextImporter(props: Props) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<'text' | 'pdf'>('text');
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState('');
  const [text, setText] = useState('');
  const [focus, setFocus] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ListeningTextImportResult | WritingTextImportResult | SpeakingTextImportResult | null>(null);
  const [taskIndex, setTaskIndex] = useState(0);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    const pending = api.resumeEditorImport(props.skill);
    if (!pending) return;
    setOpen(true); setBusy(true);
    pending.then(imported => { if (mounted.current) { setResult(imported); setTaskIndex(0); } })
      .catch(err => { if (mounted.current) setError(err.message); })
      .finally(() => { if (mounted.current) setBusy(false); });
  }, [props.skill]);
  const extract = async () => {
    if ((source === 'text' ? !text.trim() : !file) || busy || props.disabled) return;
    setBusy(true); setError(''); setResult(null);
    try {
      const imported = source === 'text' ? await api.importEditorText(props.skill, { text, focus })
        : await api.importEditorPdf(props.skill, { pdfBase64: await prepareImportPdf(file!, pages), focus });
      if (mounted.current) { setResult(imported); setTaskIndex(0); }
    } catch (err) {
      if (mounted.current) setError(err instanceof Error ? err.message : 'Import failed. Please retry.');
    } finally { if (mounted.current) setBusy(false); }
  };
  const inputClass = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm';
  return <section className="mb-6 rounded-2xl border border-indigo-200 bg-white p-4">
    <button type="button" disabled={busy || props.disabled} aria-expanded={open} onClick={() => setOpen(!open)}
      className="flex items-center gap-2 text-sm font-bold text-indigo-700 disabled:opacity-50">
      <Sparkles className="h-4 w-4" /> Import text or PDF with AI
    </button>
    {open && <div className="mt-4 space-y-4">
      <div className="flex gap-2" role="group" aria-label="Import source">
        {(['text', 'pdf'] as const).map(value => <button key={value} type="button" disabled={busy}
          aria-pressed={source === value} onClick={() => { setSource(value); setResult(null); setError(''); }}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${source === value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
          {value === 'text' ? 'Paste text' : 'Upload PDF'}</button>)}
      </div>
      <p className="text-sm text-slate-600">Import one {props.skill === 'listening' ? 'Listening test with questions, options, transcripts and its answer key if available' : props.skill === 'writing' ? 'Writing test with task prompts and instructions' : 'Speaking set with Part 1 topics, a Part 2 cue card and Part 3 discussion questions'}. The supplied text or selected PDF pages are sent for AI extraction. Review before applying to this editor.</p>
      {source === 'text' ? <label className="block space-y-1 text-sm font-medium text-slate-700">Test text
        <textarea value={text} rows={12} maxLength={TEXT_IMPORT_MAX_CHARS} disabled={busy} className={inputClass}
          onChange={event => { setText(event.target.value); setResult(null); setError(''); }} placeholder="Paste the test text here..." />
        <span className="block text-xs text-slate-500">{text.length.toLocaleString()} / {TEXT_IMPORT_MAX_CHARS.toLocaleString()} characters. Include only the test you need to keep usage down.</span>
      </label> : <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-slate-700">Test PDF
          <input type="file" accept=".pdf,application/pdf" disabled={busy} className={inputClass}
            onChange={event => { setFile(event.target.files?.[0] || null); setResult(null); setError(''); }} />
          <span className="block text-xs text-slate-500">Up to 30 MB locally; selected pages must be under 3 MB.</span>
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700">PDF pages
          <input value={pages} disabled={busy} className={inputClass} placeholder="Example: 5-12, 28 (blank = all pages)"
            onChange={event => { setPages(event.target.value); setResult(null); setError(''); }} />
          <span className="block text-xs text-slate-500">Up to 20 pages, counted from the cover.</span>
        </label>
      </div>}
      <label className="block space-y-1 text-sm font-medium text-slate-700">Selection notes (optional)
        <input value={focus} maxLength={2000} disabled={busy} className={inputClass}
          onChange={event => { setFocus(event.target.value); setResult(null); }} placeholder="Example: Test 2 only" />
      </label>
      <button type="button" disabled={busy || props.disabled || (source === 'text' ? !text.trim() : !file)} onClick={extract}
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
        {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}{busy ? 'Extracting...' : 'Extract and review'}
      </button>
      {busy && <p role="status" className="text-sm text-slate-600">Extraction is running in the background and may take several minutes. This editor checks progress automatically and resumes after a refresh.</p>}
      {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {result && <div className="space-y-4 border-t border-slate-200 pt-4">
        {result.warnings.length > 0 && <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          <p className="mb-2 font-bold">Needs review</p>
          <ul className="list-disc space-y-1 pl-5">{result.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul>
        </div>}
        <div className="max-h-[32rem] space-y-4 overflow-y-auto rounded-xl border border-slate-200 p-4">
          {'parts' in result ? <>
            <h3 className="font-bold">{result.title}</h3>
            {result.parts.map(part => <details key={part.id} open>
              <summary className="cursor-pointer font-semibold">Part {part.partNumber}: {part.title}</summary>
              <p className="my-2 text-sm">{part.context}</p>
              {part.transcript && <p className="my-2 whitespace-pre-wrap text-sm">Transcript: {part.transcript}</p>}
              {result.questionGroups.filter(group => group.partNumber === part.partNumber).map(group => <div key={group.id} className="my-3 rounded-lg border p-3">
                <fieldset disabled aria-label="Extracted question preview"><ListeningQuestionRenderer group={group} answers={{}}
                  onAnswerChange={() => {}} onToggleFlag={() => {}} activeQuestionNumber={0} /></fieldset>
                <p className="mt-3 text-sm font-semibold">Answer key</p>
                {group.questions.map(question => <p key={question.id} className="text-sm">Q{question.questionNumber}: {Array.isArray(question.answerKey) ? question.answerKey.join(', ') || 'Missing — enter in editor' : question.answerKey || 'Missing — enter in editor'}</p>)}
              </div>)}
            </details>)}
          </> : 'part1Topics' in result ? <div className="space-y-3 text-sm">
            <h3 className="font-bold">{result.title}</h3>
            <h4 className="font-semibold">Part 1</h4>
            {result.part1Topics.map(topic => <div key={topic.id}><p className="font-semibold">{topic.topicName}</p>
              {topic.questions.map((question, index) => <p key={index}>{question}</p>)}
              {topic.teacherNotes && <p>Teacher notes: {topic.teacherNotes}</p>}</div>)}
            <h4 className="font-semibold">Part 2: {result.part2CueCard.topic}</h4>
            <p className="whitespace-pre-wrap">{result.part2CueCard.cueCardPrompt}</p>
            <ul className="list-disc pl-5">{result.part2CueCard.bulletPoints.map((point, index) => <li key={index}>{point}</li>)}</ul>
            {result.part2CueCard.followUpQuestions?.map((question, index) => <p key={index}>{question}</p>)}
            {result.part2CueCard.teacherNotes && <p>Teacher notes: {result.part2CueCard.teacherNotes}</p>}
            <h4 className="font-semibold">Part 3: {result.part3Discussion.theme}</h4>
            {result.part3Discussion.discussionQuestions.map((question, index) => <p key={index}>{question}</p>)}
            {result.part3Discussion.teacherNotes && <p>Teacher notes: {result.part3Discussion.teacherNotes}</p>}
          </div> : result.tasks.map((task, index) => <div key={index} className="space-y-2 text-sm">
            <label className="flex items-center gap-2 font-bold"><input type="radio" name="imported-writing-task" checked={taskIndex === index}
              onChange={() => setTaskIndex(index)} /> Task {task.taskNumber}: {task.title}</label>
            <p>{task.testType} · {task.minWords} words · {task.suggestedTimeMinutes} minutes</p>
            <p className="whitespace-pre-wrap">{task.prompt}</p><p className="whitespace-pre-wrap">{task.instructions}</p>
            {task.teacherVisualDescription && <p className="whitespace-pre-wrap">Visual description (verify): {task.teacherVisualDescription}</p>}
            {task.teacherAssessmentGuidance && <p className="whitespace-pre-wrap">Teacher guidance: {task.teacherAssessmentGuidance}</p>}
            {task.modelResponse && <p className="whitespace-pre-wrap">Supplied model response: {task.modelResponse}</p>}
          </div>)}
        </div>
        <p className="text-sm text-slate-600">{props.skill === 'speaking' ? 'Applying fills a new Speaking set draft for editing.' : props.skill === 'listening'
          ? 'Applying replaces the current parts and questions. Upload audio and any map images before publishing.'
          : 'Applying fills a new task draft with the selected task. For two tasks, apply and save each separately. This replaces any unsaved task fields in this editor.'} Review against your source material. It does not save or publish.</p>
        <div className="flex gap-3">
          <button type="button" disabled={props.disabled} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            onClick={() => {
              if (props.skill === 'speaking' && 'part1Topics' in result) props.onApply(result);
              else if (props.skill === 'listening' && 'parts' in result) props.onApply(result);
              else if (props.skill === 'writing' && 'tasks' in result) props.onApply(result.tasks[taskIndex], result.warnings);
              if (props.skill !== 'writing') { setResult(null); setOpen(false); }
            }}>{props.skill === 'writing' ? 'Use as new task' : 'Use in editor'}</button>
          <button type="button" onClick={() => setResult(null)} className="text-sm text-slate-600">Discard extraction</button>
        </div>
      </div>}
    </div>}
  </section>;
}
