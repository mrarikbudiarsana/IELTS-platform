import React from 'react';
import { StudentAnswer } from '../types';

export interface NavigatorSection {
  title: string;
  startQuestion: number;
  endQuestion: number;
  sectionIndex: number;
  questionNumbers?: number[];
}

interface StudentNavigatorProps {
  totalQuestions: number;
  answers: Record<number, StudentAnswer>;
  activeQuestionNumber: number;
  onSelectQuestion: (questionNumber: number) => void;
  onSubmitClick: () => void;
  onToggleFlag?: (questionNumber: number) => void;
  onPreviousQuestion?: () => void;
  onNextQuestion?: () => void;
  sections?: NavigatorSection[];
  activeSectionIndex?: number;
  onSelectSection?: (index: number) => void;
}

export const StudentNavigator: React.FC<StudentNavigatorProps> = ({
  totalQuestions,
  answers,
  activeQuestionNumber,
  onSelectQuestion,
  sections,
  activeSectionIndex = 0,
  onSelectSection,
}) => {
  // Normalize sections: default to standard 3 parts if not provided
  const activeSections: NavigatorSection[] =
    sections && sections.length > 0
      ? sections
      : [
          { title: 'Part 1', startQuestion: 1, endQuestion: 13, sectionIndex: 0 },
          { title: 'Part 2', startQuestion: 14, endQuestion: 26, sectionIndex: 1 },
          { title: 'Part 3', startQuestion: 27, endQuestion: totalQuestions, sectionIndex: 2 },
        ];

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-800 px-4 sm:px-8 py-2 z-30 select-none shrink-0 h-13 flex items-center">
      <div className="w-full flex items-center justify-between gap-4 overflow-x-auto custom-scrollbar">
        {activeSections.map((sec) => {
          const isActiveSection = activeSectionIndex === sec.sectionIndex;
          const questionsCount = sec.endQuestion - sec.startQuestion + 1;

          // Count answered questions in this section
          let answeredInSection = 0;
          for (let q = sec.startQuestion; q <= sec.endQuestion; q++) {
            const a = answers[q];
            if (
              a &&
              a.userAnswer !== undefined &&
              a.userAnswer !== '' &&
              (!Array.isArray(a.userAnswer) || a.userAnswer.length > 0)
            ) {
              answeredInSection++;
            }
          }

          if (!isActiveSection) {
            // INACTIVE PART: Clickable pill showing "Part X   Y of Z"
            return (
              <button
                key={sec.sectionIndex}
                type="button"
                onClick={() => onSelectSection && onSelectSection(sec.sectionIndex)}
                className="flex items-center gap-2 text-xs sm:text-[13px] font-normal text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-1.5 rounded transition-colors shrink-0"
              >
                <span className="font-bold text-slate-800">{sec.title}</span>
                <span className="text-slate-500 font-normal">
                  {answeredInSection} of {questionsCount}
                </span>
              </button>
            );
          }

          // ACTIVE PART: Shows thin top progress line, bold "Part X", and all question numbers!
          const questionsList =
            sec.questionNumbers && sec.questionNumbers.length > 0
              ? sec.questionNumbers
              : Array.from({ length: questionsCount }, (_, i) => sec.startQuestion + i);

          return (
            <div
              key={sec.sectionIndex}
              className="flex flex-col justify-center shrink-0 min-w-0"
            >
              {/* Subtle top indicator bar spanning active section */}
              <div className="h-[2px] bg-slate-300 w-full mb-1 rounded-full" />

              <div className="flex items-center gap-3 sm:gap-4">
                <span className="font-bold text-xs sm:text-sm text-slate-900 shrink-0">
                  {sec.title}
                </span>

                <div className="flex items-center gap-1 sm:gap-1.5">
                  {questionsList.map((qNum) => {
                    const ans = answers[qNum];
                    const isAnswered =
                      ans &&
                      ans.userAnswer !== undefined &&
                      ans.userAnswer !== '' &&
                      (!Array.isArray(ans.userAnswer) || ans.userAnswer.length > 0);
                    const isActive = activeQuestionNumber === qNum;

                    return (
                      <button
                        key={qNum}
                        type="button"
                        onClick={() => onSelectQuestion(qNum)}
                        className={`text-xs sm:text-[13px] relative transition-all cursor-pointer min-w-[26px] h-[26px] flex items-center justify-center ${
                          isActive
                            ? 'border border-[#0066cc] text-[#0066cc] font-semibold rounded-[2px]'
                            : isAnswered
                            ? 'font-medium text-slate-800 hover:text-slate-950'
                            : 'font-normal text-slate-600 hover:text-slate-900'
                        }`}
                        title={`Question ${qNum}${isAnswered ? ' (Answered)' : ''}`}
                      >
                        {/* Green indicator bar above answered question number */}
                        {isAnswered && (
                          <span className="absolute -top-1.5 left-0.5 right-0.5 h-[3px] bg-[#16a34a] rounded-xs" />
                        )}
                        {qNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </footer>
  );
};
