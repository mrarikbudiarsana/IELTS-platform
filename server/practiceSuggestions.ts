import type { SuggestedDrill } from '../shared/types';
import { db } from './db';
import { listTests } from './readingService';
import { listListeningTests } from './listeningService';
import { getAttemptById } from './attemptService';
import { getListeningAttemptById } from './listeningAttemptService';
import { canUserAccessTest } from './commercialService';

export async function getPracticeSuggestions(userId: string): Promise<SuggestedDrill[]> {
  const skills = ['reading', 'listening'] as const;
  const baselines = await Promise.all(skills.map(skill => db.prepare(`
    SELECT att.id, a.title FROM ${skill}_attempts att
    JOIN assignments a ON a.id = att.assignment_id
    JOIN class_enrolments ce ON ce.class_id = a.class_id AND ce.student_id = att.user_id
    WHERE att.user_id = ? AND ce.status = 'active' AND a.purpose = 'pre_test'
      AND att.status IN ('submitted', 'expired')
    ORDER BY att.submitted_at DESC, att.started_at DESC, att.id DESC LIMIT 1
  `).get(userId)));
  if (!baselines.some(Boolean)) return [];

  const access = await canUserAccessTest({ userId, isTeacherOrAdmin: false });
  const suggestions = await Promise.all(skills.map(async (skill, index): Promise<SuggestedDrill | undefined> => {
    const baseline = baselines[index];
    if (!baseline) return;
    const attempt = skill === 'reading'
      ? await getAttemptById(baseline.id, userId)
      : await getListeningAttemptById(baseline.id, userId);
    const scores = new Map<string, { correct: number; total: number }>();
    for (const item of attempt?.results || []) {
      if (!item.questionType) continue;
      const score = scores.get(item.questionType) || { correct: 0, total: 0 };
      score.total++;
      score.correct += item.mark > 0 ? 1 : 0;
      scores.set(item.questionType, score);
    }
    const priorities = [...scores].filter(([, s]) => s.correct < s.total)
      .sort(([, a], [, b]) => a.correct / a.total - b.correct / b.total || b.total - a.total);
    if (!attempt || !priorities.length) return;

    const tests = skill === 'reading'
      ? await listTests({ isTeacherOrAdmin: false, testType: 'testType' in attempt ? attempt.testType : undefined })
      : await listListeningTests({ isTeacherOrAdmin: false });
    const available = tests.filter(test => test.isFreeTier || access.allowed);
    for (const [questionType, score] of priorities) {
      const matching = available.filter(test => test.questionGroupsSummary?.some(group =>
        group.questionType === questionType && group.questionCount > 0));
      const test = matching.find(candidate => candidate.id !== attempt.testId) || matching[0];
      if (test) return { skill, preTestTitle: baseline.title, questionType, ...score, testId: test.id, testTitle: test.title };
    }
  }));
  return suggestions.filter((item): item is SuggestedDrill => item !== undefined);
}
