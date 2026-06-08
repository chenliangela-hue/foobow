# Foobow Node Readiness

## Objective

Make the runtime requirement explicit so local development, CI, Expo SDK 56, React Native 0.85, and Prisma 7 use the same baseline.

## Required Version

Foobow targets Node `20.19.4`.

The repository records this in:

- `.node-version`
- Root `package.json` engines
- `apps/api/package.json` engines
- `apps/mobile/package.json` engines
- GitHub Actions setup-node configuration

## Current Local Gap

The last verified local shell reported Node `20.17.0`. That version can run most current tests but is below the required range for Prisma CLI 7 and newer Expo/React Native tooling.

The Codex bundled runtime at `C:\Users\crane\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` was verified at Node `24.14.0` and can run Prisma commands if its directory is prepended to `PATH`.

## Developer Setup

Use one of these approaches:

- nvm-windows: install and use `20.19.4`.
- Volta: pin Node `20.19.4` if adopted later.
- GitHub Actions: already uses `20.19.4`.

## Local Database

Foobow includes a local PostgreSQL service in `docker-compose.yml`:

```text
docker compose up -d foobow-postgres
```

The matching development URL is:

```text
postgresql://foobow:foobow@localhost:55432/foobow?schema=public
```

Apply the current SQL schema and reference data:

```text
Get-Content database\migrations\0001_initial.sql -Raw | docker exec -i foobow-postgres psql -U foobow -d foobow
Get-Content database\seeds\0001_reference_data.sql -Raw | docker exec -i foobow-postgres psql -U foobow -d foobow
```

Confirm the seed covers the database-backed read paths:

```text
docker exec foobow-postgres psql -U foobow -d foobow -c "select 'deed_types' as table_name, count(*) from deed_types union all select 'map_spots', count(*) from map_spots union all select 'blessings', count(*) from blessings union all select 'donation_campaigns', count(*) from donation_campaigns order by table_name;"
```

## Verification

Run:

```text
node --version
npm run test:all
```

Expected:

- `node --version` is `v20.19.4` or newer within the supported engine range.
- `npm run test:all` passes.
- Prisma CLI generation can be attempted after the local version is upgraded.
- Alternative: Prisma CLI generation can be run with the bundled Node 24 runtime by prepending that runtime directory to `PATH`.

## Blocked Until Fixed

- Running Prisma commands directly through the default `node` on PATH.
- Reliable local `npm ci` timing for the mobile app.
- Database-backed write-path verification until a real PostgreSQL `DATABASE_URL` is provided.
