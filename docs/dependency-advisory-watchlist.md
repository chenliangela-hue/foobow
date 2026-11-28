# Dependency Advisory Watchlist

## Purpose

Foobow fails CI on high and critical dependency advisories. Moderate transitive advisories are tracked here so they stay visible without forcing unsafe dependency downgrades.

## Current Policy

- Run `npm run test:security` before push.
- Treat high or critical advisories as blockers.
- Prefer raising the dependency's version floor in `package.json` over running `npm audit fix` in `apps/mobile`. On the Expo dependency tree, `npm audit fix` has repeatedly written an incomplete lockfile (dropping nested optional-peer entries such as `react-native-worklets`) that passes a local `npm ci --dry-run` but fails CI's `npm ci`. Raising the floor makes a clean `npm install` resolve the patched version deterministically.
- After any dependency change in `apps/mobile`, regenerate the lockfile from a clean state (`rm -rf node_modules package-lock.json && npm install`) rather than patching it in place.
- Track moderate advisories when the available automated fix would downgrade major framework/runtime packages or break the selected stack.
- Do not run `npm audit fix --force` unless a maintainer has reviewed the dependency graph and verified the resulting package versions still match the project architecture.

## Active Blocking Advisories

The Expo SDK 58 lockfile reports zero high and critical findings. Expo Router 58 removes the vulnerable query-decoder dependency chain tracked in [issue #3](https://github.com/chenliangela-hue/foobow/issues/3). Expo compatibility checks use Node 24, while the existing web and API checks retain their pinned runtime.

## Active Moderate Advisories

The SDK 58 lockfile reports moderate findings in Expo fingerprint tooling through `minimatch` and in Clerk’s transitive wallet dependencies through `stream-json` and `uuid`. The audit tool proposes incompatible direct dependency changes. Review patched upstream releases rather than applying its forced downgrade suggestions. Foobow does not expose wallet functionality.

## Resolved Advisories

The November 27 mobile manifest raises the floors for `compression`, `node-forge`, `shell-quote`, and `source-map-js`. It also scopes patched Zod 4 to Expo CLI. The SDK 58 follow-up removes the remaining high findings by upgrading Expo Router.

| Area | Package Path | Advisory | Resolution |
| --- | --- | --- | --- |
| API tooling | `prisma -> @prisma/dev -> @hono/node-server` | `@hono/node-server` repeated-slash `serveStatic` middleware bypass | Resolved 2026-07-23 by non-breaking `npm audit fix` in `apps/api`; Prisma stayed on the 7.x line and the API audit reports 0 vulnerabilities |
| API tooling | `prisma -> @prisma/dev -> find-my-way` | `find-my-way` HTTP/2 DoS (GHSA-c96f-x56v-gq3h) | Resolved 2026-07-23 by pinning `find-my-way ^9.7.0` via an `overrides` entry in `apps/api/package.json` (audit fix could not resolve within Prisma's range); only affects Prisma dev tooling, not runtime; Prisma generate + API tests still pass |
| API tooling | `@nestjs/swagger -> js-yaml` | `js-yaml` flow-collection DoS (GHSA-pm4m-ph32-ghv5) | Resolved 2026-07-24 by pinning `js-yaml ^5.2.2` via `overrides` in `apps/api/package.json` (audit fix could not move Swagger's pinned version); API audit clean, Prisma generate + typecheck + tests pass |
| API runtime | `express -> proxy-addr` | IPv4-mapped IPv6 trust-subnet IP spoofing (`GHSA-jqcg-44mw-7w3h`) | Resolved 2026-10-18 by updating `proxy-addr` from 2.0.7 to 2.0.8; API audit and typecheck pass |
| API tooling | `@nestjs/swagger -> js-yaml` | Merge-key CPU exhaustion (`GHSA-r3ph-w7gj-g6xm`) | Resolved 2026-10-18 by updating `js-yaml` from 5.2.2 to 5.5.0 and `argparse` from 2.0.1 to 3.0.3; API audit and typecheck pass |

## Acceptance Rule

The Foobow acceptance gate remains:

```text
npm run test:security
```

This runs high/critical audit gates for the root, API, and mobile packages. The moderate advisories above stay tracked. Reassess their reachability before enabling related features and review compatible upstream updates. Active high or critical advisories remain release blockers even while their product track is deferred; they are not suppressed or downgraded in CI.

## Next Review

- Re-run full audits after each Expo SDK or Prisma update.
- Remove an advisory from this watchlist after the package lock no longer reports it.
- Promote any advisory to blocker status if it becomes runtime-exploitable in Foobow's API/mobile surfaces.
