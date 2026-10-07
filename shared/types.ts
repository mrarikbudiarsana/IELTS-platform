export type UserRole = 'student' | 'teacher' | 'admin';

export type ReadingTestType = 'academic' | 'general';
export type SkillType = 'reading' | 'listening';
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

export type ListeningQuestionType =
  | 'listening_multiple_choice_single'
  | 'listening_multiple_choice_multi'
  | 'matching'
  | 'plan_map_diagram_labelling'
  | 'form_completion'
  | 'note_completion'
  | 'table_completion'
  | 'flow_chart_completion'
  | 'summary_completion'
  | 'sentence_completion'
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
  paragraphs: ParagraphBlock[];
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

export interface MapLocationPin {
  key: string; // 'A', 'B', 'C'
  label: string;
  xPercent: number;
  yPercent: number;
}

export interface FormFieldItem {
  label: string;
  isGap?: boolean;
  questionNumber?: number;
  defaultValue?: string;
  placeholder?: string;
}

export interface QuestionItem {
  id: string;
  questionNumber: number;
  prompt: string;
  stem?: string;
  options?: OptionChoice[]; // For multiple choice
  // Answer fields (SCRUBBED in client payload during in_progress attempts!)
  answerKey: string | string[];
  acceptedAlternatives?: string[];
  explanation?: string;
  evidenceQuote?: string;
  paragraphRef?: string;
  // Listening specific review fields:
  transcriptExcerpt?: string;
  audioTimestampSeconds?: number;
}

export interface QuestionGroup {
  id: string;
  passageId?: string; // For reading
  partNumber?: number; // For listening (1, 2, 3, 4)
  questionType: ReadingQuestionType | ListeningQuestionType;
  title: string;
  instructions: string;
  startQuestionNumber: number;
  endQuestionNumber: number;
  // Configurable rules
  wordLimitRule?: string; // e.g. "ONE WORD AND/OR A NUMBER"
  maxWords?: number;
  maxNumbers?: number;
  requiredSelectionCount?: number; // e.g., 2 for choose TWO letters
  optionReuseAllowed?: boolean; // e.g., "NB You may use any letter more than once"
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
  mapData?: {
    imageUrl: string;
    caption?: string;
    locations: MapLocationPin[];
  };
  formData?: {
    formTitle: string;
    fields: FormFieldItem[];
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

// -------------------------------------------------------------
// LISTENING TEST MODELS
// -------------------------------------------------------------

export interface TranscriptTimestamp {
  questionNumber: number;
  timestampSeconds: number;
  quote: string;
}

export interface ListeningPart {
  id: string;
  partNumber: number; // 1, 2, 3, 4
  title: string;
  context: string;
  audioUrl: string;
  audioStartSeconds?: number;
  audioEndSeconds?: number;
  containsIntroPauses: boolean;
  introPauseSeconds: number; // e.g. 30s
  checkPauseSeconds: number; // e.g. 30s
  transcript: string; // SCRUBBED in in_progress API
  transcriptTimestamps?: TranscriptTimestamp[]; // SCRUBBED in in_progress API
}

export interface ListeningAudioConfig {
  audioMode: 'single_audio' | 'part_audios';
  masterAudioUrl?: string;
  totalAudioDurationSeconds?: number;
  postTestCheckTimeSeconds: number; // 120s official computer-delivered review time
}

export interface ListeningTestVersion {
  id: string;
  testId: string;
  versionNumber: number;
  status: PublicationStatus;
  parts: ListeningPart[];
  questionGroups: QuestionGroup[];
  totalQuestions: number;
  audioConfig: ListeningAudioConfig;
  validationErrors?: string[];
  publishedAt?: string;
  createdAt: string;
}

export interface ListeningTest {
  id: string;
  title: string;
  category: TestMode; // 'practice' | 'mock'
  audioMode: 'single_audio' | 'part_audios';
  timeLimitMinutes: number; // estimated or mock duration
  currentVersionNumber: number;
  status: PublicationStatus;
  latestVersionId: string;
  totalQuestions: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// ATTEMPTS, ANSWERS, AND RESULTS
// -------------------------------------------------------------

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
  // Listening review additions:
  partNumber?: number;
  transcriptExcerpt?: string;
  audioTimestampSeconds?: number;
  questionType?: string;
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

export interface InterruptionEvent {
  timestamp: string;
  type: 'disconnect' | 'reload' | 'audio_error' | 'manual_pause_recovered';
  detail?: string;
}

export interface ListeningAttempt {
  id: string;
  userId: string;
  testId: string;
  versionId: string;
  testTitle: string;
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
  wasInterrupted: boolean;
  interruptionCount: number;
  replayCount: number;
  interruptionEvents: InterruptionEvent[];
  answers: Record<number, StudentAnswer>;
  results?: AttemptItemResult[];
  performanceByType?: Record<string, { correct: number; total: number }>;
}
