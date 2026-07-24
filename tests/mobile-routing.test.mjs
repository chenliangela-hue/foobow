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
  assert.deepEqual(appJson.expo.plugins, ["expo-router", "expo-localization", "expo-secure-store"]);
  assert.match(rootLayout, /<Stack screenOptions=\{\{ headerShown: false \}\}/);
  assert.match(tabLayout, /<Tabs/);
  const calmCardSource = await read("apps/mobile/src/components/deeds/CalmRitualCard.tsx");
  const safetySource = await read("apps/mobile/src/components/common/SafetyNotice.tsx");
  const translationsSource = await read("apps/mobile/src/i18n/translations.ts");
  const combinedAppSource = appSource + calmCardSource + safetySource + translationsSource;

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

test("mobile Clerk auth is key-gated with guest mode preserved", async () => {
  const appSource = await read("apps/mobile/App.tsx");
  const clerkConfig = await read("apps/mobile/src/auth/clerkConfig.ts");
  const accountCard = await read("apps/mobile/src/components/profile/AccountCard.tsx");
  const profileView = await read("apps/mobile/src/components/profile/ProfileView.tsx");

  // Clerk only activates when the publishable key exists; the app must run
  // without it (guest/offline mode).
  assert.match(clerkConfig, /EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY/);
  assert.match(appSource, /if \(!clerkEnabled\)/);
  assert.match(appSource, /ClerkProvider/);
  assert.match(appSource, /tokenCache/);
  assert.match(profileView, /clerkEnabled && <AccountCard/);

  // Username+password flows matching the Clerk instance configuration.
  assert.match(accountCard, /useSignIn/);
  assert.match(accountCard, /useSignUp/);
  assert.match(accountCard, /signOut/);
  assert.match(accountCard, /secureTextEntry/);
});

test("mobile localization covers en and zh-Hans with required safety copy", async () => {
  const translations = await read("apps/mobile/src/i18n/translations.ts");
  const localeContext = await read("apps/mobile/src/i18n/LocaleContext.tsx");

  // All six locales exist and each must satisfy the en key shape.
  assert.match(translations, /export const en = \{/);
  for (const locale of ["zhHans", "fr", "es", "th", "ja"]) {
    assert.match(
      translations,
      new RegExp(`export const ${locale}: TranslationShape = \\{`),
      `mobile translations missing locale ${locale}`
    );
  }
  assert.match(localeContext, /supportedLocales/);
  assert.match(localeContext, /"th"/);
  assert.match(localeContext, /"ja"/);

  // Safety copy stays translated and avoids buying-luck claims in both locales.
  assert.match(translations, /It does not guarantee luck, virtue, health, or real-world impact\./);
  assert.match(translations, /不保证好运、美德、健康或真实影响/);

  // Locale preference is device-driven with a persisted override.
  assert.match(localeContext, /expo-localization/);
  assert.match(localeContext, /usePersistentState/);
  assert.match(localeContext, /"zh-Hans"/);
});
