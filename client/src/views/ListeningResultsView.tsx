import React, { useState, useEffect, useRef } from 'react';
import { ListeningAttempt, ListeningTestVersion, AttemptItemResult } from '../types';
import { api } from '../api';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RotateCcw,
  Headphones,
  Play,
  Pause,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Volume2,
} from 'lucide-react';

interface ListeningResultsViewProps {
  attemptId: string;
  onBackToCatalogue: () => void;
  onRetryTest: (testId: string) => void;
}

export const ListeningResultsView: React.FC<ListeningResultsViewProps> = ({
  attemptId,
  onBackToCatalogue,
  onRetryTest,
}) => {
  const [attempt, setAttempt] = useState<ListeningAttempt | null>(null);
  const [testVersion, setTestVersion] = useState<ListeningTestVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  // Review audio playback states
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudioPartIdx, setCurrentAudioPartIdx] = useState(0);

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  const loadAttempt = async () => {
    setLoading(true);
    try {
      const res = await api.getListeningAttempt(attemptId);
      setAttempt(res.attempt);
      setTestVersion(res.testVersion);
    } catch (err) {
      console.error('Failed to load listening attempt result', err);
    } finally {
      setLoading(false);
    }
  };

  const playAtTimestamp = (partNumber: number, timestampSeconds?: number) => {
    if (!testVersion) return;
    const pIdx = Math.max(0, partNumber - 1);
    setCurrentAudioPartIdx(pIdx);

    const part = testVersion.parts[pIdx];
    const src = part?.audioUrl || testVersion.audioConfig?.masterAudioUrl;

    if (audioRef.current && src) {
      audioRef.current.src = src;
      if (timestampSeconds !== undefined && timestampSeconds > 0) {
        audioRef.current.currentTime = timestampSeconds;
      }
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(console.error);
    }
  };

  const toggleReviewAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(console.error);
    }
  };

  if (loading || !attempt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-slate-500 font-medium">Loading listening test results and marking analysis...</div>
      </div>
    );
  }

  const rawScore = attempt.rawScore || 0;
  const totalQuestions = attempt.totalQuestions;
  const accuracyPct = Math.round((rawScore / totalQuestions) * 100);
  const results: AttemptItemResult[] = attempt.results || [];

  const filteredResults = results.filter((r) => {
    if (filter === 'incorrect') return !r.isCorrect;
    if (filter === 'correct') return r.isCorrect;
    return true;
  });

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}m ${remSecs}s`;
  };

  const perfByType = attempt.performanceByType || {};

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hidden audio element for review playback */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlayingAudio(false)}
        onPause={() => setIsPlayingAudio(false)}
        onPlay={() => setIsPlayingAudio(true)}
      />

      {/* Top Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToCatalogue}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalogue
        </button>

        <button
          onClick={() => onRetryTest(attempt.testId)}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Test
        </button>
      </div>

      {/* SUMMARY SCORECARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-3">
              <Headphones className="w-3.5 h-3.5 text-indigo-600" />
              IELTS Listening Performance Report
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
              {attempt.testTitle || 'Listening Test'}
            </h1>
            <p className="text-xs text-slate-500">
              Completed on {new Date(attempt.submittedAt || attempt.startedAt).toLocaleString()} • Mode:{' '}
              <span className="font-semibold text-slate-700 capitalize">{attempt.mode}</span>
            </p>
          </div>

          {/* Band Score Pill */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
            <div className="text-center px-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Raw Score</div>
              <div className="text-3xl font-black text-slate-900">
                {rawScore}
                <span className="text-sm font-semibold text-slate-400">/{totalQuestions}</span>
              </div>
            </div>

            {attempt.bandScore !== undefined && attempt.bandScore !== null && (
              <>
                <div className="w-px h-10 bg-slate-300" />
                <div className="text-center px-3">
                  <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider flex items-center gap-1 justify-center">
                    <Award className="w-3.5 h-3.5" />
                    Band Score
                  </div>
                  <div className="text-3xl font-black text-indigo-600">
                    {attempt.bandScore.toFixed(1)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-medium mb-1">Accuracy</div>
            <div className="text-xl font-bold text-slate-900">{accuracyPct}%</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-medium mb-1">Time Elapsed</div>
            <div className="text-xl font-bold text-slate-900">{formatDuration(attempt.durationSeconds || 0)}</div>
          </div>
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
            <div className="text-xs text-emerald-700 font-medium mb-1">Correct Answers</div>
            <div className="text-xl font-bold text-emerald-700">{rawScore}</div>
          </div>
          <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-100">
            <div className="text-xs text-rose-700 font-medium mb-1">Incorrect Answers</div>
            <div className="text-xl font-bold text-rose-700">{totalQuestions - rawScore}</div>
          </div>
        </div>

        {/* REHEARSAL AUTHENTICITY / INTERRUPTION BADGE */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          {attempt.wasInterrupted ? (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm text-amber-900 mb-0.5">
                  Interrupted Session ({attempt.interruptionCount || 1} event recorded)
                </div>
                <p className="text-amber-700 leading-relaxed">
                  This mock session experienced a page reload, network pause, or audio replay during the timed test. In official test conditions, candidates hear recordings once without interruption. This score cannot be certified as an uninterrupted exam rehearsal.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-sm text-emerald-900 mb-0.5">
                  Uninterrupted Exam Rehearsal Verified
                </div>
                <p className="text-emerald-700">
                  This test was completed in continuous real-time without browser reloads or unpermitted audio seeking.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QUESTION TYPE PERFORMANCE BREAKDOWN */}
      {Object.keys(perfByType).length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            Performance by Listening Question Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(perfByType).map(([qType, stats]) => {
              const typePct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
              return (
                <div
                  key={qType}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800 capitalize">
                      {qType.replace(/_/g, ' ')}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {stats.correct} / {stats.total} questions correct
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-black ${
                        typePct >= 70 ? 'text-emerald-600' : typePct >= 50 ? 'text-amber-600' : 'text-rose-600'
                      }`}
                    >
                      {typePct}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REVIEW AUDIO PLAYER WIDGET */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 mb-8 shadow-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleReviewAudio}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-sm transition-colors"
          >
            {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">Audio Review Player</div>
            <div className="text-sm font-semibold text-white">
              Part {currentAudioPartIdx + 1}: {testVersion?.parts[currentAudioPartIdx]?.title || 'Section Audio'}
            </div>
          </div>
        </div>

        {/* Part selector buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {testVersion?.parts.map((p, idx) => (
            <button
              key={p.partNumber}
              onClick={() => playAtTimestamp(p.partNumber, 0)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentAudioPartIdx === idx
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Part {p.partNumber}
            </button>
          ))}
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Detailed Answer Analysis</h2>
        <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({results.length})
          </button>
          <button
            onClick={() => setFilter('incorrect')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filter === 'incorrect' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Incorrect ({results.filter((r) => !r.isCorrect).length})
          </button>
          <button
            onClick={() => setFilter('correct')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filter === 'correct' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Correct ({results.filter((r) => r.isCorrect).length})
          </button>
        </div>
      </div>

      {/* DETAILED ANSWER LIST */}
      <div className="space-y-4">
        {filteredResults.map((item) => {
          // Find question item from questionGroups
          const groupOfQ = testVersion?.questionGroups.find((g) =>
            g.questions.some((q) => q.questionNumber === item.questionNumber)
          );
          const questionItem = groupOfQ?.questions.find((q) => q.questionNumber === item.questionNumber);
          const partOfQ = testVersion?.parts.find((p) => p.partNumber === groupOfQ?.partNumber);

          const studentAnsDisplay = Array.isArray(item.userAnswer)
            ? item.userAnswer.join(', ')
            : item.userAnswer || '(No answer provided)';

          const correctAnsDisplay = Array.isArray(item.answerKey)
            ? item.answerKey.join(', ')
            : item.answerKey;

          return (
            <div
              key={item.questionNumber}
              className={`bg-white rounded-2xl border p-5 shadow-2xs transition-all ${
                item.isCorrect ? 'border-emerald-200' : 'border-rose-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center ${
                      item.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Q{item.questionNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 capitalize">
                    {groupOfQ?.questionType.replace(/_/g, ' ') || 'Listening question'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Correct (+1.0)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      <XCircle className="w-3.5 h-3.5" />
                      Incorrect (0.0)
                    </span>
                  )}
                </div>
              </div>

              {/* Question text / prompt */}
              <div className="text-sm font-semibold text-slate-800 mb-3">
                {questionItem?.prompt || `Question ${item.questionNumber}`}
              </div>

              {/* Responses comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-xs">
                <div
                  className={`p-3 rounded-xl border ${
                    item.isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Your Response
                  </div>
                  <div className={`font-semibold ${item.isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {studentAnsDisplay}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Correct Answer Key
                  </div>
                  <div className="font-semibold text-slate-900">
                    {correctAnsDisplay}
                  </div>
                </div>
              </div>

              {/* Explanation & Transcript Excerpt */}
              {(item.explanation || questionItem?.transcriptExcerpt) && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 mt-2 space-y-2">
                  {item.explanation && (
                    <div>
                      <span className="font-bold text-indigo-700 mr-1.5">Explanation:</span>
                      {item.explanation}
                    </div>
                  )}

                  {questionItem?.transcriptExcerpt && (
                    <div className="bg-indigo-50/60 border border-indigo-100 p-2.5 rounded-lg text-indigo-950 italic text-xs">
                      <div className="text-[10px] font-sans font-bold text-indigo-700 not-italic uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Audio Transcript Excerpt
                      </div>
                      "{questionItem.transcriptExcerpt}"
                    </div>
                  )}

                  {/* Audio timestamp jump button */}
                  {partOfQ && (
                    <div className="pt-1 flex items-center justify-end">
                      <button
                        onClick={() => playAtTimestamp(partOfQ.partNumber, questionItem?.audioTimestampSeconds || 0)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-white border border-indigo-200 px-2.5 py-1 rounded-md shadow-2xs hover:bg-indigo-50 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        Listen at audio cue {questionItem?.audioTimestampSeconds ? `(${questionItem.audioTimestampSeconds}s)` : ''}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
