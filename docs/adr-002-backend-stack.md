# ADR 002: Backend Stack Direction

## Status

Accepted as the target direction for the production backend. The current `apps/api` runtime remains a dependency-light contract scaffold until this stack is installed.

## Context

Foobow needs an enterprise-grade backend for user profiles, daily rituals, map/deed discovery, anonymous social content, moderation, donations, subscriptions, privacy export/delete, and admin workflows. The backend must preserve a clear separation between symbolic virtual karma and verified real-world donation impact.

The first executable runtime intentionally uses Node's built-in HTTP server and test runner to validate the contract without adding framework risk. The next backend phase needs production structure, typed modules, OpenAPI documentation, validation, PostgreSQL persistence, and testable moderation/payment safety gates.

Current reference checks:

- Node's official HTTP docs document `http.createServer`, which is enough for the temporary scaffold.
- Node's official test runner supports native `node --test` discovery, which keeps the first backend tests dependency-light.
- OpenAPI describes paths as the container for supported API operations and responses, matching the contract-first docs in `docs/openapi.json`.
- NestJS provides official OpenAPI/Swagger integration through `@nestjs/swagger`, including generated JSON/YAML definitions.
- Prisma's official migration docs support PostgreSQL migration history and schema synchronization for app-owned relational models.

## Decision

Use this target production stack:

- NestJS with TypeScript for backend application structure.
- PostgreSQL as the primary data store.
- Prisma ORM and Prisma Migrate for application-owned tables and normal CRUD persistence.
- Versioned SQL migrations remain available for PostgreSQL-specific constraints, indexes, retention jobs, and future advanced database features that should not be hidden behind ORM abstractions.
- OpenAPI remains the public API contract. NestJS Swagger output must be checked against `docs/openapi.json` before replacing the current draft.

## Rationale

NestJS fits Foobow's expected module boundaries: auth/profile, daily ritual, deeds/map, community/moderation, donations, subscriptions, admin, and privacy. It gives stronger enterprise structure than a hand-rolled HTTP server while staying in the Node/TypeScript ecosystem already used by the prototype and mobile shell.

Prisma is a pragmatic first ORM for PostgreSQL-backed product data because it provides typed access and migration workflow. Foobow should still keep explicit SQL ownership for areas where correctness matters more than ORM convenience, such as partial indexes, donation idempotency constraints, retention/deletion behavior, and audit tables.

## Consequences

- `apps/api` should migrate from the current in-memory runtime to a NestJS app in a later slice.
- Route modules should mirror the product objects in `docs/odd-spec.md`.
- Donation APIs must keep idempotency and verified-campaign enforcement as hard tests.
- Moderation status must be enforced before public blessing/community data is returned.
- Auth, privacy, and data export/delete are required before any real user launch.
- The current runtime remains useful as a fast contract harness until the NestJS app reaches parity.

## Sources

- [Node.js HTTP documentation](https://nodejs.org/api/http.html)
- [Node.js test runner documentation](https://nodejs.org/download/release/v20.19.0/docs/api/test.html)
- [OpenAPI paths documentation](https://learn.openapis.org/specification/paths.html)
- [NestJS OpenAPI documentation](https://docs.nestjs.com/openapi/introduction)
- [Prisma Migrate documentation](https://www.prisma.io/docs/orm/prisma-migrate/getting-started)
