import { formatQuestionTypeName } from '../questionTypeName';
import type { SelfStudySummary } from '../types';

export function SelfStudyCell({ rows }: { rows: SelfStudySummary[] }) {
  if (!rows.length) return <span>No completed self-study yet</span>;
  const full = rows.filter(row => row.category === 'full');
  const drills = rows.filter(row => row.category === 'drill');
  return <div className="min-w-48 space-y-1">
    <div><strong>Full tests</strong> · {full.reduce((sum, r) => sum + r.sessions, 0)} completed</div>
    {full.map(r => <div key={r.skill}>{r.skill} · {r.correct}/{r.questions} correct</div>)}
    <div><strong>Question-type drills</strong> · {drills.reduce((sum, r) => sum + r.sessions, 0)} completed</div>
    {drills.map(r => <div key={r.skill + r.questionType}>{r.skill} · {formatQuestionTypeName(r.questionType!)} · {r.sessions} {r.sessions === 1 ? 'drill' : 'drills'} · {r.answered} answered · {r.correct}/{r.questions} correct</div>)}
    {rows.filter(r => r.category !== 'full' && r.category !== 'drill').map(r =>
      <div key={r.skill + r.category}>{r.skill} · {r.sessions} {r.category === 'earlier' ? 'earlier sessions (scope unknown)' : r.category === 'short' ? 'short tests' : 'sessions'}</div>
    )}
  </div>;
}
