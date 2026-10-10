import React, { useState } from 'react';
import {
  Clock,
  Eye,
  EyeOff,
  HelpCircle,
  Settings,
  ArrowLeft,
  Check,
  RefreshCw,
  AlertTriangle,
  Volume2,
  Maximize,
  Minimize
} from 'lucide-react';

interface ExamHeaderProps {
  testTitle: string;
  testType?: string;
  skill: 'reading' | 'listening' | 'writing';
  candidateName?: string;
  remainingSeconds: number | null;
  elapsedSeconds: number;
  saveStatus: 'saved' | 'saving' | 'error';
  lastSavedTime?: string;
  onExitClick: () => void;
  onSubmitClick: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  volume?: number;
  onVolumeChange?: (vol: number) => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  testTitle,
  testType,
  skill,
  candidateName = 'Candidate',
  remainingSeconds,
  elapsedSeconds,
  saveStatus,
  lastSavedTime = 'Saved',
  onExitClick,
  onSubmitClick,
  onOpenHelp,
  onOpenSettings,
  volume = 80,
  onVolumeChange,
}) => {
  const [isTimeHidden, setIsTimeHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isUrgent = remainingSeconds !== null && remainingSeconds <= 600;
  const isCritical = remainingSeconds !== null && remainingSeconds <= 300;
  const effectiveHidden = isTimeHidden && !isUrgent;

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins} : ${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header className="bg-white text-slate-800 px-4 sm:px-8 py-2.5 flex items-center justify-between border-b border-slate-200 sticky top-0 z-40 select-none">
      {/* 1. LEFT: OFFICIAL RED IELTS LOGO + TEST DETAILS */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Subtle exit link/button */}
        <button
          type="button"
          onClick={onExitClick}
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors mr-0.5"
          title="Exit test (answers are auto-saved)"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Test title and subtitle */}
        <div className="flex flex-col leading-tight min-w-0">
          <div className="font-semibold text-xs sm:text-[13px] text-slate-900 truncate">
            {testTitle || 'Academic Reading • Book 21'}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 font-normal">
            {testType ? `${testType} • Practice` : 'Test 1 • Practice'}
          </div>
        </div>

        {/* Subtle auto-save status indicator */}
        <div className="hidden lg:flex items-center ml-2 text-[11px]">
          {saveStatus === 'saving' && (
            <span className="text-amber-600 flex items-center gap-1 font-normal">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" /> saving
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-slate-400 flex items-center gap-1 font-normal">
              <Check className="w-3 h-3 text-emerald-600" /> saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-rose-600 flex items-center gap-1 font-normal">
              <AlertTriangle className="w-2.5 h-2.5" /> offline
            </span>
          )}
        </div>
      </div>

      {/* 2. RIGHT: TIMER, FULLSCREEN ICON & BLACK SUBMIT BUTTON */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Official Large Digital Timer */}
        <div
          className={`font-normal text-xl sm:text-2xl tracking-wider tabular-nums ${
            isCritical
              ? 'text-rose-600 font-semibold animate-pulse'
              : isUrgent
              ? 'text-amber-600 font-semibold'
              : 'text-slate-700'
          }`}
        >
          {effectiveHidden
            ? '-- : --'
            : remainingSeconds !== null
            ? formatTimer(remainingSeconds)
            : formatTimer(elapsedSeconds)}
        </div>

        {/* Fullscreen Toggle Bracket Icon [ ] */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize className="w-4.5 h-4.5" />
          ) : (
            <Maximize className="w-4.5 h-4.5" />
          )}
        </button>

        {/* Audio Volume for Listening tests */}
        {skill === 'listening' && onVolumeChange && (
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded border border-slate-200 text-xs text-slate-600">
            <Volume2 className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-14 h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-800"
              title={`Volume: ${volume}%`}
            />
          </div>
        )}

        {/* Official Solid Black SUBMIT Button */}
        <button
          type="button"
          onClick={onSubmitClick}
          className="bg-black hover:bg-slate-800 text-white px-4 sm:px-5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-[3px] transition-colors shadow-2xs select-none"
          title="Review and finish test"
        >
          SUBMIT
        </button>
      </div>
    </header>
  );
};
