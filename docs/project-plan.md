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
- Security checks: high/critical npm audit gates run for root and mobile packages.
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
- Add browser-driven tests once the runtime can reliably launch.

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
