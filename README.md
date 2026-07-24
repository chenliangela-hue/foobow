# Foobow

Foobow is a mobile-first concept for a virtual good karma app. Users explore the world through a map, complete small symbolic good deeds, build a gentle daily ritual, socialize through low-pressure kindness, and optionally support verified real-world causes.

The first deliverable in this repository is intentionally product-led:

- A feature/component design spec.
- User stories for the main product roles.
- Reference-product notes from map, wellness, charity, cleanup, and social-good apps.
- A clickable static prototype that shows the expected product shape.

## Landing page and prototype

The deployed site (foobow.com) is now a marketing landing page plus the app:

```text
prototype/index.html          # Foobow · 福报 landing page (foobow.com/)
prototype/app/index.html      # the clickable app (foobow.com/app/)
prototype/admin/index.html    # the admin management console (foobow.com/admin/)
```

The **admin console** (`prototype/admin/`) is a bilingual (中文/English) dark-themed management dashboard matching the product's back-office needs: a data board (support received, users, support records), order review with approve/reject, users, pricing, and an audit log. It reads live figures from the admin API when configured in Settings, and otherwise shows clearly-labelled demo data. It is `noindex` and, in production, is gated by backend admin accounts; money is always transparent donations and voluntary support — never "buying luck".

The **landing** (`prototype/index.html` + `landing.css` + `landing.js` + `landing.i18n.js`) is a calm, cinematic 福报-themed page: brand lockup, the couplet tagline 积善德，得福报；种善因，收福果, a rotating blessing from fifteen Buddhist couplets, five grouped "gates of kindness", and full localization in English, 简体中文, Français, Español, ไทย, and 日本語.

The **app** (`prototype/app/`) includes:

- Today check-in and recommended deed.
- Map-first exploration surface.
- Virtual deed catalog.
- Anonymous blessing wall.
- Profile, impact, badges, donation prompt, language toggle, and dark/light mode.

## Mobile App

The Expo/React Native MVP scaffold lives in:

```text
apps/mobile
```

Useful commands:

```text
npm --prefix apps/mobile run start
npm run test:mobile
```

The mobile shell currently ports the prototype's core flows: Today, Map, Deeds, Community, Profile, category filters, symbolic karma, safe donation copy, privacy settings, and low-pressure blessing interactions. Expo Router is installed and the tab routes live under `apps/mobile/app/(tabs)`.

The app follows an MVC-style modular architecture under `apps/mobile/src`:

- `theme/` — zen design tokens (light and dark palettes) and a `ThemeProvider` that follows the system color scheme.
- `i18n/` — `en` and `zh-Hans` string catalogs with a device-driven locale and a persisted in-app language override.
- `types/` — view models plus snake_case wire DTOs mirroring the OpenAPI contract.
- `services/` — typed API client (env-driven base URL, offline fallback to bundled sample data), DTO mappers, and AsyncStorage persistence.
- `controllers/` — hook-based controllers that hydrate from the API and keep view components presentation-only.
- `components/` — per-screen view components with 48dp+ touch targets and an optional senior high-readability mode.

Configure the API endpoint with `EXPO_PUBLIC_API_URL` (defaults to `http://localhost:8787`); authed dev writes use the optional `EXPO_PUBLIC_FOOBOW_DEV_TOKEN`. See `.env.example`.

## API App

The API scaffold lives in:

```text
apps/api
```

Useful commands:

```text
npm --prefix apps/api run start
npm --prefix apps/api run start:nest
npm run test:api
```

`start` runs the proven dependency-light contract runtime. `start:nest` runs the typed NestJS production scaffold selected in ADR 002.

## Product Direction

Foobow should feel calm, premium, emotionally warm, and trustworthy. It should avoid casino-style gamification or claims that users can buy luck, virtue, or karma. Virtual actions provide symbolic comfort; verified donations and sponsored campaigns are clearly labeled as real-world impact.

## Docs

- [Product Spec](docs/product-spec.md)
- [User Stories](docs/user-stories.md)
- [Reference Products](docs/reference-products.md)
- [ODD Spec](docs/odd-spec.md)
- [Database Structure](docs/database-structure.md)
- [API Interface](docs/api-interface.md)
- [OpenAPI Contract](docs/openapi.json)
- [Project Plan](docs/project-plan.md)
- [Task Board](docs/task-board.md)
- [Sprint Audit And Next Plan](docs/sprint-audit-and-next-plan.md)
- [Calm Ritual Feature Spec](docs/calm-ritual-feature-spec.md)
- [Acceptance Criteria](docs/acceptance-criteria.md)
- [Test Report](docs/test-report.md)
- [PA Audit 2026-06-07](docs/pa-audit-2026-06-07.md)
- [ADR 001 Mobile Stack](docs/adr-001-mobile-stack.md)
- [ADR 002 Backend Stack](docs/adr-002-backend-stack.md)
- [Auth Strategy](docs/auth-strategy.md)
- [Map Provider Decision](docs/map-provider-decision.md)
- [Localization Workflow](docs/localization-workflow.md)
- [Mobile Release Checklist](docs/mobile-release-checklist.md)
- [Node Readiness](docs/node-readiness.md)
- [Plugin And AI Orchestration](docs/plugin-and-ai-orchestration.md)
- [Shared Catalog Contract](docs/shared-catalog-contract.md)
- [External Service Resources](docs/external-service-resources.md)
- [Provider CLI Setup Plan](docs/provider-cli-setup-plan.md)
- [Dependency Advisory Watchlist](docs/dependency-advisory-watchlist.md)
- [Deployment](docs/deployment.md)
- [Payments Roadmap](docs/payments-roadmap.md)
- [AI Blessings (provider-agnostic)](docs/ai-blessings.md)
- [Memory](memory.md)

## Verification

Run all current checks:

```text
npm test
```

The current test suite uses only built-in Node.js modules and covers:

- Unit checks for required product components and documentation links.
- Smoke checks for prototype JavaScript syntax and static HTTP serving.
- PA checks for baseline accessibility, privacy, moderation, and donation safety wording.

Additional gates:

```text
npm run test:mobile
npm run test:api
npm run test:browser
npm run test:visual
npm run test:advisories
```
