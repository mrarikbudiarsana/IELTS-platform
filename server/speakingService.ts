import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import {
  SpeakingSet,
  SpeakingSetVersion,
  SpeakingPart1Topic,
  SpeakingPart2CueCard,
  SpeakingPart3Discussion,
  SpeakingAssessment,
  SpeakingCriteriaScores,
  SpeakingScoreCorrection,
  SpeakingSessionType,
  SpeakingPart,
  PublicationStatus,
} from '../shared/types';
import {
  calculateIeltsSpeakingBand,
  validateSpeakingCriterionScore,
} from '../shared/scoring';
import { formatMakassarDateTime } from '../shared/dateUtils';
import { isStudentInClass } from './classService';

// -------------------------------------------------------------
// SPEAKING CONTENT EDITOR & VERSIONING
// -------------------------------------------------------------

export function validateSpeakingSetVersion(
  part1Topics: SpeakingPart1Topic[],
  part2CueCard: SpeakingPart2CueCard,
  part3Discussion: SpeakingPart3Discussion
): string[] {
  const errors: string[] = [];

  if (!part1Topics || part1Topics.length === 0) {
    errors.push('Part 1 requires at least one topic with questions.');
  } else {
    for (const t of part1Topics) {
      if (!t.topicName || !t.topicName.trim()) {
        errors.push('Part 1 topic requires a topic name.');
      }
      if (!t.questions || t.questions.length === 0) {
        errors.push(`Part 1 topic "${t.topicName || 'Untitled'}" requires questions.`);
      }
    }
  }

  if (!part2CueCard) {
    errors.push('Part 2 cue card is required.');
  } else {
    if (!part2CueCard.topic || !part2CueCard.topic.trim()) {
      errors.push('Part 2 requires a topic prompt.');
    }
    if (!part2CueCard.bulletPoints || part2CueCard.bulletPoints.length === 0) {
      errors.push('Part 2 cue card requires bullet points.');
    }
  }

  if (!part3Discussion) {
    errors.push('Part 3 two-way discussion is required.');
  } else {
    if (!part3Discussion.discussionQuestions || part3Discussion.discussionQuestions.length === 0) {
      errors.push('Part 3 requires discussion questions.');
    }
  }

  return errors;
}

export function createSpeakingSet(
  teacherId: string,
  data: {
    title: string;
    part1Topics: SpeakingPart1Topic[];
    part2CueCard: SpeakingPart2CueCard;
    part3Discussion: SpeakingPart3Discussion;
    teacherNotes?: string;
  }
): { set: SpeakingSet; version: SpeakingSetVersion } {
  if (!data.title || !data.title.trim()) {
    throw new Error('Speaking set title is required.');
  }

  const validationErrors = validateSpeakingSetVersion(
    data.part1Topics,
    data.part2CueCard,
    data.part3Discussion
  );

  const setId = uuidv4();
  const versionId = uuidv4();
  const now = new Date().toISOString();

  const tx = db.transaction(() => {
    db.prepare(`
      INSERT INTO speaking_sets (
        id, title, current_version_number, status, created_by_id, created_at, updated_at
      ) VALUES (?, ?, 1, 'draft', ?, ?, ?)
    `).run(setId, data.title.trim(), teacherId, now, now);

    db.prepare(`
      INSERT INTO speaking_set_versions (
        id, set_id, version_number, status,
        part1_topics_json, part2_cue_card_json, part3_discussion_json,
        teacher_notes, validation_errors_json, created_at
      ) VALUES (?, ?, 1, 'draft', ?, ?, ?, ?, ?, ?)
    `).run(
      versionId,
      setId,
      JSON.stringify(data.part1Topics || []),
      JSON.stringify(data.part2CueCard || {}),
      JSON.stringify(data.part3Discussion || {}),
      data.teacherNotes || null,
      JSON.stringify(validationErrors),
      now
    );
  });

  tx();

  return {
    set: getSpeakingSetById(setId)!,
    version: getSpeakingSetVersionById(versionId)!,
  };
}

export function getSpeakingSetById(setId: string): SpeakingSet | null {
  const row = db.prepare('SELECT * FROM speaking_sets WHERE id = ?').get(setId) as any;
  if (!row) return null;

  const latestVersion = db
    .prepare('SELECT id FROM speaking_set_versions WHERE set_id = ? ORDER BY version_number DESC LIMIT 1')
    .get(setId) as any;

  return {
    id: row.id,
    title: row.title,
    currentVersionNumber: row.current_version_number,
    status: row.status as PublicationStatus,
    latestVersionId: latestVersion ? latestVersion.id : '',
    createdById: row.created_by_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getSpeakingSetVersionById(versionId: string): SpeakingSetVersion | null {
  const row = db.prepare('SELECT * FROM speaking_set_versions WHERE id = ?').get(versionId) as any;
  if (!row) return null;

  return {
    id: row.id,
    setId: row.set_id,
    versionNumber: row.version_number,
    status: row.status as PublicationStatus,
    part1Topics: JSON.parse(row.part1_topics_json || '[]'),
    part2CueCard: JSON.parse(row.part2_cue_card_json || '{}'),
    part3Discussion: JSON.parse(row.part3_discussion_json || '{}'),
    teacherNotes: row.teacher_notes || undefined,
    validationErrors: JSON.parse(row.validation_errors_json || '[]'),
    publishedAt: row.published_at || undefined,
    createdAt: row.created_at,
  };
}

export function listSpeakingSets(): SpeakingSet[] {
  const rows = db.prepare('SELECT * FROM speaking_sets WHERE status != "archived" ORDER BY created_at DESC').all() as any[];
  return rows.map((row) => {
    const latestVersion = db
      .prepare('SELECT id FROM speaking_set_versions WHERE set_id = ? ORDER BY version_number DESC LIMIT 1')
      .get(row.id) as any;
    return {
      id: row.id,
      title: row.title,
      currentVersionNumber: row.current_version_number,
      status: row.status as PublicationStatus,
      latestVersionId: latestVersion ? latestVersion.id : '',
      createdById: row.created_by_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });
}

export function updateSpeakingDraftVersion(params: {
  setId: string;
  versionId: string;
  title?: string;
  part1Topics: SpeakingPart1Topic[];
  part2CueCard: SpeakingPart2CueCard;
  part3Discussion: SpeakingPart3Discussion;
  teacherNotes?: string;
}): { version: SpeakingSetVersion; errors: string[] } {
  const versionRow = db.prepare('SELECT * FROM speaking_set_versions WHERE id = ? AND set_id = ?').get(
    params.versionId,
    params.setId
  ) as any;

  if (!versionRow) {
    throw new Error('Speaking set version not found');
  }

  if (versionRow.status === 'published') {
    throw new Error('Published versions are immutable. You must fork a new draft version to edit.');
  }

  const validationErrors = validateSpeakingSetVersion(
    params.part1Topics,
    params.part2CueCard,
    params.part3Discussion
  );

  const tx = db.transaction(() => {
    if (params.title) {
      db.prepare('UPDATE speaking_sets SET title = ?, updated_at = datetime("now") WHERE id = ?').run(
        params.title.trim(),
        params.setId
      );
    }

    db.prepare(`
      UPDATE speaking_set_versions
      SET part1_topics_json = ?,
          part2_cue_card_json = ?,
          part3_discussion_json = ?,
          teacher_notes = ?,
          validation_errors_json = ?
      WHERE id = ?
    `).run(
      JSON.stringify(params.part1Topics),
      JSON.stringify(params.part2CueCard),
      JSON.stringify(params.part3Discussion),
      params.teacherNotes || null,
      JSON.stringify(validationErrors),
      params.versionId
    );
  });

  tx();

  return {
    version: getSpeakingSetVersionById(params.versionId)!,
    errors: validationErrors,
  };
}

export function publishSpeakingSetVersion(setId: string, versionId: string): void {
  const versionRow = db.prepare('SELECT * FROM speaking_set_versions WHERE id = ? AND set_id = ?').get(
    versionId,
    setId
  ) as any;

  if (!versionRow) throw new Error('Speaking set version not found');

  const part1 = JSON.parse(versionRow.part1_topics_json || '[]');
  const part2 = JSON.parse(versionRow.part2_cue_card_json || '{}');
  const part3 = JSON.parse(versionRow.part3_discussion_json || '{}');
  const errors = validateSpeakingSetVersion(part1, part2, part3);

  if (errors.length > 0) {
    throw new Error(`Cannot publish Speaking set with validation errors:\n- ${errors.join('\n- ')}`);
  }

  const now = new Date().toISOString();

  const tx = db.transaction(() => {
    // Archive other published versions
    db.prepare(`
      UPDATE speaking_set_versions
      SET status = 'archived'
      WHERE set_id = ? AND status = 'published'
    `).run(setId);

    // Publish target version
    db.prepare(`
      UPDATE speaking_set_versions
      SET status = 'published',
          published_at = ?
      WHERE id = ?
    `).run(now, versionId);

    // Update parent set status
    db.prepare(`
      UPDATE speaking_sets
      SET status = 'published',
          updated_at = ?
      WHERE id = ?
    `).run(now, setId);
  });

  tx();
}

export function forkSpeakingDraftVersion(setId: string): SpeakingSetVersion {
  const set = getSpeakingSetById(setId);
  if (!set) throw new Error('Speaking set not found');

  const latestVersion = db
    .prepare('SELECT * FROM speaking_set_versions WHERE set_id = ? ORDER BY version_number DESC LIMIT 1')
    .get(setId) as any;

  if (!latestVersion) throw new Error('No existing version found');

  const newVersionNumber = latestVersion.version_number + 1;
  const newVersionId = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO speaking_set_versions (
      id, set_id, version_number, status,
      part1_topics_json, part2_cue_card_json, part3_discussion_json,
      teacher_notes, validation_errors_json, created_at
    ) VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?)
  `).run(
    newVersionId,
    setId,
    newVersionNumber,
    latestVersion.part1_topics_json,
    latestVersion.part2_cue_card_json,
    latestVersion.part3_discussion_json,
    latestVersion.teacher_notes,
    latestVersion.validation_errors_json,
    now
  );

  db.prepare('UPDATE speaking_sets SET current_version_number = ?, updated_at = ? WHERE id = ?').run(
    newVersionNumber,
    now,
    setId
  );

  return getSpeakingSetVersionById(newVersionId)!;
}

export function archiveSpeakingSet(setId: string): void {
  db.prepare('UPDATE speaking_sets SET status = "archived", updated_at = datetime("now") WHERE id = ?').run(setId);
}

// -------------------------------------------------------------
// TEACHER-LED SPEAKING ASSESSMENTS & QUEUE
// -------------------------------------------------------------

export function recordSpeakingAssessment(
  teacherId: string,
  data: {
    id?: string;
    studentId: string;
    classId?: string;
    assignmentId?: string;
    packageAttemptId?: string;
    setId?: string;
    setVersionId?: string;
    customTopic?: string;
    sessionType: SpeakingSessionType;
    partsCovered: SpeakingPart[];
    sessionDate?: string;
    status: 'draft' | 'released';
    criteria?: Partial<SpeakingCriteriaScores>;
    strengths?: string;
    improvementPriorities?: string;
    partComments?: { part1?: string; part2?: string; part3?: string };
    teacherPrivateNotes?: string;
    recordingUrl?: string;
    recordingRetentionAcknowledged?: boolean;
  },
  isAdmin = false
): SpeakingAssessment {
  if (!data.studentId) {
    throw new Error('Student ID is required.');
  }

  // Check student existence
  const student = db.prepare('SELECT * FROM users WHERE id = ?').get(data.studentId) as any;
  if (!student) throw new Error('Student not found.');

  // If classId specified, check student enrolment and teacher authority
  if (data.classId) {
    const classRow = db.prepare('SELECT * FROM classes WHERE id = ?').get(data.classId) as any;
    if (!classRow) throw new Error('Class not found.');
    if (!isAdmin && classRow.teacher_id !== teacherId) {
      throw new Error('You do not have permission to assess students in this class.');
    }
    if (!isStudentInClass(data.classId, data.studentId)) {
      throw new Error('Student is not actively enrolled in this class.');
    }
  }

  // Validate session type and parts
  if (!data.partsCovered || data.partsCovered.length === 0) {
    throw new Error('At least one speaking part must be covered.');
  }

  // If complete_mock, all 3 parts must be covered
  if (data.sessionType === 'complete_mock') {
    const hasAllParts = ['part1', 'part2', 'part3'].every((p) => data.partsCovered.includes(p as SpeakingPart));
    if (!hasAllParts) {
      throw new Error('A complete Speaking mock examination requires covering Part 1, Part 2, and Part 3.');
    }
  }

  // Calculate Overall Band if complete mock with all 4 criteria
  let overallBand: number | undefined;
  if (data.criteria) {
    const { fluencyCoherence, lexicalResource, grammaticalRange, pronunciation } = data.criteria;
    const hasAllCriteria =
      fluencyCoherence !== undefined &&
      lexicalResource !== undefined &&
      grammaticalRange !== undefined &&
      pronunciation !== undefined;

    // Validate provided criterion values
    for (const [key, val] of Object.entries(data.criteria)) {
      if (val !== undefined && val !== null) {
        const check = validateSpeakingCriterionScore(val);
        if (!check.valid) {
          throw new Error(`Invalid score for ${key}: ${check.error}`);
        }
      }
    }

    if (data.sessionType === 'complete_mock' && hasAllCriteria) {
      overallBand = calculateIeltsSpeakingBand(
        fluencyCoherence!,
        lexicalResource!,
        grammaticalRange!,
        pronunciation!
      );
    } else {
      // Incomplete criteria or partial practice MUST NOT produce an overall complete score
      overallBand = undefined;
    }
  }

  // If releasing, validate completeness requirements
  if (data.status === 'released') {
    if (data.sessionType === 'complete_mock') {
      if (!data.criteria || overallBand === undefined) {
        throw new Error('Cannot release complete mock assessment without all four criterion scores (FC, LR, GRA, P).');
      }
    }
  }

  const sessionDate = data.sessionDate || new Date().toISOString();
  const assessmentId = data.id || uuidv4();
  const now = new Date().toISOString();
  const releasedAt = data.status === 'released' ? now : null;

  // Check if existing assessment to update
  const existing = db.prepare('SELECT * FROM speaking_assessments WHERE id = ?').get(assessmentId) as any;

  if (existing) {
    if (!isAdmin && existing.teacher_id !== teacherId) {
      throw new Error('You do not have permission to edit this assessment.');
    }

    db.prepare(`
      UPDATE speaking_assessments
      SET class_id = COALESCE(?, class_id),
          assignment_id = COALESCE(?, assignment_id),
          package_attempt_id = COALESCE(?, package_attempt_id),
          set_id = COALESCE(?, set_id),
          set_version_id = COALESCE(?, set_version_id),
          custom_topic = ?,
          session_type = ?,
          parts_covered_json = ?,
          session_date = ?,
          status = ?,
          criterion_fluency_coherence = ?,
          criterion_lexical_resource = ?,
          criterion_grammatical_range = ?,
          criterion_pronunciation = ?,
          overall_band = ?,
          strengths = ?,
          improvement_priorities = ?,
          part_comments_json = ?,
          teacher_private_notes = ?,
          recording_url = ?,
          recording_retention_acknowledged = ?,
          released_at = COALESCE(?, released_at),
          updated_at = ?
      WHERE id = ?
    `).run(
      data.classId || null,
      data.assignmentId || null,
      data.packageAttemptId || null,
      data.setId || null,
      data.setVersionId || null,
      data.customTopic || null,
      data.sessionType,
      JSON.stringify(data.partsCovered),
      sessionDate,
      data.status,
      data.criteria?.fluencyCoherence ?? null,
      data.criteria?.lexicalResource ?? null,
      data.criteria?.grammaticalRange ?? null,
      data.criteria?.pronunciation ?? null,
      overallBand ?? null,
      data.strengths || null,
      data.improvementPriorities || null,
      JSON.stringify(data.partComments || {}),
      data.teacherPrivateNotes || null,
      data.recordingUrl || null,
      data.recordingRetentionAcknowledged ? 1 : 0,
      releasedAt,
      now,
      assessmentId
    );
  } else {
    db.prepare(`
      INSERT INTO speaking_assessments (
        id, student_id, teacher_id, class_id, assignment_id, package_attempt_id,
        set_id, set_version_id, custom_topic, session_type, parts_covered_json,
        session_date, status, assessor_type,
        criterion_fluency_coherence, criterion_lexical_resource,
        criterion_grammatical_range, criterion_pronunciation,
        overall_band, strengths, improvement_priorities, part_comments_json,
        teacher_private_notes, recording_url, recording_retention_acknowledged,
        released_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'teacher', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      assessmentId,
      data.studentId,
      teacherId,
      data.classId || null,
      data.assignmentId || null,
      data.packageAttemptId || null,
      data.setId || null,
      data.setVersionId || null,
      data.customTopic || null,
      data.sessionType,
      JSON.stringify(data.partsCovered),
      sessionDate,
      data.status,
      data.criteria?.fluencyCoherence ?? null,
      data.criteria?.lexicalResource ?? null,
      data.criteria?.grammaticalRange ?? null,
      data.criteria?.pronunciation ?? null,
      overallBand ?? null,
      data.strengths || null,
      data.improvementPriorities || null,
      JSON.stringify(data.partComments || {}),
      data.teacherPrivateNotes || null,
      data.recordingUrl || null,
      data.recordingRetentionAcknowledged ? 1 : 0,
      releasedAt,
      now,
      now
    );
  }

  // If released and linked to package attempt, update package attempt
  if (data.status === 'released' && data.packageAttemptId && data.sessionType === 'complete_mock') {
    db.prepare(`
      UPDATE package_attempts
      SET speaking_assessment_id = ?
      WHERE id = ?
    `).run(assessmentId, data.packageAttemptId);
  }

  return getSpeakingAssessmentById(assessmentId, teacherId, 'teacher')!;
}

export function releaseSpeakingAssessment(
  teacherId: string,
  assessmentId: string,
  isAdmin = false
): SpeakingAssessment {
  const row = db.prepare('SELECT * FROM speaking_assessments WHERE id = ?').get(assessmentId) as any;
  if (!row) throw new Error('Assessment not found');

  if (!isAdmin && row.teacher_id !== teacherId) {
    throw new Error('You do not have permission to release this assessment.');
  }

  if (row.session_type === 'complete_mock') {
    if (
      row.criterion_fluency_coherence === null ||
      row.criterion_lexical_resource === null ||
      row.criterion_grammatical_range === null ||
      row.criterion_pronunciation === null
    ) {
      throw new Error('Cannot release complete mock assessment without all four criterion scores (FC, LR, GRA, P).');
    }
  }

  const now = new Date().toISOString();
  db.prepare(`
    UPDATE speaking_assessments
    SET status = 'released',
        released_at = ?,
        updated_at = ?
    WHERE id = ?
  `).run(now, now, assessmentId);

  // Link to package attempt if applicable
  if (row.package_attempt_id && row.session_type === 'complete_mock') {
    db.prepare(`
      UPDATE package_attempts
      SET speaking_assessment_id = ?
      WHERE id = ?
    `).run(assessmentId, row.package_attempt_id);
  }

  return getSpeakingAssessmentById(assessmentId, teacherId, 'teacher')!;
}

export function correctReleasedSpeakingScores(
  teacherId: string,
  assessmentId: string,
  data: {
    updatedScores: SpeakingCriteriaScores;
    reason: string;
  },
  isAdmin = false
): SpeakingAssessment {
  const row = db.prepare('SELECT * FROM speaking_assessments WHERE id = ?').get(assessmentId) as any;
  if (!row) throw new Error('Assessment not found');

  if (!isAdmin && row.teacher_id !== teacherId) {
    throw new Error('You do not have permission to correct scores on this assessment.');
  }

  if (row.status !== 'released') {
    throw new Error('Score corrections can only be applied to released assessments. Drafts may be edited directly.');
  }

  if (!data.reason || !data.reason.trim()) {
    throw new Error('A detailed reason is required when correcting released scores.');
  }

  // Validate all 4 criterion scores
  const { fluencyCoherence, lexicalResource, grammaticalRange, pronunciation } = data.updatedScores;
  for (const [key, val] of Object.entries(data.updatedScores)) {
    const check = validateSpeakingCriterionScore(val);
    if (!check.valid) {
      throw new Error(`Invalid score for ${key}: ${check.error}`);
    }
  }

  const previousScores = {
    fluencyCoherence: row.criterion_fluency_coherence,
    lexicalResource: row.criterion_lexical_resource,
    grammaticalRange: row.criterion_grammatical_range,
    pronunciation: row.criterion_pronunciation,
    overallBand: row.overall_band,
  };

  const newOverallBand = calculateIeltsSpeakingBand(
    fluencyCoherence,
    lexicalResource,
    grammaticalRange,
    pronunciation
  );

  const correctionId = uuidv4();
  const now = new Date().toISOString();

  const tx = db.transaction(() => {
    // 1. Audit trail record
    db.prepare(`
      INSERT INTO speaking_score_corrections (
        id, assessment_id, teacher_id, previous_scores_json, updated_scores_json, reason, corrected_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      correctionId,
      assessmentId,
      teacherId,
      JSON.stringify(previousScores),
      JSON.stringify({ ...data.updatedScores, overallBand: newOverallBand }),
      data.reason.trim(),
      now
    );

    // 2. Transparently update current scores
    db.prepare(`
      UPDATE speaking_assessments
      SET criterion_fluency_coherence = ?,
          criterion_lexical_resource = ?,
          criterion_grammatical_range = ?,
          criterion_pronunciation = ?,
          overall_band = ?,
          updated_at = ?
      WHERE id = ?
    `).run(
      fluencyCoherence,
      lexicalResource,
      grammaticalRange,
      pronunciation,
      newOverallBand,
      now,
      assessmentId
    );
  });

  tx();

  return getSpeakingAssessmentById(assessmentId, teacherId, 'teacher')!;
}

export function getSpeakingAssessmentById(
  assessmentId: string,
  requestingUserId: string,
  requestingUserRole: string
): SpeakingAssessment | null {
  const row = db.prepare(`
    SELECT sa.*,
      u_stud.full_name as student_name,
      u_stud.email as student_email,
      u_teach.full_name as teacher_name,
      c.title as class_title,
      a.title as assignment_title,
      ss.title as set_title
    FROM speaking_assessments sa
    JOIN users u_stud ON sa.student_id = u_stud.id
    JOIN users u_teach ON sa.teacher_id = u_teach.id
    LEFT JOIN classes c ON sa.class_id = c.id
    LEFT JOIN assignments a ON sa.assignment_id = a.id
    LEFT JOIN speaking_sets ss ON sa.set_id = ss.id
    WHERE sa.id = ?
  `).get(assessmentId) as any;

  if (!row) return null;

  const isTeacherOrAdmin = requestingUserRole === 'teacher' || requestingUserRole === 'admin';

  // Permission check for student
  if (!isTeacherOrAdmin) {
    if (row.student_id !== requestingUserId) {
      throw new Error('Access forbidden to this assessment.');
    }
    // Draft privacy guard: student cannot view draft assessments before release!
    if (row.status === 'draft') {
      throw new Error('This speaking assessment is in draft state and has not been released by your teacher yet.');
    }
  }

  // Fetch correction history
  const corrections = db.prepare(`
    SELECT sc.*, u.full_name as teacher_name
    FROM speaking_score_corrections sc
    JOIN users u ON sc.teacher_id = u.id
    WHERE sc.assessment_id = ?
    ORDER BY sc.corrected_at DESC
  `).all(assessmentId) as any[];

  const mappedCorrections: SpeakingScoreCorrection[] = corrections.map((c) => ({
    id: c.id,
    assessmentId: c.assessment_id,
    teacherId: c.teacher_id,
    teacherName: c.teacher_name,
    previousScores: JSON.parse(c.previous_scores_json),
    updatedScores: JSON.parse(c.updated_scores_json),
    reason: c.reason,
    correctedAt: formatMakassarDateTime(c.corrected_at),
  }));

  const criteria: Partial<SpeakingCriteriaScores> = {};
  if (row.criterion_fluency_coherence !== null) criteria.fluencyCoherence = row.criterion_fluency_coherence;
  if (row.criterion_lexical_resource !== null) criteria.lexicalResource = row.criterion_lexical_resource;
  if (row.criterion_grammatical_range !== null) criteria.grammaticalRange = row.criterion_grammatical_range;
  if (row.criterion_pronunciation !== null) criteria.pronunciation = row.criterion_pronunciation;

  const assessment: SpeakingAssessment = {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name,
    studentEmail: row.student_email,
    teacherId: row.teacher_id,
    teacherName: row.teacher_name,
    classId: row.class_id || undefined,
    classTitle: row.class_title || undefined,
    assignmentId: row.assignment_id || undefined,
    assignmentTitle: row.assignment_title || undefined,
    packageAttemptId: row.package_attempt_id || undefined,
    setId: row.set_id || undefined,
    setVersionId: row.set_version_id || undefined,
    setTitle: row.set_title || undefined,
    customTopic: row.custom_topic || undefined,
    sessionType: row.session_type as SpeakingSessionType,
    partsCovered: JSON.parse(row.parts_covered_json || '[]'),
    sessionDate: row.session_date,
    sessionDateFormatted: formatMakassarDateTime(row.session_date),
    status: row.status as 'draft' | 'released',
    assessorType: row.assessor_type as 'teacher' | 'ai',
    criteria: Object.keys(criteria).length > 0 ? criteria : undefined,
    overallBand: row.overall_band !== null ? row.overall_band : undefined,
    strengths: row.strengths || undefined,
    improvementPriorities: row.improvement_priorities || undefined,
    partComments: JSON.parse(row.part_comments_json || '{}'),
    // Teacher private notes: STRIPPED for students!
    teacherPrivateNotes: isTeacherOrAdmin ? row.teacher_private_notes || undefined : undefined,
    recordingUrl: row.recording_url || undefined,
    recordingRetentionAcknowledged: Boolean(row.recording_retention_acknowledged),
    corrections: mappedCorrections,
    releasedAt: row.released_at || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  return assessment;
}

export function listTeacherAssessmentQueue(
  teacherId: string,
  filters?: {
    classId?: string;
    status?: 'draft' | 'released';
    sessionType?: SpeakingSessionType;
  },
  isAdmin = false
): SpeakingAssessment[] {
  let query = `
    SELECT sa.*,
      u_stud.full_name as student_name,
      u_stud.email as student_email,
      u_teach.full_name as teacher_name,
      c.title as class_title,
      a.title as assignment_title,
      ss.title as set_title
    FROM speaking_assessments sa
    JOIN users u_stud ON sa.student_id = u_stud.id
    JOIN users u_teach ON sa.teacher_id = u_teach.id
    LEFT JOIN classes c ON sa.class_id = c.id
    LEFT JOIN assignments a ON sa.assignment_id = a.id
    LEFT JOIN speaking_sets ss ON sa.set_id = ss.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (!isAdmin) {
    query += ' AND sa.teacher_id = ?';
    params.push(teacherId);
  }

  if (filters?.classId) {
    query += ' AND sa.class_id = ?';
    params.push(filters.classId);
  }

  if (filters?.status) {
    query += ' AND sa.status = ?';
    params.push(filters.status);
  }

  if (filters?.sessionType) {
    query += ' AND sa.session_type = ?';
    params.push(filters.sessionType);
  }

  query += ' ORDER BY sa.updated_at DESC';

  const rows = db.prepare(query).all(...params) as any[];
  return rows.map((row) => getSpeakingAssessmentById(row.id, teacherId, 'teacher')!);
}

export function listStudentSpeakingAssessments(studentId: string): SpeakingAssessment[] {
  const rows = db.prepare(`
    SELECT id FROM speaking_assessments
    WHERE student_id = ? AND status = 'released'
    ORDER BY session_date DESC
  `).all(studentId) as any[];

  return rows.map((r) => getSpeakingAssessmentById(r.id, studentId, 'student')!).filter(Boolean);
}
