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
  assignmentId?: string;
}

// -------------------------------------------------------------
// MILESTONE 3: CLASSES, ENROLMENTS, ASSIGNMENTS & PACKAGES
// -------------------------------------------------------------

export type ClassTestType = 'academic' | 'general';
export type EnrolmentStatus = 'active' | 'removed';
export type AssignmentPurpose = 'pre_test' | 'practice' | 'post_test';
export type PackageType = 'pre_test' | 'post_test' | 'full_mock';
export type PackageMode = 'exam_rehearsal' | 'flexible_preparation';
export type SkillSlot = 'reading' | 'listening' | 'writing' | 'speaking';

export interface ClassItem {
  id: string;
  title: string;
  description?: string;
  teacherId: string;
  teacherName?: string;
  testType: ClassTestType;
  invitationCode: string;
  isArchived: boolean;
  studentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClassEnrolment {
  id: string;
  classId: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  status: EnrolmentStatus;
  enrolledAt: string;
  removedAt?: string;
}

export interface TestPackage {
  id: string;
  title: string;
  packageType: PackageType;
  testType: ClassTestType;
  listeningTestId?: string;
  listeningVersionId?: string;
  listeningTestTitle?: string;
  readingTestId?: string;
  readingVersionId?: string;
  readingTestTitle?: string;
  speakingSetId?: string;
  speakingSetVersionId?: string;
  speakingSetTitle?: string;
  writingStatus: 'not_implemented';
  speakingStatus: 'configured' | 'not_implemented';
  createdById: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  classId: string;
  classTitle?: string;
  title: string;
  instructions?: string;
  purpose: AssignmentPurpose;
  packageId?: string;
  packageTitle?: string;
  skill?: 'reading' | 'listening' | 'speaking' | 'all';
  testId?: string;
  testTitle?: string;
  versionId?: string;
  mode: TestMode;
  releaseAt: string; // ISO 8601 UTC
  deadlineAt?: string; // ISO 8601 UTC
  attemptLimit: number;
  isReleased: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  // Student specific contextual fields
  studentAttemptCount?: number;
  studentStatus?: 'not_started' | 'in_progress' | 'submitted' | 'overdue';
  activeAttemptId?: string;
  lastAttemptScore?: number;
  lastAttemptTotal?: number;
  lastAttemptBand?: number;
  speakingSessionStatus?: 'awaiting_session' | 'awaiting_feedback' | 'feedback_available';
  speakingAssessmentId?: string;
}

export interface PackageAttempt {
  id: string;
  packageId: string;
  packageTitle?: string;
  assignmentId?: string;
  userId: string;
  userName?: string;
  status: 'in_progress' | 'completed';
  mode: PackageMode;
  readingAttemptId?: string;
  readingAttempt?: ReadingAttempt;
  listeningAttemptId?: string;
  listeningAttempt?: ListeningAttempt;
  speakingAssessmentId?: string;
  speakingAssessment?: SpeakingAssessment;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

export interface SkillComparisonItem {
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  status: 'completed' | 'in_progress' | 'not_started' | 'not_implemented';
  testTitle?: string;
  versionNumber?: number;
  rawScore?: number;
  totalQuestions?: number;
  bandScore?: number;
  completedAt?: string; // Asia/Makassar formatted
  mode?: TestMode;
  wasInterrupted?: boolean;
  isFirstAttempt?: boolean;
  criteria?: SpeakingCriteriaScores;
  assessor?: string; // e.g. 'Teacher assessment'
  sessionType?: 'complete_mock' | 'partial_practice';
  correctionCount?: number;
}

export interface PrePostComparisonReport {
  studentId: string;
  studentName: string;
  studentEmail: string;
  classId: string;
  classTitle: string;
  testType: ClassTestType;
  preTest: {
    packageId?: string;
    packageTitle?: string;
    skills: Record<SkillSlot, SkillComparisonItem>;
  };
  postTest: {
    packageId?: string;
    packageTitle?: string;
    isReleased: boolean;
    skills: Record<SkillSlot, SkillComparisonItem>;
  };
  deltas: {
    readingRawDelta?: number;
    readingBandDelta?: number;
    listeningRawDelta?: number;
    listeningBandDelta?: number;
    speakingBandDelta?: number;
  };
  pedagogicalNote: string;
}

// -------------------------------------------------------------
// SPEAKING TEST & TEACHER-LED ASSESSMENT MODELS (MILESTONE 4)
// -------------------------------------------------------------

export type SpeakingPart = 'part1' | 'part2' | 'part3';
export type SpeakingSessionType = 'complete_mock' | 'partial_practice';

export interface SpeakingPart1Topic {
  id: string;
  topicName: string;
  questions: string[];
  teacherNotes?: string;
}

export interface SpeakingPart2CueCard {
  topic: string;
  cueCardPrompt: string;
  bulletPoints: string[];
  followUpQuestions?: string[];
  teacherNotes?: string;
}

export interface SpeakingPart3Discussion {
  theme: string;
  discussionQuestions: string[];
  teacherNotes?: string;
}

export interface SpeakingSetVersion {
  id: string;
  setId: string;
  versionNumber: number;
  status: PublicationStatus;
  part1Topics: SpeakingPart1Topic[];
  part2CueCard: SpeakingPart2CueCard;
  part3Discussion: SpeakingPart3Discussion;
  teacherNotes?: string;
  validationErrors?: string[];
  publishedAt?: string;
  createdAt: string;
}

export interface SpeakingSet {
  id: string;
  title: string;
  currentVersionNumber: number;
  status: PublicationStatus;
  latestVersionId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  versions?: SpeakingSetVersion[];
}

export interface SpeakingCriteriaScores {
  fluencyCoherence: number; // 1.0 - 9.0 in 0.5 increments
  lexicalResource: number;
  grammaticalRange: number;
  pronunciation: number;
}

export interface SpeakingScoreCorrection {
  id: string;
  assessmentId: string;
  teacherId: string;
  teacherName?: string;
  previousScores: Partial<SpeakingCriteriaScores> & { overallBand?: number };
  updatedScores: SpeakingCriteriaScores & { overallBand: number };
  reason: string;
  correctedAt: string; // ISO 8601 UTC or formatted WITA
}

export interface SpeakingAssessment {
  id: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  teacherId: string;
  teacherName?: string;
  classId?: string;
  classTitle?: string;
  assignmentId?: string;
  assignmentTitle?: string;
  packageAttemptId?: string;
  setId?: string;
  setVersionId?: string;
  setTitle?: string;
  customTopic?: string;
  sessionType: SpeakingSessionType;
  partsCovered: SpeakingPart[];
  sessionDate: string; // ISO 8601 UTC
  sessionDateFormatted?: string; // Asia/Makassar formatted
  status: 'draft' | 'released';
  assessorType: 'teacher' | 'ai';
  criteria?: Partial<SpeakingCriteriaScores>;
  overallBand?: number; // Verified official IELTS calculation rule
  strengths?: string;
  improvementPriorities?: string;
  partComments?: {
    part1?: string;
    part2?: string;
    part3?: string;
  };
  teacherPrivateNotes?: string; // SCRUBBED in student API responses!
  recordingUrl?: string;
  recordingRetentionAcknowledged?: boolean;
  corrections?: SpeakingScoreCorrection[];
  releasedAt?: string;
  createdAt: string;
  updatedAt: string;
}
