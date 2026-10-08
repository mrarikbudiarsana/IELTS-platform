import React, { useState, useEffect } from 'react';
import { ReadingTest, ListeningTest, WritingTask, WritingAttempt, WritingAllowanceBalance } from '../types';
import { api } from '../api';
import { BookOpen, Headphones, Clock, Play, Award, Filter, Sparkles, CheckCircle2, PenTool } from 'lucide-react';

interface CatalogueViewProps {
  onStartTest: (testId: string, modeOverride?: 'practice' | 'mock') => void;
  onStartListeningTest: (testId: string, modeOverride?: 'practice' | 'mock') => void;
  onStartWriting?: (attemptId: string) => void;
  onViewResults: (attemptId: string) => void;
  onViewListeningResults: (attemptId: string) => void;
  onViewWritingFeedback?: (attemptId: string) => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  onStartTest,
  onStartListeningTest,
  onStartWriting,
  onViewResults,
  onViewListeningResults,
  onViewWritingFeedback,
  onOpenLogin,
  isLoggedIn,
}) => {
  // Skill selector: 'reading' | 'listening' | 'writing'
  const [selectedSkill, setSelectedSkill] = useState<'reading' | 'listening' | 'writing'>('reading');

  // Reading tests state
  const [readingTests, setReadingTests] = useState<ReadingTest[]>([]);
  const [readingAttempts, setReadingAttempts] = useState<any[]>([]);

  // Listening tests state
  const [listeningTests, setListeningTests] = useState<ListeningTest[]>([]);
  const [listeningAttempts, setListeningAttempts] = useState<any[]>([]);

  // Writing tasks state
  const [writingTasks, setWritingTasks] = useState<WritingTask[]>([]);
  const [writingAttempts, setWritingAttempts] = useState<WritingAttempt[]>([]);
  const [allowanceBalance, setAllowanceBalance] = useState<WritingAllowanceBalance | null>(null);

  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'academic' | 'general'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'mock' | 'practice'>('all');

  useEffect(() => {
    loadData();
  }, [selectedSkill, filterType, filterCategory, isLoggedIn]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (selectedSkill === 'reading') {
        const params: any = {};
        if (filterType !== 'all') params.testType = filterType;
        if (filterCategory !== 'all') params.category = filterCategory;

        const res = await api.getTests(params);
        setReadingTests(res.tests);

        if (isLoggedIn) {
          const attRes = await api.getAttempts();
          setReadingAttempts(attRes.attempts);
        }
      } else if (selectedSkill === 'listening') {
        const params: any = {};
        if (filterCategory !== 'all') params.category = filterCategory;

        const res = await api.getListeningTests(params);
        setListeningTests(res.tests);

        if (isLoggedIn) {
          const attRes = await api.getListeningAttempts();
          setListeningAttempts(attRes.attempts);
        }
      } else {
        const res = await api.getWritingTasks();
        setWritingTasks(res.tasks);

        if (isLoggedIn) {
          const [attRes, balRes] = await Promise.all([
            api.getWritingAttempts(),
            api.getWritingAllowanceBalance(),
          ]);
          setWritingAttempts(attRes.attempts);
          setAllowanceBalance(balRes.balance);
        }
      }
    } catch (err) {
      console.error('Failed to load catalogue tests', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReadingTests = readingTests.filter((t) => {
    if (filterType !== 'all' && t.testType !== filterType) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  const filteredListeningTests = listeningTests.filter((t) => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  const filteredWritingTasks = writingTasks.filter((t) => {
    if (filterType !== 'all' && t.testType !== filterType) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Skill Tabs Switcher */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setSelectedSkill('reading')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-2xs ${
            selectedSkill === 'reading'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>IELTS Reading (Milestone 1)</span>
        </button>

        <button
          onClick={() => setSelectedSkill('listening')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-2xs ${
            selectedSkill === 'listening'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>IELTS Listening (Milestone 2)</span>
        </button>

        <button
          onClick={() => setSelectedSkill('writing')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-2xs ${
            selectedSkill === 'writing'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>IELTS Writing (Milestone 5)</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-10 border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Authentic Computer-Delivered IELTS Interface
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            {selectedSkill === 'reading'
              ? 'IELTS Reading Practice & Full Mocks'
              : selectedSkill === 'listening'
              ? 'IELTS Listening Practice & Full 4-Part Mocks'
              : 'IELTS Writing Tasks & AI Diagnostics'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {selectedSkill === 'reading'
              ? 'Master all 16 official question formats with side-by-side passage navigation, real-time autosave, text highlighting, and strict non-fuzzy automated marking calibrated to official IELTS band thresholds.'
              : selectedSkill === 'listening'
              ? 'Complete IELTS Listening support: 4-part 40-question mocks and targeted practice sets. Features exam-controlled audio playback, authentic synthesized recordings, 11 question layouts including maps and flow charts, audio recovery tracking, and official band scales.'
              : 'Authentic split-screen writing workspace for Academic & General Training Task 1 and Task 2 essays. Features live IELTS word counting, autosave, full 60-minute mock exam timing, and real AI assessment with multi-criterion band scores (TA/TR, CC, LR, GRA) grounded in teacher-verified visuals.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-slate-300">
            {selectedSkill === 'reading' ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Academic & General Training
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  All 16 Reading Formats Supported
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Official Reading Band Conversions
                </div>
              </>
            ) : selectedSkill === 'listening' ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Shared Academic & General Training Audio
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  All 11 Listening Formats Supported
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Official 40-Question Listening Bands
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Academic & General Training Task 1 & 2
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Teacher Visual Grounding (Zero Hallucinations)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  Calibrated AI Criterion Breakdown
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {selectedSkill !== 'listening' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1">
              Module:
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
        )}

        {selectedSkill === 'listening' && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Headphones className="w-4 h-4 text-indigo-600" />
            <span>Listening is shared between Academic and General Training</span>
          </div>
        )}

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
      ) : selectedSkill === 'reading' ? (
        /* READING TESTS LIST */
        filteredReadingTests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No reading tests match current filters</h3>
            <p className="text-sm text-slate-500 mt-1">Try switching filter selections above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReadingTests.map((test) => {
              const pastAttempt = readingAttempts.find(
                (a) => a.testId === test.id && (a.status === 'submitted' || a.status === 'expired')
              );

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
                  </div>

                  {/* Actions & Past Attempt Info */}
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
        )
      ) : selectedSkill === 'listening' ? (
        /* LISTENING TESTS LIST */
        filteredListeningTests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Headphones className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No listening tests match current filters</h3>
            <p className="text-sm text-slate-500 mt-1">Try switching filter selections above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredListeningTests.map((test) => {
              const pastAttempt = listeningAttempts.find(
                (a) => a.testId === test.id && (a.status === 'submitted' || a.status === 'expired')
              );

              return (
                <div
                  key={test.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide bg-indigo-100 text-indigo-800">
                          Listening (Shared Module)
                        </span>

                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            test.category === 'mock'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {test.category === 'mock' ? 'Full 4-Part Mock (40 Qs)' : 'Targeted Practice'}
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
                        <Headphones className="w-4 h-4 text-slate-400" />
                        <span>{test.totalQuestions} Questions</span>
                      </div>
                    </div>

                    {/* Format coverage description */}
                    <div className="text-xs text-slate-500 mb-4">
                      <div className="font-semibold text-slate-600 mb-1.5">Includes formats:</div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Form Completion</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Map Labelling</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Table & Flow-chart</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Multiple Choice</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">Notes & Summary</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Past Attempt Info */}
                  <div className="pt-4 border-t border-slate-100 mt-2">
                    {pastAttempt && (
                      <div className="mb-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-500 font-medium">Previous Score: </span>
                          <span className="font-bold text-slate-800">
                            {pastAttempt.rawScore} / {pastAttempt.totalQuestions}
                          </span>
                          {pastAttempt.estimatedBandScore && (
                            <span className="ml-2 font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                              Band {pastAttempt.estimatedBandScore.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => onViewListeningResults(pastAttempt.id)}
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
                          else onStartListeningTest(test.id, test.category);
                        }}
                        className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        {test.category === 'mock' ? 'Start Timed Listening Mock' : 'Start Practice'}
                      </button>

                      {test.category === 'mock' && (
                        <button
                          onClick={() => {
                            if (!isLoggedIn) onOpenLogin();
                            else onStartListeningTest(test.id, 'practice');
                          }}
                          className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                          title="Practice with audio pause and seeking enabled"
                        >
                          Practice Mode
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* WRITING TASKS & MOCKS LIST */
        <div className="space-y-6">
          {isLoggedIn && allowanceBalance && (
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-700/50 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30 text-blue-300">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider text-blue-300">
                    AI Writing Assessment Allowance
                  </div>
                  <div className="text-xl font-extrabold text-white">
                    {allowanceBalance.available} Evaluations Available
                  </div>
                  <div className="text-xs text-blue-200 mt-0.5">
                    1 allowance = 1 task comprehensively evaluated with 4 official IELTS criteria & actionable feedback
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-blue-200 bg-black/20 px-3 py-2 rounded-lg border border-white/10">
                <span>Consumed: {allowanceBalance.totalConsumed}</span>
                <span>•</span>
                <span>Total Granted: {allowanceBalance.totalGranted}</span>
              </div>
            </div>
          )}

          {/* Full Mock Banner */}
          {writingTasks.some((t) => t.taskNumber === 1) && writingTasks.some((t) => t.taskNumber === 2) && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-600 text-white">
                    Complete Exam Simulation
                  </span>
                  <span className="text-xs font-bold text-slate-500">Task 1 + Task 2</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Full 60-Minute IELTS Writing Mock
                </h3>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Authentic exam conditions with single shared 60-minute server timer. Task 2 carries double the weight of Task 1 in the final IELTS Writing overall band score calculation.
                </p>
              </div>
              <button
                onClick={async () => {
                  if (!isLoggedIn) {
                    onOpenLogin();
                    return;
                  }
                  try {
                    const t1 = writingTasks.find(
                      (t) => t.taskNumber === 1 && (filterType === 'all' || t.testType === filterType || filterType === 'academic')
                    );
                    const t2 = writingTasks.find((t) => t.taskNumber === 2);
                    if (!t1 || !t2) return;
                    const res = await api.startWritingAttempt({
                      task1Id: t1.id,
                      task2Id: t2.id,
                      mode: 'mock',
                      durationMinutes: 60,
                    });
                    onStartWriting?.(res.attempt.id);
                  } catch (err: any) {
                    alert(err.message);
                  }
                }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                Start Full 60-Min Mock
              </button>
            </div>
          )}

          {/* Writing Tasks Grid */}
          {filteredWritingTasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <PenTool className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No writing tasks match current filters</h3>
              <p className="text-sm text-slate-500 mt-1">Try switching filter selections above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredWritingTasks.map((task) => {
                const pastAttempt = writingAttempts.find(
                  (a) => a.task1Id === task.id || a.task2Id === task.id
                );
                const isSubmitted = pastAttempt?.status === 'submitted';
                const isInProgress = pastAttempt?.status === 'in_progress';

                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${
                              task.taskNumber === 1
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            Task {task.taskNumber} ({task.testType === 'academic' ? 'Academic' : 'General Training'})
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                            {task.subtype ? task.subtype.replace('_', ' ') : 'Task'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          v{task.currentVersionNumber}.0
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                        {task.prompt}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{task.suggestedTimeMinutes} mins</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PenTool className="w-3.5 h-3.5 text-slate-400" />
                          <span>Min {task.minWords} words</span>
                        </div>
                        {task.hasTeacherVisual && (
                          <div className="flex items-center gap-1 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Visual Grounded</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      {pastAttempt && isSubmitted && (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs">
                          <span className="font-semibold text-emerald-900">
                            Assessed {pastAttempt.overallWritingBand !== undefined ? `• Band ${pastAttempt.overallWritingBand.toFixed(1)}` : (task.taskNumber === 1 && pastAttempt.task1Band !== undefined ? `• Band ${pastAttempt.task1Band.toFixed(1)}` : (task.taskNumber === 2 && pastAttempt.task2Band !== undefined ? `• Band ${pastAttempt.task2Band.toFixed(1)}` : ''))}
                          </span>
                          <button
                            onClick={() => onViewWritingFeedback?.(pastAttempt.id)}
                            className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                          >
                            View AI Feedback
                          </button>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {isInProgress ? (
                          <button
                            onClick={() => onStartWriting?.(pastAttempt!.id)}
                            className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            Continue Draft
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={async () => {
                                if (!isLoggedIn) {
                                  onOpenLogin();
                                  return;
                                }
                                try {
                                  const res = await api.startWritingAttempt({
                                    task1Id: task.taskNumber === 1 ? task.id : undefined,
                                    task2Id: task.taskNumber === 2 ? task.id : undefined,
                                    mode: 'mock',
                                    durationMinutes: task.suggestedTimeMinutes,
                                  });
                                  onStartWriting?.(res.attempt.id);
                                } catch (err: any) {
                                  alert(err.message);
                                }
                              }}
                              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Play className="w-4 h-4 fill-white" />
                              Timed ({task.suggestedTimeMinutes}m)
                            </button>
                            <button
                              onClick={async () => {
                                if (!isLoggedIn) {
                                  onOpenLogin();
                                  return;
                                }
                                try {
                                  const res = await api.startWritingAttempt({
                                    task1Id: task.taskNumber === 1 ? task.id : undefined,
                                    task2Id: task.taskNumber === 2 ? task.id : undefined,
                                    mode: 'practice',
                                  });
                                  onStartWriting?.(res.attempt.id);
                                } catch (err: any) {
                                  alert(err.message);
                                }
                              }}
                              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                              Untimed
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
