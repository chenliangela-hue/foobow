# Foobow Memory

This file is the project-local memory. Keep it current whenever product direction, implementation scope, verification, or repo state changes.

## 2026-06-06

- Initialized the local repo in `D:\code\projects\mobileapp\gooddeed` and connected `origin` to `https://github.com/cranewang200/foobow.git`.
- Added the first product deliverable: README, product spec, user stories, reference-product notes, and a static clickable prototype.
- Preserved the existing empty `foobow.com.txt`.
- Created local commit `d2e87b4` with message `Initial Foobow product spec and prototype`.
- Push to GitHub failed with HTTP 403 because the active GitHub credential was `regwang3713`, which does not have permission to push to `cranewang200/foobow.git`.
- Added the second foundation slice: ODD spec, database structure, API interface, project plan, task board, CI workflow, and dependency-free unit/smoke/PA test scripts.
- Added prototype hardening: structured sample data module, local persistence, export/delete controls, blessing report actions, focus states, reduced-motion handling, and object-level acceptance criteria.
- Verified prototype with real Playwright browser runner loaded from `file:///D:/code/projects/mobileapp/gooddeed/prototype/index.html`; mood, deed, map, blessing, report, profile, donation, theme, language, and localStorage persistence flows passed.
- Hardened database/API planning with primary key guidance, relationships, indexes, privacy retention, migration strategy, API base path, cursor pagination, error shape, rate limits, donation idempotency, and payment webhook flow.
- Added `@playwright/test`, browser PA tests for mobile/desktop core prototype flows, and a CI stage that installs Chromium and runs `npm run test:browser`.
- Added category filters for map spots and deed catalog, keyboard-accessible deed selection, and automated Playwright checks for filters, keyboard traversal, keyboard activation, and WCAG 4.5:1 core token contrast.
- Accepted ADR 001: use Expo + React Native + TypeScript for the MVP mobile app scaffold under `apps/mobile`.
- Scaffolded Expo SDK 56 / React Native 0.85 / TypeScript app in `apps/mobile`, removed generated nested `.git`, ported Foobow core flows into `App.tsx`, added typed sample data, and added `npm run test:mobile` typecheck.
- Local scaffold warning: Expo SDK 56 dependencies expect Node `^20.19.4 || ^22.13.0 || ^24.3.0 || >=25.0.0`; current local Node is `20.17.0`.
- Added root and mobile high/critical audit scripts. Root audit found 0 vulnerabilities; mobile high/critical audit passed but has 10 moderate Expo-template transitive advisories where `npm audit fix --force` would downgrade Expo.
- Added backend-readiness artifacts: `database/migrations/0001_initial.sql`, `database/seeds/0001_reference_data.sql`, `docs/openapi.json`, and Node contract tests for OpenAPI/database coverage.
- After adding final audit/CI convenience scripts, further escalated local reruns were blocked by Codex usage limits. `npm test` still passed 8/8 in the sandbox; prior escalated `npm run test:mobile`, `npm run test:browser`, and individual high audit commands passed before the final script/doc edits.
- Added first executable API runtime scaffold in `apps/api` using Node's built-in HTTP server and test runner. The runtime is in-memory and validates health, public discovery, daily check-ins, deed completion, blessings, reports, verified donation campaigns, donation idempotency, and standard error request IDs.
- Accepted ADR 002 as the production backend direction: NestJS + TypeScript + PostgreSQL + Prisma, with versioned SQL retained for database-specific constraints, indexes, retention, and audit behavior.
- Tightened the API runtime after sub-agent contract review: added a deterministic dev bearer auth guard, `/me` user/profile/subscription shape, duplicate daily check-in conflict, OpenAPI-aligned blessing/donation validation, region filtering, cursor-style slicing, and public-ID database guidance.
- Added Playwright visual regression coverage for Today, Map/Environment, and dark-mode Community prototype states across mobile and desktop Chromium. CI runs the visual job on `windows-latest` to match the committed `win32` screenshot baselines.
- Installed NestJS 11, `@nestjs/swagger`, `@prisma/client` 7, and TypeScript tooling in `apps/api`; scaffolded a typed NestJS backend target with DTO validation, dev bearer auth guard, Swagger setup, and route modules mirroring the current contract runtime. Prisma CLI 7 install is blocked locally until Node is upgraded from `20.17.0` to `20.19+`. Added API dependency audit coverage to the root security gate.
- Installed Expo Router and added route files for Today, Map, Deeds, Community, and Profile under `apps/mobile/app/(tabs)`, with the custom Foobow shell driving route-aware tab navigation.
- Added `apps/api/prisma/schema.prisma` as a Prisma persistence target that mirrors the SQL migration draft, public IDs, moderation tables, subscription records, and donation idempotency constraints.
- Cleaned the task board so completed framework, route, browser, and visual-regression work is no longer listed as future work; remaining next steps are credential/Node/service dependent.
- Ran a real PA audit from Chromium-rendered visual baselines after local server/browser launch was blocked by the current environment. Found P1 prototype UI issues: mobile bottom nav overlaps the Today CTA and Community headings clip on mobile/desktop. Added `docs/pa-audit-2026-06-07.md` and next tasks.
- Fixed Claude Code orchestration access by backing up `C:\Users\crane\.claude\settings.json` and removing stale custom API/proxy override keys that were taking precedence over the user's Claude.ai Pro OAuth login. A minimal `claude -p` call returned `CLAUDE_OK`. A later repo-context prompt to Claude was blocked by the approval layer because it would transmit private workspace context to an external model.
- Fixed the Expo Router/react/react-dom CI dependency conflict by explicitly pinning `react-dom@19.2.3` to match the Expo-selected `react@19.2.3`; mobile typecheck passes after the lockfile update.
- Fixed PA audit layout findings in `prototype/styles.css`: mobile bottom navigation no longer overlays the Today CTA or Community feed, Community headings have inner screen padding, Map content is not cramped by the nav, and desktop Today no longer forces a large blank lower viewport. Refreshed Playwright visual baselines after inspecting the new screenshots.
- Ran `npm run test:all` successfully after the fixes: 16 root tests, 18 API tests/typecheck, mobile typecheck, 10 browser PA tests, 6 visual regression tests, and high/critical audit gates passed. Mobile still reports known moderate Expo transitive `uuid` advisories that require an unsafe breaking force fix.
- Added sprint readiness docs for production auth strategy, map provider decision, localization workflow, mobile release checklist, and Node `20.19.4` readiness. Added `.node-version` and root content tests so these release-readiness artifacts stay linked from README and cover the required decision points.
- Verified GitHub Actions run `27107971093` passed after the sprint readiness commit. Addressed its forward-looking runner notices by upgrading checkout/setup-node to current Node 24 runtime action majors, pinning visual regression to `windows-2025`, and adding a root test for those workflow expectations.
- Used the Codex bundled Node `24.14.0` runtime to install Prisma CLI 7 in `apps/api` and run Prisma Client generation. Updated Prisma for v7 by moving `DATABASE_URL` to `apps/api/prisma.config.ts`, adding a generate-only unreachable fallback URL, fixing missing inverse relations, and adding `PrismaService` plus Prisma-backed Nest read paths for deed types, map spots, blessings, and donation campaigns. Added `apps/api/.env.example` and configurable dev bearer token support.
- `npm run test:all` passed after Prisma/Nest changes. Security gates remain high/critical clean, but API audit now reports a moderate Prisma dev-tooling transitive `@hono/node-server` advisory whose force fix would downgrade Prisma; track for upstream fix rather than forcing.

## 2026-07-19

- Refactored `apps/mobile` into an enterprise-grade MVC / Modular Architecture (`src/theme/`, `src/types/`, `src/services/`, `src/controllers/`, `src/components/`).
- Implemented Zen and Senior-Friendly UI design tokens with warm sand, tea/jade, bamboo, and soft amber gold tones, high contrast text ratios, senior font scaling, and extra-large 48dp+ tap targets.
- Created custom controller hooks (`useTodayController`, `useMapController`, `useDeedController`, `useCalmRitualController`, `useCommunityController`, `useProfileController`) isolating state logic from view components.
- Extracted isolated view components (`Header`, `NavBar`, `CategoryFilters`, `SafetyNotice`, `TodayView`, `MapView`, `DeedCatalogView`, `CalmRitualCard`, `CommunityView`, `ProfileView`).
- Updated `prototype/styles.css` with 48px minimum touch targets and `.senior-mode` high-readability rules.

## 2026-07-22

- Verified the mobile MVC refactor against all local gates: root 25 tests, API 21 tests + typecheck, mobile typecheck, mobile routing test, 10 browser PA tests, and the dependency advisory watchlist.
- Simplified `useTodayController` to drop its duplicated internal karma state and take an `addKarma(points)` callback, matching the deed/community controller signatures so app-level `sharedKarma` is the single source of truth.
- Found the Playwright community visual baselines stale since `aad9272` (that commit changed `prototype/data.js` sample blessings without refreshing snapshots). Refreshed all six visual baselines after inspecting the new screenshots; the diffs were the intended 48px touch targets plus current sample data. `npm run test:visual` passes 6/6.

- GitHub push works again after the user re-logged in; `origin` now points to `chenliangela-hue/foobow.git` and `main` is pushed.
- Wired the mobile app to the real API contract: new `src/services/apiClient.ts` (env-driven `EXPO_PUBLIC_API_URL` + `/api/v1` base path, optional `EXPO_PUBLIC_FOOBOW_DEV_TOKEN`, 5s timeout, every failure resolves to `{ ok: false }`), `src/types/api.ts` snake_case DTOs, and `src/services/mappers.ts` (DTO→view-model mapping with lat/lng→canvas projection and moderation filtering). Deed/map/community controllers hydrate from the API with bundled offline fallback; check-ins, deed completions, and blessings post fire-and-forget.
- Deleted dead `apps/mobile/src/foobowData.ts` and repointed `scripts/verify-shared-catalog.mjs` at `src/services/foobowService.ts`, which now holds the single mobile copy of the shared catalog sample data.
- Verified end-to-end against the running contract runtime on `:8787`: GET deed-types/map-spots/blessings return items; POST checkins/deed-actions/blessings return 201 with the dev bearer token. Added a root contract test for the mobile service layer (root suite now 26 tests).

## 2026-07-23 (overnight autonomous session)

- CI failed after the refactor push on the security audit gates (new upstream advisories since the last green run on 2026-06-12). Fixed API advisories via non-breaking `npm audit fix` (0 vulnerabilities now) and mobile high advisories the same way (`brace-expansion` 5.0.7, `js-yaml` 4.3.0, `shell-quote` 1.10.0); only the accepted moderate Expo `uuid` chain remains. Note: local npm advisory data lagged CI's — always treat CI as the audit source of truth.
- Moved the resolved Prisma/`@hono/node-server` advisory to a Resolved section in the watchlist doc and updated its verification script.
- Implemented dark mode: new `src/theme/ThemeContext.tsx` (`ThemeProvider` + `useThemeColors` driven by `useColorScheme`), converted all 10 view components and App shell off hardcoded `colors.light`; status bar flips with the scheme. The dark palette already existed in `theme.ts`.
- Implemented local persistence with `@react-native-async-storage/async-storage` 2.2.0 (installed via `npx expo install`): `src/services/storageService.ts` provides versioned keys, best-effort JSON storage, `clearStoredProfile`, and a `usePersistentState` hook that hydrates before it ever writes. Karma, streak, journal, quiet mode, private journal, and senior mode now survive restarts, honoring the "stored locally on your device" promise in the Profile UI.
- Node 20.19.4 is now installed via nvm-windows (`nvm install 20.19.4`) at `C:\Users\crane\AppData\Local\nvm\v20.19.4`; Prisma and Expo tooling run against it by prepending it to PATH. The machine default is still 20.17.0 — switching requires an elevated `nvm use 20.19.4`.

- Implemented mobile localization per `docs/localization-workflow.md` using `expo-localization` + `i18n-js` (standard Expo stack): `src/i18n/translations.ts` holds grouped stable keys for `en` and `zh-Hans` (ported from the prototype dictionary plus new mobile strings), `src/i18n/LocaleContext.tsx` resolves device locale with a persisted System/English/中文 override, and the Profile screen gained a language selector. All components now render through `t()`; accessibility labels are translated alongside visible labels.
- CI `npm ci` failed after the audit fix because the mobile lockfile lost the `react-native-worklets` entry; re-synced with `npm install` and validated all three lockfiles with `npm ci --dry-run`. Lesson: after any `npm audit fix`, validate lockfiles the same way CI installs them.

## Working Principles

- Use ODD to keep development tied to product objects and user-visible value.
- Prefer reusable patterns from proven products before inventing custom behavior.
- Keep docs updated with each meaningful project change.
- Maintain automated checks for docs, prototype smoke behavior, and PA readiness.
- Treat virtual karma as symbolic comfort; keep verified donations transparent and separate.
