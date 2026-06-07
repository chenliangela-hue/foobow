import test from "node:test";
import assert from "node:assert/strict";
import { readText } from "./helpers.mjs";

test("OpenAPI contract defines core MVP resources", async () => {
  const contract = JSON.parse(await readText("docs/openapi.json"));
  const paths = Object.keys(contract.paths);

  assert.equal(contract.openapi, "3.1.0");
  assert.equal(contract.servers[0].url, "/api/v1");
  assert.deepEqual(
    [
      "/me",
      "/me/profile",
      "/today",
      "/checkins",
      "/map-spots",
      "/deed-types",
      "/deed-actions",
      "/blessings",
      "/reports",
      "/donation-campaigns",
      "/donations"
    ].filter((path) => !paths.includes(path)),
    []
  );
});

test("OpenAPI donation creation requires idempotency and unverified-campaign handling", async () => {
  const contract = JSON.parse(await readText("docs/openapi.json"));
  const donationPost = contract.paths["/donations"].post;

  assert.equal(donationPost.parameters[0].$ref, "#/components/parameters/IdempotencyKey");
  assert.ok(donationPost.responses["409"]);
  assert.ok(donationPost.responses["422"]);
  assert.ok(contract.components.responses.UnverifiedCampaign);
});

test("OpenAPI lists use cursor pagination shape", async () => {
  const contract = JSON.parse(await readText("docs/openapi.json"));
  const pageInfo = contract.components.schemas.PageInfo;

  assert.ok(pageInfo.required.includes("has_next_page"));
  assert.equal(pageInfo.properties.next_cursor.type[0], "string");
  assert.ok(contract.paths["/map-spots"].get.parameters.some((parameter) => parameter.$ref === "#/components/parameters/Cursor"));
  assert.ok(contract.paths["/deed-types"].get.parameters.some((parameter) => parameter.$ref === "#/components/parameters/Cursor"));
});

