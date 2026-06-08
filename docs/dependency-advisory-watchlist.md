# Dependency Advisory Watchlist

## Purpose

Foobow fails CI on high and critical dependency advisories. Moderate transitive advisories are tracked here so they stay visible without forcing unsafe dependency downgrades.

## Current Policy

- Run `npm run test:security` before push.
- Treat high or critical advisories as blockers.
- Track moderate advisories when the available automated fix would downgrade major framework/runtime packages or break the selected stack.
- Do not run `npm audit fix --force` unless a maintainer has reviewed the dependency graph and verified the resulting package versions still match the project architecture.

## Active Moderate Advisories

| Area | Package Path | Advisory | Current Decision | Review Trigger |
| --- | --- | --- | --- | --- |
| API tooling | `prisma -> @prisma/dev -> @hono/node-server` | `@hono/node-server` repeated-slash `serveStatic` middleware bypass | Monitor Prisma upstream; current force fix would downgrade Prisma from 7.x to 6.x and break the selected Prisma 7 path | Re-check when Prisma publishes a compatible patched chain |
| Mobile tooling | `expo -> @expo/cli -> @expo/config-plugins -> xcode -> uuid` | `uuid` buffer bounds issue for v3/v5/v6 with explicit buffer use | Monitor Expo SDK upstream; current force fix would downgrade Expo to an incompatible old version | Re-check when Expo SDK updates its transitive dependency chain |

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
