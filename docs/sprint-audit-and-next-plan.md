# Foobow Sprint Audit And Next Plan

Last reviewed: 2026-06-11

## Progress Audit

Foobow has moved beyond the first clickable-product deliverable. The repo now contains product specs, user stories, a static mobile-first prototype, Expo mobile scaffold, API contracts, database schema drafts, a dependency-light API runtime, a NestJS/Prisma backend target, CI, browser PA coverage, visual baselines, shared catalog checks, environment setup docs, and an accepted dependency-advisory watchlist.

The current working tree was clean at the latest audit. The latest checked GitHub Actions runs were green. The main delivery risk is no longer the prototype; it is production-resource setup and disciplined AI-team orchestration.

## Current Blockers

- Provider inputs are partly available: Clerk app keys were provided but the pasted secret should be rotated; Supabase organization/region/password are still needed. Mapbox token/style is no longer required for MVP because Foobow can use the OSM/MapLibre path.
- The default local Node version is still recorded below the project baseline; Prisma work should use bundled Node 24 or the system Node should be upgraded to `20.19.4+`.
- Claude Code and Gemini are low usage in the dashboard, but prior health checks timed out. They can receive future work only after short health checks succeed.
- Codex is recorded above the 80% rotation threshold, so Codex should orchestrate and verify rather than take heavy implementation tasks.

## Reference Site Notes: putiyuan Meditation

The public meditation page at `https://putiyuan.pages.dev/meditation/` shows patterns that are relevant to Foobow without copying private code or brand-specific religious claims.

Useful product patterns to adapt:

- Ambient session mode: a dedicated calm mode with background audio, timer, progress bar, mute, volume, and play/pause controls.
- Completion threshold: a session only records merit/progress after a minimum focused duration.
- Guided cards: short guided practices with duration labels and step-by-step instructions.
- Quote panel: a small daily reflection quote that sets emotional tone before action.
- Gentle celebration: subtle lotus/halo animation after completion, not casino-like rewards.
- Persistent mini player: audio can continue while users navigate.
- Recovery account flow: "find previous record" style retrieval for anonymous-first users.
- Mobile app shell: bottom navigation, safe-area support, share metadata, install/PWA signals, and small icon-first controls.

Foobow should adapt these as secular, safety-conscious "calm ritual" features:

- Good-deed focus session before or after a symbolic deed.
- Optional ambient sound while doing virtual release, tree watering, candle lighting, or blessing.
- Minimum attention duration before awarding karma points.
- Reflection prompts that avoid claims of guaranteed luck, virtue, spiritual merit, or medical benefit.
- Quiet celebration animation for completion, with reduced-motion support.
- Anonymous record recovery through account sign-in, export, or recovery code.

## AI Team Operating Plan

Codex remains orchestration owner. Heavy work should rotate to Claude Code and Gemini once each passes a CLI health check.

| Agent | Best Work | Current Rule |
| --- | --- | --- |
| Codex | Orchestration, integration, tests, final decisions, CI fixes | Avoid heavy work while dashboard load is above 80% |
| Claude Code | Architecture critique, product spec review, privacy/moderation review, roadmap decomposition | Use only after a short prompt returns successfully |
| Gemini | Implementation alternatives, fixture expansion, QA scenario generation, localization ideas | Use only after a short prompt returns successfully |

External AI prompts must exclude secrets and should contain only scoped repo context needed for the assignment.

## Next 3-5 Tasks

1. Add a calm ritual / focus-session feature spec and user stories based on the meditation reference patterns.
2. Add a prototype or mobile-shell screen for optional ambient focus before completing a deed.
3. Add backend/API contract fields for focus session completion if product scope accepts it.
4. Run Claude Code and Gemini health checks; if healthy, assign each one non-secret review work and validate their output locally.
5. Resolve production setup blockers: choose provider accounts, fill `.env.local`, create Supabase/Clerk resources, keep OSM/MapLibre maps for MVP, and upgrade or standardize Node.

## Acceptance Criteria For Next Sprint

- New calm ritual features preserve Foobow's secular virtual-good-deed positioning.
- Donation and karma copy still states that users cannot buy luck, virtue, or guaranteed karma.
- Reduced-motion and accessibility expectations are documented before animations are expanded.
- External-agent assignments are recorded in `USAGE_DASHBOARD.md` with health status and usage assumptions.
- Any implemented feature passes the smallest relevant test gate and does not weaken existing CI.
