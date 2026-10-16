import React, { useState } from 'react';
import { QuestionGroup, QuestionItem, StudentAnswer } from '../types';
import { Flag, X } from 'lucide-react';

interface ListeningQuestionRendererProps {
  group: QuestionGroup;
  answers: Record<number, StudentAnswer>;
  onAnswerChange: (questionNumber: number, questionId: string, answer: string | string[]) => void;
  onToggleFlag?: (questionNumber: number, questionId: string) => void;
  activeQuestionNumber: number;
}

interface InlineGapInputProps {
  qNum: number;
  question: QuestionItem;
  currentVal: string;
  isActive: boolean;
  onAnswerChange: (questionNumber: number, questionId: string, answer: string) => void;
}

const InlineGapInput: React.FC<InlineGapInputProps> = ({
  qNum,
  question,
  currentVal,
  isActive,
  onAnswerChange,
}) => {
  return (
    <span
      id={`listening-q-box-${qNum}`}
      className="inline-flex items-center mx-1 my-0.5 align-middle select-none relative"
    >
      <input
        type="text"
        id={`question-input-${qNum}`}
        value={currentVal}
        placeholder={String(qNum)}
        onChange={(e) => onAnswerChange(qNum, question.id, e.target.value)}
        className={`h-7 min-w-[65px] max-w-[120px] px-2 text-center text-xs sm:text-sm font-medium border rounded-[2px] bg-white text-slate-900 transition-all ${
          isActive
            ? 'border-[#0066cc] ring-1 ring-[#0066cc]'
            : 'border-slate-300 hover:border-slate-400 focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] focus:outline-none'
        } placeholder:text-slate-400 placeholder:font-normal`}
      />
    </span>
  );
};

export const ListeningQuestionRenderer: React.FC<ListeningQuestionRendererProps> = ({
  group,
  answers,
  onAnswerChange,
  onToggleFlag,
  activeQuestionNumber,
}) => {
  // Drag and drop state for matching questions
  const [draggedOptionKey, setDraggedOptionKey] = useState<string | null>(null);
  const [draggedFromQuestionNumber, setDraggedFromQuestionNumber] = useState<number | null>(null);

  // Helper to render text with inline input gaps matching official IELTS (Image 1, Image 5)
  const renderTextWithGaps = (text: string) => {
    const parts = text.split(/(\[{1,2}(?:Q)?\d+\]{1,2})/g);

    return parts.map((part, index) => {
      const match = part.match(/^\[{1,2}(?:Q)?(\d+)\]{1,2}$/);
      if (match) {
        const qNum = parseInt(match[1], 10);
        const q = group.questions.find((item) => item.questionNumber === qNum);
        if (!q) {
          return <span key={index} className="font-bold">[{qNum}]</span>;
        }

        const currentVal = (answers[qNum]?.userAnswer as string) || '';
        const isActive = activeQuestionNumber === qNum;

        return (
          <InlineGapInput
            key={`gap-${qNum}-${index}`}
            qNum={qNum}
            question={q}
            currentVal={currentVal}
            isActive={isActive}
            onAnswerChange={(qn, qId, val) => onAnswerChange(qn, qId, val)}
          />
        );
      }

      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  // Format instruction text to bold official phrases like "ONE WORD AND/OR A NUMBER", "TWO letters, A–E", etc.
  const renderFormattedInstructions = (text: string) => {
    const formatted = text
      .replace(/\b(ONE WORD AND\/OR A NUMBER)\b/g, '**$1**')
      .replace(/\b(NO MORE THAN (?:TWO|THREE) WORDS AND\/OR A NUMBER)\b/g, '**$1**')
      .replace(/\b(NO MORE THAN (?:TWO|THREE) WORDS)\b/g, '**$1**')
      .replace(/\b(Choose TWO letters, A[–-]E)\b/g, 'Choose **TWO** letters, **A–E**')
      .replace(/\b(Choose THREE letters, A[–-]G)\b/g, 'Choose **THREE** letters, **A–G**')
      .replace(/\b(Choose the correct letter, A, B or C)\b/g, 'Choose the correct letter, **A**, **B** or **C**');

    const lines = formatted.split('\n');
    return (
      <div className="space-y-1">
        {lines.map((line, lIdx) => {
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={lIdx} className="text-sm text-slate-800 leading-relaxed font-normal">
              {parts.map((p, pIdx) => {
                if (p.startsWith('**') && p.endsWith('**')) {
                  return <strong key={pIdx} className="font-bold text-slate-950">{p.slice(2, -2)}</strong>;
                }
                return p;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  // Detect which question numbers are rendered inline
  const inlineQuestionNumbers = new Set<number>();
  if (group.contentWithGaps) {
    const matches = group.contentWithGaps.match(/\[{1,2}(?:Q)?(\d+)\]{1,2}/g);
    matches?.forEach((m) => {
      const num = parseInt(m.replace(/\D/g, ''), 10);
      if (!isNaN(num)) inlineQuestionNumbers.add(num);
    });
  }
  if (group.flowChartSteps) {
    group.flowChartSteps.forEach((step) => {
      const matches = step.descriptionWithGaps?.match(/\[{1,2}(?:Q)?(\d+)\]{1,2}/g);
      matches?.forEach((m) => {
        const num = parseInt(m.replace(/\D/g, ''), 10);
        if (!isNaN(num)) inlineQuestionNumbers.add(num);
      });
      step.questionNumbers?.forEach((n) => inlineQuestionNumbers.add(n));
    });
  }
  if (group.tableData) {
    group.tableData.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        if (cell.questionNumber) inlineQuestionNumbers.add(cell.questionNumber);
        const matches = cell.content?.match(/\[{1,2}(?:Q)?(\d+)\]{1,2}/g);
        matches?.forEach((m) => {
          const num = parseInt(m.replace(/\D/g, ''), 10);
          if (!isNaN(num)) inlineQuestionNumbers.add(num);
        });
      });
    });
  }
  if (group.formData) {
    group.formData.fields.forEach((field) => {
      if (field.questionNumber) inlineQuestionNumbers.add(field.questionNumber);
      if (field.defaultValue) {
        const matches = field.defaultValue.match(/\[{1,2}(?:Q)?(\d+)\]{1,2}/g);
        matches?.forEach((m) => {
          const num = parseInt(m.replace(/\D/g, ''), 10);
          if (!isNaN(num)) inlineQuestionNumbers.add(num);
        });
      }
      if (field.label) {
        const matches = field.label.match(/\[{1,2}(?:Q)?(\d+)\]{1,2}/g);
        matches?.forEach((m) => {
          const num = parseInt(m.replace(/\D/g, ''), 10);
          if (!isNaN(num)) inlineQuestionNumbers.add(num);
        });
      }
    });
  }

  // Multi-select handler for Choose TWO (or more) letters (Image 4)
  const isMultiSelect = group.questionType === 'listening_multiple_choice_multi';
  const multiGroupQuestions = group.questions;
  const multiRequiredCount = group.requiredSelectionCount || group.questions.length || 2;

  // Collect all currently selected keys across the paired questions
  const multiSelectedKeys: string[] = [];
  multiGroupQuestions.forEach((q) => {
    const val = answers[q.questionNumber]?.userAnswer;
    if (typeof val === 'string' && val.trim()) {
      if (!multiSelectedKeys.includes(val.trim())) multiSelectedKeys.push(val.trim());
    } else if (Array.isArray(val)) {
      val.forEach((k) => {
        if (k && !multiSelectedKeys.includes(k)) multiSelectedKeys.push(k);
      });
    }
  });

  const handleToggleMultiOption = (optKey: string) => {
    let updated: string[];
    if (multiSelectedKeys.includes(optKey)) {
      updated = multiSelectedKeys.filter((k) => k !== optKey);
    } else {
      if (multiSelectedKeys.length >= multiRequiredCount) {
        // Replace oldest or replace second
        updated = [...multiSelectedKeys.slice(1), optKey];
      } else {
        updated = [...multiSelectedKeys, optKey];
      }
    }

    // Assign each selected key to one of the questions in the group
    multiGroupQuestions.forEach((q, idx) => {
      const assignedVal = updated[idx] || '';
      onAnswerChange(q.questionNumber, q.id, assignedVal);
    });
  };

  return (
    <div className="mb-10 sm:mb-14 select-text">
      {/* 1. OFFICIAL GROUP HEADER & INSTRUCTIONS */}
      <div className="mb-5">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
          {group.title}
        </h3>
        {group.instructions && (
          <div className="mb-2">
            {renderFormattedInstructions(group.instructions)}
          </div>
        )}
        {group.wordLimitRule && !group.instructions.toLowerCase().includes(group.wordLimitRule.toLowerCase()) && (
          <p className="text-sm text-slate-800 font-normal">
            Write <strong className="font-bold text-slate-950">{group.wordLimitRule}</strong> for each answer.
          </p>
        )}
      </div>

      {/* 2. TABLE COMPLETION (Image 1) */}
      {group.questionType === 'table_completion' && group.tableData && (
        <div className="mb-8 overflow-x-auto">
          <table className="w-full border-collapse border border-slate-300 text-sm bg-white">
            <thead>
              <tr className="border-b border-slate-300 bg-[#F4F4F6]">
                {group.tableData.headers.map((header, hIdx) => (
                  <th
                    key={hIdx}
                    className="p-3 border-r border-slate-300 text-left text-xs font-bold text-slate-700 uppercase tracking-wider last:border-r-0"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.tableData.rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-slate-300 last:border-b-0 hover:bg-slate-50/40">
                  {row.cells.map((cell, cIdx) => {
                    const hasGapToken = cell.content && /\[{1,2}(?:Q)?\d+\]{1,2}/.test(cell.content);
                    const q = cell.questionNumber
                      ? group.questions.find((x) => x.questionNumber === cell.questionNumber)
                      : undefined;
                    const isActive = cell.questionNumber ? activeQuestionNumber === cell.questionNumber : false;

                    return (
                      <td
                        key={cIdx}
                        className="p-3.5 border-r border-slate-300 text-slate-800 last:border-r-0 align-top text-sm leading-relaxed"
                      >
                        {hasGapToken ? (
                          cell.content!.split('\n').map((line, lIdx) => (
                            <div key={lIdx} className={lIdx > 0 ? 'mt-1.5' : ''}>
                              {renderTextWithGaps(line)}
                            </div>
                          ))
                        ) : cell.isGap && cell.questionNumber && q ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {cell.content && <span>{cell.content}</span>}
                            <InlineGapInput
                              qNum={cell.questionNumber}
                              question={q}
                              currentVal={(answers[cell.questionNumber]?.userAnswer as string) || ''}
                              isActive={isActive}
                              onAnswerChange={(qn, qId, val) => onAnswerChange(qn, qId, val)}
                            />
                          </div>
                        ) : (
                          cell.content?.split('\n').map((line, lIdx) => (
                            <div key={lIdx} className={lIdx > 0 ? 'mt-1.5' : ''}>
                              {line}
                            </div>
                          ))
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. FORM COMPLETION (Clean form table matching official IELTS) */}
      {group.questionType === 'form_completion' && group.formData && (
        <div className="mb-8 border border-slate-300 rounded-[2px] p-5 sm:p-7 bg-white max-w-2xl shadow-2xs">
          {group.formData.formTitle && (
            <h4 className="font-bold text-base sm:text-lg text-slate-900 border-b border-slate-200 pb-3 mb-5 tracking-tight">
              {group.formData.formTitle}
            </h4>
          )}
          <div className="space-y-3">
            {group.formData.fields.map((field, fIdx) => {
              const q = field.questionNumber
                ? group.questions.find((x) => x.questionNumber === field.questionNumber)
                : undefined;
              const isActive = field.questionNumber ? activeQuestionNumber === field.questionNumber : false;
              const hasGapInDefault = field.defaultValue && /\[{1,2}(?:Q)?\d+\]{1,2}/.test(field.defaultValue);
              const hasGapInLabel = field.label && /\[{1,2}(?:Q)?\d+\]{1,2}/.test(field.label);

              return (
                <div
                  key={fIdx}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-4 text-sm text-slate-800 py-0.5"
                >
                  <div className="w-full sm:w-44 shrink-0 font-semibold text-slate-900 select-none">
                    {hasGapInLabel ? renderTextWithGaps(field.label) : field.label || ''}
                  </div>
                  <div className="flex-1 flex items-baseline flex-wrap gap-1 text-slate-800">
                    {hasGapInDefault ? (
                      renderTextWithGaps(field.defaultValue!)
                    ) : field.isGap && field.questionNumber && q ? (
                      <div className="inline-flex items-baseline gap-1 flex-wrap">
                        {field.defaultValue && <span className="text-slate-800">{field.defaultValue}</span>}
                        <InlineGapInput
                          qNum={field.questionNumber}
                          question={q}
                          currentVal={(answers[field.questionNumber]?.userAnswer as string) || ''}
                          isActive={isActive}
                          onAnswerChange={(qn, qId, val) => onAnswerChange(qn, qId, val)}
                        />
                        {field.placeholder && <span className="text-slate-800">{field.placeholder}</span>}
                      </div>
                    ) : (
                      <span className="text-slate-700">{field.defaultValue || ''}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. MATCHING WITH DRAG & DROP AND OPTION CARDS (Image 3) */}
      {group.questionType === 'matching' && group.optionsList && (() => {
        const isOptionReuseAllowed =
          Boolean(group.optionReuseAllowed) ||
          Boolean(group.optionsList && group.questions && group.optionsList.length < group.questions.length);

        return (
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Questions with Drop Zones (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {group.questions.map((q) => {
              const currentVal = (answers[q.questionNumber]?.userAnswer as string) || '';
              const matchedOption = group.optionsList?.find(
                (opt) => opt.key.toUpperCase() === currentVal.toUpperCase()
              );
              const isActive = activeQuestionNumber === q.questionNumber;
              const cleanPrompt = q.prompt.replace(/^\d+\.\s*/, '');

              return (
                <div
                  key={q.id}
                  id={`listening-q-box-${q.questionNumber}`}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 border-b border-slate-200/80 last:border-b-0 transition-colors ${
                    isActive ? 'bg-slate-50/70 -mx-2 px-2 rounded-[2px]' : ''
                  }`}
                >
                  {/* Prompt with question number */}
                  <div className="flex items-start gap-2.5 text-sm text-slate-900 flex-1">
                    <span className="font-bold text-sm text-slate-900 min-w-5">{q.questionNumber}</span>
                    <span className="leading-relaxed font-normal">{cleanPrompt}</span>
                  </div>

                  {/* Drop Zone Box matching Image 3 */}
                  <div
                    draggable={!!currentVal}
                    onDragStart={(e) => {
                      if (currentVal) {
                        e.dataTransfer.setData('text/plain', currentVal);
                        setDraggedOptionKey(currentVal);
                        setDraggedFromQuestionNumber(q.questionNumber);
                      }
                    }}
                    onDragEnd={() => {
                      setDraggedOptionKey(null);
                      setDraggedFromQuestionNumber(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'copy';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const droppedKey = (
                        e.dataTransfer.getData('text/plain') || draggedOptionKey || ''
                      ).trim().toUpperCase();

                      if (droppedKey) {
                        if (!isOptionReuseAllowed) {
                          const prevQ = group.questions.find(
                            (x) =>
                              x.questionNumber !== q.questionNumber &&
                              (answers[x.questionNumber]?.userAnswer as string)?.trim().toUpperCase() === droppedKey
                          );
                          if (prevQ) {
                            onAnswerChange(prevQ.questionNumber, prevQ.id, '');
                          }
                        }
                        onAnswerChange(q.questionNumber, q.id, droppedKey);
                      }
                      setDraggedOptionKey(null);
                      setDraggedFromQuestionNumber(null);
                    }}
                    onClick={() => {
                      // Click-to-assign: if user clicked an option, assign it; otherwise focus question
                      if (draggedOptionKey) {
                        const targetKey = draggedOptionKey.toUpperCase();
                        if (!isOptionReuseAllowed) {
                          const prevQ = group.questions.find(
                            (x) =>
                              x.questionNumber !== q.questionNumber &&
                              (answers[x.questionNumber]?.userAnswer as string)?.trim().toUpperCase() === targetKey
                          );
                          if (prevQ) {
                            onAnswerChange(prevQ.questionNumber, prevQ.id, '');
                          }
                        }
                        onAnswerChange(q.questionNumber, q.id, targetKey);
                        setDraggedOptionKey(null);
                      }
                    }}
                    className={`min-w-[170px] sm:min-w-[190px] max-w-[260px] h-9 px-3 rounded-[2px] transition-all flex items-center justify-between gap-2 select-none ${
                      currentVal
                        ? 'border border-slate-300 bg-white shadow-2xs'
                        : isActive
                        ? 'border border-dashed border-[#0066cc] bg-blue-50/30 ring-1 ring-[#0066cc]/20'
                        : 'border border-dashed border-sky-400 bg-sky-50/30 hover:border-sky-500'
                    }`}
                  >
                    {currentVal ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">
                            {currentVal}
                          </span>
                          <span className="text-xs text-slate-700 truncate max-w-[130px]">
                            {matchedOption ? matchedOption.text : ''}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAnswerChange(q.questionNumber, q.id, '');
                          }}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 ml-1"
                          title="Clear answer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-slate-400 w-full">
                        <span className="font-semibold text-slate-600">{q.questionNumber}</span>
                        <span className="italic text-slate-400">Drop answer here</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Option Cards Container matching Image 3 (5 cols) */}
          <div
            onDragOver={(e) => {
              if (draggedFromQuestionNumber) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }
            }}
            onDrop={(e) => {
              if (draggedFromQuestionNumber) {
                e.preventDefault();
                const targetQ = group.questions.find(
                  (x) => x.questionNumber === draggedFromQuestionNumber
                );
                if (targetQ) onAnswerChange(draggedFromQuestionNumber, targetQ.id, '');
                setDraggedFromQuestionNumber(null);
                setDraggedOptionKey(null);
              }
            }}
            className="lg:col-span-5 border border-slate-300 rounded-[2px] p-4 bg-white shadow-2xs space-y-2.5"
          >
            {group.optionsList.map((opt) => {
              const isSelectedForDrop = draggedOptionKey === opt.key;
              const isUsed =
                !isOptionReuseAllowed &&
                group.questions.some(
                  (q) =>
                    (answers[q.questionNumber]?.userAnswer as string)?.trim().toUpperCase() ===
                    opt.key.toUpperCase()
                );

              if (isUsed) {
                return (
                  <div
                    key={opt.key}
                    className="border border-dashed border-slate-200 bg-slate-50/40 rounded-[2px] p-3 text-sm min-h-[46px] flex items-center select-none"
                    aria-label={`Option ${opt.key} is in use`}
                  >
                    <span className="font-bold text-slate-300 min-w-4 text-sm">{opt.key}</span>
                  </div>
                );
              }

              return (
                <div
                  key={opt.key}
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', opt.key);
                    setDraggedOptionKey(opt.key);
                  }}
                  onDragEnd={() => setDraggedOptionKey(null)}
                  onClick={() => {
                    // Quick-assign to currently active question if within this group
                    const isQuestionInGroup = group.questions.some(
                      (x) => x.questionNumber === activeQuestionNumber
                    );
                    if (isQuestionInGroup) {
                      const targetQ = group.questions.find(
                        (x) => x.questionNumber === activeQuestionNumber
                      );
                      if (targetQ) {
                        if (!isOptionReuseAllowed) {
                          const prevQ = group.questions.find(
                            (x) =>
                              x.questionNumber !== targetQ.questionNumber &&
                              (answers[x.questionNumber]?.userAnswer as string)?.trim().toUpperCase() ===
                                opt.key.toUpperCase()
                          );
                          if (prevQ) onAnswerChange(prevQ.questionNumber, prevQ.id, '');
                        }
                        onAnswerChange(activeQuestionNumber, targetQ.id, opt.key);
                      }
                    } else {
                      // Toggle active option key for click-to-drop
                      setDraggedOptionKey(isSelectedForDrop ? null : opt.key);
                    }
                  }}
                  className={`border rounded-[2px] p-3 text-sm flex items-center gap-3.5 transition-all select-none cursor-grab active:cursor-grabbing shadow-2xs ${
                    isSelectedForDrop
                      ? 'border-[#0066cc] bg-blue-50/50 ring-1 ring-[#0066cc]'
                      : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/50 text-slate-900'
                  }`}
                  title="Drag or click to assign to question"
                >
                  <span className="font-bold text-slate-900 min-w-4 text-sm">{opt.key}</span>
                  <span className="text-slate-800 font-normal leading-snug">{opt.text}</span>
                </div>
              );
            })}
          </div>
        </div>
        );
      })()}

      {/* 5. MULTIPLE CHOICE MULTI-SELECT (Choose TWO letters, Image 4) */}
      {isMultiSelect && (() => {
        const rawPrompt = multiGroupQuestions[0]?.prompt || '';
        const cleanPrompt = rawPrompt.replace(/\s*\((?:First|Second|1st|2nd)\s+choice\)/i, '').trim();
        const normPrompt = cleanPrompt.toLowerCase().replace(/[^\w\s]/g, '');
        const normInstructions = (group.instructions || '').toLowerCase().replace(/[^\w\s]/g, '');
        const isDuplicate = normPrompt.length > 0 && normInstructions.includes(normPrompt);

        return (
          <div className="mb-8 space-y-2 max-w-3xl">
            {cleanPrompt && !isDuplicate && (
              <h4 className="font-medium text-sm sm:text-base text-slate-900 mb-3 leading-relaxed">
                {cleanPrompt}
              </h4>
            )}
            <div className="space-y-1.5">
            {multiGroupQuestions[0]?.options?.map((opt) => {
              const isSelected = multiSelectedKeys.includes(opt.key);

              return (
                <div
                  key={opt.key}
                  onClick={() => handleToggleMultiOption(opt.key)}
                  className={`px-4 py-2.5 rounded-[2px] cursor-pointer flex items-center gap-3.5 text-sm transition-colors select-none ${
                    isSelected
                      ? 'bg-[#DCEBFA] text-slate-900 font-medium'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className="font-bold min-w-4 text-slate-900">{opt.key}</span>
                  <span className="leading-snug text-slate-900">{opt.text}</span>
                </div>
              );
            })}
            </div>
          </div>
        );
      })()}

      {/* 6. GAPPED CONTENT / SUMMARY / NOTES (Image 5) */}
      {group.contentWithGaps && (
        <div className="mb-8 space-y-2 text-sm sm:text-[15px] leading-[1.85] text-slate-800 font-sans max-w-3xl">
          {group.contentWithGaps.split('\n').map((line, lIdx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={lIdx} className="h-2" />;

            const hasGap = /\[{1,2}(?:Q)?\d+\]{1,2}/.test(trimmed);

            // Subheadings like "Natural rubber" or "New threats include"
            const isSubheading =
              !hasGap &&
              !trimmed.startsWith('•') &&
              (trimmed.endsWith(':') ||
                trimmed.length < 50 && !trimmed.endsWith('.'));

            if (isSubheading) {
              return (
                <div key={lIdx} className="font-bold text-sm sm:text-base text-slate-900 mt-4 mb-1">
                  {trimmed}
                </div>
              );
            }

            return (
              <div key={lIdx} className="my-1">
                {renderTextWithGaps(line)}
              </div>
            );
          })}
        </div>
      )}

      {/* 7. PLAN, MAP, AND DIAGRAM LABELLING */}
      {group.questionType === 'plan_map_diagram_labelling' && group.mapData && (
        <div className="mb-8 max-w-3xl">
          <div className="border border-slate-300 rounded-[2px] p-3 bg-white mb-4 shadow-2xs">
            {group.mapData.caption && (
              <div className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
                {group.mapData.caption}
              </div>
            )}
            <div className="w-full flex justify-center items-center overflow-hidden bg-white p-2">
              <img
                src={group.mapData.imageUrl}
                alt={group.mapData.caption || 'Diagram'}
                className="max-h-96 object-contain w-auto"
              />
            </div>
          </div>

          {/* Letter options list */}
          {group.optionsList && (
            <div className="border border-slate-300 rounded-[2px] p-3 mb-5 bg-white">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Available Locations:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {group.optionsList.map((opt) => (
                  <div key={opt.key} className="bg-slate-50 px-2.5 py-1 rounded-[2px] border border-slate-200 text-xs font-bold text-slate-900">
                    {opt.key}: <span className="font-normal text-slate-700">{opt.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. FLOW CHART COMPLETION */}
      {group.questionType === 'flow_chart_completion' && group.flowChartSteps && (
        <div className="mb-8 space-y-0 max-w-xl">
          {group.optionsList && (
            <div className="border border-slate-300 rounded-[2px] p-3 mb-5 bg-white shadow-2xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Options:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {group.optionsList.map((opt) => (
                  <div key={opt.key} className="bg-slate-50 px-2.5 py-1 rounded-[2px] border border-slate-200 text-xs font-bold text-slate-900">
                    {opt.key}: <span className="font-normal text-slate-700">{opt.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {group.flowChartSteps.map((step, sIdx) => {
            const isStepActive = step.questionNumbers?.includes(activeQuestionNumber);

            return (
              <React.Fragment key={step.stepNumber || sIdx}>
                <div
                  className={`border rounded-[2px] p-4 bg-white transition-all ${
                    isStepActive ? 'border-slate-900 ring-1 ring-slate-900 shadow-2xs' : 'border-slate-300'
                  }`}
                >
                  {step.title && (
                    <div className="font-bold text-sm text-slate-900 mb-1.5">{step.title}</div>
                  )}
                  <div className="text-sm text-slate-800 leading-relaxed">
                    {renderTextWithGaps(step.descriptionWithGaps)}
                  </div>
                </div>
                {sIdx < group.flowChartSteps!.length - 1 && (
                  <div className="flex justify-center my-2 text-slate-400">
                    <svg
                      className="w-5 h-5 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v14m0 0l-4-4m4 4l4-4" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* 9. REMAINING STANDARD QUESTIONS (MCQ Single Image 2, Map Dropdowns, Short Answer) */}
      {!isMultiSelect && group.questionType !== 'matching' && (
        <div
          className={`${
            group.questionType === 'plan_map_diagram_labelling' ? 'space-y-2' : 'space-y-6'
          } pt-1 max-w-3xl`}
        >
          {group.questions.map((q) => {
            // Skip questions already rendered inline inside tables, forms, or contentWithGaps
            if (inlineQuestionNumbers.has(q.questionNumber)) return null;

            const currentAnswer = answers[q.questionNumber]?.userAnswer;
            const isActive = activeQuestionNumber === q.questionNumber;

            {/* Plan, Map & Diagram Labelling (Dropdown placed next to each question) */}
            if (group.questionType === 'plan_map_diagram_labelling') {
              return (
                <div
                  key={q.id}
                  id={`listening-q-box-${q.questionNumber}`}
                  className={`transition-colors py-2 px-2.5 rounded-[2px] flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 ${
                    isActive ? 'bg-slate-50/80 ring-1 ring-slate-200' : 'hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-[160px] sm:min-w-[220px]">
                    <span className="font-bold text-sm sm:text-base text-slate-900 min-w-5">
                      {q.questionNumber}
                    </span>
                    <span className="text-sm sm:text-base text-slate-900 font-normal leading-relaxed">
                      {renderTextWithGaps(q.prompt)}
                    </span>
                  </div>

                  {group.optionsList && (
                    <select
                      id={`question-input-${q.questionNumber}`}
                      value={(currentAnswer as string) || ''}
                      onChange={(e) => onAnswerChange(q.questionNumber, q.id, e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-[2px] text-sm bg-white font-medium text-slate-800 focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] focus:outline-none cursor-pointer"
                    >
                      <option value="">Select location (A, B, C...)</option>
                      {group.optionsList.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.key}: {opt.text}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            }

            return (
              <div
                key={q.id}
                id={`listening-q-box-${q.questionNumber}`}
                className={`transition-colors py-1 ${isActive ? 'bg-slate-50/70 -mx-3 px-3 rounded-[2px]' : ''}`}
              >
                {/* Question Prompt */}
                <div className="flex items-start gap-3 mb-2.5">
                  <span className="font-bold text-sm sm:text-base text-slate-900 min-w-5">
                    {q.questionNumber}
                  </span>
                  <div className="text-sm sm:text-base text-slate-900 font-normal leading-relaxed">
                    {renderTextWithGaps(q.prompt.replace(new RegExp(`^${q.questionNumber}\\.\\s*`), ''))}
                  </div>
                </div>

                {/* Multiple Choice Single (Image 2) */}
                {(group.questionType === 'listening_multiple_choice_single' ||
                  group.questionType === 'multiple_choice_single' ||
                  (group.questionType as string) === 'multiple_choice') && q.options && (
                  <div className="space-y-1.5 pl-8 pt-1">
                    {q.options.map((opt) => (
                      <label
                        key={opt.key}
                        className="flex items-start gap-3 cursor-pointer py-1.5 select-none hover:text-slate-950"
                      >
                        <input
                          type="radio"
                          name={`lq_${q.questionNumber}`}
                          value={opt.key}
                          checked={currentAnswer === opt.key}
                          onChange={() => onAnswerChange(q.questionNumber, q.id, opt.key)}
                          className="w-4 h-4 mt-0.5 text-slate-900 border-slate-300 focus:ring-0 cursor-pointer accent-slate-900"
                        />
                        <span className="text-sm text-slate-800 leading-snug">
                          <strong className="mr-2 font-bold text-slate-900">{opt.key}</strong>
                          {opt.text}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Short Answer / Fill in Text Gap (only if prompt does not contain inline gap) */}
                {(group.questionType === 'short_answer' ||
                  group.questionType === 'sentence_completion' ||
                  group.questionType === 'note_completion') &&
                  !/\[{1,2}(?:Q)?\d+\]{1,2}/.test(q.prompt) && (
                  <div className="pl-8 pt-1">
                    <input
                      type="text"
                      id={`question-input-${q.questionNumber}`}
                      value={(currentAnswer as string) || ''}
                      onChange={(e) => onAnswerChange(q.questionNumber, q.id, e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full sm:w-80 px-2.5 py-1.5 border border-slate-300 rounded-[2px] text-sm font-medium focus:border-[#0066cc] bg-white text-slate-900"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
