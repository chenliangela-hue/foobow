# Foobow Task Board

## Done

- Initialize local repo.
- Connect Git remote.
- Preserve `foobow.com.txt`.
- Add README.
- Add product spec.
- Add user stories.
- Add reference-product notes.
- Add static clickable prototype.
- Add ODD spec.
- Add database structure doc.
- Add API interface doc.
- Add project plan.
- Add CI workflow.
- Add dependency-free unit, smoke, and PA checks.
- Add local prototype persistence, structured sample data, export/delete controls, and report actions.
- Add object-level acceptance criteria.
- Run real browser PA pass for core prototype flows.
- Harden database and API docs with keys, relationships, indexes, retention, migration, errors, pagination, rate limits, and donation idempotency.
- Add Playwright browser PA tests and CI browser-test stage.
- Add richer map/deed category filters.
- Add automated keyboard traversal, deed keyboard activation, and design-token contrast PA checks.
- Select Expo + React Native + TypeScript as the MVP mobile app stack.
- Scaffold Expo mobile app under `apps/mobile`.
- Port core Foobow flows into the Expo mobile shell.
- Add mobile TypeScript typecheck gate.
- Add high/critical dependency audit gates for root and mobile packages.
- Add initial PostgreSQL migration and seed data drafts.
- Add OpenAPI contract draft and contract tests.
- Add dependency-light API runtime scaffold under `apps/api`.
- Add API runtime tests for health, discovery, check-in, deed completion, blessings, reports, donation verification, and donation idempotency.
- Accept ADR 002: target NestJS + TypeScript + PostgreSQL + Prisma for the production backend while keeping SQL migrations for database-specific controls.
- Add Playwright visual regression baselines for core prototype screens.
- Scaffold typed NestJS production backend target under `apps/api/src/nest`.

## In Progress

- Push to `cranewang200/foobow.git`.
  - Blocker: current GitHub credential `regwang3713` received 403 for the target repo.

## Next

- Upgrade local Node to `20.19.4+` so Prisma CLI 7 can be installed and migrations can be generated through the selected toolchain.
- Add route-based app structure once Expo Router is installed.
- Monitor Expo SDK 56 moderate transitive audit advisories for safe upstream fixes.
- Select production backend framework and convert the in-memory API scaffold to persistent route modules.
- Add browser-driven tests when local browser/server isolation is resolved.
- Choose production app framework after prototype scope stabilizes.

## Backlog

- Authentication and profile backend.
- Real map provider integration.
- Deed action persistence.
- Blessing wall moderation.
- Verified donation campaign workflow.
- Subscription and ad policy.
- Admin moderation console.
- Localization workflow.
- Visual regression tests.
- Mobile app packaging.
