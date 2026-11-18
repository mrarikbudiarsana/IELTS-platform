import { db } from './db';

export async function assignedMaterial(userId: string, assignmentId?: string, packageAttemptId?: string) {
  if (!assignmentId && !packageAttemptId) return undefined;
  const assignment = await db.prepare(`
    SELECT a.*, p.reading_test_id, p.reading_version_id, p.listening_test_id, p.listening_version_id,
      p.writing_task1_id, p.writing_task1_version_id, p.writing_task2_id, p.writing_task2_version_id,
      p.speaking_set_id, p.speaking_set_version_id
    FROM assignments a JOIN class_enrolments e ON e.class_id = a.class_id
    LEFT JOIN test_packages p ON p.id = a.package_id
    WHERE a.id = ? AND e.student_id = ? AND e.status = 'active'
      AND (NOT EXISTS (SELECT 1 FROM assignment_access_grants WHERE assignment_id = a.id)
        OR EXISTS (SELECT 1 FROM assignment_access_grants WHERE assignment_id = a.id AND student_id = ?))
  `).get(assignmentId || null, userId, userId);
  if (!assignment || !assignment.is_released || Date.parse(assignment.release_at) > Date.now()) {
    throw new Error('This assignment is unavailable.');
  }
  if (assignment.package_id || packageAttemptId) {
    const sitting = await db.prepare(`SELECT id FROM package_attempts WHERE id = ? AND assignment_id = ?
      AND user_id = ? AND package_id = ? AND status = 'in_progress'`).get(packageAttemptId || null, assignment.id, userId, assignment.package_id);
    if (!sitting) throw new Error('Open the active assessment from your class.');
  }
  return assignment;
}

// Evaluate the linked sitting after a section reaches its terminal state.
export async function completeAssessmentIfReady(skill: 'reading' | 'listening' | 'writing' | 'speaking', resultId: string) {
  const column = skill === 'speaking' ? 'speaking_assessment_id' : skill + '_attempt_id';
  await db.prepare(`
    UPDATE package_attempts SET status = 'completed', completed_at = datetime('now')
    WHERE status = 'in_progress' AND ${column} = ? AND EXISTS (
      SELECT 1 FROM test_packages p WHERE p.id = package_attempts.package_id
      AND (p.reading_test_id IS NULL OR EXISTS (SELECT 1 FROM reading_attempts r WHERE r.id = package_attempts.reading_attempt_id AND r.status IN ('submitted','expired')))
      AND (p.listening_test_id IS NULL OR EXISTS (SELECT 1 FROM listening_attempts l WHERE l.id = package_attempts.listening_attempt_id AND l.status IN ('submitted','expired')))
      AND ((p.writing_task1_id IS NULL AND p.writing_task2_id IS NULL) OR EXISTS (SELECT 1 FROM writing_attempts w WHERE w.id = package_attempts.writing_attempt_id AND w.status IN ('submitted','expired')))
      AND (p.speaking_set_id IS NULL OR EXISTS (SELECT 1 FROM speaking_assessments s WHERE s.id = package_attempts.speaking_assessment_id AND s.status = 'released'))
    )
  `).run(resultId);
}
