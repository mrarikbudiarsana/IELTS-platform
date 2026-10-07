import React, { useState, useEffect, useRef } from 'react';
import { ReadingAttempt, ReadingTestVersion, StudentAnswer } from '../types';
import { api } from '../api';
import { QuestionRenderer } from '../components/QuestionRenderer';
import { StudentNavigator } from '../components/StudentNavigator';
import { HighlighterToolbar } from '../components/Highlighter';
import { Clock, Check, AlertCircle, AlertTriangle, ArrowLeft, RefreshCw, Send, HelpCircle } from 'lucide-react';

interface TestRunnerViewProps {
  testId: string;
  modeOverride?: 'practice' | 'mock';
  onExit: () => void;
  onFinish: (attemptId: string) => void;
}

export const TestRunnerView: React.FC<TestRunnerViewProps> = ({
  testId,
  modeOverride,
  onExit,
  onFinish,
}) => {
  const [attempt, setAttempt] = useState<ReadingAttempt | null>(null);
  const [testVersion, setTestVersion] = useState<ReadingTestVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active state
  const [activePassageIndex, setActivePassageIndex] = useState(0);
  const [activeQuestionNumber, setActiveQuestionNumber] = useState(1);
  const [answers, setAnswers] = useState<Record<number, StudentAnswer>>({});
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Saved');

  // Timer states
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Passage highlighting state
  const passageContainerRef = useRef<HTMLDivElement>(null);
  const [passageHighlights, setPassageHighlights] = useState<Record<number, string>>({}); // passageIdx -> html

  // Load or resume attempt
  useEffect(() => {
    let isMounted = true;
    async function loadTest() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.startAttempt(testId, modeOverride);
        if (!isMounted) return;

        setAttempt(res.attempt);
        setTestVersion(res.testVersion);
        setAnswers(res.attempt.answers || {});

        // Initialize deadline timer if mock
        if (res.attempt.deadlineAt) {
          const deadline = new Date(res.attempt.deadlineAt).getTime();
          const now = Date.now();
          const left = Math.max(0, Math.floor((deadline - now) / 1000));
          setRemainingSeconds(left);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to start test');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadTest();
    return () => {
      isMounted = false;
    };
  }, [testId, modeOverride]);

  // Timer tick effect
  useEffect(() => {
    if (!attempt || attempt.status !== 'in_progress') return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      if (remainingSeconds !== null) {
        setRemainingSeconds((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoExpire();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [attempt, remainingSeconds]);

  // Handle auto-expiration when server deadline passes
  const handleAutoExpire = async () => {
    if (!attempt || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await api.submitAttempt(attempt.id);
      onFinish(res.attempt.id);
    } catch (err) {
      console.error('Auto-submit failed', err);
    }
  };

  // Answer change with instant server autosave
  const handleAnswerChange = async (
    qNum: number,
    qId: string,
    val: string | string[]
  ) => {
    if (!attempt) return;

    const updatedAnswer: StudentAnswer = {
      questionId: qId,
      questionNumber: qNum,
      userAnswer: val,
      isFlagged: answers[qNum]?.isFlagged || false,
      savedAt: new Date().toISOString(),
    };

    setAnswers((prev) => ({
      ...prev,
      [qNum]: updatedAnswer,
    }));

    setSaveStatus('saving');
    try {
      const res = await api.saveAnswer(attempt.id, {
        questionNumber: qNum,
        questionId: qId,
        userAnswer: val,
        isFlagged: updatedAnswer.isFlagged,
      });

      if (res.isExpired) {
        handleAutoExpire();
        return;
      }

      setSaveStatus('saved');
      setLastSavedTime(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
    } catch (err) {
      setSaveStatus('error');
    }
  };

  // Flag toggle with server autosave
  const handleToggleFlag = async (qNum: number, qId: string) => {
    if (!attempt) return;

    const currentFlag = !!answers[qNum]?.isFlagged;
    const currentVal = answers[qNum]?.userAnswer || '';

    const updatedAnswer: StudentAnswer = {
      questionId: qId,
      questionNumber: qNum,
      userAnswer: currentVal,
      isFlagged: !currentFlag,
      savedAt: new Date().toISOString(),
    };

    setAnswers((prev) => ({
      ...prev,
      [qNum]: updatedAnswer,
    }));

    setSaveStatus('saving');
    try {
      await api.saveAnswer(attempt.id, {
        questionNumber: qNum,
        questionId: qId,
        userAnswer: currentVal,
        isFlagged: !currentFlag,
      });
      setSaveStatus('saved');
    } catch (err) {
      setSaveStatus('error');
    }
  };

  // Jump to question and sync active passage
  const handleSelectQuestion = (qNum: number) => {
    setActiveQuestionNumber(qNum);

    if (testVersion) {
      for (let pIdx = 0; pIdx < testVersion.passages.length; pIdx++) {
        const passage = testVersion.passages[pIdx];
        const groups = testVersion.questionGroups.filter((g) => g.passageId === passage.id);
        for (const g of groups) {
          if (qNum >= g.startQuestionNumber && qNum <= g.endQuestionNumber) {
            setActivePassageIndex(pIdx);
            break;
          }
        }
      }
    }

    // Smooth scroll to the question box
    setTimeout(() => {
      const el = document.getElementById(`question-box-${qNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Text highlighter handler
  const handleApplyHighlight = (color: 'yellow' | 'green') => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('mark');
    span.className = color === 'yellow' ? 'ielts-highlight-yellow' : 'ielts-highlight-green';
    span.appendChild(range.extractContents());
    range.insertNode(span);
    selection.removeAllRanges();
  };

  const handleClearHighlights = () => {
    if (!passageContainerRef.current) return;
    const marks = passageContainerRef.current.querySelectorAll('mark');
    marks.forEach((m) => {
      const parent = m.parentNode;
      while (m.firstChild) {
        parent?.insertBefore(m.firstChild, m);
      }
      parent?.removeChild(m);
    });
  };

  // Submit attempt
  const handleFinalSubmit = async () => {
    if (!attempt || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await api.submitAttempt(attempt.id);
      onFinish(res.attempt.id);
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
        <div className="font-bold text-slate-700">Loading test workspace...</div>
        <div className="text-xs text-slate-500 mt-1">Restoring saved session state...</div>
      </div>
    );
  }

  if (error || !attempt || !testVersion) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center border border-slate-200 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800 mb-2">Unable to load test</h2>
          <p className="text-xs text-slate-600 mb-6">{error || 'Unknown error occurred'}</p>
          <button
            onClick={onExit}
            className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg text-sm"
          >
            Back to catalogue
          </button>
        </div>
      </div>
    );
  }

  const currentPassage = testVersion.passages[activePassageIndex] || testVersion.passages[0];
  const linkedGroups = testVersion.questionGroups.filter(
    (g) => g.passageId === currentPassage.id
  );

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.values(answers).filter(
    (a) => a.userAnswer !== undefined && a.userAnswer !== '' && (!Array.isArray(a.userAnswer) || a.userAnswer.length > 0)
  ).length;

  const unansweredNumbers = Array.from(
    { length: testVersion.totalQuestions },
    (_, i) => i + 1
  ).filter((num) => {
    const ans = answers[num]?.userAnswer;
    return !ans || (Array.isArray(ans) && ans.length === 0);
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 selection:bg-indigo-100">
      {/* EXAM TOP HEADER */}
      <header className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="Leave test (progress will be saved)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="font-bold text-sm tracking-tight flex items-center gap-2">
              <span>{attempt.testTitle}</span>
              <span className="text-[10px] uppercase font-bold bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/30">
                {attempt.testType}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>{attempt.mode === 'mock' ? 'Timed Mock Exam' : 'Untimed Practice'}</span>
              <span>•</span>
              {saveStatus === 'saving' && (
                <span className="text-amber-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Saving answers...
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {lastSavedTime}
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Save failed! Check connection
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center / Right: Timer & Submit */}
        <div className="flex items-center gap-4">
          {/* Timer Display */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono font-bold text-sm ${
              remainingSeconds !== null && remainingSeconds < 300
                ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse'
                : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-slate-400" />
            <span>
              {remainingSeconds !== null
                ? formatTimer(remainingSeconds)
                : formatTimer(elapsedSeconds)}
            </span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Submit
          </button>
        </div>
      </header>

      {/* PASSAGE TABS BAR */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {testVersion.passages.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActivePassageIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activePassageIndex === idx
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {attempt.testType === 'general'
                ? `Section ${p.passageNumber}: ${p.title.split(':')[0]}`
                : `Reading Passage ${p.passageNumber}`}
            </button>
          ))}
        </div>

        {/* Text Highlighter Controls */}
        <HighlighterToolbar
          onApplyHighlight={handleApplyHighlight}
          onClearHighlights={handleClearHighlights}
        />
      </div>

      {/* MAIN SPLIT-PANE WORKSPACE (DESKTOP SIDE-BY-SIDE / MOBILE STACKED) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* LEFT PANE: PASSAGE TEXT (INDEPENDENTLY SCROLLABLE) */}
        <div
          ref={passageContainerRef}
          className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-y-auto max-h-[calc(100vh-170px)] custom-scrollbar"
        >
          {/* Passage Header */}
          <div className="border-b border-slate-200 pb-4 mb-5">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              {attempt.testType === 'academic'
                ? `Reading Passage ${currentPassage.passageNumber}`
                : `General Training Section ${currentPassage.passageNumber}`}
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {currentPassage.title}
            </h2>
            {currentPassage.subtitle && (
              <p className="text-xs text-slate-500 font-medium italic mt-1">
                {currentPassage.subtitle}
              </p>
            )}
          </div>

          {/* ACADEMIC PASSAGE (PARAGRAPHS WITH LABELS A, B, C...) */}
          {currentPassage.paragraphs && currentPassage.paragraphs.length > 0 && (
            <div className="space-y-4 text-slate-800 text-sm leading-relaxed font-serif">
              {currentPassage.paragraphs.map((para) => (
                <div key={para.id} className="relative group">
                  {para.label && (
                    <span className="font-sans font-bold text-indigo-700 mr-2 text-base inline-block">
                      [{para.label}]
                    </span>
                  )}
                  <span className="leading-relaxed">{para.content}</span>
                </div>
              ))}
            </div>
          )}

          {/* GENERAL TRAINING SECTION (MULTIPLE SHORT TEXTS) */}
          {currentPassage.shortTexts && currentPassage.shortTexts.length > 0 && (
            <div className="space-y-6">
              {currentPassage.shortTexts.map((st) => (
                <div
                  key={st.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs"
                >
                  <h3 className="font-bold text-sm text-slate-900 mb-2 border-b border-slate-200 pb-1.5">
                    {st.title}
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-serif whitespace-pre-line">
                    {st.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANE: LINKED QUESTIONS (INDEPENDENTLY SCROLLABLE) */}
        <div className="lg:col-span-6 overflow-y-auto max-h-[calc(100vh-170px)] custom-scrollbar pr-1">
          {linkedGroups.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
              No questions assigned to this passage.
            </div>
          ) : (
            linkedGroups.map((group) => (
              <QuestionRenderer
                key={group.id}
                group={group}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onToggleFlag={handleToggleFlag}
                activeQuestionNumber={activeQuestionNumber}
              />
            ))
          )}
        </div>
      </main>

      {/* DOCKED BOTTOM QUESTION NAVIGATOR */}
      <StudentNavigator
        totalQuestions={testVersion.totalQuestions}
        answers={answers}
        activeQuestionNumber={activeQuestionNumber}
        onSelectQuestion={handleSelectQuestion}
        onSubmitClick={() => setShowConfirmModal(true)}
      />

      {/* CONFIRM SUBMISSION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-slate-900 mb-2">
              Ready to submit your test?
            </h3>

            <p className="text-xs text-center text-slate-600 mb-4">
              You have answered{' '}
              <strong className="text-slate-900 font-bold">{answeredCount}</strong> of{' '}
              <strong className="text-slate-900 font-bold">
                {testVersion.totalQuestions}
              </strong>{' '}
              questions.
            </p>

            {unansweredNumbers.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-900">
                <div className="font-bold mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  {unansweredNumbers.length} Unanswered Questions:
                </div>
                <div className="flex flex-wrap gap-1 font-mono text-[11px] max-h-24 overflow-y-auto">
                  {unansweredNumbers.map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setShowConfirmModal(false);
                        handleSelectQuestion(n);
                      }}
                      className="px-1.5 py-0.5 bg-white border border-amber-300 rounded font-bold text-amber-800 hover:bg-amber-100"
                    >
                      Q{n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Continue Test
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
