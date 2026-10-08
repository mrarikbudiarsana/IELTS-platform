import React, { useState, useEffect, useRef } from 'react';
import { ListeningAttempt, ListeningTestVersion, StudentAnswer, ListeningPart, QuestionGroup } from '../types';
import { api } from '../api';
import { ListeningQuestionRenderer } from '../components/ListeningQuestionRenderer';
import { AudioCheckModal } from '../components/AudioCheckModal';
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
  onExit: () => void;
  onFinish: (attemptId: string) => void;
}

export const ListeningTestRunnerView: React.FC<ListeningTestRunnerViewProps> = ({
  testId,
  modeOverride,
  assignmentId,
  packageAttemptId,
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

  // Calculate answered count
  const allQuestions = testVersion.questionGroups.flatMap((g) => g.questions);
  const totalQuestions = allQuestions.length;
  const answeredCount = allQuestions.filter((q) => {
    const a = answers[q.questionNumber]?.userAnswer;
    if (Array.isArray(a)) return a.length > 0;
    return typeof a === 'string' && a.trim().length > 0;
  }).length;

  // Filter groups belonging to current part
  const currentPartGroups: QuestionGroup[] = testVersion.questionGroups.filter(
    (g) => g.partNumber === (currentPart?.partNumber || 1)
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-text">
      {/* Hidden native HTML audio element */}
      <audio ref={audioRef} preload="auto" />

      {/* TOP EXAM HEADER */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-3 sticky top-0 z-30 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Test Name & Mode */}
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Exit test session"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" />
                <span>IELTS Listening • {attempt.mode === 'mock' ? 'Official Timed Mock' : 'Practice Mode'}</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
                {attempt.testTitle}
              </h1>
            </div>
          </div>

          {/* Autosave & Clock Status */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300">
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  Saving answer...
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  Saved ({lastSavedTime})
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="flex items-center gap-1 text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Save failed
                </span>
              )}
            </div>

            {/* Countdown timer for mock, or elapsed timer for practice */}
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl shadow-inner">
              <Clock className="w-4 h-4 text-indigo-400" />
              <div className="font-mono text-sm sm:text-base font-bold text-white">
                {remainingSeconds !== null ? formatTimer(remainingSeconds) : formatTimer(elapsedSeconds)}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Finish Test
            </button>
          </div>
        </div>
      </header>

      {/* AUDIO PLAYER BAR */}
      <div className="bg-slate-800 text-white border-b border-slate-700 px-4 py-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Part indicator and play state */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              {attempt.mode === 'practice' ? (
                <button
                  onClick={togglePlayPractice}
                  className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white shadow-xs transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-indigo-400">
                  {isPlaying ? <Headphones className="w-4 h-4 animate-pulse" /> : <Pause className="w-4 h-4" />}
                </div>
              )}

              <div>
                <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                  <span>Part {activePartIndex + 1}: {currentPart?.title}</span>
                  {attempt.mode === 'mock' && (
                    <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-400/30">
                      Exam Controlled
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isPlaying ? 'Audio playing' : 'Audio paused / stopped'} • {formatTimer(Math.floor(audioCurrentTime))} / {formatTimer(Math.floor(audioDuration || 0))}
                </div>
              </div>
            </div>

            {/* Practice Seek Bar */}
            {attempt.mode === 'practice' ? (
              <div className="flex-1 max-w-xs sm:max-w-md mx-3 flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max={audioDuration || 100}
                  value={audioCurrentTime}
                  onChange={(e) => handleSeekPractice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            ) : (
              <div className="hidden md:flex flex-1 max-w-xs mx-3 items-center">
                <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${audioDuration > 0 ? (audioCurrentTime / audioDuration) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Volume and Tools */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            {attempt.mode === 'practice' && (
              <button
                onClick={handleReplay10Sec}
                className="text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-700/60 hover:bg-slate-700 flex items-center gap-1 text-[11px]"
                title="Replay last 10 seconds"
              >
                <RotateCcw className="w-3 h-3" />
                -10s
              </button>
            )}

            {/* Volume slider */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setVolume(val);
                  if (audioRef.current) audioRef.current.volume = val;
                }}
                className="w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                title="Volume control"
              />
            </div>

            {/* Rehearsal Warning Button if mock */}
            {attempt.mode === 'mock' && (
              <button
                onClick={() => handleReplay10Sec()}
                className="text-amber-400 hover:text-amber-300 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 flex items-center gap-1 text-[11px]"
                title="Replay recording with penalty log"
              >
                <RotateCcw className="w-3 h-3" />
                Emergency Replay
              </button>
            )}
          </div>
        </div>
      </div>

      {/* INTERRUPTION ALERT BANNER */}
      {interruptionDetected && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-3xl">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Audio Interruption Recorded:</strong> {interruptionMessage || 'Playback was interrupted or reloaded.'} Official exam rehearsal score will document this event.
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

      {/* PART TABS SELECTOR */}
      <div className="bg-white border-b border-slate-200 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2">
          {testVersion.parts.map((p, idx) => {
            const partGroups = testVersion.questionGroups.filter((g) => g.partNumber === p.partNumber);
            const partQuestions = partGroups.flatMap((g) => g.questions);
            const partAnswered = partQuestions.filter((q) => {
              const a = answers[q.questionNumber]?.userAnswer;
              return Array.isArray(a) ? a.length > 0 : !!a;
            }).length;

            return (
              <button
                key={p.partNumber}
                onClick={() => setActivePartIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activePartIndex === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>Part {p.partNumber}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activePartIndex === idx ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {partAnswered}/{partQuestions.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 pb-28">
        {currentPart && (
          <div className="mb-4">
            <div className="bg-indigo-950 text-white rounded-2xl p-5 mb-6 shadow-xs border border-indigo-900">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-indigo-800 pb-3 mb-3">
                <div className="font-extrabold text-base sm:text-lg tracking-tight">
                  Part {currentPart.partNumber}: {currentPart.title}
                </div>
                <div className="text-xs text-indigo-300 font-medium bg-indigo-900/60 px-3 py-1 rounded-full border border-indigo-700/50">
                  {currentPartGroups.reduce((acc: number, g: QuestionGroup) => acc + g.questions.length, 0)} Questions in this section
                </div>
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                {currentPart.context ||
                  'Listen to the recording carefully and answer all questions. In the official test, you will hear each recording ONCE only.'}
              </p>
            </div>

            {/* QUESTION GROUPS */}
            {currentPartGroups.map((group: QuestionGroup) => (
              <ListeningQuestionRenderer
                key={group.id}
                group={group}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onToggleFlag={handleToggleFlag}
                activeQuestionNumber={activeQuestionNumber}
              />
            ))}
          </div>
        )}
      </main>

      {/* BOTTOM QUESTION NAVIGATOR BAR */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-300 shadow-lg px-4 py-3 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-600"></span>
              <span>Answered ({answeredCount}/{totalQuestions})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-200 border border-slate-300"></span>
              <span>Unanswered ({totalQuestions - answeredCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flag className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>Flagged for Review</span>
            </div>
          </div>

          {/* Quick jump question numbers */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1">
            {allQuestions.map((q) => {
              const ansObj = answers[q.questionNumber];
              const isAns = ansObj?.userAnswer && (Array.isArray(ansObj.userAnswer) ? ansObj.userAnswer.length > 0 : !!ansObj.userAnswer);
              const isFlagged = ansObj?.isFlagged;
              const isCurrent = q.questionNumber === activeQuestionNumber;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQuestionNumber(q.questionNumber);
                    // Find part containing this question
                    const pIdx = testVersion.parts.findIndex((p) =>
                      testVersion.questionGroups.some((g) => g.partNumber === p.partNumber && g.questions.some((item) => item.questionNumber === q.questionNumber))
                    );
                    if (pIdx !== -1 && pIdx !== activePartIndex) {
                      setActivePartIndex(pIdx);
                    }
                  }}
                  className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'ring-2 ring-indigo-600 ring-offset-1'
                      : ''
                  } ${
                    isAns
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {q.questionNumber}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </footer>

      {/* AUDIO CHECK MODAL (Before test start) */}
      <AudioCheckModal
        isOpen={showAudioCheck}
        onClose={() => setShowAudioCheck(false)}
        onConfirmStart={handleStartExamAudio}
        testTitle={attempt.testTitle}
      />

      {/* CONFIRM SUBMISSION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Submit IELTS Listening Test?</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              You have answered <strong>{answeredCount}</strong> out of <strong>{totalQuestions}</strong> questions.
              {totalQuestions - answeredCount > 0 && (
                <span className="text-amber-600 font-semibold block mt-1">
                  You have {totalQuestions - answeredCount} unanswered questions remaining.
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
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1.5"
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
