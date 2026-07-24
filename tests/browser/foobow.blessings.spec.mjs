import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";

const appUrl = pathToFileURL(`${process.cwd()}/prototype/app/index.html`).toString();

test.beforeEach(async ({ page }) => {
  await page.goto(appUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator(".app-shell").waitFor();
  // Enter the Blessings screen via the bottom nav (scoped to avoid the
  // "Blessings" deed-category filter of the same name).
  await page.locator(".bottom-nav").getByRole("button", { name: "Blessings" }).click();
  await expect(page.locator("#screen-blessings")).toHaveClass(/active/);
});

test("pray for someone: pick a category, receive a mock blessing, keep it", async ({ page }) => {
  await page.getByRole("button", { name: "Health" }).click();
  await page.locator("#prayRecipient").fill("Mom");
  await page.getByRole("button", { name: "Receive a blessing" }).click();

  // Mock engine composes a warm, recipient-aware blessing (never a promise).
  await expect(page.locator("#blessingReplyText")).toContainText("For Mom", { timeout: 5000 });
  await expect(page.locator("#blessingReplySource")).toContainText(/symbolic comfort/);

  const karmaBefore = Number(await page.locator("#karmaValue").textContent());
  await page.getByRole("button", { name: "Keep this blessing" }).click();
  await expect(page.locator("#karmaValue")).toHaveText(String(karmaBefore + 1));
});

test("wish lamp: lighting adds a lamp and records the wish", async ({ page }) => {
  await expect(page.locator("#lampCount")).toHaveText("0");
  await page.locator("#lampWish").fill("safe travels home");
  await page.getByRole("button", { name: "Light the lamp" }).click();

  await expect(page.locator("#lampCount")).toHaveText("1");
  await expect(page.locator(".lamp-item")).toHaveCount(1);
  await expect(page.locator(".lamp-item").first()).toContainText("safe travels home");
  // The lamp glow triggers.
  await expect(page.locator("#lampStage")).toHaveClass(/lit/);
});

test("profile records progress and a running activity history", async ({ page }) => {
  await page.locator("#lampWish").fill("peace");
  await page.getByRole("button", { name: "Light the lamp" }).click();
  await page.locator(".bottom-nav .nav-item[data-target='profile']").click();

  // Progress toward the next milestone.
  await expect(page.locator("#progressNext")).not.toBeEmpty();
  await expect(page.locator(".milestone")).toHaveCount(5);
  await expect(page.locator(".milestone.reached").first()).toBeVisible();

  // The lamp shows up in the activity history.
  await expect(page.locator(".activity-item")).toHaveCount(1);
  await expect(page.locator(".activity-item .activity-text").first()).toHaveText("Lit a wish lamp");

  // History survives a reload.
  await page.reload();
  await page.locator(".bottom-nav .nav-item[data-target='profile']").click();
  await expect(page.locator(".activity-item")).toHaveCount(1);
});

test("kept blessings and lamps persist across reload", async ({ page }) => {
  await page.locator("#lampWish").fill("a quiet year");
  await page.getByRole("button", { name: "Light the lamp" }).click();
  await expect(page.locator("#lampCount")).toHaveText("1");

  await page.reload();
  await page.locator(".bottom-nav").getByRole("button", { name: "Blessings" }).click();
  await expect(page.locator("#lampCount")).toHaveText("1");
  await expect(page.locator(".lamp-item").first()).toContainText("a quiet year");
});
