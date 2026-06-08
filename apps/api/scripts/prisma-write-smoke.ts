import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { ConflictException } from "@nestjs/common";
import { FoobowService } from "../src/nest/foobow.service.js";
import { PrismaService } from "../src/nest/prisma.service.js";

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

async function main() {
  loadLocalEnv();
  assert.ok(process.env.DATABASE_URL, "DATABASE_URL is required for the Prisma write smoke test.");

  const prisma = new PrismaService();
  await prisma.onModuleInit();
  const service = new FoobowService(prisma);

  const me = await service.me();
  assert.equal(me.user.id, "user_demo");

  try {
    const checkin = await service.createCheckin({ mood: "calm", note: "Local Prisma smoke check." });
    assert.match(String(checkin.checkin.id), /^checkin_/);
  } catch (error) {
    if (!(error instanceof ConflictException)) {
      throw error;
    }
  }

  const deed = await service.createDeedAction({
    deed_type_id: "deed_release_fish",
    status: "completed",
    visibility: "private"
  });
  assert.match(String(deed.deed_action.id), /^action_/);
  assert.equal(deed.karma_event.points, 5);

  const blessing = await service.createBlessing({
    body: `May this smoke run stay kind ${randomUUID().slice(0, 8)}.`,
    visibility: "anonymous"
  });
  assert.match(String(blessing.blessing.id), /^blessing_/);

  const report = await service.createReport({
    target_type: "blessing",
    target_id: String(blessing.blessing.id),
    reason: "Smoke-test moderation path."
  });
  assert.match(String(report.report.id), /^report_/);

  const idempotencyKey = `smoke_${randomUUID()}`;
  const donation = await service.createDonation(idempotencyKey, {
    campaign_id: "campaign_operating_support",
    amount: "1.00",
    currency: "CAD"
  });
  const repeatedDonation = await service.createDonation(idempotencyKey, {
    campaign_id: "campaign_operating_support",
    amount: "1.00",
    currency: "CAD"
  });
  assert.equal(donation.donation.id, repeatedDonation.donation.id);
  assert.equal(donation.donation.karma_points_awarded, 0);

  await prisma.onModuleDestroy();
  console.log("Prisma write smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
