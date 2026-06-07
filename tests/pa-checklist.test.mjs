import test from "node:test";
import assert from "node:assert/strict";
import { hasAll, readText } from "./helpers.mjs";

test("prototype includes baseline accessibility and safety copy", async () => {
  const html = await readText("prototype/index.html");
  const missing = hasAll(html, [
    "aria-label=\"Primary\"",
    "aria-live=\"polite\"",
    "aria-label=\"Switch language\"",
    "aria-label=\"Toggle dark mode\"",
    "exportDataButton",
    "deleteDataButton",
    "It does not buy luck, virtue, or guaranteed karma."
  ]);

  assert.deepEqual(missing, []);
});

test("project docs define verification gates and privacy/moderation responsibilities", async () => {
  const projectPlan = await readText("docs/project-plan.md");
  const database = await readText("docs/database-structure.md");
  const acceptance = await readText("docs/acceptance-criteria.md");
  const app = await readText("prototype/app.js");
  const missing = hasAll(projectPlan + database + acceptance + app, [
    "Unit checks",
    "Smoke checks",
    "PA checks",
    "privacy_mode",
    "moderation_status",
    "verified donation",
    "localStorage",
    "reported"
  ]);

  assert.deepEqual(missing, []);
});
