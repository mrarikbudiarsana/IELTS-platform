import React, { useState, useEffect } from 'react';
import {
  ReadingTest,
  ReadingTestVersion,
  ReadingPassage,
  QuestionGroup,
  ReadingQuestionType,
  ReadingTestType,
  TestMode,
} from '../types';
import { api } from '../api';
import {
  Save,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  FileText,
  ListOrdered,
  Sparkles,
} from 'lucide-react';
import { CloudinaryMediaUploader } from '../components/CloudinaryMediaUploader';
import { ReadingPdfImporter } from '../components/ReadingPdfImporter';


interface TestEditorViewProps {
  testId?: string;
  versionId?: string;
  onBack: () => void;
  onPreview: (testId: string) => void;
}

export const TestEditorView: React.FC<TestEditorViewProps> = ({
  testId,
  versionId,
  onBack,
  onPreview,
}) => {
  const isEditing = !!testId;

  // Form State
  const [title, setTitle] = useState('New IELTS Reading Practice Test');
  const [testType, setTestType] = useState<ReadingTestType>('academic');
  const [category, setCategory] = useState<TestMode>('practice');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(60);

  const [passages, setPassages] = useState<ReadingPassage[]>([
    {
      id: 'p1',
      passageNumber: 1,
      title: 'Sample Reading Passage 1',
      subtitle: 'An introduction to modern engineering',
      paragraphs: [
        { id: 'para_1', label: 'A', content: 'First paragraph explaining the background concept.' },
        { id: 'para_2', label: 'B', content: 'Second paragraph presenting empirical field trials.' },
      ],
    },
  ]);

  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>([
    {
      id: 'g1',
      passageId: 'p1',
      questionType: 'true_false_not_given',
      title: 'Questions 1–2',
      instructions: 'Do the following statements agree with the information in Passage 1?\nWrite TRUE, FALSE, or NOT GIVEN.',
      startQuestionNumber: 1,
      endQuestionNumber: 2,
      questions: [
        {
          id: 'q1',
          questionNumber: 1,
          prompt: 'The background concept was introduced in the first phase.',
          answerKey: 'TRUE',
          explanation: 'Paragraph A confirms this background.',
          paragraphRef: 'A',
        },
        {
          id: 'q2',
          questionNumber: 2,
          prompt: 'The field trials failed due to severe weather.',
          answerKey: 'FALSE',
          explanation: 'Paragraph B indicates trials were successful.',
          paragraphRef: 'B',
        },
      ],
    },
  ]);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Load existing test if editing
  useEffect(() => {
    if (testId) {
      loadTest();
    }
  }, [testId, versionId]);

  const loadTest = async () => {
    try {
      const res = await api.getTest(testId!);
      setTitle(res.test.title);
      setTestType(res.test.testType);
      setCategory(res.test.category);
      setTimeLimitMinutes(res.test.timeLimitMinutes);
      setPassages(res.version.passages || []);
      setQuestionGroups(res.version.questionGroups || []);
    } catch (err) {
      console.error('Failed to load test for editing', err);
    }
  };

  // Client-side quick validation check
  useEffect(() => {
    const errors: string[] = [];
    if (!title.trim()) errors.push('Title cannot be empty');
    if (passages.length === 0) errors.push('At least one reading passage is required');
    if (questionGroups.length === 0) errors.push('At least one question group is required');

    let totalQ = 0;
    const seen = new Set<number>();
    for (const g of questionGroups) {
      for (const q of g.questions) {
        totalQ++;
        if (seen.has(q.questionNumber)) {
          errors.push(`Duplicate question number ${q.questionNumber}`);
        }
        seen.add(q.questionNumber);

        if (!q.answerKey || (typeof q.answerKey === 'string' && !q.answerKey.trim()) || (Array.isArray(q.answerKey) && (!q.answerKey.length || q.answerKey.some(answer => !answer.trim())))) {
          errors.push(`Question ${q.questionNumber} is missing an answer key`);
        }
      }
    }

    for (const group of questionGroups) {
      if (group.questionType === 'diagram_completion' && !group.diagramData?.imageUrl) {
        errors.push(`${group.title}: Upload the original diagram image before publishing`);
      }
    }

    for (let i = 1; i <= totalQ; i++) {
      if (!seen.has(i)) {
        errors.push(`Missing question ${i} in sequence (1 to ${totalQ})`);
      }
    }

    setValidationErrors(errors);
  }, [title, passages, questionGroups]);

  // Handle Save Draft
  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(null);
    try {
      if (isEditing && versionId) {
        await api.updateDraft(testId, versionId, {
          title,
          passages,
          questionGroups,
          timeLimitMinutes,
        });
        setSavedSuccess('Draft saved successfully!');
      } else {
        const res = await api.createTest({
          title,
          testType,
          category,
          timeLimitMinutes,
          passages,
          questionGroups,
        });
        setSavedSuccess('Test created successfully!');
        setTimeout(() => onBack(), 1200);
      }
      return true;
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
      return false;
    } finally {
      setSaving(false);
      setTimeout(() => setSavedSuccess(null), 3000);
    }
  };

  // Handle Publish
  const handlePublish = async () => {
    if (validationErrors.length > 0) {
      alert(`Cannot publish. Please resolve errors first:\n- ${validationErrors.join('\n- ')}`);
      return;
    }
    try {
      if (!await handleSave()) return;
      if (testId && versionId) {
        await api.publishVersion(testId, versionId);
        alert('Test validated and published successfully!');
        onBack();
      }
    } catch (err: any) {
      alert(`Publish error: ${err.message}`);
    }
  };

  // Add new passage
  const addPassage = () => {
    const num = passages.length + 1;
    setPassages([
      ...passages,
      {
        id: `p${num}`,
        passageNumber: num,
        title: `Reading Passage ${num}`,
        paragraphs: [{ id: `p${num}_a`, label: 'A', content: 'Enter text here...' }],
      },
    ]);
  };

  // Add question to group
  const addQuestionToGroup = (groupIndex: number) => {
    // Find next question number
    let maxNum = 0;
    for (const g of questionGroups) {
      for (const q of g.questions) {
        if (q.questionNumber > maxNum) maxNum = q.questionNumber;
      }
    }
    const nextNum = maxNum + 1;

    const updatedGroups = [...questionGroups];
    const targetGroup = updatedGroups[groupIndex];
    targetGroup.questions.push({
      id: `q_${Date.now()}`,
      questionNumber: nextNum,
      prompt: `Question prompt for ${nextNum}`,
      answerKey: 'TRUE',
      explanation: 'Explanation for question ' + nextNum,
    });
    targetGroup.endQuestionNumber = nextNum;
    setQuestionGroups(updatedGroups);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {isEditing ? 'Edit Reading Test' : 'Create New Reading Test'}
            </h1>
            <p className="text-xs text-slate-500">
              Connect passages, instructions, question groups, answer keys, and explanations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {testId && (
            <button
              onClick={() => onPreview(testId)}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Student View
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>

          {isEditing && (
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Publish Version
            </button>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{savedSuccess}</span>
        </div>
      )}

      <ReadingPdfImporter disabled={saving} onApply={result => {
        setTitle(result.title);
        setTestType(result.testType);
        setPassages(result.passages);
        setQuestionGroups(result.questionGroups);
        setSavedSuccess(null);
      }} />

      {/* VALIDATION PRE-CHECK BANNER */}
      <div className="mb-8 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pre-Publication Validation Checklist
          </span>
          {validationErrors.length === 0 ? (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Ready to Publish
            </span>
          ) : (
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> {validationErrors.length} Unresolved Issues
            </span>
          )}
        </div>

        {validationErrors.length > 0 ? (
          <ul className="text-xs text-rose-700 list-disc list-inside space-y-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-slate-600">
            All continuous numbering, passages, and answer keys verified.
          </div>
        )}
      </div>

      {/* METADATA FORM */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs mb-8 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
          1. Test Configuration
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Test Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Module
            </label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-medium"
            >
              <option value="academic">Academic Reading</option>
              <option value="general">General Training Reading</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Test Mode & Time Limit
            </label>
            <div className="flex gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-medium"
              >
                <option value="practice">Practice Set</option>
                <option value="mock">Full Mock Exam</option>
              </select>
              <input
                type="number"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                className="w-20 px-2 py-2 border border-slate-300 rounded-lg text-sm text-center font-bold"
                title="Time limit in minutes"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PASSAGES SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs mb-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            2. Reading Passages / Sections ({passages.length})
          </h2>
          <button
            onClick={addPassage}
            className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Passage
          </button>
        </div>

        {passages.map((p, pIdx) => (
          <div key={p.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded">
                Passage {p.passageNumber}
              </span>
              {passages.length > 1 && (
                <button
                  onClick={() => setPassages(passages.filter((_, idx) => idx !== pIdx))}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Delete Passage"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Passage Title</label>
                <input
                  type="text"
                  value={p.title}
                  onChange={(e) => {
                    const updated = [...passages];
                    updated[pIdx].title = e.target.value;
                    setPassages(updated);
                  }}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Subtitle / Context</label>
                <input
                  type="text"
                  value={p.subtitle || ''}
                  onChange={(e) => {
                    const updated = [...passages];
                    updated[pIdx].subtitle = e.target.value;
                    setPassages(updated);
                  }}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-sm bg-white"
                />
              </div>
            </div>

            {/* Paragraphs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Paragraphs ({p.paragraphs?.length || 0}):
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...passages];
                    const count = updated[pIdx].paragraphs?.length || 0;
                    const nextChar = count < 26 ? String.fromCharCode(65 + count) : String(count + 1);
                    if (!updated[pIdx].paragraphs) updated[pIdx].paragraphs = [];
                    updated[pIdx].paragraphs.push({
                      id: `para_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                      label: nextChar,
                      content: '',
                    });
                    setPassages(updated);
                  }}
                  className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Paragraph
                </button>
              </div>

              {p.paragraphs?.map((para, paraIdx) => (
                <div key={para.id || paraIdx} className="flex gap-2 items-start bg-white p-2 rounded-lg border border-slate-200">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Label</span>
                    <input
                      type="text"
                      value={para.label}
                      placeholder={String.fromCharCode(65 + paraIdx)}
                      onChange={(e) => {
                        const updated = [...passages];
                        updated[pIdx].paragraphs[paraIdx].label = e.target.value;
                        setPassages(updated);
                      }}
                      className="w-12 px-2 py-1.5 border border-slate-300 rounded-md text-sm text-center font-bold bg-slate-50 focus:bg-white"
                      title="Paragraph Label (e.g. A, B, 1, 2)"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Paragraph Text</div>
                    <textarea
                      rows={2}
                      value={para.content}
                      placeholder="Enter paragraph content..."
                      onChange={(e) => {
                        const updated = [...passages];
                        updated[pIdx].paragraphs[paraIdx].content = e.target.value;
                        setPassages(updated);
                      }}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-sm bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-5">
                    <button
                      type="button"
                      disabled={p.paragraphs.length <= 1}
                      onClick={() => {
                        if (p.paragraphs.length <= 1) return;
                        const updated = [...passages];
                        updated[pIdx].paragraphs = updated[pIdx].paragraphs.filter((_, idx) => idx !== paraIdx);
                        setPassages(updated);
                      }}
                      className={`p-1.5 rounded-md transition-colors ${
                        p.paragraphs.length <= 1
                          ? 'text-slate-200 cursor-not-allowed'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      }`}
                      title={p.paragraphs.length <= 1 ? 'Passage must have at least one paragraph' : 'Remove this paragraph'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {(!p.paragraphs || p.paragraphs.length === 0) && (
                <div className="text-center py-4 text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  No paragraphs in this passage. Click "+ Add Paragraph" above to add one.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* QUESTION GROUPS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs mb-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            3. Question Groups & Marking Rules ({questionGroups.length})
          </h2>
        </div>

        {questionGroups.map((group, gIdx) => (
          <div key={group.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                Group {gIdx + 1}
              </span>
              <button
                onClick={() => setQuestionGroups(questionGroups.filter((_, idx) => idx !== gIdx))}
                className="text-slate-400 hover:text-rose-600 p-1"
                title="Delete Question Group"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Question Type</label>
                <select
                  value={group.questionType}
                  onChange={(e) => {
                    const updated = [...questionGroups];
                    updated[gIdx].questionType = e.target.value as ReadingQuestionType;
                    setQuestionGroups(updated);
                  }}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs font-semibold bg-white"
                >
                  <option value="true_false_not_given">True / False / Not Given</option>
                  <option value="yes_no_not_given">Yes / No / Not Given</option>
                  <option value="multiple_choice_single">Multiple Choice (Single)</option>
                  <option value="multiple_choice_multi">Multiple Choice (Multi-Select)</option>
                  <option value="matching_headings">Matching Headings</option>
                  <option value="matching_information">Matching Information</option>
                  <option value="matching_features">Matching Features</option>
                  <option value="matching_sentence_endings">Matching Sentence Endings</option>
                  <option value="sentence_completion">Sentence Completion</option>
                  <option value="summary_completion_words">Summary Completion (Passage Words)</option>
                  <option value="summary_completion_options">Summary Completion (Options List)</option>
                  <option value="note_completion">Note Completion</option>
                  <option value="table_completion">Table Completion</option>
                  <option value="flow_chart_completion">Flow-Chart Completion</option>
                  <option value="diagram_completion">Diagram Label Completion</option>
                  <option value="short_answer">Short-Answer Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Group Title</label>
                <input
                  type="text"
                  value={group.title}
                  onChange={(e) => {
                    const updated = [...questionGroups];
                    updated[gIdx].title = e.target.value;
                    setQuestionGroups(updated);
                  }}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Word/Number Limit Rule</label>
                <input
                  type="text"
                  value={group.wordLimitRule || ''}
                  placeholder="NO MORE THAN TWO WORDS"
                  onChange={(e) => {
                    const updated = [...questionGroups];
                    updated[gIdx].wordLimitRule = e.target.value;
                    setQuestionGroups(updated);
                  }}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Instructions for Student</label>
              <textarea
                rows={2}
                value={group.instructions}
                onChange={(e) => {
                  const updated = [...questionGroups];
                  updated[gIdx].instructions = e.target.value;
                  setQuestionGroups(updated);
                }}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
              />
            </div>

            {/* Diagram Image Uploader for Diagram Label Completion */}
            {group.contentWithGaps !== undefined && (
              <label className="block text-xs font-bold text-slate-600">Summary / Notes (use [question number] for blanks)
                <textarea rows={5} value={group.contentWithGaps} className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm font-normal"
                  onChange={e => setQuestionGroups(questionGroups.map((item, i) => i === gIdx ? { ...item, contentWithGaps: e.target.value } : item))} />
              </label>
            )}
            {group.optionsList && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-600">Group Options</p>
                {group.optionsList.map((option, optionIndex) => <label key={optionIndex} className="flex items-center gap-2 text-xs font-bold">
                  {option.key}
                  <input value={option.text} className="flex-1 rounded-md border border-slate-300 p-2 font-normal" onChange={e => {
                    setQuestionGroups(questionGroups.map((item, i) => i === gIdx ? { ...item, optionsList: item.optionsList!.map((entry, j) => j === optionIndex ? { ...entry, text: e.target.value } : entry) } : item));
                  }} />
                </label>)}
              </div>
            )}
            {group.questionType === 'diagram_completion' && (
              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                <CloudinaryMediaUploader
                  mediaType="image"
                  label="Diagram Image (Cloudinary)"
                  helperText="Upload diagram or technical illustration (PNG, JPG, SVG) for label completion"
                  currentUrl={group.diagramData?.imageUrl}
                  folder="ielts/reading/diagrams"
                  onUploadSuccess={(url) => {
                    const updated = [...questionGroups];
                    updated[gIdx] = {
                      ...updated[gIdx],
                      diagramData: {
                        imageUrl: url,
                        caption: updated[gIdx].diagramData?.caption || updated[gIdx].title,
                        labels: updated[gIdx].diagramData?.labels || [],
                      },
                    };
                    setQuestionGroups(updated);
                  }}
                  onClear={() => {
                    const updated = [...questionGroups];
                    updated[gIdx] = {
                      ...updated[gIdx],
                      diagramData: undefined,
                    };
                    setQuestionGroups(updated);
                  }}
                />
              </div>
            )}

            {/* Questions list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Questions in Group ({group.questions.length}):
                </span>
                <button
                  onClick={() => addQuestionToGroup(gIdx)}
                  className="text-xs text-indigo-600 font-bold hover:text-indigo-800"
                >
                  + Add Question
                </button>
              </div>

              {group.questions.map((q, qIdx) => (
                <div key={q.id} className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-indigo-600 text-xs">Q{q.questionNumber}</span>
                    <input
                      type="text"
                      value={q.prompt}
                      placeholder="Question prompt"
                      onChange={(e) => {
                        const updated = [...questionGroups];
                        updated[gIdx].questions[qIdx].prompt = e.target.value;
                        setQuestionGroups(updated);
                      }}
                      className="flex-1 px-2.5 py-1 border border-slate-300 rounded text-xs font-medium"
                    />
                    <input
                      type="text"
                      value={Array.isArray(q.answerKey) ? q.answerKey.join(',') : q.answerKey}
                      placeholder="Answer key (e.g. TRUE / B / solar)"
                      onChange={(e) => {
                        const updated = [...questionGroups];
                        updated[gIdx].questions[qIdx].answerKey = Array.isArray(q.answerKey) || group.questionType === 'multiple_choice_multi'
                          ? e.target.value.split(',').map(value => value.trim()).filter(Boolean)
                          : e.target.value;
                        setQuestionGroups(updated);
                      }}
                      className="w-48 px-2.5 py-1 border border-emerald-300 bg-emerald-50/40 rounded text-xs font-bold text-emerald-900"
                    />
                  </div>

                  {q.options && <div className="space-y-1">
                    {q.options.map((option, optionIndex) => <label key={optionIndex} className="flex items-center gap-2 text-xs font-bold">
                      {option.key}
                      <input value={option.text} className="flex-1 rounded border border-slate-200 px-2 py-1 font-normal" onChange={e => {
                        setQuestionGroups(questionGroups.map((item, i) => i === gIdx ? { ...item, questions: item.questions.map((question, j) => j === qIdx ? { ...question, options: question.options!.map((entry, k) => k === optionIndex ? { ...entry, text: e.target.value } : entry) } : question) } : item));
                      }} />
                    </label>)}
                  </div>}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={q.explanation || ''}
                      placeholder="Teacher explanation for review"
                      onChange={(e) => {
                        const updated = [...questionGroups];
                        updated[gIdx].questions[qIdx].explanation = e.target.value;
                        setQuestionGroups(updated);
                      }}
                      className="flex-1 px-2.5 py-1 border border-slate-200 rounded text-[11px] text-slate-600"
                    />
                    <input
                      type="text"
                      value={q.evidenceQuote || ''}
                      placeholder="Passage evidence quote"
                      onChange={(e) => {
                        const updated = [...questionGroups];
                        updated[gIdx].questions[qIdx].evidenceQuote = e.target.value;
                        setQuestionGroups(updated);
                      }}
                      className="flex-1 px-2.5 py-1 border border-slate-200 rounded text-[11px] text-slate-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
