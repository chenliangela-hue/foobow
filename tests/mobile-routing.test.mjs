import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function read(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("mobile app is wired for Expo Router tab routes", async () => {
  const packageJson = JSON.parse(await read("apps/mobile/package.json"));
  const appJson = JSON.parse(await read("apps/mobile/app.json"));
  const appSource = await read("apps/mobile/App.tsx");
  const rootLayout = await read("apps/mobile/app/_layout.tsx");
  const tabLayout = await read("apps/mobile/app/(tabs)/_layout.tsx");

  assert.equal(packageJson.main, "expo-router/entry");
  assert.ok(packageJson.dependencies["expo-router"]);
  assert.deepEqual(appJson.expo.plugins, ["expo-router"]);
  assert.match(rootLayout, /<Stack screenOptions=\{\{ headerShown: false \}\}/);
  assert.match(tabLayout, /<Tabs/);
  const calmCardSource = await read("apps/mobile/src/components/deeds/CalmRitualCard.tsx");
  const safetySource = await read("apps/mobile/src/components/common/SafetyNotice.tsx");
  const combinedAppSource = appSource + calmCardSource + safetySource;

  assert.match(combinedAppSource, /Calm ritual/);
  assert.match(combinedAppSource, /Start 20s focus/);
  assert.match(combinedAppSource, /Complete with focus/);
  assert.match(combinedAppSource, /symbolic comfort only/);

  for (const route of ["index", "map", "deeds", "community", "profile"]) {
    const source = await read(`apps/mobile/app/(tabs)/${route}.tsx`);
    assert.match(source, /routeMode/);
    assert.match(source, /initialTab=/);
  }
});

test("mobile service layer follows the API contract with offline fallback", async () => {
  const apiClient = await read("apps/mobile/src/services/apiClient.ts");
  const service = await read("apps/mobile/src/services/foobowService.ts");
  const mappers = await read("apps/mobile/src/services/mappers.ts");

  // Env-driven config matching .env.example and the OpenAPI base path.
  assert.match(apiClient, /EXPO_PUBLIC_API_URL/);
  assert.match(apiClient, /EXPO_PUBLIC_FOOBOW_DEV_TOKEN/);
  assert.match(apiClient, /\/api\/v1/);
  assert.match(apiClient, /AbortController/);

  // Read paths hit the contract endpoints and keep bundled fallback data.
  for (const endpoint of ['"/deed-types"', '"/map-spots"', '"/blessings"', '"/checkins"', '"/deed-actions"']) {
    assert.ok(service.includes(endpoint), `service missing endpoint ${endpoint}`);
  }
  assert.match(service, /return deeds;/);
  assert.match(service, /return mapSpots;/);
  assert.match(service, /return initialBlessings;/);

  // Wire DTOs stay snake_case and are mapped into view models.
  assert.match(service, /deed_type_id/);
  assert.match(mappers, /default_karma_points/);
  assert.match(mappers, /moderation_status/);

  // Controllers hydrate from the API without dropping offline behavior.
  for (const controller of ["useDeedController", "useMapController", "useCommunityController"]) {
    const source = await read(`apps/mobile/src/controllers/${controller}.ts`);
    assert.match(source, /apiService\.get/);
    assert.match(source, /useEffect/);
  }
});
