import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const docs = await readFile("docs/dependency-advisory-watchlist.md", "utf8");
const packageJson = await readFile("package.json", "utf8");
const taskBoard = await readFile("docs/task-board.md", "utf8");

for (const expected of [
  "npm run test:security",
  "high and critical",
  "Do not run `npm audit fix --force`",
  "prisma -> @prisma/dev -> @hono/node-server",
  "repeated-slash",
  "expo -> @expo/cli -> @expo/config-plugins -> xcode -> uuid",
  "buffer bounds",
  "Monitor Prisma upstream",
  "Monitor Expo SDK upstream"
]) {
  assert.ok(docs.includes(expected), `dependency advisory watchlist missing: ${expected}`);
}

assert.ok(packageJson.includes("test:advisories"), "package.json missing test:advisories script");
assert.ok(taskBoard.includes("Dependency advisory watchlist"), "task board missing advisory watchlist task");

console.log("Dependency advisory watchlist is current.");
