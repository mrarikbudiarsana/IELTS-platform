import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
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
import { LoginModal } from './views/LoginModal';
import { ElevateModal } from './views/ElevateModal';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  // Navigation router states
  const [currentView, setCurrentView] = useState<string>('catalogue');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [activeModeOverride, setActiveModeOverride] = useState<'practice' | 'mock' | undefined>(undefined);
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);
  const [activeWritingAttemptId, setActiveWritingAttemptId] = useState<string | null>(null);
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | undefined>(undefined);
  const [activePackageAttemptId, setActivePackageAttemptId] = useState<string | undefined>(undefined);

  // Editor states
  const [editingTestId, setEditingTestId] = useState<string | undefined>(undefined);
  const [editingVersionId, setEditingVersionId] = useState<string | undefined>(undefined);

  // Modals
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [elevateModalOpen, setElevateModalOpen] = useState(false);

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
  const handleStartTest = (testId: string, modeOverride?: 'practice' | 'mock', assignmentId?: string, packageAttemptId?: string) => {
    setActiveTestId(testId);
    setActiveModeOverride(modeOverride);
    setActiveAssignmentId(assignmentId);
    setActivePackageAttemptId(packageAttemptId);
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
  const handleStartListeningTest = (testId: string, modeOverride?: 'practice' | 'mock', assignmentId?: string, packageAttemptId?: string) => {
    setActiveTestId(testId);
    setActiveModeOverride(modeOverride);
    setActiveAssignmentId(assignmentId);
    setActivePackageAttemptId(packageAttemptId);
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

  const isExamView = currentView === 'test_runner' || currentView === 'listening_test_runner' || currentView === 'writing_workspace';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Conditionally render header: TestRunner, ListeningTestRunner, and WritingWorkspace use their own distraction-free exam header */}
      {!isExamView && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onOpenLogin={() => setLoginModalOpen(true)}
          onOpenElevate={() => setElevateModalOpen(true)}
        />
      )}

      {/* Main Views */}
      <div className="flex-1">
        {currentView === 'catalogue' && (
          <CatalogueView
            onStartTest={handleStartTest}
            onStartListeningTest={handleStartListeningTest}
            onStartWriting={handleStartWriting}
            onViewResults={handleViewResults}
            onViewListeningResults={handleViewListeningResults}
            onViewWritingFeedback={handleViewWritingFeedback}
            onOpenLogin={() => setLoginModalOpen(true)}
            isLoggedIn={!!user}
          />
        )}

        {/* Reading Runner */}
        {currentView === 'test_runner' && activeTestId && (
          <TestRunnerView
            testId={activeTestId}
            modeOverride={activeModeOverride}
            assignmentId={activeAssignmentId}
            packageAttemptId={activePackageAttemptId}
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

        {/* Writing Diagnostic Feedback */}
        {currentView === 'writing_feedback' && activeWritingAttemptId && (
          <WritingFeedbackView
            attemptId={activeWritingAttemptId}
            onExit={() => setCurrentView('catalogue')}
            onRevise={(attId) => handleStartWriting(attId)}
          />
        )}

        {/* Reading Results */}
        {currentView === 'results' && activeAttemptId && (
          <ResultsView
            attemptId={activeAttemptId}
            onBackToCatalogue={() => setCurrentView('catalogue')}
            onRetryTest={(tId) => handleStartTest(tId, 'practice')}
          />
        )}

        {/* Listening Results */}
        {currentView === 'listening_results' && activeAttemptId && (
          <ListeningResultsView
            attemptId={activeAttemptId}
            onBackToCatalogue={() => setCurrentView('catalogue')}
            onRetryTest={(tId) => handleStartListeningTest(tId, 'practice')}
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
      </div>

      {/* Footer for non-exam views */}
      {!isExamView && (
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              &copy; {new Date().getFullYear()} IELTS Preparation Platform — Learn English With Arik. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Reading (M1)</span>
              <span>•</span>
              <span>Listening (M2)</span>
              <span>•</span>
              <span>Classes & Journey (M3)</span>
              <span>•</span>
              <span>Teacher Speaking (M4)</span>
              <span>•</span>
              <span>Writing & AI (M5)</span>
            </div>
          </div>
        </footer>
      )}

      {/* Modals */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <ElevateModal isOpen={elevateModalOpen} onClose={() => setElevateModalOpen(false)} />
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
