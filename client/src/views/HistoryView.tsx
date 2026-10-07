import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Award, Clock, ArrowLeft, RotateCcw, BookOpen, Sparkles } from 'lucide-react';

interface HistoryViewProps {
  onBackToCatalogue: () => void;
  onViewResults: (attemptId: string) => void;
  onRetryTest: (testId: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onBackToCatalogue,
  onViewResults,
  onRetryTest,
}) => {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttempts();
  }, []);

  const loadAttempts = async () => {
    setLoading(true);
    try {
      const res = await api.getAttempts();
      setAttempts(res.attempts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCatalogue}
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">My Reading Test History</h1>
            <p className="text-xs text-slate-500">
              Track your raw marks, accuracy, and estimated IELTS band scores over time.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading test history...</div>
      ) : attempts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No test attempts recorded yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Take your first reading mock or practice set to see your verified results here.
          </p>
          <button
            onClick={onBackToCatalogue}
            className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow"
          >
            Browse Practice & Mocks
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {attempts.map((att) => (
            <div
              key={att.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      att.testType === 'academic'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {att.testType}
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                    {att.mode === 'mock' ? 'Timed Mock' : 'Practice Set'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {att.isFirstAttempt ? 'First Attempt' : 'Retry'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{att.testTitle}</h3>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>{new Date(att.submittedAt || att.startedAt).toLocaleString()}</span>
                  <span>•</span>
                  <span>{Math.floor(att.durationSeconds / 60)} minutes</span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-medium">Score</div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {att.rawScore !== undefined ? `${att.rawScore} / ${att.totalQuestions}` : 'In progress'}
                  </div>
                  {att.bandScore !== undefined && att.bandScore !== null && (
                    <div className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded inline-block mt-0.5">
                      Band {att.bandScore.toFixed(1)}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onViewResults(att.id)}
                    className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Review Answers
                  </button>
                  <button
                    onClick={() => onRetryTest(att.testId)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl"
                    title="Retake Test"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
