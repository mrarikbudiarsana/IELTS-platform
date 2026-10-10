import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { SpeakingAssessment } from '../types';

interface LiveAiSpeakingViewProps {
  initialSession: any;
  onExit: () => void;
  onAssessmentCompleted: (assessment: SpeakingAssessment) => void;
}

export const LiveAiSpeakingView: React.FC<LiveAiSpeakingViewProps> = ({
  initialSession,
  onExit,
  onAssessmentCompleted,
}) => {
  const [session, setSession] = useState<any>(initialSession);
  const [isRecording, setIsRecording] = useState(false);
  const [candidateSpeechText, setCandidateSpeechText] = useState('');
  const [audioBase64, setAudioBase64] = useState<string | undefined>(undefined);
  const [isSubmittingTurn, setIsSubmittingTurn] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Part 2 Prep & Scratchpad state
  const [part2Notes, setPart2Notes] = useState(session.part2Notes || '');
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(60);
  const [isPrepTimerRunning, setIsPrepTimerRunning] = useState(false);

  // MediaRecorder references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Refresh session state
  const refreshSession = async () => {
    try {
      const res = await api.getSpeakingSession(session.id);
      setSession(res.session);
    } catch (err: any) {
      console.warn('Could not refresh speaking session', err);
    }
  };

  // Timer countdown for Part 2 prep
  useEffect(() => {
    let interval: any = null;
    if (session.stage === 'part_2_prep' && isPrepTimerRunning && prepSecondsLeft > 0) {
      interval = setInterval(() => {
        setPrepSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPrepTimerRunning(false);
            // Automatically advance to part_2_speaking
            handleAdvanceStage('part_2_speaking');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session.stage, isPrepTimerRunning, prepSecondsLeft]);

  // Clean up media streams on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Audio Recording Handlers
  const startRecording = async () => {
    setErrorMsg(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Audio recording is not supported in this browser environment. You may type your response below.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not access microphone.');
    }
  };

  const stopRecordingAndPrepare = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    return new Promise<void>((resolve) => {
      mediaRecorderRef.current!.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const buffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const b64 = btoa(binary);
        setAudioBase64(b64);
        setIsRecording(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
        resolve();
      };
      mediaRecorderRef.current!.stop();
    });
  };

  // Turn Submission
  const handleSubmitTurn = async () => {
    if (isRecording) {
      await stopRecordingAndPrepare();
    }

    if (!candidateSpeechText.trim() && !audioBase64) {
      setErrorMsg('Please speak into the microphone or enter a spoken response.');
      return;
    }

    setIsSubmittingTurn(true);
    setErrorMsg(null);

    try {
      const res = await api.submitSpeakingTurn(session.id, {
        candidateText: candidateSpeechText.trim(),
        audioBase64,
        durationSeconds: 15,
      });

      setSession(res.session);
      setCandidateSpeechText('');
      setAudioBase64(undefined);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit candidate turn.');
    } finally {
      setIsSubmittingTurn(false);
    }
  };

  // Stage Advancement
  const handleAdvanceStage = async (targetStage: string) => {
    setErrorMsg(null);
    try {
      const res = await api.advanceSpeakingStage(session.id, targetStage);
      setSession(res.session);
      if (targetStage === 'part_2_prep') {
        setPrepSecondsLeft(60);
        setIsPrepTimerRunning(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to advance session stage.');
    }
  };

  // Save Part 2 Notes
  const handleSaveNotes = async (val: string) => {
    setPart2Notes(val);
    try {
      await api.savePart2Notes(session.id, val);
    } catch (err) {
      console.warn('Failed to autosave part 2 notes', err);
    }
  };

  // Finish and Assess Session
  const handleFinishSession = async () => {
    setIsFinishing(true);
    setErrorMsg(null);
    try {
      const res = await api.finishSpeakingSession(session.id);
      onAssessmentCompleted(res.assessment);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete speaking assessment.');
      setIsFinishing(false);
    }
  };

  // Abandon Session
  const handleAbandon = async () => {
    if (window.confirm('Are you sure you want to exit? Your reserved allowance will be safely refunded.')) {
      try {
        await api.abandonSpeakingSession(session.id, 'User cancelled speaking test');
        onExit();
      } catch (err: any) {
        alert(err.message || 'Failed to cancel session');
      }
    }
  };

  const turns = session.turns || [];
  const latestExaminerTurn = [...turns].reverse().find((t: any) => t.speaker === 'examiner');

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner / Progress Indicator */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              AI Speaking Simulation
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
              {session.mode === 'mock' ? 'Mock Exam' : 'Practice Mode'}
            </span>
            {session.wasInterrupted && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                ⚠️ Session Recovered
              </span>
            )}
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
            {session.setTitle || 'IELTS Speaking Examination'}
          </h1>
        </div>

        {/* Stage Progress Pills */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              session.stage === 'setup' || session.stage === 'part_1'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Part 1: Introduction
          </span>
          <span className="text-slate-300">→</span>
          <span
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              session.stage === 'part_2_prep' || session.stage === 'part_2_speaking'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Part 2: Long Turn
          </span>
          <span className="text-slate-300">→</span>
          <span
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              session.stage === 'part_3'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Part 3: Discussion
          </span>
        </div>

        <button
          onClick={handleAbandon}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
        >
          Exit & Refund
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Main Conversation & Examiner Area */}
      <div className="bg-gradient-to-b from-slate-900 to-indigo-950 rounded-2xl shadow-xl border border-indigo-900 text-white p-6 md:p-8 space-y-6 text-center">
        {/* Examiner Avatar / Visualizer */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-400 flex items-center justify-center text-3xl shadow-lg ring-4 ring-indigo-500/30">
              🎙️
            </div>
            {isSubmittingTurn && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div className="text-center">
            <div className="text-sm font-bold text-indigo-200">Dr. Edwards (AI Examiner)</div>
            <div className="text-[11px] text-slate-400">Formal IELTS Speaking Examiner Persona</div>
          </div>
        </div>

        {/* Latest Examiner Utterance */}
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-left space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
            Examiner Question / Prompt
          </div>
          <p className="text-base font-medium text-white leading-relaxed">
            {latestExaminerTurn ? latestExaminerTurn.text : 'Welcome to the test. Please introduce yourself.'}
          </p>
        </div>

        {/* Phase-specific actions */}
        {session.stage === 'part_1' && (
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleAdvanceStage('part_2_prep')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Proceed to Part 2 (Cue Card) →
            </button>
          </div>
        )}

        {session.stage === 'part_2_speaking' && (
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleAdvanceStage('part_3')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Proceed to Part 3 (Discussion) →
            </button>
          </div>
        )}

        {session.stage === 'part_3' && (
          <div className="flex justify-center gap-3">
            <button
              onClick={handleFinishSession}
              disabled={isFinishing}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
            >
              {isFinishing ? (
                <>
                  <span className="animate-spin">⏳</span> Generating 4-Criteria Assessment...
                </>
              ) : (
                <>
                  <span>✓ Finish Test & Generate AI Assessment</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Part 2 Cue Card & Scratchpad Area (Visible when in Part 2) */}
      {(session.stage === 'part_2_prep' || session.stage === 'part_2_speaking') && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Part 2 Individual Long Turn
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">Candidate Task Card</h3>
            </div>

            {session.stage === 'part_2_prep' && (
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Preparation Time</span>
                <span className={`text-2xl font-black font-mono ${prepSecondsLeft <= 10 ? 'text-rose-600' : 'text-indigo-700'}`}>
                  00:{String(prepSecondsLeft).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Card Prompt */}
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-3">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                You should say:
              </span>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 leading-relaxed">
                <li>What the topic is and where it took place</li>
                <li>Who was involved and why it occurred</li>
                <li>What key memories or details you remember most clearly</li>
                <li>And explain how you felt about the entire experience</li>
              </ul>
              <p className="text-[11px] text-slate-500 italic pt-2 border-t border-purple-200">
                You have 1 minute to prepare notes. You should then speak for 1 to 2 minutes continuously.
              </p>
            </div>

            {/* Preparation Notes Scratchpad */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  📝 Preparation Scratchpad (Notes)
                </label>
                <span className="text-[11px] text-slate-400">Autosaved to session</span>
              </div>
              <textarea
                value={part2Notes}
                onChange={(e) => handleSaveNotes(e.target.value)}
                placeholder="Jot down bullet points, key vocabulary, and ideas during your 1 minute preparation time..."
                rows={5}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {session.stage === 'part_2_prep' && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleAdvanceStage('part_2_speaking')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                Start 1-2 Minute Speaking Turn Early →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Candidate Response Submission Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span>🗣️ Your Spoken Turn</span>
            {isRecording && (
              <span className="flex items-center gap-1 text-[11px] text-rose-600 font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span> Recording Audio...
              </span>
            )}
          </span>

          <span className="text-[11px] text-slate-500">
            Audio evaluated directly for Pronunciation & Rhythm
          </span>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>🎙️</span> Push to Record Turn
            </button>
          ) : (
            <button
              onClick={stopRecordingAndPrepare}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>⏹️</span> Stop Recording
            </button>
          )}

          {/* Text input / alternative */}
          <input
            type="text"
            value={candidateSpeechText}
            onChange={(e) => setCandidateSpeechText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isSubmittingTurn) handleSubmitTurn();
            }}
            placeholder="Live speech transcript preview or typed utterance..."
            className="flex-1 w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <button
            onClick={handleSubmitTurn}
            disabled={isSubmittingTurn || (!candidateSpeechText.trim() && !audioBase64 && !isRecording)}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {isSubmittingTurn ? (
              <>
                <span className="animate-spin">⏳</span> Processing...
              </>
            ) : (
              <>
                <span>Send Turn →</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Turn History Log */}
      {turns.length > 0 && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Turn Transcript History ({turns.length} turns)
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto text-xs divide-y divide-slate-100">
            {turns.map((t: any) => (
              <div key={t.id} className="pt-2 first:pt-0 flex items-start gap-2.5">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                    t.speaker === 'examiner'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {t.speaker === 'examiner' ? 'Examiner' : 'Candidate'}
                </span>
                <p className="text-slate-700 leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
