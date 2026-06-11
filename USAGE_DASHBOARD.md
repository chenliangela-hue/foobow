# Foobow AI Team Usage Dashboard

Last updated: 2026-06-11 13:05 America/Toronto

## Current Load

| Agent | 5h Window Used | Weekly Used | Requests Today | Est. Tokens In/Out | Load % | Last Task |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Codex 5.5 | ~306 min | Unknown | 50 | ~261k in / ~68k out | 99% | Integrated focus-session draft, provider setup plan, Node standardization marker, and verification |
| Claude 4.8 | ~11 min | Unknown | 9 | ~7k in / ~3k out | 14% | Reviewed non-secret focus-session API/database draft scope |
| Gemini 3.5 | ~10 min | Unknown | 8 | ~11k in / ~4k out | 16% | Reviewed non-secret provider, Node, and PA sequencing |

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
- API DB integration status: `npm --prefix apps/api run test:db-integration` now runs both the Prisma service write-path smoke and Nest HTTP DB smoke; CI uses the same command after applying SQL schema/seed. The suite now tags each run with `FOOBOW_DB_TEST_RUN_ID` and removes records created by that run.
- Dependency advisory status: `docs/dependency-advisory-watchlist.md` plus `npm run test:advisories` now tracks accepted moderate Prisma/Expo transitive advisories and documents why `npm audit fix --force` is not acceptable without review.

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
- Latest local gate: `npm run test:all` passed before push, Docker Postgres was verified healthy through elevated Docker access, `npm --prefix apps/api run test:db-integration` passed against the local database, and `npm test` passed after the remote CI URL patch.
- Latest remote CI finding: run `27137795568` failed because the `psql` schema/seed step used the Prisma URL with `?schema=public`; CI now keeps `DATABASE_URL` for Prisma and uses `PSQL_DATABASE_URL` without query parameters for `psql`.
- Latest remote CI gate: run `27137979006` for `3bbfeac Fix CI database seed URL` completed successfully.
- Latest local gate: `npm run test:api`, `npm --prefix apps/api run test:db-integration`, `npm test`, and `npm run test:all` passed after adding per-run DB cleanup.
- Latest remote CI gate: run `27139516012` for `3952c4f Isolate API DB integration smoke records` completed successfully.
- Latest heartbeat task: Added advisory watchlist and verification gate; `npm run test:advisories`, `npm test`, and `npm run test:all` passed locally before commit/push.
- Latest remote CI gate: run `27140916474` for `d6806a9 Track accepted dependency advisories` completed successfully.
- Latest external AI validation: Claude timed out on a short 60s orchestration prompt; Gemini first failed with a sandbox `EPERM` resolving `C:\Users\crane`, then timed out after elevated retry. Do not depend on either CLI for blocking-path work until a short prompt returns successfully.
- Latest heartbeat audit: working tree was clean, `npm run test:advisories` passed, and `npm test` passed. No safe new local sprint task was available without provider credentials, local Node upgrade approval, or reliable external AI CLI rotation.
- Latest heartbeat audit: working tree was clean, `npm run test:advisories` passed, `npm test` passed, and GitHub Actions run `27148145672` for `76c11d2 Record blocked heartbeat audit` completed successfully.
- Rotation note: Codex is now above the 80% threshold; next orchestration pass should avoid assigning new heavy implementation work to Codex until capacity recovers. Claude/Gemini are low-load in the dashboard but currently unreliable due CLI timeouts.
- Latest orchestration update: durable `AGENTS.md` rules now require checking usage and rotating heavy work away from any agent at or above 80% load. Claude Code passed `CLAUDE_HEALTH_OK`; Gemini passed `GEMINI_HEALTH_OK` only when run with elevation because sandboxed startup still hits `EPERM` on `C:\Users\crane`.
- Latest external AI assignments: Claude reviewed sprint priorities and recommended provider setup, Node standardization, Calm Ritual spec-first work, agent health checks, and decoupled API contract tasks. Gemini reviewed meditation-inspired product QA and recommended adaptive soundscapes, intentionality timer, hold-to-complete, gentle ripple animation, and private reflection.
- Latest local gate: `npm test` passed with 23/23 tests after adding `AGENTS.md`, sprint audit notes, and Calm Ritual feature planning.
- Latest heartbeat sprint task: Calm Ritual is now visible in the static prototype and Expo shell with soundscape choices, focus progress, guided steps, accessible completion controls, quiet progress copy, and safety language separating symbolic comfort from guaranteed outcomes.
- Latest external AI assignments: Claude recommended focus session tables/endpoints, server-side thresholds, idempotent karma, and private reflections. Gemini recommended Node standardization first, then provider credentials, then provider-backed PA, with Stripe deferred.
- Latest sprint task: Focus-session API/database draft added through OpenAPI, `database/migrations/0002_focus_sessions.sql`, Prisma models, docs, and tests. Provider CLI setup plan and `.nvmrc` were added. Prisma generate passed when run through bundled Node 24; default local Node `20.17.0` remains below project baseline.
- Latest local gates: `npm test` passed with 25/25 tests; `npm run test:api`, `npm run test:env`, and `npm run test:advisories` passed elevated after sandbox EPERM; `database/migrations/0002_focus_sessions.sql` applied cleanly to local `foobow-postgres`; `npm --prefix apps/api run test:db-integration` passed against local Postgres.
- Provider-backed PA status: not runnable yet because real Clerk, Supabase/Postgres connection values, and Mapbox token are not configured. Current browser PA remains valid for prototype flows, but authenticated provider-backed PA is blocked on credentials.
- Latest CI fix: run `27364694883` failed in `api-db-smoke` because CI applied only `0001_initial.sql` while Prisma expected `0002_focus_sessions.sql`. The workflow now applies `0002_focus_sessions.sql` before seed data, and `npm test` plus local `npm --prefix apps/api run test:db-integration` pass after the fix.
- Latest remote CI gate: run `27364947871` for `b5b0198 Apply focus session migration in CI` completed successfully.
