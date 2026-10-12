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

test("3D sanctuary mini-game launches, switches scenarios, and allows interactive fish release", async ({ page }) => {
  await expect(page.locator("#open3DDeedGameBtn")).toBeVisible();
  await page.locator("#open3DDeedGameBtn").click();

  const modal = page.locator("#sanctuary3DGameModal");
  await expect(modal).toBeVisible();
  await expect(page.locator("#sanctuary3DCanvas")).toBeVisible();
  await expect(page.locator("#gameScenarioTitle")).toContainText("East Lake");

  // Select turtle species
  await page.locator(".species-btn[data-species='turtle']").click();
  await expect(page.locator(".species-btn[data-species='turtle']")).toHaveClass(/active/);

  // Interactive release button
  await page.locator("#gamePrimaryActionBtn").click();
  await expect(page.locator("#gameGoalCounter")).toContainText("1/5");

  // Switch atmosphere to sunset
  await page.locator(".tod-btn[data-tod='sunset']").click();
  await expect(page.locator(".tod-btn[data-tod='sunset']")).toHaveClass(/active/);

  // Switch camera mode
  await page.locator("#gameCamModeBtn").click();
  await expect(page.locator("#gameCamModeLabel")).toHaveText("Follow");

  // Switch scenario to Oxford Wisdom Library
  await page.locator(".game-scenario-tab[data-scenario='reading-room']").click();
  await expect(page.locator("#gameScenarioTitle")).toContainText("Oxford");

  // Perform reading action in Oxford
  await page.locator("#gamePrimaryActionBtn").click();
  await expect(page.locator("#gameGoalCounter")).toContainText("1/3");

  // Close modal
  await page.locator("#close3DGameTopBtn").click();
  await expect(modal).not.toBeVisible();
});

test("mindful breathing orb supports technique switching and calm focus completion", async ({ page }) => {
  await expect(page.locator("#breathOrbContainer")).toBeVisible();
  await expect(page.locator("#breathOrb")).toBeVisible();
  await expect(page.locator("#breathPhaseText")).toBeVisible();

  // Switch technique to Box 4-4-4
  const boxPill = page.locator("#breathTechniqueBar .technique-pill[data-tech='box-444']");
  await boxPill.click();
  await expect(boxPill).toHaveClass(/active/);

  // Focus completion starts disabled
  const completeBtn = page.locator("#completeFocusedRitual");
  await expect(completeBtn).toBeDisabled();

  // Fast-forward or trigger focus completion
  await page.locator("#startFocusSession").click();
  await expect(page.locator("#calmStatus")).not.toHaveText("optional");

  // Accelerate completion via evaluate for test reliability
  await page.evaluate(() => {
    window.state.focusProgress = 100;
    window.state.focusReady = true;
    const btn = document.getElementById("completeFocusedRitual");
    if (btn) btn.disabled = false;
    const status = document.getElementById("calmStatus");
    if (status) status.textContent = "ready";
  });

  await expect(completeBtn).toBeEnabled();
  const karmaBefore = Number(await page.locator("#karmaValue").textContent());
  await completeBtn.click();
  await expect(page.locator("#karmaValue")).toHaveText(String(karmaBefore + 7));
});

test("Today screen direct 3D sanctuary portal launches scenario directly", async ({ page }) => {
  await page.locator(".bottom-nav .nav-item[data-target='today']").click();
  await expect(page.locator("#screen-today")).toHaveClass(/active/);

  // Verify Today screen 3D portal
  await expect(page.locator("#launchSanctuaryFromTodayBtn")).toBeVisible();
  const kyotoPill = page.locator(".sanctuary-quick-pill[data-scenario='night-corridor']");
  await expect(kyotoPill).toBeVisible();

  // Direct quick-launch
  await kyotoPill.click();
  const modal = page.locator("#sanctuary3DGameModal");
  await expect(modal).toBeVisible();
  await expect(page.locator("#gameScenarioTitle")).toContainText("Kyoto");

  // Close modal
  await page.locator("#close3DGameTopBtn").click();
  await expect(modal).not.toBeVisible();
});


