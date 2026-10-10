import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  WritingTask,
  WritingTaskType,
  WritingTestType,
  WritingTaskNumber,
  WritingTaskSubtype,
} from '../types';

export const TeacherWritingEditorView: React.FC = () => {
  const [tasks, setTasks] = useState<WritingTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<WritingTask | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    taskType: WritingTaskType;
    taskNumber: WritingTaskNumber;
    testType: WritingTestType;
    subtype: WritingTaskSubtype;
    prompt: string;
    instructions: string;
    minWords: number;
    suggestedTimeMinutes: number;
    teacherVisualDescription: string;
    teacherAssessmentGuidance: string;
    modelResponse: string;
  }>({
    title: '',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'chart',
    prompt: '',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    teacherVisualDescription: '',
    teacherAssessmentGuidance: '',
    modelResponse: '',
  });

  // Allowance grant state
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantEmail, setGrantEmail] = useState('');
  const [grantAmount, setGrantAmount] = useState(5);
  const [grantNotes, setGrantNotes] = useState('Class trial allocation');
  const [grantSuccess, setGrantSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getWritingTasks();
      setTasks(res.tasks);
      if (res.tasks.length > 0 && !selectedTask) {
        setSelectedTask(res.tasks[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load writing tasks.');
    } finally {
      setLoading(false);
    }
  }

  function handleSelectTask(task: WritingTask) {
    setSelectedTask(task);
    setIsEditing(false);
    const latestVersion = task.versions?.[task.versions.length - 1];
    if (latestVersion) {
      setFormData({
        title: task.title,
        taskType: task.taskType,
        taskNumber: task.taskNumber,
        testType: task.testType,
        subtype: (latestVersion.subtype as any) || 'chart',
        prompt: latestVersion.prompt || '',
        instructions: latestVersion.instructions || '',
        minWords: latestVersion.minWords || 150,
        suggestedTimeMinutes: latestVersion.suggestedTimeMinutes || 20,
        teacherVisualDescription: latestVersion.teacherVisualDescription || '',
        teacherAssessmentGuidance: latestVersion.teacherAssessmentGuidance || '',
        modelResponse: latestVersion.modelResponse || '',
      });
    }
  }

  function handleNewTask() {
    setSelectedTask(null);
    setIsEditing(true);
    setFormData({
      title: 'New Writing Task',
      taskType: 'academic_task_1',
      taskNumber: 1,
      testType: 'academic',
      subtype: 'chart',
      prompt: '',
      instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
      minWords: 150,
      suggestedTimeMinutes: 20,
      teacherVisualDescription: '',
      teacherAssessmentGuidance: '',
      modelResponse: '',
    });
  }

  async function handleSaveDraft() {
    try {
      setError(null);
      if (selectedTask) {
        const res = await api.updateWritingDraft(selectedTask.id, formData);
        setSelectedTask(res.task);
        setSuccessMsg('Draft updated successfully.');
      } else {
        const res = await api.createWritingTask(formData);
        setSelectedTask(res.task);
        setIsEditing(false);
        setSuccessMsg('New task draft created.');
      }
      await loadTasks();
    } catch (err: any) {
      setError(err.message || 'Failed to save draft.');
    }
  }

  async function handlePublish() {
    if (!selectedTask) return;
    try {
      setError(null);
      const res = await api.publishWritingTask(selectedTask.id);
      setSelectedTask(res.task);
      setSuccessMsg('Task published successfully!');
      await loadTasks();
    } catch (err: any) {
      setError(err.message || 'Failed to publish task.');
    }
  }

  async function handleForkDraft() {
    if (!selectedTask) return;
    try {
      setError(null);
      const res = await api.forkWritingDraft(selectedTask.id);
      setSelectedTask(res.task);
      setSuccessMsg('Created new draft version.');
      await loadTasks();
    } catch (err: any) {
      setError(err.message || 'Failed to fork draft version.');
    }
  }

  async function handleArchive() {
    if (!selectedTask) return;
    try {
      setError(null);
      const res = await api.archiveWritingTask(selectedTask.id);
      setSelectedTask(res.task);
      setSuccessMsg('Task archived.');
      await loadTasks();
    } catch (err: any) {
      setError(err.message || 'Failed to archive task.');
    }
  }

  async function handleGrantAllowanceSubmit() {
    try {
      setGrantSuccess(null);
      setError(null);
      // Look up user by email or direct ID
      const usersRes = await api.getAdminUsers();
      const targetUser = usersRes.users.find(
        (u) => u.email.toLowerCase() === grantEmail.trim().toLowerCase()
      );
      if (!targetUser) {
        throw new Error(`No user found with email "${grantEmail}".`);
      }
      await api.grantWritingAllowance({
        userId: targetUser.id,
        amount: grantAmount,
        notes: grantNotes,
      });
      setGrantSuccess(`Successfully granted ${grantAmount} allowances to ${targetUser.fullName}.`);
      setGrantEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to grant allowance.');
    }
  }

  const latestVersion = selectedTask?.versions?.[selectedTask.versions.length - 1];
  const isDraft = selectedTask?.status === 'draft' || latestVersion?.status === 'draft';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            Teacher Content Editor
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            IELTS Writing Task Management & Grounding
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create Academic Task 1, GT Letters, and Task 2 Essays with verified factual grounding.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGrantModal(true)}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Grant AI Allowances
          </button>
          <button
            onClick={handleNewTask}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            + Create New Task
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold ml-2">✕</button>
        </div>
      )}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex justify-between items-center">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="font-bold ml-2">✕</button>
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Task List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2">
            Available Writing Tasks ({tasks.length})
          </h3>
          <div className="space-y-2 overflow-y-auto max-h-[70vh]">
            {tasks.map((t) => (
              <div
                key={t.id}
                onClick={() => handleSelectTask(t)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                  selectedTask?.id === t.id
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Task {t.taskNumber} ({t.testType})
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      t.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status} (v{t.currentVersionNumber})
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{t.title}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Task Editor / Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
          {selectedTask || isEditing ? (
            <>
              {/* Header bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedTask ? `Task ID: ${selectedTask.id.slice(0, 8)}...` : 'New Task Creation'}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                    {formData.title || 'Untitled Task'}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {selectedTask && isDraft && (
                    <button
                      onClick={handlePublish}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                    >
                      Publish Task
                    </button>
                  )}
                  {selectedTask && !isDraft && (
                    <button
                      onClick={handleForkDraft}
                      className="px-3.5 py-1.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold transition"
                    >
                      Fork New Draft
                    </button>
                  )}
                  <button
                    onClick={handleSaveDraft}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Global Renewable Energy Investment 2015-2025"
                  />
                </div>

                {/* Task Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Task Number
                  </label>
                  <select
                    value={formData.taskNumber}
                    onChange={(e) => {
                      const num = Number(e.target.value) as 1 | 2;
                      setFormData({
                        ...formData,
                        taskNumber: num,
                        minWords: num === 1 ? 150 : 250,
                        suggestedTimeMinutes: num === 1 ? 20 : 40,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value={1}>Task 1 (Report / Letter)</option>
                    <option value={2}>Task 2 (Discursive Essay)</option>
                  </select>
                </div>

                {/* Task Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Task Type
                  </label>
                  <select
                    value={formData.taskType}
                    onChange={(e) =>
                      setFormData({ ...formData, taskType: e.target.value as WritingTaskType })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="academic_task_1">Academic Task 1 (Data / Process)</option>
                    <option value="gt_task_1">General Training Task 1 (Letter)</option>
                    <option value="task_2">Task 2 Essay</option>
                  </select>
                </div>

                {/* Test Version */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Test Version
                  </label>
                  <select
                    value={formData.testType}
                    onChange={(e) =>
                      setFormData({ ...formData, testType: e.target.value as WritingTestType })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="academic">Academic</option>
                    <option value="general">General Training</option>
                    <option value="both">Both (Shared Task 2)</option>
                  </select>
                </div>

                {/* Min Words & Suggested Time */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Minimum Words
                  </label>
                  <input
                    type="number"
                    value={formData.minWords}
                    onChange={(e) => setFormData({ ...formData, minWords: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Suggested Time (Mins)
                  </label>
                  <input
                    type="number"
                    value={formData.suggestedTimeMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, suggestedTimeMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Instructions
                </label>
                <input
                  type="text"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Prompt
                </label>
                <textarea
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs leading-relaxed"
                  placeholder="Provide the complete instructions and essay question..."
                />
              </div>

              {/* Verified Visual Description (CRITICAL FOR TASK 1) */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-indigo-900">
                    Teacher-Verified Visual Grounding Description
                  </label>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-100/60 px-2 py-0.5 rounded">
                    Required for Academic Task 1
                  </span>
                </div>
                <p className="text-[11px] text-indigo-700/80 mb-2 leading-relaxed">
                  Provide ground-truth data points, start/end values, key comparisons, and overall trends. The AI assessment engine uses this ground truth to grade Task Achievement accurately and prevent hallucinations.
                </p>
                <textarea
                  value={formData.teacherVisualDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherVisualDescription: e.target.value })
                  }
                  rows={4}
                  className="w-full p-3 border border-indigo-200 rounded-lg text-xs bg-white text-slate-800"
                  placeholder="e.g. Verified data: Solar investment surged from $120B in 2015 to $350B in 2025. Wind increased from $100B to $250B. Hydro remained steady at $50B..."
                />
              </div>

              {/* Confidential Assessment Guidance (NEVER EXPOSED TO CANDIDATES) */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4">
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Confidential Teacher Assessment Guidance (Private)
                </label>
                <p className="text-[11px] text-amber-700 mb-2">
                  Internal notes, grading priorities, and common student errors. These notes are strictly scrubbed and NEVER displayed to candidates.
                </p>
                <textarea
                  value={formData.teacherAssessmentGuidance}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherAssessmentGuidance: e.target.value })
                  }
                  rows={3}
                  className="w-full p-3 border border-amber-200 rounded-lg text-xs bg-white text-slate-800"
                  placeholder="Internal teacher scoring notes..."
                />
              </div>

              {/* Model Response (Unlocked in review) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Band 8.5+ Model Response (Released during student review)
                </label>
                <textarea
                  value={formData.modelResponse}
                  onChange={(e) => setFormData({ ...formData, modelResponse: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs leading-relaxed"
                  placeholder="High-scoring reference essay..."
                />
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400">
              Select a writing task from the left or click "+ Create New Task" to begin authoring.
            </div>
          )}
        </div>
      </div>

      {/* Allowance Grant Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Grant AI Writing Allowances
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Allocate testing allowances for pilot cohorts, classes, or trial students without commercial billing.
            </p>

            {grantSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg">
                {grantSuccess}
              </div>
            )}

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Email
                </label>
                <input
                  type="email"
                  value={grantEmail}
                  onChange={(e) => setGrantEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Allowance Quantity (1 Task = 1 Allowance)
                </label>
                <input
                  type="number"
                  min={1}
                  value={grantAmount}
                  onChange={(e) => setGrantAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes / Allocation Purpose
                </label>
                <input
                  type="text"
                  value={grantNotes}
                  onChange={(e) => setGrantNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowGrantModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>
              <button
                onClick={handleGrantAllowanceSubmit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
              >
                Confirm Grant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
