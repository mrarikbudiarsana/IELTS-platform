# Performance investigation

The main avoidable delays came from repeated database round trips and independent
requests waiting for one another. The optimizations preserve fresh reads instead
of caching student or teacher data globally.

## Measured database work

An isolated PostgreSQL fixture measures the number of executed data queries,
excluding transaction control statements:

| Flow | Before | After |
| --- | ---: | ---: |
| Writing catalogue, 10 tasks | 21 | 2 |
| Writing history, 10 attempts | 61 | 3 |
| Writing result, one task and response | 6 | 3 |
| Speaking history, 10 assessments | 21 | 2 |
| Speaking teacher queue, 10 assessments | 21 | 2 |
| Reading or Listening submission, grading 40 answers | 40 grading writes | 1 grading write |

The current class overview reads 20 students and five Reading assignments in six
queries. A student's five-assignment list takes three queries. Reading and
Listening submissions take eight data queries overall in the fixture, including
loading content and returning results.

The account summary combines its protected-allowance lookup with the user query,
loads independent data in parallel, aggregates allowance ledger rows in SQL, and
retrieves only the ten recent orders it displays. A warm read against the real
Supabase project measured about 0.32 seconds from this development machine,
compared with about 0.74 seconds for the earlier sequential implementation.

## Frontend loading

All four skill catalogues load content, history, and allowance data concurrently.
The student dashboard requests classes together with skill histories and then
loads each class's assignments concurrently. Teacher class overviews load
attempts by skill once and reuse those records for assignment and student stats.

Submission batches update only grading fields on existing answers, preserving
their identifiers, flags, autosave timestamps, and responses. Writing history
returns the latest response revision and latest assessment. Speaking histories
keep correction records and scrub teacher-private notes from student responses.

## Verification

```text
npm run test:performance
npm run test:postgres
npm test
npm run test:netlify
npm run typecheck:server
npm run build
```

The performance test uses an isolated PostgreSQL database, verifies query budgets
for populated histories and classes, and checks revisions, corrections, private
notes, scoring, flags, saved timestamps, and unanswered questions.

`npm run benchmark:platform` reads the configured database and reports query
counts and timings without printing account details. It does not modify records.
The live test database currently has no Writing or Speaking history, so populated
history benchmarks use the isolated fixture rather than adding fake records to
Supabase.

These measurements cover database/service work, not full browser-to-Netlify
latency. Network distance, API startup, media downloads, and AI processing still
affect response times. Answer autosave continues to check ownership and deadlines
before writing; it is not delayed or skipped to improve the speed figures.
