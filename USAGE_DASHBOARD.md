# Foobow AI Team Usage Dashboard

Last updated: 2026-06-08 08:20 America/Toronto

## Current Load

| Agent | 5h Window Used | Weekly Used | Requests Today | Est. Tokens In/Out | Load % | Last Task |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Codex 5.5 | ~225 min | Unknown | 29 | ~174k in / ~42k out | 88% | Integrated reduced mobile MVP env contract and beginner setup guide |
| Claude 4.8 | ~8 min | Unknown | 5 | ~5k in / ~2k out | 9% | Assigned env-simplification review; latest CLI call timed out at 120s with no output |
| Gemini 3.5 | ~7 min | Unknown | 4 | ~9k in / ~3k out | 11% | Assigned env-simplification review; latest CLI call timed out at 120s after prior 429 risk |

## Assignment Rules

- Claude 4.8: deep planning, architecture, documentation. Use only while under 60% 5h load.
- Gemini 3.5: high-volume execution, implementation support, creative alternatives. Prefer while under 70% load.
- Codex 5.5: orchestration, diff review, integration, tests, DevOps, final decisions.
- Reassign future heavy tasks away from any agent at or above 80% 5h load and record recovery time when visible.
- When Codex is above 80%, keep Codex focused on orchestration, patch integration, verification, and final acceptance; push research/planning review prompts to Claude/Gemini when the CLI responds.

## Current Repo State

- Local branch: `main`.
- Remote: `origin/main`.
- Status before dashboard update: clean working tree, local `main` synced with `origin/main`.
- Claude blocker resolved by removing stale custom API/proxy override keys from Claude Code user settings after creating a timestamped backup.
- PA audit layout gaps fixed and visual baselines refreshed.
- Mobile dependency conflict fixed by pinning `react-dom@19.2.3` to match `react@19.2.3`.
- Sprint readiness artifacts added for auth, maps, localization, mobile release, and Node runtime.
- Latest pushed sprint commit passed GitHub Actions; follow-up CI warning hardening upgrades checkout/setup-node to Node 24 runtime action majors.
- Prisma CLI 7 is installed and Prisma Client generation succeeds when commands run with bundled Node `24.14.0` first on PATH.
- Current top project concern: default local Node is still `20.17.0`; use the bundled Node 24 path or upgrade system Node before running Prisma CLI commands directly.
- Local PostgreSQL now runs through `docker compose up -d foobow-postgres` on port `55432`; schema/seed have been applied and verified locally.
- Nest Prisma write paths are now implemented for account bootstrap, daily check-in, deed action plus karma event, blessings, reports, and donation idempotency.
- CI now includes an Ubuntu PostgreSQL service job that applies SQL migration/seed and runs both direct Prisma and endpoint-level Nest DB smoke scripts.
- Active automation: `foobow-vibeorchestrator-usage-check` wakes this thread every 30 minutes to recheck usage, rotate agents, inspect task state, and continue safe local sprint work.
- Plugin setup status: Browser, GitHub, Chrome, Computer Use, Documents, Presentations, Spreadsheets, Canva, and thread/automation tools are available; no extra plugin install is required for the current sprint.
- Shared catalog status: `shared/foobow-catalog.json` plus `npm run test:catalog` now verifies prototype, mobile, API fixture, and SQL seed product-object alignment.
- External service setup status: root `.env.example`, ignored `.env.local`, `docs/external-service-resources.md`, and `npm run test:env` now define a reduced mobile MVP key set: Supabase/local Postgres, Clerk, Mapbox, API URL, and local dev token. Stripe is optional for donation mode; Vercel/Sentry/PostHog/Expo tokens are deferred; no email API key is required for MVP.

## Last Sync Notes

- Dashboard initialized from zero counters as requested.
- `claude` and `gemini` CLIs are available on PATH.
- Claude planning assignment initially failed due API socket connectivity; root cause was stale custom API/proxy settings overriding the user's logged-in Claude.ai account.
- Claude now uses the authenticated Claude.ai Pro OAuth route and is available for planning/orchestration.
- A repo-context Claude orchestration prompt was rejected by the approval layer because it would send private workspace context to an external model. Use Claude only after explicit approval for that transfer.
- Gemini plan prioritizes CI dependency stabilization, PA layout fixes, Node/Prisma unblock, mobile component extraction, and persistent NestJS routes.
- `npm run test:all` passed after the fixes: root tests, API tests/typecheck, mobile typecheck, browser PA, visual regression, and high/critical security audits.
- Latest sprint run added 17th root test for release-readiness docs and reran `npm run test:all` successfully.
- GitHub Actions warning follow-up pins visual regression to `windows-2025`, upgrades `actions/checkout` and `actions/setup-node` to current Node 24 runtime majors, and preserves project Node `20.19.4`.
- API backend progress: Prisma 7 config moved DB URL into `prisma.config.ts`, schema relations were fixed, Nest has `PrismaService`, and read endpoints can use Prisma when `DATABASE_URL` is present.
- Local DB smoke progress: Prisma 7 required the official PostgreSQL driver adapter, so `@prisma/adapter-pg` was installed and `PrismaService` now constructs `PrismaClient` with `PrismaPg`.
- `npm --prefix apps/api run prisma:smoke` passed against local Postgres after aligning the SQL migration with Prisma donation payment provider columns.
- `npm --prefix apps/api run nest:db-smoke` passed after making Nest controller/service DI explicit for the `tsx` runtime used by local smoke and CI.
- Remote CI run inspection is temporarily blocked by the Codex approval layer usage limit; local gates and pushes succeeded.
- External AI policy: user explicitly approved sending Foobow repo context to Claude Code and Gemini; continue avoiding any secret values in prompts.
- Latest external AI validation: Codex assigned the env/key-reduction review to both Claude Code and Gemini; both CLI calls timed out at 120 seconds with no usable output, so Codex completed the integration locally and recorded the timeout as the current blocker.
- Latest local gate: `npm run test:all` passed after plugin orchestration and shared catalog changes; mobile/browser/visual gates are green after refreshing the mobile dark community baseline.
- Rotation note: Codex is now above the 80% threshold; next orchestration pass should avoid assigning new heavy implementation work to Codex until capacity recovers. Claude/Gemini remain available for planning, but Gemini may temporarily fail with server 429 capacity.
