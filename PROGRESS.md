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

## Future Milestones (Deferred per Blueprint)
- **Milestone 4**: Writing Assessment Engine & Speaking (dual route: interactive AI conversation + teacher-led scoring queue).
- **Milestone 5**: Commercial access, plans, ledger, teacher codes, payment webhooks.
- **Milestone 6**: Production load testing, pilot onboarding (10–50 learners).
