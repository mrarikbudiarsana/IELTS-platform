import React, { useState } from 'react';
import { QuestionGroup, QuestionItem, StudentAnswer } from '../types';
import { Flag, X, ChevronDown } from 'lucide-react';

interface QuestionRendererProps {
  group: QuestionGroup;
  answers: Record<number, StudentAnswer>;
  onAnswerChange: (questionNumber: number, questionId: string, answer: string | string[]) => void;
  onToggleFlag: (questionNumber: number, questionId: string) => void;
  activeQuestionNumber: number;
}

interface InlineGapSlotProps {
  qNum: number;
  question: QuestionItem;
  optionsList?: { key: string; text: string }[];
  currentVal: string;
  isActive: boolean;
  isFlagged: boolean;
  onAnswerChange: (questionNumber: number, questionId: string, answer: string) => void;
  onToggleFlag: (questionNumber: number, questionId: string) => void;
}

const InlineGapSlot: React.FC<InlineGapSlotProps> = ({
  qNum,
  question,
  optionsList,
  currentVal,
  isActive,
  isFlagged,
  onAnswerChange,
  onToggleFlag,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  // If there are options (e.g. Word Bank / Summary Completion with Options)
  if (optionsList && optionsList.length > 0) {
    const matchedOpt = optionsList.find(
      (opt) => opt.key.toUpperCase() === currentVal.toUpperCase() || opt.text.toLowerCase() === currentVal.toLowerCase()
    );

    return (
      <span
        id={`question-box-${qNum}`}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const droppedText =
            e.dataTransfer.getData('text/plain') ||
            e.dataTransfer.getData('application/ielts-key');
          if (droppedText) {
            onAnswerChange(qNum, question.id, droppedText.trim());
          }
        }}
        className="inline-flex items-center mx-1 my-0.5 align-middle select-none relative group"
      >
        {currentVal ? (
          <div
            className={`inline-flex items-center gap-1.5 h-7 px-2.5 text-xs sm:text-sm font-medium border rounded-[2px] transition-all bg-white ${
              isActive
                ? 'border-slate-800 ring-1 ring-slate-800'
                : 'border-slate-300 hover:border-slate-500'
            }`}
          >
            <span className="text-slate-900 truncate max-w-[140px]">
              {matchedOpt ? matchedOpt.text : currentVal}
            </span>
            <button
              type="button"
              onClick={() => onAnswerChange(qNum, question.id, '')}
              className="text-slate-400 hover:text-rose-600 transition-colors"
              title="Clear answer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div
            className={`relative inline-flex items-center h-7 min-w-[70px] max-w-[120px] border border-dashed rounded-[2px] bg-white transition-all ${
              isDragOver
                ? 'border-slate-800 bg-slate-50 ring-1 ring-slate-400'
                : isActive
                ? 'border-slate-800 ring-1 ring-slate-800'
                : 'border-slate-300 hover:border-slate-500'
            }`}
          >
            <span className="w-full text-center text-xs sm:text-sm text-slate-400 font-normal select-none">
              {qNum}
            </span>
            <select
              aria-label={`Select answer for question ${qNum}`}
              value=""
              onChange={(e) => onAnswerChange(qNum, question.id, e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            >
              <option value="">Choose option</option>
              {optionsList.map((opt) => (
                <option key={opt.key} value={opt.text || opt.key}>
                  {opt.text || opt.key}
                </option>
              ))}
            </select>
          </div>
        )}
      </span>
    );
  }

  // Standard Word / Sentence / Note completion inline input matching Images 1, 4, 6
  return (
    <span
      id={`question-box-${qNum}`}
      className="inline-flex items-center mx-1 my-0.5 align-middle select-none relative"
    >
      <input
        type="text"
        id={`question-input-${qNum}`}
        value={currentVal}
        placeholder={String(qNum)}
        onChange={(e) => onAnswerChange(qNum, question.id, e.target.value)}
        className={`h-7 min-w-[65px] max-w-[130px] px-2 text-center text-xs sm:text-sm font-medium border rounded-[2px] bg-white text-slate-900 transition-all ${
          isActive
            ? 'border-slate-900 ring-1 ring-slate-900'
            : 'border-slate-300 hover:border-slate-400 focus:border-slate-900 focus:outline-none'
        } placeholder:text-slate-400 placeholder:font-normal`}
      />
    </span>
  );
};

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  group,
  answers,
  onAnswerChange,
  onToggleFlag,
  activeQuestionNumber,
}) => {
  // Helper to render text with inline input gaps matching official IELTS
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
        const isFlagged = !!answers[qNum]?.isFlagged;
        const isActive = activeQuestionNumber === qNum;

        return (
          <InlineGapSlot
            key={`gap-${qNum}-${index}`}
            qNum={qNum}
            question={q}
            optionsList={group.optionsList}
            currentVal={currentVal}
            isActive={isActive}
            isFlagged={isFlagged}
            onAnswerChange={onAnswerChange}
            onToggleFlag={onToggleFlag}
          />
        );
      }

      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  // Detect which question numbers are rendered inline to avoid duplicating below
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
    });
  }
  if (group.diagramData) {
    group.diagramData.labels.forEach((lbl) => {
      inlineQuestionNumbers.add(lbl.questionNumber);
    });
  }

  const remainingQuestions = group.questions.filter((q) => !inlineQuestionNumbers.has(q.questionNumber));

  // Check if matching matrix format (e.g. text has sections A-G, Image 3)
  const isMatchingMatrix =
    group.questionType === 'matching_information' &&
    group.optionsList &&
    group.optionsList.length > 0;

  return (
    <div className="mb-10 select-text">
      {/* 1. OFFICIAL GROUP HEADER & INSTRUCTIONS */}
      <div className="mb-4">
        <h3 className="font-bold text-base text-slate-900 mb-1.5 leading-snug">
          {group.title}
        </h3>
        <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed mb-1.5">
          {group.instructions}
        </p>
        {group.wordLimitRule && !group.instructions.toLowerCase().includes(group.wordLimitRule.toLowerCase()) && (
          <div className="text-sm text-slate-800 font-normal">
            Choose <strong className="font-bold">{group.wordLimitRule}</strong> from the passage for each answer.
          </div>
        )}
      </div>

      {/* DIAGRAM DISPLAY (for diagram_completion / diagramData) */}
      {group.diagramData?.imageUrl && (
        <div className="mb-6 p-4 bg-white border border-slate-200 rounded-lg shadow-xs max-w-2xl">
          {group.diagramData.caption && (
            <div className="text-sm font-semibold text-slate-800 mb-2">
              {group.diagramData.caption}
            </div>
          )}
          <img
            src={group.diagramData.imageUrl}
            alt={group.diagramData.caption || 'Diagram'}
            className="max-h-96 mx-auto rounded object-contain border border-slate-100"
          />
        </div>
      )}

      {/* 2. MATCHING CLASSIFICATION / LIST OF PEOPLE (Matching Image 5) */}
      {group.questionType === 'matching_features' && group.optionsList && (
        <div className="border border-slate-300 rounded-[2px] p-4 mb-5 bg-white max-w-md">
          <h4 className="font-bold text-sm text-slate-900 mb-2">
            List of people
          </h4>
          <div className="space-y-1.5 text-sm text-slate-800">
            {group.optionsList.map((opt) => (
              <div key={opt.key} className="flex items-center gap-4">
                <span className="font-bold min-w-4">{opt.key}</span>
                <span>{opt.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MATCHING MATRIX / TABLE (Matching Image 3: Sections A-G Columns) */}
      {isMatchingMatrix && group.optionsList && (
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse border border-slate-300 text-sm bg-white">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="p-3 border-r border-slate-300 text-left font-normal text-slate-400 w-2/3"></th>
                {group.optionsList.map((opt) => (
                  <th
                    key={opt.key}
                    className="p-2 border-r border-slate-300 text-center font-bold text-slate-900 last:border-r-0 min-w-8"
                  >
                    {opt.key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.questions.map((q) => {
                const currentAnswer = answers[q.questionNumber]?.userAnswer;
                return (
                  <tr key={q.id} id={`question-box-${q.questionNumber}`} className="border-b border-slate-300 last:border-b-0 hover:bg-slate-50/50">
                    <td className="p-3 border-r border-slate-300 text-slate-800 leading-snug">
                      <strong className="font-bold text-slate-900 mr-2.5">{q.questionNumber}</strong>
                      <span>{q.prompt}</span>
                    </td>
                    {group.optionsList!.map((opt) => (
                      <td
                        key={opt.key}
                        className="p-2 border-r border-slate-300 text-center last:border-r-0 align-middle"
                      >
                        <input
                          type="radio"
                          name={`matrix_${q.questionNumber}`}
                          value={opt.key}
                          checked={currentAnswer === opt.key}
                          onChange={() => onAnswerChange(q.questionNumber, q.id, opt.key)}
                          className="w-4 h-4 text-slate-900 border-slate-300 focus:ring-0 cursor-pointer accent-slate-900"
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 3.5 FLOW CHART COMPLETION */}
      {group.flowChartSteps && group.flowChartSteps.length > 0 && (
        <div className="mb-6 space-y-0 max-w-xl">
          {group.flowChartSteps.map((step, sIdx) => {
            const isStepActive = step.questionNumbers?.includes(activeQuestionNumber);

            return (
              <React.Fragment key={step.stepNumber || sIdx}>
                <div
                  className={`border rounded-[2px] p-4 bg-white transition-all ${
                    isStepActive
                      ? 'border-slate-800 shadow-xs ring-1 ring-slate-800/10'
                      : 'border-slate-300'
                  }`}
                >
                  {step.title && (
                    <div className="font-bold text-sm text-slate-900 mb-1.5">
                      {step.title}
                    </div>
                  )}
                  <div className="text-sm text-slate-800 leading-relaxed font-sans">
                    {renderTextWithGaps(step.descriptionWithGaps)}
                  </div>
                </div>

                {/* Downward connecting arrow between steps */}
                {sIdx < group.flowChartSteps!.length - 1 && (
                  <div className="flex justify-center my-2 text-slate-400">
                    <svg
                      className="w-5 h-5 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4v14m0 0l-4-4m4 4l4-4"
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* Word Bank Option Cards if optionsList is provided */}
          {group.optionsList && group.optionsList.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-200">
              <div className="flex flex-wrap gap-2.5">
                {group.optionsList.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', opt.text || opt.key);
                    }}
                    onClick={() => {
                      if (inlineQuestionNumbers.has(activeQuestionNumber)) {
                        const targetQ = group.questions.find(
                          (x) => x.questionNumber === activeQuestionNumber
                        );
                        if (targetQ) onAnswerChange(activeQuestionNumber, targetQ.id, opt.text || opt.key);
                      }
                    }}
                    className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-3.5 py-1.5 text-xs sm:text-sm rounded-[2px] transition-colors shadow-2xs select-none cursor-pointer"
                  >
                    {opt.text || opt.key}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3.6 TABLE COMPLETION */}
      {group.tableData && (
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse border border-slate-300 text-sm bg-white">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-50/70">
                {group.tableData.headers.map((h, hIdx) => (
                  <th key={hIdx} className="p-2.5 border-r border-slate-300 text-left font-bold text-slate-900 last:border-r-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.tableData.rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-slate-300 last:border-b-0 hover:bg-slate-50/30">
                  {row.cells.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2.5 border-r border-slate-300 text-slate-800 last:border-r-0 align-middle">
                      {cell.content ? renderTextWithGaps(cell.content) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. GAPPED CONTENT / SUMMARY / NOTES (Matching Images 1, 4, 6) */}
      {group.contentWithGaps && (
        <div className="mb-5 space-y-2 text-sm leading-[1.8] text-slate-800 font-sans">
          {group.contentWithGaps.split('\n').map((line, lIdx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={lIdx} className="h-2" />;

            const hasGap = /\[{1,2}(?:Q)?\d+\]{1,2}/.test(trimmed);

            // Subheadings like "Family and early life" or "Flotation Tanks"
            const isSubheading =
              !hasGap &&
              (trimmed.endsWith(':') ||
                trimmed.length < 50 && !trimmed.endsWith('.'));

            if (isSubheading) {
              return (
                <div key={lIdx} className="font-bold text-sm text-slate-900 mt-3 mb-1">
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

          {/* Word Bank Option Cards (Matching Image 6) */}
          {group.optionsList && group.optionsList.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-200">
              <div className="flex flex-wrap gap-2.5">
                {group.optionsList.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', opt.text || opt.key);
                    }}
                    onClick={() => {
                      // Automatically fills active question gap if active
                      if (inlineQuestionNumbers.has(activeQuestionNumber)) {
                        const targetQ = group.questions.find(
                          (x) => x.questionNumber === activeQuestionNumber
                        );
                        if (targetQ) onAnswerChange(activeQuestionNumber, targetQ.id, opt.text || opt.key);
                      }
                    }}
                    className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-3.5 py-1.5 text-xs sm:text-sm rounded-[2px] transition-colors shadow-2xs select-none cursor-pointer"
                  >
                    {opt.text || opt.key}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. REMAINING QUESTIONS LIST (Matching Images 2, 5, 7) */}
      {!isMatchingMatrix && remainingQuestions.length > 0 && (
        <div className="space-y-6 pt-2">
          {remainingQuestions.map((q) => {
            const currentAnswer = answers[q.questionNumber]?.userAnswer;
            const isActive = activeQuestionNumber === q.questionNumber;
            const hasInlineGapInPrompt = /\[{1,2}(?:Q)?\d+\]{1,2}/.test(q.prompt);

            return (
              <div
                key={q.id}
                id={`question-box-${q.questionNumber}`}
                className={`transition-colors ${isActive ? 'bg-slate-50/70 -mx-3 px-3 py-2 rounded' : ''}`}
              >
                {/* Question Prompt */}
                <div className="flex items-start gap-3 mb-2">
                  <span className="font-bold text-sm sm:text-base text-slate-900 min-w-5">
                    {q.questionNumber}
                  </span>
                  <div className="text-sm sm:text-base text-slate-800 font-normal leading-relaxed">
                    {renderTextWithGaps(q.prompt)}
                  </div>
                </div>

                {/* TRUE / FALSE / NOT GIVEN (Matching Image 2) */}
                {group.questionType === 'true_false_not_given' && (
                  <div className="space-y-1.5 pl-8 pt-1">
                    {['TRUE', 'FALSE', 'NOT GIVEN'].map((choice) => (
                      <label
                        key={choice}
                        className="flex items-center gap-3 text-sm text-slate-800 cursor-pointer py-1 select-none"
                      >
                        <input
                          type="radio"
                          name={`q_${q.questionNumber}`}
                          value={choice}
                          checked={currentAnswer === choice}
                          onChange={() => onAnswerChange(q.questionNumber, q.id, choice)}
                          className="w-4 h-4 text-slate-900 border-slate-300 focus:ring-0 cursor-pointer accent-slate-900"
                        />
                        <span className={currentAnswer === choice ? 'font-bold text-slate-950' : 'font-normal text-slate-700'}>
                          {choice}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* YES / NO / NOT GIVEN (Matching Image 7) */}
                {group.questionType === 'yes_no_not_given' && (
                  <div className="space-y-1.5 pl-8 pt-1">
                    {['YES', 'NO', 'NOT GIVEN'].map((choice) => (
                      <label
                        key={choice}
                        className="flex items-center gap-3 text-sm text-slate-800 cursor-pointer py-1 select-none"
                      >
                        <input
                          type="radio"
                          name={`q_${q.questionNumber}`}
                          value={choice}
                          checked={currentAnswer === choice}
                          onChange={() => onAnswerChange(q.questionNumber, q.id, choice)}
                          className="w-4 h-4 text-slate-900 border-slate-300 focus:ring-0 cursor-pointer accent-slate-900"
                        />
                        <span className={currentAnswer === choice ? 'font-bold text-slate-950' : 'font-normal text-slate-700'}>
                          {choice}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* SINGLE MULTIPLE CHOICE */}
                {group.questionType === 'multiple_choice_single' && q.options && (
                  <div className="space-y-1.5 pl-8 pt-1">
                    {q.options.map((opt) => (
                      <label
                        key={opt.key}
                        className="flex items-start gap-3 cursor-pointer py-1 select-none"
                      >
                        <input
                          type="radio"
                          name={`q_${q.questionNumber}`}
                          value={opt.key}
                          checked={currentAnswer === opt.key}
                          onChange={() => onAnswerChange(q.questionNumber, q.id, opt.key)}
                          className="w-4 h-4 mt-0.5 text-slate-900 border-slate-300 focus:ring-0 cursor-pointer accent-slate-900"
                        />
                        <span className="text-sm text-slate-800 leading-snug">
                          <strong className="mr-1.5 font-bold text-slate-900">{opt.key}.</strong>
                          {opt.text}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* MATCHING PEOPLE / CLASSIFICATION SELECTION (Matching Image 5) */}
                {group.questionType === 'matching_features' && group.optionsList && (
                  <div className="pl-8 pt-1">
                    <select
                      value={(currentAnswer as string) || ''}
                      onChange={(e) => onAnswerChange(q.questionNumber, q.id, e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-[2px] text-sm bg-white font-medium text-slate-800 focus:border-slate-800"
                    >
                      <option value="">Select person (A, B, C...)</option>
                      {group.optionsList.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.key}: {opt.text}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* STANDALONE FILL-IN TEXT GAP (if prompt doesn't already have an inline input gap) */}
                {(group.questionType === 'sentence_completion' ||
                  group.questionType === 'short_answer' ||
                  group.questionType === 'note_completion' ||
                  group.questionType === 'flow_chart_completion' ||
                  group.questionType === 'summary_completion' ||
                  group.questionType === 'table_completion') &&
                  !hasInlineGapInPrompt && (
                  <div className="pl-8 pt-1">
                    <input
                      type="text"
                      id={`question-input-${q.questionNumber}`}
                      value={(currentAnswer as string) || ''}
                      onChange={(e) => onAnswerChange(q.questionNumber, q.id, e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full sm:w-80 px-2.5 py-1.5 border border-slate-300 rounded-[2px] text-sm font-medium focus:border-slate-800 bg-white"
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
