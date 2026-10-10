import React, { useState, useEffect, useRef } from 'react';
import { ListeningAttempt, ListeningTestVersion, StudentAnswer, ListeningPart, QuestionGroup } from '../types';
import { api } from '../api';
import { ListeningQuestionRenderer } from '../components/ListeningQuestionRenderer';
import { AudioCheckModal } from '../components/AudioCheckModal';
import { ExamHeader } from '../components/ExamHeader';
import { StudentNavigator, NavigatorSection } from '../components/StudentNavigator';
import { ExamHelpModal } from '../components/ExamHelpModal';
import { ExamSettingsModal, TextSizeOption, ContrastOption } from '../components/ExamSettingsModal';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Check,
  AlertCircle,
  ArrowLeft,
  Send,
  Flag,
  Headphones,
  ShieldAlert,
} from 'lucide-react';

interface ListeningTestRunnerViewProps {
  testId: string;
  modeOverride?: 'practice' | 'mock';
  assignmentId?: string;
  packageAttemptId?: string;
  questionTypeFilter?: string;
  onExit: () => void;
  onFinish: (attemptId: string) => void;
}

export const ListeningTestRunnerView: React.FC<ListeningTestRunnerViewProps> = ({
  testId,
  modeOverride,
  assignmentId,
  packageAttemptId,
  questionTypeFilter,
  onExit,
  onFinish,
}) => {
  const [attempt, setAttempt] = useState<ListeningAttempt | null>(null);
  const [testVersion, setTestVersion] = useState<ListeningTestVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Audio check modal
  const [showAudioCheck, setShowAudioCheck] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);

  // Test navigation
  const [activePartIndex, setActivePartIndex] = useState(0);
  const [activeQuestionNumber, setActiveQuestionNumber] = useState(1);
  const [answers, setAnswers] = useState<Record<number, StudentAnswer>>({});
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Saved');

  // Timer states
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Audio player states
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);

  // Interruption tracking
  const [interruptionDetected, setInterruptionDetected] = useState(false);
  const [interruptionMessage, setInterruptionMessage] = useState<string | null>(null);
  const hasLoggedReloadRef = useRef(false);

  // Accessibility / Comfort state
  const [textSize, setTextSize] = useState<TextSizeOption>('standard');
  const [contrast, setContrast] = useState<ContrastOption>('standard');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Start or resume test
  useEffect(() => {
    let isMounted = true;
    async function loadTest() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.startListeningAttempt(testId, { modeOverride, assignmentId, packageAttemptId });
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

        // If mock test, set up deadline countdown
        if (res.attempt.deadlineAt) {
          const deadline = new Date(res.attempt.deadlineAt).getTime();
          const now = Date.now();
          const left = Math.max(0, Math.floor((deadline - now) / 1000));
          setRemainingSeconds(left);
        }

        // Show audio check modal if new attempt or hasn't started audio yet
        if (!res.attempt.wasInterrupted) {
          setShowAudioCheck(true);
        } else {
          // Attempt was previously resumed/reloaded!
          setInterruptionDetected(true);
          setInterruptionMessage('Session resumed from prior disconnect. Exam timer remained active on server.');
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to start listening test');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadTest();
    return () => {
      isMounted = false;
    };
  }, [testId, modeOverride]);

  // Detect window reload / disconnect interruption
  useEffect(() => {
    if (!attempt || attempt.status !== 'in_progress' || hasLoggedReloadRef.current) return;

    // Check if this is a reload recovery
    const perfEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (perfEntries.length > 0 && perfEntries[0].type === 'reload') {
      hasLoggedReloadRef.current = true;
      setInterruptionDetected(true);
      setInterruptionMessage('Page reload detected. Interruption recorded on test session.');
      api.recordListeningInterruption(attempt.id, {
        eventType: 'reload',
        durationSeconds: 5,
      }).catch((e) => console.error('Failed to log reload interruption', e));
    }

    // Window blur or offline listeners for mock mode
    if (attempt.mode === 'mock') {
      const handleOffline = () => {
        setInterruptionDetected(true);
        setInterruptionMessage('Network connection lost. Reconnecting...');
        api.recordListeningInterruption(attempt.id, {
          eventType: 'connection_loss',
        }).catch((e) => console.error(e));
      };

      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [attempt]);

  // Timer countdown
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

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setAudioCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setAudioDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      // In mock mode, automatically advance to next part if available
      if (attempt?.mode === 'mock' && testVersion && activePartIndex < testVersion.parts.length - 1) {
        setActivePartIndex((idx) => idx + 1);
      }
    };
    const onError = () => {
      setIsPlaying(false);
      if (attempt?.mode === 'mock') {
        setInterruptionDetected(true);
        setInterruptionMessage('Audio playback encountered an interruption error.');
        api.recordListeningInterruption(attempt.id, { eventType: 'audio_error' }).catch((e) => console.error(e));
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [attempt, testVersion, activePartIndex]);

  // When activePartIndex changes, update audio src if separate recordings exist
  const currentPart: ListeningPart | undefined = testVersion?.parts[activePartIndex];
  const audioSrc = currentPart?.audioUrl || testVersion?.audioConfig?.masterAudioUrl || '';

  useEffect(() => {
    if (!audioRef.current || !audioSrc || !hasStartedAudio) return;

    audioRef.current.src = audioSrc;
    audioRef.current.volume = volume;

    if (hasStartedAudio) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Auto-play blocked or audio load error:', err);
          setIsPlaying(false);
        });
    }
  }, [audioSrc, activePartIndex, hasStartedAudio]);

  // Autosave answers
  const saveAnswerToServer = async (qNum: number, qId: string, ans: string | string[], isFlag?: boolean) => {
    if (!attempt) return;
    setSaveStatus('saving');
    try {
      await api.saveListeningAnswer(attempt.id, {
        questionNumber: qNum,
        questionId: qId,
        answer: ans,
        isFlagged: isFlag,
      });
      setSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Autosave error', err);
      setSaveStatus('error');
    }
  };

  const handleAnswerChange = (qNum: number, qId: string, value: string | string[]) => {
    setAnswers((prev) => {
      const updated: Record<number, StudentAnswer> = {
        ...prev,
        [qNum]: {
          questionNumber: qNum,
          questionId: qId,
          userAnswer: value,
          isFlagged: prev[qNum]?.isFlagged || false,
          savedAt: new Date().toISOString(),
        },
      };
      saveAnswerToServer(qNum, qId, value, prev[qNum]?.isFlagged);
      return updated;
    });
  };

  const handleToggleFlag = (qNum: number, qId: string) => {
    setAnswers((prev) => {
      const current = prev[qNum] || {
        questionNumber: qNum,
        questionId: qId,
        userAnswer: '',
        isFlagged: false,
        savedAt: new Date().toISOString(),
      };
      const updated: Record<number, StudentAnswer> = {
        ...prev,
        [qNum]: {
          ...current,
          isFlagged: !current.isFlagged,
          savedAt: new Date().toISOString(),
        },
      };
      saveAnswerToServer(qNum, qId, current.userAnswer, !current.isFlagged);
      return updated;
    });
  };

  // Submit test
  const handleAutoExpire = async () => {
    if (!attempt || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await api.submitListeningAttempt(attempt.id);
      onFinish(res.attempt.id);
    } catch (err) {
      console.error('Auto expire submit error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!attempt || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const res = await api.submitListeningAttempt(attempt.id);
      setShowConfirmModal(false);
      onFinish(res.attempt.id);
    } catch (err: any) {
      alert(err.message || 'Failed to submit test');
      setIsSubmitting(false);
    }
  };

  // Audio controls
  const handleStartExamAudio = () => {
    setShowAudioCheck(false);
    setHasStartedAudio(true);
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error(e));
    }
  };

  const togglePlayPractice = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error(e));
    }
  };

  const handleSeekPractice = (timeSec: number) => {
    if (attempt?.mode === 'mock') return;
    if (audioRef.current) {
      audioRef.current.currentTime = timeSec;
      setAudioCurrentTime(timeSec);
    }
  };

  const handleReplay10Sec = () => {
    if (attempt?.mode === 'mock') {
      if (audioRef.current) {
        audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
        api.recordListeningInterruption(attempt.id, { eventType: 'replay', durationSeconds: 10 }).catch(console.error);
        setInterruptionDetected(true);
        setInterruptionMessage('Audio replayed in mock mode. Session marked as replayed rehearsal.');
      }
      return;
    }
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const formatAudioTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = Math.floor(secs % 60);
    return `${mins}:${remSecs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-sm font-semibold tracking-wide text-slate-300">
            Initializing IELTS Listening Test Session...
          </div>
        </div>
      </div>
    );
  }

  if (error || !attempt || !testVersion) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-rose-200 shadow-lg text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Test Session Error</h2>
          <p className="text-sm text-slate-600 mb-5">{error || 'Unable to load test content.'}</p>
          <button
            onClick={onExit}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Back to Catalogue
          </button>
        </div>
      </div>
    );
  }

  // Filter question groups and parts if skill/question-type practice is selected
  const displayedGroups = questionTypeFilter
    ? testVersion.questionGroups.filter((g) => g.questionType === questionTypeFilter)
    : testVersion.questionGroups;

  const displayedParts = questionTypeFilter
    ? testVersion.parts.filter((p) => displayedGroups.some((g) => g.partNumber === p.partNumber))
    : testVersion.parts;

  const activePart = displayedParts[activePartIndex] || displayedParts[0] || testVersion.parts[0];

  // Calculate answered count
  const allFilteredQuestions = displayedGroups.flatMap((g) => g.questions);
  const totalQuestionsToCount = allFilteredQuestions.length;
  const answeredCount = allFilteredQuestions.filter((q) => {
    const a = answers[q.questionNumber]?.userAnswer;
    if (Array.isArray(a)) return a.length > 0;
    return typeof a === 'string' && a.trim().length > 0;
  }).length;

  // Filter groups belonging to current part
  const currentPartGroups: QuestionGroup[] = displayedGroups.filter(
    (g) => g.partNumber === (activePart?.partNumber || 1)
  );

  // Build sections for StudentNavigator
  const listeningSections: NavigatorSection[] = displayedParts.map((p, idx) => {
    const pGroups = displayedGroups.filter((g) => g.partNumber === p.partNumber);
    const pQuestions = pGroups.flatMap((g) => g.questions);
    const qNums = pQuestions.map((q) => q.questionNumber).sort((a, b) => a - b);
    const startQ = qNums.length > 0 ? qNums[0] : 1;
    const endQ = qNums.length > 0 ? qNums[qNums.length - 1] : 1;
    return {
      title: `Part ${p.partNumber}`,
      startQuestion: startQ,
      endQuestion: endQ,
      sectionIndex: idx,
      questionNumbers: qNums,
    };
  });

  const handleSelectQuestion = (qNum: number) => {
    setActiveQuestionNumber(qNum);
    const targetSec = listeningSections.find((s) => qNum >= s.startQuestion && qNum <= s.endQuestion);
    if (targetSec && targetSec.sectionIndex !== activePartIndex) {
      setActivePartIndex(targetSec.sectionIndex);
    }

    setTimeout(() => {
      const el =
        document.getElementById(`listening-q-box-${qNum}`) ||
        document.getElementById(`question-input-${qNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const allFilteredQuestionNumbers = allFilteredQuestions.map((q) => q.questionNumber);

  const handleNextQuestion = () => {
    if (questionTypeFilter) {
      const idx = allFilteredQuestionNumbers.indexOf(activeQuestionNumber);
      if (idx !== -1 && idx < allFilteredQuestionNumbers.length - 1) {
        handleSelectQuestion(allFilteredQuestionNumbers[idx + 1]);
      }
    } else if (activeQuestionNumber < totalQuestionsToCount) {
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

  const getTextSizeClass = () => {
    switch (textSize) {
      case 'large':
        return 'text-[16px] leading-relaxed';
      case 'xlarge':
        return 'text-[19px] leading-loose';
      default:
        return 'text-[14px] leading-normal';
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
        return 'bg-slate-100 text-slate-900';
    }
  };

  return (
    <div className={`h-screen flex flex-col font-sans select-text overflow-hidden ${getThemeClass()} ${getTextSizeClass()}`}>
      {/* Hidden native HTML audio element */}
      <audio ref={audioRef} preload="auto" />

      {/* 1. TOP OFFICIAL EXAM HEADER */}
      <ExamHeader
        testTitle={attempt.testTitle || 'Academic Listening • Book 21'}
        testType="Academic Listening"
        skill="listening"
        remainingSeconds={remainingSeconds}
        elapsedSeconds={elapsedSeconds}
        saveStatus={saveStatus}
        lastSavedTime={lastSavedTime}
        onExitClick={() => setShowExitModal(true)}
        onSubmitClick={() => setShowConfirmModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        volume={Math.round(volume * 100)}
        onVolumeChange={(val) => {
          const frac = val / 100;
          setVolume(frac);
          if (audioRef.current) audioRef.current.volume = frac;
        }}
      />

      {/* 2. OFFICIAL SECTION SUBHEADER WITH AUDIO BAR (Matching Images 1-5 and Reading) */}
      {(() => {
        const activeSection = listeningSections[activePartIndex];
        const currentPartStartQ = activeSection?.startQuestion || (activePartIndex * 10 + 1);
        const currentPartEndQ = activeSection?.endQuestion || (activePartIndex * 10 + 10);

        return (
          <div className="bg-[#F4F3EE] border-b border-[#E5E2D9] px-6 sm:px-12 py-2.5 flex items-center justify-between text-xs sm:text-sm select-none shrink-0">
            {/* Left: Part Title & Instructions */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <span className="font-bold text-sm sm:text-base text-slate-900">
                Part {currentPart?.partNumber || (activePartIndex + 1)}
              </span>
              <span className="text-slate-700 font-normal text-xs sm:text-sm">
                Listen and answer questions {currentPartStartQ}–{currentPartEndQ}.
              </span>
            </div>

            {/* Right: Audio Player (Black square button, time, scrubber slider, total duration) */}
            <div className="flex items-center gap-3">
              {/* Black square play/pause button matching Images 1-5 */}
              <button
                type="button"
                onClick={togglePlayPractice}
                className="w-8 h-8 bg-black hover:bg-slate-800 text-white flex items-center justify-center transition-colors rounded-[2px] shadow-2xs cursor-pointer shrink-0"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                )}
              </button>

              {/* Current time */}
              <span className="font-mono text-xs sm:text-sm text-slate-800 tabular-nums min-w-[28px] text-right">
                {formatAudioTime(audioCurrentTime)}
              </span>

              {/* Scrubber slider */}
              <input
                type="range"
                min="0"
                max={audioDuration || 100}
                value={audioCurrentTime}
                onChange={(e) => handleSeekPractice(Number(e.target.value))}
                className="w-28 sm:w-48 md:w-72 h-1 bg-slate-300 rounded appearance-none cursor-pointer accent-black"
                title="Seek audio"
              />

              {/* Total duration */}
              <span className="font-mono text-xs sm:text-sm text-slate-800 tabular-nums min-w-[28px]">
                {formatAudioTime(audioDuration || 0)}
              </span>
            </div>
          </div>
        );
      })()}

      {/* INTERRUPTION ALERT BANNER */}
      {interruptionDetected && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 sm:px-12 py-2 text-xs text-amber-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 max-w-3xl">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Audio Interruption Recorded:</strong> {interruptionMessage || 'Playback was interrupted or reloaded.'}
            </span>
          </div>
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
              }
            }}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-[11px] shrink-0 ml-2"
          >
            Resume Audio
          </button>
        </div>
      )}

      {/* 3. MAIN SCROLLABLE CONTENT AREA (Pure white, matching Images 1-5) */}
      <main className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 bg-white select-text custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          {currentPartGroups.length === 0 ? (
            <div className="text-slate-400 text-sm py-12 text-center">
              No questions assigned to this part.
            </div>
          ) : (
            currentPartGroups.map((group: QuestionGroup) => (
              <ListeningQuestionRenderer
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

      {/* 4. PINNED BOTTOM QUESTION NAVIGATOR */}
      <StudentNavigator
        totalQuestions={totalQuestionsToCount}
        answers={answers}
        activeQuestionNumber={activeQuestionNumber}
        onSelectQuestion={handleSelectQuestion}
        onPreviousQuestion={handlePreviousQuestion}
        onNextQuestion={handleNextQuestion}
        onToggleFlag={(qNum) => {
          const q = allFilteredQuestions.find((item) => item.questionNumber === qNum);
          if (q) handleToggleFlag(qNum, q.id);
        }}
        onSubmitClick={() => setShowConfirmModal(true)}
        sections={listeningSections}
        activeSectionIndex={activePartIndex}
        onSelectSection={(idx) => {
          setActivePartIndex(idx);
          const sec = listeningSections[idx];
          if (sec && (activeQuestionNumber < sec.startQuestion || activeQuestionNumber > sec.endQuestion)) {
            setActiveQuestionNumber(sec.startQuestion);
          }
        }}
      />

      {/* AUDIO CHECK MODAL (Before test start) */}
      <AudioCheckModal
        isOpen={showAudioCheck}
        onClose={() => setShowAudioCheck(false)}
        onConfirmStart={handleStartExamAudio}
        testTitle={attempt.testTitle}
      />

      {/* EXIT TEST MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-2">Exit Listening Test?</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Your test progress and answers have been auto-saved. You can resume this session anytime from your dashboard.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Continue Test
              </button>
              <button
                onClick={onExit}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-black hover:bg-slate-800 transition-colors"
              >
                Exit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM SUBMISSION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-2">Submit IELTS Listening Test?</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              You have answered <strong>{answeredCount}</strong> out of <strong>{totalQuestionsToCount}</strong> questions.
              {totalQuestionsToCount - answeredCount > 0 && (
                <span className="text-amber-600 font-semibold block mt-1">
                  You have {totalQuestionsToCount - answeredCount} unanswered questions remaining.
                </span>
              )}
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500 mb-5">
              Once submitted, your responses will be marked immediately according to official IELTS band score tables. Answer keys, explanations, and listening transcripts will be revealed.
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Return to Test
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-black hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXAM HELP MODAL */}
      <ExamHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        skill="listening"
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
