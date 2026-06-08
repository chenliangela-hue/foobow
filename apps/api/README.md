# Foobow API Runtime

This package contains two backend surfaces:

- `src/server.mjs`: the dependency-light executable scaffold for contract validation.
- `src/nest`: the typed NestJS production backend target selected in ADR 002.

The in-memory runtime remains the fast contract harness while the NestJS app becomes the production implementation path.

## Run

```text
npm --prefix apps/api start
```

Default local URL:

```text
http://127.0.0.1:8787
```

## Test

```text
npm --prefix apps/api test
```

Typecheck only:

```text
npm --prefix apps/api run typecheck
```

Run the NestJS scaffold:

```text
npm --prefix apps/api run start:nest
```

Run the database-backed integration gate:

```text
docker compose up -d foobow-postgres
npm --prefix apps/api run test:db-integration
```

The integration gate runs the Prisma service write-path smoke and the Nest HTTP DB smoke against `DATABASE_URL`.

## Scope

- In-memory sample data only.
- No production authentication, persistence, payment provider, moderation queue, or rate limiter yet.
- Public response shape follows `docs/api-interface.md` and `docs/openapi.json`.
- Donation creation enforces verified campaigns and idempotency-key behavior so payment safety rules are testable early.
- NestJS DTOs, guarded routes, and Swagger setup mirror the current runtime contract.
- `prisma/schema.prisma` mirrors the current SQL migration draft and preserves opaque public IDs plus donation idempotency.
- Prisma CLI 7 migration generation waits for local Node `20.19+`; current local Node was `20.17.0` during scaffold work.
- `test:db-integration` is the local/CI acceptance command for database-backed API behavior after schema and seed are applied.
