import { test } from "@playwright/test";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prototypeUrl = pathToFileURL(path.resolve(__dirname, "../../prototype/app/index.html")).toString();
const scratchDir = "C:/Users/crane/.gemini/antigravity/brain/994ca95f-726c-4baa-b92c-f85f4f31808d/scratch";

test("capture PAQA screenshots across screens", async ({ page }, testInfo) => {
  const project = testInfo.project.name;
  await page.goto(prototypeUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(600);

  // 1. Today screen with Zen Almanac & MiniPlayer
  await page.screenshot({ path: `${scratchDir}/paqa-${project}-today.png`, fullPage: true });

  // 2. Blessings screen
  await page.locator('.bottom-nav button[data-target="blessings"], .top-nav a[data-target="blessings"]').filter({ visible: true }).first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${scratchDir}/paqa-${project}-blessings.png`, fullPage: true });

  // 3. Open Sanskrit Chants Modal
  await page.locator("#openChantsHeaderBtn").click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${scratchDir}/paqa-${project}-chants-modal.png` });
  await page.locator("#closeChantsBtn").click();
  await page.waitForTimeout(300);

  // 4. Map screen with in-map deed deck and live action
  await page.locator('.bottom-nav button[data-target="map"], .top-nav a[data-target="map"]').filter({ visible: true }).first().click();
  await page.waitForTimeout(400);
  await page.locator('.deck-deed-btn[data-deed="release-fish"]').click();
  await page.locator("#performMapDeedBtn").click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${scratchDir}/paqa-${project}-map-action.png`, fullPage: true });
});
