import { expect, test } from "@playwright/test";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TDD: written before the catalog was expanded and grouped. Describes the
// ODD "Deed Type" catalog organised into project categories (a Project
// Category groups reusable Deed Types the way kindness apps like BeKind and
// the Great Kindness Challenge group their idea lists).

const appUrl = pathToFileURL(`${path.resolve(__dirname, "../../prototype/app/index.html")}`).toString();

const PROJECT_CATEGORIES = ["animals", "elders", "environment", "community", "learning"];
const TOTAL_DEEDS = 19;

test.beforeEach(async ({ page }) => {
  await page.goto(appUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator(".app-shell").waitFor();
  await page.locator(".bottom-nav .nav-item[data-target='deeds']").click();
  await expect(page.locator("#screen-deeds")).toHaveClass(/active/);
});

test("catalog is grouped into the five project categories", async ({ page }) => {
  await expect(page.locator(".deed-group")).toHaveCount(PROJECT_CATEGORIES.length);
  for (const category of PROJECT_CATEGORIES) {
    await expect(page.locator(`.deed-group[data-category="${category}"] .deed-group-title`)).toBeVisible();
  }
});

test("the catalog holds a rich set of deeds", async ({ page }) => {
  await expect(page.locator(".deed-item")).toHaveCount(TOTAL_DEEDS);
  await expect(page.locator("#deedTypeCount")).toHaveText(`${TOTAL_DEEDS} shown`);
  // Each category carries more than one deed now.
  for (const category of PROJECT_CATEGORIES) {
    const count = await page.locator(`.deed-group[data-category="${category}"] .deed-item`).count();
    expect(count, `${category} deed count`).toBeGreaterThanOrEqual(3);
  }
});

test("filtering collapses the catalog to a single category group", async ({ page }) => {
  await page.locator("#deedCategoryRow .layer[data-category-id='elders']").click();
  await expect(page.locator(".deed-group")).toHaveCount(1);
  await expect(page.locator(".deed-group[data-category='elders']")).toBeVisible();
  await expect(page.locator(".deed-group[data-category='animals']")).toHaveCount(0);

  await page.locator("#deedCategoryRow .layer[data-category-id='all']").click();
  await expect(page.locator(".deed-group")).toHaveCount(PROJECT_CATEGORIES.length);
});

test("selecting a newly added deed updates the ritual preview", async ({ page }) => {
  const plant = page.locator(".deed-item", { hasText: "Plant a tree" }).first();
  await plant.click();
  await expect(page.locator("#ritualTitle")).toContainText("Plant a tree");
});

test("group headers are localized", async ({ page }) => {
  await expect(page.locator(".deed-group[data-category='animals'] .deed-group-title")).toHaveText("Animals");
  await page.selectOption("#languageSelect", "zh-Hans");
  await expect(page.locator(".deed-group[data-category='animals'] .deed-group-title")).toHaveText("动物");
});

test("ritual preview: animated lotus pond and swimming koi swoops on perform", async ({ page }) => {
  await expect(page.locator("#ritualScene")).toHaveClass(/pond-scene/);
  await expect(page.locator(".pond-lotus")).toBeVisible();
  await expect(page.locator(".koi-main")).toBeVisible();

  await page.locator("#performRitual").click();
  await expect(page.locator("#ritualScene")).toHaveClass(/completed/);
  await expect(page.locator("#koiReleased")).toBeVisible();
  await expect(page.locator("#ritualDedication")).toBeVisible();
});

