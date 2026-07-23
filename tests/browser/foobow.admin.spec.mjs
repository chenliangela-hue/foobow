import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";

const adminUrl = pathToFileURL(`${process.cwd()}/prototype/admin/index.html`).toString();

test.beforeEach(async ({ page }) => {
  await page.goto(adminUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator(".admin-shell").waitFor();
});

test("dashboard shows income cards, stat tiles, and the demo badge", async ({ page }) => {
  await expect(page.locator("#demoBadge")).toBeVisible();
  await expect(page.locator(".income-card")).toHaveCount(2);
  await expect(page.locator(".income-card.today .income-value")).toContainText("317.40");
  await expect(page.locator(".income-card.total .income-value")).toContainText("979.80");
  // Four user tiles + four order tiles.
  await expect(page.locator(".stat-tile")).toHaveCount(8);
  // Ethics: income framed as support/donations, never buying luck.
  await expect(page.locator(".income-note")).toContainText(/never|buying luck|不购买好运|购买好运/);
});

test("logo returns to the main site", async ({ page }) => {
  await expect(page.locator(".side-brand")).toHaveAttribute("href", "/");
});

test("sidebar navigation switches sections", async ({ page }) => {
  await page.getByRole("button", { name: /Order review|订单审核/ }).click();
  await expect(page.locator("#viewTitle")).toHaveText(/Order review|订单审核/);
  await expect(page.locator(".table-wrap")).toBeVisible();

  await page.getByRole("button", { name: /^Users$|用户列表/ }).click();
  await expect(page.locator("table")).toBeVisible();

  await page.getByRole("button", { name: /Pricing|商品定价/ }).click();
  await expect(page.locator(".section-note")).toBeVisible();

  await page.getByRole("button", { name: /Audit log|审计日志/ }).click();
  await expect(page.locator("table")).toBeVisible();

  await page.getByRole("button", { name: /Settings|系统配置/ }).click();
  await expect(page.locator("#apiUrlInput")).toBeVisible();
});

test("an order can be approved and leaves the review queue", async ({ page }) => {
  await page.getByRole("button", { name: /Order review|订单审核/ }).click();
  const rowsBefore = await page.locator("tbody tr").count();
  await page.getByRole("button", { name: /^Approve$|^通过$/ }).first().click();
  await expect(page.locator("tbody tr")).toHaveCount(rowsBefore - 1);
});

test("language can switch between Chinese and English", async ({ page }) => {
  await page.selectOption("#langSelect", "zh");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");
  await expect(page.locator("#viewTitle")).toHaveText("数据看板");

  await page.selectOption("#langSelect", "en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#viewTitle")).toHaveText("Dashboard");
});
