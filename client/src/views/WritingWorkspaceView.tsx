import React, { useState, useEffect, useEffectEvent, useRef } from 'react';
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Accessibility / Comfort state
  const [textSize, setTextSize] = useState<TextSizeOption>('standard');
  const [contrast, setContrast] = useState<ContrastOption>('standard');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Draggable splitter state
  const [paneWidthPercent, setPaneWidthPercent] = useState(50);
  const [isDraggingSplitter, setIsDraggingSplitter] = useState(false);

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dirty = useRef(new Map<WritingTaskNumber, string>());
  const saveQueue = useRef(Promise.resolve());
  const closing = useRef(false);

  useEffect(() => {
    const warnIfUnsaved = (event: BeforeUnloadEvent) => {
      if (dirty.current.size) event.preventDefault();
    };
    window.addEventListener('beforeunload', warnIfUnsaved);
    return () => {
      window.removeEventListener('beforeunload', warnIfUnsaved);
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, []);

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

  useEffect(() => {
    let active = true;
    async function loadAttempt() {
      try {
        const { attempt: att } = await api.getWritingAttempt(attemptId);
        const [first, second] = await Promise.all([
          att.task1Id ? api.getWritingTask(att.task1Id) : undefined,
          att.task2Id ? api.getWritingTask(att.task2Id) : undefined,
        ]);
        if (!active) return;
        setAttempt(att);
        setTask1Details(first?.task || null);
        setTask2Details(second?.task || null);
        setTask1Text(att.task1Response?.responseText || '');
        setTask2Text(att.task2Response?.responseText || '');
        setActiveTaskNum(att.task1Id ? 1 : 2);
      } catch (err: any) {
        if (active) setError(err.message || 'Failed to load writing workspace');
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadAttempt();
    return () => { active = false; };
  }, [attemptId]);

  function cancelScheduledSave() {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = null;
  }

  function flushDrafts() {
    cancelScheduledSave();
    // Serialize requests so that a slow save cannot replace a newer edit.
    const job = saveQueue.current.then(async () => {
      for (const [taskNumber, responseText] of Array.from(dirty.current)) {
        const res = await api.saveWritingDraft(attemptId, { taskNumber, responseText });
        if (dirty.current.get(taskNumber) === responseText) dirty.current.delete(taskNumber);
        setLastSavedTime(new Date(res.lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
      setSaveStatus(dirty.current.size ? 'saving' : 'saved');
      setSaveError(null);
    });
    saveQueue.current = job.catch(() => {});
    return job;
  }

  function retrySave() {
    void flushDrafts().catch(() => {
      if (closing.current) return;
      setSaveStatus('error');
      setSaveError('Your edits are still in this editor. Retry saving before leaving.');
    });
  }

  async function finish() {
    if (closing.current || !attempt || attempt.status !== 'in_progress') return;
    closing.current = true;
    setSubmitting(true);
    setShowSubmitModal(false);
    setSubmitError(null);
    setSaveError(null);
    cancelScheduledSave();
    const drafts = Array.from(dirty.current, ([taskNumber, responseText]) => ({ taskNumber, responseText }));
    try {
      const { attempt: submitted } = await api.submitWritingAttempt(attemptId, drafts);
      const differs = drafts.some(({ taskNumber, responseText }) =>
        (taskNumber === 1 ? submitted.task1Response : submitted.task2Response)?.responseText !== responseText);
      setAttempt(submitted);
      if (differs) {
        setSubmitError('The submission was already locked before these edits arrived. You can copy your text here or open the submitted version.');
      } else {
        dirty.current.clear();
        onFinish?.(attemptId);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed. Your text is still here. Retry submission.');
    } finally {
      setSubmitting(false);
      closing.current = false;
    }
  }

  const expire = useEffectEvent(() => { void finish(); });
  useEffect(() => {
    if (!attempt || attempt.status !== 'in_progress') return;
    const deadline = attempt.deadlineAt ? Date.parse(attempt.deadlineAt) : null;
    const startedAt = Date.parse(attempt.startedAt);
    function tick() {
      const now = Date.now();
      setElapsedSeconds(Math.max(0, Math.floor((now - startedAt) / 1000)));
      if (deadline !== null) {
        setRemainingSeconds(Math.max(0, Math.ceil((deadline - now) / 1000)));
        if (now >= deadline) return true;
      }
      return false;
    }
    if (tick()) { expire(); return; }
    const timer = setInterval(() => {
      if (tick()) {
        clearInterval(timer);
        expire();
      }
    }, 250);
    return () => clearInterval(timer);
  }, [attempt]);

  function handleTextChange(text: string) {
    if (closing.current || attempt?.status !== 'in_progress' ||
      (attempt.deadlineAt && Date.now() >= Date.parse(attempt.deadlineAt))) return;
    if (activeTaskNum === 1) setTask1Text(text);
    else setTask2Text(text);
    dirty.current.set(activeTaskNum, text);
    setSaveStatus('saving');
    if (!autosaveTimerRef.current) autosaveTimerRef.current = setTimeout(retrySave, 1200);
  }

  async function exitWorkspace() {
    if (closing.current) return;
    if (!dirty.current.size || attempt?.status !== 'in_progress') { onExit?.(); return; }
    closing.current = true;
    setSubmitting(true);
    try {
      await flushDrafts();
      onExit?.();
    } catch {
      setSaveStatus('error');
      setSaveError('Your edits could not be saved. Retry the save or submit from this editor.');
    } finally {
      closing.current = false;
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
  const currentVersion = currentTaskDetails?.versions?.find(version => version.id === (activeTaskNum === 1 ? attempt.task1VersionId : attempt.task2VersionId));
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
        onExitClick={exitWorkspace}
        onSubmitClick={() => attempt.status === 'in_progress' ? setShowSubmitModal(true) : onFinish?.(attemptId)}
        onOpenHelp={() => setShowHelpModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {(saveError || submitError) && <div role="alert" className="flex items-center justify-between gap-3 bg-amber-50 px-6 py-2 text-sm text-amber-900">
        <span>{submitError || saveError}</span>
        {attempt.status !== 'in_progress' ? (
          <button className="font-semibold underline" onClick={() => onFinish?.(attemptId)}>View submission</button>
        ) : remainingSeconds === 0 || submitError ? (
          <button className="font-semibold underline" onClick={finish}>Retry submission</button>
        ) : <button className="font-semibold underline" onClick={retrySave}>Retry save</button>}
      </div>}
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
              aria-label={`Task ${activeTaskNum} response`}
              readOnly={submitting || remainingSeconds === 0 || attempt.status !== 'in_progress'}
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
              Submitting saves both your final text and word count for each task. You can review your responses on the feedback page.
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
                onClick={finish}
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
