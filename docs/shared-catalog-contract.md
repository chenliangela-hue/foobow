# Shared Catalog Contract

Foobow uses `shared/foobow-catalog.json` as the canonical cross-surface catalog for product sample objects that appear in the prototype, mobile shell, API fixtures, and SQL seed data.

## Covered Objects

- Deed categories.
- MVP deed types.
- MVP map spots.
- Anonymous blessing examples.
- Verified donation campaign identifiers.

## Why This Exists

The app currently has several implementation surfaces:

- Static clickable prototype.
- Expo mobile shell.
- Dependency-light API runtime fixtures.
- Nest/Prisma backend target.
- PostgreSQL SQL seed data.

Those surfaces intentionally have different runtime formats, but their product objects should not drift. The catalog records the cross-surface identity map, such as:

- Prototype ID: `release-fish`.
- Public API ID: `deed_release_fish`.
- SQL seed slug: `release-fish`.

## Verification

Run:

```text
npm run test:catalog
```

The check validates that canonical deeds, map spots, blessings, and donation campaigns are present in the current prototype, mobile data, API fixtures, and SQL seed data.

`npm run test:all` also runs this catalog check.
