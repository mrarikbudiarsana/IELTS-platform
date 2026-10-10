import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { CatalogueView } from './views/CatalogueView';
import { TestRunnerView } from './views/TestRunnerView';
import { ListeningTestRunnerView } from './views/ListeningTestRunnerView';
import { ResultsView } from './views/ResultsView';
import { ListeningResultsView } from './views/ListeningResultsView';
import { HistoryView } from './views/HistoryView';
import { TeacherDashboardView } from './views/TeacherDashboardView';
import { TestEditorView } from './views/TestEditorView';
import { ListeningEditorView } from './views/ListeningEditorView';
import { AdminUsersView } from './views/AdminUsersView';
import { StudentClassDashboardView } from './views/StudentClassDashboardView';
import { TeacherClassManagementView } from './views/TeacherClassManagementView';
import { TeacherSpeakingAssessmentView } from './views/TeacherSpeakingAssessmentView';
import { WritingWorkspaceView } from './views/WritingWorkspaceView';
import { WritingFeedbackView } from './views/WritingFeedbackView';
import { TeacherWritingEditorView } from './views/TeacherWritingEditorView';
import { VocabularyView } from './views/VocabularyView';
import { ExploreView } from './views/ExploreView';
import { StudyChatView } from './views/StudyChatView';
import { LoginModal } from './views/LoginModal';
import { ElevateModal } from './views/ElevateModal';
import { SpeakingSetupModal } from './views/SpeakingSetupModal';
import { LiveAiSpeakingView } from './views/LiveAiSpeakingView';
import { SpeakingFeedbackModal } from './views/SpeakingFeedbackModal';
import { AccountCommercialView } from './views/AccountCommercialView';
import { AdminCommercialManagementView } from './views/AdminCommercialManagementView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { FullMockView } from './views/FullMockView';
import { GoalModal } from './components/GoalModal';
import { WhatsNewModal } from './components/WhatsNewModal';
import { SpeakingAssessment } from './types';
import { api } from './api';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  // Navigation router states
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [activeSkill, setActiveSkill] = useState<'reading' | 'listening' | 'writing' | 'speaking'>('reading');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'mock' | 'practice'>('all');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [activeModeOverride, setActiveModeOverride] = useState<'practice' | 'mock' | undefined>(undefined);
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);
  const [activeWritingAttemptId, setActiveWritingAttemptId] = useState<string | null>(null);
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | undefined>(undefined);
  const [activePackageAttemptId, setActivePackageAttemptId] = useState<string | undefined>(undefined);
  const [activeQuestionTypeFilter, setActiveQuestionTypeFilter] = useState<string | undefined>(undefined);

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Live AI Speaking states
  const [activeSpeakingSession, setActiveSpeakingSession] = useState<any | null>(null);
  const [activeSpeakingAssessment, setActiveSpeakingAssessment] = useState<SpeakingAssessment | null>(null);
  const [speakingFeedbackModalOpen, setSpeakingFeedbackModalOpen] = useState(false);
  const [speakingSetupModalOpen, setSpeakingSetupModalOpen] = useState(false);
  const [speakingSetupParams, setSpeakingSetupParams] = useState<{
    setId?: string;
    setVersionId?: string;
    assignmentId?: string;
    packageAttemptId?: string;
    mode?: 'practice' | 'mock';
  }>({});

  // Editor states
  const [editingTestId, setEditingTestId] = useState<string | undefined>(undefined);
  const [editingVersionId, setEditingVersionId] = useState<string | undefined>(undefined);

  // Modals
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [elevateModalOpen, setElevateModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [whatsNewModalOpen, setWhatsNewModalOpen] = useState(false);

  // Handlers for Speaking
  const handleOpenSpeakingSetup = (
    setId?: string,
    assignmentId?: string,
    packageAttemptId?: string,
    mode?: 'practice' | 'mock'
  ) => {
    if (!user) {
      setLoginModalOpen(true);
      return;
    }
    setSpeakingSetupParams({ setId, assignmentId, packageAttemptId, mode });
    setSpeakingSetupModalOpen(true);
  };

  const handleStartSpeakingSession = (session: any) => {
    setActiveSpeakingSession(session);
    setSpeakingSetupModalOpen(false);
    setCurrentView('live_speaking');
  };

  const handleSpeakingAssessmentCompleted = (assessment: SpeakingAssessment) => {
    setActiveSpeakingAssessment(assessment);
    setSpeakingFeedbackModalOpen(true);
    setCurrentView('catalogue');
  };

  const handleViewSpeakingAssessment = async (assessmentId: string) => {
    try {
      const res = await api.getSpeakingAssessment(assessmentId);
      setActiveSpeakingAssessment(res.assessment);
      setSpeakingFeedbackModalOpen(true);
    } catch (err: any) {
      alert(err.message || 'Could not load speaking assessment.');
    }
  };

  // Handlers for Writing
  const handleStartWriting = (attemptId: string) => {
    setActiveWritingAttemptId(attemptId);
    setCurrentView('writing_workspace');
  };

  const handleFinishWriting = (attemptId: string) => {
    setActiveWritingAttemptId(attemptId);
    setCurrentView('writing_feedback');
  };

  const handleViewWritingFeedback = (attemptId: string) => {
    setActiveWritingAttemptId(attemptId);
    setCurrentView('writing_feedback');
  };

  // Handlers for Reading
  const handleStartTest = (
    testId: string,
    modeOverride?: 'practice' | 'mock',
    assignmentId?: string,
    packageAttemptId?: string,
    questionTypeFilter?: string
  ) => {
    setActiveTestId(testId);
    setActiveModeOverride(modeOverride);
    setActiveAssignmentId(assignmentId);
    setActivePackageAttemptId(packageAttemptId);
    setActiveQuestionTypeFilter(questionTypeFilter);
    setCurrentView('test_runner');
  };

  const handleFinishTest = (attemptId: string) => {
    setActiveAttemptId(attemptId);
    setCurrentView('results');
  };

  const handleViewResults = (attemptId: string) => {
    setActiveAttemptId(attemptId);
    setCurrentView('results');
  };

  // Handlers for Listening
  const handleStartListeningTest = (
    testId: string,
    modeOverride?: 'practice' | 'mock',
    assignmentId?: string,
    packageAttemptId?: string,
    questionTypeFilter?: string
  ) => {
    setActiveTestId(testId);
    setActiveModeOverride(modeOverride);
    setActiveAssignmentId(assignmentId);
    setActivePackageAttemptId(packageAttemptId);
    setActiveQuestionTypeFilter(questionTypeFilter);
    setCurrentView('listening_test_runner');
  };

  const handleFinishListeningTest = (attemptId: string) => {
    setActiveAttemptId(attemptId);
    setCurrentView('listening_results');
  };

  const handleViewListeningResults = (attemptId: string) => {
    setActiveAttemptId(attemptId);
    setCurrentView('listening_results');
  };

  // Teacher handlers
  const handleEditTest = (testId: string, versionId: string, skill: 'reading' | 'listening') => {
    setEditingTestId(testId);
    setEditingVersionId(versionId);
    if (skill === 'reading') {
      setCurrentView('teacher_edit_form');
    } else {
      setCurrentView('teacher_listening_edit_form');
    }
  };

  const handleCreateNewTest = (skill: 'reading' | 'listening') => {
    setEditingTestId(undefined);
    setEditingVersionId(undefined);
    if (skill === 'reading') {
      setCurrentView('teacher_edit_form');
    } else {
      setCurrentView('teacher_listening_edit_form');
    }
  };

  const handlePreviewTest = (testId: string, skill: 'reading' | 'listening') => {
    setActiveTestId(testId);
    setActiveModeOverride('practice');
    if (skill === 'reading') {
      setCurrentView('test_runner');
    } else {
      setCurrentView('listening_test_runner');
    }
  };

  const isExamView =
    currentView === 'test_runner' ||
    currentView === 'listening_test_runner' ||
    currentView === 'writing_workspace' ||
    currentView === 'live_speaking';

  // If in distraction-free exam runner, render full screen without sidebar
  if (isExamView) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        {/* Reading Runner */}
        {currentView === 'test_runner' && activeTestId && (
          <TestRunnerView
            testId={activeTestId}
            modeOverride={activeModeOverride}
            assignmentId={activeAssignmentId}
            packageAttemptId={activePackageAttemptId}
            questionTypeFilter={activeQuestionTypeFilter}
            onExit={() => setCurrentView('catalogue')}
            onFinish={handleFinishTest}
          />
        )}

        {/* Listening Runner */}
        {currentView === 'listening_test_runner' && activeTestId && (
          <ListeningTestRunnerView
            testId={activeTestId}
            modeOverride={activeModeOverride}
            assignmentId={activeAssignmentId}
            packageAttemptId={activePackageAttemptId}
            questionTypeFilter={activeQuestionTypeFilter}
            onExit={() => setCurrentView('catalogue')}
            onFinish={handleFinishListeningTest}
          />
        )}

        {/* Writing Workspace */}
        {currentView === 'writing_workspace' && activeWritingAttemptId && (
          <WritingWorkspaceView
            attemptId={activeWritingAttemptId}
            onFinish={handleFinishWriting}
            onExit={() => setCurrentView('catalogue')}
          />
        )}

        {/* Live AI Speaking Simulation Room */}
        {currentView === 'live_speaking' && activeSpeakingSession && (
          <LiveAiSpeakingView
            initialSession={activeSpeakingSession}
            onExit={() => setCurrentView('catalogue')}
            onAssessmentCompleted={handleSpeakingAssessmentCompleted}
          />
        )}
      </div>
    );
  }

  // Standard Application Layout with Left Sidebar matching Image 1
  return (
    <div className="min-h-screen bg-[#F6F4EE] text-slate-900 flex flex-col md:flex-row font-sans">
      {/* Sleek Dark Left Sidebar */}
      <Sidebar
        currentView={currentView}
        activeSkill={activeSkill}
        activeCategoryFilter={activeCategoryFilter}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onNavigate={(view, skill, category) => {
          if (skill) setActiveSkill(skill);
          if (category) setActiveCategoryFilter(category);
          setCurrentView(view);
        }}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenElevate={() => setElevateModalOpen(true)}
        onOpenWhatsNew={() => setWhatsNewModalOpen(true)}
      />

      {/* Main Canvas Area */}
      <main className="flex-1 min-w-0 bg-[#F6F4EE] flex flex-col justify-between overflow-x-hidden">
        <div className="flex-1">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <StudentDashboardView
              onNavigate={(view, skill, cat) => {
                if (skill) setActiveSkill(skill);
                if (cat) setActiveCategoryFilter(cat);
                setCurrentView(view);
              }}
              onStartReading={(tId, mode) => handleStartTest(tId, mode)}
              onStartListening={(tId, mode) => handleStartListeningTest(tId, mode)}
              onStartWriting={handleStartWriting}
              onStartSpeaking={handleOpenSpeakingSetup}
              onViewResults={handleViewResults}
              onViewListeningResults={handleViewListeningResults}
              onViewWritingFeedback={handleViewWritingFeedback}
              onOpenLogin={() => setLoginModalOpen(true)}
              onOpenGoalModal={() => setGoalModalOpen(true)}
            />
          )}

          {/* Clean Catalogue View */}
          {(currentView === 'catalogue' || currentView === 'practice' || currentView === 'mock_tests') && (
            <CatalogueView
              initialSkill={activeSkill}
              initialCategoryFilter={activeCategoryFilter}
              onStartTest={handleStartTest}
              onStartListeningTest={handleStartListeningTest}
              onStartWriting={handleStartWriting}
              onStartSpeaking={handleOpenSpeakingSetup}
              onViewResults={handleViewResults}
              onViewListeningResults={handleViewListeningResults}
              onViewWritingFeedback={handleViewWritingFeedback}
              onViewSpeakingAssessment={handleViewSpeakingAssessment}
              onOpenLogin={() => setLoginModalOpen(true)}
              isLoggedIn={!!user}
            />
          )}

          {/* Full 4-Skill Mock Exam Hub */}
          {currentView === 'full_mock' && (
            <FullMockView
              onStartReading={handleStartTest}
              onStartListening={handleStartListeningTest}
              onStartWriting={handleStartWriting}
              onStartSpeaking={handleOpenSpeakingSetup}
              onViewReadingResults={handleViewResults}
              onViewListeningResults={handleViewListeningResults}
              onViewWritingFeedback={handleViewWritingFeedback}
              onViewSpeakingAssessment={handleViewSpeakingAssessment}
              onOpenLogin={() => setLoginModalOpen(true)}
              isLoggedIn={!!user}
            />
          )}

          {/* Vocabulary Bank View */}
          {currentView === 'vocabulary' && (
            <VocabularyView
              onWordSaved={() => {}}
              onWordReviewed={() => {}}
            />
          )}

          {/* Explore Authentic English Sources */}
          {currentView === 'explore' && (
            <ExploreView
              onSourceExplored={() => {}}
            />
          )}

          {/* AI IELTS Study Chat */}
          {currentView === 'chat' && (
            <StudyChatView />
          )}

          {/* Reading Diagnostic Results */}
          {currentView === 'results' && activeAttemptId && (
            <ResultsView
              attemptId={activeAttemptId}
              onBackToCatalogue={() => setCurrentView('catalogue')}
              onRetryTest={(tId) => handleStartTest(tId, 'practice')}
            />
          )}

          {/* Listening Diagnostic Results */}
          {currentView === 'listening_results' && activeAttemptId && (
            <ListeningResultsView
              attemptId={activeAttemptId}
              onBackToCatalogue={() => setCurrentView('catalogue')}
              onRetryTest={(tId) => handleStartListeningTest(tId, 'practice')}
            />
          )}

          {/* Writing Diagnostic Feedback */}
          {currentView === 'writing_feedback' && activeWritingAttemptId && (
            <WritingFeedbackView
              attemptId={activeWritingAttemptId}
              onExit={() => setCurrentView('catalogue')}
              onRevise={(attId) => handleStartWriting(attId)}
            />
          )}

          {/* History */}
          {currentView === 'history' && (
            <HistoryView
              onBackToCatalogue={() => setCurrentView('catalogue')}
              onViewResults={handleViewResults}
              onViewListeningResults={handleViewListeningResults}
              onViewWritingFeedback={handleViewWritingFeedback}
              onRetryTest={(tId) => handleStartTest(tId, 'practice')}
              onRetryListeningTest={(tId) => handleStartListeningTest(tId, 'practice')}
            />
          )}

          {/* Student Class Dashboard */}
          {currentView === 'student_classes' && (
            <StudentClassDashboardView
              onStartReading={handleStartTest}
              onStartListening={handleStartListeningTest}
              onStartWriting={handleStartWriting}
              onStartSpeaking={handleOpenSpeakingSetup}
              onViewReadingResults={handleViewResults}
              onViewListeningResults={handleViewListeningResults}
              onViewWritingFeedback={handleViewWritingFeedback}
            />
          )}

          {/* Teacher Class Management */}
          {currentView === 'teacher_classes' && (
            <TeacherClassManagementView />
          )}

          {/* Teacher Speaking Assessment */}
          {currentView === 'teacher_speaking' && (
            <TeacherSpeakingAssessmentView />
          )}

          {/* Teacher Writing Editor & Assessment Guidance */}
          {currentView === 'teacher_writing' && (
            <TeacherWritingEditorView />
          )}

          {/* Teacher Dashboard */}
          {(currentView === 'teacher_editor' || currentView === 'teacher_attempts') && (
            <TeacherDashboardView
              onEditTest={handleEditTest}
              onCreateNewTest={handleCreateNewTest}
              onPreviewTest={handlePreviewTest}
              onViewStudentResult={(attId, skill) => {
                if (skill === 'reading') handleViewResults(attId);
                else handleViewListeningResults(attId);
              }}
            />
          )}

          {/* Reading Editor Form */}
          {currentView === 'teacher_edit_form' && (
            <TestEditorView
              testId={editingTestId}
              versionId={editingVersionId}
              onBack={() => setCurrentView('teacher_editor')}
              onPreview={(tId) => handlePreviewTest(tId, 'reading')}
            />
          )}

          {/* Listening Editor Form */}
          {currentView === 'teacher_listening_edit_form' && (
            <ListeningEditorView
              testId={editingTestId}
              versionId={editingVersionId}
              onBack={() => setCurrentView('teacher_editor')}
              onPreview={(tId) => handlePreviewTest(tId, 'listening')}
            />
          )}

          {/* Admin Management */}
          {currentView === 'admin_users' && (
            <AdminUsersView onBack={() => setCurrentView('catalogue')} />
          )}

          {/* Commercial Plans & Learner Store */}
          {(currentView === 'account' || currentView === 'commercial_store') && (
            <AccountCommercialView onBack={() => setCurrentView('catalogue')} />
          )}

          {/* Commercial & Financial Management (Admin / Staff) */}
          {(currentView === 'admin_commercial' || currentView === 'commercial_admin') && (
            <AdminCommercialManagementView onBack={() => setCurrentView('catalogue')} />
          )}
        </div>

        {/* Subtle, Minimal Footer */}
        <footer className="border-t border-[#E7E3D9] py-6 px-6 sm:px-8 text-xs text-slate-500 bg-[#F6F4EE]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#084F7D]">IELTS with Arik</span>
              <span>•</span>
              <span>Your Gateway to Global Success</span>
            </div>
            <div className="text-slate-400">
              &copy; {new Date().getFullYear()} IELTS with Arik. All rights reserved.
            </div>
          </div>
        </footer>
      </main>

      {/* Global Modals */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <ElevateModal isOpen={elevateModalOpen} onClose={() => setElevateModalOpen(false)} />
      <GoalModal
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        onSuccess={() => {}}
      />
      <WhatsNewModal
        isOpen={whatsNewModalOpen}
        onClose={() => setWhatsNewModalOpen(false)}
      />

      {speakingSetupModalOpen && (
        <SpeakingSetupModal
          isOpen={speakingSetupModalOpen}
          onClose={() => setSpeakingSetupModalOpen(false)}
          onStartSession={handleStartSpeakingSession}
          setId={speakingSetupParams.setId}
          setVersionId={speakingSetupParams.setVersionId}
          assignmentId={speakingSetupParams.assignmentId}
          packageAttemptId={speakingSetupParams.packageAttemptId}
          initialMode={speakingSetupParams.mode}
        />
      )}

      {speakingFeedbackModalOpen && activeSpeakingAssessment && (
        <SpeakingFeedbackModal
          assessment={activeSpeakingAssessment}
          onClose={() => setSpeakingFeedbackModalOpen(false)}
          isTeacher={user?.role === 'teacher' || user?.role === 'admin'}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
