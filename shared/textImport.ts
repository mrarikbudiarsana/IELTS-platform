import type { ListeningPart, QuestionGroup, WritingTaskVersion, SpeakingSetVersion } from './types';

export type TextImportSkill = 'listening' | 'writing' | 'speaking';
export interface SpeakingTextImportResult extends Pick<SpeakingSetVersion, 'part1Topics' | 'part2CueCard' | 'part3Discussion'> {
  title: string;
  warnings: string[];
}
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
  speaking: SpeakingTextImportResult;
  listening: ListeningTextImportResult;
  writing: WritingTextImportResult;
}
