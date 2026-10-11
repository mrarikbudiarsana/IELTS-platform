import React, { useState, useEffect } from 'react';
import {
  ListeningPart,
  QuestionGroup,
  ListeningQuestionType,
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
  Headphones,
  Music,
  ListOrdered,
} from 'lucide-react';
import { CloudinaryMediaUploader } from '../components/CloudinaryMediaUploader';


interface ListeningEditorViewProps {
  testId?: string;
  versionId?: string;
  onBack: () => void;
  onPreview: (testId: string) => void;
}

export const ListeningEditorView: React.FC<ListeningEditorViewProps> = ({
  testId,
  versionId,
  onBack,
  onPreview,
}) => {
  const isEditing = !!testId;

  // Metadata
  const [title, setTitle] = useState('New IELTS Listening Test');
  const [category, setCategory] = useState<TestMode>('practice');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(35);
  const [containsIntroPauses, setContainsIntroPauses] = useState(true);

  // Parts state
  const [parts, setParts] = useState<ListeningPart[]>([
    {
      id: 'part_1',
      partNumber: 1,
      title: 'Customer Inquiry / Daily Conversation',
      context: 'A conversation between two speakers in an everyday social context.',
      audioUrl: '/audio/listening_part1_car_rental.wav',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: 'Customer car hire reservation discussion.',
    },
  ]);

  // Question groups state (flat list, each group has partNumber)
  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>([
    {
      id: 'grp_1',
      partNumber: 1,
      questionType: 'form_completion',
      title: 'Questions 1–2',
      instructions: 'Complete the form below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimitRule: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      startQuestionNumber: 1,
      endQuestionNumber: 2,
      questions: [
        {
          id: 'q1',
          questionNumber: 1,
          prompt: 'Customer Surname',
          answerKey: 'THOMPSON',
          acceptedAlternatives: ['Thompson'],
          explanation: 'Spelled out letter by letter: T-H-O-M-P-S-O-N.',
          transcriptExcerpt: 'My surname is Thompson, that is T-H-O-M-P-S-O-N.',
          audioTimestampSeconds: 25,
        },
        {
          id: 'q2',
          questionNumber: 2,
          prompt: 'Contact Telephone',
          answerKey: '07700900123',
          acceptedAlternatives: ['07700 900 123'],
          explanation: 'The customer confirms mobile number 07700 900 123.',
          transcriptExcerpt: 'My mobile is 07700 900 123.',
          audioTimestampSeconds: 45,
        },
      ],
    },
  ]);

  // Loading & validation state
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activePartIdx, setActivePartIdx] = useState(0);

  // Active loaded version details
  const [currentTestId, setCurrentTestId] = useState<string | undefined>(testId);
  const [currentVersionId, setCurrentVersionId] = useState<string | undefined>(versionId);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (testId) {
      loadTestContent(testId);
    }
  }, [testId]);

  const loadTestContent = async (id: string) => {
    setLoading(true);
    try {
      const res = await api.getListeningTest(id);
      setTitle(res.test.title);
      setCategory(res.test.category);
      setTimeLimitMinutes(res.test.timeLimitMinutes);
      setParts(res.version.parts || []);
      setQuestionGroups(res.version.questionGroups || []);
      setCurrentTestId(res.test.id);
      setCurrentVersionId(res.version.id);
      setIsPublished(res.version.status === 'published');
    } catch (err) {
      console.error('Failed to load listening test editor data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setValidationErrors([]);
    setSavedSuccess(false);

    try {
      const payload = {
        title,
        category,
        timeLimitMinutes: Number(timeLimitMinutes),
        audioConfig: {
          audioMode: 'part_audios',
          postTestCheckTimeSeconds: 120,
        },
        parts: parts.map((p) => ({
          ...p,
          containsIntroPauses,
        })),
        questionGroups,
      };

      if (currentTestId && currentVersionId) {
        const res = await api.updateListeningDraft(currentTestId, currentVersionId, payload);
        if (res.errors && res.errors.length > 0) {
          setValidationErrors(res.errors);
        } else {
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 3000);
        }
      } else {
        const res = await api.createListeningTest(payload);
        setCurrentTestId(res.test.id);
        setCurrentVersionId(res.version.id);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save test draft');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!currentTestId || !currentVersionId) {
      alert('Please save the draft first.');
      return;
    }

    setLoading(true);
    setValidationErrors([]);
    try {
      await api.publishListeningVersion(currentTestId, currentVersionId);
      setIsPublished(true);
      alert('Version published successfully! It is now live in the student catalogue.');
    } catch (err: any) {
      if (err.errors) {
        setValidationErrors(err.errors);
      } else {
        alert(err.message || 'Publication check failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add / remove part
  const addPart = () => {
    const nextPartNum = parts.length + 1;
    if (nextPartNum > 4) {
      alert('IELTS Listening tests contain a maximum of 4 parts.');
      return;
    }
    const newPart: ListeningPart = {
      id: `part_${nextPartNum}`,
      partNumber: nextPartNum,
      title: `Part ${nextPartNum}`,
      context: `Section ${nextPartNum} recording and questions`,
      audioUrl: `/audio/listening_part${nextPartNum}.wav`,
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: '',
    };
    setParts([...parts, newPart]);
    setActivePartIdx(parts.length);
  };

  const removePart = (idx: number) => {
    if (parts.length <= 1) {
      alert('At least one listening part is required.');
      return;
    }
    const removedPartNum = parts[idx].partNumber;
    const updatedParts = parts.filter((_, i) => i !== idx).map((p, i) => ({
      ...p,
      partNumber: i + 1,
    }));
    // Also remove groups belonging to this part
    const updatedGroups = questionGroups.filter((g) => g.partNumber !== removedPartNum);
    setParts(updatedParts);
    setQuestionGroups(updatedGroups);
    setActivePartIdx(Math.max(0, idx - 1));
  };

  // Add question group to current active part
  const addQuestionGroup = () => {
    const activePart = parts[activePartIdx];
    if (!activePart) return;

    // Find next available question number
    const allQuestions = questionGroups.flatMap((g) => g.questions);
    const nextQNum = allQuestions.length > 0 ? Math.max(...allQuestions.map((q) => q.questionNumber)) + 1 : 1;

    const newGroup: QuestionGroup = {
      id: `grp_${Date.now()}`,
      partNumber: activePart.partNumber,
      questionType: 'multiple_choice_single',
      title: `Questions ${nextQNum}–${nextQNum + 1}`,
      instructions: 'Choose the correct letter, A, B, or C.',
      startQuestionNumber: nextQNum,
      endQuestionNumber: nextQNum + 1,
      optionsList: [
        { key: 'A', text: 'First option' },
        { key: 'B', text: 'Second option' },
        { key: 'C', text: 'Third option' },
      ],
      questions: [
        {
          id: `q_${Date.now()}_1`,
          questionNumber: nextQNum,
          prompt: 'What was the main outcome discussed by the speaker?',
          answerKey: 'A',
          explanation: 'The speaker directly confirms option A.',
          audioTimestampSeconds: 30,
        },
        {
          id: `q_${Date.now()}_2`,
          questionNumber: nextQNum + 1,
          prompt: 'Which future recommendation was emphasized?',
          answerKey: 'B',
          explanation: 'Option B is highlighted in the concluding remarks.',
          audioTimestampSeconds: 90,
        },
      ],
    };

    setQuestionGroups([...questionGroups, newGroup]);
  };

  const removeQuestionGroup = (groupId: string) => {
    setQuestionGroups(questionGroups.filter((g) => g.id !== groupId));
  };

  const activePart = parts[activePartIdx];
  const activePartGroups = questionGroups.filter((g) => g.partNumber === activePart?.partNumber);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
              <Headphones className="w-4 h-4" />
              Teacher Authoring Suite
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {isEditing ? 'Edit IELTS Listening Test' : 'Create New Listening Test'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentTestId && (
            <button
              onClick={() => onPreview(currentTestId)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              Student Preview
            </button>
          )}

          <button
            onClick={handleSaveDraft}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-slate-300" />
            {loading ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            onClick={handlePublish}
            disabled={loading || isPublished}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all ${
              isPublished
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {isPublished ? 'Published' : 'Publish Version'}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {savedSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Draft saved successfully! You can preview or publish this test version.</span>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs">
          <div className="font-bold flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Publication Validation Checks Failed ({validationErrors.length} issues):
          </div>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* METADATA FORM */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs mb-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Music className="w-4 h-4 text-indigo-600" />
          Test Configuration & Audio Policy
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Test Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              placeholder="e.g. Official Listening Mock Test 1"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Format Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TestMode)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
            >
              <option value="practice">Targeted Practice Set</option>
              <option value="mock">Full 4-Part Mock Exam</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Time Limit (Minutes)</label>
            <input
              type="number"
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Standard CD IELTS Listening is ~30–34 mins audio playback + exactly 2 minutes final checking.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <input
              type="checkbox"
              id="containsIntroPauses"
              checked={containsIntroPauses}
              onChange={(e) => setContainsIntroPauses(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <label htmlFor="containsIntroPauses" className="text-xs text-slate-700">
              <strong className="block text-slate-900">Audio Already Contains Pauses & Instructions</strong>
              Avoid adding synthetic delays; recording natively includes reading & checking intervals.
            </label>
          </div>
        </div>
      </div>

      {/* PARTS TABS */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {parts.map((p, idx) => {
            const countForPart = questionGroups
              .filter((g) => g.partNumber === p.partNumber)
              .reduce((acc, g) => acc + g.questions.length, 0);

            return (
              <button
                key={p.id}
                onClick={() => setActivePartIdx(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activePartIdx === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Part {p.partNumber}</span>
                <span className="text-[10px] opacity-80">({countForPart} Qs)</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={addPart}
          className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-bold text-xs flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Part
        </button>
      </div>

      {/* ACTIVE PART EDITOR */}
      {activePart && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs mb-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="text-base font-extrabold text-slate-900">
              Part {activePart.partNumber} Settings & Audio Asset
            </div>
            {parts.length > 1 && (
              <button
                onClick={() => removePart(activePartIdx)}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Part {activePart.partNumber}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Part Title</label>
              <input
                type="text"
                value={activePart.title}
                onChange={(e) => {
                  const updated = [...parts];
                  updated[activePartIdx].title = e.target.value;
                  setParts(updated);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <CloudinaryMediaUploader
                mediaType="audio"
                label={`Part ${activePart.partNumber} Audio Track (Cloudinary)`}
                helperText="Upload official MP3 or WAV audio track directly to Cloudinary"
                currentUrl={activePart.audioUrl}
                folder="ielts/listening/audio"
                onUploadSuccess={(url) => {
                  const updated = [...parts];
                  updated[activePartIdx].audioUrl = url;
                  setParts(updated);
                }}
                onClear={() => {
                  const updated = [...parts];
                  updated[activePartIdx].audioUrl = '';
                  setParts(updated);
                }}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 mb-1">Section Context / Rubric</label>
            <textarea
              rows={2}
              value={activePart.context || ''}
              onChange={(e) => {
                const updated = [...parts];
                updated[activePartIdx].context = e.target.value;
                setParts(updated);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          {/* QUESTION GROUPS IN THIS PART */}
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-indigo-600" />
                Question Groups in Part {activePart.partNumber} ({activePartGroups.length})
              </h3>
              <button
                onClick={addQuestionGroup}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Question Group
              </button>
            </div>

            {/* List Question Groups */}
            <div className="space-y-6">
              {activePartGroups.map((group, gIdx) => (
                <div key={group.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black uppercase bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-md">
                        Group {gIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={group.title}
                        onChange={(e) => {
                          const updated = questionGroups.map((g) =>
                            g.id === group.id ? { ...g, title: e.target.value } : g
                          );
                          setQuestionGroups(updated);
                        }}
                        className="font-bold text-sm bg-transparent border-b border-dashed border-slate-300 focus:border-indigo-500 outline-hidden"
                      />
                    </div>

                    <button
                      onClick={() => removeQuestionGroup(group.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Group
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Question Type</label>
                      <select
                        value={group.questionType}
                        onChange={(e) => {
                          const updated = questionGroups.map((g) =>
                            g.id === group.id
                              ? { ...g, questionType: e.target.value as ListeningQuestionType }
                              : g
                          );
                          setQuestionGroups(updated);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-hidden capitalize"
                      >
                        <option value="form_completion">Form Completion</option>
                        <option value="note_completion">Note Completion</option>
                        <option value="table_completion">Table Completion</option>
                        <option value="flow_chart_completion">Flow-chart Completion</option>
                        <option value="summary_completion">Summary Completion</option>
                        <option value="sentence_completion">Sentence Completion</option>
                        <option value="plan_map_diagram_labelling">Plan, Map & Diagram Labelling</option>
                        <option value="matching">Matching</option>
                        <option value="multiple_choice_single">Multiple Choice (Single Answer)</option>
                        <option value="multiple_choice_multiple">Multiple Choice (Multiple Answers)</option>
                        <option value="short_answer">Short-answer Questions</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Word & Number Limit Rule</label>
                      <input
                        type="text"
                        value={group.wordLimitRule || ''}
                        onChange={(e) => {
                          const updated = questionGroups.map((g) =>
                            g.id === group.id ? { ...g, wordLimitRule: e.target.value } : g
                          );
                          setQuestionGroups(updated);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                        placeholder="NO MORE THAN TWO WORDS AND/OR A NUMBER"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Instructions Prompt</label>
                    <textarea
                      rows={2}
                      value={group.instructions}
                      onChange={(e) => {
                        const updated = questionGroups.map((g) =>
                          g.id === group.id ? { ...g, instructions: e.target.value } : g
                        );
                        setQuestionGroups(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>

                  {/* Map / Diagram Image Uploader for Labelling Question Groups */}
                  {group.questionType === 'plan_map_diagram_labelling' && (
                    <div className="mb-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
                      <CloudinaryMediaUploader
                        mediaType="image"
                        label="Map / Plan / Diagram Picture (Cloudinary)"
                        helperText="Upload map or diagram image (PNG, JPG, SVG) for questions"
                        currentUrl={group.mapData?.imageUrl || group.diagramData?.imageUrl}
                        folder="ielts/listening/diagrams"
                        onUploadSuccess={(url) => {
                          const updated = questionGroups.map((g) =>
                            g.id === group.id
                              ? {
                                  ...g,
                                  mapData: {
                                    imageUrl: url,
                                    caption: g.mapData?.caption || g.title,
                                    locations: g.mapData?.locations || [],
                                  },
                                }
                              : g
                          );
                          setQuestionGroups(updated);
                        }}
                        onClear={() => {
                          const updated = questionGroups.map((g) =>
                            g.id === group.id ? { ...g, mapData: undefined } : g
                          );
                          setQuestionGroups(updated);
                        }}
                      />
                    </div>
                  )}

                  {/* Questions inside Group */}
                  <div className="space-y-3 mt-4">
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Numbered Questions</div>
                    {group.questions.map((q, qIdx) => (
                      <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-7 h-7 bg-indigo-600 text-white rounded-lg text-xs font-black flex items-center justify-center shrink-0">
                            {q.questionNumber}
                          </span>
                          <input
                            type="text"
                            value={q.prompt}
                            onChange={(e) => {
                              const updatedQuestions = [...group.questions];
                              updatedQuestions[qIdx] = { ...updatedQuestions[qIdx], prompt: e.target.value };
                              const updatedGroups = questionGroups.map((g) =>
                                g.id === group.id ? { ...g, questions: updatedQuestions } : g
                              );
                              setQuestionGroups(updatedGroups);
                            }}
                            className="w-full text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 focus:border-indigo-500 outline-hidden"
                            placeholder="Question prompt or label"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-2">
                          <div>
                            <span className="font-semibold text-slate-600">Answer Key:</span>
                            <input
                              type="text"
                              value={Array.isArray(q.answerKey) ? q.answerKey.join(', ') : q.answerKey}
                              onChange={(e) => {
                                const updatedQuestions = [...group.questions];
                                updatedQuestions[qIdx] = { ...updatedQuestions[qIdx], answerKey: e.target.value };
                                const updatedGroups = questionGroups.map((g) =>
                                  g.id === group.id ? { ...g, questions: updatedQuestions } : g
                                );
                                setQuestionGroups(updatedGroups);
                              }}
                              className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-emerald-800"
                            />
                          </div>

                          <div>
                            <span className="font-semibold text-slate-600">Audio Timestamp (seconds):</span>
                            <input
                              type="number"
                              value={q.audioTimestampSeconds || 0}
                              onChange={(e) => {
                                const updatedQuestions = [...group.questions];
                                updatedQuestions[qIdx] = {
                                  ...updatedQuestions[qIdx],
                                  audioTimestampSeconds: Number(e.target.value),
                                };
                                const updatedGroups = questionGroups.map((g) =>
                                  g.id === group.id ? { ...g, questions: updatedQuestions } : g
                                );
                                setQuestionGroups(updatedGroups);
                              }}
                              className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                            />
                          </div>
                        </div>

                        <div className="text-xs">
                          <span className="font-semibold text-slate-600">Transcript Evidence Excerpt:</span>
                          <input
                            type="text"
                            value={q.transcriptExcerpt || ''}
                            onChange={(e) => {
                              const updatedQuestions = [...group.questions];
                              updatedQuestions[qIdx] = {
                                ...updatedQuestions[qIdx],
                                transcriptExcerpt: e.target.value,
                              };
                              const updatedGroups = questionGroups.map((g) =>
                                g.id === group.id ? { ...g, questions: updatedQuestions } : g
                              );
                              setQuestionGroups(updatedGroups);
                            }}
                            className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                            placeholder="Exact spoken excerpt from recording"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
