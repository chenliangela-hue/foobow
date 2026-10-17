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
  await expect(page.locator("#viewAllRitualsBtn")).toHaveText("Explore all seven rituals →");
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

test("landing deep link opens the Quiet Moments hub", async ({ page }) => {
  await page.goto(`${appUrl}?view=rituals`);
  await expect(page.locator("#screen-blessings")).toBeVisible();
  await expect(page.locator("#quietMomentsHub")).toBeVisible();
  await expect(page.locator(".top-nav-item[data-target=blessings]")).toHaveClass(/active/);
});

test("Gratitude Pebble Garden settles three private good moments", async ({ page }) => {
  await page.locator("#viewAllRitualsBtn").click();
  const opener = page.locator('[data-play-ritual="gratitudeGarden"]');
  await opener.click();

  await expect(page.locator("#ritualFocusDialog #gratitudeGardenCard")).toBeVisible();
  await expect(page.locator("#gratitudeGardenForm input")).toHaveCount(3);
  await expect(page.locator("#settleGratitudeBtn")).toBeDisabled();

  await page.locator("#gratitudeMoment1").fill("Warm tea before sunrise");
  await page.locator("#gratitudeMoment2").fill("A kind message from a friend");
  await page.locator("#gratitudeMoment3").fill("Rain on the garden");
  await expect(page.locator("#settleGratitudeBtn")).toBeEnabled();
  await page.locator("#settleGratitudeBtn").click();

  await expect(page.locator("#gratitudePond .gratitude-pebble")).toHaveCount(3);
  await expect(page.locator("#gratitudeGardenStatus")).toContainText("settled");
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("foobow.peaceGarden.v1")).sessions)).toBe(1);

  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
});

test("Gratitude Pebble Garden localizes its private reflection copy", async ({ page }) => {
  await page.locator("#viewAllRitualsBtn").click();
  await page.locator("#languageSelect").selectOption("zh-Hans");
  await page.locator('[data-play-ritual="gratitudeGarden"]').click();

  await expect(page.locator("#ritualFocusTitle")).toHaveText("感恩石庭");
  await expect(page.locator("#gratitudeGardenTitle")).toContainText("三件美好");
  await expect(page.locator("#gratitudePrivacyNote")).toContainText("此设备只会保存");
});
