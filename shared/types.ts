export type UserRole = 'student' | 'teacher' | 'admin';

export type ReadingTestType = 'academic' | 'general';
export type TestMode = 'practice' | 'mock';
export type PublicationStatus = 'draft' | 'published' | 'archived';
export type AttemptStatus = 'in_progress' | 'submitted' | 'expired';

export type ReadingQuestionType =
  | 'multiple_choice_single'
  | 'multiple_choice_multi'
  | 'true_false_not_given'
  | 'yes_no_not_given'
  | 'matching_headings'
  | 'matching_information'
  | 'matching_features'
  | 'matching_sentence_endings'
  | 'sentence_completion'
  | 'summary_completion_words'
  | 'summary_completion_options'
  | 'note_completion'
  | 'table_completion'
  | 'flow_chart_completion'
  | 'diagram_completion'
  | 'short_answer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  testTypePreference: ReadingTestType | 'not_sure';
  targetBand?: number;
  testDate?: string;
  createdAt: string;
}

export interface ParagraphBlock {
  id: string;
  label: string; // e.g., 'A', 'B', 'C', or empty
  content: string;
}

export interface ShortTextItem {
  id: string;
  title: string;
  content: string;
  paragraphs?: ParagraphBlock[];
}

export interface ReadingPassage {
  id: string;
  passageNumber: number; // 1, 2, 3
  title: string;
  subtitle?: string;
  introduction?: string;
  // Academic passages use paragraphs
  paragraphs: ParagraphBlock[];
  // General Training sections may contain multiple short texts
  shortTexts?: ShortTextItem[];
}

export interface OptionChoice {
  key: string; // 'A', 'B', 'C', etc.
  text: string;
}

export interface TableCell {
  content: string;
  isGap?: boolean;
  questionNumber?: number;
  placeholder?: string;
}

export interface TableRow {
  cells: TableCell[];
}

export interface FlowChartStep {
  stepNumber: number;
  title: string;
  descriptionWithGaps: string; // contains [[Q1]], [[Q2]] or raw question placeholders
  questionNumbers?: number[];
}

export interface DiagramLabelItem {
  labelNumber: number;
  questionNumber: number;
  xPercent: number;
  yPercent: number;
  description?: string;
}

export interface QuestionItem {
  id: string;
  questionNumber: number;
  prompt: string;
  stem?: string;
  options?: OptionChoice[]; // For multiple choice
  // Answer fields (SCRUBBED in client payload during in_progress attempts!)
  answerKey: string | string[]; // e.g. "TRUE", "B", ["A", "D"], "solar power"
  acceptedAlternatives?: string[]; // e.g. ["solar energy", "sunlight"]
  explanation?: string;
  evidenceQuote?: string;
  paragraphRef?: string;
}

export interface QuestionGroup {
  id: string;
  passageId: string;
  questionType: ReadingQuestionType;
  title: string;
  instructions: string; // e.g., "Questions 1–5: Do the following statements agree..."
  startQuestionNumber: number;
  endQuestionNumber: number;
  // Configurable rules
  wordLimitRule?: string; // e.g., "NO MORE THAN TWO WORDS AND/OR A NUMBER"
  maxWords?: number;
  maxNumbers?: number;
  requiredSelectionCount?: number; // e.g., 2 for choose TWO letters
  optionReuseAllowed?: boolean; // e.g., "NB You may use any letter more than once"
  allowAnyOrder?: boolean; // for multi-answer questions: order doesn't matter
  optionsList?: OptionChoice[]; // For matching headings, features, endings, or summary options
  tableData?: {
    headers: string[];
    rows: TableRow[];
  };
  flowChartSteps?: FlowChartStep[];
  diagramData?: {
    imageUrl: string;
    caption?: string;
    labels: DiagramLabelItem[];
  };
  contentWithGaps?: string; // For summaries or notes with gaps like [[1]], [[2]]
  questions: QuestionItem[];
}

export interface ReadingTestVersion {
  id: string;
  testId: string;
  versionNumber: number;
  status: PublicationStatus;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
  totalQuestions: number;
  validationErrors?: string[];
  publishedAt?: string;
  createdAt: string;
}

export interface ReadingTest {
  id: string;
  title: string;
  testType: ReadingTestType;
  category: TestMode; // 'practice' | 'mock'
  timeLimitMinutes: number; // 60 for full mock, or custom
  currentVersionNumber: number;
  status: PublicationStatus;
  latestVersionId: string;
  totalQuestions: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentAnswer {
  questionId: string;
  questionNumber: number;
  userAnswer: string | string[]; // string or array of strings for multi-select
  isFlagged: boolean;
  savedAt: string;
}

export interface AttemptItemResult {
  questionId: string;
  questionNumber: number;
  userAnswer: string | string[];
  isCorrect: boolean;
  mark: number; // 0 or 1
  answerKey: string | string[];
  acceptedAlternatives: string[];
  explanation?: string;
  evidenceQuote?: string;
  paragraphRef?: string;
}

export interface ReadingAttempt {
  id: string;
  userId: string;
  testId: string;
  versionId: string;
  testTitle: string;
  testType: ReadingTestType;
  mode: TestMode;
  status: AttemptStatus;
  startedAt: string;
  deadlineAt?: string; // ISO string, server-enforced for mocks
  submittedAt?: string;
  durationSeconds: number;
  rawScore?: number;
  totalQuestions: number;
  bandScore?: number; // Estimated band score
  isFirstAttempt: boolean;
  answers: Record<number, StudentAnswer>; // keyed by questionNumber
  results?: AttemptItemResult[]; // populated only after submission
}
