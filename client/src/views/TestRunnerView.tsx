import React, { useState, useEffect, useRef } from 'react';
import { ReadingAttempt, ReadingTestVersion, StudentAnswer } from '../types';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { QuestionRenderer } from '../components/QuestionRenderer';
import { StudentNavigator, NavigatorSection } from '../components/StudentNavigator';
import { HighlighterToolbar } from '../components/Highlighter';
import { ExamHeader } from '../components/ExamHeader';
import { ExamHelpModal } from '../components/ExamHelpModal';
import { ExamSettingsModal, TextSizeOption, ContrastOption } from '../components/ExamSettingsModal';
import {
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  Highlighter,
  Trash2,
} from 'lucide-react';

interface TestRunnerViewProps {
  testId: string;
  modeOverride?: 'practice' | 'mock';
  assignmentId?: string;
  packageAttemptId?: string;
  questionTypeFilter?: string;
  onExit: () => void;
  onFinish: (attemptId: string) => void;
}

export const TestRunnerView: React.FC<TestRunnerViewProps> = ({
  testId,
  modeOverride,
  assignmentId,
  packageAttemptId,
  questionTypeFilter,
  onExit,
  onFinish,
}) => {
  const { user } = useAuth();
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

  // Splitter resizer state (percentage for left pane)
  const [passageWidthPercent, setPassageWidthPercent] = useState<number>(50);
  const [isDraggingSplitter, setIsDraggingSplitter] = useState(false);

  // Accessibility / Comfort state
  const [textSize, setTextSize] = useState<TextSizeOption>('standard');
  const [contrast, setContrast] = useState<ContrastOption>('standard');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Timer states
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Highlighter context menu state (appears on right click)
  const passageContainerRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    savedRange?: Range;
    targetMark?: HTMLElement | null;
  } | null>(null);

  // Load or resume attempt
  useEffect(() => {
    let isMounted = true;
    async function loadTest() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.startAttempt(testId, { modeOverride, assignmentId, packageAttemptId });
        if (!isMounted) return;

        setAttempt(res.attempt);
        setTestVersion(res.testVersion);
        setAnswers(res.attempt.answers || {});

        if (questionTypeFilter && res.testVersion) {
          const matchGroup = res.testVersion.questionGroups?.find(
            (g: any) => g.questionType === questionTypeFilter
          );
          if (matchGroup && matchGroup.questions?.[0]) {
            setActiveQuestionNumber(matchGroup.questions[0].questionNumber);
          }
        }

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

  // Splitter drag listener
  useEffect(() => {
    if (!isDraggingSplitter) return;
    const handleMouseMove = (e: MouseEvent) => {
      const totalW = window.innerWidth;
      const newPercent = Math.min(68, Math.max(32, (e.clientX / totalW) * 100));
      setPassageWidthPercent(newPercent);
    };
    const handleMouseUp = () => setIsDraggingSplitter(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplitter]);

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
      setLastSavedTime(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    } catch (err) {
      setSaveStatus('error');
    }
  };

  // Flag toggle with server autosave
  const handleToggleFlag = async (qNum: number, qId?: string) => {
    if (!attempt || !testVersion) return;

    let targetId = qId;
    if (!targetId) {
      for (const g of testVersion.questionGroups) {
        const found = g.questions.find((x) => x.questionNumber === qNum);
        if (found) {
          targetId = found.id;
          break;
        }
      }
    }
    if (!targetId) return;

    const currentFlag = !!answers[qNum]?.isFlagged;
    const currentVal = answers[qNum]?.userAnswer || '';

    const updatedAnswer: StudentAnswer = {
      questionId: targetId,
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
        questionId: targetId,
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
      const activePassagesList = questionTypeFilter
        ? testVersion.passages.filter((p) =>
            testVersion.questionGroups
              .filter((g) => g.questionType === questionTypeFilter)
              .some((g) => g.passageId === p.id)
          )
        : testVersion.passages;

      for (let pIdx = 0; pIdx < activePassagesList.length; pIdx++) {
        const passage = activePassagesList[pIdx];
        const groups = testVersion.questionGroups.filter(
          (g) => g.passageId === passage.id && (!questionTypeFilter || g.questionType === questionTypeFilter)
        );
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

  const handleNextQuestion = () => {
    if (!testVersion) return;
    if (questionTypeFilter) {
      const idx = allFilteredQuestionNumbers.indexOf(activeQuestionNumber);
      if (idx !== -1 && idx < allFilteredQuestionNumbers.length - 1) {
        handleSelectQuestion(allFilteredQuestionNumbers[idx + 1]);
      }
    } else if (activeQuestionNumber < testVersion.totalQuestions) {
      handleSelectQuestion(activeQuestionNumber + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (questionTypeFilter) {
      const idx = allFilteredQuestionNumbers.indexOf(activeQuestionNumber);
      if (idx > 0) {
        handleSelectQuestion(allFilteredQuestionNumbers[idx - 1]);
      }
    } else if (activeQuestionNumber > 1) {
      handleSelectQuestion(activeQuestionNumber - 1);
    }
  };

  // Right-click context menu handler for text highlighting
  const handlePassageContextMenu = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isMark = target.tagName.toLowerCase() === 'mark' || Boolean(target.closest('mark'));
    const markElement = isMark ? (target.tagName.toLowerCase() === 'mark' ? target : target.closest('mark')) : null;

    const selection = window.getSelection();
    const hasSelection = Boolean(selection && !selection.isCollapsed && selection.toString().trim().length > 0);

    if (hasSelection || markElement) {
      e.preventDefault();
      const range = hasSelection && selection ? selection.getRangeAt(0).cloneRange() : undefined;
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        savedRange: range,
        targetMark: markElement as HTMLElement | null,
      });
    } else {
      setContextMenu(null);
    }
  };

  // Close context menu on outside click or scroll
  useEffect(() => {
    if (!contextMenu) return;
    const handleClose = () => setContextMenu(null);
    window.addEventListener('click', handleClose);
    window.addEventListener('scroll', handleClose, true);
    return () => {
      window.removeEventListener('click', handleClose);
      window.removeEventListener('scroll', handleClose, true);
    };
  }, [contextMenu]);

  // Apply highlight from right-click context menu
  const handleApplyHighlight = (color: 'yellow' | 'green' = 'yellow') => {
    if (!contextMenu?.savedRange) {
      setContextMenu(null);
      return;
    }
    try {
      const range = contextMenu.savedRange;
      const span = document.createElement('mark');
      span.className = color === 'yellow' ? 'ielts-highlight-yellow' : 'ielts-highlight-green';
      span.appendChild(range.extractContents());
      range.insertNode(span);
      window.getSelection()?.removeAllRanges();
    } catch (e) {
      console.warn('Highlight extraction error', e);
    }
    setContextMenu(null);
  };

  // Clear highlight from right-click context menu
  const handleClearHighlight = () => {
    if (contextMenu?.targetMark) {
      const mark = contextMenu.targetMark;
      const parent = mark.parentNode;
      while (mark.firstChild) {
        parent?.insertBefore(mark.firstChild, mark);
      }
      parent?.removeChild(mark);
    } else if (contextMenu?.savedRange) {
      const marks = Array.from(document.querySelectorAll('mark'));
      marks.forEach((m) => {
        if (contextMenu.savedRange?.intersectsNode(m)) {
          const parent = m.parentNode;
          while (m.firstChild) {
            parent?.insertBefore(m.firstChild, m);
          }
          parent?.removeChild(m);
        }
      });
    }
    setContextMenu(null);
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
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
        <div className="font-bold text-sm tracking-wide">Loading official test workspace...</div>
        <div className="text-xs text-slate-400 mt-1">Authenticating session and recovering answers...</div>
      </div>
    );
  }

  if (error || !attempt || !testVersion) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center border border-slate-200 shadow-md">
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

  // Filter question groups and passages if skill/question-type practice is selected
  const displayedGroups = questionTypeFilter
    ? testVersion.questionGroups.filter((g) => g.questionType === questionTypeFilter)
    : testVersion.questionGroups;

  const displayedPassages = questionTypeFilter
    ? testVersion.passages.filter((p) => displayedGroups.some((g) => g.passageId === p.id))
    : testVersion.passages;

  const currentPassage = displayedPassages[activePassageIndex] || displayedPassages[0] || testVersion.passages[0];
  const linkedGroups = displayedGroups.filter(
    (g) => g.passageId === currentPassage?.id
  );

  const allFilteredQuestionNumbers = displayedGroups.flatMap((g) =>
    g.questions.map((q) => q.questionNumber)
  );

  const answeredCount = Object.values(answers).filter(
    (a) =>
      allFilteredQuestionNumbers.includes(a.questionNumber) &&
      a.userAnswer !== undefined &&
      a.userAnswer !== '' &&
      (!Array.isArray(a.userAnswer) || a.userAnswer.length > 0)
  ).length;

  const totalQuestionsToCount = questionTypeFilter
    ? allFilteredQuestionNumbers.length
    : testVersion.totalQuestions;

  const unansweredNumbers = (questionTypeFilter ? allFilteredQuestionNumbers : Array.from(
    { length: testVersion.totalQuestions },
    (_, i) => i + 1
  )).filter((num) => {
    const ans = answers[num]?.userAnswer;
    return !ans || (Array.isArray(ans) && ans.length === 0);
  });

  // Calculate passage ranges for bottom navigator
  const navigatorSections: NavigatorSection[] = displayedPassages.map((p, idx) => {
    const groups = displayedGroups.filter((g) => g.passageId === p.id);
    const qNums = groups.flatMap((g) => g.questions.map((q) => q.questionNumber)).sort((a, b) => a - b);
    const startQ = qNums.length > 0 ? qNums[0] : 1;
    const endQ = qNums.length > 0 ? qNums[qNums.length - 1] : 1;
    return {
      title: attempt.testType === 'general' ? `Section ${p.passageNumber}` : `Passage ${p.passageNumber}`,
      startQuestion: startQ,
      endQuestion: endQ,
      sectionIndex: idx,
      questionNumbers: qNums,
    };
  });

  // Contrast theme styles
  const getThemeContainerClass = () => {
    switch (contrast) {
      case 'dark':
        return 'bg-slate-950 text-slate-100';
      case 'yellow_on_black':
        return 'bg-black text-amber-300';
      case 'high_contrast':
        return 'bg-white text-black';
      default:
        return 'bg-slate-100 text-slate-900';
    }
  };

  const getThemeCardClass = () => {
    switch (contrast) {
      case 'dark':
        return 'bg-slate-900 border-slate-800 text-slate-100';
      case 'yellow_on_black':
        return 'bg-black border-amber-500/50 text-amber-300';
      case 'high_contrast':
        return 'bg-white border-black text-black';
      default:
        return 'bg-white border-slate-200 text-slate-800';
    }
  };

  const getTextSizeClass = () => {
    switch (textSize) {
      case 'large':
        return 'text-base leading-relaxed';
      case 'xlarge':
        return 'text-lg leading-relaxed';
      default:
        return 'text-[15px] leading-relaxed';
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden select-none bg-white font-sans text-slate-800">
      {/* 1. OFFICIAL EXAM HEADER */}
      <ExamHeader
        testTitle={attempt.testTitle}
        testType={attempt.testType === 'academic' ? 'Academic Reading' : 'General Training Reading'}
        skill="reading"
        candidateName={user?.fullName || 'Candidate'}
        remainingSeconds={remainingSeconds}
        elapsedSeconds={elapsedSeconds}
        saveStatus={saveStatus}
        lastSavedTime={lastSavedTime}
        onExitClick={() => setShowExitModal(true)}
        onSubmitClick={() => setShowConfirmModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* 2. OFFICIAL SECTION INSTRUCTIONS BANNER (Matching Images 1-7) */}
      <div className="bg-[#F4F3EE] border-b border-[#E5E2D9] px-6 sm:px-12 py-2 flex items-center justify-between text-xs sm:text-sm select-none shrink-0">
        <div>
          <span className="font-bold text-slate-900 mr-2">
            {attempt.testType === 'general' ? `Section ${activePassageIndex + 1}` : `Part ${activePassageIndex + 1}`}
          </span>
          <span className="text-slate-600 font-normal">
            You should spend about 20 minutes on Questions {navigatorSections[activePassageIndex]?.startQuestion}–{navigatorSections[activePassageIndex]?.endQuestion}, which are based on {attempt.testType === 'general' ? `Section ${activePassageIndex + 1}` : `Part ${activePassageIndex + 1}`} below.
          </span>
        </div>
      </div>

      {/* 3. MAIN SPLIT-PANE WORKSPACE WITH DRAGGABLE SPLITTER */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative bg-white">
        {/* LEFT PANE: READING PASSAGE TEXT */}
        <div
          ref={passageContainerRef}
          onContextMenu={handlePassageContextMenu}
          style={{ width: window.innerWidth >= 1024 ? `${passageWidthPercent}%` : '100%' }}
          className="h-full overflow-y-auto px-8 sm:px-12 py-8 custom-scrollbar bg-white select-text"
        >
          {/* Passage Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 leading-snug">
            {currentPassage.title}
          </h1>

          {currentPassage.subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 italic mb-6">
              {currentPassage.subtitle}
            </p>
          )}

          {/* Academic Paragraphs with Section Letters */}
          {currentPassage.paragraphs && currentPassage.paragraphs.length > 0 && (
            <div className="space-y-6 text-base leading-[1.75] text-slate-800 font-sans">
              {currentPassage.paragraphs.map((para) => (
                <div key={para.id} className="relative">
                  {para.label && (
                    <div className="font-bold text-slate-900 text-base mb-1.5 select-none">
                      {para.label}
                    </div>
                  )}
                  <p className="whitespace-pre-line">{para.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* General Training Section Short Texts */}
          {currentPassage.shortTexts && currentPassage.shortTexts.length > 0 && (
            <div className="space-y-6 text-base leading-[1.75] text-slate-800 font-sans">
              {currentPassage.shortTexts.map((st) => (
                <div key={st.id} className="mb-6">
                  <h3 className="font-bold text-base text-slate-900 mb-2">
                    {st.title}
                  </h3>
                  <p className="whitespace-pre-line text-slate-800">{st.content}</p>
                </div>
              ))}
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

        {/* RIGHT PANE: LINKED QUESTIONS */}
        <div
          onContextMenu={handlePassageContextMenu}
          style={{ width: window.innerWidth >= 1024 ? `${100 - passageWidthPercent}%` : '100%' }}
          className="h-full overflow-y-auto px-6 sm:px-10 py-8 custom-scrollbar bg-white select-text"
        >
          {linkedGroups.length === 0 ? (
            <div className="text-slate-400 text-sm py-12 text-center">
              No questions assigned to this passage.
            </div>
          ) : (
            linkedGroups.map((group) => (
              <QuestionRenderer
                key={group.id}
                group={group}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onToggleFlag={(qNum, qId) => handleToggleFlag(qNum, qId)}
                activeQuestionNumber={activeQuestionNumber}
              />
            ))
          )}
        </div>

        {/* RIGHT-CLICK HIGHLIGHTER CONTEXT MENU */}
        {contextMenu && (
          <div
            style={{
              top: Math.min(contextMenu.y, window.innerHeight - 130),
              left: Math.min(contextMenu.x, window.innerWidth - 180),
            }}
            className="fixed z-50 bg-white rounded shadow-lg border border-slate-200 py-1 min-w-[150px] text-xs font-medium animate-in fade-in duration-75 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {contextMenu.savedRange && (
              <>
                <button
                  type="button"
                  onClick={() => handleApplyHighlight('yellow')}
                  className="w-full px-3 py-1.5 text-left hover:bg-slate-100 flex items-center gap-2 text-slate-800 transition-colors"
                >
                  <span className="w-3.5 h-3.5 rounded-xs bg-yellow-300 border border-yellow-400"></span>
                  <span>Highlight</span>
                </button>
              </>
            )}
            {(contextMenu.targetMark || contextMenu.savedRange) && (
              <button
                type="button"
                onClick={handleClearHighlight}
                className="w-full px-3 py-1.5 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 transition-colors border-t border-slate-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Highlight</span>
              </button>
            )}
          </div>
        )}
      </main>

      {/* 4. DOCKED OFFICIAL IELTS QUESTION NAVIGATOR BAR */}
      <StudentNavigator
        totalQuestions={testVersion.totalQuestions}
        answers={answers}
        activeQuestionNumber={activeQuestionNumber}
        onSelectQuestion={handleSelectQuestion}
        onToggleFlag={(qNum) => handleToggleFlag(qNum)}
        onPreviousQuestion={handlePreviousQuestion}
        onNextQuestion={handleNextQuestion}
        sections={navigatorSections}
        activeSectionIndex={activePassageIndex}
        onSelectSection={(idx) => {
          setActivePassageIndex(idx);
          const range = navigatorSections[idx];
          if (range) handleSelectQuestion(range.startQuestion);
        }}
        onSubmitClick={() => setShowConfirmModal(true)}
      />

      {/* 5. CONFIRM SUBMISSION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
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
                {totalQuestionsToCount}
              </strong>{' '}
              questions.
            </p>

            {unansweredNumbers.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-900">
                <div className="font-bold mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  {unansweredNumbers.length} Unanswered Questions:
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {unansweredNumbers.map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setShowConfirmModal(false);
                        handleSelectQuestion(num);
                      }}
                      className="px-2 py-0.5 bg-amber-200/70 hover:bg-amber-300 font-bold rounded text-[11px] text-amber-900 transition-colors"
                      title={`Jump to Question ${num}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-lg transition-colors"
              >
                Return to Test
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  'Confirm & Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. CONFIRM EXIT MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <h3 className="text-base font-bold text-slate-900 mb-2">Leave Examination?</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Your responses are automatically saved on the server. You can resume this attempt later from your dashboard.
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Continue Test
              </button>
              <button
                type="button"
                onClick={onExit}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg"
              >
                Exit Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. OFFICIAL INSTRUCTIONS & HELP MODAL */}
      <ExamHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        skill="reading"
      />

      {/* 8. DISPLAY & ACCESSIBILITY SETTINGS MODAL */}
      <ExamSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        textSize={textSize}
        onTextSizeChange={setTextSize}
        contrast={contrast}
        onContrastChange={setContrast}
      />
    </div>
  );
};
