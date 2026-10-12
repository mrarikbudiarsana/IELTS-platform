import type { ListeningPart, QuestionGroup, WritingTaskVersion } from './types';

export type TextImportSkill = 'listening' | 'writing';
export interface ListeningTextImportResult {
  title: string;
  parts: ListeningPart[];
  questionGroups: QuestionGroup[];
  warnings: string[];
}
export type WritingImportedTask = Pick<WritingTaskVersion,
  'title' | 'taskType' | 'taskNumber' | 'testType' | 'subtype' | 'prompt' | 'instructions' |
  'minWords' | 'suggestedTimeMinutes' | 'teacherVisualDescription' | 'teacherAssessmentGuidance' | 'modelResponse'>;
export interface WritingTextImportResult {
  tasks: WritingImportedTask[];
  warnings: string[];
}
export interface TextImportResults {
  listening: ListeningTextImportResult;
  writing: WritingTextImportResult;
}
