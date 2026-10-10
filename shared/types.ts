export type UserRole = 'student' | 'teacher' | 'admin';

export type ReadingTestType = 'academic' | 'general';
export type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';
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

export interface QuestionGroupSummary {
  id: string;
  questionType: string;
  passageId?: string;
  partNumber?: number;
  startQuestionNumber: number;
  endQuestionNumber: number;
  questionCount: number;
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
  passageCount?: number;
  questionGroupsSummary?: QuestionGroupSummary[];
  createdById: string;
  isFreeTier?: boolean;
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
  partCount?: number;
  questionGroupsSummary?: QuestionGroupSummary[];
  createdById: string;
  isFreeTier?: boolean;
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
  writingTask1Id?: string;
  writingTask1VersionId?: string;
  writingTask1Title?: string;
  writingTask2Id?: string;
  writingTask2VersionId?: string;
  writingTask2Title?: string;
  speakingSetId?: string;
  speakingSetVersionId?: string;
  speakingSetTitle?: string;
  writingStatus: 'configured' | 'not_implemented';
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
  skill?: 'reading' | 'listening' | 'writing' | 'speaking' | 'all';
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
  speakingRoute?: SpeakingRoute;
  speakingAiSessionId?: string;
  writingAttemptId?: string;
  writingAssessmentStatus?: 'not_started' | 'queued' | 'assessed';
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
  writingAttemptId?: string;
  writingAttempt?: WritingAttempt;
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
  criteria?: any;
  assessor?: string; // e.g. 'Teacher assessment', 'AI Assessment'
  sessionType?: string;
  correctionCount?: number;
  writingTask1Band?: number;
  writingTask2Band?: number;
  writingOverallBand?: number;
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
    writingBandDelta?: number;
    speakingBandDelta?: number;
    overallBandDelta?: number;
  };
  overallBandPre?: number;
  overallBandPost?: number;
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
  followUpGuidance?: {
    maxFollowUpsPerTopic?: number;
    probingDepth?: 'standard' | 'deep';
    adaptiveGuidance?: string;
  };
  teacherNotes?: string;
  teacherOnlyInstructions?: string;
  aiInstructions?: string;
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
  isFreeTier?: boolean;
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
  evidenceQuotes?: { criterion: string; quote: string; comment: string; timestamp?: string }[];
  suggestedPractice?: string[];
  acousticObservations?: { speechRateWpm?: number; pauseRatio?: number; pronunciationNotes?: string };
  isSimulated?: boolean;
  providerModel?: string;
  sessionId?: string;
  wasInterrupted?: boolean;
  interruptionCount?: number;
  releasedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// LIVE AI SPEAKING SIMULATION & ASSESSMENT (MILESTONE 6)
// -------------------------------------------------------------

export type SpeakingRoute = 'ai' | 'teacher_led' | 'student_choice';
export type SpeakingAiSessionStage =
  | 'setup'
  | 'part_1'
  | 'part_2_prep'
  | 'part_2_speaking'
  | 'part_3'
  | 'completed'
  | 'abandoned';

export interface SpeakingAudioTurn {
  id: string;
  sessionId: string;
  part: SpeakingPart;
  turnNumber: number;
  speaker: 'examiner' | 'candidate';
  text: string;
  audioUrl?: string;
  durationSeconds: number;
  timestampSeconds: number;
  isFollowUp: boolean;
  createdAt: string;
}

export interface SpeakingAiSession {
  id: string;
  userId: string;
  userName?: string;
  assignmentId?: string;
  packageAttemptId?: string;
  setId?: string;
  setVersionId?: string;
  setTitle?: string;
  mode: TestMode;
  stage: SpeakingAiSessionStage;
  currentPart: SpeakingPart;
  currentQuestionIndex: number;
  part2Notes?: string;
  durationSeconds: number;
  wasInterrupted: boolean;
  interruptionCount: number;
  assessmentId?: string;
  assessment?: SpeakingAssessment;
  turns?: SpeakingAudioTurn[];
  allowanceReserved: boolean;
  allowanceConsumed: boolean;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpeakingAllowanceLedger {
  id: string;
  userId: string;
  amount: number;
  balanceAfter: number;
  transactionType: 'grant' | 'reservation' | 'consumption' | 'release';
  sessionId?: string;
  assessmentId?: string;
  idempotencyKey?: string;
  notes?: string;
  createdById?: string;
  createdAt: string;
}

export interface SpeakingAllowanceBalance {
  userId?: string;
  totalGranted: number;
  totalConsumed: number;
  totalReserved: number;
  available: number;
}

export interface SpeakingVoiceTrialRequest {
  audioBase64?: string;
  textPrompt?: string;
  simulateFailure?: boolean;
}

export interface SpeakingVoiceTrialResponse {
  success: boolean;
  audioDetected: boolean;
  rmsLevel: number;
  isClipping: boolean;
  isSilent: boolean;
  speechDurationSeconds: number;
  examinerResponseText: string;
  examinerAudioBase64?: string;
  isSimulated: boolean;
  latencyMs: number;
  measuredCosts?: {
    sttCostUsd: number;
    reasoningCostUsd: number;
    ttsCostUsd: number;
    totalTurnCostUsd: number;
  };
}

// -------------------------------------------------------------
// WRITING TEST & AI ASSESSMENT MODELS (MILESTONE 5)
// -------------------------------------------------------------

export type WritingTaskType = 'academic_task_1' | 'gt_task_1' | 'task_2';
export type WritingTestType = 'academic' | 'general' | 'both';
export type WritingTaskNumber = 1 | 2;
export type WritingTaskSubtype =
  | 'chart'
  | 'table'
  | 'map'
  | 'process'
  | 'diagram'
  | 'letter_formal'
  | 'letter_semi_formal'
  | 'letter_personal'
  | 'opinion'
  | 'discussion'
  | 'problem_solution'
  | 'direct_question'
  | 'general_essay';

export interface WritingTaskVersion {
  id: string;
  taskId: string;
  versionNumber: number;
  status: PublicationStatus;
  taskType: WritingTaskType;
  taskNumber: WritingTaskNumber;
  testType: WritingTestType;
  subtype?: WritingTaskSubtype;
  title: string;
  prompt: string;
  instructions: string;
  minWords: number; // 150 for Task 1, 250 for Task 2
  suggestedTimeMinutes: number; // 20 for Task 1, 40 for Task 2
  images?: string[];
  structuredData?: any;
  teacherVisualDescription?: string; // Teacher-verified grounding description for factual accuracy
  modelResponse?: string; // Model response (released only at review stage)
  teacherAssessmentGuidance?: string; // Confidential teacher notes - NEVER exposed to student
  validationErrors?: string[];
  publishedAt?: string;
  createdAt: string;
}

export interface WritingTask {
  id: string;
  title: string;
  taskType: WritingTaskType;
  taskNumber: WritingTaskNumber;
  testType: WritingTestType;
  currentVersionNumber: number;
  status: PublicationStatus;
  latestVersionId: string;
  createdById: string;
  isFreeTier?: boolean;
  createdAt: string;
  updatedAt: string;
  versions?: WritingTaskVersion[];
  subtype?: WritingTaskSubtype;
  prompt?: string;
  instructions?: string;
  minWords?: number;
  suggestedTimeMinutes?: number;
  hasTeacherVisual?: boolean;
}

export interface WritingCriterionItem {
  score: number; // 1.0 - 9.0 in 0.5 increments
  feedback: string;
}

export interface WritingCriteriaScores {
  taskAchievementOrResponse: WritingCriterionItem;
  coherenceCohesion: WritingCriterionItem;
  lexicalResource: WritingCriterionItem;
  grammaticalRange: WritingCriterionItem;
}

export interface WritingEvidenceQuote {
  criterion: 'task_achievement_or_response' | 'coherence_cohesion' | 'lexical_resource' | 'grammatical_range';
  quote: string;
  comment: string;
}

export interface WritingCorrection {
  original: string;
  corrected: string;
  explanation: string;
  type: 'grammar' | 'vocabulary' | 'cohesion' | 'punctuation';
}

export interface WritingAiAssessment {
  id: string;
  responseId: string;
  attemptId: string;
  taskNumber: WritingTaskNumber;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  taskType: WritingTaskType;
  taskBand?: number;
  criteria?: {
    taskAchievementOrResponse: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammaticalRange: number;
  };
  criterionFeedback?: {
    taskAchievementOrResponse?: string;
    coherenceCohesion?: string;
    lexicalResource?: string;
    grammaticalRange?: string;
  };
  evidenceQuotes?: WritingEvidenceQuote[];
  strengths?: string[];
  improvements?: string[];
  corrections?: WritingCorrection[];
  overallFeedback?: string;
  isSimulated?: boolean;
  errorMessage?: string;
  promptTokens?: number;
  completionTokens?: number;
  createdAt: string;
  completedAt?: string;
}

export interface WritingResponse {
  id: string;
  attemptId: string;
  taskId: string;
  taskVersionId: string;
  taskNumber: WritingTaskNumber;
  responseText: string;
  wordCount: number;
  version: number;
  parentResponseId?: string;
  isLocked: boolean;
  aiAssessment?: WritingAiAssessment;
  lastSavedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface WritingAttempt {
  id: string;
  userId: string;
  userName?: string;
  mode: TestMode;
  assignmentId?: string;
  packageAttemptId?: string;
  task1Id?: string;
  task1VersionId?: string;
  task1Title?: string;
  task2Id?: string;
  task2VersionId?: string;
  task2Title?: string;
  status: AttemptStatus;
  task1Response?: WritingResponse;
  task2Response?: WritingResponse;
  durationMinutes: number; // 20, 40, or 60
  deadlineAt?: string; // Shared timer deadline for mock
  task1Band?: number;
  task2Band?: number;
  overallWritingBand?: number; // Weighted average (Task 1 + 2*Task 2) / 3
  startedAt: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WritingAllowanceLedger {
  id: string;
  userId: string;
  amount: number; // + for grant/release, - for reserve/consume
  balanceAfter: number;
  transactionType: 'grant' | 'reservation' | 'consumption' | 'release';
  assessmentId?: string;
  responseId?: string;
  idempotencyKey?: string;
  notes?: string;
  createdById?: string;
  createdAt: string;
}

export interface WritingAllowanceBalance {
  userId?: string;
  totalGranted: number;
  totalConsumed: number;
  totalReserved: number;
  available: number;
}

// -------------------------------------------------------------
// MILESTONE 7: COMMERCIAL ACCESS, TEACHER CODES & PAYMENTS
// -------------------------------------------------------------

export type PlanType = 'free' | 'paid_plan';
export type CommercialProductType = 'paid_plan' | 'writing_assessment' | 'speaking_session' | 'bundle';
export type RenewalType = 'manual' | 'recurring';
export type ProductStatus = 'draft' | 'published' | 'archived';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'expired' | 'refunded' | 'disputed';
export type GrantSourceType = 'purchase' | 'teacher_code' | 'admin_adjustment';
export type GrantType = 'catalogue_access' | 'writing_allowance' | 'speaking_allowance' | 'protected_prepost';
export type TeacherCodeStatus = 'active' | 'revoked' | 'exhausted';

export interface CommercialProduct {
  id: string;
  sku: string;
  title: string;
  description?: string;
  productType: CommercialProductType;
  priceAmount: number; // In base currency units (e.g. IDR rupiah or USD cents)
  currency: string; // 'IDR' or 'USD'
  durationDays?: number; // E.g. 30 days for monthly plan
  writingAllowances: number;
  speakingAllowances: number;
  grantsCatalogueAccess: boolean;
  renewalType: RenewalType;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CommercialOrder {
  id: string; // E.g. 'ORD-1728374900-ABCD'
  userId: string;
  productId: string;
  productSku: string;
  productTitle: string;
  grossAmount: number;
  currency: string;
  paymentProvider: string; // 'midtrans' | 'mock'
  providerTransactionId?: string;
  status: OrderStatus;
  paymentMethod?: string; // 'qris' | 'bank_transfer' | 'credit_card' | 'gopay'
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  refundReason?: string;
  checkoutUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CommercialEntitlementGrant {
  id: string;
  userId: string;
  sourceType: GrantSourceType;
  sourceId: string;
  grantType: GrantType;
  amount: number;
  validFrom: string;
  validUntil?: string;
  status: 'active' | 'expired' | 'revoked';
  notes?: string;
  createdAt: string;
}

export interface TeacherCode {
  id: string;
  code: string;
  label: string;
  description?: string;
  redemptionDeadlineAt?: string;
  accessDurationDays: number;
  maxRedemptions: number;
  redemptionCount: number;
  classId?: string;
  className?: string;
  grantsCatalogueAccess: boolean;
  writingAllowances: number;
  speakingAllowances: number;
  protectedPrepostAllowances: number;
  status: TeacherCodeStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherCodeRedemption {
  id: string;
  codeId: string;
  userId: string;
  userEmail?: string;
  redeemedAt: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  orderId?: string;
  codeId?: string;
  status: 'active' | 'cancelled' | 'expired';
  validFrom: string;
  validUntil: string;
  renewalType: RenewalType;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutPreviewResponse {
  product: CommercialProduct;
  totalPriceFormatted: string;
  currency: string;
  benefitsSummary: string[];
  durationDescription: string;
  renewalNotice: string;
  cancellationRefundTerms: string;
  currentAccessSummary: {
    planType: PlanType;
    planExpiresAt?: string;
    hasCatalogueAccess: boolean;
    availableWritingAllowances: number;
    availableSpeakingAllowances: number;
    protectedWritingAllowances: number;
    protectedSpeakingAllowances: number;
  };
  impactSummary: string;
}

export interface LearnerCommercialSummary {
  planType: PlanType;
  planExpiresAt?: string;
  hasCatalogueAccess: boolean;
  subscriptions: UserSubscription[];
  writingBalance: {
    total: number;
    discretionary: number;
    protectedPrepost: number;
  };
  speakingBalance: {
    total: number;
    discretionary: number;
    protectedPrepost: number;
  };
  recentOrders: CommercialOrder[];
  activeGrants: CommercialEntitlementGrant[];
}

export interface AdminCommercialSummary {
  totalRevenueByCurrency: Record<string, number>;
  orderCountByStatus: Record<string, number>;
  activeSubscribersCount: number;
  products: CommercialProduct[];
  recentOrders: CommercialOrder[];
  teacherCodes: TeacherCode[];
  recentGrants: CommercialEntitlementGrant[];
}

