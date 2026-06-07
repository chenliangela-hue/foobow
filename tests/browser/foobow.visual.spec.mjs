import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";

const prototypeUrl = pathToFileURL(`${process.cwd()}/prototype/index.html`).toString();

async function resetPrototype(page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(prototypeUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator(".app-shell").waitFor();
}

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
  await page.locator("#mapLayerRow").getByRole("button", { name: "Nature" }).click();
  await expect(page.locator("#screen-map")).toHaveScreenshot("map-environment-screen.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.006
  });
});

test("dark community visual baseline", async ({ page }) => {
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await page.getByRole("button", { name: "Community" }).click();
  await page.locator("#blessingInput").fill("May your next step feel lighter.");
  await page.getByRole("button", { name: "Send blessing" }).click();

  await expect(page.locator("#screen-community")).toHaveScreenshot("community-dark-screen.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.006
  });
});
