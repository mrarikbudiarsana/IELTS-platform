import React, { useState, useEffect } from 'react';
import { ReadingTest } from '../types';
import { api } from '../api';
import { BookOpen, Clock, CheckCircle2, Play, Award, Filter, Sparkles } from 'lucide-react';

interface CatalogueViewProps {
  onStartTest: (testId: string, modeOverride?: 'practice' | 'mock') => void;
  onViewResults: (attemptId: string) => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  onStartTest,
  onViewResults,
  onOpenLogin,
  isLoggedIn,
}) => {
  const [tests, setTests] = useState<ReadingTest[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'academic' | 'general'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'mock' | 'practice'>('all');

  useEffect(() => {
    loadData();
  }, [filterType, filterCategory, isLoggedIn]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterType !== 'all') params.testType = filterType;
      if (filterCategory !== 'all') params.category = filterCategory;

      const res = await api.getTests(params);
      setTests(res.tests);

      if (isLoggedIn) {
        const attRes = await api.getAttempts();
        setAttempts(attRes.attempts);
      }
    } catch (err) {
      console.error('Failed to load tests', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter((t) => {
    if (filterType !== 'all' && t.testType !== filterType) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-10 border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Authentic Computer-Delivered IELTS Interface
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            IELTS Reading Practice & Full Mocks
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Master all 16 official question formats with side-by-side passage navigation, real-time autosave, text highlighting, and strict non-fuzzy automated marking calibrated to official IELTS band thresholds.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Academic & General Training
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              All 16 Question Formats Supported
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Official Band Conversions
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1">
            Test Version:
          </span>
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {(['all', 'academic', 'general'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                  filterType === t ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'all' ? 'All Modules' : t === 'academic' ? 'Academic' : 'General Training'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1">
            Mode:
          </span>
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {(['all', 'mock', 'practice'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                  filterCategory === c ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c === 'all' ? 'All Types' : c === 'mock' ? 'Timed Mocks' : 'Untimed Practice'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 text-sm">
          Loading test catalogue...
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No tests match current filters</h3>
          <p className="text-sm text-slate-500 mt-1">Try switching filter selections above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTests.map((test) => {
            const pastAttempt = attempts.find((a) => a.testId === test.id && (a.status === 'submitted' || a.status === 'expired'));

            return (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${
                          test.testType === 'academic'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {test.testType === 'academic' ? 'Academic Reading' : 'General Training'}
                      </span>

                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          test.category === 'mock'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {test.category === 'mock' ? 'Full 60-Min Mock' : 'Section Practice'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      v{test.currentVersionNumber}.0
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {test.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 font-medium">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{test.timeLimitMinutes} minutes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span>{test.totalQuestions} Questions</span>
                    </div>
                  </div>

                  {/* Question types coverage pills */}
                  <div className="text-xs text-slate-500 mb-4">
                    <div className="font-semibold text-slate-600 mb-1.5">Includes formats:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {test.testType === 'academic' ? (
                        <>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">True/False/Not Given</span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Sentence Completion</span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Diagram Label</span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Matching Headings</span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Matching Features</span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Summary with Options</span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Multiple Choice Multi</span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Short Answer</span>
                        </>
                      ) : (
                        <>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Matching Information</span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Table Completion</span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Note Completion</span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Flow-Chart Completion</span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Summary with Words</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions & Past Attempt Info */}
                <div className="pt-4 border-t border-slate-100 mt-2">
                  {pastAttempt && (
                    <div className="mb-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">Previous Score: </span>
                        <span className="font-bold text-slate-800">
                          {pastAttempt.rawScore} / {pastAttempt.totalQuestions}
                        </span>
                        {pastAttempt.bandScore && (
                          <span className="ml-2 font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                            Band {pastAttempt.bandScore.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => onViewResults(pastAttempt.id)}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
                      >
                        Review Answers
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!isLoggedIn) onOpenLogin();
                        else onStartTest(test.id, test.category);
                      }}
                      className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      {test.category === 'mock' ? 'Start Timed Mock' : 'Start Practice'}
                    </button>

                    {test.category === 'mock' && (
                      <button
                        onClick={() => {
                          if (!isLoggedIn) onOpenLogin();
                          else onStartTest(test.id, 'practice');
                        }}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                        title="Practice untimed without 60-minute countdown"
                      >
                        Untimed Practice
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
