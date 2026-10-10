import React, { useState } from 'react';
import { SpeakingAssessment } from '../types';

interface SpeakingFeedbackModalProps {
  assessment: SpeakingAssessment | null;
  onClose: () => void;
  onOpenCorrectionModal?: (assessment: SpeakingAssessment) => void;
  isTeacher?: boolean;
}

export const SpeakingFeedbackModal: React.FC<SpeakingFeedbackModalProps> = ({
  assessment,
  onClose,
  onOpenCorrectionModal,
  isTeacher = false,
}) => {
  const [showCorrections, setShowCorrections] = useState(false);

  if (!assessment) return null;

  const isPartial = assessment.sessionType === 'partial_practice';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-900 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-200">
                IELTS Speaking Assessment Report
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  isPartial ? 'bg-amber-400 text-amber-950' : 'bg-emerald-400 text-emerald-950'
                }`}
              >
                {isPartial ? 'Partial Practice Session' : 'Complete 3-Part Mock'}
              </span>
            </div>
            <h2 className="text-xl font-bold mt-1">
              {assessment.setTitle || assessment.customTopic || 'Speaking Assessment'}
            </h2>
            <div className="text-xs text-indigo-100 mt-0.5 flex flex-wrap gap-x-4">
              <span>Candidate: <strong>{assessment.studentName}</strong></span>
              <span>Assessor: <strong>{assessment.teacherName}</strong></span>
              <span>Date: <strong>{assessment.sessionDateFormatted || assessment.sessionDate}</strong></span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Overall Band Banner */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
                Estimated Overall Band
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 flex items-baseline space-x-2">
                {isPartial ? (
                  <span className="text-xl font-medium text-slate-600 italic">
                    Diagnostic Only (No Overall Band for Partial Practice)
                  </span>
                ) : assessment.overallBand !== undefined ? (
                  <>
                    <span className="text-4xl text-indigo-700">Band {assessment.overallBand.toFixed(1)}</span>
                    <span className="text-xs text-slate-500 font-normal">/ 9.0 (IELTS Scale)</span>
                  </>
                ) : (
                  <span className="text-xl font-normal text-slate-400">Score Pending</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Calculated in accordance with official IELTS Speaking scoring rules (arithmetic average of 4 criteria rounded to nearest half or whole band). Practice estimation only.
              </p>
            </div>

            {isTeacher && assessment.status === 'released' && onOpenCorrectionModal && (
              <button
                onClick={() => onOpenCorrectionModal(assessment)}
                className="shrink-0 px-3.5 py-2 bg-white text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold hover:bg-indigo-50 transition-colors shadow-sm"
              >
                ✏️ Correct Released Scores
              </button>
            )}
          </div>

          {/* 4 Criteria Scores Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
              IELTS Speaking Assessment Criteria Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Fluency & Coherence */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs font-medium text-slate-500">Fluency & Coherence</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {assessment.criteria?.fluencyCoherence !== undefined ? assessment.criteria.fluencyCoherence.toFixed(1) : '—'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">FC (Weight: 25%)</div>
              </div>

              {/* Lexical Resource */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs font-medium text-slate-500">Lexical Resource</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {assessment.criteria?.lexicalResource !== undefined ? assessment.criteria.lexicalResource.toFixed(1) : '—'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">LR (Weight: 25%)</div>
              </div>

              {/* Grammatical Range & Accuracy */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs font-medium text-slate-500">Grammar Range & Acc.</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {assessment.criteria?.grammaticalRange !== undefined ? assessment.criteria.grammaticalRange.toFixed(1) : '—'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">GRA (Weight: 25%)</div>
              </div>

              {/* Pronunciation */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs font-medium text-slate-500">Pronunciation</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {assessment.criteria?.pronunciation !== undefined ? assessment.criteria.pronunciation.toFixed(1) : '—'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">P (Weight: 25%)</div>
              </div>
            </div>
          </div>

          {/* Strengths & Improvement Priorities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1.5">
                <span>🌟 Observed Strengths</span>
              </div>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed whitespace-pre-line">
                {assessment.strengths || 'No specific strengths recorded.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
              <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center space-x-1.5">
                <span>🎯 Key Improvement Priorities</span>
              </div>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed whitespace-pre-line">
                {assessment.improvementPriorities || 'No specific priorities recorded.'}
              </p>
            </div>
          </div>

          {/* Part-by-Part Comments (if any) */}
          {assessment.partComments && Object.values(assessment.partComments).some(Boolean) && (
            <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Teacher Notes by Examination Part
              </h3>
              <div className="space-y-2 text-xs">
                {assessment.partComments.part1 && (
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800 mr-2">Part 1 (Introduction & Interview):</span>
                    <span className="text-slate-600">{assessment.partComments.part1}</span>
                  </div>
                )}
                {assessment.partComments.part2 && (
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800 mr-2">Part 2 (Individual Long Turn):</span>
                    <span className="text-slate-600">{assessment.partComments.part2}</span>
                  </div>
                )}
                {assessment.partComments.part3 && (
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800 mr-2">Part 3 (Two-way Discussion):</span>
                    <span className="text-slate-600">{assessment.partComments.part3}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Acoustic Observations (Speech Rate, Pause Ratio, Pronunciation Grounding) */}
          {assessment.acousticObservations && (
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🎙️ Direct Audio Acoustic Analysis</span>
                  <span className="text-[10px] bg-purple-200 text-purple-900 font-semibold px-2 py-0.5 rounded">
                    Audio Grounded
                  </span>
                </span>
                <span className="text-[11px] text-purple-700 italic">
                  Pronunciation assessed directly from candidate speech audio
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {assessment.acousticObservations.speechRateWpm !== undefined && (
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Speech Rate</span>
                    <span className="text-base font-extrabold text-purple-900">
                      {assessment.acousticObservations.speechRateWpm} <span className="text-xs font-normal text-slate-500">WPM</span>
                    </span>
                    <span className="text-[10px] text-slate-500 block">Target: 110–150 WPM</span>
                  </div>
                )}
                {assessment.acousticObservations.pauseRatio !== undefined && (
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Pause Ratio</span>
                    <span className="text-base font-extrabold text-purple-900">
                      {(assessment.acousticObservations.pauseRatio * 100).toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">Natural: 12%–22%</span>
                  </div>
                )}
                {assessment.interruptionCount !== undefined && assessment.interruptionCount > 0 && (
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Interruptions</span>
                    <span className="text-base font-extrabold text-amber-600">
                      {assessment.interruptionCount} <span className="text-xs font-normal text-slate-500">recovered</span>
                    </span>
                    <span className="text-[10px] text-slate-500 block">Bounded Reconnection</span>
                  </div>
                )}
              </div>
              {assessment.acousticObservations.pronunciationNotes && (
                <div className="text-xs text-purple-950 bg-white/80 p-2.5 rounded-lg border border-purple-100">
                  <strong className="text-purple-900 font-semibold">Phonemic & Rhythm Observations: </strong>
                  {assessment.acousticObservations.pronunciationNotes}
                </div>
              )}
            </div>
          )}

          {/* Timestamped Response Evidence Quotes */}
          {assessment.evidenceQuotes && assessment.evidenceQuotes.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Timestamped Evidence & Performance Quotes
              </span>
              <div className="space-y-2 text-xs">
                {assessment.evidenceQuotes.map((eq, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="font-bold text-indigo-700">{eq.criterion}</span>
                      {eq.timestamp && (
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono text-[10px]">
                          ⏱️ {eq.timestamp}
                        </span>
                      )}
                    </div>
                    <blockquote className="italic text-slate-700 border-l-2 border-indigo-400 pl-2 my-1">
                      "{eq.quote}"
                    </blockquote>
                    <p className="text-slate-600 text-[11px]">{eq.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Practice Tasks */}
          {assessment.suggestedPractice && assessment.suggestedPractice.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                🎯 Actionable Practice Recommendations
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-emerald-950">
                {assessment.suggestedPractice.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Teacher Private Notes (ONLY shown if current user is teacher) */}
          {isTeacher && assessment.teacherPrivateNotes && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300">
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center space-x-1.5">
                <span>🔒 Confidential Teacher Private Notes</span>
                <span className="text-[10px] font-normal text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded">
                  Hidden from Student
                </span>
              </div>
              <p className="text-xs text-amber-950 mt-2 leading-relaxed whitespace-pre-line">
                {assessment.teacherPrivateNotes}
              </p>
            </div>
          )}

          {/* Audio Recording Section (Optional) */}
          {assessment.recordingUrl && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Session Audio Recording
              </div>
              <audio controls src={assessment.recordingUrl} className="w-full h-9" />
              <p className="text-[11px] text-slate-500 italic">
                Policy Notice: Recordings are collected strictly for assessment feedback and teacher moderation. In accordance with the privacy policy, session audio files are retained for 90 days before scheduled deletion.
              </p>
            </div>
          )}

          {/* Transparent Score Corrections Audit Trail */}
          {assessment.corrections && assessment.corrections.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setShowCorrections(!showCorrections)}
                className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Score Audit Trail & Revision History ({assessment.corrections.length})
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                    Audited
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {showCorrections ? 'Hide Details ▲' : 'View Audit Details ▼'}
                </span>
              </button>

              {showCorrections && (
                <div className="p-4 space-y-3 divide-y divide-slate-100 text-xs">
                  {assessment.corrections.map((corr) => (
                    <div key={corr.id} className="pt-3 first:pt-0 space-y-1">
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>Corrected by <strong>{corr.teacherName}</strong></span>
                        <span>{corr.correctedAt}</span>
                      </div>
                      <div className="text-slate-800 font-medium mt-1">
                        Reason: <span className="font-normal text-slate-700 italic">"{corr.reason}"</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1.5 p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[11px]">
                        <div>
                          <span className="text-slate-400 font-sans">Prior Scores: </span>
                          FC:{corr.previousScores.fluencyCoherence} LR:{corr.previousScores.lexicalResource} GRA:{corr.previousScores.grammaticalRange} P:{corr.previousScores.pronunciation} (Band {corr.previousScores.overallBand})
                        </div>
                        <div>
                          <span className="text-emerald-600 font-sans">Updated: </span>
                          FC:{corr.updatedScores.fluencyCoherence} LR:{corr.updatedScores.lexicalResource} GRA:{corr.updatedScores.grammaticalRange} P:{corr.updatedScores.pronunciation} (Band {corr.updatedScores.overallBand})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
