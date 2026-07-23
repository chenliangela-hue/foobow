import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function readText(path) {
  return readFile(path, "utf8");
}

async function readPrototypeData() {
  const source = await readText("prototype/app/data.js");
  const context = { window: {} };
  vm.runInNewContext(source, context);
  return context.window.FOOBOW_DATA;
}

const catalog = await readJson("shared/foobow-catalog.json");
const prototypeData = await readPrototypeData();
const mobileDataSource = await readText("apps/mobile/src/services/foobowService.ts");
const seedSql = await readText("database/seeds/0001_reference_data.sql");
const apiFixtures = await import("../apps/api/src/fixtures.mjs");

const prototypeDeedIds = new Set(prototypeData.deeds.map((deed) => deed.id));
const prototypeSpotIds = new Set(Object.keys(prototypeData.spots));
const prototypeBlessingBodies = new Set(prototypeData.defaultState.blessings.map((blessing) => blessing.body));
const apiDeedIds = new Set(apiFixtures.deedTypes.map((deed) => deed.id));
const apiBlessingBodies = new Set(apiFixtures.blessings.map((blessing) => blessing.body));

for (const deed of catalog.deeds) {
  assert.ok(prototypeDeedIds.has(deed.prototypeId), `prototype missing deed ${deed.prototypeId}`);
  assert.ok(mobileDataSource.includes(`id: "${deed.prototypeId}"`), `mobile missing deed ${deed.prototypeId}`);
  assert.ok(apiDeedIds.has(deed.apiPublicId), `API fixture missing deed ${deed.apiPublicId}`);
  assert.ok(seedSql.includes(`'${deed.seedSlug}'`), `SQL seed missing deed slug ${deed.seedSlug}`);
}

for (const spot of catalog.mapSpots) {
  assert.ok(prototypeSpotIds.has(spot.prototypeId), `prototype missing map spot ${spot.prototypeId}`);
  assert.ok(mobileDataSource.includes(`id: "${spot.prototypeId}"`), `mobile missing map spot ${spot.prototypeId}`);
  assert.ok(seedSql.includes(`'${spot.seedSlug}'`), `SQL seed missing map spot slug ${spot.seedSlug}`);
}

for (const blessing of catalog.blessings) {
  assert.ok(prototypeBlessingBodies.has(blessing.body), `prototype missing blessing body ${blessing.id}`);
  assert.ok(mobileDataSource.includes(blessing.body), `mobile missing blessing body ${blessing.id}`);
  assert.ok(apiBlessingBodies.has(blessing.body), `API fixture missing blessing body ${blessing.id}`);
  assert.ok(seedSql.includes(`'${blessing.id}'`), `SQL seed missing blessing ${blessing.id}`);
}

for (const campaign of catalog.donationCampaigns) {
  assert.ok(seedSql.includes(`'${campaign.seedSlug}'`), `SQL seed missing campaign slug ${campaign.seedSlug}`);
}

console.log("Shared Foobow catalog is aligned.");
