# Question import from text or PDF

Teachers and administrators can use **Import text or PDF with AI** across Reading, Listening, Writing and Speaking.

| Section | Location | Imported content |
| --- | --- | --- |
| Reading | Reading test editor | Passages, question groups, options and supplied answer keys |
| Listening | Listening test editor | Parts, question groups, forms, options, supplied transcripts and answer keys |
| Writing | Teacher Writing editor, new task or editable draft | Up to two task prompts, instructions and supplied teacher guidance |
| Speaking | Teacher Speaking area, Speaking question sets | Part 1 topics, Part 2 cue card and Part 3 discussion questions |

## Server configuration

Set `OPENAI_API_KEY` in `.env.local` for local development, or in the hosting provider's server environment variables. Restart the local server or redeploy the hosted API after configuring it. Do not use a `VITE_` variable for this key; those variables are exposed to browsers.

`OPENAI_PDF_IMPORT_MODEL` optionally overrides the default `gpt-4.1`. The configured model must support PDF inputs and strict Structured Outputs through the Responses API. API billing and access to the model must be available on the OpenAI account.

`OPENAI_TEXT_IMPORT_MODEL` optionally overrides the text-only default `gpt-4.1-mini`. All skills use the same configuration and limits.

## Importing

1. Open the relevant editor and click **Import text or PDF with AI**.
2. Choose **Paste text** (up to 60,000 characters) or **Upload PDF**. For PDFs (up to 30 MB locally), select physical PDF page numbers, such as `5-12, 28`; count the cover as page 1. Include the matching answer key where available. Blank page selection includes the whole PDF if it is at most 20 pages.
3. Select one test at a time, with at most 20 selected pages totalling 3 MB. The browser copies only those pages into a new PDF for upload. For scanned documents, compress the PDF or select fewer pages if needed.
4. Add a note identifying the test if the selected pages contain several answer keys or tests.
5. Click **Extract and review**. Check the passages or prompts, question layout, options, extracted answers and warnings against the source text or PDF.
6. Click **Use in editor** to replace the current editor content. Edit and fill in missing answers, then click **Save Draft**. Importing itself never saves or publishes anything.
7. Reopen the draft, preview it, resolve validation errors, and publish when ready.

For Writing, select a task and click **Use as new task**, then save it. When two tasks are extracted, the review remains available so you can apply and save each separately. Academic Task 1 still requires the original visual uploaded through the Writing editor.

For Listening, upload the original audio and any map or diagram images after applying the extraction. A PDF import does not supply audio.

For Speaking, **Use in editor** opens a new editable question set. Save it with **Save draft**, reopen it using **Open saved draft**, or use **Save and publish** after reviewing all three parts. Missing parts are flagged and prevent publication.

The importer preserves original question numbering. Include the full set of question pages for a publishable test; a partial extraction can be saved as a draft but may report missing numbers. Only answers from an explicit answer key are requested. Missing or uncertain keys remain blank, and the teacher must verify AI extraction accuracy.

Diagram questions need the original diagram image uploaded separately through the editor. The importer does not extract image assets from the PDF and never accepts AI-generated image URLs. Missing diagram images block publication.

Only the selected pages are sent to OpenAI. The server uses `store: false`, does not save the PDF locally, and returns review data without writing tests to the database. This does not override OpenAI's applicable API data retention policies.

## Verification

Run `npm run test:pdf-import`, `npm run typecheck:server`, and `npm run build`. Tests use generated PDFs and a mocked OpenAI provider; they incur no API usage. The endpoint tests cover student denial, teacher/admin access, unavailable configuration, and ensuring extraction does not write to the database.

Official documentation: [PDF inputs](https://developers.openai.com/api/docs/guides/file-inputs), [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).
