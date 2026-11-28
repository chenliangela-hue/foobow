import { expect, test } from "@playwright/test";

// Skipped cases exercise the retired web game lineup.
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prototypeUrl = pathToFileURL(path.resolve(__dirname, "../../prototype/app/index.html")).toString();
const landingUrl = pathToFileURL(path.resolve(__dirname, "../../prototype/index.html")).toString();

async function resetPrototype(page) {
  await page.clock.install({ time: new Date("2026-10-12T12:00:00-04:00") });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(prototypeUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator(".app-shell").waitFor();
}

test("landing hero visual baseline", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(landingUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator(".hero").waitFor();
  // The blessing rotator content changes daily, so mask it for a stable baseline.
  // Hosted Windows uses a different glyph rasterizer than local Windows. Keep
  // enough tolerance for those edge pixels while preserving layout detection.
  await expect(page.locator(".hero")).toHaveScreenshot("landing-hero.png", {
    animations: "disabled",
    mask: [page.locator(".phrase-rotator")],
    maxDiffPixelRatio: 0.015
  });
});

test("landing Quiet Moments preview visual baseline", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(landingUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator(".quiet-preview")).toHaveScreenshot("landing-quiet-moments.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.006
  });
});

test.skip("Wish Lamp workshop visual baseline", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const workshopUrl = pathToFileURL(path.resolve(__dirname, "../../prototype/play/lamp/index.html")).toString();
  await page.goto(workshopUrl);
  await page.getByRole("button", { name: "Place the wick" }).press("Enter");
  await page.getByRole("button", { name: "Fit the paper shade" }).press("Enter");
  await page.getByRole("button", { name: "Light the wick" }).press("Enter");
  await expect(page.locator(".workshop")).toHaveScreenshot("wish-lamp-workshop.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.008
  });
});

test.skip("Incense Courtyard smoke-free scene visual baseline", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const courtyardUrl = pathToFileURL(path.resolve(__dirname, "../../prototype/play/courtyard/index.html")).toString();
  await page.goto(courtyardUrl);
  await page.getByRole("button", { name: "Wind chime" }).press("Enter");
  await expect(page.locator(".courtyard")).toHaveScreenshot("incense-courtyard.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.008
  });
});

test.describe("app screens", () => {
  test.beforeEach(async ({ page }) => {
    await resetPrototype(page);
  });

test("today screen visual baseline", async ({ page }) => {
  await expect(page.locator(".app-shell")).toHaveScreenshot("today-screen.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.006
  });
});

test("map exploration visual baseline", async ({ page }) => {
  await page.getByRole("button", { name: "Map" }).click();
  await page.locator("#mapLayerRow").getByRole("button", { name: "Environment" }).click();
  await page.locator("#globeParticlesCanvas").evaluate((canvas) => {
    canvas.style.visibility = "hidden";
  });
  await expect(page.locator("#screen-map")).toHaveScreenshot("map-environment-screen.png", {
    animations: "disabled",
    mask: [page.locator("#mapKindnessStreamBar")],
    maxDiffPixelRatio: 0.006
  });
});

test("real-world journey picker visual baseline", async ({ page }) => {
  await page.locator('.bottom-nav .nav-item[data-target="map"]').click();
  await expect(page.locator(".world-journeys")).toHaveScreenshot("map-world-journeys.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.006
  });
});

test("storybook ritual gallery visual baseline", async ({ page }) => {
  await page.locator('.bottom-nav .nav-item[data-target="blessings"]').click();
  await expect(page.locator(".games-gallery")).toHaveScreenshot("storybook-ritual-gallery.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.008
  });
});

test.skip("storybook wooden fish ritual visual baseline", async ({ page }) => {
  await page.locator('.bottom-nav .nav-item[data-target="blessings"]').click();
  await page.locator('.games-gallery [data-play-ritual="muyu"]').click();
  await expect(page.locator("#ritualFocusDialog")).toHaveScreenshot("storybook-wooden-fish.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.008
  });
});

const storybookQuietRituals = [
  ["incense", "incense", "storybook-incense.png"],
  ["wheel", "prayer wheel", "storybook-prayer-wheel.png"],
  ["breathe", "mindful breath", "storybook-mindful-breath.png"]
];

for (const [ritual, label, snapshot] of storybookQuietRituals) {
  test(`storybook ${label} ritual visual baseline`, async ({ page }) => {
    await page.locator('.bottom-nav .nav-item[data-target="blessings"]').click();
    await page.locator(`.quiet-game[data-play-ritual="${ritual}"]`).evaluate(button => button.click());
    await page.waitForTimeout(600);
    await expect(page.locator("#ritualFocusDialog")).toHaveScreenshot(snapshot, {
      animations: "disabled",
      maxDiffPixelRatio: 0.008
    });
  });
}

test.skip("gratitude pebble garden visual baseline", async ({ page }) => {
  await page.locator('.bottom-nav .nav-item[data-target="blessings"]').click();
  await page.locator('.games-gallery [data-play-ritual="gratitudeGarden"]').click();
  await page.locator("#gratitudeMoment1").fill("Warm tea before sunrise");
  await page.locator("#gratitudeMoment2").fill("A kind message from a friend");
  await page.locator("#gratitudeMoment3").fill("Rain on the garden");
  await page.locator("#settleGratitudeBtn").click();
  await page.locator("#gratitudePond").evaluate((pond) => pond.classList.remove("celebrating"));
  await expect(page.locator("#ritualFocusDialog")).toHaveScreenshot("gratitude-pebble-garden.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.008
  });
});

test.skip("kindness quest visual baseline", async ({ page }) => {
  await seedSanctuaryRandom(page);
  await page.locator('.bottom-nav .nav-item[data-target="blessings"]').click();
  await page.locator('#quietMomentsHub [data-play-ritual="kindnessQuest"]').evaluate(button => button.click());
  await page.locator("#drawKindnessQuest").click();
  await page.locator("#kindnessMissionCard").evaluate((card) => card.classList.remove("revealing"));
  await expect(page.locator("#ritualFocusDialog")).toHaveScreenshot("kindness-quest.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.008
  });
});

test.skip("five senses grounding garden visual baseline", async ({ page }) => {
  await page.locator('.bottom-nav .nav-item[data-target="blessings"]').click();
  await page.locator('#quietMomentsHub [data-play-ritual="fiveSenses"]').evaluate(button => button.click());
  await page.locator("#noticeSenseBtn").click();
  await expect(page.locator("#ritualFocusDialog")).toHaveScreenshot("five-senses-garden.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.008
  });
});

test.skip("loving-kindness lantern journey visual baseline", async ({ page }) => {
  await page.locator('.bottom-nav .nav-item[data-target="blessings"]').click();
  await page.locator('#quietMomentsHub [data-play-ritual="lantern"]').evaluate(button => button.click());
  await page.locator("#offerLanternWish").click();
  await page.locator("#offerLanternWish").click();
  await expect(page.locator("#ritualFocusDialog")).toHaveScreenshot("loving-kindness-lantern.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.008
  });
});

test("dark community visual baseline", async ({ page }) => {
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await page.getByRole("button", { name: "Community" }).click();
  await page.locator("#blessingInput").fill("May your next step feel lighter.");
  await page.getByRole("button", { name: "Send blessing" }).click();

  // The community screen now hosts the feed; wait for it to settle so the
  // shot is not raced by its first render.
  await page.locator("#feedList").waitFor();
  await expect(page.locator(".feed-empty")).toBeVisible();

  // This screen is the most text-dense (feed composer + filters + wall), so
  // cross-machine font antialiasing (local win32 vs the CI windows runner)
  // scatters ~2% of pixels along glyph edges. A wider ratio absorbs that
  // while still catching real regressions (a palette or layout change moves
  // far more than 3% of pixels).
  await expect(page.locator("#screen-community")).toHaveScreenshot("community-dark-screen.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.03
  });
});
});
