# Foobow Project Plan

## Current Objective

Move Foobow from a product concept into a disciplined MVP project with docs, task tracking, CI, tests, and an implementation path that can be completed with minimal human intervention.

## Standards

- ODD: keep work tied to stable product objects.
- MVP: deliver thin vertical slices that users can see and test.
- TDD: add or update tests before considering a slice done.
- CI/CD: all tracked changes must pass automated checks before push/merge.
- Reuse first: check existing code and popular product patterns before custom invention.
- Documentation: update memory, schema, API, and task docs when scope changes.

## Verification Gates

- Unit checks: static content and object coverage in docs/prototype.
- Smoke checks: prototype JavaScript syntax and static HTTP serving.
- PA checks: baseline accessibility, privacy, safety, and donation wording.
- Browser PA checks: Playwright validates mobile/desktop core flows.
- Visual regression checks: Playwright screenshots protect core mobile/desktop prototype layouts.
- Security checks: high/critical npm audit gates run for root, API, and mobile packages.
- Manual PA audits: record real visual/interaction findings in dated PA audit docs.
- Future gates: production backend contract parity tests, migration tests, security checks.

## Sub-Agent Assignment Model

- Main agent owns critical path implementation and final integration.
- Explorer sub-agent audits docs/prototype gaps and checks whether feature coverage matches the goal.
- Future worker sub-agents can own disjoint slices:
  - Prototype interaction hardening.
  - Design system and accessibility pass.
  - Backend/schema/API implementation.
  - CI/test expansion.
  - Product copy and localization QA.

## Milestones

### Milestone 1: Foundation

- Living memory.
- ODD spec.
- Database structure.
- API interface.
- Task board.
- CI with unit, smoke, and PA checks.
- Static prototype preserved and testable.

### Milestone 2: Prototype Hardening

- Persist prototype state locally.
- Replace hardcoded prototype content with structured sample data.
- Add richer map/deed/ranking interactions.
- Add keyboard and responsive interaction QA.
- Current status: PA audit layout findings from `docs/pa-audit-2026-06-07.md` are fixed in the prototype CSS and protected by refreshed mobile/desktop visual baselines.

### Milestone 3: MVP App Scaffold

- Select app framework.
- Build production app shell.
- Move prototype screens into reusable components.
- Add route/state management.
- Add app-level test harness.
- Current status: Expo/React Native shell exists under `apps/mobile` with Expo Router tab routes and a TypeScript typecheck gate.

### Milestone 4: Backend Readiness

- Implement database migrations.
- Seed deed types, map spots, badges, and donation campaigns.
- Add auth/profile/check-in/deed/blessing APIs.
- Add moderation and donation safety checks.
- Current status: initial migration, seed data, OpenAPI contract drafts, contract tests, a dependency-light in-memory API runtime, and a typed NestJS scaffold exist.
- Runtime bridge: `apps/api` validates public discovery, daily check-in, deed completion, blessing/report creation, verified campaign listing, and idempotent donation creation before the production backend framework is selected.
- Backend direction: ADR 002 selects NestJS + TypeScript + PostgreSQL + Prisma as the target production backend stack, with explicit SQL retained for database-specific safety controls.
- Local blocker: Prisma CLI 7 requires Node `20.19+`; the current local Node `20.17.0` cannot install it, so Prisma migration generation waits for a Node upgrade.
- Persistence target: `apps/api/prisma/schema.prisma` mirrors the SQL migration draft so future Prisma generation has an explicit schema target once Node is upgraded.
- Mobile CI stability: Expo Router's optional web peer resolution is pinned through `react-dom@19.2.3` to match the Expo-selected `react@19.2.3` version.
- Auth readiness: `docs/auth-strategy.md` recommends a managed provider shortlist and defines login, session, consent, moderation-role, export, and deletion requirements.
- Map readiness: `docs/map-provider-decision.md` recommends Mapbox for a premium mobile MVP with OpenStreetMap/MapLibre as the vendor-independence fallback.
- Localization readiness: `docs/localization-workflow.md` defines `en` and `zh-Hans` workflow, safety-copy review, and accessibility label translation requirements.
- Mobile release readiness: `docs/mobile-release-checklist.md` captures App Store, Google Play, privacy, moderation, payment, and asset gates.
- Runtime readiness: `.node-version` and `docs/node-readiness.md` record Node `20.19.4` as the project baseline.
- CI readiness: GitHub Actions keeps project commands on Node `20.19.4`, uses Node 24 runtime major versions for checkout/setup-node actions, and pins visual regression to `windows-2025`.
- Prisma readiness: Prisma CLI 7 is installed in `apps/api`, `prisma.config.ts` carries the database URL for Prisma 7, and `npm --prefix apps/api run prisma:generate` succeeds with a supported Node runtime.
- Persistence bridge: Nest now provides `PrismaService`; read endpoints for deed types, map spots, blessings, and donation campaigns can switch to Prisma when `DATABASE_URL` is configured while retaining fixture fallback for no-database environments.
- Local database readiness: `docker-compose.yml` provides a PostgreSQL 17 service on port `55432`; the SQL migration/seed path has been applied locally and verified for deed types, map spots, blessings, and donation campaigns.
- Runtime persistence: Prisma 7 is wired with the official PostgreSQL driver adapter, and Nest account, check-in, deed action, blessing, report, and donation creation paths can persist to PostgreSQL while retaining fixture fallback for no-database environments.
- Local database integration verification: `npm --prefix apps/api run test:db-integration` exercises Prisma service write paths and Nest HTTP DB endpoints for account bootstrap, daily check-in, deed completion plus karma, blessing/report creation, and donation idempotency against the local database.
- CI database verification: GitHub Actions includes an Ubuntu PostgreSQL service job that applies the SQL migration/seed and runs the same `test:db-integration` acceptance command used locally.

### Milestone 5: Release Readiness

- End-to-end tests.
- Accessibility audit.
- Privacy and donation compliance review.
- App-store-ready copy, screenshots, and release checklist.

## Definition Of Done

- User-visible behavior matches the relevant spec slice.
- Docs reflect the changed behavior.
- Tests cover the slice.
- CI passes locally and in GitHub Actions.
- No donation or karma copy implies users can buy luck, virtue, forgiveness, or guaranteed karma.
