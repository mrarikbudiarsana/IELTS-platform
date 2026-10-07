import { ReadingQuestionType, ReadingTestType } from './types';

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
 * Calculates the estimated band score for a full 40-question mock test.
 * Returns null if the test is not a full 40-question mock test.
 */
export function calculateEstimatedBandScore(
  rawScore: number,
  totalQuestions: number,
  testType: ReadingTestType
): number | null {
  // Band conversion is officially calibrated on a standard 40-question paper
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
 * e.g. "NO MORE THAN TWO WORDS AND/OR A NUMBER"
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
  questionType: ReadingQuestionType;
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

  // Handle multi-answer multiple choice:
  if (questionType === 'multiple_choice_multi') {
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
    // Also support pipe-delimited alternatives in the answer key: "solar energy|solar power"
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
