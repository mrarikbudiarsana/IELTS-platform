import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../api';
import { ReadingTest, ListeningTest, WritingTask } from '../types';
import { calculateIeltsFourSkillOverallBand } from '../../../shared/scoring';
import {
  Clock,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Award,
  CheckCircle2,
  Play,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

interface FullMockViewProps {
  onStartReading: (testId: string, mode: 'practice' | 'mock', assignmentId?: string, packageAttemptId?: string) => void;
  onStartListening: (testId: string, mode: 'practice' | 'mock', assignmentId?: string, packageAttemptId?: string) => void;
  onStartWriting?: (attemptId: string) => void;
  onStartSpeaking?: (setId?: string, assignmentId?: string, packageAttemptId?: string, mode?: 'practice' | 'mock') => void;
  onViewReadingResults: (attemptId: string) => void;
  onViewListeningResults: (attemptId: string) => void;
  onViewWritingFeedback?: (attemptId: string) => void;
  onViewSpeakingAssessment?: (assessmentId: string) => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
}

interface FullMockExamPackage {
  id: string;
  title: string;
  module: 'academic' | 'general';
  description: string;
  seriesNumber?: number;
  testNumber?: number;
  listeningTest?: ListeningTest;
  readingTest?: ReadingTest;
  writingTask1?: WritingTask;
  writingTask2?: WritingTask;
  speakingSet?: any;
}

export const FullMockView: React.FC<FullMockViewProps> = ({
  onStartReading,
  onStartListening,
  onStartWriting,
  onStartSpeaking,
  onViewReadingResults,
  onViewListeningResults,
  onViewWritingFeedback,
  onViewSpeakingAssessment,
  onOpenLogin,
  isLoggedIn,
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<'academic' | 'general'>('academic');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'unattempted'>('all');

  // Expanded card tracking: set of package IDs
  const [expandedPackageIds, setExpandedPackageIds] = useState<Set<string>>(new Set());

  // Tests & Materials
  const [readingTests, setReadingTests] = useState<ReadingTest[]>([]);
  const [listeningTests, setListeningTests] = useState<ListeningTest[]>([]);
  const [writingTasks, setWritingTasks] = useState<WritingTask[]>([]);
  const [speakingSets, setSpeakingSets] = useState<any[]>([]);

  // Student Attempts
  const [readingAttempts, setReadingAttempts] = useState<any[]>([]);
  const [listeningAttempts, setListeningAttempts] = useState<any[]>([]);
  const [writingAttempts, setWritingAttempts] = useState<any[]>([]);
  const [speakingAssessments, setSpeakingAssessments] = useState<any[]>([]);

  useEffect(() => {
    loadAllData();
  }, [isLoggedIn]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [rRes, lRes, wRes, sRes] = await Promise.all([
        api.getTests({}),
        api.getListeningTests({}),
        api.getWritingTasks({}),
        api.getSpeakingSets({ status: 'published' }).catch(() => ({ sets: [] })),
      ]);

      setReadingTests(rRes.tests || []);
      setListeningTests(lRes.tests || []);
      setWritingTasks(wRes.tasks || []);
      setSpeakingSets(sRes.sets || []);

      if (isLoggedIn) {
        const [rAtt, lAtt, wAtt, sAtt] = await Promise.all([
          api.getAttempts().catch(() => ({ attempts: [] })),
          api.getListeningAttempts().catch(() => ({ attempts: [] })),
          api.getWritingAttempts().catch(() => ({ attempts: [] })),
          api.getMySpeakingAssessments().catch(() => ({ assessments: [] })),
        ]);

        setReadingAttempts(rAtt.attempts || []);
        setListeningAttempts(lAtt.attempts || []);
        setWritingAttempts(wAtt.attempts || []);
        setSpeakingAssessments(sAtt.assessments || []);
      }
    } catch (err) {
      console.error('Failed to load full mock materials', err);
    } finally {
      setLoading(false);
    }
  };

  // Build complete 4-skill packages dynamically to scale gracefully for 20+ tests
  const packages: FullMockExamPackage[] = useMemo(() => {
    const list: FullMockExamPackage[] = [];

    // Helper to find materials
    const fullListeningTests = listeningTests.filter((t) => t.totalQuestions === 40 || !t.totalQuestions);
    const academicTask1s = writingTasks.filter((t) => t.taskType === 'academic_task_1');
    const academicTask2s = writingTasks.filter((t) => t.taskType === 'task_2' && t.testType !== 'general');
    const gtTask1s = writingTasks.filter((t) => t.taskType === 'gt_task_1');
    const gtTask2s = writingTasks.filter((t) => t.taskType === 'task_2' && (t.testType === 'general' || t.testType === 'both'));

    // Academic Tests mapping
    const academicReadingTests = readingTests.filter((t) => t.testType !== 'general');
    academicReadingTests.forEach((rTest, idx) => {
      const lTest = fullListeningTests[idx % (fullListeningTests.length || 1)] || listeningTests[0];
      const w1 = academicTask1s[idx % (academicTask1s.length || 1)] || writingTasks[0];
      const w2 = academicTask2s[idx % (academicTask2s.length || 1)] || writingTasks[1];
      const sSet = speakingSets[idx % (speakingSets.length || 1)] || speakingSets[0];

      // Extract book/test numbers if present (e.g. Cambridge 21 Test 4)
      const bookMatch = rTest.title.match(/(\d+)/);
      const seriesNum = bookMatch ? parseInt(bookMatch[1], 10) : undefined;

      list.push({
        id: `mock-academic-${rTest.id}`,
        title: rTest.title.includes('Full Mock')
          ? rTest.title
          : `${rTest.title} Full Mock Exam`,
        module: 'academic',
        description: 'Complete official 4-skill simulation: Listening, Reading, Writing & AI Speaking with authentic exam conditions.',
        seriesNumber: seriesNum,
        testNumber: idx + 1,
        listeningTest: lTest,
        readingTest: rTest,
        writingTask1: w1,
        writingTask2: w2,
        speakingSet: sSet,
      });
    });

    // General Training Tests mapping
    const gtReadingTests = readingTests.filter((t) => t.testType === 'general');
    gtReadingTests.forEach((rTest, idx) => {
      const lTest = fullListeningTests[idx % (fullListeningTests.length || 1)] || listeningTests[0];
      const w1 = gtTask1s[idx % (gtTask1s.length || 1)] || writingTasks[0];
      const w2 = gtTask2s[idx % (gtTask2s.length || 1)] || writingTasks[1];
      const sSet = speakingSets[(idx + 2) % (speakingSets.length || 1)] || speakingSets[0];

      list.push({
        id: `mock-general-${rTest.id}`,
        title: rTest.title.includes('Full Mock')
          ? rTest.title
          : `${rTest.title} Full Mock Exam`,
        module: 'general',
        description: 'Complete 4-skill General Training examination simulation covering daily workplace and social English contexts.',
        testNumber: idx + 1,
        listeningTest: lTest,
        readingTest: rTest,
        writingTask1: w1,
        writingTask2: w2,
        speakingSet: sSet,
      });
    });

    return list;
  }, [readingTests, listeningTests, writingTasks, speakingSets]);

  // Helper to get skill status and overall band for a package
  const getPackageSkillStatus = (pkg: FullMockExamPackage) => {
    // 1. Listening
    const lAttempt = pkg.listeningTest
      ? listeningAttempts.find((a) => a.testId === pkg.listeningTest?.id)
      : undefined;
    const lCompleted = Boolean(lAttempt && (lAttempt.status === 'submitted' || lAttempt.status === 'expired'));
    const lInProgress = Boolean(lAttempt && lAttempt.status === 'in_progress');
    const lBand = lCompleted ? (lAttempt?.estimatedBandScore || 6.0) : undefined;

    // 2. Reading
    const rAttempt = pkg.readingTest
      ? readingAttempts.find((a) => a.testId === pkg.readingTest?.id)
      : undefined;
    const rCompleted = Boolean(rAttempt && (rAttempt.status === 'submitted' || rAttempt.status === 'expired'));
    const rInProgress = Boolean(rAttempt && rAttempt.status === 'in_progress');
    const rBand = rCompleted ? (rAttempt?.bandScore || 6.0) : undefined;

    // 3. Writing
    const wAttempt = writingAttempts.find(
      (a) =>
        (pkg.writingTask1 && a.task1Id === pkg.writingTask1.id) ||
        (pkg.writingTask2 && a.task2Id === pkg.writingTask2.id)
    ) || writingAttempts[0];
    const wCompleted = Boolean(wAttempt && (wAttempt.status === 'submitted' || wAttempt.status === 'evaluated'));
    const wInProgress = Boolean(wAttempt && wAttempt.status === 'in_progress');
    const wBand = wCompleted ? (wAttempt?.overallWritingBand || 6.5) : undefined;

    // 4. Speaking
    const sAssessment = speakingAssessments.find((a) => a.speakingSetId === pkg.speakingSet?.id) || speakingAssessments[0];
    const sCompleted = Boolean(sAssessment);
    const sBand = sCompleted ? (sAssessment?.overallBand || 7.0) : undefined;

    const completedCount = (lCompleted ? 1 : 0) + (rCompleted ? 1 : 0) + (wCompleted ? 1 : 0) + (sCompleted ? 1 : 0);
    const inProgressCount = (lInProgress ? 1 : 0) + (rInProgress ? 1 : 0) + (wInProgress ? 1 : 0);
    const overallBand = calculateIeltsFourSkillOverallBand(lBand, rBand, wBand, sBand);

    return {
      listening: { attempt: lAttempt, isCompleted: lCompleted, isInProgress: lInProgress, band: lBand },
      reading: { attempt: rAttempt, isCompleted: rCompleted, isInProgress: rInProgress, band: rBand },
      writing: { attempt: wAttempt, isCompleted: wCompleted, isInProgress: wInProgress, band: wBand },
      speaking: { assessment: sAssessment, isCompleted: sCompleted, band: sBand },
      completedCount,
      inProgressCount,
      overallBand,
    };
  };

  // Filter packages based on active module, search query, and attempt status
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      if (pkg.module !== selectedModule) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = pkg.title.toLowerCase().includes(q);
        const matchesDesc = pkg.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }

      if (statusFilter !== 'all') {
        const s = getPackageSkillStatus(pkg);
        if (statusFilter === 'completed' && s.completedCount !== 4) return false;
        if (statusFilter === 'in_progress' && (s.completedCount === 0 || s.completedCount === 4) && s.inProgressCount === 0) return false;
        if (statusFilter === 'unattempted' && (s.completedCount > 0 || s.inProgressCount > 0)) return false;
      }

      return true;
    });
  }, [packages, selectedModule, searchQuery, statusFilter, readingAttempts, listeningAttempts, writingAttempts, speakingAssessments]);

  // Toggle individual row expansion
  const togglePackageExpand = (id: string) => {
    setExpandedPackageIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedPackageIds(new Set(filteredPackages.map((p) => p.id)));
  };

  const collapseAll = () => {
    setExpandedPackageIds(new Set());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-7 sm:py-9 space-y-6">
      {/* 1. Header & Module Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E7E3D9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#FEF7EE] text-[#E88C15] border border-[#FC9F23]/25">
              4-Skill Official Simulation
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {filteredPackages.length} full tests available
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            IELTS Full Mock Examinations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Take complete 4-skill mock tests in official computer-delivered IELTS sequence:
            Listening (30m), Reading (60m), Writing (60m), and Speaking (14m) with official overall band calculation.
          </p>
        </div>

        {/* Module Switcher */}
        <div className="flex bg-[#F6F4EE] p-1 rounded-xl text-xs font-semibold shrink-0 border border-[#E5E1D7] self-start sm:self-auto">
          <button
            onClick={() => setSelectedModule('academic')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedModule === 'academic'
                ? 'bg-[#084F7D] text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Academic Module
          </button>
          <button
            onClick={() => setSelectedModule('general')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedModule === 'general'
                ? 'bg-[#084F7D] text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            General Training
          </button>
        </div>
      </div>

      {/* 2. Official Sequence Explainer Banner */}
      <div className="bg-[#073250] rounded-2xl p-4.5 sm:p-5 text-white border border-[#0B446B] shadow-2xs">
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FC9F23]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Official Test Day Order & Timing (Total: ~2 Hours 45 Mins)
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-300 hidden sm:inline">
            Official Scoring Standards Applied
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#FC9F23] uppercase">Part 1</span>
              <Headphones className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Listening</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">30m · 40 Qs</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#FC9F23] uppercase">Part 2</span>
              <BookOpen className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Reading</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">60m · 40 Qs</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#FC9F23] uppercase">Part 3</span>
              <PenTool className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Writing</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">60m · Task 1 & 2</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#FC9F23] uppercase">Part 4</span>
              <Mic className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Speaking</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">11-14m · AI Examiner</p>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E5E1D7] shadow-2xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search full mock tests (e.g. Cambridge 21, Academic Test 1)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF9F5] border border-[#E5E1D7] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#084F7D] focus:border-[#084F7D]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-[#F6F4EE] p-1 rounded-xl text-xs font-semibold border border-[#E5E1D7]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'in_progress'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'completed'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Quick Collapse / Expand All toggle */}
          <button
            onClick={() => {
              if (expandedPackageIds.size > 0) collapseAll();
              else expandAll();
            }}
            className="px-3 py-2 bg-[#FAF9F5] hover:bg-slate-100 text-slate-600 border border-[#E5E1D7] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Expand or collapse all skill breakdowns"
          >
            {expandedPackageIds.size > 0 ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Collapse All</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Expand All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. Full Mock Tests List (Compact Rows with collapsible skill cards) */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm font-medium">
          Loading 4-skill full mock examinations...
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-[#E7E3D9]">
          <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No mock tests found</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing your search or filter.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredPackages.map((pkg) => {
            const status = getPackageSkillStatus(pkg);
            const isExpanded = expandedPackageIds.has(pkg.id);

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-[#E5E1D7] shadow-2xs hover:border-[#084F7D]/35 transition-all overflow-hidden"
              >
                {/* Compact Row Header */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Test Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {pkg.module === 'academic' ? 'Academic' : 'General Training'} · Complete 4-Skill
                      </span>
                      {status.completedCount === 4 && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Complete
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {pkg.description}
                    </p>
                  </div>

                  {/* 4 Skills Quick Status Pills */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Listening pill */}
                    <div
                      className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border ${
                        status.listening.isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : status.listening.isInProgress
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-[#FAF9F5] text-slate-600 border-[#E5E1D7]'
                      }`}
                      title="Listening"
                    >
                      <Headphones className="w-3 h-3" />
                      <span className="hidden sm:inline">L:</span>
                      <span>{status.listening.isCompleted ? `B ${status.listening.band?.toFixed(1)}` : '30m'}</span>
                    </div>

                    {/* Reading pill */}
                    <div
                      className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border ${
                        status.reading.isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : status.reading.isInProgress
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-[#FAF9F5] text-slate-600 border-[#E5E1D7]'
                      }`}
                      title="Reading"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span className="hidden sm:inline">R:</span>
                      <span>{status.reading.isCompleted ? `B ${status.reading.band?.toFixed(1)}` : '60m'}</span>
                    </div>

                    {/* Writing pill */}
                    <div
                      className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border ${
                        status.writing.isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : status.writing.isInProgress
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-[#FAF9F5] text-slate-600 border-[#E5E1D7]'
                      }`}
                      title="Writing"
                    >
                      <PenTool className="w-3 h-3" />
                      <span className="hidden sm:inline">W:</span>
                      <span>{status.writing.isCompleted ? `B ${status.writing.band?.toFixed(1)}` : '60m'}</span>
                    </div>

                    {/* Speaking pill */}
                    <div
                      className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border ${
                        status.speaking.isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-[#FAF9F5] text-slate-600 border-[#E5E1D7]'
                      }`}
                      title="Speaking"
                    >
                      <Mic className="w-3 h-3" />
                      <span className="hidden sm:inline">S:</span>
                      <span>{status.speaking.isCompleted ? `B ${status.speaking.band?.toFixed(1)}` : '14m'}</span>
                    </div>
                  </div>

                  {/* Actions & Overall Score */}
                  <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* Overall Score Badge */}
                    <div className="text-right shrink-0">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Overall Band
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        {status.overallBand !== undefined ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Band {status.overallBand.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">
                            {status.completedCount}/4 done
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Primary Action Button (Brand Navy) */}
                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          onOpenLogin();
                          return;
                        }
                        // Launch first uncompleted section
                        if (!status.listening.isCompleted && pkg.listeningTest) {
                          onStartListening(pkg.listeningTest.id, 'mock');
                        } else if (!status.reading.isCompleted && pkg.readingTest) {
                          onStartReading(pkg.readingTest.id, 'mock');
                        } else if (!status.writing.isCompleted && pkg.writingTask1) {
                          api.startWritingAttempt({
                            mode: 'mock',
                            task1Id: pkg.writingTask1?.id,
                            task2Id: pkg.writingTask2?.id,
                            durationMinutes: 60,
                          }).then((wRes) => onStartWriting?.(wRes.attempt.id));
                        } else if (!status.speaking.isCompleted && pkg.speakingSet) {
                          onStartSpeaking?.(pkg.speakingSet?.id, undefined, undefined, 'mock');
                        } else if (pkg.listeningTest) {
                          onStartListening(pkg.listeningTest.id, 'mock');
                        }
                      }}
                      className="px-4 py-2 bg-[#084F7D] hover:bg-[#063D62] text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>
                        {status.completedCount === 0
                          ? 'Start Exam'
                          : status.completedCount === 4
                          ? 'Retake Exam'
                          : 'Continue Exam'}
                      </span>
                    </button>

                    {/* Expand/Collapse Dropdown Trigger */}
                    <button
                      onClick={() => togglePackageExpand(pkg.id)}
                      className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                      title={isExpanded ? 'Hide individual skill cards' : 'View individual skill cards'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Section: Individual 4-Skill Cards */}
                {isExpanded && (
                  <div className="bg-[#FAF9F5] p-5 border-t border-[#E5E1D7] space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                      <span className="font-semibold text-slate-700">
                        Skill Breakdown & Individual Launchers
                      </span>
                      <span>Official computer-delivered IELTS order (Listening ➔ Reading ➔ Writing ➔ Speaking)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {/* 1. Listening */}
                      <div className="bg-white rounded-xl p-4 border border-[#E5E1D7] flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Headphones className="w-3.5 h-3.5 text-[#084F7D]" />
                              1. Listening
                            </span>
                            <span className="text-[10px] text-slate-400">30m · 40 Qs</span>
                          </div>
                          <h4 className="text-xs font-semibold text-slate-800 line-clamp-2">
                            {pkg.listeningTest?.title || 'IELTS Listening Full Mock'}
                          </h4>
                        </div>
                        <div>
                          {status.listening.isCompleted ? (
                            <button
                              onClick={() => {
                                if (status.listening.attempt) {
                                  onViewListeningResults(status.listening.attempt.id);
                                }
                              }}
                              className="w-full py-1.5 px-3 bg-white hover:bg-slate-50 text-[#084F7D] font-semibold rounded-lg text-xs border border-[#E5E1D7]"
                            >
                              Review Results (Band {status.listening.band?.toFixed(1)})
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (!isLoggedIn) onOpenLogin();
                                else if (pkg.listeningTest) onStartListening(pkg.listeningTest.id, 'mock');
                              }}
                              className="w-full py-1.5 px-3 bg-[#084F7D] hover:bg-[#063D62] text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              <span>Start Listening</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 2. Reading */}
                      <div className="bg-white rounded-xl p-4 border border-[#E5E1D7] flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-[#084F7D]" />
                              2. Reading
                            </span>
                            <span className="text-[10px] text-slate-400">60m · 40 Qs</span>
                          </div>
                          <h4 className="text-xs font-semibold text-slate-800 line-clamp-2">
                            {pkg.readingTest?.title || 'IELTS Reading Full Mock'}
                          </h4>
                        </div>
                        <div>
                          {status.reading.isCompleted ? (
                            <button
                              onClick={() => {
                                if (status.reading.attempt) {
                                  onViewReadingResults(status.reading.attempt.id);
                                }
                              }}
                              className="w-full py-1.5 px-3 bg-white hover:bg-slate-50 text-[#084F7D] font-semibold rounded-lg text-xs border border-[#E5E1D7]"
                            >
                              Review Results (Band {status.reading.band?.toFixed(1)})
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (!isLoggedIn) onOpenLogin();
                                else if (pkg.readingTest) onStartReading(pkg.readingTest.id, 'mock');
                              }}
                              className="w-full py-1.5 px-3 bg-[#084F7D] hover:bg-[#063D62] text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              <span>Start Reading</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 3. Writing */}
                      <div className="bg-white rounded-xl p-4 border border-[#E5E1D7] flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <PenTool className="w-3.5 h-3.5 text-[#084F7D]" />
                              3. Writing
                            </span>
                            <span className="text-[10px] text-slate-400">60m · Task 1 & 2</span>
                          </div>
                          <h4 className="text-xs font-semibold text-slate-800 line-clamp-2">
                            {pkg.writingTask1?.title ? `${pkg.writingTask1.title} & Task 2` : 'IELTS Writing Full Mock'}
                          </h4>
                        </div>
                        <div>
                          {status.writing.isCompleted ? (
                            <button
                              onClick={() => {
                                if (status.writing.attempt && onViewWritingFeedback) {
                                  onViewWritingFeedback(status.writing.attempt.id);
                                }
                              }}
                              className="w-full py-1.5 px-3 bg-white hover:bg-slate-50 text-[#084F7D] font-semibold rounded-lg text-xs border border-[#E5E1D7]"
                            >
                              Review Feedback (Band {status.writing.band?.toFixed(1)})
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (!isLoggedIn) onOpenLogin();
                                else if (pkg.writingTask1 && onStartWriting) {
                                  api.startWritingAttempt({
                                    mode: 'mock',
                                    task1Id: pkg.writingTask1.id,
                                    task2Id: pkg.writingTask2?.id,
                                    durationMinutes: 60,
                                  }).then((wRes) => onStartWriting(wRes.attempt.id));
                                }
                              }}
                              className="w-full py-1.5 px-3 bg-[#084F7D] hover:bg-[#063D62] text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              <span>Start Writing</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 4. Speaking */}
                      <div className="bg-white rounded-xl p-4 border border-[#E5E1D7] flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Mic className="w-3.5 h-3.5 text-[#084F7D]" />
                              4. Speaking
                            </span>
                            <span className="text-[10px] text-slate-400">14m · 3 Parts</span>
                          </div>
                          <h4 className="text-xs font-semibold text-slate-800 line-clamp-2">
                            {pkg.speakingSet?.title || 'IELTS Speaking Full Mock'}
                          </h4>
                        </div>
                        <div>
                          {status.speaking.isCompleted ? (
                            <button
                              onClick={() => {
                                if (status.speaking.assessment && onViewSpeakingAssessment) {
                                  onViewSpeakingAssessment(status.speaking.assessment.id);
                                }
                              }}
                              className="w-full py-1.5 px-3 bg-white hover:bg-slate-50 text-[#084F7D] font-semibold rounded-lg text-xs border border-[#E5E1D7]"
                            >
                              Review Assessment (Band {status.speaking.band?.toFixed(1)})
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (!isLoggedIn) onOpenLogin();
                                else if (onStartSpeaking) {
                                  onStartSpeaking(pkg.speakingSet?.id, undefined, undefined, 'mock');
                                }
                              }}
                              className="w-full py-1.5 px-3 bg-[#084F7D] hover:bg-[#063D62] text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              <span>Start Speaking</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
