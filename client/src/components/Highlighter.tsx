import React, { useState } from 'react';
import { Highlighter as HighlightIcon, Trash2 } from 'lucide-react';

interface HighlighterProps {
  onApplyHighlight: (color: 'yellow' | 'green') => void;
  onClearHighlights: () => void;
}

export const HighlighterToolbar: React.FC<HighlighterProps> = ({
  onApplyHighlight,
  onClearHighlights,
}) => {
  return (
    <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm text-xs">
      <span className="text-slate-500 font-medium flex items-center gap-1 mr-1">
        <HighlightIcon className="w-3.5 h-3.5 text-amber-500" />
        Highlighter:
      </span>
      <button
        onClick={() => onApplyHighlight('yellow')}
        className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded font-medium flex items-center gap-1 transition-colors"
        title="Select text and click to highlight yellow"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        Yellow
      </button>
      <button
        onClick={() => onApplyHighlight('green')}
        className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded font-medium flex items-center gap-1 transition-colors"
        title="Select text and click to highlight green"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        Green
      </button>
      <button
        onClick={onClearHighlights}
        className="px-2 py-1 text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded font-medium flex items-center gap-1 transition-colors ml-1"
        title="Remove all passage highlights"
      >
        <Trash2 className="w-3 h-3" />
        Clear
      </button>
    </div>
  );
};
