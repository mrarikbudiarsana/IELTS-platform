import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { ClassItem, Assignment, PrePostComparisonReport, SpeakingAssessment } from '../types';
import { formatMakassarDateTime } from '../../../shared/dateUtils';
import { PrePostComparisonModal } from './PrePostComparisonModal';
import { SpeakingFeedbackModal } from './SpeakingFeedbackModal';

interface StudentClassDashboardViewProps {
  onStartReading: (testId: string, mode: 'practice' | 'mock', assignmentId?: string, packageAttemptId?: string) => void;
  onStartListening: (testId: string, mode: 'practice' | 'mock', assignmentId?: string, packageAttemptId?: string) => void;
  onViewReadingResults: (attemptId: string) => void;
  onViewListeningResults: (attemptId: string) => void;
}

export const StudentClassDashboardView: React.FC<StudentClassDashboardViewProps> = ({
  onStartReading,
  onStartListening,
  onViewReadingResults,
  onViewListeningResults,
}) => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Join Class Modal State
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [inviteCode, setInviteCode] = useState<string>('');
  const [joinLoading, setJoinLoading] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Comparison Report Modal State
  const [comparisonReport, setComparisonReport] = useState<PrePostComparisonReport | null>(null);
  const [loadingReport, setLoadingReport] = useState<boolean>(false);

  // Speaking Feedback Modal State
  const [speakingModalAssessment, setSpeakingModalAssessment] = useState<SpeakingAssessment | null>(null);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      loadClassAssignments(selectedClassId);
    } else {
      setAssignments([]);
    }
  }, [selectedClassId]);

  const loadClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getClasses();
      setClasses(res.classes);
      if (res.classes.length > 0 && !selectedClassId) {
        setSelectedClassId(res.classes[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load your enrolled classes.');
    } finally {
      setLoading(false);
    }
  };

  const loadClassAssignments = async (classId: string) => {
    try {
      const res = await api.getClassAssignments(classId);
      setAssignments(res.assignments);
    } catch (err: any) {
      setError(err.message || 'Failed to load class assignments.');
    }
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setJoinLoading(true);
    setJoinError(null);
    try {
      const res = await api.joinClass(inviteCode.trim().toUpperCase());
      setShowJoinModal(false);
      setInviteCode('');
      await loadClasses();
      setSelectedClassId(res.class.id);
    } catch (err: any) {
      setJoinError(err.message || 'Failed to join class. Please check your invitation code.');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleOpenComparison = async (classId: string) => {
    setLoadingReport(true);
    try {
      // Need student ID - from current user session (stored in comparison endpoint directly)
      const userRes = await api.me();
      const res = await api.getComparisonReport(classId, userRes.user.id);
      setComparisonReport(res.report);
    } catch (err: any) {
      alert(`Could not generate comparison report: ${err.message}`);
    } finally {
      setLoadingReport(false);
    }
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const preTestAssignment = assignments.find((a) => a.purpose === 'pre_test');
  const postTestAssignment = assignments.find((a) => a.purpose === 'post_test');
  const practiceAssignments = assignments.filter((a) => a.purpose === 'practice');

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Submitted</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">In Progress</span>;
      case 'overdue':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Overdue</span>;
      case 'awaiting_release':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">Awaiting Teacher Release</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Not Started</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Class Learning Journey</h1>
          <p className="text-sm text-slate-600 mt-1">
            Complete the Diagnostic Pre-Test, followed by Course Practice, and concluding with your Exit Post-Test.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Join Class with Code</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading your enrolled classes...</div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">You are not enrolled in any class yet</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Enter an invitation code supplied by your instructor to join your class and begin your structured learning journey.
          </p>
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Enter Invitation Code
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Class Selector Tabs */}
          {classes.length > 1 && (
            <div className="flex border-b border-slate-200 space-x-4">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition-colors ${
                    selectedClassId === cls.id
                      ? 'border-indigo-600 text-indigo-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cls.title}
                </button>
              ))}
            </div>
          )}

          {selectedClass && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Selected Class Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-slate-900">{selectedClass.title}</h2>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-indigo-100 text-indigo-800">
                      {selectedClass.testType}
                    </span>
                  </div>
                  {selectedClass.description && (
                    <p className="text-sm text-slate-600 mt-1">{selectedClass.description}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-0.5">Instructor: {selectedClass.teacherName}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleOpenComparison(selectedClass.id)}
                    disabled={loadingReport}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>{loadingReport ? 'Generating Report...' : 'Diagnostic Pre vs Post Report'}</span>
                  </button>
                </div>
              </div>

              {/* 3-Stage Journey Pathway Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Diagnostic Pre-Test Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                      <h3 className="font-bold text-slate-800">Diagnostic Pre-Test</h3>
                    </div>
                    {preTestAssignment && getStatusBadge(preTestAssignment.studentStatus)}
                  </div>

                  {preTestAssignment ? (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {preTestAssignment.instructions || 'Initial diagnostic exam rehearsal to establish your baseline benchmark across Reading and Listening.'}
                      </p>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                        <div className="font-semibold text-slate-700">{preTestAssignment.title}</div>
                        <div className="text-slate-500">Package: {preTestAssignment.packageTitle || 'Full Test Package'}</div>
                        <div className="text-slate-500">
                          Released: {formatMakassarDateTime(preTestAssignment.releaseAt)}
                        </div>
                      </div>

                      {/* Executable Skill Actions */}
                      <div className="pt-2 flex flex-wrap gap-2">
                        <button
                          onClick={async () => {
                            try {
                              const pkgRes = await api.startPackageAttempt(preTestAssignment.id);
                              // Start or resume Reading
                              if (pkgRes.testPackage.readingTestId) {
                                onStartReading(
                                  pkgRes.testPackage.readingTestId,
                                  preTestAssignment.mode,
                                  preTestAssignment.id,
                                  pkgRes.packageAttempt.id
                                );
                              }
                            } catch (e: any) {
                              alert(e.message);
                            }
                          }}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition-colors"
                        >
                          Take Reading Section
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const pkgRes = await api.startPackageAttempt(preTestAssignment.id);
                              // Start or resume Listening
                              if (pkgRes.testPackage.listeningTestId) {
                                onStartListening(
                                  pkgRes.testPackage.listeningTestId,
                                  preTestAssignment.mode,
                                  preTestAssignment.id,
                                  pkgRes.packageAttempt.id
                                );
                              }
                            } catch (e: any) {
                              alert(e.message);
                            }
                          }}
                          className="px-3 py-1.5 bg-sky-600 text-white rounded text-xs font-semibold hover:bg-sky-700 transition-colors"
                        >
                          Take Listening Section
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No pre-test assigned for this class yet.</p>
                  )}
                </div>

                {/* 3. Exit Post-Test Card (Protected) */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                      <h3 className="font-bold text-slate-800">Exit Post-Test</h3>
                    </div>
                    {postTestAssignment ? (
                      postTestAssignment.isReleased ? (
                        getStatusBadge(postTestAssignment.studentStatus)
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          Awaiting Teacher Release
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-slate-400">Not Configured</span>
                    )}
                  </div>

                  {postTestAssignment ? (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {postTestAssignment.instructions || 'Comprehensive exit assessment to evaluate skill development upon completing your course syllabus.'}
                      </p>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                        <div className="font-semibold text-slate-700">{postTestAssignment.title}</div>
                        <div className="text-slate-500">Package: {postTestAssignment.packageTitle || 'Post-Test Package'}</div>
                        {!postTestAssignment.isReleased && (
                          <div className="text-amber-700 font-medium">
                            🔒 Protected content: Your instructor will unlock this assessment upon concluding class practice.
                          </div>
                        )}
                      </div>

                      {postTestAssignment.isReleased ? (
                        <div className="pt-2 flex flex-wrap gap-2">
                          <button
                            onClick={async () => {
                              try {
                                const pkgRes = await api.startPackageAttempt(postTestAssignment.id);
                                if (pkgRes.testPackage.readingTestId) {
                                  onStartReading(
                                    pkgRes.testPackage.readingTestId,
                                    postTestAssignment.mode,
                                    postTestAssignment.id,
                                    pkgRes.packageAttempt.id
                                  );
                                }
                              } catch (e: any) {
                                alert(e.message);
                              }
                            }}
                            className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700 transition-colors"
                          >
                            Take Reading Post-Test
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const pkgRes = await api.startPackageAttempt(postTestAssignment.id);
                                if (pkgRes.testPackage.listeningTestId) {
                                  onStartListening(
                                    pkgRes.testPackage.listeningTestId,
                                    postTestAssignment.mode,
                                    postTestAssignment.id,
                                    pkgRes.packageAttempt.id
                                  );
                                }
                              } catch (e: any) {
                                alert(e.message);
                              }
                            }}
                            className="px-3 py-1.5 bg-sky-600 text-white rounded text-xs font-semibold hover:bg-sky-700 transition-colors"
                          >
                            Take Listening Post-Test
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">
                          Locked until explicitly released by teacher.
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No post-test assigned for this class yet.</p>
                  )}
                </div>
              </div>

              {/* Course Practice Assignments Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Course Practice Assignments</h3>
                    <p className="text-xs text-slate-500">
                      Work through these assigned Reading & Listening modules. All deadlines are in Asia/Makassar (WITA).
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">
                    {practiceAssignments.length} Assignments
                  </span>
                </div>

                {practiceAssignments.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">No course practice modules assigned yet.</p>
                ) : (
                  <div className="space-y-3">
                    {practiceAssignments.map((a) => (
                      <div
                        key={a.id}
                        className="bg-white border border-slate-200 hover:border-indigo-300 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-slate-900 text-sm">{a.title}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-medium">
                              {a.skill || 'mixed'}
                            </span>
                            {getStatusBadge(a.studentStatus)}
                          </div>
                          {a.instructions && (
                            <p className="text-xs text-slate-600 line-clamp-2">{a.instructions}</p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span>Deadline: {formatMakassarDateTime(a.deadlineAt)}</span>
                            <span>Limit: {a.attemptLimit} attempts</span>
                            {a.lastAttemptBand !== undefined && (
                              <span className="font-semibold text-indigo-600">
                                Best: Band {a.lastAttemptBand.toFixed(1)} ({a.lastAttemptScore}/{a.lastAttemptTotal} raw)
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          {a.skill === 'speaking' ? (
                            a.studentStatus === 'submitted' && a.speakingAssessmentId ? (
                              <button
                                onClick={async () => {
                                  try {
                                    const res = await api.getSpeakingAssessment(a.speakingAssessmentId!);
                                    setSpeakingModalAssessment(res.assessment);
                                  } catch (err: any) {
                                    alert(err.message);
                                  }
                                }}
                                className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                              >
                                View Speaking Feedback
                              </button>
                            ) : a.studentStatus === 'in_progress' ? (
                              <span className="px-3 py-1.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium">
                                Teacher Review in Progress
                              </span>
                            ) : (
                              <span className="px-3 py-1.5 rounded bg-slate-100 text-slate-600 text-xs font-medium">
                                In-Class / Online Session
                              </span>
                            )
                          ) : a.studentStatus === 'submitted' ? (
                            <button
                              onClick={() => {
                                if (a.activeAttemptId) {
                                  if (a.skill === 'listening') {
                                    onViewListeningResults(a.activeAttemptId);
                                  } else {
                                    onViewReadingResults(a.activeAttemptId);
                                  }
                                }
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors"
                            >
                              Review Submission
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (a.skill === 'listening' && a.testId) {
                                  onStartListening(a.testId, a.mode, a.id);
                                } else if (a.testId) {
                                  onStartReading(a.testId, a.mode, a.id);
                                }
                              }}
                              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded transition-colors"
                            >
                              {a.studentStatus === 'in_progress' ? 'Continue Attempt' : 'Start Assignment'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Join Class Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Join a Class</h3>
              <p className="text-xs text-slate-600">
                Enter the invitation code provided by your teacher (e.g. <span className="font-mono font-semibold">CLASS-AB12CD</span>).
              </p>

              {joinError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800">
                  {joinError}
                </div>
              )}

              <form onSubmit={handleJoinClass} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Invitation Code</label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="CLASS-XXXXXX"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm uppercase tracking-wider font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowJoinModal(false);
                      setJoinError(null);
                    }}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={joinLoading || !inviteCode.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {joinLoading ? 'Joining...' : 'Confirm & Join'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Progression Report Modal */}
      {comparisonReport && (
        <PrePostComparisonModal
          report={comparisonReport}
          onClose={() => setComparisonReport(null)}
        />
      )}

      {/* Speaking Feedback Modal */}
      {speakingModalAssessment && (
        <SpeakingFeedbackModal
          assessment={speakingModalAssessment}
          onClose={() => setSpeakingModalAssessment(null)}
          isTeacher={false}
        />
      )}
    </div>
  );
};
