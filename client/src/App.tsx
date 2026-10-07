import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { CatalogueView } from './views/CatalogueView';
import { TestRunnerView } from './views/TestRunnerView';
import { ResultsView } from './views/ResultsView';
import { HistoryView } from './views/HistoryView';
import { TeacherDashboardView } from './views/TeacherDashboardView';
import { TestEditorView } from './views/TestEditorView';
import { AdminUsersView } from './views/AdminUsersView';
import { LoginModal } from './views/LoginModal';
import { ElevateModal } from './views/ElevateModal';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  // Navigation router states
  const [currentView, setCurrentView] = useState<string>('catalogue');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [activeModeOverride, setActiveModeOverride] = useState<'practice' | 'mock' | undefined>(undefined);
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);

  // Editor states
  const [editingTestId, setEditingTestId] = useState<string | undefined>(undefined);
  const [editingVersionId, setEditingVersionId] = useState<string | undefined>(undefined);

  // Modals
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [elevateModalOpen, setElevateModalOpen] = useState(false);

  // Handlers
  const handleStartTest = (testId: string, modeOverride?: 'practice' | 'mock') => {
    setActiveTestId(testId);
    setActiveModeOverride(modeOverride);
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

  const handleEditTest = (testId: string, versionId: string) => {
    setEditingTestId(testId);
    setEditingVersionId(versionId);
    setCurrentView('teacher_edit_form');
  };

  const handleCreateNewTest = () => {
    setEditingTestId(undefined);
    setEditingVersionId(undefined);
    setCurrentView('teacher_edit_form');
  };

  const handlePreviewTest = (testId: string) => {
    setActiveTestId(testId);
    setActiveModeOverride('practice');
    setCurrentView('test_runner');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Conditionally render header: TestRunnerView uses its own distraction-free exam header */}
      {currentView !== 'test_runner' && (
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
            onViewResults={handleViewResults}
            onOpenLogin={() => setLoginModalOpen(true)}
            isLoggedIn={!!user}
          />
        )}

        {currentView === 'test_runner' && activeTestId && (
          <TestRunnerView
            testId={activeTestId}
            modeOverride={activeModeOverride}
            onExit={() => setCurrentView('catalogue')}
            onFinish={handleFinishTest}
          />
        )}

        {currentView === 'results' && activeAttemptId && (
          <ResultsView
            attemptId={activeAttemptId}
            onBackToCatalogue={() => setCurrentView('catalogue')}
            onRetryTest={(tId) => handleStartTest(tId, 'practice')}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            onBackToCatalogue={() => setCurrentView('catalogue')}
            onViewResults={handleViewResults}
            onRetryTest={(tId) => handleStartTest(tId, 'practice')}
          />
        )}

        {currentView === 'teacher_editor' && (
          <TeacherDashboardView
            onEditTest={handleEditTest}
            onCreateNewTest={handleCreateNewTest}
            onPreviewTest={handlePreviewTest}
            onViewStudentResult={handleViewResults}
          />
        )}

        {currentView === 'teacher_attempts' && (
          <TeacherDashboardView
            onEditTest={handleEditTest}
            onCreateNewTest={handleCreateNewTest}
            onPreviewTest={handlePreviewTest}
            onViewStudentResult={handleViewResults}
          />
        )}

        {currentView === 'teacher_edit_form' && (
          <TestEditorView
            testId={editingTestId}
            versionId={editingVersionId}
            onBack={() => setCurrentView('teacher_editor')}
            onPreview={handlePreviewTest}
          />
        )}

        {currentView === 'admin_users' && (
          <AdminUsersView onBack={() => setCurrentView('catalogue')} />
        )}
      </div>

      {/* Footer for non-exam views */}
      {currentView !== 'test_runner' && (
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              &copy; {new Date().getFullYear()} IELTS Preparation Platform — Learn English With Arik. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Reading Milestone 1</span>
              <span>•</span>
              <span>Strict Non-Fuzzy Marking</span>
              <span>•</span>
              <span>Verified Band Scales</span>
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
