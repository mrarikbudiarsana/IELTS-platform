# IELTS Preparation Platform — Implementation Progress

This document tracks implementation status across the stages outlined in the Product & Development Blueprint (Version 1.0).

---

## Milestone 1: Accounts and Complete IELTS Reading Support (COMPLETED & VERIFIED)
- [x] Phase 1: Planning & Architectural Foundations
- [x] Phase 2: Accounts, Authentication & Role Isolation
- [x] Phase 3: Reading Engine & All 16 Question Formats
- [x] Phase 4: Student Experience & Test Runner (Highlighter, split pane, autosave)
- [x] Phase 5: Marking Engine & Results Analytics (Non-fuzzy, Academic & GT band thresholds)
- [x] Phase 6: Demonstration Content & Automated Verification (9/9 checks passed)
- [x] Phase 7: Deep Pedagogical Explanations & Interactive Passage Grounding (`ResultsView.tsx`):
  - Why correct vs. why incorrect breakdown for every question
  - Distractor analysis for Multiple Choice questions (A, B, C, D)
  - Official IELTS trap analysis (True/False/Not Given, Yes/No/Not Given, and word count traps)
  - Key vocabulary & paraphrasing mapping tables (`[Question Keyword]` ➔ `[Passage Equivalent]`)
  - Grounding evidence quote with paragraph reference (`Paragraph 2`)
  - Interactive Passage Reference Drawer: opens passage context with the target paragraph and highlighted quote
  - Security sanitization: explanation data strictly scrubbed for active in-progress attempts

---

## Milestone 2: Complete IELTS Listening Support (COMPLETED & VERIFIED)

### Phase 1: Models & Architecture
- [x] Shared data models for Listening parts, audio configurations, and question groups (`shared/types.ts`)
- [x] Database schema for `listening_tests`, `listening_test_versions`, `listening_attempts`, `listening_answers` (`server/db.ts`)
- [x] Official IELTS Listening band conversion scale (0–40) with verified Academic/GT equivalence (`shared/scoring.ts`)

### Phase 2: All 11 Listening Question Formats
- [x] Multiple Choice (Single Answer)
- [x] Multiple Choice (Multiple Answers / Set Selection)
- [x] Matching (Features, Classifications, Options)
- [x] Plan, Map, and Diagram Labelling (with SVG diagram interactive pin drop)
- [x] Form Completion (Standard customer/application forms)
- [x] Note Completion (Bullet point structured notes with gaps)
- [x] Table Completion (Multi-column tables with inline gap inputs)
- [x] Flow-Chart Completion (Sequential stage boxes with text gaps)
- [x] Summary Completion (Continuous text summary with word/number rules)
- [x] Sentence Completion (Targeted sentence gaps)
- [x] Short-Answer Questions (Direct questions with strict word limit)

### Phase 3: Audio Control & Interruption Recovery
- [x] Audio and volume calibration check modal before starting test
- [x] Practice mode: full interactive audio seeking, pause, replay, speed controls
- [x] Mock mode: controlled playback without ordinary pause/seeking, official exam phases
- [x] Server-authoritative timeline & auto-submission on expiry
- [x] Complete Interruption & Recovery Tracking Policy:
  - Page reloads, disconnects, and browser drops logged in auditable event log
  - Replay attempts tracked in `replay_count`
  - Explicit badge on results certificate: "Uninterrupted Exam Rehearsal" vs "Interrupted Session"
  - Clear disclosure of browser playback boundary limitations

### Phase 4: Teacher Content Authoring & Submissions
- [x] Listening test builder: multi-part support (Parts 1–4), audio configuration, pauses flag
- [x] Question group editor supporting all 11 listening formats, accepted alternatives, timestamps, transcript excerpts
- [x] Pre-publication validation checklist (continuous question numbering, answer keys, audio urls)
- [x] Versioning and attempt immutability (draft forks retain previous attempts)
- [x] Teacher submission dashboard for reviewing student listening attempts

### Phase 5: Demonstration Content & Automated Verification
- [x] Full 4-part 40-question IELTS Listening demonstration mock with authentic speech-synthesized audio tracks
- [x] Targeted listening practice sets with interactive seeking and instant feedback
- [x] Map diagram asset: `riverside_park_map.svg` with lettered pins A–G
- [x] Automated test runner (`test/runListeningTests.ts`) passing 8/8 checks (100%)
- [x] Unified test suite (`npm test`) passing all 17 checks across Reading & Listening

---

## Milestone 3: Classes, Assignments, and the Pre-Test → Practice → Post-Test Journey (COMPLETED & VERIFIED)

### Phase 1: Class Management & Protected Enrolment
- [x] Multi-tenant class models with Academic / General Training test types (`classes`, `class_enrolments`)
- [x] Role authorization: teacher class creation and update isolation
- [x] Protected student enrolment via invitation codes (`CLASS-XXXXXX`) or teacher email invitations
- [x] Non-destructive removal: soft removal preserves learner accounts and past attempt history

### Phase 2: Multi-Skill Test Packages & 4-Skill Slot Integrity
- [x] Test packages (`test_packages`) referencing fixed published versions of Reading and Listening
- [x] Explicit 4-skill slots: Reading, Listening, Writing, Speaking
- [x] Writing and Speaking strictly labelled as `not_implemented` (no simulated or fabricated scores)
- [x] Package attempt execution & skill linking (`package_attempts`)

### Phase 3: Assignment Engine & Scheduling
- [x] Assignment purposes: Diagnostic Pre-Test, Course Practice, and Protected Post-Test (`assignments`)
- [x] Server-enforced attempt limits and mode settings (mock vs practice)
- [x] Asia/Makassar (WITA, UTC+8) display scheduling with UTC ISO 8601 storage
- [x] Material overlap detection: warns teachers when selecting overlapping materials between pre-test and post-test

### Phase 4: Protected Post-Test Content Isolation
- [x] Reserved unreleased post-test materials strictly isolated from learners
- [x] Automatic catalogue hiding via `isTestReservedInUnreleasedPostTest`
- [x] Direct URL and API access blocking (403 Forbidden) for unreleased reserved content
- [x] Explicit teacher post-test release action (`POST /api/assignments/:id/release`)

### Phase 5: Student Class Dashboard & Teacher Management Views
- [x] Student Class Dashboard (`StudentClassDashboardView.tsx`):
  - Enrolment via invitation code
  - 3-stage journey: Pre-Test card, Course Practice list, locked/released Post-Test card
  - Asia/Makassar deadlines and overdue tracking without deleting work
- [x] Teacher Class Management (`TeacherClassManagementView.tsx`):
  - Cohort switcher & invitation code sharing
  - Assignment scheduler with overlap warnings
  - Explicit "Release Post-Test Now" button
  - Non-destructive student removal
  - Class diagnostic overview & question type difficulty accuracy metrics
- [x] Pre vs Post Progression Report Modal (`PrePostComparisonModal.tsx`):
  - Side-by-side Reading and Listening raw and calibrated band scores
  - Score deltas calculation
  - Missing skill badges for Writing and Speaking
  - Mandatory pedagogical disclaimer: warns that score changes reflect specific test versions and must not be uncritically attributed purely to learning progress

### Phase 6: Automated Verification Suite
- [x] Milestone 3 automated verification suite (`test/runClassTests.ts`) passing 9/9 checks (100%)
- [x] Full platform regression suite (`npm test`) passing all 26 checks (Reading 9, Listening 8, Classes & Journey 9)
- [x] Production frontend build (`npm run build`) compiles cleanly with 0 TypeScript errors

---

## Milestone 4: Teacher-Led Speaking Assessment (COMPLETED & VERIFIED)

### Phase 1: Speaking Content Editor & Versioning
- [x] Shared data models for Speaking sets, cue cards, discussion themes, criteria, and audit records (`shared/types.ts`)
- [x] Database tables: `speaking_sets`, `speaking_set_versions`, `speaking_assessments`, `speaking_score_corrections` (`server/db.ts`)
- [x] Speaking set builder supporting Part 1 topics, Part 2 cue cards (bullet points, prep time, speaking time), Part 3 two-way discussion questions, and teacher notes
- [x] Draft saving, validation checklist (required prompts, cue card bullets, questions), publishing, and immutable forking
- [x] Support for "Teacher's own questions" for sessions conducted on free topics without a saved set

### Phase 2: Verified Official IELTS Speaking Scoring Engine Calibration
- [x] Verified official IELTS Speaking scoring rules implemented in `shared/scoring.ts`:
  - Official Joint Citation: *IELTS Information for Candidates* & *IELTS.org Scoring in Detail*
  - Four assessment criteria: Fluency and Coherence (FC), Lexical Resource (LR), Grammatical Range and Accuracy (GRA), and Pronunciation (P)
  - 1.0 to 9.0 scale in 0.5 step increments
  - Arithmetic mean calculation: `mean = (FC + LR + GRA + P) / 4`
  - Exact official rounding: `.25` rounds UP to `.5`; `.75` rounds UP to whole band (+1.0); `< .25` rounds down to `.0`; `>= .25 && < .75` rounds to `.5`; `>= .75` rounds up to `1.0`
- [x] Validation utility `validateSpeakingCriterionScore` rejecting non-conforming step values or out-of-range bounds
- [x] Clear practice score disclaimer attached: estimated practice score based on IELTS criterion descriptors, not an official IELTS certificate

### Phase 3: Teacher-Led Assessment Session & Learner Draft Privacy Guard
- [x] Teacher assessment queue and scoring console (`/api/speaking/assessments`, `TeacherSpeakingAssessmentView.tsx`)
- [x] Enforces draft privacy: students requesting draft assessments receive strict 403 Forbidden
- [x] Confidential teacher private notes: strictly scrubbed from student API responses and student UI views
- [x] Teacher-led sessions operate with zero commercial AI allowance consumption

### Phase 4: Partial Practice vs Complete Mock Isolation
- [x] Complete 3-part mock requires covering Part 1, Part 2, and Part 3 with all 4 criterion scores before release
- [x] Incomplete criterion scores cannot produce an overall score or be released as a complete mock
- [x] Partial practice (e.g. Part 1, Part 2, or Part 3 only) is explicitly labelled as `partial_practice`
- [x] Invariant enforced: partial practice **never** calculates an overall band score (`overallBand === undefined`) and cannot satisfy multi-skill mock pre/post requirements

### Phase 5: Score Corrections Audit Trail & Audio Policy
- [x] Transparent score corrections endpoint (`POST /api/speaking/assessments/:id/correct`):
  - In-place un-audited overwriting of released scores is prohibited
  - Mandates detailed teacher reason string
  - Creates timestamped immutable audit record in `speaking_score_corrections`
  - Recalculates official overall band automatically
- [x] Optional voice recording upload: scores can be entered and released purely without audio
- [x] Audio disclosure and retention policy: explicit candidate disclosure acknowledgement required; 90-day retention/deletion policy documented

### Phase 6: Pre/Post Journey Integration & Progression Report
- [x] Multi-skill test packages (`test_packages`) support configuring published Speaking sets
- [x] Package attempt execution links speaking assessments (`speaking_assessment_id`)
- [x] Pre/Post diagnostic comparison report (`PrePostComparisonModal.tsx`):
  - Populates Speaking slot when released assessment exists
  - Displays 4-criterion breakdown (FC, LR, GRA, P), teacher assessor label, and score audit count
  - Calculates Speaking band delta: `deltas.speakingBandDelta`
  - Writing remains clearly labelled as `not_implemented` (pending Milestone 5)

### Phase 7: Automated Verification Suite & Production Build
- [x] Milestone 4 automated test runner (`test/runSpeakingTests.ts`) passing 10/10 checks (100%):
  1. Official IELTS Speaking Scoring Engine Calibration & Rounding
  2. Speaking Content Editor & Version Immutability
  3. Teacher Assessment Draft & Learner Draft Privacy Guard
  4. Assessment Release & Private Notes Scrubbing
  5. Incomplete Criterion Guard for Complete Mock Release
  6. Partial Practice Isolation (No Overall Band / Labelled Partial)
  7. Transparent Score Corrections & Audit History
  8. Audio Recording Optionality & Disclosure Retention Policy
  9. Pre/Post Test Journey Integration & Speaking Delta
  10. Teacher Queue & Student Assessment List
- [x] Full unified platform test suite (`npm test`) passing all 36 checks (Reading 9, Listening 8, Classes & Journey 9, Speaking 10)
- [x] Production client build (`npm run build`) passing with 0 TypeScript errors

---

## Milestone 5: Writing Workspace and AI Assessment (COMPLETED & VERIFIED)

### Phase 1: Models, Database Schema & Scoring Calibration
- [x] Shared data models in `shared/types.ts`:
  - `WritingTaskType`, `WritingTestType`, `WritingTaskNumber`, `WritingTaskSubtype`
  - `WritingTask`, `WritingTaskVersion`, `WritingAttempt`, `WritingResponse`, `WritingAiAssessment`
  - `WritingAllowanceLedger`, `WritingAllowanceBalance`
- [x] Database schema in `server/db.ts`:
  - `writing_tasks`, `writing_task_versions`, `writing_attempts`, `writing_responses`, `writing_assessments`, `writing_allowance_ledger`
  - Schema migrations for `test_packages` and `package_attempts` writing columns
- [x] Official IELTS Writing scoring engine in `shared/scoring.ts`:
  - `calculateIeltsWritingTaskBand`: arithmetic mean of 4 criteria (TA/TR, CC, LR, GRA) rounded to nearest 0.5/whole band
  - `calculateIeltsWritingOverallBand`: official IELTS candidate guide weighting where Task 2 carries double the weight of Task 1:
    $$\text{Writing Band} = \text{roundIeltsBand}\left(\frac{\text{Task 1 Band} + 2 \times \text{Task 2 Band}}{3}\right)$$
  - `calculateIeltsFourSkillOverallBand`:
    $$\text{Overall Band} = \text{roundIeltsBand}\left(\frac{L + R + W + S}{4}\right)$$
  - `countWords`: official IELTS word counting standard (hyphenated words count as one)

### Phase 2: Teacher Content Editor & Visual Grounding Contract
- [x] Teacher content editor supporting:
  - Academic Task 1: charts, tables, maps, processes, diagrams
  - General Training Task 1: formal, semi-formal, and personal letters
  - Task 2 essays: opinion, discussion, problem/solution, direct questions
- [x] Teacher-verified visual grounding (`teacherVisualDescription`):
  - Mandatory on Academic Task 1 before publication
  - Ground truth data points, axes, and trends passed to AI prompt to prevent factual hallucinations
- [x] Immutability & versioning: published tasks remain immutable; draft edits create new versions
- [x] Confidential guidance isolation: `teacherAssessmentGuidance` and unpublished `modelResponse` are strictly scrubbed from candidate API responses

### Phase 3: Student Workspace & Response Management
- [x] Split-screen interface (`WritingWorkspaceView.tsx`):
  - Left pane: prompt, instructions, structured data tables, visual images
  - Right pane: response text editor with live IELTS word count progress
  - Responsive layout for smaller screens
- [x] State recovery & autosave:
  - Debounced autosave every 3 seconds to `POST /api/writing/attempts/:id/save`
  - Real-time save status indicator ("Saved", "Saving...", "Offline")
  - Automatic session recovery after browser refresh or reconnection
- [x] Full mock shared timer:
  - Shared 60-minute server-enforced countdown for complete mocks (Task 1 + Task 2)
  - Early submission confirmation modal and automatic submission upon expiry
- [x] Response locking & revision drafts:
  - Submissions lock student response versions permanently
  - Students can fork revision drafts (`POST /api/writing/attempts/:id/revisions`) without altering past assessed work

### Phase 4: Server-Side AI Assessment & Background Queue
- [x] Asynchronous queue pipeline (`server/aiWritingService.ts`):
  - Lifecycle: `queued` → `processing` → `completed` / `failed`
  - Real OpenAI API call with timeout protection and calibrated rubric fallback (`isSimulated = 1`)
- [x] Prompt injection defense:
  - Candidate essays isolated inside `<candidate_essay>` XML delimiters
  - Explicit system instruction declaring candidate text as untrusted linguistic data to be evaluated, never executed
- [x] Multi-criterion diagnostic feedback (`WritingFeedbackView.tsx`):
  - Band scores for TA/TR, CC, LR, GRA
  - Evidence quotes extracted directly from candidate submission
  - Identified strengths and prioritized improvement actions
  - Actionable sentence corrections with grammatical and cohesion explanations

### Phase 5: Auditable Allowance Ledger (Non-Commercial)
- [x] Transactional ledger (`server/allowanceService.ts` & `writing_allowance_ledger`):
  - Transaction types: `grant`, `reservation`, `consumption`, `release`
  - 1 allowance = 1 task evaluation
  - Atomic reservation on assessment request; consumption on completion; immediate refund on failure
  - Admin pilot grant modal in teacher view (no commercial pricing or Stripe terms invented)

### Phase 6: Pre/Post Diagnostic Integration & 4-Skill Overall Band
- [x] Multi-skill test packages (`test_packages`) support configuring published Writing tasks
- [x] Pre-Test and Post-Test execution links writing attempts (`writing_attempt_id`)
- [x] Pre/Post diagnostic comparison report (`PrePostComparisonModal.tsx`):
  - Displays Writing band breakdown (Task 1, Task 2, Overall Writing Band, AI Assessor badge)
  - When all 4 skills are completed, computes and displays the official Four-Skill IELTS Overall Band
  - Displays overall band delta (`deltas.overallBandDelta`) and pedagogical advisory notice

### Phase 7: Automated Verification Suite & Production Build
- [x] Milestone 5 automated test runner (`test/runWritingTests.ts`) passing 47/47 checks (100%):
  1. Official IELTS Writing Scoring & 4-Skill Band Calculations (8 checks)
  2. Task Authoring & Teacher-Verified Visual Grounding (5 checks)
  3. Auditable Allowance Ledger & Invariants (4 checks)
  4. Student Workspace, Autosave & Shared Mock Timer (14 checks)
  5. AI Writing Assessment Execution & Criteria Breakdown (13 checks)
  6. TestPackage & Pre/Post Comparison 4-Skill Integration (3 checks)
- [x] Unified test suite (`npm test`) passing all 83 checks across all 5 milestones (Reading 9, Listening 8, Classes & Journey 9, Speaking 10, Writing 47)
- [x] Production client build (`npm run build --prefix client`) passing with 0 errors

---

## Milestone 6: Live AI Speaking and Assessment (COMPLETED & VERIFIED)

### Phase 1: Real-Time Audio Architecture & Technical Discovery
- [x] Technical discovery comparing direct WebRTC ephemeral token minting vs server turn streaming relay
- [x] Provider credentials kept secure on server (`OPENAI_API_KEY`); ephemeral session tokens minted via `POST /api/speaking/realtime/token` with 60-second TTL
- [x] Pre-flight acoustic voice trial endpoint (`POST /api/speaking/voice-trial`):
  - Hardware microphone capture test
  - Acoustic amplitude RMS and silence detection
  - Speech loopback verification
  - Zero-allowance invariant: tests mic without consuming student allowances

### Phase 2: Content Authoring & Session Boundaries
- [x] Extended Speaking Set editor schema:
  - Part 1 familiar topics and prompts
  - Part 2 cue cards with bullets
  - Part 3 two-way discussion themes
  - AI follow-up guidance (`followUpGuidanceJson`)
  - Teacher-only confidential instructions (`teacherOnlyInstructions`, `aiInstructions`)
- [x] Mode configurations:
  - Practice mode: developmental conversational turns, retry allowances, instant formative tips
  - Mock mode: strict official timing, uninterrupted flow, server-enforced stages

### Phase 3: Server-Authoritative State Machine & Prompt Injection Defense
- [x] Server-enforced stage transitions:
  - `setup` → `part_1` → `part_2_prep` → `part_2_speaking` → `part_3` → `completed` / `abandoned`
- [x] Illegal transitions and stage jumping strictly blocked (HTTP 400)
- [x] Part 2 cue card preparation:
  - 60-second preparation countdown timer
  - Autosaving scratchpad notes (`POST /api/speaking/sessions/:id/part2-notes`)
  - 1–2 minute long-turn speaking timer
- [x] Robust prompt-injection defense:
  - Candidate transcripts wrapped in `<candidate_response>` XML tags
  - Speech content cannot override test stages, scoring rules, or examiner prompts

### Phase 4: Bounded Recovery & Reconnection Invariants
- [x] Idempotent session recovery (`startOrRecoverSpeakingSession`):
  - In-progress sessions restored automatically upon reconnection
  - `was_interrupted = 1` and `interruption_count` incremented
  - Zero duplicate allowance charges on reconnect

### Phase 5: Audio-Grounded AI Assessment Engine
- [x] Acoustic direct evaluation:
  - Words Per Minute (WPM), pause ratio, silence distribution, and phonemic clarity calculated directly from raw audio characteristics, never solely from text transcripts
- [x] Official 4-criterion IELTS scoring:
  - Fluency & Coherence (FC), Lexical Resource (LR), Grammatical Range & Accuracy (GRA), Pronunciation (P)
  - Criterion validation ensuring 1.0–9.0 in 0.5 increments
  - Official IELTS band score rounding (`mean = (FC + LR + GRA + P) / 4`)
- [x] Diagnostic feedback deliverables:
  - Timestamped candidate evidence quotes
  - Specific acoustic observations
  - Strengths and prioritized actionable improvements
- [x] Explicit non-official disclaimer: simulation clearly labeled as an AI Speaking simulation, not an official IELTS examination

### Phase 6: Auditable Speaking Allowance Ledger
- [x] Dedicated transactional ledger (`speaking_allowance_ledger`):
  - Operations: `grant`, `reservation`, `consumption`, `release`
  - Atomic reservation (1 credit per session) upon session launch
  - Permanent consumption on successful evaluation release
  - Automatic refund upon session abandonment or failure
  - Zero commercial pricing or payment gates invented

### Phase 7: Pre/Post Journey Integration & Class Assignments
- [x] Assignment speaking routes (`speakingRoute`: `'ai' | 'teacher_led' | 'student_choice'`)
- [x] Package attempts link speaking AI sessions (`package_attempts.speaking_ai_session_id`)
- [x] Diagnostic pre/post comparison renders AI assessment badges and calculates 4-skill overall IELTS band when Reading, Listening, Writing, and Speaking are all completed

### Phase 8: Verification Suite & Client Production Build
### Phase 8: Verification Suite & Client Production Build
- [x] Milestone 6 automated test suite (`test/runAiSpeakingTests.ts`) passing all 8 checks (100%):
  1. Voice Trial & Acoustic Pre-flight Health Check (Zero Allowance)
  2. Real-time WebRTC Ephemeral Token Minting
  3. Dedicated Speaking Allowance Ledger & Invariants
  4. Official IELTS Speaking Content & Versioning
  5. Server-Authoritative State Machine & Prompt Injection Defense
  6. Bounded Reconnection & Recovery Invariants
  7. Audio-Grounded AI Assessment & 4 Criteria Breakdown
  8. Pre/Post Journey Integration, Class Assignment & 4-Skill Band
- [x] Complete unified test runner (`npm test`) executing M1 through M6 passing 100%
- [x] Client production build (`npm run build --prefix client`) passing with 0 errors

---

## Milestone 7: Commercial Access, Teacher Codes, and Payments (COMPLETED & VERIFIED)

### Phase 1: Unresolved Commercial Decisions & Unit Cost Worksheet
- [x] Explicit documentation of all 9 unresolved commercial decisions in `DECISION_LOG.md` (Decision 22):
  - Prices & currency (primary IDR, with USD international support)
  - Plan duration (30 days pilot) & manual renewal standard for Indonesia edtech
  - Included AI assessment allowances (5 Writing tasks, 3 Speaking sessions per plan)
  - Allowance expiry (30-day plan expiry, 12-month individual credit validity)
  - Cancellation & refund policy (14-day cooling-off period on unconsumed plans)
  - Failed/abandoned AI session treatment (immediate allowance refund)
  - Teacher cohort codes (60-day validity, 25-50 seat caps, atomic transactions)
  - Indonesian invoicing and tax compliance (PPN 11%, digital receipts)
- [x] Measured AI Unit Cost Worksheet contrasting empirical token/audio costs against operational overheads:
  - AI Writing: **$0.015 – $0.040 per task** (~Rp 250 – Rp 650)
  - Live AI Speaking: **$1.20 – $1.80 per complete 3-part mock** (~Rp 19,000 – Rp 28,500)
  - Estimated operational overheads (cloud hosting, storage, 0.7% QRIS): ~$0.25/learner/month

### Phase 2: Indonesian Payment Provider Selection & Technical Gateway
- [x] Payment provider selection analysis in `DECISION_LOG.md` (Decision 21):
  - Evaluated Midtrans Snap & Core API vs Xendit vs Stripe Indonesia
  - Recommended Midtrans for domestic Indonesian edtech: statutory 0.7% QRIS, flat nominal Virtual Accounts (BCA, Mandiri, BNI, BRI, Permata), and manual renewal voucher model matching domestic banking habits (<10% credit card penetration)
- [x] Payment Gateway Service (`server/paymentGatewayService.ts`):
  - `PaymentGateway` interface: `createTransaction`, `verifyWebhook`, `queryTransactionStatus`, `refundTransaction`
  - `MidtransSandboxAdapter`: official SHA-512 signature verification `SHA512(order_id + status_code + gross_amount + server_key)`
  - `MockSandboxAdapter`: deterministic offline testing adapter
  - Reversible configuration: live sales remain disabled while commercial decisions remain open; unconfigured products remain unpublished

### Phase 3: Commercial Data Architecture & Ledger Migrations
- [x] Database tables in `server/db.ts`:
  - `commercial_products`: catalogue products, SKU, price, currency, duration, allowances, renewal type, status (`draft`, `published`, `archived`)
  - `commercial_orders`: orders, payment provider, transaction IDs, gross amount, status (`pending`, `paid`, `failed`, `refunded`), refund audits
  - `commercial_entitlement_grants`: tracks source (purchase, teacher code, admin adjustment), grant type, amount, validity
  - `teacher_codes` & `teacher_code_redemptions`: cohort codes, max redemptions, access duration, discretionary and protected allowances
  - `user_subscriptions`: plan links, validity periods, renewal type, cancellation tracking
  - `payment_webhook_events`: idempotent webhook delivery log
  - Columns: `users.plan_type`, `users.plan_expires_at`, `is_free_tier` on Reading, Listening, Writing, and Speaking content

### Phase 4: Commercial Core Service & Access Rules
- [x] Commercial Service (`server/commercialService.ts`):
  - Product lifecycle: draft creation, publishing validation, archiving
  - Pre-payment checkout disclosure (`getCheckoutPreview`): server-authoritative price, currency, duration, allowances, terms, and current user status comparison
  - Order creation (`createOrder`): server-calculated pricing, prevents ordering unpublished draft products
  - Webhook processor (`processPaymentWebhook`): cryptographic verification, idempotency protection via `payment_webhook_events`, out-of-order state guards
  - Missed-notification reconciliation (`reconcileOrder`): syncs payment status directly from gateway
  - Compensating refund processor (`refundOrder`): revokes remaining unused allowances, audits consumed allowances, resets plan access, never creates negative balances or deletes audit history
  - Atomic teacher code redemption (`redeemTeacherCode`): SQLite database transaction locking preventing race-condition over-redemption, enforces 1 redemption per learner
  - Protected pre/post-test allowance isolation: separate tracking of protected diagnostic assessment slots from discretionary practice
  - Audited staff balance adjustments (`adjustUserBalance`): mandatory staff reason, immutable ledger logs
  - Access rule engine (`canUserAccessTest`): strict separation of free tier content, paid plan catalogue access, and class assignment access

### Phase 5: Client Views & Navigation Integration
- [x] Learner Store & Entitlements View (`client/src/views/AccountCommercialView.tsx`):
  - Current plan status badge, expiry countdown, discretionary vs protected balances
  - Teacher code redemption with benefit preview
  - Product catalogue with pre-payment disclosure modal
  - Sandbox payment simulator with QRIS / Virtual Account mocks
  - Order transaction history with missed-notification reconciliation button
- [x] Staff Commercial & Financial Management (`client/src/views/AdminCommercialManagementView.tsx`):
  - KPI overview: Total Collected Revenue (IDR), Active Subscribers, Orders Breakdown, Active Teacher Codes
  - Products & Pricing tab: draft/published status toggles, product creation modal
  - Orders & Payments tab: order inspection, reconciliation trigger, compensating refund modal
  - Teacher Codes tab: cohort code generator with class links, usage limits, revocation action
  - Audited Balance Adjustments tab: reasoned ledger balance adjustment console
- [x] Navigation wiring:
  - Navbar links: "Plans & Store" (`commercial_store`) for students, "Commercial Admin" (`commercial_admin`) for staff
  - Router mounted in `App.tsx`

### Phase 6: Automated Verification Suite (100% Pass)
- [x] Milestone 7 automated test suite (`test/runCommercialTests.ts`) passing all 13 checks (100%):
  1. Product configuration & draft status rejection (unpurchasable)
  2. Server-side price calculation & pre-payment checkout disclosure
  3. Sandbox checkout order creation
  4. Webhook verification with SHA-512 & idempotent processing
  5. Out-of-order webhook delivery protection
  6. Missed-notification reconciliation (`reconcileOrder`)
  7. Entitlement & allowance activation for paid practice plan
  8. Individual assessment purchases (credits without unlocking full catalogue)
  9. Atomic teacher code redemption & max limit enforcement
  10. One-redemption-per-learner rule & revoked code rejection
  11. Protected pre/post-test allowance isolation
  12. Compensating ledger refunds without deleting history
  13. Separation of class assignment access from commercial plan access
  + Admin Commercial Summary & Audited Balance Adjustment verification
- [x] Complete unified platform test runner (`npm test` / `test/runAll.ts`) executing M1 through M7 passing 100%
- [x] Production frontend build (`npm run build --prefix client`) compiling cleanly with 0 errors

---

## Content Additions: Real Cambridge IELTS Test Ingestion
- [x] **Cambridge IELTS 21 Academic Reading Test 4** (Ingested & Verified):
  - Extracted directly from `Cambridge IELTS 21 Academic Reading Test 4 (Free Online Test & Answers).pdf`
  - Ingested into local SQLite database via [ingestCambridge21Test4.ts](file:///d:/Website/IELTS%20new/server/ingestCambridge21Test4.ts)
  - 3 authentic Reading passages with complete paragraph structuring:
    - Passage 1: *The problems and benefits created by the spread of the water hyacinth in Kenya*
    - Passage 2: *How could multilingualism benefit India's poorest schoolchildren?*
    - Passage 3: *The Globemakers: The Curious Story of an Ancient Craft*
  - 9 question groups covering all 40 questions (Questions 1–40):
    - Questions 1–7: True / False / Not Given
    - Questions 8–10: Flow-chart completion (*Generating biogas for domestic use in Dunga*)
    - Questions 11–13: Note completion (*Cooking with biogas in Dunga*)
    - Questions 14–19: Summary completion with options A–J (*Multilingualism in Delhi*)
    - Questions 20–23: Yes / No / Not Given
    - Questions 24–26: Multiple choice (single answer)
    - Questions 27–32: Summary completion with options A–J (*A birthday gift*)
    - Questions 33–36: Yes / No / Not Given
    - Questions 37–40: Multiple choice (single answer)
  - Official answer keys, accepted alternatives (e.g. `cow dung` / `dung`, `fermentation` / `fermentation process`), full explanations, and evidence quotes
  - Security-sanitized payload for active student attempts (zero leak of answer keys or explanations)
  - Configured as `is_free_tier = 1` for immediate student self-study practice and teacher class assignments
  - Automated verification test [testCambridge21Ingestion.ts](file:///d:/Website/IELTS%20new/test/testCambridge21Ingestion.ts) integrated into `npm test` passing 100%

---

## Future Milestones (Deferred per Blueprint)
- **Milestone 8**: Production load testing, final pilot onboarding (10–50 learners), and live commercial gateway activation.



