# IELTS Preparation Platform — Implementation Progress

This document tracks implementation status across the stages outlined in the Product & Development Blueprint (Version 1.0).

---

## Milestone 1: Accounts and Complete IELTS Reading Support

### Phase 1: Planning & Architectural Foundations
- [x] Blueprint review and architecture specification
- [x] Initial decision log (`DECISION_LOG.md`)
- [x] Project structure initialization (Server + Client + Shared models)
- [x] Database schema design with versioning and learner isolation

### Phase 2: Accounts, Authentication & Role Isolation
- [x] User registration with public student role enforcement
- [x] Protected role elevation (Admin setup key / Admin role management)
- [x] Session / JWT authentication with role-based route middleware
- [x] Account recovery (password reset token flow)
- [x] Server-side permissions for learner data isolation

### Phase 3: Reading Engine & All 14+ Question Formats
- [x] Shared data models for passages, sections, question groups, and rules
- [x] Academic single passage & General Training multi-text section support
- [x] Support for all required question formats:
  1. Multiple Choice (single answer)
  2. Multiple Choice (multiple answers)
  3. True / False / Not Given
  4. Yes / No / Not Given
  5. Matching Headings
  6. Matching Information
  7. Matching Features
  8. Matching Sentence Endings
  9. Sentence Completion
  10. Summary Completion (passage words)
  11. Summary Completion (supplied option list)
  12. Note Completion
  13. Table Completion
  14. Flow-Chart Completion
  15. Diagram Label Completion
  16. Short-Answer Questions
- [x] Rule configurations: word/number limits, accepted alternatives, option reuse, selection counts, answer-order rules
- [x] Draft saving, validation checks, publishing, and versioning

### Phase 4: Student Experience & Test Runner
- [x] Responsive layout with desktop side-by-side passage and question panels
- [x] In-passage text highlighter tool
- [x] Real-time autosave with visual save status
- [x] Refresh / reconnect state recovery
- [x] Question navigator with answered/unanswered and flagged status
- [x] Untimed practice vs complete timed mocks
- [x] Server-controlled deadline enforcement & auto-submission
- [x] Answer-key and explanation scrubbing for active attempts

### Phase 5: Marking Engine & Results Analytics
- [x] Strict server-side marking engine (normalized match, no loose fuzzy matching)
- [x] Detailed score review with student answers, correct keys, explanations, and evidence quotes
- [x] Official IELTS Band Score conversion (Academic & General Training) with estimate labelling
- [x] First attempts vs retries isolation

### Phase 6: Demonstration Content & Automated Verification
- [x] Comprehensive demonstration test suite covering all question formats across Academic and General Training
- [x] Automated test suite verifying permissions, marking, timer, recovery, and versioning

---

## Future Milestones (Deferred per Blueprint)
- **Milestone 2**: Listening module (audio segments, maps/diagrams, transcripts, controlled playback).
- **Milestone 3**: Writing assessment engine & Speaking (dual route: interactive AI conversation + teacher-led scoring queue).
- **Milestone 4**: Class journey (pre-test → assigned practice → protected post-test, comparison reports).
- **Milestone 5**: Commercial access, plans, ledger, teacher codes, payment webhooks.
- **Milestone 6**: Production load testing, pilot onboarding (10–50 learners).
