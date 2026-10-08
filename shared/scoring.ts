import {
  ReadingQuestionType,
  ListeningQuestionType,
  ReadingTestType,
} from './types';

/**
 * Verified Official IELTS Band Score Tables for Reading (out of 40 raw marks)
 * Source: official IELTS scoring documentation (ielts.org, British Council, Cambridge English)
 */
export const ACADEMIC_READING_BAND_TABLE: [number, number, number][] = [
  // [minRaw, maxRaw, bandScore]
  [39, 40, 9.0],
  [37, 38, 8.5],
  [35, 36, 8.0],
  [33, 34, 7.5],
  [30, 32, 7.0],
  [27, 29, 6.5],
  [23, 26, 6.0],
  [19, 22, 5.5],
  [15, 18, 5.0],
  [13, 14, 4.5],
  [10, 12, 4.0],
  [8, 9, 3.5],
  [6, 7, 3.0],
  [4, 5, 2.5],
  [0, 3, 2.0],
];

export const GENERAL_TRAINING_READING_BAND_TABLE: [number, number, number][] = [
  // [minRaw, maxRaw, bandScore]
  [40, 40, 9.0],
  [39, 39, 8.5],
  [37, 38, 8.0],
  [36, 36, 7.5],
  [34, 35, 7.0],
  [32, 33, 6.5],
  [30, 31, 6.0],
  [27, 29, 5.5],
  [23, 26, 5.0],
  [19, 22, 4.5],
  [15, 18, 4.0],
  [12, 14, 3.5],
  [9, 11, 3.0],
  [6, 8, 2.5],
  [0, 5, 2.0],
];

/**
 * Official IELTS Band Score Table for Listening (out of 40 raw marks)
 * NOTE: IELTS Listening scoring is IDENTICAL for both Academic and General Training.
 * Source: official IELTS scoring documentation (ielts.org, British Council)
 */
export const IELTS_LISTENING_BAND_TABLE: [number, number, number][] = [
  // [minRaw, maxRaw, bandScore]
  [39, 40, 9.0],
  [37, 38, 8.5],
  [35, 36, 8.0],
  [32, 34, 7.5],
  [30, 31, 7.0],
  [26, 29, 6.5],
  [23, 25, 6.0],
  [18, 22, 5.5],
  [16, 17, 5.0],
  [13, 15, 4.5],
  [10, 12, 4.0],
  [8, 9, 3.5],
  [6, 7, 3.0],
  [4, 5, 2.5],
  [0, 3, 2.0],
];

/**
 * Calculates the estimated band score for a full 40-question Reading mock test.
 */
export function calculateEstimatedBandScore(
  rawScore: number,
  totalQuestions: number,
  testType: ReadingTestType
): number | null {
  if (totalQuestions !== 40) {
    return null;
  }

  const table =
    testType === 'academic'
      ? ACADEMIC_READING_BAND_TABLE
      : GENERAL_TRAINING_READING_BAND_TABLE;

  const boundedRaw = Math.max(0, Math.min(40, Math.round(rawScore)));

  for (const [minRaw, maxRaw, band] of table) {
    if (boundedRaw >= minRaw && boundedRaw <= maxRaw) {
      return band;
    }
  }

  return 2.0;
}

/**
 * Calculates the estimated band score for a full 40-question Listening mock test.
 * Returns null if the test is a short practice set (<40 questions).
 */
export function calculateEstimatedListeningBandScore(
  rawScore: number,
  totalQuestions: number
): number | null {
  if (totalQuestions !== 40) {
    return null;
  }

  const boundedRaw = Math.max(0, Math.min(40, Math.round(rawScore)));

  for (const [minRaw, maxRaw, band] of IELTS_LISTENING_BAND_TABLE) {
    if (boundedRaw >= minRaw && boundedRaw <= maxRaw) {
      return band;
    }
  }

  return 2.0;
}

/**
 * Normalizes text response for objective IELTS marking:
 * - Collapses spaces
 * - Trims leading and trailing punctuation & spaces
 * - Converts to lower case
 */
export function normalizeAnswerText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    // Remove terminal punctuation like full stops or quotation marks commonly typed in gaps
    .replace(/^["'`.\s]+|["'`.\s]+$/g, '');
}

/**
 * Counts words in a string according to IELTS standard:
 * Hyphenated words (e.g. "well-known") count as one word in IELTS.
 */
export function countWords(text: string): number {
  if (!text) return 0;
  const cleaned = text.trim();
  if (!cleaned) return 0;
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  return tokens.length;
}

/**
 * Counts numbers in a string (e.g. "1994", "25", "3.5").
 */
export function countNumbers(text: string): number {
  if (!text) return 0;
  const matches = text.match(/\b\d+(?:[.,]\d+)?\b/g);
  return matches ? matches.length : 0;
}

/**
 * Evaluates whether student's answer adheres to word and number constraints:
 * e.g. "ONE WORD AND/OR A NUMBER"
 */
export function validateWordLimit(
  answer: string,
  maxWords?: number,
  maxNumbers?: number
): { valid: boolean; reason?: string } {
  if (!answer) return { valid: true };

  const wordCount = countWords(answer);
  const numberCount = countNumbers(answer);

  if (maxWords !== undefined && maxWords > 0 && wordCount > maxWords) {
    return {
      valid: false,
      reason: `Answer exceeds maximum allowed words (${wordCount} > ${maxWords})`,
    };
  }

  if (maxNumbers !== undefined && maxNumbers > 0 && numberCount > maxNumbers) {
    return {
      valid: false,
      reason: `Answer exceeds maximum allowed numbers (${numberCount} > ${maxNumbers})`,
    };
  }

  return { valid: true };
}

/**
 * Core marking engine function.
 * Evaluates a student's answer against the answer key, accepted alternatives,
 * and question format rules with exact deliberate normalization.
 * NO broad fuzzy matching is used.
 */
export function markStudentAnswer(params: {
  questionType: ReadingQuestionType | ListeningQuestionType;
  userAnswer: string | string[];
  answerKey: string | string[];
  acceptedAlternatives?: string[];
  maxWords?: number;
  maxNumbers?: number;
  allowAnyOrder?: boolean;
}): { isCorrect: boolean; mark: number } {
  const {
    questionType,
    userAnswer,
    answerKey,
    acceptedAlternatives = [],
    maxWords,
    maxNumbers,
  } = params;

  if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
    return { isCorrect: false, mark: 0 };
  }

  // Handle multi-answer multiple choice (Reading or Listening):
  if (
    questionType === 'multiple_choice_multi' ||
    questionType === 'listening_multiple_choice_multi'
  ) {
    const studentChoices = Array.isArray(userAnswer)
      ? userAnswer.map((c) => normalizeAnswerText(c))
      : normalizeAnswerText(userAnswer)
          .split(/[,;\s]+/)
          .filter(Boolean);

    const correctChoices = Array.isArray(answerKey)
      ? answerKey.map((c) => normalizeAnswerText(c))
      : normalizeAnswerText(answerKey)
          .split(/[,;\s]+/)
          .filter(Boolean);

    // Exact set comparison:
    if (studentChoices.length !== correctChoices.length) {
      return { isCorrect: false, mark: 0 };
    }

    const correctSet = new Set(correctChoices);
    const allMatch = studentChoices.every((choice) => correctSet.has(choice));

    return { isCorrect: allMatch, mark: allMatch ? 1 : 0 };
  }

  // For all single-answer items:
  const studentStr = Array.isArray(userAnswer) ? userAnswer.join(' ') : String(userAnswer);
  const normalizedStudent = normalizeAnswerText(studentStr);

  if (!normalizedStudent) {
    return { isCorrect: false, mark: 0 };
  }

  // Check word limit rules if configured
  if (maxWords || maxNumbers) {
    const limitCheck = validateWordLimit(normalizedStudent, maxWords, maxNumbers);
    if (!limitCheck.valid) {
      return { isCorrect: false, mark: 0 };
    }
  }

  // Collect all acceptable answers:
  const acceptableKeys: string[] = [];
  if (Array.isArray(answerKey)) {
    acceptableKeys.push(...answerKey);
  } else if (typeof answerKey === 'string') {
    // Pipe-delimited alternatives in key: "14th October|14 October"
    acceptableKeys.push(...answerKey.split('|'));
  }

  for (const alt of acceptedAlternatives) {
    acceptableKeys.push(...alt.split('|'));
  }

  const normalizedKeys = acceptableKeys
    .map((k) => normalizeAnswerText(k))
    .filter(Boolean);

  // Exact normalized match check
  const isMatch = normalizedKeys.some((k) => k === normalizedStudent);

  return { isCorrect: isMatch, mark: isMatch ? 1 : 0 };
}

// -------------------------------------------------------------
// IELTS SPEAKING SCORING & BAND CALCULATION (MILESTONE 4)
// -------------------------------------------------------------

/**
 * Official IELTS Speaking Scoring Guidance & Rounding Rule:
 *
 * Official Reference:
 * - IELTS Information for Candidates (ielts.org, British Council, Cambridge Assessment English, IDP IELTS)
 * - Section: "How IELTS is Scored - Speaking Band Calculation"
 *
 * Rule:
 * 1. The candidate receives an individual band score (1.0 to 9.0 in 0.5 increments) for each of four criteria:
 *    - Fluency and Coherence (FC)
 *    - Lexical Resource (LR)
 *    - Grammatical Range and Accuracy (GRA)
 *    - Pronunciation (P)
 * 2. The overall Speaking band score is the arithmetic mean of the four criterion scores:
 *    mean = (FC + LR + GRA + P) / 4
 * 3. Rounding convention:
 *    - If the fractional part is < 0.25, round DOWN to the whole band (.0).
 *    - If the fractional part is >= 0.25 and < 0.75, round UP to the half band (.5).
 *    - If the fractional part is >= 0.75, round UP to the next whole band (+1.0).
 *
 * Examples:
 *   (6.0 + 6.0 + 6.0 + 7.0) / 4 = 6.25 -> rounds to 6.5
 *   (6.0 + 7.0 + 7.0 + 7.0) / 4 = 6.75 -> rounds to 7.0
 *   (6.0 + 6.5 + 6.0 + 6.0) / 4 = 6.125 -> rounds to 6.0
 *   (6.0 + 6.5 + 6.5 + 6.5) / 4 = 6.375 -> rounds to 6.5
 */
export function calculateIeltsSpeakingBand(
  fluencyCoherence: number,
  lexicalResource: number,
  grammaticalRange: number,
  pronunciation: number
): number {
  const mean = (fluencyCoherence + lexicalResource + grammaticalRange + pronunciation) / 4;
  const whole = Math.floor(mean);
  const frac = Number((mean - whole).toFixed(4));

  if (frac < 0.25) {
    return whole;
  } else if (frac < 0.75) {
    return whole + 0.5;
  } else {
    return whole + 1.0;
  }
}

/**
 * Validates an individual criterion score.
 * Permitted values: 1.0 to 9.0 in increments of 0.5.
 */
export function validateSpeakingCriterionScore(score: any): { valid: boolean; error?: string } {
  if (typeof score !== 'number' || isNaN(score)) {
    return { valid: false, error: 'Criterion score must be a valid number.' };
  }
  if (score < 1.0 || score > 9.0) {
    return { valid: false, error: 'Criterion score must be between 1.0 and 9.0.' };
  }
  // Verify 0.5 step
  const remainder = (score * 10) % 5;
  if (remainder !== 0) {
    return { valid: false, error: 'Criterion score must be in whole or half band increments (e.g. 6.0, 6.5).' };
  }
  return { valid: true };
}

/**
 * Mandatory disclosure notice and data retention policy for session audio recordings.
 */
export const SPEAKING_AUDIO_RETENTION_POLICY = {
  disclosureNotice:
    'Learner Audio Recording Disclosure: Session audio recordings are strictly confidential and collected solely for pedagogical review, teacher evaluation, and candidate self-reflection. Recordings are private between the student and their authorized teacher.',
  retentionPeriodDays: 90,
  deletionNotice:
    'Recordings are automatically flagged for deletion 90 days after assessment release or upon student removal from the class. Students may request immediate removal of their audio at any time without affecting entered criterion scores.',
};
