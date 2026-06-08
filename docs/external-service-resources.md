# External Service Resources

## What Is Actually Required Now

Foobow does not need every SaaS account on day one. The mobile MVP only needs enough infrastructure for accounts, an API database, and maps.

| Tier | Capability | Service | Required Now | Why |
| --- | --- | --- | --- | --- |
| Core MVP | Database | Supabase Postgres or local Docker Postgres | Yes | Stores users, check-ins, deeds, blessings, donations, and moderation records |
| Core MVP | Authentication | Clerk | Yes | Handles sign-in, account security, MFA/passkeys later, and hosted account UX |
| Core MVP | Maps | Mapbox | Yes | Gives the mobile app a premium world-map surface and layer control |
| Local dev | API guard token | Your own random string | Yes | Lets local/mobile smoke flows call protected development endpoints |
| Donation mode | Payments | Stripe | Optional | Only needed when donation/subscription checkout is tested |
| Deployment | Web/API preview | Vercel or container host | Deferred | Only needed when publishing previews or production environments |
| Operations | Errors | Sentry | Deferred | Add before beta testers or production traffic |
| Operations | Analytics | PostHog | Deferred | Add after privacy events and consent requirements are finalized |
| Builds | Mobile cloud builds | Expo/EAS | Deferred | Add when App Store / Google Play builds begin |
| Email | Transactional email | None for MVP | Deferred | Clerk sends account emails; Stripe sends receipts when payments are enabled |

No email API key is required for the initial MVP. Do not create Resend, SendGrid, Mailgun, or SES keys until Foobow owns direct outbound email such as newsletters, admin notices, or custom receipts.

## Mobile Environment Rule

Expo embeds any variable prefixed with `EXPO_PUBLIC_` into the app bundle. Treat those values as public because users can inspect them from a built mobile app.

Safe in `EXPO_PUBLIC_*`:

- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_MAPBOX_TOKEN`
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`, only when donation mode starts
- `EXPO_PUBLIC_SENTRY_DSN_MOBILE`, later
- `EXPO_PUBLIC_POSTHOG_KEY`, later

Never put these in `EXPO_PUBLIC_*`:

- `CLERK_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- Supabase service-role keys
- Database passwords or connection strings
- CI/deployment tokens such as `EXPO_TOKEN` or `VERCEL_TOKEN`

## Environment Files

- `.env.example`: tracked source-of-truth template for the repo.
- `.env.local`: ignored local file for real values on this machine.
- `apps/api/.env.example`: API-specific local template for the Nest/API package.

Never commit real secret values.

## Required MVP Keys

### Database

`DATABASE_URL`

What it is: the PostgreSQL connection string used by the API and Prisma.

How to get it:

1. For local development, use the value already in `.env.example` and start the local database with `docker compose up -d foobow-postgres`.
2. For Supabase, create a Supabase project.
3. Open Supabase dashboard: Project Settings > Database.
4. Copy the connection string.
5. Replace the password placeholder with the database password you set.

Mobile note: this is server-only. The Expo app must never receive `DATABASE_URL`.

### API URL

`EXPO_PUBLIC_API_URL`

What it is: the public URL the mobile app calls for Foobow API requests.

How to get it:

1. Local development usually uses `http://localhost:8787`.
2. On a physical phone, replace localhost with your computer LAN IP, for example `http://192.168.1.20:8787`.
3. In preview/production, replace it with the deployed API URL.

Mobile note: this is intentionally public.

### Local API Guard

`FOOBOW_DEV_BEARER_TOKEN`

What it is: a local development bearer token for protected API smoke flows.

How to get it:

1. Make up a long random string for local development.
2. Put the same value in the API runtime env.
3. When testing manually, send it as `Authorization: Bearer <value>`.

Provider note: this is not an external API key.

### Clerk

`EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`

What it is: the mobile-safe Clerk key used by the Expo app.

How to get it:

1. Create or open a Clerk app.
2. Open Configure > API Keys.
3. Copy the publishable key for the environment.
4. Use the Expo-specific env name shown in Clerk docs.

`CLERK_SECRET_KEY`

What it is: the server-side Clerk key used by the API for token/user verification.

How to get it:

1. In the same Clerk dashboard, copy the secret key from API Keys.
2. Store it only in `.env.local`, API hosting env vars, or CI secrets.

Mobile note: only the publishable key belongs in the app. The secret key is server-only.

### Auth Settings

`AUTH_PROVIDER`

Recommended value: `clerk`.

`AUTH_ISSUER_URL`

What it is: the Clerk issuer URL used by the API when validating tokens.

How to get it:

1. Open Clerk dashboard.
2. Use the issuer/domain value from JWT/session token configuration.
3. Keep the placeholder until real token validation is wired.

`AUTH_AUDIENCE`

Recommended value: `foobow-api`.

Provider note: these are configuration values, not billing-provider API keys.

### Mapbox

`EXPO_PUBLIC_MAPBOX_TOKEN`

What it is: the public token used by the mobile map SDK to load maps, styles, and tiles.

How to get it:

1. Create or open a Mapbox account.
2. Open Access Tokens.
3. Start with the default public token or create a new public token for Foobow development.
4. Keep only the scopes needed for public map display.
5. Later, restrict the token by mobile app identifiers and production domains.

Mobile note: this token is public. Use restrictions and least-privilege scopes instead of treating it as a secret.

## Optional Donation Mode

Only add these when the donation/subscription flow is actively being tested.

`EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`

What it is: the mobile-safe Stripe key used to initialize checkout/payment UI.

How to get it:

1. Open Stripe Dashboard in test mode.
2. Go to Developers > API keys.
3. Copy the publishable key.

`STRIPE_SECRET_KEY`

What it is: the server-only key used by the API to create checkout sessions, payment intents, or subscription sessions.

How to get it:

1. In Stripe Dashboard test mode, go to Developers > API keys.
2. Copy the secret key.
3. Store it only in server env or CI/deployment secrets.

`STRIPE_WEBHOOK_SECRET`

What it is: the server-only signing secret for verifying Stripe webhook events.

When to get it: after a real webhook endpoint exists.

## Deferred Keys

`SENTRY_DSN`

Server error tracking. Add before beta/production.

`EXPO_PUBLIC_SENTRY_DSN_MOBILE`

Mobile error tracking DSN. Safe to expose, but still deferred.

`POSTHOG_KEY` and `EXPO_PUBLIC_POSTHOG_KEY`

Analytics and feature flags. Defer until privacy copy, consent, and event taxonomy are ready.

`EXPO_TOKEN`

Expo/EAS automation token. Only needed for cloud builds and app-store release pipelines.

`VERCEL_TOKEN`

Vercel automation token. Only needed if CI/CD deploys previews or production through Vercel.

## CLI Status On This Machine

| CLI | Current Status | Next Action |
| --- | --- | --- |
| GitHub CLI | Installed | Use for repo/CI/secrets after approval layer permits remote calls |
| Supabase CLI | Installed | Can link/create/manage once `SUPABASE_ACCESS_TOKEN`, org, region, and DB password are known |
| Vercel CLI | Installed but previously blocked in sandbox by local Node realpath permissions | Retry with elevated shell or bundled Node when deployment work starts |
| Clerk CLI | Not installed | Dashboard is enough for MVP; install only if automation becomes useful |
| Expo/EAS CLI | Not confirmed | Install/use when mobile cloud build setup starts |
| Stripe CLI | Not confirmed | Install/use when webhook/payment implementation starts |
| Sentry CLI | Not confirmed | Install/use when release/source-map upload starts |

## Inputs Needed Before Creating Real Resources

Required first:

- App/domain decision: `foobow.com`, API subdomain, and whether this repo owns DNS/deployments.
- Primary region/data residency: North America, EU, or another region.
- Environment model: development + production, or development + staging + production.
- Billing owner/account for paid services.

For Supabase:

- Supabase org ID or confirmation to create under the default org.
- Region.
- Database password.
- Project names, recommended: `foobow-dev` and `foobow-prod`.

For Clerk:

- Permission to create/use a Clerk app under your Clerk account.
- Login providers: email code, Google, Apple, or another set.
- Mobile redirect/deep-link scheme, recommended draft: `foobow://`.

For Mapbox:

- Mapbox account access.
- Whether to start with Mapbox Standard or a custom calm Foobow style.
- Mobile app identifiers for token restrictions later.

For Stripe, only if donation mode starts now:

- Stripe account access.
- One-time donations, fixed donation products, subscriptions, or all of them.
- Test-mode product/price names.
- Legal/business details handled in Stripe dashboard.

## Proposed Setup Order

1. Run locally with Docker Postgres and placeholder Clerk/Mapbox values while UI/API wiring continues.
2. Create Supabase development project and replace `DATABASE_URL`.
3. Create Clerk development app and add Clerk keys.
4. Create Mapbox development token and add mobile token restrictions later.
5. Add Stripe test keys only when the donation flow needs real checkout.
6. Add Vercel, Sentry, PostHog, and Expo/EAS tokens only when deployment, telemetry, and build automation become active.

## Current Recommendation

Keep the MVP env small:

- Required now: Supabase/local Postgres, Clerk, Mapbox, local API token.
- Optional now: Stripe test keys if we want to validate donation checkout.
- Not needed now: email provider, Sentry, PostHog, Vercel token, Expo token.

This keeps Foobow beginner-friendly while preserving a production path for payments, observability, deployments, and mobile releases.
