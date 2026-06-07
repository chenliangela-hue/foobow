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
- Add Expo Router route structure for Today, Map, Deeds, Community, and Profile mobile routes.
- Add Prisma schema draft mirroring the PostgreSQL migration and public API ID model.
- Push `main` to `cranewang200/foobow.git`.
- Run real PA audit from Chromium-rendered visual baselines and interaction coverage.
- Fix Claude Code orchestration blocker by removing stale custom API/proxy overrides from user settings after creating a backup.
- Fix remote CI mobile dependency resolution for Expo Router/react/react-dom by pinning `react-dom` to the Expo-compatible React version.
- Fix P1/P2 prototype layout issues from PA audit: mobile nav/content overlap, Community clipping/list coverage, Map bottom cramping, and desktop Today empty vertical space.
- Refresh visual regression baselines after inspected PA layout fixes.
- Add production authentication strategy shortlist and MVP account/security requirements.
- Add map provider decision notes covering Mapbox, Google Maps, OpenStreetMap, and MapLibre tradeoffs.
- Add localization workflow for `en` and `zh-Hans`, safety copy, accessibility labels, and QA.
- Add mobile release checklist for App Store, Google Play, store assets, privacy, and build gates.
- Add Node readiness marker and setup notes for the `20.19.4` runtime baseline.
- Harden CI against upcoming GitHub Actions Node 20 runner deprecation and `windows-latest` redirect notices.

## Next

- Upgrade local Node to `20.19.4+` so Prisma CLI 7 can be installed and migrations can be generated through the selected toolchain.
- Convert the in-memory API scaffold to persistent NestJS route modules after Prisma generation and database connection are available.
- Add production authentication provider once account/session requirements and credentials are selected.
- Monitor Expo SDK 56 moderate transitive audit advisories for safe upstream fixes.

## Backlog

- Real map provider integration.
- Deed action persistence.
- Verified donation campaign workflow.
- Subscription and ad policy.
- Admin moderation console.
- Localization workflow.
- Mobile app packaging.
