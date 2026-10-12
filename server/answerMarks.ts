import { db } from './db';

export interface AnswerMark {
  id: string;
  attemptId: string;
  questionId: string;
  questionNumber: number;
  answerJson: string;
  isCorrect: number;
  mark: number;
}

// Called inside the submission transaction. Existing answers, flags, identifiers,
// and autosave timestamps are preserved; only their grading fields are updated.
export async function saveAnswerMarks(table: 'reading_answers' | 'listening_answers', answers: AnswerMark[]) {
  if (!answers.length) return;
  const values=answers.map(()=>"(?, ?, ?, ?, ?, 0, ?, ?, datetime('now'))").join(',');
  await db.prepare(`INSERT INTO ${table}
    (id, attempt_id, question_id, question_number, user_answer_json, is_flagged, is_correct, mark, saved_at)
    VALUES ${values}
    ON CONFLICT(attempt_id, question_number) DO UPDATE SET
      is_correct = excluded.is_correct, mark = excluded.mark
  `).run(...answers.flatMap(answer=>[answer.id,answer.attemptId,answer.questionId,answer.questionNumber,answer.answerJson,answer.isCorrect,answer.mark]));
}
