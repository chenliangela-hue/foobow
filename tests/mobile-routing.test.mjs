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
