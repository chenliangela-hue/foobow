import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const envExample = await readFile(".env.example", "utf8");
const docs = await readFile("docs/external-service-resources.md", "utf8");

const requiredKeys = [
  "APP_ENV",
  "APP_PUBLIC_URL",
  "API_PUBLIC_URL",
  "FOOBOW_DEV_BEARER_TOKEN",
  "AUTH_PROVIDER",
  "AUTH_ISSUER_URL",
  "AUTH_AUDIENCE",
  "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CLERK_JWT_KEY",
  "CLERK_WEBHOOK_SECRET",
  "DATABASE_URL",
  "DIRECT_URL",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_PROJECT_REF",
  "SUPABASE_ACCESS_TOKEN",
  "VERCEL_TOKEN",
  "VERCEL_ORG_ID",
  "VERCEL_PROJECT_ID",
  "EXPO_TOKEN",
  "EAS_PROJECT_ID",
  "EXPO_PUBLIC_API_BASE_URL",
  "STRIPE_SECRET_KEY",
  "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "EXPO_PUBLIC_MAPBOX_TOKEN",
  "MAPBOX_STYLE_URL",
  "SENTRY_DSN",
  "EXPO_PUBLIC_SENTRY_DSN_MOBILE",
  "POSTHOG_KEY",
  "EXPO_PUBLIC_POSTHOG_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "FEATURE_DONATIONS_ENABLED",
  "FEATURE_SUBSCRIPTIONS_ENABLED",
  "DONATION_TRANSPARENCY_COPY"
];

for (const key of requiredKeys) {
  assert.match(envExample, new RegExp(`^${key}=`, "m"), `.env.example missing ${key}`);
}

for (const service of ["Clerk", "Supabase", "Vercel", "Stripe", "Mapbox", "Sentry", "PostHog", "Resend"]) {
  assert.ok(docs.includes(service), `external service docs missing ${service}`);
}

console.log("Foobow env contract is complete.");
