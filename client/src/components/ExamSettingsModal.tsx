import React from 'react';
import { Settings, X, Type, Palette } from 'lucide-react';

export type TextSizeOption = 'standard' | 'large' | 'xlarge';
export type ContrastOption = 'standard' | 'high_contrast' | 'dark' | 'yellow_on_black';

interface ExamSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  textSize: TextSizeOption;
  onTextSizeChange: (size: TextSizeOption) => void;
  contrast: ContrastOption;
  onContrastChange: (contrast: ContrastOption) => void;
}

export const ExamSettingsModal: React.FC<ExamSettingsModalProps> = ({
  isOpen,
  onClose,
  textSize,
  onTextSizeChange,
  contrast,
  onContrastChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Display & Accessibility
              </h2>
              <p className="text-xs text-slate-500">
                Official test comfort options
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

        {/* Content */}
        <div className="py-4 space-y-5">
          {/* Text Size */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
              <Type className="w-4 h-4 text-indigo-600" />
              Text Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onTextSizeChange('standard')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  textSize === 'standard'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-200'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-normal">Aa</span>
                <span>Standard</span>
              </button>

              <button
                type="button"
                onClick={() => onTextSizeChange('large')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  textSize === 'large'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-200'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-base font-medium">Aa</span>
                <span>Large</span>
              </button>

              <button
                type="button"
                onClick={() => onTextSizeChange('xlarge')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  textSize === 'xlarge'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-200'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-lg font-bold">Aa</span>
                <span>Extra Large</span>
              </button>
            </div>
          </div>

          {/* Contrast Theme */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
              <Palette className="w-4 h-4 text-indigo-600" />
              Color Scheme & Contrast
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onContrastChange('standard')}
                className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                  contrast === 'standard'
                    ? 'border-indigo-600 ring-2 ring-indigo-200 bg-slate-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-4 h-4 rounded-full border border-slate-300 bg-white shadow-2xs"></div>
                <div>
                  <div className="text-slate-900">Standard</div>
                  <div className="text-[11px] text-slate-500 font-normal">Black on White</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onContrastChange('dark')}
                className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                  contrast === 'dark'
                    ? 'border-indigo-600 ring-2 ring-indigo-200 bg-slate-800 text-white'
                    : 'border-slate-200 bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <div className="w-4 h-4 rounded-full border border-slate-700 bg-slate-900 shadow-2xs"></div>
                <div>
                  <div className="text-slate-100">Inverted</div>
                  <div className="text-[11px] text-slate-400 font-normal">White on Black</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onContrastChange('yellow_on_black')}
                className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all col-span-2 ${
                  contrast === 'yellow_on_black'
                    ? 'border-amber-400 ring-2 ring-amber-300 bg-black text-amber-300'
                    : 'border-slate-800 bg-black text-amber-400 hover:bg-slate-950'
                }`}
              >
                <div className="w-4 h-4 rounded-full border border-amber-400 bg-black text-amber-400 flex items-center justify-center text-[10px] font-bold">
                  Y
                </div>
                <div>
                  <div>Yellow on Black</div>
                  <div className="text-[11px] text-amber-300/70 font-normal">High contrast for vision assistance</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
