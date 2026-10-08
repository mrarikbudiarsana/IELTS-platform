# IELTS Platform — Decision Log

This log tracks architectural and product decisions, reversible implementation choices, and their rationales, in accordance with the Product & Development Blueprint (Version 1.0, October 2026).

---

## Decision 1: Backend & Database Technology for Milestone 1 (Pilot Architecture)
- **Status**: Approved (Reversible)
- **Date**: 2026-10-08
- **Context**: Blueprint Section 1 & 11 specify an initial launch for 10–50 learners (class students and independent users) with strict permissions, relational isolation, and high responsiveness.
- **Decision**: 
  - Backend: Node.js (v24 LTS) with Express, TypeScript, and native JWT authentication.
  - Database: Relational SQLite using `better-sqlite3` with Write-Ahead Logging (WAL) enabled, strict foreign key constraints, and transactional persistence.
- **Rationale**:
  - Zero external database cloud dependencies required for local development and initial private pilot.
  - SQLite with WAL provides microsecond reads/writes, concurrent reader support, and full ACID compliance easily handling 10–50 concurrent users.
  - The schema uses standard ANSI SQL relational tables (`users`, `roles`, `reading_tests`, `reading_test_versions`, `question_groups`, `questions`, `reading_attempts`, `reading_answers`, `audit_logs`), which can be ported directly to PostgreSQL / Supabase when scaling to commercial deployment without changing domain logic.
- **Reversibility**: Highly reversible. Database access is centralized in a repository layer that can be swapped to PostgreSQL/Prisma/Kysely.

---

## Decision 2: Authentication, Roles, and Privilege Escalation Protection
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Section 2 mandates that public registration must create student accounts only, and teacher/admin privileges must be granted through a protected process. Learner data isolation must be enforced on the server.
- **Decision**:
  - Roles: `student`, `teacher`, `admin`.
  - Public `/api/auth/register` strictly hardcodes role = `student`. Any client payload attempting to specify `teacher` or `admin` is ignored.
  - Teacher/admin privileges can only be granted via:
    1. A protected server bootstrap key (`TEACHER_INVITE_CODE` / `ADMIN_SETUP_KEY`).
    2. An existing authenticated admin user promoting another account via `/api/admin/users/:id/role`.
  - Passwords hashed with `bcryptjs` (salt rounds = 10).
  - Account recovery via secure, time-limited reset tokens (`/api/auth/forgot-password` and `/api/auth/reset-password`).
  - Strict server-side permission checks: learners can only query their own attempts and published tests. Draft tests and other learners' attempts reject with 403 Forbidden.

---

## Decision 3: Server-Authoritative Test Sessions & Answer-Key Security
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Sections 4, 5, and 11 demand that answer keys and explanations remain hidden from learners until permitted review, and that mock deadlines be server-controlled.
- **Decision**:
  - When a student fetches a test during an active attempt (`/api/reading/tests/:id/attempt`), all `answerKey`, `acceptedAlternatives`, `explanation`, and `evidenceQuote` fields are scrubbed from the JSON payload on the server.
  - Mock tests compute `deadlineAt = startedAt + timeLimitMinutes * 60 * 1000` on the server upon attempt creation.
  - Submission timestamp and deadline are verified server-side. If submitted after deadline, the attempt is finalized and flagged as auto-submitted on expiry.
  - Full answers and explanations are only included in the response after the attempt status is `submitted` or `expired`.

---

## Decision 4: Content Versioning and Attempt Immutability
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Section 4: "A published version used by an attempt remains immutable. Editing produces a new draft version; existing attempts retain their original content and marking context."
- **Decision**:
  - A Reading Test entity has a container (`reading_tests`) and multiple version records (`reading_test_versions`).
  - Attempt records bind to a specific `version_id`.
  - If a teacher modifies a published test, the system either blocks in-place mutation and forks a new version (e.g., version 2 draft), or requires publishing as a subsequent version. Previous student attempts continue referencing `version 1`.

---

## Decision 5: Marking Engine Normalization Rules
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Section 5: "Mark from teacher-defined keys with deliberate normalisation. Do not broadly accept near-spellings or semantic approximations."
- **Decision**:
  - Exact normalized matching:
    - Trims leading/trailing whitespace and collapses internal multiple spaces.
    - Case-insensitive comparison (`solar power` matches `Solar Power`).
    - Punctuation normalization (removes trailing periods or unnecessary commas in short answers).
    - Checks word count against teacher's limit (e.g. "NO MORE THAN TWO WORDS AND/OR A NUMBER").
    - Supports teacher-specified pipe-delimited alternatives (e.g. `solar energy|solar power`).
    - Multi-select question marking: checks exact set membership or unordered set match.
  - No fuzzy Levenshtein distance or semantic LLM guessing is used for objective Reading questions, ensuring strict compliance with IELTS exam standards.

---

## Decision 6: Reading Band Score Calculation
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Section 5 & 14: Only show estimated mock bands after verifying appropriate Academic or General Training conversion approach; clearly label estimates.
- **Decision**:
  - Raw score (out of 40 for full mocks, or out of total questions for practice) is always shown.
  - For full 40-question mock tests, verified official conversion tables are applied:
    - **Academic Reading**:
      - 39–40: 9.0 | 37–38: 8.5 | 35–36: 8.0 | 33–34: 7.5 | 30–32: 7.0
      - 27–29: 6.5 | 23–26: 6.0 | 19–22: 5.5 | 15–18: 5.0 | 13–14: 4.5
      - 10–12: 4.0 | 8–9: 3.5 | 6–7: 3.0 | 4–5: 2.5 | 0–3: 0–2.0
    - **General Training Reading**:
      - 40: 9.0 | 39: 8.5 | 37–38: 8.0 | 36: 7.5 | 34–35: 7.0
      - 32–33: 6.5 | 30–31: 6.0 | 27–29: 5.5 | 23–26: 5.0 | 19–22: 4.5
      - 15–18: 4.0 | 12–14: 3.5 | 9–11: 3.0 | 6–8: 2.5 | 0–5: 0–2.0
---

## Decision 7: Listening Architecture and Academic / General Training Sharing
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Section 1 & 4 specify that IELTS Listening is identical in content and scoring for both Academic and General Training candidates. Full mocks require 4 parts with 40 questions total. Targeted practice sets can isolate specific parts or question types.
- **Decision**:
  - Listening tests are marked as `shared` across both Academic and General Training curricula.
  - Test structures support both complete 4-part mocks (40 items) and modular practice sets.
  - Audio can be managed either as a single continuous master recording with segment offsets, or as discrete part recordings.
  - A boolean flag `containsIntroPauses` specifies whether recording already contains official spoken instructions and candidate pauses, avoiding duplicate silence or spoken prompts.

---

## Decision 8: Controlled Audio Playback and Browser Limitation Disclosure
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Section 5 mandates controlled playback for exam mocks without ordinary seeking, pause, or replay, while allowing practice mode seeking/replay.
- **Decision**:
  - In **Mock Mode**: Audio element seeking is blocked in the UI (`pointer-events-none` on progress bar, keyboard shortcut suppression for arrow keys, hidden native seek controls). Audio plays sequentially through official phases: Intro/Read time -> Playback -> Part Check time -> Final 2-minute review.
  - In **Practice Mode**: Full interactive player is provided with seeking, pause, 10s skip backward/forward, and replay.
  - **Browser Limitation Disclosure**: Modern browsers cannot prevent local OS-level audio interception, external hardware recording, or devtools DOM manipulation. To ensure platform integrity, the server never sends answer keys, transcripts, or review timestamps until the student submits, and the server authoritatively enforces mock session deadlines.

---

## Decision 9: Audio Recovery and Interruption Policy
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Section 5 & Acceptance Table (Section 11): "A connection failure must not masquerade as a normal uninterrupted attempt; track any permitted replay or recovery."
- **Decision**:
  - When an attempt is started, the server establishes a non-extendable mock deadline.
  - If a learner disconnects, reloads, or experiences audio failure:
    - Saved responses are automatically retrieved and restored.
    - An interruption event is logged (`was_interrupted = 1`, `interruption_count += 1`, timestamped in `interruption_events_json`).
    - The mock deadline is NOT extended, preventing tactical disconnections to buy thinking time.
    - Any permitted audio recovery or replay is explicitly incremented in `replay_count`.
    - The final results report and teacher submission dashboard display an explicit badge: "Interrupted Attempt (Not an uninterrupted exam rehearsal)".

---

## Decision 10: Official Computer-Delivered Listening Band Conversion
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Section 5 & 14: Only show verified band conversions for complete mocks, identical for Academic and General Training.
- **Decision**:
  - Full 40-question Listening mocks convert raw score (0–40) into official IELTS band scores (2.0–9.0):
    - 39–40: 9.0 | 37–38: 8.5 | 35–36: 8.0 | 32–34: 7.5 | 30–31: 7.0
    - 26–29: 6.5 | 23–25: 6.0 | 18–22: 5.5 | 16–17: 5.0 | 13–15: 4.5
    - 10–12: 4.0 | 8–9: 3.5 | 6–7: 3.0 | 4–5: 2.5 | 0–3: 2.0
  - In computer-delivered IELTS Listening, there are 2 minutes allocated at the end to review answers (unlike paper-based testing which had 10 minutes transfer time).

---

## Decision 11: Class Isolation, Enrolment, and Non-Destructive Removal
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Section 2 & 6: Classes represent structured cohorts (Academic or General Training). Students must only access classes they belong to, and teachers only manage their assigned classes. Removal of class access must never delete historical work or student accounts.
- **Decision**:
  - Classes support Academic or General Training test versions.
  - Learners enrol via secure teacher invitation codes (`CLASS-XXXXXX`) or direct teacher email invitations.
  - Strict server-side role and membership enforcement: students cannot see or query class assignments unless active members; non-class independent work remains private.
  - **Non-destructive removal**: When a teacher removes a student from a class, the enrolment status is transitioned to `removed`. The student user account, past assignment attempts, saved answers, and independent practice history remain completely intact in the database.

---

## Decision 12: Protected Post-Test Content Isolation
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Section 6: Prevent learners from accessing reserved post-test material before release across all routes: practice catalogue, direct links or API requests, and other assignments.
- **Decision**:
  - A server-side checker `isTestReservedInUnreleasedPostTest(testId)` monitors active post-test reservations across all classes.
  - Unreleased post-test materials are automatically scrubbed and excluded from `/api/reading/tests` and `/api/listening/tests` for learners.
  - Any direct API attempt (`/api/reading/tests/:id/start` or `/api/listening/tests/:id/start`) targeting reserved unreleased material without an active, released assignment grant immediately rejects with 403 Forbidden.
  - Post-test assignments require explicit teacher action (`POST /api/assignments/:id/release`) to become accessible to class learners.

---

## Decision 13: Pre-Test vs Post-Test Content Separation & Difficulty Variance
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Section 6: Use different pre-test and post-test content. Warn teachers when selecting overlapping materials; do not claim difficulty equivalence without standardization review.
- **Decision**:
  - Pre-test and post-test configurations require distinct content packages to provide meaningful diagnostic progression.
  - The assignment creation service checks for overlapping material IDs between pre-test and post-test packages. If identical materials are selected, an explicit pedagogical warning is returned.
  - The platform explicitly states that test forms may have slight difficulty variation and does not assume mathematical equivalence between non-standardized forms without formal psychometric calibration.

---

## Decision 14: Diagnostic Pre/Post Progression Report & 4-Skill Integrity
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Section 6, 8, & 14: Deliver diagnostic pre/post comparison reports for Reading and Listening. Clearly label Writing and Speaking as not yet implemented. Do not fabricate scores or overall 4-skill bands. Display scheduling in Asia/Makassar.
- **Decision**:
  - Comparison reports (`getPrePostComparison`) evaluate Reading and Listening side-by-side, displaying raw scores, calibrated band scores, test dates in WITA, and score deltas.
  - Writing and Speaking are explicitly tagged with status `'not_implemented'`. No simulated scores, estimates, or overall 4-skill bands are fabricated.
  - Mandatory pedagogical disclaimer is attached to every report: explains that score deltas reflect performance on specific test versions under respective test conditions, warns against uncritically attributing changes solely to learning progress without accounting for test variation, and states why overall bands cannot be computed.
  - Timezone convention: Timestamps stored in UTC ISO 8601 in SQLite; all deadlines and completed timestamps are formatted in `Asia/Makassar` (WITA, UTC+8) via shared date utilities.

---

## Decision 15: Official IELTS Speaking Scoring Calibration, Partial Practice Isolation, and Draft Privacy
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Section 7 & 14: Teacher-led Speaking assessment. Verify current official IELTS scoring guidance before implementing permitted criterion values, averaging, and rounding. Cite official reference in project documentation. Incomplete criterion scores must not produce an overall score. Support partial practice without treating it as a complete mock. Maintain draft privacy and scrub teacher notes.
- **Decision**:
  - **Official Scoring Guidance Citation**: *IELTS Information for Candidates* & *IELTS.org Scoring in Detail* (official joint partners: British Council, IDP: IELTS Australia, Cambridge Assessment English).
  - **Criterion Scale**: Scores for the four assessment criteria—Fluency and Coherence (FC), Lexical Resource (LR), Grammatical Range and Accuracy (GRA), and Pronunciation (P)—are assigned on a 1.0 to 9.0 scale in 0.5 step increments.
  - **Overall Band Averaging & Rounding**:
    - Arithmetic mean: `mean = (FC + LR + GRA + P) / 4`.
    - If the fractional remainder ends in `.25` (e.g., 6.25), round **UP** to `.5` (e.g., 6.5).
    - If the fractional remainder ends in `.75` (e.g., 6.75), round **UP** to next whole band (e.g., 7.0).
    - If the fractional remainder is `< 0.25`, round down to `.0`.
    - If the fractional remainder is `>= 0.25` and `< 0.75`, round to `.5`.
    - If the fractional remainder is `>= 0.75`, round up to `1.0`.
  - **Incomplete Criterion Invariant**: Complete 3-part mocks require all four criteria before an overall band can be computed or released. Missing criteria produce `overallBand: undefined`.
  - **Partial Practice Isolation**: Single-part or modular practice (e.g. Part 1 only, or Part 2 only) is explicitly labelled as `partial_practice` and **never** generates an overall band score. It cannot satisfy complete pre/post test requirements.
  - **Draft Privacy & Learner Scrubbing**: Assessments in `'draft'` status strictly reject student access with 403 Forbidden. When an assessment is `'released'`, `teacherPrivateNotes` are strictly scrubbed from learner API responses and UI views.
  - **Zero Commercial Impact**: Teacher-led Speaking sessions do NOT consume AI allowances or require paid subscription upgrades.

---

## Decision 16: Transparent Audited Score Corrections and Optional Audio Recording Policy
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Section 7: Support score corrections after release with clear reasons. Recording is optional (scores enterable without audio). Disclose recording to learner, restrict access, and document 90-day retention/deletion policy.
- **Decision**:
  - **Transparent Score Correction Audit Trail**: Teachers can correct released speaking scores via `POST /api/speaking/assessments/:id/correct`. Overwrites without history are prohibited; every adjustment creates an immutable audit record in `speaking_score_corrections` storing `previousScores`, `updatedScores`, `reason` (mandatory detailed string), `teacherId`, and `correctedAt`. Recalculates official band automatically.
  - **Audio Recording Optionality**: Voice recording upload is entirely optional. Full evaluations and band scores can be completed and submitted purely from live teacher notes without audio.
  - **Audio Retention & Disclosure Policy**: If an audio recording is uploaded, candidate disclosure is confirmed via `recordingRetentionAcknowledged = true`. Platform policy enforces strict learner/teacher access controls and a 90-day data retention period, after which audio artifacts are scheduled for deletion.

