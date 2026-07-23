// Proves the Clerk JWT verification path end-to-end against the real Clerk
// test instance: mints a session token via the Clerk Backend API for a
// disposable user, verifies it with the same helper the Nest guard uses,
// checks a tampered token is rejected, and cleans the user up.
//
// Skips (exit 0) when CLERK_SECRET_KEY or AUTH_ISSUER_URL is not available,
// so it is safe to run in environments without Clerk credentials.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadRootEnvLocal(): void {
  try {
    const raw = readFileSync(resolve(import.meta.dirname, "../../../.env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const match = /^([A-Z0-9_]+)=("?)(.*)\2$/.exec(line.trim());
      if (match && !(match[1] in process.env)) {
        process.env[match[1]] = match[3];
      }
    }
  } catch {
    // No .env.local; rely on ambient environment.
  }
}

const clerkApi = "https://api.clerk.com/v1";

async function clerk(method: string, path: string, body?: unknown): Promise<any> {
  const response = await fetch(`${clerkApi}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(`Clerk ${method} ${path} failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

async function main(): Promise<void> {
  loadRootEnvLocal();

  if (!process.env.CLERK_SECRET_KEY || !process.env.AUTH_ISSUER_URL) {
    console.log("Clerk auth smoke skipped: CLERK_SECRET_KEY or AUTH_ISSUER_URL not configured.");
    return;
  }

  const { clerkVerificationEnabled, verifyClerkToken } = await import("../src/nest/clerk-jwt.js");
  if (!clerkVerificationEnabled()) {
    throw new Error("AUTH_ISSUER_URL is set but the verifier reports Clerk verification disabled.");
  }

  // Prefer an existing user so the smoke run leaves the instance untouched;
  // create a disposable one only when the instance is empty.
  let userId: string;
  let createdUser = false;
  const existing = await clerk("GET", "/users?limit=1");
  if (Array.isArray(existing) && existing.length > 0) {
    userId = existing[0].id;
  } else {
    // This Clerk instance is username-based; fall back to email for
    // instances configured with email identifiers instead.
    const user = await clerk("POST", "/users", { username: `foobow_smoke_${Date.now()}` }).catch(() =>
      clerk("POST", "/users", { email_address: [`foobow-auth-smoke-${Date.now()}@example.com`] })
    );
    userId = user.id;
    createdUser = true;
  }

  let sessionId: string | null = null;
  try {
    const session = await clerk("POST", "/sessions", { user_id: userId });
    sessionId = session.id;
    const { jwt } = await clerk("POST", `/sessions/${session.id}/tokens`, {});

    const payload = await verifyClerkToken(jwt);
    if (!payload || payload.sub !== userId) {
      throw new Error(`Verified payload mismatch: expected sub ${userId}, got ${JSON.stringify(payload?.sub)}`);
    }

    const tampered = await verifyClerkToken(`${jwt.slice(0, -4)}AAAA`);
    if (tampered !== null) {
      throw new Error("Tampered token unexpectedly verified.");
    }

    console.log(`Clerk auth smoke passed: minted and verified session JWT for ${userId}; tampered token rejected.`);
  } finally {
    if (sessionId) {
      await clerk("POST", `/sessions/${sessionId}/revoke`, {}).catch(() => undefined);
    }
    if (createdUser) {
      await clerk("DELETE", `/users/${userId}`).catch(() => undefined);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
