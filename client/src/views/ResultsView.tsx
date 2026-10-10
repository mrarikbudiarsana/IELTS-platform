import React, { useState, useEffect } from 'react';
import { ReadingAttempt, ReadingTestVersion, AttemptItemResult } from '../types';
import { api } from '../api';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Filter,
  Quote,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface ResultsViewProps {
  attemptId: string;
  onBackToCatalogue: () => void;
  onRetryTest: (testId: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  attemptId,
  onBackToCatalogue,
  onRetryTest,
}) => {
  const [attempt, setAttempt] = useState<ReadingAttempt | null>(null);
  const [testVersion, setTestVersion] = useState<ReadingTestVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  const loadAttempt = async () => {
    setLoading(true);
    try {
      const res = await api.getAttempt(attemptId);
      setAttempt(res.attempt);
      setTestVersion(res.testVersion);
    } catch (err) {
      console.error('Failed to load attempt result', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !attempt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-slate-500 font-medium">Loading test results and marking analysis...</div>
      </div>
    );
  }

  const rawScore = attempt.rawScore || 0;
  const totalQuestions = attempt.totalQuestions;
  const accuracyPct = Math.round((rawScore / totalQuestions) * 100);
  const results = attempt.results || [];

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
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
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                {attempt.testType === 'academic' ? 'Academic Reading' : 'General Training'}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                {attempt.mode === 'mock' ? 'Full Timed Mock' : 'Practice Set'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {attempt.isFirstAttempt ? 'First Attempt' : 'Retry Attempt'}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {attempt.testTitle}
            </h1>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
              <span>Submitted: {new Date(attempt.submittedAt || attempt.startedAt).toLocaleString()}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Time: {formatDuration(attempt.durationSeconds)}
              </span>
            </div>
          </div>

          {/* ESTIMATED BAND OR ACCURACY CARD */}
          <div className="flex items-center gap-6">
            <div className="text-center px-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Raw Score
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {rawScore} <span className="text-lg font-normal text-slate-400">/ {totalQuestions}</span>
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                {accuracyPct}% Accuracy
              </div>
            </div>

            {attempt.bandScore !== undefined && attempt.bandScore !== null ? (
              <div className="text-center bg-indigo-50 border-2 border-indigo-200 p-4 rounded-2xl min-w-36">
                <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-0.5 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Estimated Band
                </div>
                <div className="text-4xl font-black text-indigo-600">
                  {attempt.bandScore.toFixed(1)}
                </div>
                <div className="text-[10px] text-indigo-700 font-medium mt-1 leading-tight">
                  Based on official IELTS conversion
                </div>
              </div>
            ) : (
              <div className="text-center bg-slate-50 border border-slate-200 p-4 rounded-2xl min-w-36">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                  Practice Mode
                </div>
                <div className="text-2xl font-black text-slate-700">
                  {rawScore} Marks
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-1 leading-tight">
                  (Estimated Band requires 40-Q mock)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Question Map Matrix */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2.5">
            Question Map:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {results.map((r) => (
              <a
                key={r.questionNumber}
                href={`#result-q-${r.questionNumber}`}
                className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center transition-transform hover:scale-110 ${
                  r.isCorrect
                    ? 'bg-emerald-500 text-white'
                    : 'bg-rose-500 text-white'
                }`}
                title={`Question ${r.questionNumber}: ${r.isCorrect ? 'Correct' : 'Incorrect'}`}
              >
                {r.questionNumber}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          Question-by-Question Review ({filteredResults.length})
        </h2>

        <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {(['all', 'incorrect', 'correct'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f === 'all' ? 'All' : f === 'incorrect' ? 'Incorrect Only' : 'Correct Only'}
            </button>
          ))}
        </div>
      </div>

      {/* DETAILED QUESTION BREAKDOWN */}
      <div className="space-y-4">
        {filteredResults.map((item) => {
          const studentAnsDisplay = Array.isArray(item.userAnswer)
            ? item.userAnswer.join(', ')
            : item.userAnswer || '(No answer provided)';

          const answerKeyDisplay = Array.isArray(item.answerKey)
            ? item.answerKey.join(' OR ')
            : item.answerKey;

          return (
            <div
              key={item.questionNumber}
              id={`result-q-${item.questionNumber}`}
              className={`bg-white rounded-2xl border p-5 transition-shadow shadow-2xs ${
                item.isCorrect ? 'border-emerald-200/80' : 'border-rose-200/80'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                      item.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.questionNumber}
                  </span>
                  <span className="font-bold text-sm text-slate-900">
                    Question {item.questionNumber}
                  </span>
                  {item.paragraphRef && (
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      Paragraph {item.paragraphRef}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {item.isCorrect ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Correct (1 Mark)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Incorrect (0 Marks)
                    </span>
                  )}
                </div>
              </div>

              {/* Answers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-sm">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Your Response
                  </div>
                  <div
                    className={`font-medium ${
                      item.isCorrect ? 'text-emerald-800' : 'text-rose-700'
                    }`}
                  >
                    {studentAnsDisplay}
                  </div>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide mb-1">
                    Correct Answer
                  </div>
                  <div className="font-bold text-emerald-950">
                    {answerKeyDisplay}
                  </div>
                  {item.acceptedAlternatives && item.acceptedAlternatives.length > 0 && (
                    <div className="text-[11px] text-emerald-700 mt-1">
                      Also accepted: {item.acceptedAlternatives.join(', ')}
                    </div>
                  )}
                </div>
              </div>

              {/* Explanation & Passage Evidence */}
              {(item.explanation || item.evidenceQuote) && (
                <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 text-xs space-y-2">
                  {item.explanation && (
                    <div>
                      <span className="font-bold text-slate-700">Explanation: </span>
                      <span className="text-slate-600 leading-relaxed">
                        {item.explanation}
                      </span>
                    </div>
                  )}

                  {item.evidenceQuote && (
                    <div className="flex items-start gap-1.5 text-indigo-900 bg-indigo-50/80 p-2 rounded-lg border border-indigo-100">
                      <Quote className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-indigo-700">Passage Evidence: </span>
                        <span className="italic">"{item.evidenceQuote}"</span>
                      </div>
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
