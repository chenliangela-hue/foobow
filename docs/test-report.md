# Foobow Test Report

## 2026-06-06

Latest aggregate command:

```text
npm run test:all
```

Result:

- Passed on 2026-06-07 after fixing Claude Code settings, mobile dependency resolution, and PA layout issues.
- Covered root contract/static checks, API runtime tests and NestJS typecheck, mobile TypeScript typecheck, browser PA checks, visual regression checks, and high/critical security audits.
- Mobile audit still reports moderate Expo-template transitive advisories; high/critical audit gate passes and the force fix would downgrade Expo.
- `npm --prefix apps/mobile ci` did not complete within the local 3-minute command timeout, but the dependency graph now resolves `react-dom@19.2.3` with `react` peer `^19.2.3`, and mobile typecheck passes. CI should run on the configured Node `20.19.4` environment.

### Automated Checks

Command:

```text
npm test
```

Result:

- 16 tests passed.
- Unit checks passed.
- Smoke checks passed.
- PA checklist checks passed.
- API contract checks passed.
- Database migration/seed contract checks passed.
- Prisma schema contract checks passed.

API runtime check:

```text
npm run test:api
```

Result:

- 18 tests passed.
- Covers health, auth guard, `/me` account shape, deed catalog filtering, map spot category/region filtering, daily check-in recommendations, duplicate check-in conflict, deed completion karma, blessing creation/listing, OpenAPI-aligned validation, report creation, verified campaign listing, donation idempotency, unverified campaign rejection, standard error request IDs, NestJS scaffold structure, and TypeScript typecheck.

Additional syntax checks:

```text
node --check prototype/data.js
node --check prototype/app.js
```

Result:

- Both JavaScript files passed syntax validation.

Mobile app check:

```text
npm run test:mobile
```

Result:

- Expo TypeScript app shell passed `tsc --noEmit`.
- Root tests now include an Expo Router route-structure check.
- Local execution needed sandbox escalation for the same Node profile-path restriction that affects Playwright.

Security audit:

```text
npm audit --audit-level=high
npm --prefix apps/api audit --audit-level=high
npm --prefix apps/mobile audit --audit-level=high
```

Result:

- Root audit found 0 vulnerabilities.
- API audit found 0 vulnerabilities after adding the NestJS scaffold dependencies.
- Mobile high/critical audit passed.
- Mobile audit still reports 10 moderate Expo-template transitive advisories through `uuid`/Expo config tooling; the suggested force fix would downgrade Expo and is not safe for the SDK 56 scaffold.
- After adding the convenience `test:security` script and CI audit step, local rerun was blocked by Codex escalation usage limits. The underlying individual audit commands had already passed at the high/critical threshold.

### Browser PA Pass

Tool:

- Playwright browser runner loaded `file:///D:/code/projects/mobileapp/gooddeed/prototype/index.html`.
- Automated Playwright tests in `tests/browser/foobow.pa.spec.mjs`.

Validated:

- Prototype title and Foobow heading render.
- Mobile viewport `390x844` loads.
- Mood check-in updates recommended deed.
- Daily completion updates karma and streak state.
- Map pin selection updates selected spot details.
- Deed selection updates ritual preview.
- Ritual action updates symbolic karma.
- Blessing form creates a new blessing.
- Blessing report action changes to reported/disabled state.
- Profile screen exposes export and delete local data controls.
- Donation dialog opens and includes safe wording that payment does not buy luck, virtue, or guaranteed karma.
- Dark mode toggles.
- Language toggle sets `html.lang = zh-Hans`.
- Prototype state persists to `localStorage`.
- `npm run test:browser` passed 10/10 checks across mobile Chromium and desktop Chromium.
- Added automated checks for map/deed category filters, keyboard traversal, keyboard deed-card activation, and WCAG 4.5:1 contrast on core design tokens.

### Visual Regression

Command:

```text
npm run test:visual
```

Result:

- Added Playwright screenshot baselines for Today, Map/Environment, and dark-mode Community states.
- Coverage runs across mobile Chromium and desktop Chromium through the shared Playwright projects.
- CI runs visual regression on `windows-latest` so the committed `win32` Playwright snapshots are compared on the same platform family.
- Refreshed baselines after PA layout fixes for mobile nav/content overlap, Community clipping/list coverage, Map bottom spacing, and desktop Today vertical density.

### Manual PA Audit

Artifact:

- [`pa-audit-2026-06-07.md`](pa-audit-2026-06-07.md)

Result:

- Found P1 mobile layout regressions not caught by automated assertions: bottom nav overlaps the Today CTA, and Community headings clip on mobile/desktop.
- Fixed the recorded P1/P2 layout findings and refreshed visual baselines from inspected Playwright screenshots.

Known Limits:

- Browser PA is now automated with Playwright in `tests/browser/foobow.pa.spec.mjs`.
- In the local Codex sandbox, Playwright CLI needs escalated execution because Node cannot `lstat` `C:\Users\crane` inside the restricted filesystem sandbox. GitHub Actions should run normally through the CI workflow.
- On 2026-06-06, further escalated reruns were blocked by Codex usage limits after the latest docs/script updates.
- Full visual regression now runs in `npm run test:all`.
