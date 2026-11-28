import { expect, test } from "@playwright/test";

// Skipped cases exercise the retired web game lineup.
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

test.skip("opening Oxford directly keeps its selected scenario tab visible", async ({ page }) => {
  await page.evaluate(() => window.FoobowGame3D.open("reading-room"));
  const tab = page.locator(".game-scenario-tab[data-scenario='reading-room']");
  await expect(tab).toHaveAttribute("aria-selected", "true");
  await expect(tab).toBeInViewport({ ratio: 0.9 });
});

test.skip("East Lake approval sample guides one koi through a safe journey without duplicate rewards", async ({ page }) => {
  await page.evaluate(() => window.FoobowGame3D.open("east-lake"));

  const modal = page.locator("#sanctuary3DGameModal");
  await expect(modal).toBeVisible();
  await expect(modal).toHaveAttribute("data-visual-style", "storybook-sanctuary");
  await expect(page.locator("#sanctuary3DCanvas")).toBeVisible();
  await expect(page.locator("#gameScenarioTitle")).toContainText("East Lake");
  await expect(page.locator("#gameScenarioStory")).toContainText("rescued koi");
  await expect(page.locator(".game-scenario-tab[data-scenario='east-lake']")).toHaveAttribute("aria-selected", "true");

  await expect(page.locator("#eastLakeJourneyPanel")).toBeVisible();
  await expect(page.locator("#eastLakeJourneyStatus")).toContainText("Choose your koi");

  // Choose a koi, open the basket, and reveal the safe-path decision.
  await page.locator(".species-btn[data-species='kohaku']").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".species-btn[data-species='kohaku']")).toHaveClass(/active/);
  await expect(page.locator("#gamePrimaryActionBtn")).toContainText("Open basket");
  await page.locator("#gamePrimaryActionBtn").click();
  await expect(page.locator("#eastLakePathChoices")).toBeVisible();
  await expect(page.locator("#gamePrimaryActionBtn")).toBeDisabled();

  // The same path choice and completion are available from the keyboard.
  await page.locator(".east-lake-path[data-path='reeds']").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".east-lake-path[data-path='reeds']")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#gamePrimaryActionBtn")).toContainText("Guide to the reeds");

  const karmaBefore = Number(await page.locator("#karmaValue").textContent());
  await page.locator("#gamePrimaryActionBtn").click();
  await expect(page.locator("#eastLakeJourneyStatus")).toContainText("settled safely");
  await expect(page.locator("#gameGoalCounter")).toContainText("Journey complete");
  await expect(page.locator("#gamePrimaryActionBtn")).toBeDisabled();
  await expect(page.locator("#karmaValue")).toHaveText(String(karmaBefore + 5));

  // A completed journey cannot be clicked again to farm the reward.
  await page.locator("#gamePrimaryActionBtn").press("Enter", { force: true });
  await expect(page.locator("#karmaValue")).toHaveText(String(karmaBefore + 5));

  // Switch atmosphere to sunset
  await page.locator(".tod-btn[data-tod='sunset']").click();
  await expect(page.locator(".tod-btn[data-tod='sunset']")).toHaveClass(/active/);

  // Switch scenario to Oxford Wisdom Library
  await page.locator(".game-scenario-tab[data-scenario='reading-room']").click();
  await expect(page.locator("#gameScenarioTitle")).toContainText("Oxford");
  await expect(modal).toHaveAttribute("data-scenario", "reading-room");
  await expect(page.locator(".game-scenario-tab[data-scenario='east-lake']")).toHaveAttribute("aria-selected", "false");
  await expect(page.locator(".game-scenario-tab[data-scenario='reading-room']")).toHaveAttribute("aria-selected", "true");

  // Perform reading action in Oxford
  await page.locator("#gamePrimaryActionBtn").click();
  await expect(page.locator("#gameGoalCounter")).toContainText("1/3");

  // Close modal
  await page.locator("#close3DGameTopBtn").click();
  await expect(modal).not.toBeVisible();
});

test("world journeys support location-aware virtual fish releases in the US and Japan", async ({ page }) => {
  await page.locator('.bottom-nav .nav-item[data-target="map"]').click();

  const merritt = page.locator('[data-journey-id="lake-merritt"]');
  const biwa = page.locator('[data-journey-id="lake-biwa"]');
  await expect(merritt).toContainText("Lake Merritt");
  await expect(biwa).toContainText("Lake Biwa");
  await expect(page.locator("#journeySafetyNote")).toContainText("entirely virtual");

  await merritt.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#spotName")).toContainText("Lake Merritt");
  await expect(page.locator("#embeddedOsmViewport")).toBeVisible();
  await expect(page.locator('.deck-deed-btn[data-deed="release-fish"]')).toHaveClass(/active/);

  await page.locator("#performMapDeedBtn").click();
  await expect(merritt.locator(".journey-count")).toContainText("1 virtual deed");
  await page.reload();
  await page.locator('.bottom-nav .nav-item[data-target="map"]').click();
  await expect(page.locator('[data-journey-id="lake-merritt"] .journey-count')).toContainText("1 virtual deed");

  await page.selectOption("#languageSelect", "ja");
  await expect(page.locator('[data-journey-id="lake-biwa"]')).toContainText("琵琶湖");
  await biwa.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#spotName")).toContainText("琵琶湖");
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

  // Complete the real breathing cycle with a virtual clock.
  await page.clock.install();
  await page.locator("#startFocusSession").click();
  await expect(page.locator("#calmStatus")).not.toHaveText("optional");
  await page.clock.runFor(16000);

  await expect(completeBtn).toBeEnabled();
  const karmaBefore = Number(await page.locator("#karmaValue").textContent());
  await completeBtn.click();
  await expect(page.locator("#karmaValue")).toHaveText(String(karmaBefore + 7));
});

test.skip("Today routes to the new games and the gallery opens Kyoto directly", async ({ page }) => {
  await page.locator(".bottom-nav .nav-item[data-target='today']").click();
  await expect(page.locator("#screen-today")).toHaveClass(/active/);

  await expect(page.locator(".experience-feature a[data-experience=playKoi]")).toHaveAttribute("href", /sanctuary\/dive\//);
  await page.locator(".experience-feature [data-experience=browse]").click();
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

test.skip("Kyoto lantern can be folded, placed and settled in reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".bottom-nav .nav-item[data-target='today']").click();
  await page.locator(".experience-feature [data-experience=browse]").click();
  const merit = await page.locator("#karmaValue").textContent();
  await page.locator(".game-tile-river").click();
  await page.getByRole("button", { name: "Fold lantern" }).press("Enter");
  await page.getByRole("button", { name: "Place on the water" }).click();
  await expect(page.locator("#kyotoStatus")).toContainText("joined the lights");
  await expect(page.getByRole("button", { name: "Fold another lantern" })).toBeVisible();
  await expect(page.locator("#gameComboBadge")).toBeHidden();
  await expect(page.locator("#karmaValue")).toHaveText(merit);
});

test.skip("Kyoto offers a motion pause and one completion when a drifting lantern is skipped", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator(".bottom-nav .nav-item[data-target='today']").click();
  await page.locator(".experience-feature [data-experience=browse]").click();
  await page.locator(".game-tile-river").click();
  await page.getByRole("button", { name: "Fold lantern" }).click();
  const place = page.getByRole("button", { name: "Place on the water" });
  if (info.project.use.hasTouch) await place.tap();
  else await place.click();
  await expect(page.locator("#kyotoStatus")).toContainText("drift");
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(page.getByRole("button", { name: "Resume motion" })).toBeVisible();
  await page.getByRole("button", { name: "Skip to the river bend" }).press("Enter");
  await expect(page.getByRole("button", { name: "Fold another lantern" })).toBeFocused();
  await expect(page.locator("#gameGoalCounter")).toContainText("1/5");
  await page.getByRole("button", { name: "Fold another lantern" }).click();
  await expect(page.locator("#gameGoalCounter")).toContainText("1/5");
});

test("Deeds preserves the saved garden after retiring the seedling game", async ({ page }) => {
  await page.evaluate(() => localStorage.setItem("foobow.kindnessGarden", JSON.stringify([{ species: "bamboo" }])));
  await page.reload();
  await page.locator(".bottom-nav .nav-item[data-target='deeds']").click();
  await expect(page.locator("#kindnessGardenShelf")).toBeVisible();
  await expect(page.locator("#gardenPlantsGrid .garden-plant-item")).toHaveText(/Bamboo/);
  await expect(page.locator("#draggableSeed")).toHaveCount(0);
});

test.skip("sanctuary night lantern release game soars skyward and updates persistent profile lights", async ({ page }) => {
  await page.locator(".bottom-nav .nav-item[data-target='deeds']").click();
  
  // Select blessing deed to show blessing layer with sanctuary lantern sky
  const blessingDeed = page.locator(".deed-item[data-deed-id='anonymous-blessing']").first();
  await blessingDeed.click();
  await expect(page.locator("#sceneBlessingLayer")).toHaveClass(/active/);
  await expect(page.locator("#sanctuaryLanternTarget")).toBeVisible();
  
  // Initial constellation lanterns
  const initialLanterns = await page.locator("#skyLanternConstellation .constellation-lantern").count();
  expect(initialLanterns).toBeGreaterThanOrEqual(8);
  const lightsBefore = await page.evaluate(() => window.state.lightsReleased);
  
  // Release lantern
  await page.locator("#sanctuaryLanternTarget").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#sanctuaryLanternTarget")).toHaveClass(/soaring-skyward/);
  
  // Check profile lights count updated
  await page.locator(".bottom-nav .nav-item[data-target='profile']").click();
  await expect(page.locator("#profileLightsCount")).toHaveText(String(lightsBefore + 1));
});

test.skip("downward swipe does not release a sanctuary lantern", async ({ page }) => {
  await page.locator(".deed-item[data-deed-id='anonymous-blessing']").first().click();
  const target = page.locator("#sanctuaryLanternTarget");
  const box = await target.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 90, { steps: 4 });
  await page.mouse.up();
  await expect(target).not.toHaveClass(/soaring-skyward/);
  await page.locator(".bottom-nav .nav-item[data-target='profile']").click();
  await expect(page.locator("#profileLightsCount")).toHaveText("14");
});

test.skip("koi release is available from the keyboard", async ({ page }) => {
  const koi = page.locator("#koiTouchTarget");
  await koi.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#ritualScene")).toHaveClass(/completed/);
});



