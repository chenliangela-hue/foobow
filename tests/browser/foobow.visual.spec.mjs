import { expect, test } from "@playwright/test";
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

async function freezeSanctuaryCanvas(page) {
  await page.evaluate(() => window.FoobowGame3D.renderStill());
}

async function seedSanctuaryRandom(page) {
  await page.evaluate(() => {
    let seed = 246813579;
    Math.random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  });
}

test("landing hero visual baseline", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(landingUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator(".hero").waitFor();
  // The blessing rotator content changes daily, so mask it for a stable baseline.
  await expect(page.locator(".hero")).toHaveScreenshot("landing-hero.png", {
    animations: "disabled",
    mask: [page.locator(".phrase-rotator")],
    maxDiffPixelRatio: 0.006
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
  await expect(page.locator("#quietMomentsHub")).toHaveScreenshot("storybook-ritual-gallery.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.008
  });
});

test("storybook wooden fish ritual visual baseline", async ({ page }) => {
  await page.locator('.bottom-nav .nav-item[data-target="blessings"]').click();
  await page.locator('[data-play-ritual="muyu"]').click();
  await expect(page.locator("#ritualFocusDialog")).toHaveScreenshot("storybook-wooden-fish.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.008
  });
});

test("storybook East Lake sanctuary visual baseline", async ({ page }) => {
  await seedSanctuaryRandom(page);
  await page.locator('.bottom-nav .nav-item[data-target="deeds"]').click();
  await page.locator("#open3DDeedGameBtn").click();
  await page.waitForTimeout(400);
  await freezeSanctuaryCanvas(page);
  await expect(page.locator("#sanctuary3DGameModal")).toHaveScreenshot("storybook-east-lake-sanctuary.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.01
  });
});

const storybookWorldScenarios = [
  ["toronto-crosswalk", "Toronto crosswalk", "storybook-toronto-crosswalk.png"],
  ["amazon-grove", "Amazon grove", "storybook-amazon-grove.png"],
  ["night-corridor", "Kyoto river", "storybook-kyoto-river.png"],
  ["reading-room", "Oxford reading room", "storybook-oxford-reading-room.png"]
];

for (const [scenario, label, snapshot] of storybookWorldScenarios) {
  test(`storybook ${label} visual baseline`, async ({ page }) => {
    await seedSanctuaryRandom(page);
    await page.locator('.bottom-nav .nav-item[data-target="deeds"]').click();
    await page.locator("#open3DDeedGameBtn").click();
    await page.locator(`.game-scenario-tab[data-scenario="${scenario}"]`).click();
    await page.waitForTimeout(400);
    await freezeSanctuaryCanvas(page);
    await expect(page.locator("#sanctuary3DGameModal")).toHaveScreenshot(snapshot, {
      animations: "disabled",
      maxDiffPixelRatio: 0.01
    });
  });
}

test("gratitude pebble garden visual baseline", async ({ page }) => {
  await page.locator('.bottom-nav .nav-item[data-target="blessings"]').click();
  await page.locator('[data-play-ritual="gratitudeGarden"]').click();
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
