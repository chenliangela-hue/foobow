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

## Developer Setup

Use one of these approaches:

- nvm-windows: install and use `20.19.4`.
- Volta: pin Node `20.19.4` if adopted later.
- GitHub Actions: already uses `20.19.4`.

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

## Blocked Until Fixed

- Prisma migration generation through Prisma CLI 7.
- Reliable local `npm ci` timing for the mobile app.
- Any backend slice that requires generated Prisma Client output.
