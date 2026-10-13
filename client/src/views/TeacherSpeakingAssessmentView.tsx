import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  SpeakingAssessment,
  SpeakingSet,
  ClassEnrolment,
  SpeakingPart,
  SpeakingCriteriaScores,
} from '../types';
import { calculateIeltsSpeakingBand } from '../../../shared/scoring';
import { SpeakingFeedbackModal } from './SpeakingFeedbackModal';
import { CloudinaryMediaUploader } from '../components/CloudinaryMediaUploader';
import { SpeakingSetImporter } from '../components/SpeakingSetImporter';


const CRITERION_OPTIONS = [
  1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0,
];

export const TeacherSpeakingAssessmentView: React.FC = () => {
  const [queue, setQueue] = useState<SpeakingAssessment[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [speakingSets, setSpeakingSets] = useState<SpeakingSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedSessionType, setSelectedSessionType] = useState<string>('');

  // Modals
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [feedbackModalAssessment, setFeedbackModalAssessment] = useState<SpeakingAssessment | null>(null);
  const [correctionTargetAssessment, setCorrectionTargetAssessment] = useState<SpeakingAssessment | null>(null);

  // Record Form State
  const [formClassId, setFormClassId] = useState('');
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [formStudentId, setFormStudentId] = useState('');
  const [useCustomTopic, setUseCustomTopic] = useState(false);
  const [formSetId, setFormSetId] = useState('');
  const [formCustomTopic, setFormCustomTopic] = useState('');
  const [formSessionType, setFormSessionType] = useState<'complete_mock' | 'partial_practice'>('complete_mock');
  const [formPartsCovered, setFormPartsCovered] = useState<SpeakingPart[]>(['part1', 'part2', 'part3']);
  const [formSessionDate, setFormSessionDate] = useState(() => new Date().toISOString().slice(0, 10));
  
  // Criteria scores
  const [scoreFC, setScoreFC] = useState<number | ''>(6.5);
  const [scoreLR, setScoreLR] = useState<number | ''>(6.5);
  const [scoreGRA, setScoreGRA] = useState<number | ''>(6.5);
  const [scoreP, setScoreP] = useState<number | ''>(6.5);

  const [formStrengths, setFormStrengths] = useState('');
  const [formPriorities, setFormPriorities] = useState('');
  const [formPart1Comment, setFormPart1Comment] = useState('');
  const [formPart2Comment, setFormPart2Comment] = useState('');
  const [formPart3Comment, setFormPart3Comment] = useState('');
  const [formPrivateNotes, setFormPrivateNotes] = useState('');
  const [formRecordingUrl, setFormRecordingUrl] = useState('');
  const [formRetentionAck, setFormRetentionAck] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Correction Form State
  const [corrFC, setCorrFC] = useState<number>(6.5);
  const [corrLR, setCorrLR] = useState<number>(6.5);
  const [corrGRA, setCorrGRA] = useState<number>(6.5);
  const [corrP, setCorrP] = useState<number>(6.5);
  const [corrReason, setCorrReason] = useState('');
  const [corrSubmitting, setCorrSubmitting] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadQueue();
  }, [selectedClassId, selectedStatus, selectedSessionType]);

  useEffect(() => {
    if (formClassId) {
      loadEnrolledStudents(formClassId);
    } else {
      setEnrolledStudents([]);
      setFormStudentId('');
    }
  }, [formClassId]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [classesRes, setsRes] = await Promise.all([
        api.getClasses(),
        api.getSpeakingSets({ status: 'published' }),
      ]);
      setClasses(classesRes.classes || []);
      setSpeakingSets(setsRes.sets || []);
      await loadQueue();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadQueue = async () => {
    try {
      const res = await api.getTeacherSpeakingQueue({
        classId: selectedClassId || undefined,
        status: selectedStatus || undefined,
        sessionType: selectedSessionType || undefined,
      });
      setQueue(res.queue || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadEnrolledStudents = async (classId: string) => {
    try {
      const res = await api.getClassEnrolments(classId);
      const active = (res.enrolments || []).filter((e: any) => e.status === 'active');
      setEnrolledStudents(active);
      if (active.length > 0 && !formStudentId) {
        setFormStudentId(active[0].studentId);
      }
    } catch (err: any) {
      console.error('Failed to load enrolments', err);
    }
  };

  // Live Overall Band preview
  const liveOverallBand = React.useMemo(() => {
    if (
      formSessionType === 'complete_mock' &&
      scoreFC !== '' &&
      scoreLR !== '' &&
      scoreGRA !== '' &&
      scoreP !== ''
    ) {
      return calculateIeltsSpeakingBand(
        Number(scoreFC),
        Number(scoreLR),
        Number(scoreGRA),
        Number(scoreP)
      );
    }
    return undefined;
  }, [formSessionType, scoreFC, scoreLR, scoreGRA, scoreP]);

  const liveCorrectionBand = React.useMemo(() => {
    return calculateIeltsSpeakingBand(corrFC, corrLR, corrGRA, corrP);
  }, [corrFC, corrLR, corrGRA, corrP]);

  const handleTogglePart = (part: SpeakingPart) => {
    if (formPartsCovered.includes(part)) {
      if (formPartsCovered.length > 1) {
        setFormPartsCovered(formPartsCovered.filter((p) => p !== part));
      }
    } else {
      setFormPartsCovered([...formPartsCovered, part]);
    }
  };

  const handleSaveAssessment = async (status: 'draft' | 'released') => {
    if (!formStudentId) {
      alert('Please select a student.');
      return;
    }
    if (useCustomTopic && !formCustomTopic.trim()) {
      alert('Please enter the custom topic prompt.');
      return;
    }
    if (!useCustomTopic && !formSetId) {
      alert('Please select a Speaking Set or choose Teacher\'s Own Questions.');
      return;
    }

    if (status === 'released' && formSessionType === 'complete_mock') {
      if (scoreFC === '' || scoreLR === '' || scoreGRA === '' || scoreP === '') {
        alert('All 4 criteria (FC, LR, GRA, P) must be scored before releasing a complete mock.');
        return;
      }
    }

    setFormSubmitting(true);
    try {
      const criteria: Partial<SpeakingCriteriaScores> = {};
      if (scoreFC !== '') criteria.fluencyCoherence = Number(scoreFC);
      if (scoreLR !== '') criteria.lexicalResource = Number(scoreLR);
      if (scoreGRA !== '') criteria.grammaticalRange = Number(scoreGRA);
      if (scoreP !== '') criteria.pronunciation = Number(scoreP);

      await api.recordSpeakingAssessment({
        studentId: formStudentId,
        classId: formClassId || undefined,
        setId: !useCustomTopic ? formSetId : undefined,
        customTopic: useCustomTopic ? formCustomTopic.trim() : undefined,
        sessionType: formSessionType,
        partsCovered: formSessionType === 'complete_mock' ? ['part1', 'part2', 'part3'] : formPartsCovered,
        sessionDate: formSessionDate,
        status,
        criteria,
        strengths: formStrengths.trim() || undefined,
        improvementPriorities: formPriorities.trim() || undefined,
        partComments: {
          part1: formPart1Comment.trim() || undefined,
          part2: formPart2Comment.trim() || undefined,
          part3: formPart3Comment.trim() || undefined,
        },
        teacherPrivateNotes: formPrivateNotes.trim() || undefined,
        recordingUrl: formRecordingUrl.trim() || undefined,
        recordingRetentionAcknowledged: formRetentionAck,
      });

      setShowRecordModal(false);
      resetForm();
      await loadQueue();
    } catch (err: any) {
      alert(`Error saving assessment: ${err.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleReleaseAssessment = async (id: string) => {
    if (!window.confirm('Release this speaking assessment to the candidate? They will be able to review their criterion breakdown and feedback.')) {
      return;
    }
    try {
      await api.releaseSpeakingAssessment(id);
      await loadQueue();
    } catch (err: any) {
      alert(`Failed to release: ${err.message}`);
    }
  };

  const openCorrectionModal = (assessment: SpeakingAssessment) => {
    setCorrectionTargetAssessment(assessment);
    setCorrFC(assessment.criteria?.fluencyCoherence ?? 6.5);
    setCorrLR(assessment.criteria?.lexicalResource ?? 6.5);
    setCorrGRA(assessment.criteria?.grammaticalRange ?? 6.5);
    setCorrP(assessment.criteria?.pronunciation ?? 6.5);
    setCorrReason('');
  };

  const handleSubmitCorrection = async () => {
    if (!correctionTargetAssessment) return;
    if (!corrReason.trim()) {
      alert('A detailed reason is required for score corrections.');
      return;
    }

    setCorrSubmitting(true);
    try {
      await api.correctSpeakingScores(correctionTargetAssessment.id, {
        updatedScores: {
          fluencyCoherence: corrFC,
          lexicalResource: corrLR,
          grammaticalRange: corrGRA,
          pronunciation: corrP,
        },
        reason: corrReason.trim(),
      });
      setCorrectionTargetAssessment(null);
      await loadQueue();
      if (feedbackModalAssessment?.id === correctionTargetAssessment.id) {
        const refreshed = await api.getSpeakingAssessment(correctionTargetAssessment.id);
        setFeedbackModalAssessment(refreshed.assessment);
      }
    } catch (err: any) {
      alert(`Correction failed: ${err.message}`);
    } finally {
      setCorrSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormStudentId('');
    setUseCustomTopic(false);
    setFormSetId('');
    setFormCustomTopic('');
    setFormSessionType('complete_mock');
    setFormPartsCovered(['part1', 'part2', 'part3']);
    setScoreFC(6.5);
    setScoreLR(6.5);
    setScoreGRA(6.5);
    setScoreP(6.5);
    setFormStrengths('');
    setFormPriorities('');
    setFormPart1Comment('');
    setFormPart2Comment('');
    setFormPart3Comment('');
    setFormPrivateNotes('');
    setFormRecordingUrl('');
    setFormRetentionAck(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-700">
            Official IELTS Evaluation Platform
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Teacher-Led Speaking Assessments</h1>
          <p className="text-sm text-slate-600 mt-1">
            Conduct 3-part mocks or targeted partial practice sessions with official IELTS 4-criterion band calibration.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowRecordModal(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <span>🎙️ Record Speaking Assessment</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-800">
          {error}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Class Filter</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800"
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Status Filter</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800"
          >
            <option value="">All Statuses</option>
            <option value="draft">Drafts Only (Unreleased)</option>
            <option value="released">Released Feedback</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Session Type</label>
          <select
            value={selectedSessionType}
            onChange={(e) => setSelectedSessionType(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800"
          >
            <option value="">All Session Types</option>
            <option value="complete_mock">Complete 3-Part Mocks</option>
            <option value="partial_practice">Partial Practice Only</option>
          </select>
        </div>
      </div>

      <SpeakingSetImporter onPublished={() => { loadInitialData(); }} />

      {/* Assessment Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading speaking assessments...</div>
        ) : queue.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <div className="text-3xl">🎙️</div>
            <div className="font-semibold text-slate-700">No speaking assessments recorded yet</div>
            <p className="text-xs text-slate-500">
              Click "Record Speaking Assessment" above to conduct a mock session with an enrolled learner.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Topic / Test Set</th>
                <th className="px-4 py-3">Session Type</th>
                <th className="px-4 py-3">Criteria (FC | LR | GRA | P)</th>
                <th className="px-4 py-3 text-center">Overall Band</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{item.studentName}</div>
                    <div className="text-xs text-slate-500">{item.classTitle || 'Independent Session'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800 truncate max-w-xs">
                      {item.setTitle || item.customTopic || 'Speaking Test'}
                    </div>
                    <div className="text-xs text-slate-400">{item.sessionDateFormatted || item.sessionDate}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        item.sessionType === 'partial_practice'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                      }`}
                    >
                      {item.sessionType === 'partial_practice' ? 'Partial Practice' : '3-Part Mock'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">
                    {item.criteria ? (
                      <>
                        {item.criteria.fluencyCoherence ?? '—'} | {item.criteria.lexicalResource ?? '—'} |{' '}
                        {item.criteria.grammaticalRange ?? '—'} | {item.criteria.pronunciation ?? '—'}
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    {item.sessionType === 'partial_practice' ? (
                      <span className="text-xs font-normal text-slate-400 italic">N/A (Partial)</span>
                    ) : item.overallBand !== undefined ? (
                      <span className="text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        Band {item.overallBand.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-normal">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        item.status === 'released'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status === 'released' ? 'Released' : 'Draft'}
                    </span>
                    {item.corrections && item.corrections.length > 0 && (
                      <span className="text-[10px] block text-purple-700 mt-0.5">
                        ({item.corrections.length} correction{item.corrections.length > 1 ? 's' : ''})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => setFeedbackModalAssessment(item)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    >
                      View Report
                    </button>
                    {item.status === 'draft' ? (
                      <button
                        onClick={() => handleReleaseAssessment(item.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                      >
                        Release
                      </button>
                    ) : (
                      <button
                        onClick={() => openCorrectionModal(item)}
                        className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded transition-colors"
                      >
                        Correct Scores
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL 1: Record Assessment */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-purple-800 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Record Teacher-Led Speaking Assessment</h2>
                <p className="text-xs text-purple-200">
                  Assess candidate live in class or call session with official IELTS criterion descriptors.
                </p>
              </div>
              <button
                onClick={() => setShowRecordModal(false)}
                className="text-purple-200 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              {/* Class & Candidate Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="">Select Class...</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Candidate (Student) *
                  </label>
                  <select
                    value={formStudentId}
                    onChange={(e) => setFormStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    disabled={enrolledStudents.length === 0}
                  >
                    <option value="">Select Candidate...</option>
                    {enrolledStudents.map((enr) => (
                      <option key={enr.studentId} value={enr.studentId}>
                        {enr.studentName} ({enr.studentEmail})
                      </option>
                    ))}
                  </select>
                  {formClassId && enrolledStudents.length === 0 && (
                    <span className="text-[11px] text-amber-600 block mt-1">
                      No actively enrolled students found in this class.
                    </span>
                  )}
                </div>
              </div>

              {/* Topic Selection */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Speaking Material
                  </span>
                  <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useCustomTopic}
                      onChange={(e) => setUseCustomTopic(e.target.checked)}
                      className="rounded text-purple-600"
                    />
                    <span>Use Teacher's Own Questions (Free Topic)</span>
                  </label>
                </div>

                {useCustomTopic ? (
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Topic Name or Question Summary *</label>
                    <input
                      type="text"
                      placeholder="e.g. Urban Architecture, Heritage Preservation, and Smart Cities"
                      value={formCustomTopic}
                      onChange={(e) => setFormCustomTopic(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Choose Saved Speaking Set *</label>
                    <select
                      value={formSetId}
                      onChange={(e) => setFormSetId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="">Select Speaking Set...</option>
                      {speakingSets.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Session Type & Parts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Session Scope</label>
                  <div className="flex space-x-3">
                    <label className="flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="sessionType"
                        value="complete_mock"
                        checked={formSessionType === 'complete_mock'}
                        onChange={() => setFormSessionType('complete_mock')}
                        className="text-purple-600"
                      />
                      <span>Complete 3-Part Mock</span>
                    </label>
                    <label className="flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="sessionType"
                        value="partial_practice"
                        checked={formSessionType === 'partial_practice'}
                        onChange={() => setFormSessionType('partial_practice')}
                        className="text-purple-600"
                      />
                      <span>Partial Practice</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Session Date</label>
                  <input
                    type="date"
                    value={formSessionDate}
                    onChange={(e) => setFormSessionDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* If Partial Practice, choose parts */}
              {formSessionType === 'partial_practice' && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-xs font-semibold text-amber-900 block mb-1">
                    Select Examination Parts Covered:
                  </span>
                  <div className="flex space-x-4 text-xs text-slate-700">
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formPartsCovered.includes('part1')}
                        onChange={() => handleTogglePart('part1')}
                      />
                      <span>Part 1 (Intro & Interview)</span>
                    </label>
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formPartsCovered.includes('part2')}
                        onChange={() => handleTogglePart('part2')}
                      />
                      <span>Part 2 (Long Turn)</span>
                    </label>
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formPartsCovered.includes('part3')}
                        onChange={() => handleTogglePart('part3')}
                      />
                      <span>Part 3 (Discussion)</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1 italic">
                    Note: Partial practice assessments provide diagnostic feedback for selected activities and do NOT calculate an overall IELTS band score.
                  </p>
                </div>
              )}

              {/* Official 4-Criterion Scoring Sliders / Selectors */}
              <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                    IELTS Speaking Criterion Scores (1.0 – 9.0 in 0.5 increments)
                  </span>
                  {liveOverallBand !== undefined && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">
                      Estimated Overall: Band {liveOverallBand.toFixed(1)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Fluency & Coherence
                    </label>
                    <select
                      value={scoreFC}
                      onChange={(e) => setScoreFC(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                    >
                      <option value="">Unrated</option>
                      {CRITERION_OPTIONS.map((val) => (
                        <option key={val} value={val}>
                          {val.toFixed(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Lexical Resource
                    </label>
                    <select
                      value={scoreLR}
                      onChange={(e) => setScoreLR(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                    >
                      <option value="">Unrated</option>
                      {CRITERION_OPTIONS.map((val) => (
                        <option key={val} value={val}>
                          {val.toFixed(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Grammar Range & Acc.
                    </label>
                    <select
                      value={scoreGRA}
                      onChange={(e) => setScoreGRA(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                    >
                      <option value="">Unrated</option>
                      {CRITERION_OPTIONS.map((val) => (
                        <option key={val} value={val}>
                          {val.toFixed(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pronunciation
                    </label>
                    <select
                      value={scoreP}
                      onChange={(e) => setScoreP(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                    >
                      <option value="">Unrated</option>
                      {CRITERION_OPTIONS.map((val) => (
                        <option key={val} value={val}>
                          {val.toFixed(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Feedback Text: Strengths & Improvement Priorities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    🌟 Candidate Strengths
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Natural self-correction; effective use of idiom and topic collocations..."
                    value={formStrengths}
                    onChange={(e) => setFormStrengths(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    🎯 Key Improvement Priorities
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Work on sentence stress on content words; reduce repetition of basic linkers..."
                    value={formPriorities}
                    onChange={(e) => setFormPriorities(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Optional Comments by Part */}
              <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
                <span className="text-xs font-semibold text-slate-700 block">
                  Optional Comments by Part
                </span>
                <input
                  type="text"
                  placeholder="Part 1 note (Intro & general topics)"
                  value={formPart1Comment}
                  onChange={(e) => setFormPart1Comment(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Part 2 note (Cue card & 2-minute turn)"
                  value={formPart2Comment}
                  onChange={(e) => setFormPart2Comment(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Part 3 note (Two-way abstract discussion)"
                  value={formPart3Comment}
                  onChange={(e) => setFormPart3Comment(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                />
              </div>

              {/* Teacher Private Notes */}
              <div>
                <label className="block text-xs font-semibold text-amber-900 mb-1 flex items-center space-x-1.5">
                  <span>🔒 Teacher Confidential Notes (Hidden from Learner)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Private diagnostic or behavioural notes for teaching team only..."
                  value={formPrivateNotes}
                  onChange={(e) => setFormPrivateNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-amber-300 bg-amber-50/50 rounded-lg text-xs"
                />
              </div>

              {/* Audio Recording (Optional Cloudinary Upload) */}
              <div className="space-y-2">
                <CloudinaryMediaUploader
                  mediaType="audio"
                  label="Candidate Audio Recording (Cloudinary)"
                  helperText="Upload candidate mock speaking recording (MP3, WAV, WebM) to Cloudinary"
                  currentUrl={formRecordingUrl}
                  folder="ielts/speaking/assessments"
                  onUploadSuccess={(url) => {
                    setFormRecordingUrl(url);
                    if (url) setFormRetentionAck(true);
                  }}
                  onClear={() => {
                    setFormRecordingUrl('');
                  }}
                />
                {formRecordingUrl && (
                  <label className="flex items-center space-x-2 text-xs text-slate-600 mt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formRetentionAck}
                      onChange={(e) => setFormRetentionAck(e.target.checked)}
                      className="rounded text-purple-600"
                    />
                    <span>
                      I acknowledge candidate disclosure and the platform 90-day retention/deletion policy for recordings.
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowRecordModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={formSubmitting}
                onClick={() => handleSaveAssessment('draft')}
                className="px-4 py-2 bg-slate-200 text-slate-800 hover:bg-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                {formSubmitting ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                disabled={formSubmitting}
                onClick={() => handleSaveAssessment('released')}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                {formSubmitting ? 'Releasing...' : 'Release Feedback Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Score Correction with Mandatory Audit Log */}
      {correctionTargetAssessment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">Correct Released Speaking Scores</h2>
                <p className="text-xs text-slate-300">
                  Modifications to released scores are transparently recorded in an auditable revision log.
                </p>
              </div>
              <button
                onClick={() => setCorrectionTargetAssessment(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-700">Candidate: </span>
                <span>{correctionTargetAssessment.studentName}</span>
                <span className="ml-4 font-semibold text-slate-700">Current Band: </span>
                <span className="font-bold text-indigo-700">
                  Band {correctionTargetAssessment.overallBand?.toFixed(1) || '—'}
                </span>
              </div>

              {/* Updated Criteria Scores */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fluency & Coherence</label>
                  <select
                    value={corrFC}
                    onChange={(e) => setCorrFC(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                  >
                    {CRITERION_OPTIONS.map((val) => (
                      <option key={val} value={val}>
                        {val.toFixed(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lexical Resource</label>
                  <select
                    value={corrLR}
                    onChange={(e) => setCorrLR(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                  >
                    {CRITERION_OPTIONS.map((val) => (
                      <option key={val} value={val}>
                        {val.toFixed(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grammar Range & Acc.</label>
                  <select
                    value={corrGRA}
                    onChange={(e) => setCorrGRA(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                  >
                    {CRITERION_OPTIONS.map((val) => (
                      <option key={val} value={val}>
                        {val.toFixed(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pronunciation</label>
                  <select
                    value={corrP}
                    onChange={(e) => setCorrP(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                  >
                    {CRITERION_OPTIONS.map((val) => (
                      <option key={val} value={val}>
                        {val.toFixed(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded border border-purple-200 text-center font-bold text-purple-900">
                New Recalculated Band: Band {liveCorrectionBand.toFixed(1)}
              </div>

              {/* Mandatory Reason */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reason for Score Adjustment *
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail the specific rationale, descriptor review, or recording second-listen notes..."
                  value={corrReason}
                  onChange={(e) => setCorrReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end space-x-2 text-xs">
              <button
                onClick={() => setCorrectionTargetAssessment(null)}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
              >
                Cancel
              </button>
              <button
                disabled={corrSubmitting}
                onClick={handleSubmitCorrection}
                className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white rounded font-semibold"
              >
                {corrSubmitting ? 'Recording...' : 'Record Correction & Update Band'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {feedbackModalAssessment && (
        <SpeakingFeedbackModal
          assessment={feedbackModalAssessment}
          onClose={() => setFeedbackModalAssessment(null)}
          onOpenCorrectionModal={openCorrectionModal}
          isTeacher={true}
        />
      )}
    </div>
  );
};
