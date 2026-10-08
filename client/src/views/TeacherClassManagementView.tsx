import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { ClassItem, ClassEnrolment, Assignment, TestPackage, PrePostComparisonReport, ClassTestType } from '../types';
import { formatMakassarDateTime } from '../../../shared/dateUtils';
import { PrePostComparisonModal } from './PrePostComparisonModal';

export const TeacherClassManagementView: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'roster'>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Class Overview Data
  const [overview, setOverview] = useState<any>(null);
  const [overviewLoading, setOverviewLoading] = useState<boolean>(false);

  // Assignments & Packages Data
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [testPackages, setTestPackages] = useState<TestPackage[]>([]);
  const [readingTests, setReadingTests] = useState<any[]>([]);
  const [listeningTests, setListeningTests] = useState<any[]>([]);

  // Roster Data
  const [roster, setRoster] = useState<ClassEnrolment[]>([]);

  // Modals State
  const [showCreateClassModal, setShowCreateClassModal] = useState<boolean>(false);
  const [newClassTitle, setNewClassTitle] = useState<string>('');
  const [newClassDesc, setNewClassDesc] = useState<string>('');
  const [newClassType, setNewClassType] = useState<ClassTestType>('academic');

  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [assignPurpose, setAssignPurpose] = useState<'pre_test' | 'practice' | 'post_test'>('practice');
  const [assignType, setAssignType] = useState<'package' | 'reading' | 'listening'>('practice' === 'practice' ? 'reading' : 'package');
  const [assignTitle, setAssignTitle] = useState<string>('');
  const [assignInstructions, setAssignInstructions] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [assignMode, setAssignMode] = useState<'practice' | 'mock'>('practice');
  const [assignDeadline, setAssignDeadline] = useState<string>('');
  const [assignAttemptLimit, setAssignAttemptLimit] = useState<number>(3);
  const [assignWarning, setAssignWarning] = useState<string | null>(null);

  const [enrolEmail, setEnrolEmail] = useState<string>('');
  const [enrolLoading, setEnrolLoading] = useState<boolean>(false);

  // Student Comparison Report Modal
  const [selectedStudentReport, setSelectedStudentReport] = useState<PrePostComparisonReport | null>(null);
  const [reportLoading, setReportLoading] = useState<boolean>(false);

  useEffect(() => {
    loadClasses();
    loadCatalogues();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      loadClassDetails(selectedClassId);
    }
  }, [selectedClassId]);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const res = await api.getClasses();
      setClasses(res.classes);
      if (res.classes.length > 0 && !selectedClassId) {
        setSelectedClassId(res.classes[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load classes.');
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogues = async () => {
    try {
      const [pkgs, reads, lists] = await Promise.all([
        api.getTestPackages(),
        api.getTests(),
        api.getListeningTests(),
      ]);
      setTestPackages(pkgs.testPackages);
      setReadingTests(reads.tests);
      setListeningTests(lists.tests);
    } catch (e) {
      // ignore
    }
  };

  const loadClassDetails = async (classId: string) => {
    setOverviewLoading(true);
    try {
      const [ovRes, assignRes, rosterRes] = await Promise.all([
        api.getClassOverview(classId),
        api.getClassAssignments(classId),
        api.getClassEnrolments(classId),
      ]);
      setOverview(ovRes);
      setAssignments(assignRes.assignments);
      setRoster(rosterRes.enrolments);
    } catch (err: any) {
      setError(err.message || 'Failed to load class data.');
    } finally {
      setOverviewLoading(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassTitle.trim()) return;

    try {
      const res = await api.createClass({
        title: newClassTitle.trim(),
        description: newClassDesc.trim(),
        testType: newClassType,
      });
      setShowCreateClassModal(false);
      setNewClassTitle('');
      setNewClassDesc('');
      await loadClasses();
      setSelectedClassId(res.class.id);
    } catch (err: any) {
      alert(`Error creating class: ${err.message}`);
    }
  };

  const handleEnrolStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !enrolEmail.trim()) return;

    setEnrolLoading(true);
    try {
      await api.enrolStudent(selectedClassId, enrolEmail.trim());
      setEnrolEmail('');
      await loadClassDetails(selectedClassId);
    } catch (err: any) {
      alert(`Enrolment failed: ${err.message}`);
    } finally {
      setEnrolLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId: string, studentName: string) => {
    if (!selectedClassId) return;
    const confirmed = window.confirm(
      `Remove ${studentName} from this class?\n\nNote: This will revoke class access, but the student account and historical test attempts will remain completely preserved.`
    );
    if (!confirmed) return;

    try {
      await api.removeStudent(selectedClassId, studentId);
      await loadClassDetails(selectedClassId);
    } catch (err: any) {
      alert(`Error removing student: ${err.message}`);
    }
  };

  const handleReleasePostTest = async (assignmentId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to release this post-test now?\n\nThis will make the exit assessment and its materials immediately available to enrolled class learners.'
    );
    if (!confirmed) return;

    try {
      await api.releaseAssignment(assignmentId);
      if (selectedClassId) await loadClassDetails(selectedClassId);
    } catch (err: any) {
      alert(`Error releasing post-test: ${err.message}`);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !assignTitle.trim()) return;

    const payload: any = {
      title: assignTitle.trim(),
      instructions: assignInstructions.trim() || undefined,
      purpose: assignPurpose,
      mode: assignPurpose === 'practice' ? assignMode : 'mock',
      attemptLimit: assignAttemptLimit,
      deadlineAt: assignDeadline ? new Date(assignDeadline).toISOString() : undefined,
    };

    if (assignType === 'package') {
      payload.packageId = selectedPackageId;
      payload.skill = 'all';
    } else if (assignType === 'reading') {
      payload.testId = selectedTestId;
      payload.skill = 'reading';
    } else {
      payload.testId = selectedTestId;
      payload.skill = 'listening';
    }

    try {
      const res = await api.createAssignment(selectedClassId, payload);
      if (res.warning) {
        alert(`Notice: ${res.warning}`);
      }
      setShowAssignModal(false);
      setAssignTitle('');
      setAssignInstructions('');
      setAssignDeadline('');
      setAssignWarning(null);
      await loadClassDetails(selectedClassId);
    } catch (err: any) {
      alert(`Error creating assignment: ${err.message}`);
    }
  };

  const handleViewStudentComparison = async (studentId: string) => {
    if (!selectedClassId) return;
    setReportLoading(true);
    try {
      const res = await api.getComparisonReport(selectedClassId, studentId);
      setSelectedStudentReport(res.report);
    } catch (err: any) {
      alert(`Error loading comparison report: ${err.message}`);
    } finally {
      setReportLoading(false);
    }
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Class & Journey Management</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your cohorts, assign multi-skill packages, protect exit post-tests, and track diagnostic progression.
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowCreateClassModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create New Class</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-800">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading your classes...</div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
          <h3 className="text-lg font-bold text-slate-800">No classes created yet</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Create your first Academic or General Training class to start enrolling learners and assigning diagnostic assessments.
          </p>
          <button
            onClick={() => setShowCreateClassModal(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Class
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Class Switcher & Invitation Code Card */}
          <div className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-slate-200 rounded-xl p-4 gap-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class:</label>
              <select
                value={selectedClassId || ''}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.title} ({cls.testType === 'academic' ? 'Academic' : 'General Training'})
                  </option>
                ))}
              </select>
            </div>

            {selectedClass && (
              <div className="flex items-center space-x-3 text-xs bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-lg">
                <span className="text-indigo-900 font-medium">Student Invitation Code:</span>
                <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 text-sm">
                  {selectedClass.invitationCode}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedClass.invitationCode);
                    alert('Invitation code copied to clipboard!');
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Copy
                </button>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 space-x-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Diagnostic Overview & Analytics
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-3 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'assignments'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Assignments & Test Packages
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              className={`py-3 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'roster'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Student Roster ({roster.length})
            </button>
          </div>

          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {overviewLoading ? (
                <div className="text-center py-12 text-slate-500">Loading overview analytics...</div>
              ) : overview ? (
                <div className="space-y-6">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm space-y-1">
                      <div className="text-xs text-slate-500 font-semibold uppercase">Total Enrolled</div>
                      <div className="text-2xl font-bold text-slate-900">{overview.totalStudents}</div>
                      <div className="text-xs text-slate-400">Active Learners</div>
                    </div>
                    <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm space-y-1">
                      <div className="text-xs text-slate-500 font-semibold uppercase">Pre-Test Diagnostic</div>
                      <div className="text-2xl font-bold text-indigo-600">
                        {overview.preTestCompletedCount} / {overview.totalStudents}
                      </div>
                      <div className="text-xs text-slate-400">Submissions completed</div>
                    </div>
                    <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm space-y-1">
                      <div className="text-xs text-slate-500 font-semibold uppercase">Exit Post-Test</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {overview.postTestCompletedCount} / {overview.totalStudents}
                      </div>
                      <div className="text-xs text-slate-400">Submissions completed</div>
                    </div>
                    <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm space-y-1">
                      <div className="text-xs text-slate-500 font-semibold uppercase">Course Practice Modules</div>
                      <div className="text-2xl font-bold text-slate-800">
                        {overview.assignments.filter((a: any) => a.purpose === 'practice').length}
                      </div>
                      <div className="text-xs text-slate-400">Assigned activities</div>
                    </div>
                  </div>

                  {/* Missing Skills Pedagogical Alert */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start space-x-2">
                    <svg className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-semibold">Skill Slot Assessment Integrity: </span>
                      Writing and Speaking slots are explicitly flagged as <em>not yet implemented</em>. Overall 4-skill bands cannot be computed or simulated without authentic examiner/AI marking.
                    </div>
                  </div>

                  {/* Student Progression Roster Table */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm">Learner Progress & Diagnostic Reports</h3>
                    </div>
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                          <th className="px-4 py-3">Student</th>
                          <th className="px-4 py-3">Enrolled At (WITA)</th>
                          <th className="px-4 py-3">Pre-Test</th>
                          <th className="px-4 py-3">Practice Done</th>
                          <th className="px-4 py-3">Post-Test</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {overview.studentsProgress.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-slate-500 italic text-xs">
                              No students enrolled yet.
                            </td>
                          </tr>
                        ) : (
                          overview.studentsProgress.map((sp: any) => (
                            <tr key={sp.studentId} className="hover:bg-slate-50">
                              <td className="px-4 py-3">
                                <div className="font-semibold text-slate-900">{sp.studentName}</div>
                                <div className="text-xs text-slate-500">{sp.studentEmail}</div>
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-500">{sp.enrolledAt}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    sp.preTestStatus === 'completed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : sp.preTestStatus === 'in_progress'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {sp.preTestStatus.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-700">
                                {sp.completedAssignmentsCount} completed
                                {sp.overdueAssignmentsCount > 0 && (
                                  <span className="text-rose-600 font-semibold ml-1">
                                    ({sp.overdueAssignmentsCount} overdue)
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    sp.postTestStatus === 'completed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : sp.postTestStatus === 'in_progress'
                                      ? 'bg-amber-100 text-amber-800'
                                      : sp.postTestStatus === 'awaiting_release'
                                      ? 'bg-slate-200 text-slate-600'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {sp.postTestStatus.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => handleViewStudentComparison(sp.studentId)}
                                  className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-xs font-semibold transition-colors"
                                >
                                  View Progression Report
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Question Type Difficulty Diagnostics */}
                  {overview.difficultQuestionTypes && overview.difficultQuestionTypes.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Class Question Type Accuracy Diagnostics</h3>
                        <p className="text-xs text-slate-500">
                          Identifies specific question formats where cohort learners encounter difficulty to guide targeted instruction.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {overview.difficultQuestionTypes.map((item: any) => (
                          <div key={item.questionType} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-semibold text-slate-800 capitalize">{item.questionType}</span>
                              <span className="font-bold text-slate-900">{item.accuracyPct}% accuracy</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full ${
                                  item.accuracyPct < 50
                                    ? 'bg-rose-500'
                                    : item.accuracyPct < 75
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${item.accuracyPct}%` }}
                              />
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {item.correctCount} / {item.totalAnswered} answers correct
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 2: ASSIGNMENTS & PACKAGES */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Class Assignments</h3>
                  <p className="text-xs text-slate-500">
                    Schedule diagnostic pre-tests, skill practice sets, and protected post-tests.
                  </p>
                </div>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Create Assignment
                </button>
              </div>

              {assignments.length === 0 ? (
                <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500 text-xs italic">
                  No assignments created for this class yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.map((a) => (
                    <div
                      key={a.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-sm">{a.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                              a.purpose === 'pre_test'
                                ? 'bg-indigo-100 text-indigo-800'
                                : a.purpose === 'post_test'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {a.purpose.replace('_', ' ')}
                          </span>
                          {!a.isReleased && a.purpose === 'post_test' && (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                              🔒 Unreleased
                            </span>
                          )}
                        </div>
                        {a.instructions && <p className="text-xs text-slate-600">{a.instructions}</p>}
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>Target: {a.packageTitle || a.testTitle || 'Selected content'}</span>
                          <span>Deadline: {formatMakassarDateTime(a.deadlineAt)}</span>
                          <span>Attempts Limit: {a.attemptLimit}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {a.purpose === 'post_test' && !a.isReleased && (
                          <button
                            onClick={() => handleReleasePostTest(a.id)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold transition-colors"
                          >
                            Release Post-Test Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STUDENT ROSTER */}
          {activeTab === 'roster' && (
            <div className="space-y-6">
              {/* Enrol Student by Email Form */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Enrol Student by Email</h3>
                <form onSubmit={handleEnrolStudent} className="flex gap-3 max-w-md">
                  <input
                    type="email"
                    value={enrolEmail}
                    onChange={(e) => setEnrolEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={enrolLoading || !enrolEmail.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {enrolLoading ? 'Enrolling...' : 'Enrol'}
                  </button>
                </form>
              </div>

              {/* Roster List Table */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Email Address</th>
                      <th className="px-4 py-3">Enrolled At (WITA)</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {roster.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-slate-500 italic text-xs">
                          No students currently enrolled in this class.
                        </td>
                      </tr>
                    ) : (
                      roster.map((enr) => (
                        <tr key={enr.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-900">{enr.studentName}</td>
                          <td className="px-4 py-3 text-slate-600 text-xs">{enr.studentEmail}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{formatMakassarDateTime(enr.enrolledAt)}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleRemoveStudent(enr.studentId, enr.studentName || 'this student')}
                              className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-xs font-semibold transition-colors"
                            >
                              Remove Access
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Class Modal */}
      {showCreateClassModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Create New Class</h3>
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Class Title</label>
                  <input
                    type="text"
                    value={newClassTitle}
                    onChange={(e) => setNewClassTitle(e.target.value)}
                    placeholder="e.g. November 2026 Academic IELTS Intensive"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Description (Optional)</label>
                  <textarea
                    value={newClassDesc}
                    onChange={(e) => setNewClassDesc(e.target.value)}
                    placeholder="Course objectives, schedule, target band..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">IELTS Version</label>
                  <select
                    value={newClassType}
                    onChange={(e) => setNewClassType(e.target.value as ClassTestType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="academic">Academic</option>
                    <option value="general">General Training</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateClassModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                  >
                    Create Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Create Class Assignment</h3>
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Purpose</label>
                  <select
                    value={assignPurpose}
                    onChange={(e) => {
                      const p = e.target.value as any;
                      setAssignPurpose(p);
                      if (p === 'pre_test' || p === 'post_test') {
                        setAssignType('package');
                        setAssignMode('mock');
                        setAssignAttemptLimit(1);
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="pre_test">Diagnostic Pre-Test</option>
                    <option value="practice">Course Practice</option>
                    <option value="post_test">Exit Post-Test (Protected)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Assignment Title</label>
                  <input
                    type="text"
                    value={assignTitle}
                    onChange={(e) => setAssignTitle(e.target.value)}
                    placeholder="e.g. Diagnostic Pre-Test Examination"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Instructions</label>
                  <textarea
                    value={assignInstructions}
                    onChange={(e) => setAssignInstructions(e.target.value)}
                    placeholder="Specific teacher guidance for learners..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Content Type</label>
                  <select
                    value={assignType}
                    onChange={(e) => setAssignType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="package">Multi-Skill Test Package</option>
                    <option value="reading">Single Reading Test</option>
                    <option value="listening">Single Listening Test</option>
                  </select>
                </div>

                {assignType === 'package' ? (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Select Test Package</label>
                    <select
                      value={selectedPackageId}
                      onChange={(e) => setSelectedPackageId(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                    >
                      <option value="">-- Choose Package --</option>
                      {testPackages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.packageType})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : assignType === 'reading' ? (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Select Reading Test</label>
                    <select
                      value={selectedTestId}
                      onChange={(e) => setSelectedTestId(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                    >
                      <option value="">-- Choose Reading Test --</option>
                      {readingTests.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Select Listening Test</label>
                    <select
                      value={selectedTestId}
                      onChange={(e) => setSelectedTestId(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                    >
                      <option value="">-- Choose Listening Test --</option>
                      {listeningTests.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Attempt Limit</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={assignAttemptLimit}
                      onChange={(e) => setAssignAttemptLimit(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Deadline (Optional)</label>
                    <input
                      type="datetime-local"
                      value={assignDeadline}
                      onChange={(e) => setAssignDeadline(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                  >
                    Create Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Progression Report Modal */}
      {selectedStudentReport && (
        <PrePostComparisonModal
          report={selectedStudentReport}
          onClose={() => setSelectedStudentReport(null)}
        />
      )}
    </div>
  );
};
