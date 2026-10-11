import React, { useState, useEffect } from 'react';
import { ReadingTest, ListeningTest, WritingTask, WritingAttempt, WritingAllowanceBalance, QuestionGroupSummary } from '../types';
import { api } from '../api';
import { sortTestsChronological } from '../testOrder';
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Clock,
  Play,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Layers,
  Award,
  HelpCircle,
  ChevronDown,
  Target,
  X
} from 'lucide-react';

interface CatalogueViewProps {
  initialSkill?: 'reading' | 'listening' | 'writing' | 'speaking';
  initialCategoryFilter?: 'all' | 'mock' | 'practice';
  onStartTest: (testId: string, modeOverride?: 'practice' | 'mock', assignmentId?: string, packageAttemptId?: string, questionTypeFilter?: string) => void;
  onStartListeningTest: (testId: string, modeOverride?: 'practice' | 'mock', assignmentId?: string, packageAttemptId?: string, questionTypeFilter?: string) => void;
  onStartWriting?: (attemptId: string) => void;
  onStartSpeaking?: (setId?: string, mode?: 'practice' | 'mock') => void;
  onViewResults: (attemptId: string) => void;
  onViewListeningResults: (attemptId: string) => void;
  onViewWritingFeedback?: (attemptId: string) => void;
  onViewSpeakingAssessment?: (assessmentId: string) => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  initialSkill = 'reading',
  initialCategoryFilter = 'all',
  onStartTest,
  onStartListeningTest,
  onStartWriting,
  onStartSpeaking,
  onViewResults,
  onViewListeningResults,
  onViewWritingFeedback,
  onViewSpeakingAssessment,
  onOpenLogin,
  isLoggedIn,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<'reading' | 'listening' | 'writing' | 'speaking'>(initialSkill);
  const [readingTests, setReadingTests] = useState<ReadingTest[]>([]);
  const [readingAttempts, setReadingAttempts] = useState<any[]>([]);

  const [listeningTests, setListeningTests] = useState<ListeningTest[]>([]);
  const [listeningAttempts, setListeningAttempts] = useState<any[]>([]);

  const [writingTasks, setWritingTasks] = useState<WritingTask[]>([]);
  const [writingAttempts, setWritingAttempts] = useState<WritingAttempt[]>([]);
  const [allowanceBalance, setAllowanceBalance] = useState<WritingAllowanceBalance | null>(null);

  const [speakingSets, setSpeakingSets] = useState<any[]>([]);
  const [speakingAssessments, setSpeakingAssessments] = useState<any[]>([]);
  const [speakingAllowanceBalance, setSpeakingAllowanceBalance] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'academic' | 'general'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'mock' | 'practice'>('all');
  const [selectedQuestionTypeFilter, setSelectedQuestionTypeFilter] = useState<string>('all');

  // Skill drill selection modal state
  const [drillModalTest, setDrillModalTest] = useState<{
    test: ReadingTest | ListeningTest;
    skill: 'reading' | 'listening';
  } | null>(null);
  const [drillModalLoading, setDrillModalLoading] = useState(false);
  const [drillGroups, setDrillGroups] = useState<QuestionGroupSummary[]>([]);

  // Resume or start over modal state
  const [resumePromptModal, setResumePromptModal] = useState<{
    test: ReadingTest | ListeningTest;
    skill: 'reading' | 'listening';
    mode: 'practice' | 'mock';
    attemptId?: string;
  } | null>(null);

  // Helper to format question type keys into human-friendly names
  const formatQuestionTypeName = (type: string): string => {
    const map: Record<string, string> = {
      matching_headings: 'Matching Headings',
      true_false_not_given: 'True / False / Not Given',
      yes_no_not_given: 'Yes / No / Not Given',
      multiple_choice_single: 'Multiple Choice',
      multiple_choice_multi: 'Multiple Choice (Multi-select)',
      matching_information: 'Matching Information',
      matching_features: 'Matching Features',
      matching_sentence_endings: 'Matching Sentence Endings',
      sentence_completion: 'Sentence Completion',
      summary_completion_words: 'Summary Completion',
      summary_completion_options: 'Summary Completion (with Options)',
      note_completion: 'Note Completion',
      table_completion: 'Table Completion',
      flow_chart_completion: 'Flow-chart Completion',
      diagram_completion: 'Diagram Labelling',
      short_answer: 'Short Answer',
      listening_multiple_choice_single: 'Multiple Choice',
      listening_multiple_choice_multi: 'Multiple Choice (Multi-select)',
      matching: 'Matching',
      plan_map_diagram_labelling: 'Map / Diagram Labelling',
      form_completion: 'Form Completion',
      summary_completion: 'Summary Completion',
    };
    return map[type] || type.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Fallback effect: Ensure question breakdown loads reliably even if test was cached without summaries
  useEffect(() => {
    if (!drillModalTest) {
      setDrillGroups([]);
      setDrillModalLoading(false);
      return;
    }

    const initial = drillModalTest.test.questionGroupsSummary;
    if (initial && initial.length > 0) {
      setDrillGroups(initial);
      setDrillModalLoading(false);
      return;
    }

    let isMounted = true;
    setDrillModalLoading(true);

    const fetchDetails = async () => {
      try {
        if (drillModalTest.skill === 'reading') {
          const res = await api.getTest(drillModalTest.test.id);
          if (!isMounted) return;
          const groups: QuestionGroupSummary[] = (res.version?.questionGroups || []).map((g: any, idx: number) => ({
            id: g.id || `g-${idx}`,
            passageId: g.passageId,
            questionType: g.questionType,
            startQuestionNumber: g.startQuestionNumber,
            endQuestionNumber: g.endQuestionNumber,
            questionCount: (g.endQuestionNumber - g.startQuestionNumber + 1) || (g.questions?.length || 1),
          }));
          setDrillGroups(groups);
          setReadingTests((prev) =>
            prev.map((t) => (t.id === drillModalTest.test.id ? { ...t, questionGroupsSummary: groups } : t))
          );
        } else {
          const res = await api.getListeningTest(drillModalTest.test.id);
          if (!isMounted) return;
          const groups: QuestionGroupSummary[] = (res.version?.questionGroups || []).map((g: any, idx: number) => ({
            id: g.id || `g-${idx}`,
            partNumber: g.partNumber || 1,
            questionType: g.questionType,
            startQuestionNumber: g.startQuestionNumber,
            endQuestionNumber: g.endQuestionNumber,
            questionCount: (g.endQuestionNumber - g.startQuestionNumber + 1) || (g.questions?.length || 1),
          }));
          setDrillGroups(groups);
          setListeningTests((prev) =>
            prev.map((t) => (t.id === drillModalTest.test.id ? { ...t, questionGroupsSummary: groups } : t))
          );
        }
      } catch (err) {
        console.error('Failed to load drill modal question groups', err);
      } finally {
        if (isMounted) setDrillModalLoading(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [drillModalTest?.test.id, drillModalTest?.skill]);

  useEffect(() => {
    setSelectedSkill(initialSkill);
  }, [initialSkill]);

  useEffect(() => {
    setFilterCategory(initialCategoryFilter);
  }, [initialCategoryFilter]);

  useEffect(() => {
    loadData();
  }, [selectedSkill, filterType, filterCategory, isLoggedIn]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (selectedSkill === 'reading') {
        const params: any = {};
        if (filterType !== 'all') params.testType = filterType;

        const res = await api.getTests(params);
        setReadingTests(res.tests);

        if (isLoggedIn) {
          const attRes = await api.getAttempts();
          setReadingAttempts(attRes.attempts);
        }
      } else if (selectedSkill === 'listening') {
        const res = await api.getListeningTests({});
        setListeningTests(res.tests);

        if (isLoggedIn) {
          const attRes = await api.getListeningAttempts();
          setListeningAttempts(attRes.attempts);
        }
      } else if (selectedSkill === 'writing') {
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
      } else {
        const res = await api.getSpeakingSets({ status: 'published' });
        setSpeakingSets(res.sets);

        if (isLoggedIn) {
          const [assRes, balRes] = await Promise.all([
            api.getMySpeakingAssessments(),
            api.getSpeakingAllowanceBalance(),
          ]);
          setSpeakingAssessments(assRes.assessments);
          setSpeakingAllowanceBalance(balRes.balance?.available ?? 0);
        }
      }
    } catch (err) {
      console.error('Failed to load catalogue tests', err);
    } finally {
      setLoading(false);
    }
  };

  // Collect unique question types present in current skill tests
  const availableQuestionTypes = React.useMemo(() => {
    const typesSet = new Set<string>();
    const tests = selectedSkill === 'reading' ? readingTests : listeningTests;
    tests.forEach((t) => {
      t.questionGroupsSummary?.forEach((g) => {
        if (g.questionType) typesSet.add(g.questionType);
      });
    });
    return Array.from(typesSet);
  }, [selectedSkill, readingTests, listeningTests]);

  const filteredReadingTests = sortTestsChronological(
    readingTests.filter((t) => {
      if (filterType !== 'all' && t.testType !== filterType) return false;
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (
        selectedQuestionTypeFilter !== 'all' &&
        !t.questionGroupsSummary?.some((g) => g.questionType === selectedQuestionTypeFilter)
      ) {
        return false;
      }
      return true;
    })
  );

  const filteredListeningTests = sortTestsChronological(
    listeningTests.filter((t) => {
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (
        selectedQuestionTypeFilter !== 'all' &&
        !t.questionGroupsSummary?.some((g) => g.questionType === selectedQuestionTypeFilter)
      ) {
        return false;
      }
      return true;
    })
  );

  const filteredWritingTasks = writingTasks.filter((t) => {
    if (filterType !== 'all' && t.testType !== filterType) return false;
    if (
      searchQuery &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(t.prompt || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const filteredSpeakingSets = speakingSets.filter((s) => {
    if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-7 sm:py-9 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight capitalize">
            {selectedSkill}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedSkill === 'reading' && `${filteredReadingTests.length} activities available`}
            {selectedSkill === 'listening' && `${filteredListeningTests.length} activities available`}
            {selectedSkill === 'writing' && `${filteredWritingTasks.length} tasks available`}
            {selectedSkill === 'speaking' && `${filteredSpeakingSets.length} sets available`}
          </p>
        </div>
      </div>

      {/* 2. MINIMALIST SEARCH & SKILL FILTER TOOLBAR */}
      <div className="bg-white rounded-2xl border border-[#E7E3D9] p-2.5 sm:p-3 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Search Input & Question Type Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${selectedSkill} tests, Cambridge exams, topics...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-transparent border-0 focus:outline-none text-slate-800 font-normal placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Question Type Filter Dropdown (Reading & Listening) */}
          {(selectedSkill === 'reading' || selectedSkill === 'listening') && (
            <div className="relative shrink-0 flex items-center border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-2.5 pt-2 sm:pt-0">
              <div className="relative w-full sm:w-auto">
                <Target className="w-3.5 h-3.5 text-[#FC9F23] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedQuestionTypeFilter}
                  onChange={(e) => setSelectedQuestionTypeFilter(e.target.value)}
                  className="w-full sm:w-auto appearance-none pl-8.5 pr-8 py-1.5 text-xs font-semibold bg-[#F5F3EF] hover:bg-[#EAE6DF] text-slate-800 rounded-xl border border-[#E7E3D9] focus:outline-none focus:ring-1 focus:ring-[#084F7D] cursor-pointer transition-all"
                  title="Filter by question type"
                >
                  <option value="all">Question Type: All</option>
                  {availableQuestionTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatQuestionTypeName(type)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Academic / General Filter (for Reading & Writing) */}
        {selectedSkill !== 'listening' && selectedSkill !== 'speaking' && (
          <div className="flex items-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="flex bg-[#F5F3EF] p-1 rounded-xl text-xs font-semibold">
              {(['all', 'academic', 'general'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterType(m)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filterType === m
                      ? 'bg-white text-[#084F7D] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m === 'all' ? 'All Modules' : m === 'academic' ? 'Academic' : 'General'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. CLEAN CONTENT CARDS */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm font-medium">
          Loading IELTS practice materials...
        </div>
      ) : selectedSkill === 'reading' ? (
        /* READING TEST CARDS */
        filteredReadingTests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E7E3D9]">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No reading activities match your search</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the filters or searching with different terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReadingTests.map((test) => {
              const activeAttempt = readingAttempts.find(
                (a) => a.testId === test.id && a.status === 'in_progress'
              );
              const completedAttempt = readingAttempts.find(
                (a) => a.testId === test.id && (a.status === 'submitted' || a.status === 'expired')
              );
              const partsCount = test.passageCount || 3;
              const hasGroupSummary = test.questionGroupsSummary && test.questionGroupsSummary.length > 0;

              return (
                <div
                  key={test.id}
                  className="bg-white rounded-2xl border border-[#E5E1D7] p-5 shadow-2xs hover:shadow-sm hover:border-[#084F7D]/35 transition-all flex flex-col justify-between group"
                >
                  <div className="mb-4">
                    {/* Clean, readable Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#084F7D] transition-colors">
                      {test.title}
                    </h3>
                  </div>

                  {/* Clean Action Buttons */}
                  <div className="space-y-2">
                    {/* PRACTICE BUTTON */}
                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          onOpenLogin();
                          return;
                        }
                        if (activeAttempt) {
                          setResumePromptModal({
                            test,
                            skill: 'reading',
                            mode: 'practice',
                            attemptId: activeAttempt.id,
                          });
                          return;
                        }
                        onStartTest(
                          test.id,
                          'practice',
                          undefined,
                          undefined,
                          selectedQuestionTypeFilter !== 'all' ? selectedQuestionTypeFilter : undefined
                        );
                      }}
                      className="w-full py-2.5 px-3.5 bg-[#F6F4EE] hover:bg-[#EFECE3] text-slate-800 font-semibold rounded-xl text-xs tracking-wider uppercase transition-colors text-center border border-[#E5E1D7]"
                    >
                      Practice
                    </button>

                    {/* MOCK TEST BUTTON (Brand Navy) */}
                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          onOpenLogin();
                          return;
                        }
                        if (activeAttempt) {
                          setResumePromptModal({
                            test,
                            skill: 'reading',
                            mode: 'mock',
                            attemptId: activeAttempt.id,
                          });
                          return;
                        }
                        onStartTest(test.id, 'mock');
                      }}
                      className="w-full py-2.5 px-3.5 bg-[#084F7D] hover:bg-[#063D62] text-white font-semibold rounded-xl text-xs tracking-wider uppercase transition-colors text-center shadow-2xs"
                    >
                      Mock Test
                    </button>

                    {/* PRACTICE BY QUESTION TYPE BUTTON */}
                    <button
                      onClick={() => setDrillModalTest({ test, skill: 'reading' })}
                      className="w-full py-2.5 px-3 bg-[#F6F4EE] hover:bg-[#EFECE3] text-slate-800 font-semibold rounded-xl text-xs tracking-wider uppercase transition-colors text-center border border-[#E5E1D7]"
                    >
                      Practice by Question Type
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : selectedSkill === 'listening' ? (
        /* LISTENING TEST CARDS */
        filteredListeningTests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E7E3D9]">
            <Headphones className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No listening activities match your search</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the filters above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListeningTests.map((test) => {
              const activeAttempt = listeningAttempts.find(
                (a) => a.testId === test.id && a.status === 'in_progress'
              );
              const completedAttempt = listeningAttempts.find(
                (a) => a.testId === test.id && (a.status === 'submitted' || a.status === 'expired')
              );
              const partsCount = test.partCount || 4;

              return (
                <div
                  key={test.id}
                  className="bg-white rounded-2xl border border-[#E5E1D7] p-5 shadow-2xs hover:shadow-sm hover:border-[#084F7D]/35 transition-all flex flex-col justify-between group"
                >
                  <div className="mb-4">
                    {/* Clean, readable Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#084F7D] transition-colors">
                      {test.title}
                    </h3>
                  </div>

                  {/* Clean Action Buttons */}
                  <div className="space-y-2">
                    {/* PRACTICE BUTTON */}
                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          onOpenLogin();
                          return;
                        }
                        if (activeAttempt) {
                          setResumePromptModal({
                            test,
                            skill: 'listening',
                            mode: 'practice',
                            attemptId: activeAttempt.id,
                          });
                          return;
                        }
                        onStartListeningTest(
                          test.id,
                          'practice',
                          undefined,
                          undefined,
                          selectedQuestionTypeFilter !== 'all' ? selectedQuestionTypeFilter : undefined
                        );
                      }}
                      className="w-full py-2.5 px-3.5 bg-[#F6F4EE] hover:bg-[#EFECE3] text-slate-800 font-semibold rounded-xl text-xs tracking-wider uppercase transition-colors text-center border border-[#E5E1D7]"
                    >
                      Practice
                    </button>

                    {/* MOCK TEST BUTTON (Brand Navy) */}
                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          onOpenLogin();
                          return;
                        }
                        if (activeAttempt) {
                          setResumePromptModal({
                            test,
                            skill: 'listening',
                            mode: 'mock',
                            attemptId: activeAttempt.id,
                          });
                          return;
                        }
                        onStartListeningTest(test.id, 'mock');
                      }}
                      className="w-full py-2.5 px-3.5 bg-[#084F7D] hover:bg-[#063D62] text-white font-semibold rounded-xl text-xs tracking-wider uppercase transition-colors text-center shadow-2xs"
                    >
                      Mock Test
                    </button>

                    {/* PRACTICE BY QUESTION TYPE BUTTON */}
                    <button
                      onClick={() => setDrillModalTest({ test, skill: 'listening' })}
                      className="w-full py-2.5 px-3 bg-[#F6F4EE] hover:bg-[#EFECE3] text-slate-800 font-semibold rounded-xl text-xs tracking-wider uppercase transition-colors text-center border border-[#E5E1D7]"
                    >
                      Practice by Question Type
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : selectedSkill === 'writing' ? (
        /* WRITING TASKS CARDS */
        <div className="space-y-5">
          {isLoggedIn && allowanceBalance && (
            <div className="bg-[#073250] text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-[#0B446B] shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-[#084F7D] rounded-xl text-[#FC9F23]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                    Diagnostic AI Evaluations
                  </div>
                  <div className="text-base font-bold text-white">
                    {allowanceBalance.available} evaluations available
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWritingTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl border border-[#E7E3D9] p-5 sm:p-6 hover:border-[#084F7D]/50 hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5 text-xs">
                    <span className="font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-[#EBF4F9] text-[#084F7D]">
                      Task {task.taskNumber} • {task.testType === 'academic' ? 'Academic' : 'General'}
                    </span>
                    <span className="text-slate-400 font-normal text-xs">
                      {task.taskNumber === 1 ? '20m • 150w' : '40m • 250w'}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1.5 leading-snug line-clamp-2">
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 mb-3.5 leading-relaxed">
                    {task.prompt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2EFE8]">
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
                        if (onStartWriting) onStartWriting(res.attempt.id);
                      } catch (err: any) {
                        alert(err.message || 'Could not start writing session');
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-[#084F7D] hover:bg-[#063D62] text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Open Writing Workspace</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SPEAKING SETS CARDS */
        <div className="space-y-5">
          {isLoggedIn && (
            <div className="bg-[#073250] text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-[#0B446B] shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-[#084F7D] rounded-xl text-[#FC9F23]">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                    AI Speaking Simulations
                  </div>
                  <div className="text-base font-bold text-white">
                    {speakingAllowanceBalance ?? 0} speaking sessions available
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpeakingSets.map((set) => (
              <div
                key={set.id}
                className="bg-white rounded-2xl border border-[#E7E3D9] p-5 sm:p-6 hover:border-[#084F7D]/50 hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5 text-xs">
                    <span className="font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-[#FEF7EE] text-[#FC9F23]">
                      Parts 1, 2 & 3
                    </span>
                    <span className="text-slate-400 font-normal text-xs">11–14 mins</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1.5 leading-snug line-clamp-2">
                    {set.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 mb-3.5 leading-relaxed">
                    {set.part2CueCard?.topic || 'Standard 3-part interactive IELTS speaking interview'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2EFE8]">
                  <button
                    onClick={() => {
                      if (!isLoggedIn) onOpenLogin();
                      else if (onStartSpeaking) onStartSpeaking(set.id, 'mock');
                    }}
                    className="w-full py-2.5 px-4 bg-[#084F7D] hover:bg-[#063D62] text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Start Speaking Session</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SKILL / QUESTION TYPE PRACTICE MODAL */}
      {drillModalTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#FEF7EE] text-[#FC9F23] mb-1.5 inline-block">
                  {drillModalTest.skill === 'reading' ? 'Reading Practice' : 'Listening Practice'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {drillModalTest.test.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Practice the whole test or focus on one question type.
                </p>
              </div>
              <button
                onClick={() => setDrillModalTest(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content / Question Types List */}
            <div className="overflow-y-auto py-4 space-y-3 custom-scrollbar flex-1">
              {/* Full Test Practice Option */}
              <div
                onClick={() => {
                  const t = drillModalTest.test;
                  const s = drillModalTest.skill;
                  setDrillModalTest(null);
                  if (!isLoggedIn) {
                    onOpenLogin();
                    return;
                  }
                  if (s === 'reading') onStartTest(t.id, 'practice');
                  else onStartListeningTest(t.id, 'practice');
                }}
                className="p-3.5 rounded-2xl border-2 border-[#084F7D]/20 hover:border-[#084F7D] bg-[#F4F8FA] hover:bg-[#EBF4F9] cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#084F7D] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    ALL
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Full Practice Test
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Untimed · All {drillModalTest.test.totalQuestions} questions with instant answers
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#084F7D] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </div>

              {/* Specific Question Types Section */}
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
                  <span>Practice by Question Type</span>
                  <span>
                    {drillModalLoading
                      ? 'Loading...'
                      : `${drillGroups.length} available`}
                  </span>
                </div>

                {drillModalLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <div className="w-5 h-5 border-2 border-[#084F7D] border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs">Loading question types...</p>
                  </div>
                ) : drillGroups.length > 0 ? (
                  <div className="space-y-2">
                    {drillGroups.map((group, idx) => {
                      const typeName = formatQuestionTypeName(group.questionType);
                      const qSpan = `Questions ${group.startQuestionNumber}–${group.endQuestionNumber}`;

                      return (
                        <div
                          key={group.id || idx}
                          onClick={() => {
                            const t = drillModalTest.test;
                            const s = drillModalTest.skill;
                            setDrillModalTest(null);
                            if (!isLoggedIn) {
                              onOpenLogin();
                              return;
                            }
                            if (s === 'reading') {
                              onStartTest(t.id, 'practice', undefined, undefined, group.questionType);
                            } else {
                              onStartListeningTest(t.id, 'practice', undefined, undefined, group.questionType);
                            }
                          }}
                          className="p-3 rounded-xl border border-slate-200 hover:border-[#084F7D] hover:bg-[#FAF9F5] cursor-pointer transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="text-xs sm:text-[13px] font-semibold text-slate-900 group-hover:text-[#084F7D] transition-colors">
                                {typeName}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {qSpan} · {group.questionCount} {group.questionCount === 1 ? 'question' : 'questions'}
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-[#084F7D] bg-[#EBF4F9] px-2.5 py-1 rounded-lg group-hover:bg-[#084F7D] group-hover:text-white transition-colors">
                            Practice
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                    No question types available for this test.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Untimed · Instant answers
              </span>
              <button
                onClick={() => setDrillModalTest(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume or Start Over Modal */}
      {resumePromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-[#E5E1D7] max-w-md w-full p-6 shadow-xl space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FEF7EE] text-[#E88C15] border border-[#FC9F23]/25 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#E88C15]">
                    In-Progress Attempt Found
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {resumePromptModal.test.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setResumePromptModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Explainer Body */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#E5E1D7]">
              You already have an auto-saved session for this test. Would you like to resume where you left off, or reset and start a fresh attempt?
            </p>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              {/* Option 1: Continue / Resume (Brand Navy) */}
              <button
                onClick={() => {
                  const m = resumePromptModal;
                  setResumePromptModal(null);
                  if (m.skill === 'reading') {
                    onStartTest(m.test.id, m.mode);
                  } else {
                    onStartListeningTest(m.test.id, m.mode);
                  }
                }}
                className="w-full py-3 px-4 bg-[#084F7D] hover:bg-[#063D62] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-2xs"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Continue In-Progress Attempt</span>
              </button>

              {/* Option 2: Start Fresh / Start Over */}
              <button
                onClick={async () => {
                  const m = resumePromptModal;
                  setResumePromptModal(null);
                  try {
                    // If there was an existing active attempt, submit/clear it so student starts fresh
                    if (m.attemptId) {
                      if (m.skill === 'reading') {
                        await api.submitAttempt(m.attemptId).catch(() => {});
                      } else {
                        await api.submitListeningAttempt(m.attemptId).catch(() => {});
                      }
                    }
                    if (m.skill === 'reading') {
                      onStartTest(m.test.id, m.mode);
                    } else {
                      onStartListeningTest(m.test.id, m.mode);
                    }
                  } catch {
                    if (m.skill === 'reading') onStartTest(m.test.id, m.mode);
                    else onStartListeningTest(m.test.id, m.mode);
                  }
                }}
                className="w-full py-2.5 px-4 bg-[#F6F4EE] hover:bg-[#EFECE3] text-slate-800 font-semibold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-[#E5E1D7]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Start Fresh Attempt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
