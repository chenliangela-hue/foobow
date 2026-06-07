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

## Working Principles

- Use ODD to keep development tied to product objects and user-visible value.
- Prefer reusable patterns from proven products before inventing custom behavior.
- Keep docs updated with each meaningful project change.
- Maintain automated checks for docs, prototype smoke behavior, and PA readiness.
- Treat virtual karma as symbolic comfort; keep verified donations transparent and separate.
