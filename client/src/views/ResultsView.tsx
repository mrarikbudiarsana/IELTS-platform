import { formatQuestionTypeName } from '../questionTypeName';
import React, { useState, useEffect, useRef } from 'react';
import { ReadingAttempt, ReadingTestVersion, AttemptItemResult } from '../types';
import { api } from '../api';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Quote,
  HelpCircle,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  X,
  ExternalLink,
  Check,
  Search,
  Columns,
  LayoutList,
} from 'lucide-react';

interface ResultsViewProps {
  attemptId: string;
  onBackToCatalogue: () => void;
  onRetryTest: (testId: string, filter?: string) => void;
}

interface ParagraphQuoteMatch {
  questionNumber: number;
  start: number;
  end: number;
  isCorrect: boolean;
  answerDisplay: string;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  attemptId,
  onBackToCatalogue,
  onRetryTest,
}) => {
  const [attempt, setAttempt] = useState<ReadingAttempt | null>(null);
  const [testVersion, setTestVersion] = useState<ReadingTestVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [viewMode, setViewMode] = useState<'split' | 'cards'>('split');

  // Split-view passage state
  const [activePassageIdx, setActivePassageIdx] = useState(0);
  const [focusedQuestionNumber, setFocusedQuestionNumber] = useState<number | null>(null);
  const [focusedParagraphRef, setFocusedParagraphRef] = useState<string | undefined>(undefined);

  // Interactive Passage Drawer / Modal state (available when user is in Cards view or wants a pop-out)
  const [activePassageModal, setActivePassageModal] = useState<{
    passageIdx: number;
    paragraphRef?: string;
    evidenceQuote?: string;
    questionNumber?: number;
  } | null>(null);

  const paragraphRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  // When passage modal opens, scroll to the targeted paragraph if any
  useEffect(() => {
    if (activePassageModal?.paragraphRef) {
      const key = `p-${activePassageModal.passageIdx}-${activePassageModal.paragraphRef}`;
      const elem = paragraphRefs.current[key];
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }
  }, [activePassageModal]);

  const loadAttempt = async () => {
    setLoading(true);
    try {
      const res = await api.getAttempt(attemptId);
      setAttempt(res.attempt);
      setTestVersion(res.testVersion);
      if (res.testVersion?.passages?.length && res.attempt?.questionTypeFilter) {
        const matchingGroup = res.testVersion.questionGroups?.find(
          (g: any) => g.questionType === res.attempt.questionTypeFilter
        );
        if (matchingGroup?.passageId) {
          const idx = res.testVersion.passages.findIndex((p: any) => p.id === matchingGroup.passageId);
          if (idx !== -1) setActivePassageIdx(idx);
        }
      }
    } catch (err) {
      console.error('Failed to load attempt result', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !attempt) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center p-4">
        <div className="text-slate-500 font-medium flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
          Loading test results and comprehensive explanation analysis...
        </div>
      </div>
    );
  }

  const rawScore = attempt.rawScore || 0;
  const totalQuestions = attempt.totalQuestions;
  const accuracyPct = Math.round((rawScore / totalQuestions) * 100);
  const results: AttemptItemResult[] = attempt.results || [];

  const incorrectCount = results.filter((r) => !r.isCorrect).length;
  const correctCount = results.filter((r) => r.isCorrect).length;

  const filteredResults = results.filter((r) => {
    if (filter === 'incorrect') return !r.isCorrect;
    if (filter === 'correct') return r.isCorrect;
    return true;
  });

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}m ${remSecs}s`;
  };

  const getPassageIdxForQuestion = (questionNumber: number): number => {
    if (!testVersion?.passages?.length) return 0;
    const groupOfQ = testVersion.questionGroups?.find((g) =>
      g.questions?.some((q) => q.questionNumber === questionNumber)
    );
    if (groupOfQ?.passageId) {
      const idx = testVersion.passages.findIndex((p) => p.id === groupOfQ.passageId);
      if (idx !== -1) return idx;
    }
    if (questionNumber > 26) return Math.min(2, testVersion.passages.length - 1);
    if (questionNumber > 13) return Math.min(1, testVersion.passages.length - 1);
    return 0;
  };

  // Locate a question inside the Reading Passage (in Split View or Modal)
  const openPassageViewer = (item: AttemptItemResult) => {
    if (!testVersion?.passages?.length) return;
    const passageIdx = getPassageIdxForQuestion(item.questionNumber);

    setActivePassageIdx(passageIdx);
    setFocusedQuestionNumber(item.questionNumber);
    setFocusedParagraphRef(item.paragraphRef);

    if (viewMode !== 'split') {
      setViewMode('split');
    }

    setTimeout(() => {
      const quoteEl = document.getElementById(`passage-quote-q-${item.questionNumber}`);
      if (quoteEl) {
        quoteEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (item.paragraphRef) {
        const paraEl = document.getElementById(`split-para-${passageIdx}-${String(item.paragraphRef).toUpperCase()}`);
        if (paraEl) {
          paraEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 120);
  };

  // Clicking a [Q#] badge inside the Reading Passage scrolls the right column to that Question's explanation card
  const handlePassageBadgeClick = (questionNumber: number) => {
    setFocusedQuestionNumber(questionNumber);
    const targetItem = results.find((r) => r.questionNumber === questionNumber);
    if (targetItem) {
      setFocusedParagraphRef(targetItem.paragraphRef);
      if (filter === 'incorrect' && targetItem.isCorrect) setFilter('all');
      if (filter === 'correct' && !targetItem.isCorrect) setFilter('all');
    }
    setTimeout(() => {
      const cardEl = document.getElementById(`result-q-${questionNumber}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Render a paragraph's text with ALL matching evidenceQuotes highlighted inline with clickable [Q#] badges
  const renderMultiHighlightedParagraph = (
    content: string,
    passageIdx: number,
    paraLabel: string
  ) => {
    if (!content) return content;

    // Collect questions belonging to this passage
    const passageQuestions = results.filter(
      (r) => getPassageIdxForQuestion(r.questionNumber) === passageIdx && r.evidenceQuote
    );

    const lowerContent = content.toLowerCase();
    const matches: ParagraphQuoteMatch[] = [];

    for (const item of passageQuestions) {
      const rawQuote = (item.evidenceQuote || '').trim().replace(/^["'“”]+|["'“”]+$/g, '');
      if (!rawQuote || rawQuote.length < 6) continue;

      const rawKey = item.answerKey;
      const answerDisplay = Array.isArray(rawKey) ? rawKey.join(' / ') : String(rawKey || '');

      let matchedSpan: { start: number; end: number } | null = null;
      const directIdx = lowerContent.indexOf(rawQuote.toLowerCase());
      if (directIdx !== -1) {
        matchedSpan = { start: directIdx, end: directIdx + rawQuote.length };
      } else {
        // Fallback: split on ellipses (...) and try the longest clause >= 14 chars
        const chunks = rawQuote
          .split(/\.{2,}|…|[—–]/)
          .map((c) => c.trim())
          .filter((c) => c.length >= 14)
          .sort((a, b) => b.length - a.length);
        for (const chunk of chunks) {
          const cIdx = lowerContent.indexOf(chunk.toLowerCase());
          if (cIdx !== -1) {
            matchedSpan = { start: cIdx, end: cIdx + chunk.length };
            break;
          }
        }
      }

      if (matchedSpan) {
        matches.push({
          questionNumber: item.questionNumber,
          start: matchedSpan.start,
          end: matchedSpan.end,
          isCorrect: item.isCorrect,
          answerDisplay,
        });
      }
    }

    if (matches.length === 0) {
      return content;
    }

    // Sort and resolve overlapping spans
    matches.sort((a, b) => a.start - b.start || a.questionNumber - b.questionNumber);
    const nonOverlapping: ParagraphQuoteMatch[] = [];
    for (const m of matches) {
      const prev = nonOverlapping[nonOverlapping.length - 1];
      if (!prev || m.start >= prev.end) {
        nonOverlapping.push(m);
      } else if (m.end > prev.end) {
        nonOverlapping.push({ ...m, start: prev.end });
      }
    }

    const nodes: React.ReactNode[] = [];
    let cursor = 0;
    for (const m of nonOverlapping) {
      if (m.start > cursor) {
        nodes.push(<span key={`p-${paraLabel}-txt-${cursor}`}>{content.slice(cursor, m.start)}</span>);
      }
      const isFocused = focusedQuestionNumber === m.questionNumber;
      const sliceText = content.slice(m.start, m.end);
      nodes.push(
        <mark
          key={`p-${paraLabel}-q-${m.questionNumber}`}
          id={`passage-quote-q-${m.questionNumber}`}
          onClick={() => handlePassageBadgeClick(m.questionNumber)}
          className={`rounded-md px-1.5 py-0.5 cursor-pointer transition-all inline ${
            isFocused
              ? 'bg-amber-200/95 text-slate-950 ring-2 ring-[#084F7D] shadow-sm font-semibold'
              : m.isCorrect
              ? 'bg-emerald-100/90 hover:bg-emerald-200/90 text-emerald-950 border-b-2 border-emerald-400'
              : 'bg-rose-100/90 hover:bg-rose-200/90 text-rose-950 border-b-2 border-rose-400'
          }`}
          title={`Click to view explanation for Question ${m.questionNumber} (Answer: ${m.answerDisplay})`}
        >
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.2 rounded mr-1.5 align-middle shadow-2xs ${
              m.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            Q{m.questionNumber}: {m.answerDisplay}
          </span>
          {sliceText}
        </mark>
      );
      cursor = m.end;
    }
    if (cursor < content.length) {
      nodes.push(<span key={`p-${paraLabel}-end`}>{content.slice(cursor)}</span>);
    }

    return <>{nodes}</>;
  };

  // Helper to highlight a single evidence quote inside the modal drawer
  const renderHighlightedContent = (content: string, evidenceQuote?: string) => {
    if (!evidenceQuote || !content) return content;

    const trimmedQuote = evidenceQuote.trim();
    const idx = content.toLowerCase().indexOf(trimmedQuote.toLowerCase());
    if (idx === -1) {
      return content;
    }

    const before = content.slice(0, idx);
    const match = content.slice(idx, idx + trimmedQuote.length);
    const after = content.slice(idx + trimmedQuote.length);

    return (
      <>
        {before}
        <mark className="bg-amber-200/80 text-amber-950 font-semibold px-1 py-0.5 rounded border border-amber-300">
          {match}
        </mark>
        {after}
      </>
    );
  };

  // Helper for dynamic IELTS trap explanations
  const getDynamicTrapGuidance = (item: AttemptItemResult): string | null => {
    const qType = item.questionType?.toLowerCase() || '';
    const userAns = String(item.userAnswer || '').trim().toUpperCase();
    const key = String(item.answerKey || '').trim().toUpperCase();

    if (!userAns) {
      return 'No answer provided. In the IELTS test, there is no negative marking for wrong answers. Always make an educated guess rather than leaving an answer box blank!';
    }

    if (qType.includes('true_false_not_given') || qType.includes('yes_no_not_given')) {
      if (userAns === 'FALSE' && key === 'NOT GIVEN') {
        return 'IELTS Rule Trap (FALSE vs NOT GIVEN): To be FALSE, the passage must state the direct opposite or contradict the statement. If the text mentions the topic but never makes or confirms this specific claim, the correct answer is NOT GIVEN, not FALSE.';
      }
      if (userAns === 'NO' && key === 'NOT GIVEN') {
        return 'IELTS Rule Trap (NO vs NOT GIVEN): To be NO, the claims of the writer must contradict the statement. If the writer never expresses a view on this specific comparison or detail, it is NOT GIVEN.';
      }
      if (userAns === 'NOT GIVEN' && (key === 'TRUE' || key === 'YES')) {
        return 'IELTS Paraphrase Trap (TRUE vs NOT GIVEN): Candidates often pick NOT GIVEN when the passage uses paraphrasing rather than exact words. Look closely at the evidence quote: the underlying meaning matches the statement completely.';
      }
      if (userAns === 'TRUE' && key === 'FALSE') {
        return 'IELTS Contradiction Trap: The passage directly contradicts this statement. Watch out for partial keyword matches where a single contradictory word changes the whole factual meaning.';
      }
      if (userAns === 'YES' && key === 'NO') {
        return 'IELTS Contradiction Trap: The writer directly contradicts this claim. Be careful not to assume agreement when the author presents contradictory statistics or conclusions.';
      }
      if (userAns === 'NOT GIVEN' && (key === 'FALSE' || key === 'NO')) {
        return 'IELTS Evidence Trap: The passage provides explicit contradictory information. When the text provides clear contradictory facts, the answer is FALSE/NO, not NOT GIVEN.';
      }
    }

    if (item.distractorAnalysis && item.distractorAnalysis[userAns]) {
      return item.distractorAnalysis[userAns];
    }

    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={onBackToCatalogue}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-[#E5E1D7] px-3.5 py-2 rounded-xl shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          Back to Catalogue
        </button>

        <div className="flex items-center gap-2.5">
          {testVersion?.passages && testVersion.passages.length > 0 && (
            <div className="flex bg-white p-1 rounded-xl border border-[#E5E1D7] text-xs font-bold shadow-2xs">
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-[#084F7D] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Side-by-side Reading Passage with highlighted answer locations"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split View (Passage + Answers)</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#084F7D] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Card View</span>
              </button>
            </div>
          )}

          <button
            onClick={() => onRetryTest(attempt.testId, attempt.questionTypeFilter)}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#084F7D] hover:bg-[#073f64] px-4 py-2 rounded-xl shadow-2xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Test
          </button>
        </div>
      </div>

      {/* SUMMARY SCORECARD */}
      <div className="bg-white rounded-3xl border border-[#E5E1D7] p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                {attempt.testType === 'academic' ? 'Academic Reading' : 'General Training'}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[#084F7D]/10 text-[#084F7D] px-2.5 py-0.5 rounded-full">
                {attempt.mode === 'mock' ? 'Full Timed Mock' : 'Practice Set'}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {attempt.isFirstAttempt ? 'First Attempt' : 'Retry Attempt'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {attempt.questionTypeFilter && formatQuestionTypeName(attempt.questionTypeFilter) + ' · '}
              {attempt.testTitle}
            </h1>
            <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-3">
              <span>Submitted: {new Date(attempt.submittedAt || attempt.startedAt).toLocaleString()}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Time Spent: {formatDuration(attempt.durationSeconds)}
              </span>
            </div>
          </div>

          {/* ESTIMATED BAND OR ACCURACY CARD */}
          <div className="flex items-center gap-6">
            <div className="text-center px-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Raw Score
              </div>
              <div className="text-3xl font-black text-slate-900">
                {rawScore} <span className="text-base font-normal text-slate-400">/ {totalQuestions}</span>
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                {accuracyPct}% Accuracy
              </div>
            </div>

            {attempt.bandScore !== undefined && attempt.bandScore !== null ? (
              <div className="text-center bg-[#FAF9F5] border-2 border-[#FC9F23]/40 p-4 rounded-2xl min-w-36 shadow-2xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-0.5 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Estimated Band
                </div>
                <div className="text-4xl font-black text-[#084F7D]">
                  {attempt.bandScore.toFixed(1)}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1 leading-tight">
                  Official IELTS scale
                </div>
              </div>
            ) : (
              <div className="text-center bg-slate-50 border border-slate-200 p-4 rounded-2xl min-w-36">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                  Practice Mode
                </div>
                <div className="text-2xl font-black text-slate-700">
                  {rawScore} Marks
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-1 leading-tight">
                  (Estimated Band requires 40-Q mock)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Question Map Matrix */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Click Any Question to Locate in Reading Passage & Explanation ({results.length} Questions):
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                Correct ({correctCount})
              </span>
              <span className="flex items-center gap-1 text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                Incorrect ({incorrectCount})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {results.map((r) => {
              const isFocused = focusedQuestionNumber === r.questionNumber;
              return (
                <button
                  key={r.questionNumber}
                  type="button"
                  onClick={() => {
                    openPassageViewer(r);
                    const el = document.getElementById(`result-q-${r.questionNumber}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all hover:scale-110 shadow-2xs cursor-pointer ${
                    isFocused ? 'ring-2 ring-[#084F7D] ring-offset-1 scale-110 ' : ''
                  }${
                    r.isCorrect
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-rose-500 text-white hover:bg-rose-600'
                  }`}
                  title={`Question ${r.questionNumber}: ${r.isCorrect ? 'Correct (+1)' : 'Incorrect (0)'} — Click to locate in passage`}
                >
                  {r.questionNumber}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN REVIEW AREA: SPLIT VIEW (LEFT PASSAGE + RIGHT EXPLANATIONS) OR FULL CARDS VIEW */}
      <div className={viewMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start' : 'max-w-4xl mx-auto'}>
        {/* LEFT PANE: STICKY READING PASSAGE WITH INLINE HIGHLIGHTED ANSWERS */}
        {viewMode === 'split' && testVersion?.passages && testVersion.passages.length > 0 && (
          <div className="lg:col-span-6 lg:sticky lg:top-4 bg-white rounded-3xl border border-[#E5E1D7] shadow-sm overflow-hidden flex flex-col lg:max-h-[calc(100vh-2rem)]">
            {/* Passage Header & Tabs */}
            <div className="p-4 sm:p-5 bg-[#FAF9F5] border-b border-[#E5E1D7]">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#084F7D]" />
                  <h2 className="text-sm sm:text-base font-black text-slate-900">
                    Reading Passage with Answer Locations
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  Click any <strong className="text-slate-700">[Q#]</strong> highlight to view explanation
                </span>
              </div>

              <div className="flex gap-1.5 overflow-x-auto">
                {testVersion.passages.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePassageIdx(idx)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      activePassageIdx === idx
                        ? 'bg-[#084F7D] text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-[#E5E1D7] hover:bg-slate-50'
                    }`}
                  >
                    Passage {p.passageNumber || idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Passage Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-[#FAF9F5]">
              {(() => {
                const currentPassage = testVersion.passages[activePassageIdx] || testVersion.passages[0];
                if (!currentPassage) return null;

                return (
                  <div>
                    <div className="border-b border-[#E5E1D7] pb-4 mb-5">
                      <span className="text-[11px] font-bold text-[#084F7D] uppercase tracking-wider">
                        READING PASSAGE {currentPassage.passageNumber || activePassageIdx + 1}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 mt-1">
                        {currentPassage.title}
                      </h3>
                      {currentPassage.subtitle && (
                        <p className="text-xs text-slate-600 mt-1 italic whitespace-pre-line leading-relaxed">
                          {currentPassage.subtitle}
                        </p>
                      )}
                      {currentPassage.imageUrl && (
                        <div className="mt-4 flex justify-center">
                          <img
                            src={currentPassage.imageUrl}
                            alt={currentPassage.title}
                            className="max-h-64 w-auto object-contain rounded border border-slate-200"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {currentPassage.paragraphs?.map((para) => {
                        const isTargetPara =
                          focusedParagraphRef &&
                          String(para.label).toLowerCase() === String(focusedParagraphRef).toLowerCase();

                        return (
                          <div
                            key={para.id || para.label}
                            id={`split-para-${activePassageIdx}-${String(para.label).toUpperCase()}`}
                            className={`p-4 rounded-xl border transition-all ${
                              isTargetPara
                                ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-400/30 shadow-xs'
                                : 'bg-white border-[#E5E1D7]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                  isTargetPara
                                    ? 'bg-amber-200 text-amber-900'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                Paragraph {para.label}
                              </span>
                              {isTargetPara && focusedQuestionNumber && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-amber-600" />
                                  Focused for Q{focusedQuestionNumber}
                                </span>
                              )}
                            </div>

                            <p className="text-slate-800 text-sm leading-7 whitespace-pre-line">
                              {renderMultiHighlightedParagraph(para.content, activePassageIdx, String(para.label))}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* RIGHT PANE: DETAILED QUESTION BREAKDOWN */}
        <div className={viewMode === 'split' ? 'lg:col-span-6 space-y-5' : 'space-y-6'}>
          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3.5 rounded-2xl border border-[#E5E1D7] shadow-2xs">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                Pedagogical Question Explanations ({filteredResults.length})
              </h2>
            </div>

            <div className="flex bg-[#FAF9F5] p-1 rounded-xl border border-[#E5E1D7] text-xs font-bold">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[#084F7D] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({results.length})
              </button>
              <button
                onClick={() => setFilter('incorrect')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filter === 'incorrect'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Incorrect ({incorrectCount})
              </button>
              <button
                onClick={() => setFilter('correct')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filter === 'correct'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Correct ({correctCount})
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {filteredResults.map((item) => {
              const groupOfQ = testVersion?.questionGroups?.find((g) =>
                g.questions?.some((q) => q.questionNumber === item.questionNumber)
              );
              const questionItem = groupOfQ?.questions?.find((q) => q.questionNumber === item.questionNumber);
              const isFocused = focusedQuestionNumber === item.questionNumber;

              const studentAnsDisplay = Array.isArray(item.userAnswer)
                ? item.userAnswer.join(', ')
                : item.userAnswer || '(Unanswered / Left Blank)';

              const answerKeyDisplay = Array.isArray(item.answerKey)
                ? item.answerKey.join(' OR ')
                : item.answerKey;

              const questionPrompt = item.prompt || questionItem?.prompt || `Question ${item.questionNumber}`;
              const qTypeLabel = (item.questionType || groupOfQ?.questionType || 'Reading Question')
                .replace(/_/g, ' ')
                .toUpperCase();

              const optionsList = item.options || questionItem?.options;

              const dynamicTrap = getDynamicTrapGuidance(item);
              const whyIncorrectText = item.whyIncorrect || dynamicTrap;
              const whyCorrectText = item.whyCorrect || item.explanation;

              return (
                <div
                  key={item.questionNumber}
                  id={`result-q-${item.questionNumber}`}
                  className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden ${
                    isFocused
                      ? 'ring-2 ring-[#084F7D] border-[#084F7D]'
                      : item.isCorrect
                      ? 'border-emerald-200/90'
                      : 'border-rose-200/90'
                  }`}
                >
                  {/* Question Header */}
                  <div
                    className={`p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b ${
                      item.isCorrect ? 'bg-emerald-50/40 border-emerald-100' : 'bg-rose-50/40 border-rose-100'
                    }`}
                  >
                    <div className="flex items-center flex-wrap gap-2">
                      <span
                        className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center shadow-2xs ${
                          item.isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        Q{item.questionNumber}
                      </span>

                      <span className="text-[11px] font-bold uppercase tracking-wider bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-[#E5E1D7]">
                        {qTypeLabel}
                      </span>

                      {item.paragraphRef && (
                        <span className="text-[11px] font-bold bg-[#084F7D]/10 text-[#084F7D] px-2.5 py-1 rounded-lg">
                          Paragraph {item.paragraphRef}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Locate in Passage Button */}
                      <button
                        type="button"
                        onClick={() => openPassageViewer(item)}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#084F7D] hover:text-[#063b5e] bg-white border border-[#084F7D]/30 hover:bg-sky-50 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Locate in Passage</span>
                        {item.paragraphRef && (
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                            ¶{item.paragraphRef}
                          </span>
                        )}
                      </button>

                      {item.isCorrect ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-100/80 px-3 py-1.5 rounded-lg border border-rose-300 shadow-2xs">
                          <XCircle className="w-3.5 h-3.5 text-rose-700" />
                          Incorrect
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Body */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Prompt / Stem */}
                    <div className="bg-[#FAF9F5] border border-[#E5E1D7] rounded-xl p-4">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        Question Statement / Prompt
                      </div>
                      <div className="font-semibold text-slate-900 text-sm leading-relaxed">
                        {questionPrompt}
                      </div>

                      {/* Multiple Choice Options List with visual status if present */}
                      {optionsList && optionsList.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-[#E5E1D7] space-y-2">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                            Options:
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {optionsList.map((opt) => {
                              const isStudentPick = String(item.userAnswer).toUpperCase() === opt.key.toUpperCase();
                              const isCorrectKey = String(item.answerKey).toUpperCase() === opt.key.toUpperCase();

                              let optStyle = 'bg-white border-slate-200 text-slate-800';
                              if (isCorrectKey) {
                                optStyle = 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold';
                              } else if (isStudentPick && !item.isCorrect) {
                                optStyle = 'bg-rose-50/80 border-rose-300 text-rose-950 font-semibold';
                              }

                              return (
                                <div
                                  key={opt.key}
                                  className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-colors ${optStyle}`}
                                >
                                  <span
                                    className={`w-5 h-5 rounded-md font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 ${
                                      isCorrectKey
                                        ? 'bg-emerald-600 text-white'
                                        : isStudentPick && !item.isCorrect
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {opt.key}
                                  </span>
                                  <div className="flex-1">
                                    <span>{opt.text}</span>
                                    {isCorrectKey && (
                                      <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                        <Check className="w-3 h-3" /> Correct Answer
                                      </span>
                                    )}
                                    {isStudentPick && !isCorrectKey && (
                                      <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                                        <X className="w-3 h-3" /> Your Choice
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Answers Comparison Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
                      <div
                        className={`rounded-xl p-3.5 border ${
                          item.isCorrect
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-rose-50/50 border-rose-200'
                        }`}
                      >
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                          Your Response
                        </div>
                        <div
                          className={`font-bold ${
                            item.isCorrect ? 'text-emerald-900' : 'text-rose-900 line-through'
                          }`}
                        >
                          {studentAnsDisplay}
                        </div>
                      </div>

                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5">
                        <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide mb-1">
                          Official Answer Key
                        </div>
                        <div className="font-extrabold text-emerald-950">
                          {answerKeyDisplay}
                        </div>
                        {item.acceptedAlternatives && item.acceptedAlternatives.length > 0 && (
                          <div className="text-[11px] text-emerald-700 mt-1">
                            Also accepted: {item.acceptedAlternatives.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* DIAGNOSTIC EXPLANATION BREAKDOWN */}
                    <div className="space-y-3 pt-1">
                      {!item.isCorrect && whyIncorrectText && (
                        <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-4 text-xs space-y-1.5">
                          <div className="flex items-center gap-1.5 text-rose-800 font-bold uppercase tracking-wider text-[11px]">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            Diagnostic Analysis • Why Your Response Was Incorrect
                          </div>
                          <p className="text-rose-950 leading-relaxed font-medium">
                            {whyIncorrectText}
                          </p>
                        </div>
                      )}

                      {whyCorrectText && (
                        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs space-y-1.5">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Mastery Breakdown • Why the Correct Answer is Right
                          </div>
                          <p className="text-emerald-950 leading-relaxed font-medium">
                            {whyCorrectText}
                          </p>
                        </div>
                      )}

                      {item.keyParaphrases && item.keyParaphrases.length > 0 && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                          <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            Key Paraphrasing & Vocabulary Matches
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {item.keyParaphrases.map((pair, idx) => (
                              <div
                                key={idx}
                                className="bg-white border border-[#E5E1D7] rounded-lg p-2.5 flex items-center justify-between gap-2 shadow-2xs"
                              >
                                <div className="flex-1">
                                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                                    Question Keyword
                                  </span>
                                  <span className="font-semibold text-slate-800">
                                    "{pair.questionTerm}"
                                  </span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <div className="flex-1 text-right">
                                  <span className="text-[10px] font-bold text-indigo-400 block uppercase">
                                    Passage Paraphrase
                                  </span>
                                  <span className="font-semibold text-indigo-900">
                                    "{pair.passageTerm}"
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.evidenceQuote && (
                        <div
                          onClick={() => openPassageViewer(item)}
                          className="bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 rounded-xl p-4 text-xs flex items-start justify-between gap-3 cursor-pointer transition-colors"
                          title="Click to jump directly to this highlighted quote inside the passage"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-1.5 text-amber-900 font-bold uppercase tracking-wider text-[11px]">
                              <Quote className="w-3.5 h-3.5 text-amber-700" />
                              Passage Evidence Grounding
                              {item.paragraphRef && (
                                <span className="text-[10px] font-bold bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full ml-1">
                                  Paragraph {item.paragraphRef}
                                </span>
                              )}
                            </div>
                            <p className="text-amber-950 italic leading-relaxed pl-1">
                              "{item.evidenceQuote}"
                            </p>
                          </div>

                          <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-[#084F7D] bg-white border border-[#084F7D]/20 px-2.5 py-1 rounded-lg shadow-2xs">
                            <ExternalLink className="w-3 h-3" />
                            Locate in Text
                          </span>
                        </div>
                      )}

                      {item.commonTrap && (
                        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs space-y-1.5">
                          <div className="flex items-center gap-1.5 text-amber-800 font-bold uppercase tracking-wider text-[11px]">
                            <Lightbulb className="w-4 h-4 text-amber-600" />
                            IELTS Exam Tip & Strategy Warning
                          </div>
                          <p className="text-amber-950 leading-relaxed font-medium">
                            {item.commonTrap}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* INTERACTIVE PASSAGE VIEWER DRAWER / MODAL (Fallback if opened manually) */}
      {activePassageModal && testVersion?.passages && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-end animate-fadeIn">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slideLeft">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-[#FAF9F5]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#084F7D]" />
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Reading Passage Reference
                  </h3>
                  {activePassageModal.questionNumber && (
                    <p className="text-xs text-slate-500">
                      Focusing on context for Question {activePassageModal.questionNumber}
                      {activePassageModal.paragraphRef && ` (Paragraph ${activePassageModal.paragraphRef})`}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setActivePassageModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                title="Close Passage Viewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex border-b border-slate-200 bg-white px-4 pt-2 gap-2 overflow-x-auto">
              {testVersion.passages.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() =>
                    setActivePassageModal((prev) =>
                      prev ? { ...prev, passageIdx: idx } : { passageIdx: idx }
                    )
                  }
                  className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-t border-x ${
                    activePassageModal.passageIdx === idx
                      ? 'bg-[#FAF9F5] text-[#084F7D] border-slate-200 border-b-transparent shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 border-transparent'
                  }`}
                >
                  Passage {p.passageNumber || idx + 1}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[#FAF9F5] space-y-6">
              {(() => {
                const currentPassage = testVersion.passages[activePassageModal.passageIdx];
                if (!currentPassage) return <div>No passage available.</div>;

                return (
                  <div>
                    <div className="border-b border-[#E5E1D7] pb-4 mb-6">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        READING PASSAGE {currentPassage.passageNumber || activePassageModal.passageIdx + 1}
                      </span>
                      <h2 className="text-xl font-black text-slate-900 mt-1">
                        {currentPassage.title}
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {currentPassage.paragraphs?.map((para) => {
                        const isTarget =
                          activePassageModal.paragraphRef &&
                          String(para.label).toLowerCase() ===
                            String(activePassageModal.paragraphRef).toLowerCase();

                        const key = `p-${activePassageModal.passageIdx}-${para.label}`;

                        return (
                          <div
                            key={para.id || para.label}
                            ref={(el) => {
                              paragraphRefs.current[key] = el;
                            }}
                            className={`p-4 rounded-xl border transition-all ${
                              isTarget
                                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/30 shadow-sm'
                                : 'bg-white border-[#E5E1D7]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                Paragraph {para.label}
                              </span>
                            </div>

                            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                              {renderHighlightedContent(
                                para.content,
                                isTarget ? activePassageModal.evidenceQuote : undefined
                              )}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
