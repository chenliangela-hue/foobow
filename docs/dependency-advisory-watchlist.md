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

## Active Moderate Advisories

| Area | Package Path | Advisory | Current Decision | Review Trigger |
| --- | --- | --- | --- | --- |
| Mobile tooling | `expo -> @expo/cli -> @expo/config-plugins -> xcode -> uuid` | `uuid` buffer bounds issue for v3/v5/v6 with explicit buffer use | Monitor Expo SDK upstream; current force fix would downgrade Expo to an incompatible old version | Re-check when Expo SDK updates its transitive dependency chain |

## Resolved Advisories

| Area | Package Path | Advisory | Resolution |
| --- | --- | --- | --- |
| API tooling | `prisma -> @prisma/dev -> @hono/node-server` | `@hono/node-server` repeated-slash `serveStatic` middleware bypass | Resolved 2026-07-23 by non-breaking `npm audit fix` in `apps/api`; Prisma stayed on the 7.x line and the API audit reports 0 vulnerabilities |

## Acceptance Rule

The current Foobow acceptance gate is:

```text
npm run test:security
```

This runs high/critical audit gates for the root, API, and mobile packages. The moderate advisories above are allowed only while they remain transitive tooling issues and while the documented force fixes would break the selected stack.

## Next Review

- Re-run full audits after each Expo SDK or Prisma update.
- Remove an advisory from this watchlist after the package lock no longer reports it.
- Promote any advisory to blocker status if it becomes runtime-exploitable in Foobow's API/mobile surfaces.
