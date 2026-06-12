# Foobow Agent Operating Rules

This repo is managed by a three-agent coding team: Codex, Claude Code, and Gemini.

## Orchestration Rule

Codex is the default orchestrator, reviewer, and integration owner. Codex must not consume the whole work budget when other approved coding agents are available. Before assigning or starting meaningful work, check `USAGE_DASHBOARD.md`, `docs/task-board.md`, and the current git state.

## Usage Rotation

- Do not assign new heavy implementation, research, or documentation work to an agent at or above 80% load.
- When Codex is at or above 80%, Codex should focus on orchestration, task decomposition, diff review, test verification, and final acceptance.
- Assign architecture, product review, and documentation planning to Claude Code when it is below 60% and its CLI returns a short health-check prompt.
- Assign implementation alternatives, high-volume refactors, fixture expansion, and exploratory QA ideas to Gemini when it is below 70% and its CLI returns a short health-check prompt.
- If Claude Code or Gemini times out, hits a quota/429, or cannot run because of sandbox/auth issues, record that in `USAGE_DASHBOARD.md` and do not put blocking-path work on that agent until a health check succeeds.
- Never send secrets, `.env.local` values, API keys, tokens, private customer data, or payment data to external AI tools.

## Coordination Loop

1. Audit current state: `USAGE_DASHBOARD.md`, `docs/task-board.md`, `git status --short`, and latest test/CI state when available.
2. Pick the next unblocked task from `docs/task-board.md`.
3. Split the task into agent-sized assignments with clear acceptance criteria.
4. Route the assignment away from agents above the usage threshold.
5. Validate all external-agent output locally before integration.
6. Run the smallest relevant test gate first, then the broader gate when the change affects shared product behavior.
7. Update the dashboard and task board only when they change materially.

## Current Blockers

The next production sprint depends on provider inputs or local environment changes:

- Supabase organization, region, project password, and database URL.
- Clerk application keys and redirect settings.
- Map provider decision. Default MVP path is OpenStreetMap-derived tiles with MapLibre/Leaflet; Mapbox is optional later if paid/premium styling is approved.
- Optional Stripe donation mode details.
- Default local Node upgrade to `20.19.4+`, or consistently using the bundled Node 24 runtime for Prisma.
