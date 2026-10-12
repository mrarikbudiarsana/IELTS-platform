import { useEffect, useRef, useState } from 'react';
import { LoaderCircle, Sparkles } from 'lucide-react';
import { api } from '../api';
import { TEXT_IMPORT_MAX_CHARS } from '../../../shared/readingPdfImport';
import type { ListeningTextImportResult, WritingTextImportResult, WritingImportedTask } from '../../../shared/textImport';
import { QuestionRenderer } from './QuestionRenderer';

type Props = { disabled: boolean } & (
  { skill: 'listening'; onApply: (result: ListeningTextImportResult) => void } |
  { skill: 'writing'; onApply: (task: WritingImportedTask, warnings: string[]) => void }
);

export function EditorTextImporter(props: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [focus, setFocus] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ListeningTextImportResult | WritingTextImportResult | null>(null);
  const [taskIndex, setTaskIndex] = useState(0);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const extract = async () => {
    if (!text.trim() || busy || props.disabled) return;
    setBusy(true); setError(''); setResult(null);
    try {
      const imported = await api.importEditorText(props.skill, { text, focus });
      if (mounted.current) { setResult(imported); setTaskIndex(0); }
    } catch (err) {
      if (mounted.current) setError(err instanceof Error ? err.message : 'Import failed. Please retry.');
    } finally { if (mounted.current) setBusy(false); }
  };
  const inputClass = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm';
  return <section className="mb-6 rounded-2xl border border-indigo-200 bg-white p-4">
    <button type="button" disabled={busy || props.disabled} aria-expanded={open} onClick={() => setOpen(!open)}
      className="flex items-center gap-2 text-sm font-bold text-indigo-700 disabled:opacity-50">
      <Sparkles className="h-4 w-4" /> Import text with AI
    </button>
    {open && <div className="mt-4 space-y-4">
      <p className="text-sm text-slate-600">Paste one {props.skill === 'listening' ? 'Listening test with questions, options, transcripts and its answer key if available' : 'Writing test with task prompts and instructions'}. Text is sent to OpenAI using a lower-cost model by default. Review before applying to this editor.</p>
      <label className="block space-y-1 text-sm font-medium text-slate-700">Test text
        <textarea value={text} rows={12} maxLength={TEXT_IMPORT_MAX_CHARS} disabled={busy} className={inputClass}
          onChange={event => { setText(event.target.value); setResult(null); setError(''); }} placeholder="Paste the test text here..." />
        <span className="block text-xs text-slate-500">{text.length.toLocaleString()} / {TEXT_IMPORT_MAX_CHARS.toLocaleString()} characters. Include only the test you need to keep usage down.</span>
      </label>
      <label className="block space-y-1 text-sm font-medium text-slate-700">Selection notes (optional)
        <input value={focus} maxLength={2000} disabled={busy} className={inputClass}
          onChange={event => { setFocus(event.target.value); setResult(null); }} placeholder="Example: Test 2 only" />
      </label>
      <button type="button" disabled={busy || props.disabled || !text.trim()} onClick={extract}
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
        {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}{busy ? 'Extracting...' : 'Extract and review'}
      </button>
      {busy && <p role="status" className="text-sm text-slate-600">Extraction may take up to 90 seconds. Keep this editor open.</p>}
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
                <fieldset disabled aria-label="Extracted question preview"><QuestionRenderer group={group} answers={{}}
                  onAnswerChange={() => {}} onToggleFlag={() => {}} activeQuestionNumber={0} /></fieldset>
                <p className="mt-3 text-sm font-semibold">Answer key</p>
                {group.questions.map(question => <p key={question.id} className="text-sm">Q{question.questionNumber}: {Array.isArray(question.answerKey) ? question.answerKey.join(', ') || 'Missing — enter in editor' : question.answerKey || 'Missing — enter in editor'}</p>)}
              </div>)}
            </details>)}
          </> : result.tasks.map((task, index) => <div key={index} className="space-y-2 text-sm">
            <label className="flex items-center gap-2 font-bold"><input type="radio" name="imported-writing-task" checked={taskIndex === index}
              onChange={() => setTaskIndex(index)} /> Task {task.taskNumber}: {task.title}</label>
            <p>{task.testType} · {task.minWords} words · {task.suggestedTimeMinutes} minutes</p>
            <p className="whitespace-pre-wrap">{task.prompt}</p><p className="whitespace-pre-wrap">{task.instructions}</p>
            {task.teacherVisualDescription && <p className="whitespace-pre-wrap">Visual description (verify): {task.teacherVisualDescription}</p>}
            {task.teacherAssessmentGuidance && <p className="whitespace-pre-wrap">Teacher guidance: {task.teacherAssessmentGuidance}</p>}
            {task.modelResponse && <p className="whitespace-pre-wrap">Supplied model response: {task.modelResponse}</p>}
          </div>)}
        </div>
        <p className="text-sm text-slate-600">{props.skill === 'listening'
          ? 'Applying replaces the current parts and questions. Upload audio and any map images before publishing.'
          : 'Applying fills a new task draft with the selected task. For two tasks, apply and save each separately. This replaces any unsaved task fields in this editor.'} Review against your pasted text. It does not save or publish.</p>
        <div className="flex gap-3">
          <button type="button" disabled={props.disabled} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            onClick={() => {
              if (props.skill === 'listening' && 'parts' in result) props.onApply(result);
              else if (props.skill === 'writing' && 'tasks' in result) props.onApply(result.tasks[taskIndex], result.warnings);
            }}>{props.skill === 'writing' ? 'Use as new task' : 'Use in editor'}</button>
          <button type="button" onClick={() => setResult(null)} className="text-sm text-slate-600">Discard extraction</button>
        </div>
      </div>}
    </div>}
  </section>;
}
