import type { QuestionGroup } from '../shared/types';

// Published versions are immutable, so version ID plus question type defines the drill.
export function practiceVersion<T extends { questionGroups: QuestionGroup[]; totalQuestions: number }>(version: T, filter?: string): T {
  if (!filter) return version;
  const questionGroups = version.questionGroups.filter(group => group.questionType === filter);
  const totalQuestions = questionGroups.reduce((sum, group) => sum + group.questions.length, 0);
  if (!totalQuestions) throw new Error('This question type is unavailable in this version.');
  return { ...version, questionGroups, totalQuestions };
}

export function validatePracticeFilter(params: { questionTypeFilter?: string; modeOverride?: string; assignmentId?: string; packageAttemptId?: string }) {
  if (params.questionTypeFilter === undefined) return;
  if (typeof params.questionTypeFilter !== 'string' || !params.questionTypeFilter || params.assignmentId || params.packageAttemptId || params.modeOverride === 'mock') {
    throw new Error('Choose a question type for an individual practice session.');
  }
}
