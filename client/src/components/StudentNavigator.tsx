import React from 'react';
import { StudentAnswer } from '../types';
import { Flag, CheckCircle, Send } from 'lucide-react';

interface StudentNavigatorProps {
  totalQuestions: number;
  answers: Record<number, StudentAnswer>;
  activeQuestionNumber: number;
  onSelectQuestion: (questionNumber: number) => void;
  onSubmitClick: () => void;
}

export const StudentNavigator: React.FC<StudentNavigatorProps> = ({
  totalQuestions,
  answers,
  activeQuestionNumber,
  onSelectQuestion,
  onSubmitClick,
}) => {
  const answeredCount = Object.values(answers).filter(
    (a) => a.userAnswer !== undefined && a.userAnswer !== '' && (!Array.isArray(a.userAnswer) || a.userAnswer.length > 0)
  ).length;

  const flaggedCount = Object.values(answers).filter((a) => a.isFlagged).length;

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-white p-3 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>
              {answeredCount} of {totalQuestions} Answered
            </span>
          </div>

          {flaggedCount > 0 && (
            <div className="flex items-center gap-1 text-amber-300 bg-amber-950/60 border border-amber-700/50 px-2 py-0.5 rounded">
              <Flag className="w-3.5 h-3.5 fill-amber-400" />
              <span>{flaggedCount} Flagged</span>
            </div>
          )}
        </div>

        {/* Center: Scrollable Question Numbers Grid */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1 px-1 custom-scrollbar">
          {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((qNum) => {
            const ans = answers[qNum];
            const isAnswered =
              ans &&
              ans.userAnswer !== undefined &&
              ans.userAnswer !== '' &&
              (!Array.isArray(ans.userAnswer) || ans.userAnswer.length > 0);
            const isFlagged = ans?.isFlagged;
            const isActive = activeQuestionNumber === qNum;

            return (
              <button
                key={qNum}
                onClick={() => onSelectQuestion(qNum)}
                className={`relative min-w-8 h-8 rounded text-xs font-bold flex items-center justify-center transition-all ${
                  isActive
                    ? 'ring-2 ring-amber-400 scale-105 z-10'
                    : 'hover:scale-105'
                } ${
                  isAnswered
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                {qNum}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Submit Button */}
        <div>
          <button
            onClick={onSubmitClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
            Submit Test
          </button>
        </div>
      </div>
    </footer>
  );
};
