import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  WritingAttempt,
  WritingTask,
  WritingResponse,
  WritingAiAssessment,
  WritingEvidenceQuote,
  WritingCorrection,
} from '../types';

interface WritingFeedbackViewProps {
  attemptId: string;
  onExit?: () => void;
  onRevise?: (attemptId: string) => void;
}

export const WritingFeedbackView: React.FC<WritingFeedbackViewProps> = ({
  attemptId,
  onExit,
  onRevise,
}) => {
  const [attempt, setAttempt] = useState<WritingAttempt | null>(null);
  const [activeTaskNum, setActiveTaskNum] = useState<1 | 2>(1);
  const [task1Details, setTask1Details] = useState<WritingTask | null>(null);
  const [task2Details, setTask2Details] = useState<WritingTask | null>(null);
  const [assessmentStatus, setAssessmentStatus] = useState<string>('idle');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [requestingAssessment, setRequestingAssessment] = useState(false);
  const [allowanceBalance, setAllowanceBalance] = useState<number | null>(null);

  useEffect(() => {
    loadAttemptAndAssessments();
    loadAllowance();
  }, [attemptId]);

  async function loadAllowance() {
    try {
      const res = await api.getWritingAllowanceBalance();
      setAllowanceBalance(res.balance.available);
    } catch {
      // Non-blocking
    }
  }

  async function loadAttemptAndAssessments() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getWritingAttempt(attemptId);
      const att = res.attempt;
      setAttempt(att);

      if (att.task1Id) {
        const t1 = await api.getWritingTask(att.task1Id);
        setTask1Details(t1.task);
      }
      if (att.task2Id) {
        const t2 = await api.getWritingTask(att.task2Id);
        setTask2Details(t2.task);
      }

      if (!att.task1Id && att.task2Id) {
        setActiveTaskNum(2);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load writing results.');
    } finally {
      setLoading(false);
    }
  }

  // Poll for assessment if queued
  useEffect(() => {
    const activeResponse = activeTaskNum === 1 ? attempt?.task1Response : attempt?.task2Response;
    if (activeResponse?.aiAssessment?.status === 'queued' || activeResponse?.aiAssessment?.status === 'processing') {
      const interval = setInterval(async () => {
        try {
          const res = await api.getWritingAttempt(attemptId);
          setAttempt(res.attempt);
          const currentResp = activeTaskNum === 1 ? res.attempt.task1Response : res.attempt.task2Response;
          if (currentResp?.aiAssessment?.status === 'completed' || currentResp?.aiAssessment?.status === 'failed') {
            clearInterval(interval);
            loadAllowance();
          }
        } catch {
          // Ignore polling errors
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [attempt, activeTaskNum]);

  async function handleRequestAssessment(responseId: string) {
    try {
      setRequestingAssessment(true);
      await api.requestWritingAssessment(responseId);
      await loadAttemptAndAssessments();
      await loadAllowance();
    } catch (err: any) {
      setError(err.message || 'Failed to request AI assessment.');
    } finally {
      setRequestingAssessment(false);
    }
  }

  async function handleForkRevision() {
    try {
      if (!attempt) return;
      await api.createWritingRevision(attempt.id, activeTaskNum);
      if (onRevise) {
        onRevise(attempt.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create revision draft.');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
        <h3 className="font-semibold text-lg mb-2">Error Loading Results</h3>
        <p className="mb-4">{error || 'Attempt not found.'}</p>
        <button
          onClick={onExit}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isFullMock = Boolean(attempt.task1Id && attempt.task2Id);
  const activeResponse = activeTaskNum === 1 ? attempt.task1Response : attempt.task2Response;
  const activeTaskDetails = activeTaskNum === 1 ? task1Details : task2Details;
  const currentVersion = activeTaskDetails?.versions?.[activeTaskDetails.versions.length - 1];
  const assessment = activeResponse?.aiAssessment;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition"
              title="Return"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                Official IELTS Writing Assessment
              </span>
              <h1 className="text-xl font-bold text-slate-900 mt-1">
                Performance Diagnostic & AI Feedback
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {allowanceBalance !== null && (
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                Available AI Allowance: <strong className="text-indigo-600">{allowanceBalance}</strong>
              </span>
            )}
            <button
              onClick={handleForkRevision}
              className="px-4 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl text-xs font-semibold transition"
            >
              Revise & Rewrite (Fork Draft)
            </button>
          </div>
        </div>

        {/* Overall Band Banner Card */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
              {isFullMock ? 'Complete Writing Mock Score' : 'Single-Task Assessment Score'}
            </span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-5xl md:text-6xl font-black font-mono">
                {attempt.overallWritingBand !== undefined && attempt.overallWritingBand !== null
                  ? attempt.overallWritingBand.toFixed(1)
                  : 'Pending'}
              </span>
              <span className="text-indigo-200 text-sm">Official Band Scale (1.0 - 9.0)</span>
            </div>
            {isFullMock && (
              <p className="text-xs text-indigo-200/80 mt-2 max-w-lg leading-relaxed">
                Calculated via official IELTS scoring rules: Task 2 contributes twice the weight of Task 1:
                <br />
                <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[11px] text-white">
                  Writing Band = round((Task 1 + 2 × Task 2) / 3)
                </code>
              </p>
            )}
          </div>

          {/* Sub-bands summary pills */}
          <div className="flex gap-4">
            {attempt.task1Id && (
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center min-w-[110px]">
                <div className="text-[11px] font-semibold text-indigo-200 uppercase">Task 1 Band</div>
                <div className="text-2xl font-black font-mono mt-1 text-white">
                  {attempt.task1Band !== undefined && attempt.task1Band !== null
                    ? attempt.task1Band.toFixed(1)
                    : '—'}
                </div>
                <div className="text-[10px] text-indigo-300 mt-1">Weight: 33.3%</div>
              </div>
            )}
            {attempt.task2Id && (
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center min-w-[110px]">
                <div className="text-[11px] font-semibold text-indigo-200 uppercase">Task 2 Band</div>
                <div className="text-2xl font-black font-mono mt-1 text-white">
                  {attempt.task2Band !== undefined && attempt.task2Band !== null
                    ? attempt.task2Band.toFixed(1)
                    : '—'}
                </div>
                <div className="text-[10px] text-indigo-300 mt-1">Weight: 66.7%</div>
              </div>
            )}
          </div>
        </div>

        {/* Task 1 / Task 2 Tab Bar for Mocks */}
        {isFullMock && (
          <div className="flex border-b border-slate-200 gap-2">
            <button
              onClick={() => setActiveTaskNum(1)}
              className={`pb-3 px-4 text-sm font-semibold transition border-b-2 ${
                activeTaskNum === 1
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Task 1: Academic Report ({attempt.task1Band !== undefined ? `Band ${attempt.task1Band}` : 'Not assessed'})
            </button>
            <button
              onClick={() => setActiveTaskNum(2)}
              className={`pb-3 px-4 text-sm font-semibold transition border-b-2 ${
                activeTaskNum === 2
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Task 2: Essay ({attempt.task2Band !== undefined ? `Band ${attempt.task2Band}` : 'Not assessed'})
            </button>
          </div>
        )}

        {/* Assessment Details / Request Trigger */}
        {!assessment ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI Evaluation Not Yet Requested</h3>
              <p className="text-xs text-slate-500 max-w-md mt-1">
                Your submitted response for Task {activeTaskNum} ({activeResponse?.wordCount || 0} words) is ready for certified criterion assessment.
              </p>
            </div>
            {activeResponse && (
              <button
                onClick={() => handleRequestAssessment(activeResponse.id)}
                disabled={requestingAssessment}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-50"
              >
                {requestingAssessment ? 'Queueing Evaluation...' : 'Request AI Assessment (1 Allowance)'}
              </button>
            )}
          </div>
        ) : assessment.status === 'queued' || assessment.status === 'processing' ? (
          <div className="bg-white rounded-2xl border border-indigo-100 p-8 text-center flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <h3 className="text-base font-bold text-slate-800">
              {assessment.status === 'queued' ? 'Assessment Queued' : 'Analyzing Essay Structure & Lexis...'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Our AI examiner is evaluating Task Achievement, Coherence, Lexical Resource, and Grammar. This usually takes 5-10 seconds.
            </p>
          </div>
        ) : assessment.status === 'failed' ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800">
            <h3 className="font-bold text-base mb-1">Assessment Incomplete</h3>
            <p className="text-xs mb-3">{assessment.errorMessage || 'An error occurred during evaluation.'}</p>
            <p className="text-xs font-medium text-rose-600 mb-4">
              Your reserved testing allowance has been automatically refunded.
            </p>
            {activeResponse && (
              <button
                onClick={() => handleRequestAssessment(activeResponse.id)}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold"
              >
                Retry Assessment
              </button>
            )}
          </div>
        ) : (
          /* Completed Assessment Breakdown */
          <div className="flex flex-col gap-6">
            {/* 4 Criteria Scores Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Criterion 1: TA / TR */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      {activeTaskNum === 1 ? 'Task Achievement' : 'Task Response'}
                    </span>
                    <span className="text-xl font-black font-mono text-indigo-600">
                      {assessment.criteria?.taskAchievementOrResponse.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {assessment.criterionFeedback?.taskAchievementOrResponse}
                  </p>
                </div>
              </div>

              {/* Criterion 2: CC */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Coherence & Cohesion</span>
                    <span className="text-xl font-black font-mono text-indigo-600">
                      {assessment.criteria?.coherenceCohesion.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {assessment.criterionFeedback?.coherenceCohesion}
                  </p>
                </div>
              </div>

              {/* Criterion 3: LR */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Lexical Resource</span>
                    <span className="text-xl font-black font-mono text-indigo-600">
                      {assessment.criteria?.lexicalResource.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {assessment.criterionFeedback?.lexicalResource}
                  </p>
                </div>
              </div>

              {/* Criterion 4: GRA */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Grammar & Accuracy</span>
                    <span className="text-xl font-black font-mono text-indigo-600">
                      {assessment.criteria?.grammaticalRange.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {assessment.criterionFeedback?.grammaticalRange}
                  </p>
                </div>
              </div>
            </div>

            {/* Strengths & Actionable Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Candidate Strengths
                </h4>
                <ul className="text-xs text-emerald-800 space-y-2">
                  {assessment.strengths?.map((str: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvement Priorities */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Priority Improvements for Higher Band
                </h4>
                <ul className="text-xs text-amber-800 space-y-2">
                  {assessment.improvements?.map((imp: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Evidence Quotes from Essay */}
            {assessment.evidenceQuotes && assessment.evidenceQuotes.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">
                  Evidence Quotes from Your Submission
                </h4>
                <div className="space-y-3">
                  {assessment.evidenceQuotes.map((eq: WritingEvidenceQuote, idx: number) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="font-serif italic text-slate-800 mb-1">
                        "{eq.quote}"
                      </div>
                      <div className="text-indigo-600 font-medium text-[11px]">
                        {eq.comment}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actionable Sentence Corrections */}
            {assessment.corrections && assessment.corrections.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">
                  Actionable Corrections & Enhanced Phrasing
                </h4>
                <div className="space-y-3">
                  {assessment.corrections.map((corr: WritingCorrection, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-0.5 rounded">
                          Original
                        </span>
                        <span className="font-serif text-slate-700 line-through">
                          {corr.original}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Recommended
                        </span>
                        <span className="font-serif text-emerald-900 font-semibold">
                          {corr.corrected}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        <strong>Explanation: </strong> {corr.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Model Response Toggle (Released in Review) */}
            {currentVersion?.modelResponse && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      High-Scoring Examiner Model Response (Band 8.5+)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Compare your structure and academic lexis with this certified reference answer.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModelAnswer(!showModelAnswer)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                  >
                    {showModelAnswer ? 'Hide Model Response' : 'View Model Response'}
                  </button>
                </div>

                {showModelAnswer && (
                  <div className="mt-4 pt-4 border-t border-slate-100 font-serif text-xs leading-relaxed text-slate-800 whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                    {currentVersion.modelResponse}
                  </div>
                )}
              </div>
            )}

            {/* Candidate Submission Text Reference */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-2">
                Your Submitted Response (Task {activeTaskNum})
              </h4>
              <div className="text-xs font-serif leading-relaxed text-slate-700 whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                {activeResponse?.responseText || 'No text submitted.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
