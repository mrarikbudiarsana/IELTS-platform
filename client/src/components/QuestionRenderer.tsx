import React from 'react';
import { QuestionGroup, QuestionItem, StudentAnswer } from '../types';
import { Flag } from 'lucide-react';

interface QuestionRendererProps {
  group: QuestionGroup;
  answers: Record<number, StudentAnswer>;
  onAnswerChange: (questionNumber: number, questionId: string, answer: string | string[]) => void;
  onToggleFlag: (questionNumber: number, questionId: string) => void;
  activeQuestionNumber: number;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  group,
  answers,
  onAnswerChange,
  onToggleFlag,
  activeQuestionNumber,
}) => {
  const renderFlagButton = (q: QuestionItem) => {
    const isFlagged = answers[q.questionNumber]?.isFlagged;
    return (
      <button
        onClick={() => onToggleFlag(q.questionNumber, q.id)}
        className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
          isFlagged
            ? 'bg-amber-100 text-amber-800 border border-amber-300 font-semibold'
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
        }`}
        title="Review this question later"
      >
        <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
        <span className="hidden sm:inline">{isFlagged ? 'Flagged' : 'Flag'}</span>
      </button>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
      {/* Group Header & Instructions */}
      <div className="border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            {group.title}
          </span>
          {group.wordLimitRule && (
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
              {group.wordLimitRule}
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-slate-700 whitespace-pre-line mt-2">
          {group.instructions}
        </p>
      </div>

      {/* 1. TABLE COMPLETION FORMAT */}
      {group.questionType === 'table_completion' && group.tableData && (
        <div className="mb-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg text-sm">
            <thead className="bg-slate-50">
              <tr>
                {group.tableData.headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-2.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200 last:border-r-0"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {group.tableData.rows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  {row.cells.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-4 py-3 text-sm text-slate-800 border-r border-slate-200 last:border-r-0 align-top"
                    >
                      {cell.isGap && cell.questionNumber ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span className="font-bold text-indigo-600">[{cell.questionNumber}]</span>
                            {renderFlagButton(
                              group.questions.find((q) => q.questionNumber === cell.questionNumber)!
                            )}
                          </div>
                          <input
                            type="text"
                            value={(answers[cell.questionNumber]?.userAnswer as string) || ''}
                            onChange={(e) => {
                              const q = group.questions.find((x) => x.questionNumber === cell.questionNumber);
                              if (q) onAnswerChange(cell.questionNumber!, q.id, e.target.value);
                            }}
                            placeholder="Type answer..."
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium bg-amber-50/40"
                          />
                        </div>
                      ) : (
                        <span>{cell.content}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. FLOW-CHART COMPLETION FORMAT */}
      {group.questionType === 'flow_chart_completion' && group.flowChartSteps && (
        <div className="mb-6 space-y-4">
          {group.flowChartSteps.map((step, sIdx) => (
            <div key={sIdx} className="relative">
              <div className="p-4 border-2 border-indigo-200 bg-indigo-50/30 rounded-lg">
                <div className="font-bold text-sm text-indigo-900 mb-1">{step.title}</div>
                <div className="text-sm text-slate-700">
                  {step.descriptionWithGaps}
                </div>
              </div>
              {sIdx < group.flowChartSteps!.length - 1 && (
                <div className="flex justify-center my-1.5 text-indigo-400 font-bold">
                  ↓
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. DIAGRAM LABEL COMPLETION FORMAT */}
      {group.questionType === 'diagram_completion' && group.diagramData && (
        <div className="mb-6 border border-slate-200 rounded-lg p-3 bg-slate-50">
          <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
            {group.diagramData.caption || 'Explanatory Diagram'}
          </div>
          <div className="w-full max-h-96 flex justify-center items-center overflow-hidden rounded bg-white border border-slate-200 shadow-sm p-2">
            <img
              src={group.diagramData.imageUrl}
              alt={group.diagramData.caption || 'Diagram'}
              className="max-h-80 object-contain w-auto"
            />
          </div>
        </div>
      )}

      {/* 4. SHARED OPTIONS LIST (FOR MATCHING HEADINGS, FEATURES, SUMMARY OPTIONS) */}
      {group.optionsList && group.optionsList.length > 0 && (
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            List of Available Options
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {group.optionsList.map((opt) => (
              <div
                key={opt.key}
                className="flex items-start gap-2 bg-white px-3 py-1.5 rounded border border-slate-200 text-sm"
              >
                <span className="font-bold text-indigo-700 min-w-5">{opt.key}</span>
                <span className="text-slate-700">{opt.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CONTINUOUS TEXT WITH GAPS (FOR SUMMARY COMPLETION & NOTE COMPLETION) */}
      {group.contentWithGaps && (
        <div className="mb-6 bg-amber-50/20 border border-amber-200/60 rounded-lg p-4 text-sm leading-relaxed text-slate-800 whitespace-pre-line font-serif">
          {group.contentWithGaps}
        </div>
      )}

      {/* QUESTIONS LIST */}
      <div className="space-y-4">
        {group.questions.map((q) => {
          const currentAnswer = answers[q.questionNumber]?.userAnswer;
          const isActive = activeQuestionNumber === q.questionNumber;

          return (
            <div
              key={q.id}
              id={`question-box-${q.questionNumber}`}
              className={`p-3.5 rounded-lg border transition-all ${
                isActive
                  ? 'border-indigo-400 bg-indigo-50/20 shadow-sm'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      currentAnswer && currentAnswer !== ''
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {q.questionNumber}
                  </span>
                  <div className="text-sm font-medium text-slate-900 pt-0.5">
                    {q.prompt}
                  </div>
                </div>
                {renderFlagButton(q)}
              </div>

              {/* A. SINGLE MULTIPLE CHOICE */}
              {group.questionType === 'multiple_choice_single' && q.options && (
                <div className="space-y-2 pl-8">
                  {q.options.map((opt) => (
                    <label
                      key={opt.key}
                      className={`flex items-start gap-3 p-2.5 rounded-md border text-sm cursor-pointer transition-colors ${
                        currentAnswer === opt.key
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-950 font-medium'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q_${q.questionNumber}`}
                        value={opt.key}
                        checked={currentAnswer === opt.key}
                        onChange={() => onAnswerChange(q.questionNumber, q.id, opt.key)}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <span className="font-bold mr-2 text-indigo-700">{opt.key}.</span>
                        <span>{opt.text}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* B. MULTI-ANSWER MULTIPLE CHOICE (CHOOSE TWO OR MORE) */}
              {group.questionType === 'multiple_choice_multi' && q.options && (
                <div className="space-y-2 pl-8">
                  <div className="text-xs text-indigo-600 font-semibold mb-1">
                    Select {group.requiredSelectionCount || 2} options:
                  </div>
                  {q.options.map((opt) => {
                    const selectedList = Array.isArray(currentAnswer) ? currentAnswer : [];
                    const isSelected = selectedList.includes(opt.key);

                    return (
                      <label
                        key={opt.key}
                        className={`flex items-start gap-3 p-2.5 rounded-md border text-sm cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-950 font-medium'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={opt.key}
                          checked={isSelected}
                          onChange={(e) => {
                            let updated: string[];
                            if (e.target.checked) {
                              updated = [...selectedList, opt.key];
                            } else {
                              updated = selectedList.filter((k) => k !== opt.key);
                            }
                            onAnswerChange(q.questionNumber, q.id, updated);
                          }}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <div>
                          <span className="font-bold mr-2 text-indigo-700">{opt.key}.</span>
                          <span>{opt.text}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* C. TRUE / FALSE / NOT GIVEN */}
              {group.questionType === 'true_false_not_given' && (
                <div className="flex gap-2 pl-8">
                  {['TRUE', 'FALSE', 'NOT GIVEN'].map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => onAnswerChange(q.questionNumber, q.id, choice)}
                      className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-md border transition-colors ${
                        currentAnswer === choice
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              )}

              {/* D. YES / NO / NOT GIVEN */}
              {group.questionType === 'yes_no_not_given' && (
                <div className="flex gap-2 pl-8">
                  {['YES', 'NO', 'NOT GIVEN'].map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => onAnswerChange(q.questionNumber, q.id, choice)}
                      className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-md border transition-colors ${
                        currentAnswer === choice
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              )}

              {/* E. MATCHING (HEADINGS, INFORMATION, FEATURES, ENDINGS, SUMMARY OPTIONS) */}
              {(group.questionType === 'matching_headings' ||
                group.questionType === 'matching_information' ||
                group.questionType === 'matching_features' ||
                group.questionType === 'matching_sentence_endings' ||
                group.questionType === 'summary_completion_options') &&
                group.optionsList && (
                  <div className="pl-8">
                    <select
                      value={(currentAnswer as string) || ''}
                      onChange={(e) => onAnswerChange(q.questionNumber, q.id, e.target.value)}
                      className="w-full sm:w-80 px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value="">-- Choose option --</option>
                      {group.optionsList.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.key}: {opt.text}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              {/* F. TEXT GAPS (SENTENCE, SUMMARY WORDS, NOTES, SHORT ANSWER, DIAGRAM) */}
              {(group.questionType === 'sentence_completion' ||
                group.questionType === 'summary_completion_words' ||
                group.questionType === 'note_completion' ||
                group.questionType === 'flow_chart_completion' ||
                group.questionType === 'diagram_completion' ||
                group.questionType === 'short_answer') && (
                <div className="pl-8">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={(currentAnswer as string) || ''}
                      onChange={(e) => onAnswerChange(q.questionNumber, q.id, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full sm:w-96 px-3 py-2 border border-slate-300 rounded-md text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                    />
                  </div>
                  {group.wordLimitRule && (
                    <div className="text-[11px] text-slate-400 mt-1">
                      Adhere strictly to: {group.wordLimitRule}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
