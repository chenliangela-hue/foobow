# External Service Resources

## Stack Decision

Foobow should use this MVP production stack:

| Capability | Recommended Service | Why |
| --- | --- | --- |
| Auth | Clerk | Fast Expo/mobile integration, social login, passkeys/MFA path, hosted account UX |
| Database | Supabase Postgres | Matches PostgreSQL/Prisma direction, managed backups, storage option |
| Static web/preview | Vercel | Strong preview workflow for prototype/marketing/docs and future web surface |
| API runtime | Container host first, Vercel only for preview/simple API | NestJS + Prisma + Postgres is more predictable on a long-running runtime than serverless |
| Payments | Stripe | Donations, subscriptions, receipts, webhook-driven payment confirmation |
| Maps | Mapbox | Premium mobile map styling and layer control |
| Errors | Sentry | Mobile and API crash/error monitoring |
| Analytics | PostHog | Product analytics, feature flags, privacy-aware anonymous tracking |
| Email | Resend | Transactional email for receipts, account notices, moderation/admin emails |

## Environment Files

- `.env.example`: tracked source-of-truth template.
- `.env.local`: local ignored placeholder for the user to fill.
- `apps/api/.env.example`: API-specific local example retained for the Nest/API package.

Never commit real secret values.

## CLI Status On This Machine

| CLI | Current Status | Next Action |
| --- | --- | --- |
| GitHub CLI | Installed | Use for repo/CI/secrets after approval layer permits remote calls |
| Supabase CLI | Installed | Can link/create/manage once `SUPABASE_ACCESS_TOKEN`, org, region, and DB password are known |
| Vercel CLI | Installed but blocked in sandbox by local Node realpath permissions | Retry with elevated shell or bundled Node when needed |
| Clerk CLI | Not installed | Use dashboard or install only if we decide Clerk CLI is required |
| Expo/EAS CLI | Not confirmed | Install/use when mobile build setup starts |
| Stripe CLI | Not confirmed | Install/use when webhook/payment implementation starts |
| Sentry CLI | Not confirmed | Install/use when release/source-map upload starts |

## Inputs Needed Before I Can Create Real Resources

### Required First

- Final app/domain decision: `foobow.com`, subdomains for API/web, and whether this repo should own them.
- Primary region/data residency: North America, EU, or other.
- Environment model: development + production only, or add staging.
- Billing owner/account for paid services.

### Clerk

Needed from you:

- Permission to create/use a Clerk app under your Clerk account.
- Clerk account login available in browser/CLI.
- App name confirmation: `Foobow`.
- Required login providers: email, Google, Apple.
- Redirect URLs and deep link scheme confirmation.

Resources to create:

- Clerk app for development and production.
- JWT template for `foobow-api`.
- Webhook endpoint placeholder for user sync.

### Supabase

Needed from you:

- Supabase org ID or confirmation to create under the default org.
- Region.
- Database password.
- Project names, recommended: `foobow-dev`, `foobow-prod`.
- Whether storage buckets should be public or private by default.

Resources to create:

- Supabase projects.
- Postgres connection strings.
- Storage buckets: `avatars`, `journal-attachments`, `campaign-assets`.
- Optional local/remote migration link.

### Vercel

Needed from you:

- Vercel team/org slug.
- Confirmation whether Vercel hosts only prototype/web or also API preview.
- Production domain mapping decision.

Resources to create:

- Vercel project linked to GitHub repo.
- Preview and production environment variables.
- Domain mapping when DNS is ready.

### Stripe

Needed from you:

- Stripe account access and live/test mode choice.
- Donation model: one-time custom amounts, fixed products, or both.
- Subscription tiers and prices.
- Business/legal details handled in Stripe dashboard.

Resources to create:

- Donation product/price or checkout configuration.
- Subscription products/prices.
- Webhook endpoint and secret.

### Mapbox

Needed from you:

- Mapbox account access.
- Preferred map style direction: use Mapbox standard style first or create custom calm style.
- Mobile app identifiers for token restrictions.

Resources to create:

- Restricted public token.
- Optional custom style.

### Sentry

Needed from you:

- Sentry org slug.
- Whether to use one project or separate `foobow-api` and `foobow-mobile`.

Resources to create:

- API project.
- Mobile project.
- CI auth token for release/source-map upload.

### PostHog

Needed from you:

- Data residency: US or EU.
- Whether session replay is allowed for this app.

Resources to create:

- PostHog project.
- Feature flag keys.

### Resend

Needed from you:

- Sending domain.
- DNS access for SPF/DKIM/DMARC.
- Sender address, recommended `noreply@foobow.com`.

Resources to create:

- Domain verification.
- Sending API key.

## Proposed CLI Order

1. Confirm domain, region, and environment model.
2. Create/link Supabase dev project and apply DB migration/seed.
3. Create Clerk dev app and collect JWT/webhook settings.
4. Link Vercel project and load non-secret/public env plus placeholder secrets.
5. Add Stripe test products/webhooks.
6. Add Mapbox token.
7. Add Sentry/PostHog/Resend only after app/API integration begins.

## Current Recommendation

Do not create production resources yet. Create development resources first:

- `foobow-dev` Supabase project.
- Clerk development app.
- Vercel preview project.
- Stripe test mode resources.
- Mapbox development token.

This lets the repo move from local-only smoke tests to real-provider integration without prematurely committing to production billing, domain, or compliance setup.
