import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { WritingAttempt, WritingTask, WritingTaskNumber } from '../types';
import { countWords } from '../scoring';
import { ExamHeader } from '../components/ExamHeader';
import { ExamHelpModal } from '../components/ExamHelpModal';
import { ExamSettingsModal, TextSizeOption, ContrastOption } from '../components/ExamSettingsModal';

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
  const [lastSavedTime, setLastSavedTime] = useState<string>('Saved');
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'prompt' | 'editor'>('editor');

  // Accessibility / Comfort state
  const [textSize, setTextSize] = useState<TextSizeOption>('standard');
  const [contrast, setContrast] = useState<ContrastOption>('standard');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Draggable splitter state
  const [paneWidthPercent, setPaneWidthPercent] = useState(50);
  const [isDraggingSplitter, setIsDraggingSplitter] = useState(false);

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSplitter) return;
      const newPercent = (e.clientX / window.innerWidth) * 100;
      if (newPercent >= 25 && newPercent <= 75) {
        setPaneWidthPercent(newPercent);
      }
    };
    const handleMouseUp = () => setIsDraggingSplitter(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplitter]);

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

  // Timer countdown / elapsed tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      if (remainingSeconds !== null) {
        setRemainingSeconds((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
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

  const getTextSizeClass = () => {
    switch (textSize) {
      case 'large':
        return 'text-base leading-relaxed';
      case 'xlarge':
        return 'text-lg leading-loose';
      default:
        return 'text-[15px] leading-relaxed';
    }
  };

  const getThemeClass = () => {
    switch (contrast) {
      case 'dark':
        return 'bg-slate-900 text-slate-100';
      case 'yellow_on_black':
        return 'bg-black text-amber-300';
      case 'high_contrast':
        return 'bg-white text-black';
      default:
        return 'bg-white text-slate-900';
    }
  };

  return (
    <div className={`h-screen flex flex-col font-sans select-none overflow-hidden ${getThemeClass()}`}>
      {/* 1. TOP EXAM HEADER */}
      <ExamHeader
        testTitle={currentVersion?.title || 'Academic Writing • Book 21'}
        testType="Academic Writing"
        skill="writing"
        remainingSeconds={remainingSeconds}
        elapsedSeconds={elapsedSeconds}
        saveStatus={saveStatus}
        lastSavedTime={lastSavedTime}
        onExitClick={onExit || (() => {})}
        onSubmitClick={() => setShowSubmitModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* 2. OFFICIAL SUB-HEADER: WARM CREAM BAR MATCHING REFERENCE */}
      <div className="bg-[#F4F3EE] border-b border-[#E5E2D9] px-6 sm:px-10 py-2.5 flex items-center justify-between text-xs sm:text-sm select-none shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
          <span className="font-bold text-slate-900 text-sm sm:text-base">
            Task {activeTaskNum}
          </span>
          <span className="text-slate-600 font-normal text-xs sm:text-sm">
            Write at least {minRequiredWords} words.
          </span>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: FULL-BLEED SPLIT-PANE WITH DRAGGABLE DIVIDER */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative select-text">
        {/* LEFT PANE: PROMPT, TIME SUGGESTION, INSTRUCTIONS & PROMPT IMAGES */}
        <div
          style={{ width: window.innerWidth >= 1024 ? `${paneWidthPercent}%` : '100%' }}
          className="h-full overflow-y-auto px-8 sm:px-12 py-7 custom-scrollbar bg-white"
        >
          {/* Suggested time guidance */}
          <p className="text-sm text-slate-600 italic mb-5 leading-relaxed font-normal">
            You should spend about {activeTaskNum === 1 ? '20' : '40'} minutes on this task. Write at least {minRequiredWords} words.
          </p>

          {/* Prompt statement */}
          {currentVersion?.prompt && (
            <div className={`text-slate-900 font-normal mb-6 space-y-4 ${getTextSizeClass()}`}>
              {currentVersion.prompt.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Structured Data or Charts / Diagrams */}
          {currentVersion?.structuredData && (
            <div className="border border-slate-300 rounded-[2px] p-4 my-6 overflow-x-auto bg-white">
              <h4 className="text-xs font-bold text-slate-800 uppercase mb-3">
                Reported Data ({currentVersion.structuredData.unit || 'Values'})
              </h4>
              <table className="min-w-full text-xs text-slate-800 border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 bg-[#F4F4F6]">
                    <th className="text-left py-2 px-3 font-bold">Category</th>
                    {currentVersion.structuredData.years?.map((y: string) => (
                      <th key={y} className="text-right py-2 px-3 font-bold">
                        {y}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentVersion.structuredData.sectors &&
                    Object.entries(currentVersion.structuredData.sectors).map(
                      ([sector, values]: [string, any]) => (
                        <tr key={sector} className="border-b border-slate-200">
                          <td className="py-2 px-3 font-medium">{sector}</td>
                          {Array.isArray(values) &&
                            values.map((val: any, idx: number) => (
                              <td key={idx} className="py-2 px-3 text-right font-mono">
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

          {/* Prompt Diagram / Images matching Reference */}
          {currentVersion?.images && currentVersion.images.length > 0 && (
            <div className="my-6 space-y-4">
              {currentVersion.images.map((img: string, idx: number) => (
                <div key={idx} className="border border-slate-200 rounded-[2px] p-2 bg-white flex justify-center">
                  <img
                    src={img}
                    alt={`Task visual ${idx + 1}`}
                    className="max-w-full max-h-[460px] object-contain select-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Extra Instructions statement if separate from prompt and not duplicating time guidance */}
          {currentVersion?.instructions &&
            currentVersion.instructions !== currentVersion.prompt &&
            !currentVersion.instructions.includes('You should spend about') && (
            <div className="text-sm text-slate-700 italic border-t border-slate-200 pt-4 mt-6 leading-relaxed">
              {currentVersion.instructions}
            </div>
          )}
        </div>

        {/* DRAGGABLE VERTICAL SPLITTER WITH OFFICIAL < > HANDLE */}
        <div
          onMouseDown={() => setIsDraggingSplitter(true)}
          className="hidden lg:flex w-[1px] bg-slate-300 relative select-none hover:bg-slate-400 cursor-col-resize shrink-0 group z-10"
          title="Drag to resize panels"
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-0 w-6 h-10 bg-white border border-slate-400 rounded-[2px] shadow-2xs flex items-center justify-center text-[10px] text-slate-600 font-mono tracking-tighter cursor-col-resize hover:border-slate-800 select-none">
            &lt; &gt;
          </div>
        </div>

        {/* RIGHT PANE: OFFICIAL RESPONSE EDITOR & BOTTOM-RIGHT WORD COUNT */}
        <div
          style={{ width: window.innerWidth >= 1024 ? `${100 - paneWidthPercent}%` : '100%' }}
          className="h-full flex flex-col bg-white overflow-hidden relative"
        >
          <div className="flex-1 p-6 sm:p-8 flex flex-col overflow-hidden">
            <textarea
              value={currentText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder=""
              className={`w-full flex-1 p-0 border-0 outline-none focus:outline-none focus:ring-0 text-slate-900 bg-transparent resize-none custom-scrollbar font-sans ${getTextSizeClass()}`}
              spellCheck="false"
              autoFocus
            />
          </div>

          {/* Minimalist Bottom-Right Word Counter matching Reference */}
          <div className="px-6 py-2 border-t border-slate-100 flex items-center justify-end select-none shrink-0 bg-white">
            <span className="text-xs text-slate-400 font-mono tracking-wide">
              {currentWordCount} / {minRequiredWords}
            </span>
          </div>
        </div>
      </main>

      {/* 4. DOCKED OFFICIAL IELTS TASK NAVIGATOR BAR */}
      <footer className="bg-white border-t border-slate-200 text-slate-800 px-6 sm:px-12 py-2 z-30 select-none shrink-0 h-13 flex items-center">
        <div className="w-full flex items-center gap-10">
          {attempt.task1Id && (
            <div className="relative">
              {activeTaskNum === 1 && (
                <div className="absolute -top-3 left-0 right-0 h-[2px] bg-slate-400 rounded-full" />
              )}
              <button
                type="button"
                onClick={() => setActiveTaskNum(1)}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors hover:text-slate-950"
              >
                <span className={activeTaskNum === 1 ? 'text-slate-950 font-bold' : 'text-slate-600'}>
                  Task 1
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  {countWords(task1Text)} words
                </span>
              </button>
            </div>
          )}

          {attempt.task2Id && (
            <div className="relative">
              {activeTaskNum === 2 && (
                <div className="absolute -top-3 left-0 right-0 h-[2px] bg-slate-400 rounded-full" />
              )}
              <button
                type="button"
                onClick={() => setActiveTaskNum(2)}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors hover:text-slate-950"
              >
                <span className={activeTaskNum === 2 ? 'text-slate-950 font-bold' : 'text-slate-600'}>
                  Task 2
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  {countWords(task2Text)} words
                </span>
              </button>
            </div>
          )}
        </div>
      </footer>

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

      {/* EXAM HELP MODAL */}
      <ExamHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        skill="writing"
      />

      {/* EXAM SETTINGS MODAL */}
      <ExamSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        textSize={textSize}
        contrast={contrast}
        onTextSizeChange={setTextSize}
        onContrastChange={setContrast}
      />
    </div>
  );
};
