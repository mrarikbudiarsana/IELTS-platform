import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { calculateIeltsFourSkillOverallBand } from '../../../shared/scoring';
import {
  Calendar,
  Edit2,
  Clock,
  ArrowRight,
  CheckCircle2,
  Play,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Award,
  Sparkles,
  TrendingUp,
  Target,
  BarChart3,
  ChevronRight,
  ShieldAlert,
  Flame,
  Check,
  RotateCcw
} from 'lucide-react';

interface StudentDashboardViewProps {
  onNavigate: (
    view: string,
    skill?: 'reading' | 'listening' | 'writing' | 'speaking',
    category?: 'all' | 'mock' | 'practice'
  ) => void;
  onStartReading: (testId: string, mode?: 'practice' | 'mock') => void;
  onStartListening: (testId: string, mode?: 'practice' | 'mock') => void;
  onStartWriting: (attemptId: string) => void;
  onStartSpeaking: (setId?: string, mode?: 'practice' | 'mock') => void;
  onViewResults: (attemptId: string) => void;
  onViewListeningResults: (attemptId: string) => void;
  onViewWritingFeedback: (attemptId: string) => void;
  onOpenLogin: () => void;
  onOpenGoalModal: () => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  onNavigate,
  onStartReading,
  onStartListening,
  onStartWriting,
  onStartSpeaking,
  onViewResults,
  onViewListeningResults,
  onViewWritingFeedback,
  onOpenLogin,
  onOpenGoalModal,
}) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [readingAttempts, setReadingAttempts] = useState<any[]>([]);
  const [listeningAttempts, setListeningAttempts] = useState<any[]>([]);
  const [writingAttempts, setWritingAttempts] = useState<any[]>([]);
  const [speakingAssessments, setSpeakingAssessments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (user) {
        const [rAttRes, lAttRes, wAttRes, sAttRes] = await Promise.all([
          api.getAttempts().catch(() => ({ attempts: [] })),
          api.getListeningAttempts().catch(() => ({ attempts: [] })),
          api.getWritingAttempts().catch(() => ({ attempts: [] })),
          api.getMySpeakingAssessments().catch(() => ({ assessments: [] })),
        ]);

        setReadingAttempts(rAttRes.attempts || []);
        setListeningAttempts(lAttRes.attempts || []);
        setWritingAttempts(wAttRes.attempts || []);
        setSpeakingAssessments(sAttRes.assessments || []);

        const classRes = await api.getClasses().catch(() => ({ classes: [] }));
        setClasses(classRes.classes || []);

        if (classRes.classes && classRes.classes.length > 0) {
          const allAss: any[] = [];
          for (const c of classRes.classes) {
            try {
              const assRes = await api.getClassAssignments(c.id);
              if (assRes.assignments) {
                for (const a of assRes.assignments) {
                  allAss.push({ ...a, className: c.title });
                }
              }
            } catch {
              // ignore
            }
          }
          setAssignments(allAss);
        }
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Find any active in-progress attempt to resume
  const inProgressReading = readingAttempts.find((a) => a.status === 'in_progress');
  const inProgressListening = listeningAttempts.find((a) => a.status === 'in_progress');
  const activeAttempt = inProgressReading
    ? { ...inProgressReading, skill: 'reading' }
    : inProgressListening
    ? { ...inProgressListening, skill: 'listening' }
    : null;

  // Real Progress Calculations
  const completedReading = readingAttempts.filter((a) => a.status === 'submitted' || a.status === 'expired');
  const completedListening = listeningAttempts.filter((a) => a.status === 'submitted' || a.status === 'expired');
  const completedWriting = writingAttempts.filter((a) => a.status === 'submitted' || a.status === 'evaluated');
  const completedSpeaking = speakingAssessments;

  // Best/Latest Band per skill
  const latestReadingBand = completedReading[0]?.bandScore;
  const latestListeningBand = completedListening[0]?.estimatedBandScore;
  const latestWritingBand = completedWriting[0]?.overallWritingBand;
  const latestSpeakingBand = completedSpeaking[0]?.overallBand;

  // Overall Estimated Band Score (4 skills)
  const estimatedOverallBand = calculateIeltsFourSkillOverallBand(
    latestListeningBand,
    latestReadingBand,
    latestWritingBand,
    latestSpeakingBand
  );

  // Total activities completed
  const totalCompletedCount =
    completedReading.length +
    completedListening.length +
    completedWriting.length +
    completedSpeaking.length;

  // Days before exam
  let daysBeforeExam: number | null = null;
  if (user?.testDate) {
    const examDate = new Date(user.testDate);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    daysBeforeExam = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const displayName = user ? user.fullName.split(' ')[0] : 'Student';

  // Recent 4 completed activity logs across all skills
  const recentActivities = useMemo(() => {
    const list: any[] = [];

    completedListening.forEach((a) => {
      list.push({
        id: a.id,
        skill: 'listening',
        title: a.testTitle || 'IELTS Listening Test',
        scoreText: `Band ${a.estimatedBandScore?.toFixed(1) || '—'} (${a.rawScore || 0}/${a.totalQuestions || 40})`,
        date: a.submittedAt || a.startedAt,
        action: () => onViewListeningResults(a.id),
      });
    });

    completedReading.forEach((a) => {
      list.push({
        id: a.id,
        skill: 'reading',
        title: a.testTitle || 'IELTS Reading Test',
        scoreText: `Band ${a.bandScore?.toFixed(1) || '—'} (${a.rawScore || 0}/${a.totalQuestions || 40})`,
        date: a.submittedAt || a.startedAt,
        action: () => onViewResults(a.id),
      });
    });

    completedWriting.forEach((a) => {
      list.push({
        id: a.id,
        skill: 'writing',
        title: a.task1Title || a.task2Title || 'IELTS Writing Task',
        scoreText: a.overallWritingBand ? `Band ${a.overallWritingBand.toFixed(1)}` : 'Evaluated',
        date: a.submittedAt || a.startedAt,
        action: () => onViewWritingFeedback(a.id),
      });
    });

    completedSpeaking.forEach((a) => {
      list.push({
        id: a.id,
        skill: 'speaking',
        title: a.speakingSetTitle || 'IELTS AI Speaking Simulation',
        scoreText: `Band ${a.overallBand?.toFixed(1) || '—'}`,
        date: a.createdAt,
        action: () => onNavigate('speaking'),
      });
    });

    return list
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  }, [completedListening, completedReading, completedWriting, completedSpeaking]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10 font-sans space-y-7">
      {/* 1. TOP GREETING HEADER */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
          Welcome back,{' '}
          <span className="text-[#084F7D] font-bold">{displayName}</span>!
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          Pick up right where you left off and keep moving toward your target band score.
        </p>
      </div>

      {/* IN-PROGRESS RESUME BANNER (If student has a paused test) */}
      {activeAttempt && (
        <div className="bg-[#FEF7EE] border border-[#FC9F23]/40 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FC9F23]/15 text-[#FC9F23] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FC9F23]">
                    Resume Your Examination
                  </span>
                  <span className="text-[10px] text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded font-semibold">
                    In Progress
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 mt-0.5">
                  {activeAttempt.testTitle || 'Active IELTS Examination Session'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your answers and highlighters are safely auto-saved.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (activeAttempt.skill === 'reading') {
                  onStartReading(activeAttempt.testId);
                } else {
                  onStartListening(activeAttempt.testId);
                }
              }}
              className="px-4 py-2 bg-[#084F7D] hover:bg-[#063D62] text-white font-semibold rounded-xl text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Resume Attempt</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. REAL PROGRESS & BAND OVERVIEW (Replaced "Complete these five steps") */}
      <div className="bg-white rounded-3xl border border-[#E5E1D7] p-6 sm:p-7 shadow-2xs space-y-6">
        {/* Header row: Progress Title & Overall Score badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EFECE4]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                IELTS PERFORMANCE SNAPSHOT
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {totalCompletedCount} Activities Done
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Skill Proficiency & Diagnostic Progress
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Live band estimates based on your completed practice tests and mock assessments.
            </p>
          </div>

          {/* Current Overall Band vs Target */}
          <div className="bg-[#FAF9F5] border border-[#E5E1D7] rounded-2xl p-3.5 sm:px-5 flex items-center gap-4 shrink-0">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                ESTIMATED OVERALL
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                {user?.targetBand ? `Goal: Band ${user.targetBand.toFixed(1)}` : 'Set your goal'}
              </div>
            </div>
            {estimatedOverallBand !== undefined ? (
              <div className="px-3.5 py-1.5 bg-[#084F7D] text-white font-black text-xl rounded-xl shadow-2xs">
                Band {estimatedOverallBand.toFixed(1)}
              </div>
            ) : (
              <div className="px-3 py-1.5 bg-slate-200 text-slate-600 font-bold text-xs rounded-xl">
                Pending
              </div>
            )}
          </div>
        </div>

        {/* 4 Skill Diagnostic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Listening */}
          <div
            onClick={() => onNavigate('catalogue', 'listening', 'all')}
            className="bg-[#FAF9F5] rounded-2xl p-4.5 border border-[#E5E1D7] hover:border-[#084F7D]/40 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-[#084F7D]" />
                  Listening
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {completedListening.length} tests
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {latestListeningBand !== undefined ? latestListeningBand.toFixed(1) : '—'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {latestListeningBand !== undefined ? 'Latest Band' : 'No tests yet'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#084F7D] pt-2 border-t border-slate-200/60 group-hover:underline">
              <span>Practice Listening</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. Reading */}
          <div
            onClick={() => onNavigate('catalogue', 'reading', 'all')}
            className="bg-[#FAF9F5] rounded-2xl p-4.5 border border-[#E5E1D7] hover:border-[#084F7D]/40 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#084F7D]" />
                  Reading
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {completedReading.length} tests
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {latestReadingBand !== undefined ? latestReadingBand.toFixed(1) : '—'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {latestReadingBand !== undefined ? 'Latest Band' : 'No tests yet'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#084F7D] pt-2 border-t border-slate-200/60 group-hover:underline">
              <span>Practice Reading</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 3. Writing */}
          <div
            onClick={() => onNavigate('catalogue', 'writing', 'all')}
            className="bg-[#FAF9F5] rounded-2xl p-4.5 border border-[#E5E1D7] hover:border-[#084F7D]/40 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <PenTool className="w-4 h-4 text-[#084F7D]" />
                  Writing
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {completedWriting.length} essays
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {latestWritingBand !== undefined ? latestWritingBand.toFixed(1) : '—'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {latestWritingBand !== undefined ? 'Latest Band' : 'No essays yet'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#084F7D] pt-2 border-t border-slate-200/60 group-hover:underline">
              <span>Practice Writing</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 4. Speaking */}
          <div
            onClick={() => onNavigate('catalogue', 'speaking', 'all')}
            className="bg-[#FAF9F5] rounded-2xl p-4.5 border border-[#E5E1D7] hover:border-[#084F7D]/40 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-[#084F7D]" />
                  Speaking
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {completedSpeaking.length} sessions
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {latestSpeakingBand !== undefined ? latestSpeakingBand.toFixed(1) : '—'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {latestSpeakingBand !== undefined ? 'Latest Band' : 'No sessions yet'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#084F7D] pt-2 border-t border-slate-200/60 group-hover:underline">
              <span>Practice Speaking</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Recent Activity List or First Activity Prompt */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Submissions & Scores
            </h3>
            {recentActivities.length > 0 && (
              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-semibold text-[#084F7D] hover:underline flex items-center gap-1"
              >
                <span>View Full History</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {recentActivities.length === 0 ? (
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-slate-600">
                You haven't completed any tests yet. Start with a Reading or Listening test to establish your starting benchmark band score!
              </div>
              <button
                onClick={() => onNavigate('catalogue', 'reading', 'all')}
                className="px-4 py-2 bg-[#084F7D] hover:bg-[#063D62] text-white font-bold rounded-xl transition-colors shrink-0 shadow-2xs"
              >
                Take Diagnostic Test
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#EFECE4] border border-[#E5E1D7] rounded-2xl overflow-hidden bg-white">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 sm:px-4.5 flex items-center justify-between gap-3 hover:bg-[#FAF9F5] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#EBF4F9] text-[#084F7D] flex items-center justify-center shrink-0">
                      {act.skill === 'listening' ? (
                        <Headphones className="w-4 h-4" />
                      ) : act.skill === 'reading' ? (
                        <BookOpen className="w-4 h-4" />
                      ) : act.skill === 'writing' ? (
                        <PenTool className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                        {act.title}
                      </h4>
                      <div className="text-[11px] text-slate-400 capitalize">
                        {act.skill} · {new Date(act.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {act.scoreText}
                    </span>
                    <button
                      onClick={act.action}
                      className="px-3 py-1.5 text-xs font-semibold text-[#084F7D] hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. METRIC CARDS (Exam Countdown & Target Band) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: DAYS BEFORE EXAM */}
        <div
          onClick={onOpenGoalModal}
          className="bg-white rounded-2xl border border-[#E7E3D9] p-5 shadow-2xs hover:border-[#084F7D]/50 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              DAYS BEFORE EXAM
            </span>
            <div className="p-1 rounded-md text-slate-400 group-hover:text-[#084F7D] group-hover:bg-[#EBF4F9] transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          <div className="py-1 text-center">
            {daysBeforeExam !== null && daysBeforeExam >= 0 ? (
              <span className="text-3xl font-bold text-slate-800 tracking-tight">
                {daysBeforeExam}
              </span>
            ) : (
              <span className="text-3xl font-bold text-slate-800 tracking-wider">
                —
              </span>
            )}
          </div>

          <div className="text-center">
            <span className="text-xs font-normal text-slate-500 group-hover:text-[#084F7D] transition-colors">
              {user?.testDate
                ? `Target Date: ${new Date(user.testDate).toLocaleDateString()}`
                : 'Add your IELTS date'}
            </span>
          </div>
        </div>

        {/* Card 2: TARGET BAND SCORE */}
        <div
          onClick={onOpenGoalModal}
          className="bg-white rounded-2xl border border-[#E7E3D9] p-5 shadow-2xs hover:border-[#084F7D]/50 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              TARGET BAND SCORE
            </span>
            <div className="p-1 rounded-md text-slate-400 group-hover:text-[#084F7D] group-hover:bg-[#EBF4F9] transition-colors">
              <Edit2 className="w-4 h-4" />
            </div>
          </div>

          <div className="py-1 text-center">
            {user?.targetBand ? (
              <span className="text-3xl font-bold text-[#084F7D] tracking-tight">
                {user.targetBand.toFixed(1)}
              </span>
            ) : (
              <span className="text-3xl font-bold text-slate-800 tracking-wider">
                —
              </span>
            )}
          </div>

          <div className="text-center">
            <span className="text-xs font-normal text-slate-500 group-hover:text-[#084F7D] transition-colors">
              {user?.targetBand
                ? `Aiming for Band ${user.targetBand.toFixed(1)}`
                : 'Add your target'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. ACTIVE CLASS ASSIGNMENTS (If student is enrolled) */}
      {assignments.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E7E3D9] p-5 sm:p-6 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#084F7D]">
                Classroom Work
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Assigned Homework & Quizzes
              </h3>
            </div>
            <button
              onClick={() => onNavigate('student_classes')}
              className="text-xs font-semibold text-[#084F7D] hover:underline flex items-center gap-1"
            >
              <span>View All Classes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {assignments.slice(0, 4).map((ass) => (
              <div
                key={ass.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-[#FAF9F6] flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase">
                    {ass.className}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900">{ass.title}</h4>
                </div>
                <button
                  onClick={() => onNavigate('student_classes')}
                  className="px-3 py-1.5 rounded-lg bg-[#084F7D] hover:bg-[#063D62] text-white text-xs font-semibold shadow-2xs transition-colors"
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
