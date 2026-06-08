import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

async function read(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("NestJS scaffold defines production backend modules and guarded routes", async () => {
  const moduleSource = await read("src/nest/app.module.ts");
  const controllerSource = await read("src/nest/foobow.controller.ts");
  const guardSource = await read("src/nest/dev-auth.guard.ts");
  const prismaSource = await read("src/nest/prisma.service.ts");

  for (const expected of [
    "HealthController",
    "DiscoveryController",
    "AccountController",
    "RitualController",
    "CommunityController",
    "DonationController",
    "FoobowService",
    "PrismaService"
  ]) {
    assert.match(moduleSource, new RegExp(expected));
  }

  assert.match(controllerSource, /@ApiBearerAuth\(\)/);
  assert.match(controllerSource, /@UseGuards\(DevAuthGuard\)/);
  assert.match(controllerSource, /@Post\("donations"\)/);
  assert.match(guardSource, /process\.env\.FOOBOW_DEV_BEARER_TOKEN/);
  assert.match(guardSource, /\?\? "dev-foobow-token"/);
  assert.match(guardSource, /request\.headers\.authorization === `Bearer \$\{devBearerToken\}`/);
  assert.match(prismaSource, /extends PrismaClient/);
  assert.match(prismaSource, /PrismaPg/);
  assert.match(prismaSource, /super\(\{ adapter: new PrismaPg/);
  assert.match(prismaSource, /process\.env\.DATABASE_URL/);
  assert.match(prismaSource, /\$connect/);
  assert.match(prismaSource, /\$disconnect/);
});

test("NestJS scaffold uses DTO validation and Swagger documentation hooks", async () => {
  const dtoSource = await read("src/nest/dto.ts");
  const mainSource = await read("src/nest/main.ts");

  for (const expected of [
    "CheckinCreateDto",
    "DeedActionCreateDto",
    "BlessingCreateDto",
    "ReportCreateDto",
    "DonationCreateDto",
    "@ApiProperty",
    "@IsIn",
    "@Matches"
  ]) {
    assert.match(dtoSource, new RegExp(expected));
  }

  assert.match(mainSource, /ValidationPipe/);
  assert.match(mainSource, /DocumentBuilder/);
  assert.match(mainSource, /SwaggerModule\.setup\("docs"/);
});

test("NestJS service can switch read endpoints from fixtures to Prisma", async () => {
  const serviceSource = await read("src/nest/foobow.service.ts");

  for (const expected of [
    "constructor(private readonly prisma: PrismaService)",
    "this.prisma.deedType.findMany",
    "this.prisma.mapSpot.findMany",
    "this.prisma.blessing.findMany",
    "this.prisma.donationCampaign.findMany",
    "useDatabase()",
    "process.env.DATABASE_URL"
  ]) {
    assert.match(serviceSource, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("NestJS service can persist write endpoints through Prisma", async () => {
  const serviceSource = await read("src/nest/foobow.service.ts");

  for (const expected of [
    "this.prisma.user.upsert",
    "this.prisma.moodCheckin.create",
    "tx.deedAction.create",
    "tx.karmaEvent.create",
    "this.prisma.blessing.create",
    "this.prisma.safetyReport.create",
    "this.prisma.donation.findUnique",
    "tx.donation.create",
    "tx.donationCampaign.update",
    "slugFromPublicId",
    "donationResponse"
  ]) {
    assert.match(serviceSource, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
