# IELTS Preparation Platform

## Product & Development Blueprint

Prepared for Learn English With Arik | Version 1.0 | 6 October 2026

Planning baseline for a 10–50 learner launch. Core class journey: full pre-test → assigned practice → full post-test. Public registration and independent learning are included.

Status: sufficient to begin technical discovery, foundation work, and a private pilot. This is not a claim that pricing, providers, assessment accuracy, or production readiness have been validated. No production platform has been built in this planning exercise.

### How to use this document

Sections distinguish agreed product requirements from recommended implementation defaults and unresolved decisions. Later decisions in this document supersede earlier conversation mockups, especially AI Speaking and teacher-led scoring. Developers should maintain a decision log as open items are resolved.

## 1. Product scope and priorities

| Area | Agreed requirement |
| --- | --- |
| Audience | Independent learners and Arik’s class students; public account registration. |
| Coverage | Academic and General Training; Listening, Reading, Writing, Speaking. |
| Priority | Practice questions, sectional mocks and full mocks; lessons and feedback support practice. |
| Class journey | Separate pre-test and post-test, with individual practice and assignments between them. |
| Content supply | Teacher manually enters and uploads materials once the platform is ready. Small demonstration content is only for testing. |
| Launch scale | Private pilot around 10 learners, growing toward 50 active learners. Concurrent usage must be tested separately. |
| Assessment | Automatic objective marking; AI Writing; live AI Speaking or teacher-led Speaking. |
| Commercial model | One free tier, one paid plan, individual AI purchases, teacher codes. Prices and exact allowances remain open. |

### Explicitly deferred

- Automatic conversion of PDF/images into interactive tests.

- Community forums, leaderboards, advanced adaptive study plans and built-in live teacher video calls.

- Individual-part Speaking AI scoring at launch; part practice can support recording and replay.

- Unlimited AI usage. No unlimited offer is assumed.

## 2. Roles, permissions and account journey

| Role | Permissions |
| --- | --- |
| Learner | Own attempts, recordings, feedback, purchases, balances and enrolled-class assignments. |
| Teacher | Assigned classes and submitted work; content authoring where granted; teacher-led Speaking scoring. |
| Administrator | Publishing, access products, codes, class administration, issue handling, audited corrections. |

Initially Arik may hold both teacher and administrator roles. Enforce permissions on the server, including private media access. Teachers do not automatically receive access to unrelated independent practice or unsubmitted drafts.

Signup asks for Academic, General Training or Not sure; target band; optional test date. Test preference is changeable. A learner can join a class later using the same account. Independent learners may voluntarily use a pre-test/practice/post-test pathway.

## 3. Navigation and screen inventory

| Surface | Screens |
| --- | --- |
| Public | Home, plans and assessments, classes with Arik, signup/login, help. |
| Student | Dashboard, practice/mocks catalogue, test workspaces, results, progress, class assignments, account/access. |
| Teacher/admin | Overview, practice sets, mock tests, lesson editor, classes, Speaking assessment queue, codes, purchases/allowances, issues. |

Class dashboards prioritise pre-test status, current assignments, post-test release status and progress. General dashboards prioritise continuing a saved attempt, choosing skill practice and taking a mock. Hide empty/unpublished sections; clearly label paid items and previously attempted material.

Desktop/laptop is the priority for realistic mocks. Smaller screens support short practice and feedback; dense passages and questions need a responsive switch or stacked layout. Final interface language, branding and domain remain to be decided.

## 4. Content model and teacher workflow

The reusable unit is a complete practice set, not an isolated question. Preserve the passage or audio, shared instructions, question groups, options, numbering, answers and layout together.

| Content | Structure |
| --- | --- |
| Reading | Academic passage or General Training section with one or more texts and linked question groups. |
| Listening | Recording or audio segment plus its question groups, maps/tables, answers and transcript. |
| Writing | Test version, task number, full prompt, visual when relevant, optional model response and assessment guidance. |
| Speaking | Topics, Part 1 starting questions, Part 2 cue card, Part 3 discussion prompts and AI follow-up boundaries. |
| Mock | References to published versions of complete skill sets; full mocks connect four skill components. |
| Lesson | Strategy explanation/examples linked to a skill or question type. |

Workflow: create draft → enter material → add question groups → define marking → preview as learner → validate → publish or archive. A published version used by an attempt remains immutable. Editing produces a new draft version; existing attempts retain their original content and marking context.

### Question templates

- Single- and multiple-answer multiple choice; True/False/Not Given and Yes/No/Not Given.

- Matching headings, information, features and sentence endings; shared option lists with reuse rules.

- Forms, notes, summaries and sentences with numbered answer gaps.

- Tables with editable rows, columns and gaps; flow charts with connected steps.

- Map/diagram images with labelled locations or positioned fields; short answers.

The teacher specifies word/number limits, accepted alternatives, selection counts and answer-order rules. Automatic numbering updates across groups without breaking answer associations. Required validation catches missing media, answers and invalid references; optional explanations generate reminders rather than blocking publication.

Targeted practice retains the relevant text/audio. A General Training question group can refer to several texts. Audio uploads support complete-test recordings or separate parts, segment boundaries, and a flag indicating whether instructions and pauses are already included.

## 5. Reading and Listening behaviour

| Function | Practice | Mock |
| --- | --- | --- |
| Timing | Optional | Server-controlled deadline |
| Audio | Replay/seek/pause allowed | Controlled playback; no ordinary seeking/replay |
| Help | Explanations and transcript after submission | Hidden until the permitted review stage |
| Layout | Passage and questions together | Same task layout; exam controls |
| Results | Raw score and accuracy for short sets | Raw marks plus verified estimated-band mapping if supported |

Reading uses independently scrollable passage and question panels on desktop, question navigation, answer status, flags and highlighting. Listening gives priority to maps, notes and tables while audio continues. The final player details must be checked against official samples before claiming interface fidelity.

Mark from teacher-defined keys with deliberate normalisation. Do not broadly accept near-spellings or semantic approximations. Multiple-answer groups need explicit partial-credit/order behaviour aligned with the intended task. Answer explanations may link to selected passage evidence or audio timestamps.

Autosave each response and display save status. Refresh recovers saved answers without resetting deadlines. Early submission shows unanswered counts. Expiry submits saved responses. A connection failure must not masquerade as a normal uninterrupted attempt; track any permitted replay or recovery.

## 6. Writing requirements

Prompt/visual on the left and response editor on the right; word count, autosave and optional practice timing. A Writing mock has two tasks sharing one timer; submission locks both response versions. Model responses remain hidden until review.

One Writing assessment covers one task. A full Writing mock uses two. Display cost and balance before request; reserve allowance during processing, finalise only on successful assessment, and release on failure. A revised response requires a new explicitly authorised assessment.

AI receives the full prompt, response, test version and task-specific guidance. Academic Task 1 requires visual input and/or a teacher-verified representation of its contents. Do not score visual accuracy from the essay alone. A model answer is not the only acceptable position.

Report: estimated band, criterion feedback, response evidence, selected sentence revisions and prioritised next steps. Store model/prompt/rubric versions with each assessment. Scoring rules and Task 1/Task 2 weighting must be verified against current official guidance before implementation.

## 7. Speaking: revised two-route design

This section supersedes the original fixed-question playback design. AI Speaking means an interactive AI conversation plus assessment. Teacher-led Speaking is a separate supported route with no AI credit deduction.

| Route | Conduct | Assessment | Usage |
| --- | --- | --- | --- |
| AI simulation | AI asks, listens and adapts follow-ups within teacher-defined topics and test structure. | Audio-based assessment and report after completion. | One AI Speaking session allowance covers complete session plus feedback. |
| Teacher-led | Teacher conducts in class or using their normal calling method. | Teacher enters criterion scores and comments, saves draft, then releases. | No AI session allowance consumed. |

### AI conversation controls

- Part 1: ask one question at a time and use appropriate limited follow-ups.

- Part 2: cue card, preparation period and long turn; avoid interrupting ordinary thinking pauses.

- Part 3: deeper topic-linked discussion with adaptive follow-ups.

- Mock mode: no coaching or correction during the session. Practice mode may allow repetition and retries under disclosed limits.

- Microphone/playback check before starting; detect silence, clipping, incomplete uploads and unusable audio. Do not infer pronunciation from a transcript alone.

- Server controls stage progression, timing limits, session access and usage; AI must not alter these rules in response to learner instructions.

### Teacher assessment workflow

Open learner/assignment → select Speaking set or teacher’s own questions → conduct session → enter Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, and Pronunciation → add comments → save draft → release. Overall calculation follows verified rules. Recording is optional and must be disclosed.

Partial classroom practice remains labelled partial and cannot fulfil a complete mock score. AI and teacher assessments are separate records. A teacher review of an AI attempt does not overwrite it. For a combined report, explicitly select the released complete assessment to use and retain its assessor label.

Assignments permit AI, teacher-led or learner’s choice. If a full mock uses teacher-led Speaking, reserve no AI Speaking allowance and show Awaiting teacher assessment until release.

## 8. Pre-test, practice, post-test and full mocks

Class setup selects the test version, enrolments, pre-test, practice assignments, post-test and Speaking route. Hide post-test materials from practice browsing and direct access until release. Use different but teacher-reviewed comparable content; do not assume statistical equivalence without evidence.

Exam rehearsal runs Listening → Reading → Writing consecutively with controlled transitions; Speaking is separately scheduled. Flexible preparation allows breaks between skills and is clearly labelled. Each timed skill retains its deadline. Completed skill results persist even if another component remains incomplete.

Pre/post reports show each skill side by side, raw marks where available, estimated scores where valid, completion dates, content version, conditions and assessor. Highlight changed conditions or assessment routes. Avoid a combined score until all required skill estimates exist. Do not convert a short exercise into a reliable overall band.

Reserve class allowances for mandatory pre/post assessments separately from discretionary practice. If a learner changes Speaking route before service begins, release the unused reservation. The precise switching and expiry policy must be finalised before billing implementation.

## 9. Plans, purchases and codes

| Option | Content | AI usage |
| --- | --- | --- |
| Free account | Selected Reading/Listening exercises, sample sectional mocks, sample Writing/Speaking prompts and feedback demonstration. | No unlimited AI; any short live demo requires an explicit budget. |
| Paid plan | Full published catalogue, lessons and mocks. | Defined recurring allowance; quantities/prices not yet set. |
| Individual purchase | Does not unlock the entire paid catalogue. | Writing assessments or AI Speaking sessions usable with accessible activities. |
| Teacher code | Specified catalogue/class access for a defined period. | Explicit granted allowances, including protected pre/post entitlement if configured. |

Proposed defaults, still to confirm: plan allowances expire at the period boundary; purchased allowances do not reset monthly; consume earliest-expiring eligible allowance first; retain access to previous feedback after access expiry. Record reservation, consumption, release, expiry and manual adjustment in an auditable ledger.

Codes define redemption deadline separately from access duration, redemption cap, one-use-per-learner rule, class membership, material access and allowances. Show benefits before redemption. Redeeming a code must not silently cancel a subscription or erase purchased balances.

Live Speaking incurs cost during conversation, not only during final scoring. Reserve before connecting. Provider failures restore/recover entitlement; voluntary abandonment, retry limits, no-shows and unused reservations require a clear bounded policy. Do not promise unlimited free restarts.

Payment handling must verify provider callbacks, process duplicate notifications once, and activate access only after confirmed payment. Refund, cancellation, tax/invoice, currency and renewal policies remain open. Assignment access is distinct from AI allowance grants.

## 10. Admin operations and data responsibilities

- Content publication checks, archived items and controlled replacements.

- Class membership, deadlines in Asia/Makassar, assignment access and submission status.

- Teacher Speaking scoring queue and feedback release.

- Code configuration, redemption history and account entitlement view.

- Failed AI jobs, recording issues, learner-reported questions and support resolution.

- Answer-key corrections create a version; historical re-marking has a separate impact preview and audited approval.

- Only authorised staff can view student audio and essays; private media uses restricted access.

### Recommended logical records

Users; roles; learner preferences; classes/enrolments; content sets/versions; media assets; question groups/items/keys; mock definitions; assignments; attempts/responses; audio sessions; assessments/criterion scores; plans/products; orders/payments; entitlement grants; allowance ledger/reservations; codes/redemptions; audit events.

An attempt references fixed content versions. Assessment records reference an attempt, assessor type, status and scoring configuration. A full-mock record links skill attempts and the selected released assessment. Pre/post comparisons link assignments rather than guessing which attempts to compare.

## 11. Technical architecture and acceptance requirements

Recommended architecture, not a selected vendor commitment: responsive web frontend; secure backend and relational database; account authentication; private object storage; background assessment queue; real-time audio service; payment integration; monitoring and backups. Keep API credentials on the server. Browser voice connections use short-lived authorised credentials where supported.

| Acceptance area | Required proof |
| --- | --- |
| Permissions | Another learner cannot access responses, media, scores or unreleased post-tests by changing an identifier. |
| Objective marking | Representative examples of every supported question format match the approved answer rules. |
| Recovery | Refresh, reconnect and deadline expiry preserve answers; interruption status is recorded. |
| Usage ledger | Repeated clicks, retries and duplicate callbacks cannot double-charge or double-grant. |
| AI Writing | Prompt/visual-grounded feedback evaluated against teacher-assessed examples. |
| AI Speaking | Full conversation maintains stages, handles pauses and interruption, and assesses usable audio. |
| Teacher scoring | Draft scores remain private; released scores populate the correct mock report. |
| Class comparison | Pre/post content and conditions are identified; incomplete results are not silently averaged. |
| Capacity | Representative simultaneous class sessions meet a defined latency/reliability target. |
| Operations | Backup restoration and failed-job handling are demonstrated before paid launch. |

Set measurable latency, autosave interval, recording retention, backup recovery, accessibility and supported-browser targets during technical discovery. These have not yet been agreed. Test desktop microphones and mobile review, keyboard navigation, readable contrast and error messages.

## 12. Development stages and release gates

| Stage | Deliverable | Exit gate |
| --- | --- | --- |
| 0. Discovery + AI pilot | Final data contracts, provider trials, measured Writing and Speaking usage. | Decide architecture; quantify cost and feedback limitations. |
| 1. Foundations | Authentication, roles, private storage, versioned content and access records. | Permission and data-isolation checks pass. |
| 2. Reading/Listening | Editors, marking, timed attempts, review and recovery. | All supported layouts and answer rules validated. |
| 3. Writing/Speaking | Writing assessment, interactive AI voice, teacher-led scoring. | Assessment quality, failures and allowance handling checked. |
| 4. Class journey | Pre-test, assignments, protected post-test, comparisons. | End-to-end class workflow demonstrated. |
| 5. Commercial access | Plans, individual purchases, codes and verified payments. | Financial lifecycle and duplicate-event checks pass. |
| 6. Pilot then public launch | About 10 class learners, fixes, then capacity for 50 active learners. | Operational and quality gates pass before paid public expansion. |

Foundation development can begin from this specification. A realistic delivery estimate requires the developer’s implementation plan and provider decisions; no delivery date is promised here. Public signup remains part of the target, while the first validation cohort is private.

## 13. Usage model and cost worksheet

Confirmed usage basis: two complete mocks per learner per course (pre/post), plus additional assigned practice. This is a course total, not a monthly forecast.

| Learners | Writing assessments for pre/post | AI Speaking sessions if both AI-led |
| --- | --- | --- |
| 10 | 40 | 20 |
| 25 | 100 | 50 |
| 50 | 200 | 100 |

Teacher-led Speaking reduces the corresponding AI sessions to zero. Additional Writing practice and AI Speaking sessions must be added. Infrastructure is billed over time, so course duration and concurrent class use are necessary inputs.

Budget formula: monthly fixed services + successful Writing volume × measured all-in unit cost + AI Speaking sessions × measured conversation-and-assessment cost + storage/traffic overages + payment fees + recovery/support margin. Include costs from failed jobs even when learners are not charged.

Research reference from this planning session: Supabase Pro was listed from US$25/month on 6 October 2026. This is only a possible backend component, not a complete quote or selected vendor. Recheck all pricing before purchase. No defensible per-session AI cost has yet been measured.

### Pilot measurements

- Representative short/long Writing submissions, including Academic Task 1 visuals.

- Complete Speaking sessions with different response lengths, pauses and accents.

- Connection failures, unusable audio, retries and concurrent sessions.

- Per-attempt provider charges, assessment latency and agreement/disagreement with teacher judgement.

## 14. Decisions still required

| Decision | When needed |
| --- | --- |
| Final brand, domain and interface language | Before polished UI and production setup |
| Hosting/backend/AI/payment providers | During technical discovery |
| Pricing, recurring billing, allowances and code terms | Before checkout implementation |
| AI session abandonment/retry/refund rules | Before paid Speaking trial |
| Recording consent, retention and deletion; learner age policy | Before collecting real student audio |
| Official timing, band mappings and scoring calculations | Before assessed mocks launch |
| Content rights, first launch inventory and pre/post comparability review | Before publishing material |
| Concurrent learner target and operational service targets | Before load/recovery testing |
| Teacher override and comparison score selection policy | Before reports are finalised |

These open items do not erase the agreed scope. They are explicit decisions to resolve while building and validating the pilot, rather than assumptions to hide in code.

## 15. Mockup inventory and superseded details

Conversation previews covered Reading, Listening, Writing, Speaking, student dashboard/catalogue, full-mock journey, access/purchases/codes and admin. They are illustrative UI references, not working production software. All example learners, balances, scores and package quantities are placeholders.

- Speaking preview used fixed questions: replace with live AI conversation plus the teacher-led route.

- Speaking assessment label becomes AI Speaking session where conversation is included.

- Dashboard must prioritise the class pre-test/practice/post-test journey for enrolled students.

- Full-mock checks need route-aware Speaking reservation and protected class allowances.

- Teacher dashboard needs a scoring/release queue and pre/post comparison view.

## 16. Official references for implementation verification

These sources were consulted or identified during planning; review their current contents before finalising exam behaviour. The interactive official test screens were not fully inspected, so no exact official-interface equivalence is claimed.

IELTS Academic sample tasks: https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test

IELTS General Training sample tasks: https://ielts.org/take-a-test/preparation-resources/sample-test-questions/general-training-test

British Council familiarisation: https://takeielts.britishcouncil.org/en-gb/prepare/ielts-free-practice-mock-tests/ielts-familiarisation-test

IELTS scoring reference: https://ielts.org/take-a-test/your-results/ielts-scoring-in-detail

Supabase pricing: https://supabase.com/pricing

OpenAI API pricing: https://openai.com/api/pricing/

### Developer handoff instruction

Start by reviewing Sections 7, 8, 9 and 14, then produce a technical design and pilot estimate. Preserve both Academic and General Training and both Speaking routes. Do not treat mockup sample prices, scores, balances, or fixed-question audio as final requirements. Do not deploy paid access until release gates and unresolved billing policies are completed.
