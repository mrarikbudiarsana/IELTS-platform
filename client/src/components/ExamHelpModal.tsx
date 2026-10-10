import React from 'react';
import { HelpCircle, X, Keyboard, Highlighter, CheckSquare, Clock } from 'lucide-react';

interface ExamHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill?: 'reading' | 'listening' | 'writing';
}

export const ExamHelpModal: React.FC<ExamHelpModalProps> = ({ isOpen, onClose, skill = 'reading' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Official IELTS on Computer Instructions & Help
              </h2>
              <p className="text-xs text-slate-500">
                Test taker guide for Computer-Delivered examination
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto py-4 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed pr-1 custom-scrollbar">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-indigo-600" />
              Timing and Autosave
            </h3>
            <p>
              Your remaining test time is displayed at the top of the screen. You can click <strong>Hide</strong> to hide the timer if preferred. The timer will automatically unhide and alert you with 10 minutes and 5 minutes remaining.
            </p>
            <p className="text-emerald-700 font-medium">
              ✓ All answers are saved automatically on the server as you type or click.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              Question Navigation and Review
            </h3>
            <p>
              Use the <strong>Question Navigator</strong> at the bottom of the screen to move between questions. You can click directly on any question number or use the <strong>Back</strong> and <strong>Next</strong> buttons.
            </p>
            <p>
              Click <strong>Review</strong> to flag any question you would like to return to later. Flagged questions display a yellow marker in the bottom bar.
            </p>
          </div>

          {skill === 'reading' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Highlighter className="w-4 h-4 text-amber-500" />
                Screen Layout & Text Highlighting
              </h3>
              <p>
                The screen is split into two panels: the <strong>reading passage</strong> on the left and the <strong>questions</strong> on the right. Both panels scroll independently.
              </p>
              <p>
                You can adjust the width of each panel by dragging the vertical splitter line between them.
              </p>
              <p>
                To highlight text in the reading passage, select the text using your mouse and click <strong>Yellow</strong> or <strong>Green</strong> on the highlighter toolbar.
              </p>
            </div>
          )}

          {skill === 'listening' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                Listening Audio & Test Structure
              </h3>
              <p>
                The Listening test has 4 parts with 10 questions each (40 total).
              </p>
              <p>
                In an official exam, you will hear each recording <strong>ONCE only</strong>. Time is given before each section to read questions and after each section to check answers.
              </p>
              <p>
                You can adjust the headphone volume at any time using the volume slider in the top bar. You can type or select answers while the recording is playing.
              </p>
            </div>
          )}

          {skill === 'writing' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                Writing Tasks & Word Count
              </h3>
              <p>
                The test comprises two tasks:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li><strong>Task 1:</strong> Describe visual data/process (recommended 20 minutes, minimum 150 words).</li>
                <li><strong>Task 2:</strong> Discursive essay (recommended 40 minutes, minimum 250 words, counts twice as much toward your band).</li>
              </ul>
              <p>
                Use the task tabs at the top or bottom to switch between Task 1 and Task 2 freely.
              </p>
              <p className="text-amber-800 font-medium">
                Note: In the official Computer-Delivered IELTS examination, there is no spellcheck or grammar check.
              </p>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <Keyboard className="w-4 h-4 text-indigo-600" />
              Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded border border-slate-200">
                <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-300">Tab</kbd> Move to next input
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-300">Shift + Tab</kbd> Move to previous input
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-300">Ctrl + C</kbd> Copy text
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-300">Ctrl + V</kbd> Paste text
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors"
          >
            Close and Return to Test
          </button>
        </div>
      </div>
    </div>
  );
};
