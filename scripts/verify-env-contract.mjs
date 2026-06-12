import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const envExample = await readFile(".env.example", "utf8");
const docs = await readFile("docs/external-service-resources.md", "utf8");

// These keys MUST be present and uncommented in .env.example
const requiredMvpKeys = [
  "DATABASE_URL",
  "FOOBOW_DEV_BEARER_TOKEN",
  "AUTH_PROVIDER",
  "AUTH_ISSUER_URL",
  "AUTH_AUDIENCE",
  "EXPO_PUBLIC_API_URL",
  "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "EXPO_PUBLIC_MAP_PROVIDER",
  "EXPO_PUBLIC_MAP_TILE_URL",
  "EXPO_PUBLIC_MAP_ATTRIBUTION"
];

// These keys can be commented out or deferred
const deferredKeys = [
  "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "EXPO_PUBLIC_MAPBOX_TOKEN",
  "SENTRY_DSN",
  "EXPO_PUBLIC_SENTRY_DSN_MOBILE",
  "POSTHOG_KEY",
  "EXPO_PUBLIC_POSTHOG_KEY",
  "EXPO_TOKEN",
  "VERCEL_TOKEN"
];

console.log("Checking MVP keys...");
for (const key of requiredMvpKeys) {
  assert.match(envExample, new RegExp(`^${key}=`, "m"), `.env.example missing REQUIRED MVP key: ${key}`);
}

console.log("Checking deferred keys (can be commented out)...");
for (const key of deferredKeys) {
  assert.match(envExample, new RegExp(`^#?\\s*${key}=`, "m"), `.env.example missing DEFERRED key placeholder: ${key}`);
}

for (const service of ["Clerk", "Supabase", "OpenStreetMap", "MapLibre"]) {
  assert.ok(docs.includes(service), `external service docs missing ${service}`);
}

assert.ok(docs.includes("Optional Donation Mode"), "external service docs must mark Stripe donation mode as optional");
assert.ok(docs.includes("No email API key is required for the initial MVP"), "external service docs must explain why email API keys are not required");

console.log("Foobow env contract is complete (reduced mobile MVP focus).");
