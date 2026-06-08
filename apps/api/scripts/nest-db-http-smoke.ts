import "reflect-metadata";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/nest/app.module.js";

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

async function request(baseUrl: string, path: string, init: RequestInit = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {})
    }
  });
  const body = await response.json();
  return { response, body };
}

function assertStatus(actual: { response: Response; body: unknown }, expected: number, label: string) {
  assert.equal(actual.response.status, expected, `${label} expected ${expected}, got ${actual.response.status}: ${JSON.stringify(actual.body)}`);
}

async function main() {
  loadLocalEnv();
  assert.ok(process.env.DATABASE_URL, "DATABASE_URL is required for the Nest DB HTTP smoke test.");

  const app = await NestFactory.create(AppModule, { logger: ["error", "warn"] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );
  await app.listen(0, "127.0.0.1");

  const baseUrl = await app.getUrl();
  const authHeaders = { authorization: `Bearer ${process.env.FOOBOW_DEV_BEARER_TOKEN ?? "dev-foobow-token"}` };

  try {
    const health = await request(baseUrl, "/health");
    assertStatus(health, 200, "GET /health");
    assert.equal(health.body.status, "ok");

    const deeds = await request(baseUrl, "/api/v1/deed-types");
    assertStatus(deeds, 200, "GET /api/v1/deed-types");
    assert.ok(deeds.body.items.some((deed: { id: string }) => deed.id === "deed_release_fish"));

    const me = await request(baseUrl, "/api/v1/me", { headers: authHeaders });
    assertStatus(me, 200, "GET /api/v1/me");
    assert.equal(me.body.user.id, "user_demo");

    const checkin = await request(baseUrl, "/api/v1/checkins", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ mood: "hopeful", note: "HTTP DB smoke check." })
    });
    assert.ok([201, 409].includes(checkin.response.status));

    const deed = await request(baseUrl, "/api/v1/deed-actions", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ deed_type_id: "deed_release_fish", status: "completed", visibility: "private" })
    });
    assertStatus(deed, 201, "POST /api/v1/deed-actions");
    assert.equal(deed.body.karma_event.points, 5);

    const blessing = await request(baseUrl, "/api/v1/blessings", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ body: `HTTP smoke blessing ${randomUUID().slice(0, 8)}`, visibility: "anonymous" })
    });
    assertStatus(blessing, 201, "POST /api/v1/blessings");
    assert.match(blessing.body.blessing.id, /^blessing_/);

    const report = await request(baseUrl, "/api/v1/reports", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        target_type: "blessing",
        target_id: blessing.body.blessing.id,
        reason: "HTTP smoke moderation path."
      })
    });
    assertStatus(report, 201, "POST /api/v1/reports");
    assert.match(report.body.report.id, /^report_/);

    const idempotencyKey = `http_smoke_${randomUUID()}`;
    const donationPayload = { campaign_id: "campaign_operating_support", amount: "1.00", currency: "CAD" };
    const donation = await request(baseUrl, "/api/v1/donations", {
      method: "POST",
      headers: { ...authHeaders, "idempotency-key": idempotencyKey },
      body: JSON.stringify(donationPayload)
    });
    const repeatedDonation = await request(baseUrl, "/api/v1/donations", {
      method: "POST",
      headers: { ...authHeaders, "idempotency-key": idempotencyKey },
      body: JSON.stringify(donationPayload)
    });
    assertStatus(donation, 201, "POST /api/v1/donations");
    assertStatus(repeatedDonation, 201, "POST /api/v1/donations repeat");
    assert.equal(donation.body.donation.id, repeatedDonation.body.donation.id);
    assert.equal(donation.body.donation.karma_points_awarded, 0);
  } finally {
    await app.close();
  }

  console.log("Nest DB HTTP smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
