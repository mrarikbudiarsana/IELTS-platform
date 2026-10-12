# Netlify + Supabase testing deployment

The React frontend and Express API deploy together from GitHub. Netlify serves
`client/dist` and routes `/api/*` to the `api` function. All hosted database queries
use Supabase PostgreSQL. Existing application login and roles stay in the API;
this does not switch users to Supabase Auth.

## Prepare Supabase

1. In Supabase's **Connect** panel, copy the **Transaction pooler** connection string
   (port 6543) and replace its password placeholder. URL-encode special characters
   in the password. Set this as `DATABASE_URL` in your local `.env.local`.
2. Download the server root certificate from **Database Settings → SSL Configuration**.
   Set `DATABASE_SSL_CA_FILE` locally to the downloaded file's path. On Netlify,
   set `DATABASE_SSL_CA` to the full PEM certificate, with newlines or literal `\n`.
   Certificate verification stays enabled. Avoid `sslmode`/`sslrootcert` URL parameters
   overriding the configured TLS settings; use the separate CA environment variable.
3. Run `npm run db:check`, then `npm run db:migrate` locally. The complete schema
   adds missing tables and columns to the earlier partial migration and converts
   legacy timestamp columns to the application's UTC text format. Migration runs
   in a transaction and retains existing rows. It fails rather than ignoring an
   incompatible constraint or missing referenced record.
4. To configure your administrator and add missing Cambridge tests, set
   `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` (12+ characters) in `.env.local`,
   then run `npm run db:initialize`. This updates only the selected administrator's
   password and skips existing tests. It does not create default-password demo users.
   Existing users and attempts already in Supabase remain there. Records that exist
   only in the local SQLite file are not automatically copied by this schema migration.
5. If earlier transfer scripts created demo accounts with `Password123!`, change
   their passwords or remove unused demo accounts before sharing the deployment.

Application tables have RLS enabled and browser-role access revoked. Only the
authenticated server API accesses these tables with the database credential.

## Connect Netlify

This repository is connected to [ieltswitharik](https://app.netlify.com/projects/ieltswitharik).
Its expected default domain is `https://ieltswitharik.netlify.app`. The public
domain returned a Netlify login redirect during setup; publish the project or
adjust its access protection if testers should be able to open it anonymously.

Import the GitHub repository as an existing project. Use the repository root
(leave **Base directory** blank). The checked-in `netlify.toml` sets:

- Build: `npm ci --prefix client --include=dev && npm run build`
- Publish directory: `client/dist`
- Functions directory: `netlify/functions`
- Node: 22

Netlify installs root dependencies before the build command. Remove any old
dashboard base-directory override pointing to `client`.

Set these environment variables in Netlify's project settings:

| Variable | Scope / purpose |
| --- | --- |
| `DATABASE_URL` | Functions; Supabase transaction pooler |
| `DATABASE_SSL_CA` | Functions; PEM server root certificate |
| `JWT_SECRET` | Functions; strong random signing secret |
| `TEACHER_SETUP_SECRET` | Functions; separate strong random setup secret |
| `VITE_CLOUDINARY_CLOUD_NAME` | Build; media upload account |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Build; unsigned student-upload preset |
| `OPENAI_API_KEY` | Functions; optional real AI assessments |
| `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY` | Functions; optional sandbox payments |
| `MIDTRANS_IS_PRODUCTION` | Functions; `false` for testing |

Keep `DATABASE_PROVIDER=sqlite` out of Netlify. Leave `VITE_API_URL` unset so the
frontend uses the same-origin `/api`. Supabase API keys are not required for this
PostgreSQL-backed API. Server credentials must never use a `VITE_` prefix.
Netlify supplies deployment URLs; the writing worker uses the current deploy URL
to keep previews isolated. Use a separate test Supabase project if you want
preview data isolated from production data.

AI writing assessments are dispatched to the signed `grade-writing-background`
function and stored in Supabase for the frontend to poll. AI speaking sessions
use short API requests and browser connections, not a persistent Node listener.
Upload media directly to Cloudinary rather than sending large files through functions.

Deploy the selected branch and open the returned `https://….netlify.app` URL.
Verify `/api/health`, administrator login, student registration, test autosave,
submission, result history after reload, audio playback, and uploads. The API
never seeds demo accounts or modifies test content on a function cold start.

## Local verification

```text
npm run typecheck:server
npm run build
npm test
npm run test:postgres
npm run test:netlify
```

`npm test` runs against a temporary SQLite directory, leaving your original data
untouched. PostgreSQL tests use an isolated real PostgreSQL engine via PGlite;
they do not connect to or mutate your Supabase project.

For local SQLite development, set `DATABASE_PROVIDER=sqlite` in your local shell
and run `npm start`. For Supabase development, leave it unset or use `postgres`.

References: [Netlify Express](https://docs.netlify.com/build/frameworks/framework-setup-guides/express/),
[Supabase connection methods](https://supabase.com/docs/guides/database/connecting-to-postgres),
[Supabase SSL](https://supabase.com/docs/guides/platform/ssl-enforcement).
