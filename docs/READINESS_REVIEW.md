# App readiness review — 12 October 2026

Scope: local source review of learner, teacher, administration, authentication, media, AI, payments and deployment flows, plus isolated automated checks. This is not a browser walkthrough or an audit of the live deployment. No production accounts, provider settings or hosted data were changed.

Recommendation: address the release blockers below before opening public registration or charging for AI assessment. Passing service tests does not establish that browser autosave, audio assessment or recovery flows are production-ready.

## Release blockers

1. **Password recovery permits account takeover.** `server/app.ts:306` returns a usable reset token in the unauthenticated forgot-password response; `client/src/views/LoginModal.tsx:74` immediately uses it. Anyone knowing an existing email can reset that account, including an administrator. Deliver tokens only to the registered email, store token hashes, return the same generic response for all addresses, rate-limit requests, and invalidate existing sessions after reset. Add an API regression test proving that a requester cannot obtain a reset credential. [OWASP recovery guidance](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html).

2. **Writing draft visibility and teacher identity are not enforced on read routes.** `server/app.ts:1433` and the following single-task route have no authentication middleware, so even a teacher's bearer token is ignored and `req.user` is absent. `server/writingService.ts:363` lets an explicit status filter replace the student published-only restriction. `getWritingTaskById` returns all versions without enforcing publication status. Anonymous clients can request draft material, while teachers receive student-scrubbed fields when reading tasks back. Authenticate staff reads, enforce published-only visibility independently of query filters, filter versions, and test anonymous/student/teacher access to draft, archived and published tasks.

3. **Writing can lose unsaved work.** `client/src/views/WritingWorkspaceView.tsx:137` shares one 1.2-second debounce timer across both tasks. Type in Task 1, switch to Task 2, then type before that timer fires: the second edit cancels Task 1's pending save. Auto-submit does not flush either draft; manual submit flushes only the active task. Maintain independent saves per task, retain recoverable local drafts, flush both before submission/exit and expose failed saves with retry.

4. **Reading/Listening saves can race with submission and each other.** `TestRunnerView.tsx:175` and `ListeningTestRunnerView.tsx:262` send overlapping updates; submission does not await outstanding saves. A slow older update can replace a newer value, or the last answer can arrive after submission locks the attempt. Serialize or revision-check each question, flush pending saves before manual submission and make failures recoverable. Reading auto-submit also leaves `isSubmitting` set after a failed request (`TestRunnerView.tsx:163`). Test rapid editing, reordered responses and interrupted submission.

5. **Speaking assessment claims exceed the implementation.** `server/aiSpeakingService.ts:658` estimates acoustics from text word count and supplied duration; `finishAndAssessSpeakingSession` assigns criterion bands using word-length and phrase heuristics. It does not analyze recorded audio for pronunciation. The browser submits a fixed duration of 15 seconds (`LiveAiSpeakingView.tsx:140`), and the assessment is marked non-simulated when turns exist while storing a realtime-model label. Implement actual audio assessment with measured duration and provider provenance, or clearly label this as simulated practice and keep it out of paid AI grading and four-skill progress bands.

6. **Writing fallback silently consumes an AI credit.** `server/aiWritingService.ts:379` falls back to heuristic grading on missing credentials/provider failure, and completion consumes an allowance at line 231. The feedback view does not disclose `isSimulated`. Production provider failures should be retryable and release the reservation; optional heuristic feedback should be visibly labeled and not charged as AI assessment. Test missing keys, timeouts and provider outages.

## Resolve before a wider pilot

7. **Writing prompt versions are not pinned in the workspace.** `WritingWorkspaceView.tsx:222` displays the last task version rather than `attempt.task1VersionId`/`task2VersionId`. A teacher's new draft or publication can change the prompt shown during an existing attempt while assessment still uses the original version. Fetch/display the exact attempt version, including in feedback. Verify by editing a task while an attempt is open.

8. **Full mocks pair material by array position.** `FullMockView.tsx:135` and `:165` use modulo indexes and arbitrary fallbacks to combine skills. Adding or reordering catalogue entries can change a named package's contents; missing GT material can fall back to incompatible tasks. Store explicit versioned package IDs, validate skill/module compatibility and completeness, and attach attempts/results to that package rather than deriving its identity in the browser.

9. **New AI imports need deployment and spend controls.** `readingPdfImportService.ts:162` allows a 90-second provider request through the synchronous API. Netlify documents a 60-second synchronous limit; slow imports may terminate before delivering a result. Use a persisted import job and background worker with status polling. Store input/results outside the background request payload where needed, because background payloads have a 256 KB limit. Replace the process-local import set (`app.ts:450`) with a database-backed lease/idempotency key and enforce user/site budgets so retries and multiple function instances cannot repeat expensive calls. [Netlify function limits](https://docs.netlify.com/build/functions/configuration/).

10. **Recording promises need an implemented lifecycle.** Speaking screens promise a strict 90-day deletion policy. The checked-in server/functions contain acknowledgement fields but no matching deletion scheduler or Cloudinary cleanup implementation. This does not establish whether an external provider policy exists. Verify provider access and deletion settings, track assets and expiry dates, implement auditable cleanup, and make the disclosure match actual behavior. The media uploader also defaults to a hardcoded cloud account/preset when configuration is absent (`CloudinaryMediaUploader.tsx:32`); require explicit configuration and verify upload restrictions and recording access.

11. **Production authentication needs stronger boundaries.** Default signing/setup secrets are allowed outside Netlify (`server/auth.ts:9`), registration/reset accept any nonempty password, and there is no application login/reset throttling. Fail startup with missing or placeholder production secrets on every host, validate inputs, rate-limit sensitive endpoints and revoke sessions after password changes. Confirm deployed security headers and allowed origins; these were not audited live.

12. **Payment failure should not become a fake checkout.** `server/paymentGatewayService.ts:124` can fall back from a failed live request to a fabricated sandbox checkout URL. Restrict simulation to an explicit development/test mode; configured provider failures should return a clear retryable error. Verify production credentials, webhook processing, reconciliation and refund behavior in a separate provider-backed acceptance run before selling access.

## Product and release quality

13. **Navigation and recovery need durable state.** `client/src/App.tsx:41` stores the current page and attempt IDs only in React state. Reload/back/deep links do not preserve the user's current workspace. Add URL routing, safe attempt recovery and an unsaved-editor exit guard. Session refresh currently removes the token on any `/me` failure, including a transient network problem (`AuthContext.tsx:37`); distinguish expiry from service outages.

14. **Some learning features are still demonstrations.** `StudyChatView.tsx:50` generates canned keyword replies despite claiming AI writing feedback. Either connect a real, bounded assistant or label its capability accurately. Vocabulary uses one browser-wide storage key (`VocabularyView.tsx:108`), so it neither follows an account across devices nor separates users sharing a browser. Add account-scoped persistence if this is a promised learner feature.

15. **Quality gates need to exercise real user failures.** `npm run test:postgres` fails before its suite can run because content seeding has no test administrator; `npm run test:performance` fails for the same reason. Seed isolated fixture users explicitly. Add CI for typechecks, builds and both database paths, then browser tests for task switching, save failures, refresh/back, expiry, media playback, mobile layout and keyboard access. Client lint currently exits successfully with many warnings; prioritize state/closure warnings and make the chosen rules an enforced gate. Lazy-load major views to reduce the initial bundle. Finish the missing Speaking content-management UI if teachers must author all four skills without API tools.

## Verification results

- `npm test`: passed; isolated SQLite platform and content suites, including import tests.
- `npm run test:netlify`: passed; isolated API adapter and background-worker authorization checks.
- `npm run test:postgres`: failed at `test/runPostgresIntegration.ts:23`, expected four Reading tests but found zero after seeding without an administrator. The subsequent PostgreSQL suite did not run.
- `npm run test:performance`: failed, reading `id` from missing fixture content after the same seed precondition.
- `npm run lint --prefix client`: exit code 0 with many warnings, including hook dependencies and state initialization.
- Server typecheck and production build passed immediately before this review; build warned about large chunks (main JavaScript approximately 807 KB before compression).
- Real email delivery, AI/audio providers, paid checkout, hosted data, provider retention settings and visual/mobile behavior were not exercised.

Suggested implementation order: recovery and Writing access controls; answer durability and pinned versions; accurate AI provenance and charging; explicit mock packages; import jobs/media/payment safeguards; browser acceptance and CI gates.
