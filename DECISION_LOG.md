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
  - In the UI, the band is explicitly labelled: "Estimated Band (Based on official IELTS conversion standards)". Practice sets with fewer than 40 questions display raw percentage / accuracy only, without pretending to be a complete IELTS band score.
