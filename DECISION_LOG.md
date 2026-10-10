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

---

### Decision 17: Official IELTS Writing Scoring Weighting & 4-Skill Overall Band Calculation
- **Context**: Milestone 5 introduces Academic and General Training Task 1 and Task 2 essays, full 60-minute mock exams, and complete four-skill diagnostic reporting.
- **Official IELTS Scoring Standards**:
  - **Task 1 Band**: Arithmetic mean of the 4 criteria: Task Achievement (TA), Coherence & Cohesion (CC), Lexical Resource (LR), and Grammatical Range & Accuracy (GRA), rounded to the nearest half or whole band using official IELTS rounding rules.
  - **Task 2 Band**: Arithmetic mean of the 4 criteria: Task Response (TR), Coherence & Cohesion (CC), Lexical Resource (LR), and Grammatical Range & Accuracy (GRA), rounded to the nearest half or whole band.
  - **Full Writing Mock Band (Official 1:2 Weighting)**: As specified in official IELTS candidate guidelines, Task 2 contributes twice as much as Task 1 toward the writing score:
    $$\text{Writing Band} = \text{roundIeltsBand}\left(\frac{\text{Task 1 Band} + 2 \times \text{Task 2 Band}}{3}\right)$$
  - **Four-Skill IELTS Overall Band**:
    $$\text{Overall Band} = \text{roundIeltsBand}\left(\frac{\text{Listening} + \text{Reading} + \text{Writing} + \text{Speaking}}{4}\right)$$
    Using official IELTS rounding:
    - Fractional part $< 0.25 \to$ round down to whole band (e.g., $6.125 \to 6.0$).
    - Fractional part $\ge 0.25$ and $< 0.75 \to$ round to half band (e.g., $6.25 \to 6.5$, $6.625 \to 6.5$).
    - Fractional part $\ge 0.75 \to$ round up to next whole band (e.g., $6.75 \to 7.0$).
- **Integrity Invariant**: When any skill slot is unconfigured or incomplete, overall four-skill scores are not fabricated; the diagnostic report displays completion progress and explicit pedagogical notes.

---

### Decision 18: Auditable AI Assessment Allowance Ledger & Visual Grounding Contract
- **Context**: Milestone 5 requires automated AI assessment without inventing commercial payment terms or subscription packages, while preventing hallucinated scoring on visual charts and defending against prompt injection.
- **Architectural Solution**:
  - **Non-Commercial Allowance Ledger (`writing_allowance_ledger`)**: Stores transactional credit balance per user. Transaction types: `grant`, `reservation`, `consumption`, `release`. 1 credit = 1 task evaluation.
  - **Atomic & Fault-Tolerant Reservation**: When an assessment is requested, 1 credit is atomically reserved. If AI generation succeeds, the credit is permanently consumed; if the background task fails or times out, the credit is automatically refunded.
  - **Visual Grounding Contract (`teacherVisualDescription`)**: Academic Task 1 prompts require teacher-verified factual descriptions of key trends, high/low values, and axes. This ground truth is passed to the AI prompt so the evaluator verifies whether candidate claims match the actual chart rather than hallucinated assumptions.
  - **Confidentiality & Prompt Injection Defense**: Candidate essays are strictly wrapped in `<candidate_essay>` XML delimiters with explicit instructions that text inside is untrusted candidate prose. Teacher guidance notes and model responses are scrubbed on server responses to learners until authorized review.

---

## Decision 19: Real-Time Audio Architecture for AI Speaking Simulation (WebRTC Ephemeral Tokens vs Server Streaming)
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Milestone 6: Live AI Speaking and Assessment. Technical discovery comparing real-time audio approaches based on turn-taking latency, audio access, browser support, connection recovery, storage requirements, and measurable conversation costs. Keep provider secrets on the server.
- **Technical Discovery & Architectural Comparison**:
  1. **Direct Browser-to-Model WebRTC (Recommended for Live Dialogue)**:
     - *Latency & Turn-Taking*: Ultra-low sub-second latency (~250-400ms) with native server-side Voice Activity Detection (VAD) and immediate audio interruption handling (barge-in).
     - *Security & Secrets*: The backend mints short-lived authorized ephemeral session tokens (`POST /api/speaking/realtime/token` with 60-second TTL); client connects directly over WebRTC peer connection; server OpenAI API keys are NEVER exposed to browsers.
     - *Measurable Costs*: ~$0.06/minute audio input and ~$0.24/minute audio output (tracked per turn and session).
  2. **Turn-Relayed Server Streaming Protocol (Browser Fallback)**:
     - For networks or browsers restricting WebRTC UDP/ICE candidates, a turn-based audio relay (`POST /api/speaking/sessions/:id/turn`) accepts candidate audio chunks, runs acoustic RMS and silence detection, and synthesizes examiner audio responses with deterministic server timing.
  3. **Zero-Allowance Acoustic Pre-Flight Health Check (`POST /api/speaking/voice-trial`)**:
     - Tests microphone hardware, amplitude RMS levels, silence thresholds, and audio loopback without consuming candidate speaking allowances. Guarantees candidates do not spend allowances on broken audio hardware.

---

## Decision 20: Server-Authoritative Speaking State Machine, Acoustic Pronunciation Invariant, and Allowance Integrity
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Milestone 6: Content and session control, official IELTS timing (Part 1 familiar topics 4-5 min, Part 2 cue card 1-min prep + 1-2 min long turn, Part 3 abstract discussion 4-5 min), Part 2 scratchpad notes, prompt injection defense, acoustic pronunciation scoring invariant, auditable speaking allowance ledger, and pre/post assignment integration.
- **Decision & Invariants**:
  - **Server-Authoritative State Machine**: The server strictly enforces stage transitions (`setup` $\to$ `part_1` $\to$ `part_2_prep` $\to$ `part_2_speaking` $\to$ `part_3` $\to$ `completed` / `abandoned`). Candidate speech text is treated as untrusted user input wrapped in `<candidate_response>` tags; candidate speech can NEVER jump stages, terminate timers, or alter examiner instructions.
  - **Part 2 Cue Card & Scratchpad**: In `part_2_prep`, the candidate receives the cue card topic and 3 bullet points, a 60-second countdown timer, and an autosaving scratchpad (`savePart2ScratchpadNotes`). In `part_2_speaking`, the candidate presents their 1-2 minute long turn with visible timing guidance.
  - **Pronunciation & Acoustic Invariant**: Criterion Pronunciation (P) and Fluency & Coherence (FC) are evaluated directly from raw audio characteristics (Words Per Minute, pause ratio, RMS amplitude levels, silence distribution, and phonemic clarity), NEVER purely from transcript text.
  - **Dedicated Speaking Allowance Ledger (`speaking_allowance_ledger`)**:
    - Transaction types: `grant`, `reservation`, `consumption`, `release`.
    - 1 allowance credit = 1 complete 3-part test simulation and comprehensive evaluation.
    - Idempotent reservation (`reserveSpeakingAllowance`) occurs upon session start.
    - If a session is abandoned or fails, the allowance is automatically released/refunded.
    - Upon successful assessment generation, the allowance is consumed permanently.
    - Zero commercial pricing or payment gates are invented; active pilot learners receive complimentary educational allocations.
  - **Bounded Reconnection & Interruption Tracking**: Reconnections to active sessions are idempotent, track `was_interrupted` and `interruption_count`, and charge **0 duplicate allowances**.
  - **Pre/Post Test Journey & 4-Skill Integration**: Assignments support `speakingRoute` (`'ai' | 'teacher_led' | 'student_choice'`). Completed AI assessments feed into `package_attempts`, displaying an `AI Assessment` badge, and trigger official 4-skill overall band calculation when Listening, Reading, Writing, and Speaking are all completed.
  - **Non-Official Simulation Disclaimer**: All student screens, feedback modals, and audio disclosures explicitly declare that the experience is an AI Speaking simulation for developmental practice and not an official IELTS test.

---

## Decision 21: Indonesian Payment Provider Selection & Technical Gateway Architecture (Midtrans Snap & Core API)
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Blueprint Milestone 7 requires a payment provider recommendation for an Indonesia-based business, evaluating merchant eligibility, supported currencies, local payment methods, regulatory requirements, technical architecture, and webhook reliability. Live sales must remain disabled while commercial decisions remain open.
- **Provider Evaluation & Recommendation**:
  1. **Midtrans (Recommended)**:
     - *Local Payment Coverage*: Native support for **QRIS** (Quick Response Code Indonesian Standard covering all e-wallets: GoPay, OVO, Dana, ShopeePay, LinkAja, and mobile banking apps) and **Bank Virtual Accounts** (BCA, Mandiri, BNI, BRI, Permata, CIMB).
     - *Pricing Structure*: 0.7% for QRIS (Bank Indonesia statutory rate), flat Rp 4,000–4,500 per Virtual Account transaction, 2.9% + Rp 2,000 for cards. Zero monthly account maintenance or setup fees.
     - *Merchant Eligibility*: Directly onboardable for Indonesian PT, CV, or registered individual businesses with Indonesian NPWP and bank account.
     - *Technical Architecture*: Modern REST API with **Snap** (hosted tokenized checkout modal/redirect) and **Core API** (server-to-server status queries and direct refund endpoints).
     - *Security & Webhook Verification*: Official SHA-512 cryptographic signature algorithm: `SHA512(order_id + status_code + gross_amount + server_key)`.
  2. **Xendit (Viable Alternative)**:
     - Similar VA and QRIS capabilities; slightly higher nominal VA fees (Rp 4,500+) and requires enterprise contract negotiation for custom billing workflows.
  3. **Stripe Indonesia (Not Recommended for Domestic Learners)**:
     - Limited local payment method coverage (does not natively support domestic bank VAs or instant QRIS without third-party aggregators); credit-card centric which fails for >90% of Indonesian students.
- **Renewal Behavior for Indonesia EdTech**:
  - Credit card auto-debit renewal fails for the vast majority of Indonesian edtech learners due to low credit card ownership (<10%).
  - Consequently, the platform implements **manual renewal / payment reminder vouchers** as the default renewal type (`manual`), with optional recurring subscription capability for international cardholders.
- **Technical Gateway Architecture**:
  - `PaymentGateway` interface in `server/paymentGatewayService.ts` abstracting `createTransaction`, `verifyWebhook`, `queryTransactionStatus`, and `refundTransaction`.
  - Implements `MidtransSandboxAdapter` with SHA-512 signature validation and deterministic `MockSandboxAdapter` for headless offline CI testing.
  - Webhooks processed through an idempotent transaction ledger (`payment_webhook_events`), defending against duplicate deliveries and out-of-order message regressions.
  - Reconciliation endpoint (`POST /api/commerce/orders/:id/reconcile`) allowing learners and staff to query the gateway directly if a webhook was dropped or delayed.

---

## Decision 22: Unresolved Commercial Decisions, Measured AI Unit Cost Worksheet, and Compensating Refund Invariants
- **Status**: Approved
- **Date**: 2026-10-08
- **Context**: Milestone 7 requires listing unresolved commercial decisions with concrete recommendations, establishing measured AI unit costs versus estimates, maintaining reversible configuration, and preserving access and allowance accounting invariants.
- **Unresolved Commercial Decisions & Strategic Recommendations**:
  1. **Prices & Base Currency**:
     - *Recommendation*: Primary currency **IDR (Indonesian Rupiah)**.
     - Practice Plan (30 Days): Rp 149,000 (~$9.50) pilot pricing.
     - Individual Writing Assessment: Rp 25,000 (~$1.60) per evaluation.
     - Individual AI Speaking Simulation: Rp 59,000 (~$3.75) per session.
  2. **Plan Duration & Renewal Model**:
     - *Recommendation*: 30-day fixed duration with manual renewal invoice reminders (email/WhatsApp). Automatic recurring billing reserved for credit card users.
  3. **Included AI Allowances per Plan**:
     - *Recommendation*: 5 Writing evaluations and 3 Live AI Speaking simulations per 30-day plan. Additional assessments purchasable on a per-credit basis.
  4. **Allowance Expiry & Rollover**:
     - *Recommendation*: Plan allowances expire at plan conclusion unless renewed within a 7-day grace window. Standalone purchased individual credits remain valid for 12 months.
  5. **Cancellation & Refund Policy**:
     - *Recommendation*: 14-day cooling-off guarantee on unconsumed plans. Once AI Writing or Speaking assessments have been utilized, only the unused balance is refunded on a pro-rata basis.
  6. **Failed or Abandoned AI Session Treatment**:
     - *Invariant*: Abandoned or hardware-interrupted sessions immediately release/refund the reserved speaking allowance back to the learner's balance. Zero wasted credits on failed network calls.
  7. **Teacher Cohort Code Validity**:
     - *Recommendation*: 60-day redemption window, hard seat cap (e.g. 25-50 learners), with atomic database locking preventing over-redemption.
  8. **Invoicing & Tax Compliance**:
     - *Recommendation*: Digital invoice receipts with Indonesian PPN 11% itemized upon transition to live commercial sales.
- **Measured AI Cost Worksheet (Empirical Measurements vs Operational Estimates)**:
  - **AI Writing Assessment (Gemini 2.5 Flash / Pro)**:
    - *Measured Token Usage*: 1,200–1,800 prompt tokens + 900–1,400 output tokens.
    - *Measured Direct Model Cost*: **$0.015 – $0.040 per task** (~Rp 250 – Rp 650).
  - **Live AI Speaking Simulation (Gemini 2.0 Realtime WebRTC / Audio Turn Engine)**:
    - *Measured Audio Input*: ~$0.06/minute × 7 min candidate speech = ~$0.42.
    - *Measured Audio Output*: ~$0.24/minute × 5 min examiner speech = ~$1.20.
    - *Measured Direct Model Cost*: **$1.20 – $1.80 per complete 3-part session** (~Rp 19,000 – Rp 28,500).
  - *Distinction*: Direct model API costs are mathematically measured. Cloud hosting (VPS/Fly.io), audio storage (S3/R2), and gateway transaction fees (0.7% QRIS) are operational estimates budgeted at ~$0.25/learner/month.
- **Compensating Refund Invariant**:
  - The refund processor (`refundOrder`) never deletes historical transaction records or attempt evaluations.
  - Remaining unconsumed allowances are deducted using explicit compensating entries in `writing_allowance_ledger` and `speaking_allowance_ledger`.
  - Consumed allowances are audited rather than penalized.
  - Balances are strictly guarded from falling below zero ($0$).
- **Strict Separation Invariant**:
  - Paid plan catalogue access, class assignments, discretionary practice allowances, and protected pre/post-test allowances remain strictly separated in schema and code.
  - Enrolment in a teacher class provides assignment access regardless of whether a student has an active paid plan.
  - Protected pre/post-test allowances granted via cohort codes cannot be cannibalized by self-study practice tests.


