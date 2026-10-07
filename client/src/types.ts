// Re-export shared types for client
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
  label: string;
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
  passageNumber: number;
  title: string;
  subtitle?: string;
  introduction?: string;
  paragraphs: ParagraphBlock[];
  shortTexts?: ShortTextItem[];
}

export interface OptionChoice {
  key: string;
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
  descriptionWithGaps: string;
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
  options?: OptionChoice[];
  answerKey?: string | string[];
  acceptedAlternatives?: string[];
  explanation?: string;
  evidenceQuote?: string;
  paragraphRef?: string;
}

export interface QuestionGroup {
  id: string;
  passageId: string;
  questionType: ReadingQuestionType;
  title: string;
  instructions: string;
  startQuestionNumber: number;
  endQuestionNumber: number;
  wordLimitRule?: string;
  maxWords?: number;
  maxNumbers?: number;
  requiredSelectionCount?: number;
  optionReuseAllowed?: boolean;
  allowAnyOrder?: boolean;
  optionsList?: OptionChoice[];
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
  contentWithGaps?: string;
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
  category: TestMode;
  timeLimitMinutes: number;
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
  userAnswer: string | string[];
  isFlagged: boolean;
  savedAt: string;
}

export interface AttemptItemResult {
  questionId: string;
  questionNumber: number;
  userAnswer: string | string[];
  isCorrect: boolean;
  mark: number;
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
  deadlineAt?: string;
  submittedAt?: string;
  durationSeconds: number;
  rawScore?: number;
  totalQuestions: number;
  bandScore?: number;
  isFirstAttempt: boolean;
  answers: Record<number, StudentAnswer>;
  results?: AttemptItemResult[];
}
