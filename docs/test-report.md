# Foobow Test Report

## 2026-06-06

### Automated Checks

Command:

```text
npm test
```

Result:

- 14 tests passed.
- Unit checks passed.
- Smoke checks passed.
- PA checklist checks passed.
- API contract checks passed.
- Database migration/seed contract checks passed.

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
- Local execution needed sandbox escalation for the same Node profile-path restriction that affects Playwright.

Security audit:

```text
npm audit --audit-level=high
npm --prefix apps/mobile audit --audit-level=high
```

Result:

- Root audit found 0 vulnerabilities.
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

Known Limits:

- Browser PA is now automated with Playwright in `tests/browser/foobow.pa.spec.mjs`.
- In the local Codex sandbox, Playwright CLI needs escalated execution because Node cannot `lstat` `C:\Users\crane` inside the restricted filesystem sandbox. GitHub Actions should run normally through the CI workflow.
- On 2026-06-06, further escalated reruns were blocked by Codex usage limits after the latest docs/script updates.
- Full visual regression remains future work.
