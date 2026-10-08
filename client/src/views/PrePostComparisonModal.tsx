import React from 'react';
import { PrePostComparisonReport, SkillComparisonItem } from '../types';

interface PrePostComparisonModalProps {
  report: PrePostComparisonReport | null;
  onClose: () => void;
}

export const PrePostComparisonModal: React.FC<PrePostComparisonModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  const renderSkillRow = (
    skillName: string,
    pre: SkillComparisonItem,
    post: SkillComparisonItem,
    rawDelta?: number,
    bandDelta?: number
  ) => {
    const isImplemented = pre.status !== 'not_implemented' && post.status !== 'not_implemented';

    if (!isImplemented) {
      return (
        <tr className="border-b border-slate-200 bg-slate-50">
          <td className="px-4 py-3 font-semibold text-slate-700 capitalize">{skillName}</td>
          <td className="px-4 py-3 text-slate-500 italic" colSpan={2}>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 mr-2">
              Not Yet Implemented
            </span>
            Official IELTS 4-skill evaluation requires human-examiner or calibrated AI evaluation (Milestone 4+). No scores fabricated.
          </td>
          <td className="px-4 py-3 text-slate-400 italic text-center">—</td>
        </tr>
      );
    }

    return (
      <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
        <td className="px-4 py-3 font-semibold text-slate-800 capitalize flex items-center space-x-2">
          <span>{skillName}</span>
          {skillName === 'Speaking' && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded">
              Teacher Led
            </span>
          )}
        </td>

        {/* Pre-Test Column */}
        <td className="px-4 py-3 text-sm">
          {pre.status === 'completed' ? (
            <div>
              <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                <span>Band {pre.bandScore !== undefined ? pre.bandScore.toFixed(1) : '—'}</span>
                {pre.rawScore !== undefined && pre.totalQuestions !== undefined && (
                  <span className="text-xs font-normal text-slate-500">
                    ({pre.rawScore}/{pre.totalQuestions} raw)
                  </span>
                )}
                {pre.assessor && (
                  <span className="text-[11px] font-normal px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {pre.assessor}
                  </span>
                )}
              </div>
              {pre.criteria && (
                <div className="text-[11px] text-slate-600 mt-0.5 font-mono">
                  FC: {pre.criteria.fluencyCoherence ?? '—'} | LR: {pre.criteria.lexicalResource ?? '—'} | GRA: {pre.criteria.grammaticalRange ?? '—'} | P: {pre.criteria.pronunciation ?? '—'}
                  {Boolean(pre.correctionCount) && pre.correctionCount! > 0 && (
                    <span className="text-amber-600 ml-1 font-sans">({pre.correctionCount} score audit)</span>
                  )}
                </div>
              )}
              <div className="text-xs text-slate-500 mt-0.5">{pre.testTitle}</div>
              <div className="text-xs text-slate-400">{pre.completedAt}</div>
            </div>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600 capitalize">
              {pre.status.replace('_', ' ')}
            </span>
          )}
        </td>

        {/* Post-Test Column */}
        <td className="px-4 py-3 text-sm">
          {post.status === 'completed' ? (
            <div>
              <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                <span>Band {post.bandScore !== undefined ? post.bandScore.toFixed(1) : '—'}</span>
                {post.rawScore !== undefined && post.totalQuestions !== undefined && (
                  <span className="text-xs font-normal text-slate-500">
                    ({post.rawScore}/{post.totalQuestions} raw)
                  </span>
                )}
                {post.assessor && (
                  <span className="text-[11px] font-normal px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {post.assessor}
                  </span>
                )}
              </div>
              {post.criteria && (
                <div className="text-[11px] text-slate-600 mt-0.5 font-mono">
                  FC: {post.criteria.fluencyCoherence ?? '—'} | LR: {post.criteria.lexicalResource ?? '—'} | GRA: {post.criteria.grammaticalRange ?? '—'} | P: {post.criteria.pronunciation ?? '—'}
                  {Boolean(post.correctionCount) && post.correctionCount! > 0 && (
                    <span className="text-amber-600 ml-1 font-sans">({post.correctionCount} score audit)</span>
                  )}
                </div>
              )}
              <div className="text-xs text-slate-500 mt-0.5">{post.testTitle}</div>
              <div className="text-xs text-slate-400">{post.completedAt}</div>
            </div>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600 capitalize">
              {post.status.replace('_', ' ')}
            </span>
          )}
        </td>

        {/* Delta Column */}
        <td className="px-4 py-3 text-sm text-center">
          {pre.status === 'completed' && post.status === 'completed' ? (
            <div className="inline-flex flex-col items-center">
              <span
                className={`text-sm font-bold px-2 py-0.5 rounded ${
                  (bandDelta || 0) > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : (bandDelta || 0) < 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {(bandDelta || 0) > 0 ? `+${bandDelta}` : bandDelta ?? '0.0'} Band
              </span>
              {rawDelta !== undefined && (
                <span className="text-xs text-slate-500 mt-0.5">
                  {(rawDelta || 0) > 0 ? `+${rawDelta}` : rawDelta ?? '0'} raw
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">Pending completion</span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
              IELTS Diagnostic Progression Report
            </div>
            <h2 className="text-xl font-bold">{report.studentName}</h2>
            <p className="text-xs text-indigo-100 mt-0.5">
              Class: {report.classTitle} ({report.testType === 'academic' ? 'Academic' : 'General Training'})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Important Pedagogical Disclaimer Notice */}
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
            <div className="font-semibold flex items-center space-x-1.5 text-amber-800">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Pedagogical & Diagnostic Advisory</span>
            </div>
            <p>{report.pedagogicalNote}</p>
          </div>

          {/* Side by side skills comparison table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-4 py-3">Skill Area</th>
                  <th className="px-4 py-3">Diagnostic Pre-Test</th>
                  <th className="px-4 py-3">Exit Post-Test</th>
                  <th className="px-4 py-3 text-center">Score Delta (Change)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {renderSkillRow(
                  'Reading',
                  report.preTest.skills.reading,
                  report.postTest.skills.reading,
                  report.deltas.readingRawDelta,
                  report.deltas.readingBandDelta
                )}
                {renderSkillRow(
                  'Listening',
                  report.preTest.skills.listening,
                  report.postTest.skills.listening,
                  report.deltas.listeningRawDelta,
                  report.deltas.listeningBandDelta
                )}
                {renderSkillRow(
                  'Writing',
                  report.preTest.skills.writing,
                  report.postTest.skills.writing
                )}
                {renderSkillRow(
                  'Speaking',
                  report.preTest.skills.speaking,
                  report.postTest.skills.speaking,
                  undefined,
                  report.deltas.speakingBandDelta
                )}
              </tbody>
            </table>
          </div>

          {/* Test Conditions Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <div className="font-semibold text-slate-700">Pre-Test Diagnostic Conditions</div>
              <div className="text-slate-600">Package: {report.preTest.packageTitle}</div>
              <div className="text-slate-500">
                Mode: {report.preTest.skills.reading.mode === 'mock' ? 'Timed Exam Rehearsal' : 'Untimed Practice'}
              </div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <div className="font-semibold text-slate-700">Post-Test Exit Conditions</div>
              <div className="text-slate-600">Package: {report.postTest.packageTitle}</div>
              <div className="text-slate-500">
                Status: {report.postTest.isReleased ? 'Released by Teacher' : 'Pending Teacher Release'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
