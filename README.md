# Foobow

Foobow is a mobile-first concept for a virtual good karma app. Users explore the world through a map, complete small symbolic good deeds, build a gentle daily ritual, socialize through low-pressure kindness, and optionally support verified real-world causes.

The first deliverable in this repository is intentionally product-led:

- A feature/component design spec.
- User stories for the main product roles.
- Reference-product notes from map, wellness, charity, cleanup, and social-good apps.
- A clickable static prototype that shows the expected product shape.

## Prototype

Open the prototype directly in a browser:

```text
prototype/index.html
```

The prototype includes:

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

The mobile shell currently ports the prototype's core flows: Today, Map, Deeds, Community, Profile, category filters, symbolic karma, safe donation copy, privacy settings, and low-pressure blessing interactions.

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
- [Acceptance Criteria](docs/acceptance-criteria.md)
- [Test Report](docs/test-report.md)
- [ADR 001 Mobile Stack](docs/adr-001-mobile-stack.md)
- [ADR 002 Backend Stack](docs/adr-002-backend-stack.md)
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
```
