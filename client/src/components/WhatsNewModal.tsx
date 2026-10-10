import React from 'react';
import { X, Sparkles, CheckCircle2, BookOpen, Headphones, Mic, Award } from 'lucide-react';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const updates = [
    {
      icon: <BookOpen className="w-5 h-5 text-[#084F7D]" />,
      tag: 'New Material',
      title: 'Cambridge IELTS 21 Test 4 Academic Reading',
      description: 'Official-standard full 3-passage test with 40 interactive questions, live split-screen passage view, color highlighters, and instantaneous band score calculation.',
    },
    {
      icon: <Mic className="w-5 h-5 text-[#FC9F23]" />,
      tag: 'AI Simulation',
      title: 'Live AI Speaking Assessment with Examiner Audio',
      description: 'Experience real 3-part computer-delivered speaking interviews with dynamic speech recognition, Part 2 cue cards, and diagnostic IELTS band scoring.',
    },
    {
      icon: <Headphones className="w-5 h-5 text-[#084F7D]" />,
      tag: 'Milestone',
      title: 'Real-World Listening Audio & Interruption Handling',
      description: 'Official 4-part audio tracking with realistic exam timing, auto-answer syncing, and automatic recovery if disconnected.',
    },
    {
      icon: <Award className="w-5 h-5 text-[#FC9F23]" />,
      tag: 'Goal Tracking',
      title: 'Personalized Onboarding & Days-to-Exam Countdown',
      description: 'Set your target band score and exam date on your brand dashboard to keep your daily study routine accountable.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E7E3D9] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-[#FBF9F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FEF7EE] text-[#FC9F23] flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                What's New in IELTS with Arik
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Latest features and study materials for your preparation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* List of updates */}
        <div className="p-6 space-y-3.5 max-h-[60vh] overflow-y-auto">
          {updates.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-100 bg-[#FAF9F6] hover:bg-[#F3EFE7]/50 transition-colors flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-white shadow-2xs shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#EBF4F9] text-[#084F7D]">
                    {item.tag}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#084F7D] hover:bg-[#063D62] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors"
          >
            Got it, let's practice!
          </button>
        </div>
      </div>
    </div>
  );
};
