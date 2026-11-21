import { formatQuestionTypeName } from '../questionTypeName';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ListeningAttempt, ListeningTestVersion, AttemptItemResult } from '../types';
import { api } from '../api';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RotateCcw,
  Headphones,
  Play,
  Pause,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Volume2,
  Columns,
  LayoutList,
  Search,
  Sparkles,
  ExternalLink,
  Check,
  X,
} from 'lucide-react';

interface ListeningResultsViewProps {
  attemptId: string;
  onBackToCatalogue: () => void;
  onRetryTest: (testId: string, filter?: string) => void;
}

interface TranscriptHighlightMatch {
  questionNumber: number;
  start: number;
  end: number;
  isCorrect: boolean;
  answerDisplay: string;
  audioTimestampSeconds?: number;
}

export const ListeningResultsView: React.FC<ListeningResultsViewProps> = ({
  attemptId,
  onBackToCatalogue,
  onRetryTest,
}) => {
  const [attempt, setAttempt] = useState<ListeningAttempt | null>(null);
  const [testVersion, setTestVersion] = useState<ListeningTestVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [viewMode, setViewMode] = useState<'split' | 'cards'>('split');
  const [focusedQuestionNumber, setFocusedQuestionNumber] = useState<number | null>(null);

  // Review audio playback states
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudioPartIdx, setCurrentAudioPartIdx] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setAudioCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setAudioDuration(audio.duration || 0);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [attempt, testVersion]);

  const loadAttempt = async () => {
    setLoading(true);
    try {
      const res = await api.getListeningAttempt(attemptId);
      setAttempt(res.attempt);
      setTestVersion(res.testVersion);
      if (res.testVersion?.parts?.length && res.attempt?.questionTypeFilter) {
        const matchingGroup = res.testVersion.questionGroups?.find(
          (g: any) => g.questionType === res.attempt.questionTypeFilter
        );
        if (matchingGroup?.partNumber) {
          const idx = res.testVersion.parts.findIndex((p: any) => p.partNumber === matchingGroup.partNumber);
          if (idx !== -1) setCurrentAudioPartIdx(idx);
        }
      }
    } catch (err) {
      console.error('Failed to load listening attempt result', err);
    } finally {
      setLoading(false);
    }
  };

  const playAtTimestamp = (partNumber: number, timestampSeconds?: number, autoPlay = true) => {
    if (!testVersion) return;
    const foundIdx = testVersion.parts.findIndex((p) => p.partNumber === partNumber);
    const pIdx = foundIdx !== -1 ? foundIdx : Math.max(0, partNumber - 1);
    setCurrentAudioPartIdx(pIdx);

    const part = testVersion.parts[pIdx];
    const src = part?.audioUrl || testVersion.audioConfig?.masterAudioUrl;

    if (audioRef.current && src) {
      const isDifferentSrc = !audioRef.current.src || !audioRef.current.src.endsWith(src.replace(/^https?:\/\/[^/]+/, ''));
      if (isDifferentSrc) {
        audioRef.current.src = src;
      }
      if (timestampSeconds !== undefined && timestampSeconds >= 0) {
        audioRef.current.currentTime = timestampSeconds;
        setAudioCurrentTime(timestampSeconds);
      }
      if (autoPlay) {
        audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(console.error);
      }
    }
  };

  const toggleReviewAudio = () => {
    if (!audioRef.current) return;
    if (!audioRef.current.src && testVersion?.parts?.[currentAudioPartIdx]) {
      playAtTimestamp(testVersion.parts[currentAudioPartIdx].partNumber, 0, true);
      return;
    }
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(console.error);
    }
  };

  const formatAudioTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = Math.floor(secs % 60);
    return `${mins}:${remSecs.toString().padStart(2, '0')}`;
  };

  // Locate a question inside the Listening Script (left pane)
  const locateInScript = (questionNumber: number, alsoPlayAudio = false) => {
    if (!testVersion) return;
    const groupOfQ = testVersion.questionGroups.find((g) =>
      g.questions.some((q) => q.questionNumber === questionNumber)
    );
    const questionItem = groupOfQ?.questions.find((q) => q.questionNumber === questionNumber);
    const partNumber = groupOfQ?.partNumber || Math.ceil(questionNumber / 10);
    const partIdx = testVersion.parts.findIndex((p) => p.partNumber === partNumber);

    if (viewMode !== 'split') {
      setViewMode('split');
    }
    if (partIdx !== -1) {
      setCurrentAudioPartIdx(partIdx);
    }
    setFocusedQuestionNumber(questionNumber);

    if (alsoPlayAudio) {
      playAtTimestamp(partNumber, questionItem?.audioTimestampSeconds || 0, true);
    }

    setTimeout(() => {
      const targetEl = document.getElementById(`script-excerpt-q-${questionNumber}`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
  };

  // Click a [Q#] badge inside the script -> scroll right pane to Question card & play audio cue
  const handleScriptBadgeClick = (questionNumber: number, partNumber: number, timestampSeconds?: number) => {
    setFocusedQuestionNumber(questionNumber);
    if (filter !== 'all') {
      const resItem = attempt?.results?.find((r) => r.questionNumber === questionNumber);
      if (resItem) {
        if (filter === 'incorrect' && resItem.isCorrect) setFilter('all');
        if (filter === 'correct' && !resItem.isCorrect) setFilter('all');
      }
    }
    if (timestampSeconds !== undefined) {
      playAtTimestamp(partNumber, timestampSeconds, true);
    }
    setTimeout(() => {
      const cardEl = document.getElementById(`listening-result-q-${questionNumber}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const results: AttemptItemResult[] = attempt?.results || [];
  const resultByQNum = useMemo(() => {
    const map = new Map<number, AttemptItemResult>();
    for (const r of results) map.set(r.questionNumber, r);
    return map;
  }, [results]);

  // Render a Part's transcript with inline highlighted answer spans & clickable [Q#] badges
  const renderHighlightedTranscript = (partIdx: number) => {
    const part = testVersion?.parts?.[partIdx];
    if (!part) return null;
    const transcript = part.transcript || '';

    const partGroups = (testVersion?.questionGroups || []).filter((g) => g.partNumber === part.partNumber);
    const partQuestions = partGroups
      .flatMap((g) => g.questions || [])
      .filter((q) => resultByQNum.has(q.questionNumber))
      .sort((a, b) => a.questionNumber - b.questionNumber);

    if (!transcript.trim()) {
      return (
        <div className="text-xs text-slate-400 italic py-8 text-center">
          No full transcript text available for Part {part.partNumber}. Use the question cards on the right to view individual excerpts.
        </div>
      );
    }

    const lowerTranscript = transcript.toLowerCase();
    const matches: TranscriptHighlightMatch[] = [];
    const unmatchedQuestions: Array<{
      questionNumber: number;
      excerpt: string;
      isCorrect: boolean;
      answerDisplay: string;
      audioTimestampSeconds?: number;
    }> = [];

    for (const q of partQuestions) {
      const resItem = resultByQNum.get(q.questionNumber);
      const isCorrect = Boolean(resItem?.isCorrect);
      const rawKey = resItem?.answerKey ?? q.answerKey;
      const answerDisplay = Array.isArray(rawKey) ? rawKey.join(' / ') : String(rawKey || '');
      const excerpt = (q.transcriptExcerpt || '').trim();

      let matchedSpan: { start: number; end: number } | null = null;

      if (excerpt) {
        // Try full excerpt match first (strip surrounding quotes)
        const cleanExcerpt = excerpt.replace(/^["'“”]+|["'“”]+$/g, '').trim();
        const directIdx = lowerTranscript.indexOf(cleanExcerpt.toLowerCase());
        if (directIdx !== -1 && cleanExcerpt.length >= 6) {
          matchedSpan = { start: directIdx, end: directIdx + cleanExcerpt.length };
        } else {
          // Split by ellipses (...) or sentence boundaries and match the longest segment >= 12 chars
          const chunks = cleanExcerpt
            .split(/\.{2,}|…|[—–]/)
            .map((c) => c.trim())
            .filter((c) => c.length >= 12)
            .sort((a, b) => b.length - a.length);

          for (const chunk of chunks) {
            const cIdx = lowerTranscript.indexOf(chunk.toLowerCase());
            if (cIdx !== -1) {
              matchedSpan = { start: cIdx, end: cIdx + chunk.length };
              break;
            }
          }
        }
      }

      if (matchedSpan) {
        matches.push({
          questionNumber: q.questionNumber,
          start: matchedSpan.start,
          end: matchedSpan.end,
          isCorrect,
          answerDisplay,
          audioTimestampSeconds: q.audioTimestampSeconds,
        });
      } else if (excerpt) {
        unmatchedQuestions.push({
          questionNumber: q.questionNumber,
          excerpt,
          isCorrect,
          answerDisplay,
          audioTimestampSeconds: q.audioTimestampSeconds,
        });
      }
    }

    // Sort matches by start position and resolve overlaps
    matches.sort((a, b) => a.start - b.start || a.questionNumber - b.questionNumber);
    const nonOverlapping: TranscriptHighlightMatch[] = [];
    for (const m of matches) {
      const prev = nonOverlapping[nonOverlapping.length - 1];
      if (!prev || m.start >= prev.end) {
        nonOverlapping.push(m);
      } else if (m.end > prev.end) {
        nonOverlapping.push({ ...m, start: prev.end });
      } else {
        // Completely inside previous match; move to footer card so its [Q#] anchor still exists
        const qObj = partQuestions.find((q) => q.questionNumber === m.questionNumber);
        if (qObj?.transcriptExcerpt) {
          unmatchedQuestions.push({
            questionNumber: m.questionNumber,
            excerpt: qObj.transcriptExcerpt,
            isCorrect: m.isCorrect,
            answerDisplay: m.answerDisplay,
            audioTimestampSeconds: m.audioTimestampSeconds,
          });
        }
      }
    }

    const nodes: React.ReactNode[] = [];
    let cursor = 0;
    for (const m of nonOverlapping) {
      if (m.start > cursor) {
        nodes.push(
          <span key={`txt-${cursor}`}>{transcript.slice(cursor, m.start)}</span>
        );
      }
      const isFocused = focusedQuestionNumber === m.questionNumber;
      const sliceText = transcript.slice(m.start, m.end);
      nodes.push(
        <mark
          key={`hl-q-${m.questionNumber}`}
          id={`script-excerpt-q-${m.questionNumber}`}
          onClick={() => handleScriptBadgeClick(m.questionNumber, part.partNumber, m.audioTimestampSeconds)}
          className={`rounded-md px-1.5 py-0.5 cursor-pointer transition-all inline ${
            isFocused
              ? 'bg-amber-200/95 text-slate-950 ring-2 ring-[#084F7D] shadow-sm font-semibold'
              : m.isCorrect
              ? 'bg-emerald-100/90 hover:bg-emerald-200/90 text-emerald-950 border-b-2 border-emerald-400'
              : 'bg-rose-100/90 hover:bg-rose-200/90 text-rose-950 border-b-2 border-rose-400'
          }`}
          title={`Click to focus Question ${m.questionNumber} (Answer: ${m.answerDisplay}) and play audio`}
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
    if (cursor < transcript.length) {
      nodes.push(<span key={`txt-end`}>{transcript.slice(cursor)}</span>);
    }

    return (
      <div className="space-y-5">
        <div className="text-slate-800 text-sm leading-7 whitespace-pre-line font-normal">
          {nodes}
        </div>

        {unmatchedQuestions.length > 0 && (
          <div className="pt-4 border-t border-[#E5E1D7] space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Additional Script References in Part {part.partNumber}
            </div>
            {unmatchedQuestions.map((uq) => {
              const isFocused = focusedQuestionNumber === uq.questionNumber;
              return (
                <div
                  key={uq.questionNumber}
                  id={`script-excerpt-q-${uq.questionNumber}`}
                  onClick={() =>
                    handleScriptBadgeClick(uq.questionNumber, part.partNumber, uq.audioTimestampSeconds)
                  }
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isFocused
                      ? 'bg-amber-100/90 border-[#084F7D] ring-2 ring-[#084F7D]/40'
                      : uq.isCorrect
                      ? 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/60'
                      : 'bg-rose-50/70 border-rose-200 hover:bg-rose-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded ${
                        uq.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      Q{uq.questionNumber} • Answer: {uq.answerDisplay}
                    </span>
                    {uq.audioTimestampSeconds !== undefined && (
                      <span className="text-[11px] font-semibold text-[#084F7D] flex items-center gap-1">
                        <Volume2 className="w-3 h-3" />
                        {formatAudioTime(uq.audioTimestampSeconds)}
                      </span>
                    )}
                  </div>
                  <p className="italic text-slate-800 leading-relaxed">"{uq.excerpt}"</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (loading || !attempt) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center p-4">
        <div className="text-slate-500 font-medium flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
          Loading listening test review, audio script, and answer locations...
        </div>
      </div>
    );
  }

  const rawScore = attempt.rawScore || 0;
  const totalQuestions = attempt.totalQuestions;
  const accuracyPct = Math.round((rawScore / totalQuestions) * 100);
  const correctCount = results.filter((r) => r.isCorrect).length;
  const incorrectCount = results.filter((r) => !r.isCorrect).length;

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

  const perfByType = attempt.performanceByType || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hidden audio element for review playback */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlayingAudio(false)}
        onPause={() => setIsPlayingAudio(false)}
        onPlay={() => setIsPlayingAudio(true)}
      />

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
          {/* Split View vs Full Cards View Toggle */}
          <div className="flex bg-white p-1 rounded-xl border border-[#E5E1D7] text-xs font-bold shadow-2xs">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'split'
                  ? 'bg-[#084F7D] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Side-by-side Listening Script with highlighted answer locations"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split View (Script + Answers)</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'cards'
                  ? 'bg-[#084F7D] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Card View</span>
            </button>
          </div>

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
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#084F7D] bg-[#084F7D]/10 px-3 py-1 rounded-full mb-3">
              <Headphones className="w-3.5 h-3.5 text-[#084F7D]" />
              IELTS Listening Review & Transcript Analysis
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
              {attempt.questionTypeFilter && formatQuestionTypeName(attempt.questionTypeFilter) + ' · '}
              {attempt.testTitle || 'Listening Test'}
            </h1>
            <p className="text-xs text-slate-500">
              Completed on {new Date(attempt.submittedAt || attempt.startedAt).toLocaleString()} • Time Elapsed:{' '}
              <span className="font-semibold text-slate-700">{formatDuration(attempt.durationSeconds || 0)}</span> • Mode:{' '}
              <span className="font-semibold text-slate-700 capitalize">{attempt.mode}</span>
            </p>
          </div>

          {/* Band Score Pill */}
          <div className="flex items-center gap-4 bg-[#FAF9F5] border border-[#E5E1D7] p-4 rounded-2xl">
            <div className="text-center px-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Raw Score</div>
              <div className="text-3xl font-black text-slate-900">
                {rawScore}
                <span className="text-sm font-semibold text-slate-400">/{totalQuestions}</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500">{accuracyPct}% Accuracy</div>
            </div>

            {attempt.bandScore !== undefined && attempt.bandScore !== null && (
              <>
                <div className="w-px h-10 bg-slate-300" />
                <div className="text-center px-3">
                  <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1 justify-center">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Band Score
                  </div>
                  <div className="text-3xl font-black text-[#084F7D]">
                    {attempt.bandScore.toFixed(1)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Interactive Question Map Matrix */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Click Any Question to Locate in Audio Script & Explanation ({results.length} Questions):
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
                    locateInScript(r.questionNumber, false);
                    const el = document.getElementById(`listening-result-q-${r.questionNumber}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all hover:scale-110 shadow-2xs cursor-pointer ${
                    isFocused ? 'ring-2 ring-[#084F7D] ring-offset-1 scale-110 ' : ''
                  }${
                    r.isCorrect
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-rose-500 text-white hover:bg-rose-600'
                  }`}
                  title={`Question ${r.questionNumber}: ${r.isCorrect ? 'Correct (+1)' : 'Incorrect (0)'} — Click to locate in script`}
                >
                  {r.questionNumber}
                </button>
              );
            })}
          </div>
        </div>

        {/* REHEARSAL AUTHENTICITY / INTERRUPTION BADGE */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {attempt.wasInterrupted ? (
            <div className="flex items-start gap-2.5 text-xs text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Interrupted Session ({attempt.interruptionCount || 1} event):</strong> Page reload or audio replay occurred during the test.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Uninterrupted Rehearsal Verified:</strong> Completed continuously without browser reloads or unpermitted seeking.
              </span>
            </div>
          )}

          {Object.keys(perfByType).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(perfByType).map(([qType, stats]) => {
                const typePct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                return (
                  <span
                    key={qType}
                    className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200"
                  >
                    {formatQuestionTypeName(qType)}: <strong>{stats.correct}/{stats.total}</strong> ({typePct}%)
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* STICKY AUDIO REVIEW PLAYER BAR */}
      <div className="bg-[#073250] text-white rounded-2xl p-4 mb-6 shadow-md border border-[#0B446B] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={toggleReviewAudio}
            className="w-10 h-10 rounded-xl bg-[#FC9F23] hover:bg-amber-500 flex items-center justify-center text-slate-950 shrink-0 shadow-sm transition-colors cursor-pointer"
          >
            {isPlayingAudio ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#FC9F23]">
              Interactive Audio Review Player
            </div>
            <div className="text-sm font-bold text-white truncate">
              Part {testVersion?.parts[currentAudioPartIdx]?.partNumber || currentAudioPartIdx + 1}:{' '}
              {testVersion?.parts[currentAudioPartIdx]?.title || 'Section Audio'}
            </div>
          </div>
        </div>

        {/* Scrubber */}
        <div className="flex items-center gap-2.5 w-full md:max-w-md">
          <span className="font-mono text-xs text-slate-200 tabular-nums min-w-[34px] text-right">
            {formatAudioTime(audioCurrentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={audioDuration || 100}
            value={audioCurrentTime}
            onChange={(e) => {
              const nextTime = Number(e.target.value);
              if (audioRef.current) {
                audioRef.current.currentTime = nextTime;
                setAudioCurrentTime(nextTime);
              }
            }}
            className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FC9F23]"
          />
          <span className="font-mono text-xs text-slate-300 tabular-nums min-w-[34px]">
            {formatAudioTime(audioDuration || 0)}
          </span>
        </div>

        {/* Part selector buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto justify-end">
          {testVersion?.parts.map((p, idx) => (
            <button
              key={p.partNumber}
              onClick={() => playAtTimestamp(p.partNumber, 0, false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                currentAudioPartIdx === idx
                  ? 'bg-[#FC9F23] text-slate-950 shadow-2xs'
                  : 'bg-[#0B4A75] text-slate-200 hover:bg-[#0D588B]'
              }`}
            >
              Part {p.partNumber}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN REVIEW AREA: SPLIT VIEW (LEFT SCRIPT + RIGHT QUESTIONS) OR CARDS VIEW */}
      <div className={viewMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start' : 'max-w-4xl mx-auto'}>
        {/* LEFT PANE: INTERACTIVE HIGHLIGHTED LISTENING SCRIPT */}
        {viewMode === 'split' && testVersion?.parts && (
          <div className="lg:col-span-6 lg:sticky lg:top-4 bg-white rounded-3xl border border-[#E5E1D7] shadow-sm overflow-hidden flex flex-col lg:max-h-[calc(100vh-2rem)]">
            {/* Script Header & Part Tabs */}
            <div className="p-4 sm:p-5 bg-[#FAF9F5] border-b border-[#E5E1D7]">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#084F7D]" />
                  <h2 className="text-sm sm:text-base font-black text-slate-900">
                    Audio Script with Answer Locations
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  Click any <strong className="text-slate-700">[Q#]</strong> highlight to play audio
                </span>
              </div>

              <div className="flex gap-1.5 overflow-x-auto">
                {testVersion.parts.map((p, idx) => (
                  <button
                    key={p.partNumber}
                    type="button"
                    onClick={() => {
                      setCurrentAudioPartIdx(idx);
                      playAtTimestamp(p.partNumber, 0, false);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      currentAudioPartIdx === idx
                        ? 'bg-[#084F7D] text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-[#E5E1D7] hover:bg-slate-50'
                    }`}
                  >
                    Part {p.partNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Part Context & Highlighted Script Body */}
            <div
              ref={transcriptContainerRef}
              className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-white"
            >
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#084F7D]">
                  LISTENING PART {testVersion.parts[currentAudioPartIdx]?.partNumber || currentAudioPartIdx + 1}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {testVersion.parts[currentAudioPartIdx]?.title}
                </h3>
                {testVersion.parts[currentAudioPartIdx]?.context && (
                  <p className="text-xs text-slate-500 italic mt-1">
                    {testVersion.parts[currentAudioPartIdx]?.context}
                  </p>
                )}
              </div>

              {renderHighlightedTranscript(currentAudioPartIdx)}
            </div>
          </div>
        )}

        {/* RIGHT PANE: QUESTION REVIEW CARDS */}
        <div className={viewMode === 'split' ? 'lg:col-span-6 space-y-4' : 'space-y-4'}>
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3.5 rounded-2xl border border-[#E5E1D7] shadow-2xs">
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              Question-by-Question Review ({filteredResults.length})
            </h2>
            <div className="flex bg-[#FAF9F5] p-1 rounded-xl border border-[#E5E1D7] text-xs font-bold">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filter === 'all' ? 'bg-[#084F7D] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({results.length})
              </button>
              <button
                onClick={() => setFilter('incorrect')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filter === 'incorrect' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Incorrect ({incorrectCount})
              </button>
              <button
                onClick={() => setFilter('correct')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Correct ({correctCount})
              </button>
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-4">
            {filteredResults.map((item) => {
              const groupOfQ = testVersion?.questionGroups.find((g) =>
                g.questions.some((q) => q.questionNumber === item.questionNumber)
              );
              const questionItem = groupOfQ?.questions.find((q) => q.questionNumber === item.questionNumber);
              const partOfQ = testVersion?.parts.find((p) => p.partNumber === groupOfQ?.partNumber);
              const isFocused = focusedQuestionNumber === item.questionNumber;

              const studentAnsDisplay = Array.isArray(item.userAnswer)
                ? item.userAnswer.join(', ')
                : item.userAnswer || '(No answer provided)';

              const correctAnsDisplay = Array.isArray(item.answerKey)
                ? item.answerKey.join(' / ')
                : item.answerKey;

              const optionsList = questionItem?.options || groupOfQ?.optionsList;

              return (
                <div
                  key={item.questionNumber}
                  id={`listening-result-q-${item.questionNumber}`}
                  className={`bg-white rounded-2xl border p-5 shadow-2xs transition-all ${
                    isFocused
                      ? 'ring-2 ring-[#084F7D] border-[#084F7D]'
                      : item.isCorrect
                      ? 'border-emerald-200'
                      : 'border-rose-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center flex-wrap gap-2">
                      <span
                        className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center ${
                          item.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}
                      >
                        Q{item.questionNumber}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-[#FAF9F5] border border-[#E5E1D7] text-slate-700 px-2.5 py-0.5 rounded-lg">
                        {formatQuestionTypeName(groupOfQ?.questionType || 'Listening question')}
                      </span>
                      {partOfQ && (
                        <span className="text-[11px] font-bold text-[#084F7D] bg-[#084F7D]/10 px-2 py-0.5 rounded-lg">
                          Part {partOfQ.partNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Locate in Script button */}
                      <button
                        type="button"
                        onClick={() => locateInScript(item.questionNumber, false)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#084F7D] hover:bg-sky-50 bg-white border border-[#084F7D]/30 px-2.5 py-1 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        title="Highlight this answer inside the full Listening Audio Script"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Locate in Script</span>
                      </button>

                      {/* Audio timestamp jump button */}
                      {partOfQ && (
                        <button
                          type="button"
                          onClick={() => {
                            locateInScript(item.questionNumber, true);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 px-2.5 py-1 rounded-lg shadow-2xs transition-colors cursor-pointer"
                          title="Play audio right at this question's cue"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                          <span>
                            Play Audio{' '}
                            {questionItem?.audioTimestampSeconds
                              ? `(${formatAudioTime(questionItem.audioTimestampSeconds)})`
                              : ''}
                          </span>
                        </button>
                      )}

                      {item.isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                          <XCircle className="w-3.5 h-3.5" />
                          Incorrect
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question text / prompt */}
                  <div className="text-sm font-semibold text-slate-900 mb-3 bg-[#FAF9F5] border border-[#E5E1D7] p-3.5 rounded-xl">
                    {questionItem?.prompt || `Question ${item.questionNumber}`}

                    {/* If Multiple Choice options exist, show them inline with check/cross */}
                    {optionsList && optionsList.length > 0 && questionItem?.options && (
                      <div className="mt-3 pt-2.5 border-t border-[#E5E1D7] space-y-1.5 font-normal">
                        {questionItem.options.map((opt) => {
                          const userPicks = Array.isArray(item.userAnswer)
                            ? item.userAnswer.map((v) => String(v).toUpperCase())
                            : [String(item.userAnswer || '').toUpperCase()];
                          const keyPicks = Array.isArray(item.answerKey)
                            ? item.answerKey.map((v) => String(v).toUpperCase())
                            : [String(item.answerKey || '').toUpperCase()];
                          const isStudentPick = userPicks.includes(opt.key.toUpperCase());
                          const isCorrectKey = keyPicks.includes(opt.key.toUpperCase());

                          return (
                            <div
                              key={opt.key}
                              className={`p-2 rounded-lg border text-xs flex items-start gap-2 ${
                                isCorrectKey
                                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 font-semibold'
                                  : isStudentPick && !isCorrectKey
                                  ? 'bg-rose-50/90 border-rose-300 text-rose-950 font-semibold'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded text-[11px] font-bold flex items-center justify-center shrink-0 ${
                                  isCorrectKey
                                    ? 'bg-emerald-600 text-white'
                                    : isStudentPick
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {opt.key}
                              </span>
                              <div className="flex-1">
                                {opt.text}
                                {isCorrectKey && (
                                  <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                    <Check className="w-3 h-3" /> Correct
                                  </span>
                                )}
                                {isStudentPick && !isCorrectKey && (
                                  <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                                    <X className="w-3 h-3" /> Your Pick
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Responses comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-xs">
                    <div
                      className={`p-3 rounded-xl border ${
                        item.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Your Response
                      </div>
                      <div className={`font-bold ${item.isCorrect ? 'text-emerald-900' : 'text-rose-900 line-through'}`}>
                        {studentAnsDisplay}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                        Official Answer Key
                      </div>
                      <div className="font-extrabold text-emerald-950">
                        {correctAnsDisplay}
                      </div>
                      {item.acceptedAlternatives && item.acceptedAlternatives.length > 0 && (
                        <div className="text-[11px] text-emerald-700 mt-0.5">
                          Also accepted: {item.acceptedAlternatives.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Explanation & Transcript Excerpt */}
                  {(item.explanation || questionItem?.transcriptExcerpt) && (
                    <div className="bg-[#FAF9F5] border border-[#E5E1D7] rounded-xl p-3.5 text-xs text-slate-700 mt-2 space-y-2.5">
                      {item.explanation && (
                        <div className="leading-relaxed">
                          <span className="font-bold text-[#084F7D] mr-1.5">Why This Answer Is Correct:</span>
                          {item.explanation}
                        </div>
                      )}

                      {questionItem?.transcriptExcerpt && (
                        <div
                          onClick={() => locateInScript(item.questionNumber, false)}
                          className="bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200 p-3 rounded-lg text-amber-950 text-xs cursor-pointer transition-colors"
                          title="Click to jump to this sentence inside the full script"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              Exact Script Evidence (Part {partOfQ?.partNumber || 1})
                            </span>
                            <span className="text-[10px] font-bold text-[#084F7D] flex items-center gap-0.5 not-italic">
                              <ExternalLink className="w-3 h-3" />
                              Show in Full Script
                            </span>
                          </div>
                          <p className="italic leading-relaxed">"{questionItem.transcriptExcerpt}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
