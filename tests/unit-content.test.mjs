import test from "node:test";
import assert from "node:assert/strict";
import { hasAll, readText } from "./helpers.mjs";

test("product docs cover required feature components", async () => {
  const spec = await readText("docs/product-spec.md");
  const missing = hasAll(spec, [
    "Map World",
    "Daily Ritual",
    "Virtual Good Deeds",
    "Gamification",
    "Social",
    "Profile",
    "Monetization",
    "Enterprise Standards",
    "Multi-language support",
    "Dark and light mode",
    "Donation transparency"
  ]);

  assert.deepEqual(missing, []);
});

test("ODD, database, API, project plan, task board, and memory docs exist in README navigation", async () => {
  const readme = await readText("README.md");
  const missing = hasAll(readme, [
    "ODD Spec",
    "Database Structure",
    "API Interface",
    "Project Plan",
    "Task Board",
    "Acceptance Criteria",
    "Auth Strategy",
    "Map Provider Decision",
    "Localization Workflow",
    "Mobile Release Checklist",
    "Node Readiness",
    "Plugin And AI Orchestration",
    "Shared Catalog Contract",
    "External Service Resources",
    "Memory"
  ]);

  assert.deepEqual(missing, []);
});

test("plugin and AI orchestration docs define available tools, roles, rotation, and automation", async () => {
  const orchestration = await readText("docs/plugin-and-ai-orchestration.md");
  const dashboard = await readText("USAGE_DASHBOARD.md");

  const missing = hasAll(orchestration + dashboard, [
    "Browser",
    "GitHub",
    "Computer Use",
    "Documents",
    "Presentations",
    "Spreadsheets",
    "Canva",
    "Codex 5.5",
    "Claude 4.8",
    "Gemini 3.5",
    "80%",
    "foobow-vibeorchestrator-usage-check",
    "External AI"
  ]);

  assert.deepEqual(missing, []);
});

test("shared catalog contract protects cross-surface product sample data", async () => {
  const contract = await readText("docs/shared-catalog-contract.md");
  const catalog = await readText("shared/foobow-catalog.json");
  const packageJson = await readText("package.json");

  const missing = hasAll(contract + catalog + packageJson, [
    "test:catalog",
    "verify-shared-catalog.mjs",
    "prototypeId",
    "apiPublicId",
    "seedSlug",
    "release-fish",
    "deed_release_fish",
    "blessing_001",
    "operating-support"
  ]);

  assert.deepEqual(missing, []);
});

test("external service env contract covers production resource setup", async () => {
  const envExample = await readText(".env.example");
  const serviceDocs = await readText("docs/external-service-resources.md");
  const packageJson = await readText("package.json");

  const missing = hasAll(envExample + serviceDocs + packageJson, [
    "test:env",
    "verify-env-contract.mjs",
    "Clerk",
    "Supabase",
    "Vercel",
    "Stripe",
    "Mapbox",
    "Sentry",
    "PostHog",
    "Resend",
    "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "DATABASE_URL",
    "DIRECT_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "VERCEL_PROJECT_ID",
    "STRIPE_WEBHOOK_SECRET",
    "EXPO_PUBLIC_MAPBOX_TOKEN",
    "DONATION_TRANSPARENCY_COPY"
  ]);

  assert.deepEqual(missing, []);
});

test("sprint readiness docs cover auth, maps, localization, mobile release, and Node runtime", async () => {
  const auth = await readText("docs/auth-strategy.md");
  const envExample = await readText("apps/api/.env.example");
  const compose = await readText("docker-compose.yml");
  const maps = await readText("docs/map-provider-decision.md");
  const localization = await readText("docs/localization-workflow.md");
  const release = await readText("docs/mobile-release-checklist.md");
  const nodeReadiness = await readText("docs/node-readiness.md");
  const nodeVersion = await readText(".node-version");
  const apiPackage = await readText("apps/api/package.json");

  const missing = hasAll(auth + envExample + compose + maps + localization + release + nodeReadiness + nodeVersion + apiPackage, [
    "Auth0",
    "Clerk",
    "Apple Sign In",
    "FOOBOW_DEV_BEARER_TOKEN",
    "AUTH_PROVIDER",
    "foobow-postgres",
    "55432:5432",
    "prisma:smoke",
    "Mapbox",
    "OpenStreetMap",
    "MapLibre",
    "zh-Hans",
    "en",
    "WCAG",
    "App Store",
    "Google Play",
    "20.19.4"
  ]);

  assert.deepEqual(missing, []);
});

test("CI workflow pins current runner and action runtime expectations", async () => {
  const ci = await readText(".github/workflows/ci.yml");
  const missing = hasAll(ci, [
    "actions/checkout@v6",
    "actions/setup-node@v6",
    "node-version: 20.19.4",
    "runs-on: windows-2025",
    "Generate Prisma client",
    "api-db-smoke",
    "postgres:17-alpine",
    "Apply SQL schema and seed",
    "prisma:smoke",
    "nest:db-smoke",
    "npm run test:visual"
  ]);

  assert.deepEqual(missing, []);
});

test("prototype exposes the required app screens and controls", async () => {
  const html = await readText("prototype/index.html");
  const missing = hasAll(html, [
    "screen-today",
    "screen-map",
    "screen-deeds",
    "screen-community",
    "screen-profile",
    "languageToggle",
    "themeToggle",
    "data.js",
    "deedCategoryRow",
    "mapLayerRow",
    "impactDialog",
    "Virtual 放生",
    "扶老奶奶过马路"
  ]);

  assert.deepEqual(missing, []);
});
