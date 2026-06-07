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
    "Memory"
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
    "impactDialog",
    "Virtual 放生",
    "扶老奶奶过马路"
  ]);

  assert.deepEqual(missing, []);
});
