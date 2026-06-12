# Provider CLI Setup Plan

This plan is ready for when credentials are available. It does not require or contain secrets.

## Current Position

Foobow can continue local product and API work with Docker Postgres and placeholder public mobile keys. Real provider-backed flows should wait until the required account inputs are available and local Node is standardized.

## Required Inputs

- Supabase: access token, organization, region, database password, project names.
- Clerk: app or account access, publishable key, secret key, issuer URL, redirect/deep-link scheme.
- Maps: default to OpenStreetMap-derived tiles with MapLibre/Leaflet and visible attribution. Mapbox is optional later if paid/premium styling is approved.
- Stripe: optional test-mode account, products/prices, webhook endpoint decision.

## Setup Order

1. Standardize Node: install/use Node `20.19.4+`, or run Prisma commands through the bundled Node 24 runtime.
2. Verify local baseline: `npm test`, `npm run test:env`, `npm run test:mobile`.
3. Supabase dev project: create/link project, set `DATABASE_URL`, apply SQL migrations and seed data.
4. Clerk dev app: configure email/Google/Apple login choices, issuer URL, and mobile redirect scheme.
5. Maps: start with the keyless OSM/MapLibre path. If production traffic grows, choose a hosted OSM-derived tile provider or self-host tiles. Mapbox remains optional.
6. Stripe test mode: defer until donation checkout is implemented; keep symbolic karma separate from payment.
7. Provider-backed PA: run authenticated mobile-to-API-to-database smoke tests before expanding browser PA.

## CLI Notes

Use dashboards when a CLI needs interactive billing, organization, or legal steps. Use CLI only for repeatable project setup and checks after the account exists.

Recommended future commands, after credentials are available:

```text
supabase projects list
supabase link --project-ref <project-ref>
supabase db push
```

Clerk can start from the dashboard for MVP. Maps do not need a CLI for the default OSM/MapLibre path. Stripe CLI becomes useful once webhook verification exists.

## QA Gate

Provider-backed flows are not accepted until:

- Authenticated user can sign in through Clerk.
- API can verify the session server-side.
- Deed completion persists to Supabase/Postgres.
- Map surface loads with the configured OSM/MapLibre tile source and visible attribution.
- Donation copy still says payment does not buy luck, virtue, or guaranteed karma.
- Browser PA and mobile typecheck pass after provider-backed config is present.
