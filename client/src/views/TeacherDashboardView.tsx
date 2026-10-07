import React, { useState, useEffect } from 'react';
import { ReadingTest, ListeningTest } from '../types';
import { api } from '../api';
import {
  Layers,
  Plus,
  Edit3,
  GitFork,
  CheckCircle,
  Archive,
  Eye,
  BookOpen,
  Headphones,
  UserCheck,
} from 'lucide-react';

interface TeacherDashboardViewProps {
  onEditTest: (testId: string, versionId: string, skill: 'reading' | 'listening') => void;
  onCreateNewTest: (skill: 'reading' | 'listening') => void;
  onPreviewTest: (testId: string, skill: 'reading' | 'listening') => void;
  onViewStudentResult: (attemptId: string, skill: 'reading' | 'listening') => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  onEditTest,
  onCreateNewTest,
  onPreviewTest,
  onViewStudentResult,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<'reading' | 'listening'>('reading');
  const [readingTests, setReadingTests] = useState<ReadingTest[]>([]);
  const [listeningTests, setListeningTests] = useState<ListeningTest[]>([]);
  const [studentAttempts, setStudentAttempts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'tests' | 'submissions'>('tests');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedSkill, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'tests') {
        if (selectedSkill === 'reading') {
          const res = await api.getTests();
          setReadingTests(res.tests);
        } else {
          const res = await api.getListeningTests();
          setListeningTests(res.tests);
        }
      } else {
        if (selectedSkill === 'reading') {
          const res = await api.getTeacherAttempts();
          setStudentAttempts(res.attempts);
        } else {
          const res = await api.getTeacherListeningAttempts();
          setStudentAttempts(res.attempts);
        }
      }
    } catch (err) {
      console.error('Failed to load teacher data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFork = async (testId: string) => {
    try {
      if (selectedSkill === 'reading') {
        const res = await api.forkDraft(testId);
        setActionMessage(`Created new Reading draft version v${res.version.versionNumber}.0!`);
        setTimeout(() => setActionMessage(null), 3000);
        loadData();
        onEditTest(testId, res.version.id, 'reading');
      } else {
        const res = await api.forkListeningDraft(testId);
        setActionMessage(`Created new Listening draft version v${res.version.versionNumber}.0!`);
        setTimeout(() => setActionMessage(null), 3000);
        loadData();
        onEditTest(testId, res.version.id, 'listening');
      }
    } catch (err: any) {
      alert(err.message || 'Fork failed');
    }
  };

  const handlePublish = async (testId: string, versionId: string) => {
    try {
      if (selectedSkill === 'reading') {
        await api.publishVersion(testId, versionId);
        setActionMessage('Reading version validated and published successfully!');
      } else {
        await api.publishListeningVersion(testId, versionId);
        setActionMessage('Listening version validated and published successfully!');
      }
      setTimeout(() => setActionMessage(null), 3000);
      loadData();
    } catch (err: any) {
      alert(`Publishing blocked:\n${err.message}`);
    }
  };

  const handleArchive = async (testId: string) => {
    if (!confirm('Are you sure you want to archive this test? Students will no longer see it.')) return;
    try {
      if (selectedSkill === 'reading') {
        await api.archiveTest(testId);
      } else {
        await api.archiveListeningTest(testId);
      }
      setActionMessage('Test archived successfully');
      setTimeout(() => setActionMessage(null), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const activeTests = selectedSkill === 'reading' ? readingTests : listeningTests;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Teacher Content Authoring & Submissions
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {selectedSkill === 'reading' ? 'Reading Test Management' : 'Listening Test Management'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure test questions, audio tracks, preview student experience, and publish immutable versions.
          </p>
        </div>

        <button
          onClick={() => onCreateNewTest(selectedSkill)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New {selectedSkill === 'reading' ? 'Reading Test' : 'Listening Test'}
        </button>
      </div>

      {/* Skill Tabs */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setSelectedSkill('reading')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            selectedSkill === 'reading'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Reading Tests (Milestone 1)
        </button>

        <button
          onClick={() => setSelectedSkill('listening')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            selectedSkill === 'listening'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Headphones className="w-4 h-4" />
          Listening Tests (Milestone 2)
        </button>
      </div>

      {actionMessage && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('tests')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'tests'
              ? 'text-amber-800 border-b-2 border-amber-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {selectedSkill === 'reading' ? <BookOpen className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
          All Tests ({activeTests.length})
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'submissions'
              ? 'text-amber-800 border-b-2 border-amber-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Student Submissions ({studentAttempts.length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading data...</div>
      ) : activeTab === 'tests' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 text-left">Test Title</th>
                <th className="px-5 py-3.5 text-left">Version</th>
                <th className="px-5 py-3.5 text-left">Category</th>
                <th className="px-5 py-3.5 text-left">Status</th>
                <th className="px-5 py-3.5 text-left">Questions</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {activeTests.map((test) => (
                <tr key={test.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900 text-sm">
                    {test.title}
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold text-slate-600">
                    v{test.currentVersionNumber}.0
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase mr-1.5 bg-indigo-100 text-indigo-800">
                      {test.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                        test.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : test.status === 'draft'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {test.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-700">
                    {test.totalQuestions} Questions
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => onPreviewTest(test.id, selectedSkill)}
                      className="px-2.5 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg font-semibold inline-flex items-center gap-1"
                      title="Student Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>

                    {test.status === 'draft' ? (
                      <>
                        <button
                          onClick={() => onEditTest(test.id, test.latestVersionId, selectedSkill)}
                          className="px-2.5 py-1 text-amber-700 hover:bg-amber-50 border border-amber-300 rounded-lg font-semibold inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit Draft
                        </button>
                        <button
                          onClick={() => handlePublish(test.id, test.latestVersionId)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold inline-flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Publish
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleFork(test.id)}
                        className="px-2.5 py-1 text-indigo-700 hover:bg-indigo-50 border border-indigo-300 rounded-lg font-semibold inline-flex items-center gap-1"
                        title="Editing a published test creates an immutable new version"
                      >
                        <GitFork className="w-3.5 h-3.5" />
                        Edit (New Version)
                      </button>
                    )}

                    {test.status !== 'archived' && (
                      <button
                        onClick={() => handleArchive(test.id)}
                        className="px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg"
                        title="Archive test"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* SUBMISSIONS QUEUE */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 text-left">Learner</th>
                <th className="px-5 py-3.5 text-left">Test Title</th>
                <th className="px-5 py-3.5 text-left">Raw Score</th>
                <th className="px-5 py-3.5 text-left">Estimated Band</th>
                <th className="px-5 py-3.5 text-left">Submitted Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {studentAttempts.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900">
                    <div>{att.student_name}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{att.student_email}</div>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {att.test_title}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900">
                    {att.raw_score} / {att.total_questions}
                  </td>
                  <td className="px-5 py-4">
                    {att.band_score ? (
                      <span className="font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                        Band {att.band_score.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-slate-400">Practice</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-medium">
                    {new Date(att.submitted_at || att.created_at).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onViewStudentResult(att.id, selectedSkill)}
                      className="px-3 py-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 border border-indigo-200 rounded-lg font-bold"
                    >
                      Inspect Answers
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
