import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

function loadLocalEnv() {
  const envUrl = new URL("../.env", import.meta.url);
  if (!existsSync(envUrl)) {
    return;
  }

  for (const line of readFileSync(envUrl, "utf8").split(/\r?\n/)) {
    const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (!match || process.env[match[1]]) {
      continue;
    }
    process.env[match[1]] = match[2].replace(/^"(.*)"$/, "$1");
  }
}

function runStep(label: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    console.log(`\n[db-integration] ${label}`);
    const child = spawn("npx", args, {
      cwd: new URL("..", import.meta.url),
      env: process.env,
      shell: true,
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${label} failed with exit code ${code ?? "unknown"}`));
    });
  });
}

async function main() {
  loadLocalEnv();
  assert.ok(process.env.DATABASE_URL, "DATABASE_URL is required for the DB integration suite.");

  await runStep("Prisma service write-path smoke", ["tsx", "scripts/prisma-write-smoke.ts"]);
  await runStep("Nest HTTP DB smoke", ["tsx", "scripts/nest-db-http-smoke.ts"]);

  console.log("\nDB integration suite passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
