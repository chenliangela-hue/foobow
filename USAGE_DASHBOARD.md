# Foobow AI Team Usage Dashboard

Last updated: 2026-06-07 19:39 America/Toronto

## Current Load

| Agent | 5h Window Used | Weekly Used | Requests Today | Est. Tokens In/Out | Load % | Last Task |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Codex 5.5 | ~80 min | Unknown | 12 | ~61k in / ~12k out | 36% | Completed sprint readiness docs, remote CI verification, and GitHub Actions runner hardening |
| Claude 4.8 | ~4 min | Unknown | 3 | ~2.5k in / minimal out | 4% | Auth verified through Claude.ai Pro OAuth; minimal `claude -p` orchestration call now succeeds; repo-content prompt blocked by approval policy |
| Gemini 3.5 | ~3 min | Unknown | 2 | ~5k in / ~1.5k out | 6% | Acknowledged executor readiness and produced full project plan + sprint backlog + Kanban |

## Assignment Rules

- Claude 4.8: deep planning, architecture, documentation. Use only while under 60% 5h load.
- Gemini 3.5: high-volume execution, implementation support, creative alternatives. Prefer while under 70% load.
- Codex 5.5: orchestration, diff review, integration, tests, DevOps, final decisions.
- Reassign future tasks away from any agent at or above 80% 5h load.

## Current Repo State

- Local branch: `main`.
- Remote: `origin/main`.
- Status before dashboard update: clean working tree, local `main` synced with `origin/main`.
- Claude blocker resolved by removing stale custom API/proxy override keys from Claude Code user settings after creating a timestamped backup.
- PA audit layout gaps fixed and visual baselines refreshed.
- Mobile dependency conflict fixed by pinning `react-dom@19.2.3` to match `react@19.2.3`.
- Sprint readiness artifacts added for auth, maps, localization, mobile release, and Node runtime.
- Latest pushed sprint commit passed GitHub Actions; follow-up CI warning hardening is in progress.
- Current top project concern: local Node is still `20.17.0`; Prisma CLI 7 and some Expo/RN tooling expect `20.19.4+`.

## Last Sync Notes

- Dashboard initialized from zero counters as requested.
- `claude` and `gemini` CLIs are available on PATH.
- Claude planning assignment initially failed due API socket connectivity; root cause was stale custom API/proxy settings overriding the user's logged-in Claude.ai account.
- Claude now uses the authenticated Claude.ai Pro OAuth route and is available for planning/orchestration.
- A repo-context Claude orchestration prompt was rejected by the approval layer because it would send private workspace context to an external model. Use Claude only after explicit approval for that transfer.
- Gemini plan prioritizes CI dependency stabilization, PA layout fixes, Node/Prisma unblock, mobile component extraction, and persistent NestJS routes.
- `npm run test:all` passed after the fixes: root tests, API tests/typecheck, mobile typecheck, browser PA, visual regression, and high/critical security audits.
- Latest sprint run added 17th root test for release-readiness docs and reran `npm run test:all` successfully.
- GitHub Actions warning follow-up pins visual regression to `windows-2025` and opts actions into Node 24 while preserving project Node `20.19.4`.
