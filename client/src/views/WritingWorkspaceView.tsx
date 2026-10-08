import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { WritingAttempt, WritingTask, WritingTaskNumber } from '../types';
import { countWords } from '../scoring';

interface WritingWorkspaceViewProps {
  attemptId: string;
  onFinish?: (attemptId: string) => void;
  onExit?: () => void;
}

export const WritingWorkspaceView: React.FC<WritingWorkspaceViewProps> = ({
  attemptId,
  onFinish,
  onExit,
}) => {
  const [attempt, setAttempt] = useState<WritingAttempt | null>(null);
  const [activeTaskNum, setActiveTaskNum] = useState<WritingTaskNumber>(1);
  const [task1Details, setTask1Details] = useState<WritingTask | null>(null);
  const [task2Details, setTask2Details] = useState<WritingTask | null>(null);
  const [task1Text, setTask1Text] = useState('');
  const [task2Text, setTask2Text] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'prompt' | 'editor'>('editor');

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load attempt and tasks
  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  async function loadAttempt() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getWritingAttempt(attemptId);
      const att = res.attempt;
      setAttempt(att);

      // Initialize text from responses
      if (att.task1Response) {
        setTask1Text(att.task1Response.responseText || '');
      }
      if (att.task2Response) {
        setTask2Text(att.task2Response.responseText || '');
      }

      // Default active task: if only task 2 exists, switch to 2
      if (!att.task1Id && att.task2Id) {
        setActiveTaskNum(2);
      }

      // Load task details
      if (att.task1Id) {
        const t1 = await api.getWritingTask(att.task1Id);
        setTask1Details(t1.task);
      }
      if (att.task2Id) {
        const t2 = await api.getWritingTask(att.task2Id);
        setTask2Details(t2.task);
      }

      // Setup countdown if timed
      if (att.deadlineAt && att.status === 'in_progress') {
        const deadline = new Date(att.deadlineAt).getTime();
        const diff = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
        setRemainingSeconds(diff);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load writing workspace');
    } finally {
      setLoading(false);
    }
  }

  // Timer countdown
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);

  // Debounced autosave
  function handleTextChange(text: string) {
    if (activeTaskNum === 1) {
      setTask1Text(text);
    } else {
      setTask2Text(text);
    }

    setSaveStatus('saving');

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        const res = await api.saveWritingDraft(attemptId, {
          taskNumber: activeTaskNum,
          responseText: text,
        });
        setSaveStatus('saved');
        const d = new Date(res.lastSavedAt);
        setLastSavedTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        setSaveStatus('error');
      }
    }, 1200);
  }

  async function handleAutoSubmit() {
    try {
      setSubmitting(true);
      await api.submitWritingAttempt(attemptId);
      if (onFinish) onFinish(attemptId);
    } catch (err: any) {
      setError('Auto-submission encountered an issue: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleManualSubmit() {
    try {
      setSubmitting(true);
      // Final flush of active draft
      const activeText = activeTaskNum === 1 ? task1Text : task2Text;
      await api.saveWritingDraft(attemptId, {
        taskNumber: activeTaskNum,
        responseText: activeText,
      });

      await api.submitWritingAttempt(attemptId);
      setShowSubmitModal(false);
      if (onFinish) onFinish(attemptId);
    } catch (err: any) {
      setError(err.message || 'Failed to submit test');
    } finally {
      setSubmitting(false);
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
        <h3 className="font-semibold text-lg mb-2">Workspace Error</h3>
        <p className="mb-4">{error || 'Attempt could not be found.'}</p>
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
  const currentTaskDetails = activeTaskNum === 1 ? task1Details : task2Details;
  const currentVersion = currentTaskDetails?.versions?.[currentTaskDetails.versions.length - 1];
  const currentText = activeTaskNum === 1 ? task1Text : task2Text;
  const currentWordCount = countWords(currentText);
  const minRequiredWords = currentVersion?.minWords || (activeTaskNum === 1 ? 150 : 250);

  const wordCountPercent = Math.min(100, Math.round((currentWordCount / minRequiredWords) * 100));

  function formatTime(totalSeconds: number): string {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header & Test Controls */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition"
              title="Exit test"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                IELTS Writing {attempt.mode === 'mock' ? 'Mock Test' : 'Practice'}
              </span>
              <h1 className="text-base font-bold text-slate-800 line-clamp-1">
                {currentVersion?.title || 'IELTS Writing Workspace'}
              </h1>
            </div>
          </div>

          {/* Task 1 / Task 2 Switcher for Full Mocks */}
          {isFullMock && (
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTaskNum(1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTaskNum === 1
                    ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Task 1 ({countWords(task1Text)}/150w)
              </button>
              <button
                onClick={() => setActiveTaskNum(2)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTaskNum === 2
                    ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Task 2 ({countWords(task2Text)}/250w)
              </button>
            </div>
          )}

          {/* Status & Timer & Submission */}
          <div className="flex items-center gap-4">
            {/* Autosave status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              {saveStatus === 'saving' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Saved {lastSavedTime ? `at ${lastSavedTime}` : ''}</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="text-rose-600">Save failed</span>
                </>
              )}
            </div>

            {/* Countdown timer */}
            {remainingSeconds !== null && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-sm font-semibold ${
                  remainingSeconds < 300
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTime(remainingSeconds)}</span>
              </div>
            )}

            <button
              onClick={() => setShowSubmitModal(true)}
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50"
            >
              Submit Response
            </button>
          </div>
        </div>

        {/* Mobile Tab bar: Prompt vs Response */}
        <div className="flex md:hidden border-t border-slate-200 bg-white">
          <button
            onClick={() => setMobileTab('prompt')}
            className={`flex-1 py-2 text-center text-xs font-semibold ${
              mobileTab === 'prompt' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'
            }`}
          >
            Prompt & Visual
          </button>
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-2 text-center text-xs font-semibold ${
              mobileTab === 'editor' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'
            }`}
          >
            Essay Editor ({currentWordCount}w)
          </button>
        </div>
      </header>

      {/* Main Workspace (Split-Pane on Desktop) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Pane: Prompt, Instructions & Visual Material */}
        <section
          className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-y-auto flex flex-col gap-5 ${
            mobileTab === 'prompt' ? 'block' : 'hidden md:flex'
          }`}
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Task {activeTaskNum}
              </span>
              <span className="text-xs text-slate-500">
                Suggested Time: {currentVersion?.suggestedTimeMinutes || 20} min
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {currentVersion?.title}
            </h2>
          </div>

          {/* Official Instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed font-serif">
            <span className="font-bold">Instructions: </span>
            {currentVersion?.instructions}
          </div>

          {/* Structured Data or Charts / Diagrams */}
          {currentVersion?.structuredData && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-x-auto">
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">
                Reported Data ({currentVersion.structuredData.unit || 'Values'})
              </h4>
              <table className="min-w-full text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-1.5 px-2 font-semibold">Category</th>
                    {currentVersion.structuredData.years?.map((y: string) => (
                      <th key={y} className="text-right py-1.5 px-2 font-semibold">
                        {y}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentVersion.structuredData.sectors &&
                    Object.entries(currentVersion.structuredData.sectors).map(
                      ([sector, values]: [string, any]) => (
                        <tr key={sector} className="border-b border-slate-100 hover:bg-white transition">
                          <td className="py-1.5 px-2 font-medium">{sector}</td>
                          {Array.isArray(values) &&
                            values.map((val: any, idx: number) => (
                              <td key={idx} className="py-1.5 px-2 text-right font-mono">
                                {val}
                              </td>
                            ))}
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          )}

          {/* Images / Process diagrams */}
          {currentVersion?.images && currentVersion.images.length > 0 && (
            <div className="flex flex-col gap-3">
              {currentVersion.images.map((img: string, idx: number) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={img} alt={`Task visual ${idx + 1}`} className="w-full h-auto object-contain" />
                </div>
              ))}
            </div>
          )}

          {/* Main Prompt Statement */}
          <div className="text-sm text-slate-800 leading-relaxed font-serif bg-slate-50/50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
            {currentVersion?.prompt}
          </div>
        </section>

        {/* Right Pane: Response Editor & Word Counter */}
        <section
          className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col ${
            mobileTab === 'editor' ? 'flex' : 'hidden md:flex'
          }`}
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <span className="text-xs font-semibold text-slate-600">
              Your Response — Task {activeTaskNum}
            </span>

            {/* Word count meter */}
            <div className="flex items-center gap-2">
              <div
                className={`text-xs font-bold px-2.5 py-1 rounded-full transition ${
                  currentWordCount >= minRequiredWords
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {currentWordCount} / {minRequiredWords} words
              </div>
              <span className="text-[11px] text-slate-400 hidden lg:inline">
                ({wordCountPercent}%)
              </span>
            </div>
          </div>

          {/* Word Count Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full transition-all duration-300 ${
                currentWordCount >= minRequiredWords ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
              style={{ width: `${wordCountPercent}%` }}
            ></div>
          </div>

          {/* Essay Input Textarea */}
          <div className="flex-1 relative flex flex-col">
            <textarea
              value={currentText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={`Write your Task ${activeTaskNum} response here. Adhere to formal academic style and IELTS standards...`}
              className="w-full flex-1 p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-serif text-sm leading-relaxed text-slate-800 resize-none bg-slate-50/20"
              spellCheck="false"
            />
          </div>

          {/* Footnote on IELTS Word Count standard */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Official IELTS Standard: Hyphenated words count as one.</span>
            <span>Independent drafts saved continuously</span>
          </div>
        </section>
      </main>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Submit Writing Assessment?</h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Once submitted, your responses will be locked and queued for official criterion-based AI evaluation.
            </p>

            {/* Word count summary review */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5 text-xs flex flex-col gap-2">
              {attempt.task1Id && (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700">Task 1:</span>
                  <span
                    className={`font-bold ${
                      countWords(task1Text) >= 150 ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {countWords(task1Text)} / 150 words
                  </span>
                </div>
              )}
              {attempt.task2Id && (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700">Task 2:</span>
                  <span
                    className={`font-bold ${
                      countWords(task2Text) >= 250 ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {countWords(task2Text)} / 250 words
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                disabled={submitting}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Keep Writing
              </button>
              <button
                onClick={handleManualSubmit}
                disabled={submitting}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
