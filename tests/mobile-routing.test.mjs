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

test("mobile release packaging configuration and EAS profiles are valid", async () => {
  const appJson = JSON.parse(await read("apps/mobile/app.json"));
  const easJson = JSON.parse(await read("apps/mobile/eas.json"));

  // Standalone app identification & Expo standards
  assert.equal(appJson.expo.name, "Foobow");
  assert.equal(appJson.expo.slug, "foobow");
  assert.equal(appJson.expo.version, "1.0.0");
  assert.equal(appJson.expo.scheme, "foobow");
  assert.equal(appJson.expo.orientation, "portrait");
  assert.equal(appJson.expo.ios?.bundleIdentifier, "com.foobow.app");
  assert.equal(appJson.expo.ios?.supportsTablet, true);
  assert.equal(appJson.expo.android?.package, "com.foobow.app");

  // Icon, splash, and adaptive icon assets exist and are non-empty
  const iconPaths = [
    appJson.expo.icon,
    appJson.expo.splash?.image,
    appJson.expo.android?.adaptiveIcon?.foregroundImage,
    appJson.expo.android?.adaptiveIcon?.backgroundImage,
    appJson.expo.android?.adaptiveIcon?.monochromeImage,
    appJson.expo.web?.favicon
  ].filter(Boolean);

  for (const relPath of iconPaths) {
    const cleanPath = relPath.replace(/^\.\//, "");
    const buf = await readFile(new URL(`../apps/mobile/${cleanPath}`, import.meta.url));
    assert.ok(buf.length > 0, `Icon asset empty: ${relPath}`);
  }

  // EAS build profiles
  assert.match(easJson.cli?.version, />= 14/);
  assert.equal(easJson.build?.development?.developmentClient, true);
  assert.equal(easJson.build?.development?.distribution, "internal");
  assert.equal(easJson.build?.preview?.distribution, "internal");
  assert.equal(easJson.build?.preview?.android?.buildType, "apk");
  assert.equal(easJson.build?.production?.autoIncrement, true);
  assert.ok(easJson.submit?.production, "EAS production submit profile must exist");
});

test("mobile offline asset bundle mirrors Cloudflare R2 manifest with checksums", async () => {
  const { createHash } = await import("node:crypto");
  const manifest = JSON.parse(await read("prototype/assets/foobow/asset-manifest.json"));
  const assetCatalogSource = await read("apps/mobile/src/services/assetCatalog.ts");

  assert.equal(manifest.version, "1.0.0");
  assert.equal(manifest.assetCount, 30);
  assert.equal(manifest.assets.length, 30);

  // Validate that all 30 assets exist in apps/mobile with matching size and sha256
  for (const asset of manifest.assets) {
    const fileBuf = await readFile(
      new URL(`../apps/mobile/assets/foobow/${asset.key}`, import.meta.url)
    );
    assert.equal(fileBuf.length, asset.size, `Size mismatch for mobile asset ${asset.key}`);
    const hash = createHash("sha256").update(fileBuf).digest("hex");
    assert.equal(hash, asset.sha256, `SHA256 mismatch for mobile asset ${asset.key}`);
    assert.ok(
      assetCatalogSource.includes(`"${asset.key}"`),
      `assetCatalog.ts must include key ${asset.key}`
    );
  }

  assert.match(assetCatalogSource, /R2_PUBLIC_BASE_URL/);
  assert.match(assetCatalogSource, /export function getAssetUri/);
});

test("store listing specification and ethical disclosures are complete", async () => {
  const storeListing = await read("docs/store-listing.md");
  const checklist = await read("docs/mobile-release-checklist.md");

  // Metadata completeness
  assert.match(storeListing, /Foobow · 福报/);
  assert.match(storeListing, /Daily Kindness & Mindful Zen/);
  assert.match(storeListing, /Cultivate peace of mind through daily kind deeds/);
  assert.match(storeListing, /Promotional Text/);
  assert.match(storeListing, /Full Description/);
  assert.match(storeListing, /宣传文本/);
  assert.match(storeListing, /完整描述/);
  assert.match(storeListing, /App Store Keywords/);
  assert.match(storeListing, /App Privacy & Data Safety Declarations/);

  // Pure giving ethics and non-monetized virtue declarations
  assert.match(storeListing, /0 karma points/);
  assert.match(storeListing, /0 积分\/0 福报增加/);
  assert.match(storeListing, /杜绝“花钱买运气\/福气\/功德”/);
  assert.match(storeListing, /money cannot purchase luck, virtue, health, or guaranteed karma/);

  // Checklist tracks packaging identifiers and build gates
  assert.match(checklist, /com\.foobow\.app/);
  assert.match(checklist, /preview.*apk/i);
  assert.match(checklist, /npm run test:mobile/);
  assert.match(checklist, /npm run test:security/);
});

test("OpenStreetMap sanctuary telemetry, coordinate precision, and tile config are valid", async () => {
  const dataJs = await read("prototype/app/data.js");
  const appJs = await read("prototype/app/app.js");
  const mobileService = await read("apps/mobile/src/services/foobowService.ts");

  // Verify all 5 global sanctuaries are defined
  const expectedSanctuaries = [
    "east-lake",
    "toronto-crosswalk",
    "amazon-grove",
    "night-corridor",
    "reading-room"
  ];

  for (const id of expectedSanctuaries) {
    assert.match(dataJs, new RegExp(`"${id}":`));
    assert.match(mobileService, new RegExp(`id: "${id}"`));
  }

  // Verify coordinate bounds and telemetry presence
  assert.match(dataJs, /lat:\s*30\.5539/);
  assert.match(dataJs, /lng:\s*114\.3644/);
  assert.match(dataJs, /lat:\s*43\.6532/);
  assert.match(dataJs, /lng:\s*-79\.3832/);
  assert.match(dataJs, /lat:\s*-3\.4653/);
  assert.match(dataJs, /lng:\s*-62\.2159/);
  assert.match(dataJs, /lat:\s*35\.0116/);
  assert.match(dataJs, /lng:\s*135\.7681/);
  assert.match(dataJs, /lat:\s*51\.7548/);
  assert.match(dataJs, /lng:\s*-1\.2544/);

  // Verify slippy tile math and dual-theme fallback SVG
  assert.match(appJs, /tile\.openstreetmap\.org/);
  assert.match(appJs, /FOOBOW_MAP_TILE_URL/);
  assert.match(appJs, /referrerPolicy = "no-referrer-when-downgrade"/);
  assert.match(appJs, /crossOrigin = "anonymous"/);
  assert.match(appJs, /%23f7f3eb/); // light mode parchment
  assert.match(appJs, /%23052f31/); // dark mode sanctuary
});

