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

  for (const expected of [
    "HealthController",
    "DiscoveryController",
    "AccountController",
    "RitualController",
    "CommunityController",
    "DonationController",
    "FoobowService"
  ]) {
    assert.match(moduleSource, new RegExp(expected));
  }

  assert.match(controllerSource, /@ApiBearerAuth\(\)/);
  assert.match(controllerSource, /@UseGuards\(DevAuthGuard\)/);
  assert.match(controllerSource, /@Post\("donations"\)/);
  assert.match(guardSource, /devBearerToken = "dev-foobow-token"/);
  assert.match(guardSource, /request\.headers\.authorization === `Bearer \$\{devBearerToken\}`/);
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
