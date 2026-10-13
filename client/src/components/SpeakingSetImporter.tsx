import { useEffect, useState } from 'react';
import { api } from '../api';
import type { SpeakingTextImportResult } from '../../../shared/textImport';
import type { SpeakingSet } from '../../../shared/types';
import { EditorTextImporter } from './EditorTextImporter';

const emptyDraft = (): SpeakingTextImportResult => ({ title: '', warnings: [], part1Topics: [],
  part2CueCard: { topic: '', cueCardPrompt: '', bulletPoints: [], followUpQuestions: [], teacherNotes: '' },
  part3Discussion: { theme: '', discussionQuestions: [], teacherNotes: '' } });
const lines = (value: string) => value.split('\n').map(line => line.trim()).filter(Boolean);

export function SpeakingSetImporter({ onPublished }: { onPublished: () => void }) {
  const [draft, setDraft] = useState<SpeakingTextImportResult | null>(null);
  const [saved, setSaved] = useState<{ setId: string; versionId: string } | null>(null);
  const [sets, setSets] = useState<SpeakingSet[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const refresh = async () => setSets((await api.getSpeakingSets({ status: 'draft' })).sets);
  useEffect(() => { refresh().catch(err => setError(err.message)); }, []);
  const apply = (result: SpeakingTextImportResult) => {
    setDraft(result); setSaved(null); setError(''); setMessage('');
  };
  const openDraft = async (id: string) => {
    if (!id) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const { set } = await api.getSpeakingSet(id);
      const { version } = await api.getSpeakingSetVersion(id, set.latestVersionId);
      setDraft({ ...version, title: set.title, warnings: version.validationErrors || [] });
      setSaved({ setId: id, versionId: version.id });
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not open draft.'); }
    finally { setBusy(false); }
  };
  const save = async (publish: boolean) => {
    if (!draft) return;
    setBusy(true); setError(''); setMessage('');
    try {
      let target = saved;
      const content = { ...draft,
        part1Topics: draft.part1Topics.map(topic => ({ ...topic, questions: lines(topic.questions.join('\n')) })),
        part2CueCard: { ...draft.part2CueCard, bulletPoints: lines(draft.part2CueCard.bulletPoints.join('\n')),
          followUpQuestions: lines((draft.part2CueCard.followUpQuestions || []).join('\n')) },
        part3Discussion: { ...draft.part3Discussion, discussionQuestions: lines(draft.part3Discussion.discussionQuestions.join('\n')) },
      };
      let errors: string[];
      if (target) {
        const response = await api.updateSpeakingDraft(target.setId, target.versionId, content);
        errors = response.errors;
      } else {
        const response = await api.createSpeakingSet(content);
        target = { setId: response.set.id, versionId: response.version.id };
        errors = response.version.validationErrors || [];
      }
      setSaved(target);
      setDraft({ ...content, warnings: errors });
      if (publish && errors.length === 0) {
        await api.publishSpeakingSet(target.setId, target.versionId);
        setDraft(null); setSaved(null); setMessage('Speaking set published.'); onPublished();
      } else setMessage(publish ? 'Draft saved. Complete the missing content before publishing.' : 'Speaking set draft saved.');
      await refresh();
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save Speaking set.'); }
    finally { setBusy(false); }
  };
  const field = 'w-full rounded-lg border border-slate-300 p-2 text-sm';
  const update = (change: Partial<SpeakingTextImportResult>) => { setDraft(current => current && ({ ...current, ...change })); setMessage(''); };
  return <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
    <h2 className="mb-3 font-bold text-slate-900">Speaking question sets</h2>
    <EditorTextImporter skill="speaking" disabled={busy} onApply={apply} />
    <div className="mb-4 flex flex-wrap gap-3">
      <button type="button" disabled={busy} onClick={() => apply(emptyDraft())} className="text-sm font-bold text-indigo-700">New question set</button>
      <label className="text-sm">Open saved draft <select disabled={busy} value="" onChange={event => openDraft(event.target.value)} className="ml-2 rounded-lg border p-2">
        <option value="">Select a draft</option>{sets.map(set => <option key={set.id} value={set.id}>{set.title}</option>)}
      </select></label>
    </div>
    {error && <p role="alert" className="mb-3 text-sm text-rose-700">{error}</p>}
    {message && <p role="status" className="mb-3 text-sm text-emerald-700">{message}</p>}
    {draft && <fieldset disabled={busy} className="space-y-4">
      <label className="block text-sm font-semibold">Set title<input className={field} value={draft.title} onChange={event => update({ title: event.target.value })} /></label>
      {draft.warnings.length > 0 && <ul className="list-disc rounded-lg bg-amber-50 p-4 pl-8 text-sm text-amber-900">{draft.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul>}
      <h3 className="font-semibold">Part 1 topics</h3>
      {draft.part1Topics.map((topic, index) => <div key={topic.id} className="space-y-2 rounded-lg border p-3">
        <label className="block text-sm">Topic<input className={field} value={topic.topicName} onChange={event => update({ part1Topics: draft.part1Topics.map((item, i) => i === index ? { ...item, topicName: event.target.value } : item) })} /></label>
        <label className="block text-sm">Questions (one per line)<textarea rows={4} className={field} value={topic.questions.join('\n')} onChange={event => update({ part1Topics: draft.part1Topics.map((item, i) => i === index ? { ...item, questions: event.target.value.split('\n') } : item) })} /></label>
        <label className="block text-sm">Teacher notes<textarea className={field} value={topic.teacherNotes || ''} onChange={event => update({ part1Topics: draft.part1Topics.map((item, i) => i === index ? { ...item, teacherNotes: event.target.value } : item) })} /></label>
        <button type="button" className="text-sm text-rose-700" onClick={() => update({ part1Topics: draft.part1Topics.filter((_, i) => i !== index) })}>Remove topic</button>
      </div>)}
      <button type="button" className="text-sm font-bold text-indigo-700" onClick={() => update({ part1Topics: [...draft.part1Topics, { id: crypto.randomUUID(), topicName: '', questions: [] }] })}>Add topic</button>
      <h3 className="font-semibold">Part 2 cue card</h3>
      {(['topic', 'cueCardPrompt', 'teacherNotes'] as const).map(key => <label key={key} className="block text-sm">{key === 'topic' ? 'Topic' : key === 'cueCardPrompt' ? 'Cue card prompt' : 'Teacher notes'}<textarea className={field} value={draft.part2CueCard[key] || ''} onChange={event => update({ part2CueCard: { ...draft.part2CueCard, [key]: event.target.value } })} /></label>)}
      {(['bulletPoints', 'followUpQuestions'] as const).map(key => <label key={key} className="block text-sm">{key === 'bulletPoints' ? 'Bullet points' : 'Follow-up questions'} (one per line)<textarea rows={4} className={field} value={(draft.part2CueCard[key] || []).join('\n')} onChange={event => update({ part2CueCard: { ...draft.part2CueCard, [key]: event.target.value.split('\n') } })} /></label>)}
      <h3 className="font-semibold">Part 3 discussion</h3>
      <label className="block text-sm">Theme<input className={field} value={draft.part3Discussion.theme} onChange={event => update({ part3Discussion: { ...draft.part3Discussion, theme: event.target.value } })} /></label>
      <label className="block text-sm">Discussion questions (one per line)<textarea rows={5} className={field} value={draft.part3Discussion.discussionQuestions.join('\n')} onChange={event => update({ part3Discussion: { ...draft.part3Discussion, discussionQuestions: event.target.value.split('\n') } })} /></label>
      <label className="block text-sm">Teacher notes<textarea className={field} value={draft.part3Discussion.teacherNotes || ''} onChange={event => update({ part3Discussion: { ...draft.part3Discussion, teacherNotes: event.target.value } })} /></label>
      <div className="flex gap-3">
        <button type="button" disabled={!draft.title.trim()} onClick={() => save(false)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Save draft</button>
        <button type="button" disabled={!draft.title.trim()} onClick={() => save(true)} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Save and publish</button>
        <button type="button" onClick={() => { setDraft(null); setSaved(null); }} className="text-sm text-slate-600">Close editor</button>
      </div>
    </fieldset>}
  </section>;
}
