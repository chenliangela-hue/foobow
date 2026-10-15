import { expect, test } from "@playwright/test";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

const appUrl = pathToFileURL(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../prototype/app/index.html")).toString();

test.beforeEach(async ({ page }) => {
  await page.goto(appUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("Quiet Moments hub opens an immersive wooden fish and returns focus", async ({ page }) => {
  await page.locator("#viewAllRitualsBtn").click();
  await expect(page.locator("#quietMomentsHub")).toBeVisible();
  await page.locator('#quietMomentsHub [data-play-ritual="muyu"]').click();
  await expect(page.locator("#ritualFocusDialog")).toHaveJSProperty("open", true);
  await expect(page.locator("#ritualFocusDialog #muyuBtn")).toBeVisible();
  await page.locator("#ritualFocusDialog #muyuBtn").click();
  await expect(page.locator("#muyuCount")).toHaveText("1");
  await page.keyboard.press("Escape");
  await expect(page.locator("#ritualFocusDialog")).not.toHaveJSProperty("open", true);
  await expect(page.locator("#quietMomentsHub")).toBeVisible();
});

test("Today ritual card opens the lamp in the same play view", async ({ page }) => {
  await page.locator('[data-quick-ritual="lamp"]').click();
  await expect(page.locator("#ritualFocusDialog #lampWish")).toBeVisible();
  await page.locator("#ritualFocusClose").click();
  await expect(page.locator("#screen-today")).toBeVisible();
});

test("Quiet Moments responds to mood, locale, and lantern choice", async ({ page }) => {
  await page.locator("#viewAllRitualsBtn").click();
  await page.locator('[data-quiet-mood="gratitude"]').click();
  await expect(page.locator("#quietFeaturePrompt")).toContainText("Notice one thing");
  await page.locator("#languageSelect").selectOption("zh-Hans");
  await expect(page.locator("#quietHubTitle")).toHaveText("静心片刻");
  await expect(page.locator("#quietFeaturePrompt")).toContainText("值得珍惜");
  for (const locale of ["fr", "es", "th", "ja", "en"]) {
    await page.locator("#languageSelect").selectOption(locale);
    await expect(page.locator("#quietHubTitle")).not.toBeEmpty();
    await expect(page.locator('[data-play-ritual="muyu"] strong')).not.toBeEmpty();
  }
  await page.locator('[data-play-ritual="lantern"]').click();
  await expect(page.locator("#sanctuary3DGameModal")).toBeVisible();
});
