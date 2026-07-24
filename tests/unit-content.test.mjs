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
    "Provider CLI Setup Plan",
    "Dependency Advisory Watchlist",
    "Memory"
  ]);

  assert.deepEqual(missing, []);
});

test("plugin and AI orchestration docs define available tools, roles, rotation, and automation", async () => {
  const orchestration = await readText("docs/plugin-and-ai-orchestration.md");
  const dashboard = await readText("USAGE_DASHBOARD.md");
  const agents = await readText("AGENTS.md");

  const missing = hasAll(orchestration + dashboard + agents, [
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
    "External AI",
    "Codex is the default orchestrator",
    "Claude Code",
    "Gemini",
    "Never send secrets"
  ]);

  assert.deepEqual(missing, []);
});

test("sprint audit captures next plan and meditation reference opportunities", async () => {
  const audit = await readText("docs/sprint-audit-and-next-plan.md");
  const readme = await readText("README.md");
  const taskBoard = await readText("docs/task-board.md");
  const calmRitual = await readText("docs/calm-ritual-feature-spec.md");

  const missing = hasAll(audit + readme + taskBoard + calmRitual, [
    "Sprint Audit And Next Plan",
    "putiyuan Meditation",
    "Ambient session mode",
    "Completion threshold",
    "Guided cards",
    "Gentle celebration",
    "Calm Ritual Feature Spec",
    "Presence timer",
    "Hold-to-complete",
    "reduced-motion",
    "Codex remains orchestration owner",
    "Claude Code",
    "Gemini",
    "Next 3-5 Tasks",
    "cannot buy luck, virtue, or guaranteed karma"
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
  const providerPlan = await readText("docs/provider-cli-setup-plan.md");
  const packageJson = await readText("package.json");

  const missing = hasAll(envExample + serviceDocs + providerPlan + packageJson, [
    "test:env",
    "verify-env-contract.mjs",
    "Clerk",
    "Supabase",
    "Stripe",
    "OpenStreetMap",
    "No email API key is required for the initial MVP",
    "Optional Donation Mode",
    "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "DATABASE_URL",
    "FOOBOW_DEV_BEARER_TOKEN",
    "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "EXPO_PUBLIC_MAP_PROVIDER",
    "EXPO_PUBLIC_MAP_TILE_URL",
    "supabase projects list",
    "Provider-backed PA",
    "Stripe CLI becomes useful once webhook verification exists"
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
  const nvmrc = await readText(".nvmrc");
  const apiPackage = await readText("apps/api/package.json");

  const missing = hasAll(auth + envExample + compose + maps + localization + release + nodeReadiness + nodeVersion + nvmrc + apiPackage, [
    "Auth0",
    "Clerk",
    "Apple Sign In",
    "FOOBOW_DEV_BEARER_TOKEN",
    "AUTH_PROVIDER",
    "foobow-postgres",
    "55432:5432",
    "test:db-integration",
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
    "database/migrations/0002_focus_sessions.sql",
    "Run API DB integration suite",
    "test:db-integration",
    "npm run test:visual"
  ]);

  assert.deepEqual(missing, []);
});

test("dependency advisory watchlist tracks accepted moderate transitive risks", async () => {
  const advisories = await readText("docs/dependency-advisory-watchlist.md");
  const packageJson = await readText("package.json");
  const taskBoard = await readText("docs/task-board.md");

  const missing = hasAll(advisories + packageJson + taskBoard, [
    "test:advisories",
    "verify-advisory-watchlist.mjs",
    "npm run test:security",
    "Do not run `npm audit fix --force`",
    "prisma -> @prisma/dev -> @hono/node-server",
    "expo -> @expo/cli -> @expo/config-plugins -> xcode -> uuid",
    "Dependency advisory watchlist"
  ]);

  assert.deepEqual(missing, []);
});

test("landing page carries brand, tagline, six locales, gates, and the ethics disclaimer", async () => {
  const html = await readText("prototype/index.html");
  const i18n = await readText("prototype/landing.i18n.js");

  const missingHtml = hasAll(html, [
    "Foobow",
    "福",
    "coupletTagline",
    "id=\"langSelect\"",
    "href=\"/app/\"",
    "gateGrid",
    "phrase-rotator",
    "ethics"
  ]);
  assert.deepEqual(missingHtml, []);

  const missingI18n = hasAll(i18n, [
    "积善德，得福报；种善因，收福果",
    "\"en\"",
    "\"zh-Hans\"",
    "\"fr\"",
    "\"es\"",
    "\"th\"",
    "\"ja\"",
    "善有善报，福从善来",
    "一念善心，万福临门",
    "symbolic comfort only"
  ]);
  assert.deepEqual(missingI18n, []);
});

test("admin console carries the management sections and keeps money ethical", async () => {
  const html = await readText("prototype/admin/index.html");
  const data = await readText("prototype/admin/admin.data.js");

  const missingHtml = hasAll(html, [
    "管理后台",
    "sideNav",
    "adminView",
    "demoBadge",
    "href=\"/\"",
    "noindex"
  ]);
  assert.deepEqual(missingHtml, []);

  const missingData = hasAll(data, [
    "订单审核",
    "商品定价",
    "审计日志",
    "never from buying luck",
    "wechatpay",
    "applepay",
    "googlepay"
  ]);
  assert.deepEqual(missingData, []);
});

test("prototype exposes the required app screens and controls", async () => {
  const html = await readText("prototype/app/index.html");
  const missing = hasAll(html, [
    "screen-today",
    "screen-map",
    "screen-deeds",
    "screen-community",
    "screen-profile",
    "languageSelect",
    "themeToggle",
    "calm-ritual-title",
    "soundscapeRow",
    "focusProgress",
    "startFocusSession",
    "completeFocusedRitual",
    "This is symbolic comfort only",
    "data.js",
    "deedCategoryRow",
    "mapLayerRow",
    "impactDialog",
    "Virtual 放生",
    "扶老奶奶过马路",
    "screen-blessings",
    "prayCats",
    "lampStage"
  ]);

  assert.deepEqual(missing, []);
});

test("blessings feature ships a provider-agnostic mock engine and safe copy", async () => {
  const app = await readText("prototype/app/app.js");
  const missing = hasAll(app, [
    "blessingEngine",
    "provider: \"mock\"",
    "Anthropic, OpenAI, or Gemini",
    "promises luck or outcomes",
    "BLESSING_LINES",
    "renderLamps",
    "keptBlessings"
  ]);
  assert.deepEqual(missing, []);
});
