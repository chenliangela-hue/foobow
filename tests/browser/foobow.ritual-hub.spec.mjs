import { expect, test } from "@playwright/test";

// Skipped cases exercise the retired web game lineup.
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
import { withStaticServer } from "../helpers.mjs";

const appUrl = pathToFileURL(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../prototype/app/index.html")).toString();

const browseFromToday = (page) => page.locator(".experience-feature a[data-experience=browse]").click();
const gameTile = (page, id) => page.locator(`#games-gallery-title ~ .games-gallery-grid [data-play-ritual="${id}"]`);
const openRetiredRitual = (page, id) => page.locator(`#quietMomentsHub [data-play-ritual="${id}"]`).evaluate(button => button.click());

test.beforeEach(async ({ page }) => {
  await page.goto(appUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.skip("Quiet Moments hub opens an immersive wooden fish and returns focus", async ({ page }) => {
  await browseFromToday(page);
  await expect(page.locator(".games-gallery")).toBeVisible();
  await expect(page.locator(".games-gallery .game-tile")).toHaveCount(6);
  const archivedCards = page.locator("#screen-blessings > :is(.lamp-card, .incense-card, .wheel-card, .peace-game-card, .gratitude-garden-card, .muyu-card)");
  await expect(archivedCards.filter({ visible: true })).toHaveCount(0);
  await gameTile(page, "muyu").click();
  await expect(page.locator("#ritualFocusDialog")).toHaveJSProperty("open", true);
  await expect(page.locator("#ritualFocusDialog")).toHaveAttribute("data-ritual", "muyu");
  await expect(page.locator("#ritualFocusDialog #muyuBtn")).toBeVisible();
  await page.locator("#ritualFocusDialog #muyuBtn").click();
  await expect(page.locator("#muyuCount")).toHaveText("1");
  await page.keyboard.press("Escape");
  await expect(page.locator("#ritualFocusDialog")).not.toHaveJSProperty("open", true);
  await expect(page.locator(".games-gallery")).toBeVisible();
});

test.skip("web visitors enter the gallery and return to their game by keyboard", async ({ page }) => {
  await withStaticServer(async baseUrl => {
    await page.goto(baseUrl);
    await page.locator("#quietMomentsCta").press("Enter");
    await expect(page.locator("#games-gallery-title")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator(".game-tile-koi")).toBeFocused();
    for (const game of ["lamp", "courtyard"]) {
      const tile = page.locator(`.game-tile-${game}`);
      await tile.press("Enter");
      await expect(page).toHaveURL(new RegExp(`/play/${game}/`));
      await page.locator("#back").press("Enter");
      await expect(tile).toBeFocused();
      await expect(tile).toBeInViewport();
    }
  });
});

test.skip("Wish Lamp opens from the gallery and supports keyboard controls", async ({ page }) => {
  await browseFromToday(page);
  const lamp = page.locator(".game-tile-lamp");
  await expect(lamp).toHaveAttribute("href", /play\/lamp\/\?lang=en/);
  const lampUrl = pathToFileURL(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../prototype/play/lamp/index.html")).toString();
  await page.goto(lampUrl);
  const progress = page.getByRole("progressbar", { name: "Wish Lamp" });
  await expect(progress).toHaveJSProperty("value", 0);
  await expect(page.getByRole("button", { name: "Light the wick" })).toHaveCount(0);
  await page.getByRole("button", { name: "Place the wick" }).press("Enter");
  const shade = page.getByRole("button", { name: "Fit the paper shade" });
  await expect(shade).toBeFocused();
  await shade.press("Space");
  await page.getByRole("button", { name: "Light the wick" }).press("Enter");
  await expect(page.getByRole("status")).toContainText("The lamp is lit");
  await expect(page.locator(".workshop")).toHaveAttribute("data-lit", "");
  const glow = page.getByRole("slider", { name: "Glow" });
  const priorGlow = await glow.inputValue();
  await glow.press("ArrowRight");
  await expect(glow).not.toHaveValue(priorGlow);
  await page.getByRole("button", { name: "Set it on the shelf" }).press("Space");
  await expect(page.getByRole("status")).toContainText("The lamp rests on the shelf");
  await expect(progress).toHaveJSProperty("value", 4);
  await page.getByRole("button", { name: "Make another lamp" }).press("Enter");
  await expect(page.locator(".workshop")).not.toHaveAttribute("data-lit", "");
  await expect(progress).toHaveJSProperty("value", 0);
  await expect(page.getByRole("button", { name: "Place the wick" })).toBeFocused();
  await page.goto(`${lampUrl}?lang=zh-Hans`);
  await expect(page.getByRole("heading", { name: "祈愿灯" })).toBeVisible();
});

test.skip("Incense Courtyard lets visitors settle with incense or a smoke-free chime", async ({ page }, info) => {
  await withStaticServer(async (baseUrl) => {
    await page.goto(`${baseUrl}/app/?view=rituals`);
    const tile = page.getByRole("link", { name: /Incense Courtyard/ });
    await expect(tile).toHaveAttribute("href", /play\/courtyard\/\?lang=en/);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await tile.click();
    await expect(page).toHaveURL(/play\/courtyard\/\?lang=en/);

    const chime = page.getByRole("button", { name: "Wind chime" });
    await chime.press("Enter");
    await expect(page.getByRole("status")).toContainText("The chime is hanging");
    const stone = page.getByRole("button", { name: "Sit beside the tree" });
    await expect(stone).toBeFocused();
    await stone.press("Space");
    await expect(page.getByRole("status")).toContainText("Stay as long as you like");
    await expect(page.locator("main")).toHaveAttribute("data-activity", "chime");
    await expect(page.locator(".courtyard-smoke")).toHaveCSS("opacity", "0");

    await page.getByRole("button", { name: "Begin again" }).press("Enter");
    const incense = page.getByRole("button", { name: "Virtual incense" });
    await expect(incense).toBeFocused();
    if (info.project.use.hasTouch) await incense.tap();
    else await incense.click();
    await expect(page.getByRole("status")).toContainText("The incense is in place");
    await expect(page.locator("main")).toHaveAttribute("data-activity", "incense");
    await expect(page.locator(".courtyard-smoke")).toHaveCSS("animation-name", "none");
    await stone.press("Enter");
    await expect(page.getByRole("button", { name: "Begin again" })).toBeFocused();
    await page.getByRole("link", { name: /Quiet Worlds/ }).click();
    await expect(page.getByRole("heading", { name: "Quiet Worlds" })).toBeVisible();
    await page.goto(`${baseUrl}/play/courtyard/?lang=zh-Hans`);
    await expect(page.getByRole("heading", { name: "静香庭院" })).toBeVisible();
  });
});

test.skip("Wooden Fish responds in the rainy room and starts silent", async ({ page }, info) => {
  await browseFromToday(page);
  await gameTile(page, "muyu").click();
  await expect(page.getByRole("button", { name: "Instrument sound" })).toHaveAttribute("aria-pressed", "false");
  await page.locator("#muyuBtn").press("Enter");
  await expect(page.locator("#muyuStage")).toHaveClass(/room-resonant/);
  await expect(page.locator("#muyuCount")).toHaveText("1");
  const sound = page.getByRole("button", { name: "Instrument sound" });
  await sound.click();
  await expect(sound).toHaveAttribute("aria-pressed", "true");
  await sound.click();
  await expect(sound).toHaveAttribute("aria-pressed", "false");
  if (info.project.use.hasTouch) await page.locator("#muyuBtn").tap();
  else await page.locator("#muyuBtn").click();
  await expect(page.locator("#muyuCount")).toHaveText("2");
  const merit = await page.locator("#karmaValue").textContent();
  for (let tap = 0; tap < 8; tap += 1) await page.locator("#muyuBtn").press("Enter");
  await expect(page.locator("#muyuCount")).toHaveText("10");
  await expect(page.locator("#karmaValue")).toHaveText(merit);
});

test.skip("Gratitude accepts three stone placements without private text", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await browseFromToday(page);
  await gameTile(page, "gratitudeGarden").click();
  const second = page.getByRole("button", { name: "Place stone 2" });
  await second.scrollIntoViewIfNeeded();
  if (info.project.use.hasTouch) await second.tap();
  else await second.click();
  await expect(second).toHaveAttribute("aria-pressed", "true");
  await second.press("Enter");
  await expect(page.locator("#gratitudePond .gratitude-pebble")).toHaveCount(1);
  await page.getByRole("button", { name: "Place stone 1" }).press("Enter");
  const third = page.getByRole("button", { name: "Place stone 3" });
  await third.scrollIntoViewIfNeeded();
  await third.press("Enter");
  await expect(page.locator("#gratitudePond .gratitude-pebble")).toHaveCount(3);
  await expect(page.locator("#gratitudeAgainBtn")).toBeFocused();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("foobow.peaceGarden.v1")))).toEqual({ sessions: 1 });
});

test.skip("Quiet Moments responds to mood, locale, and lantern choice", async ({ page }) => {
  await browseFromToday(page);
  await page.locator('[data-quiet-mood="gratitude"]').evaluate(button => button.click());
  await expect(page.locator("#quietFeaturePrompt")).toContainText("Notice one thing");
  await page.locator("#languageSelect").selectOption("zh-Hans");
  await expect(page.locator("#games-gallery-title")).toHaveText("静谧小世界");
  await expect(page.locator("#quietFeaturePrompt")).toContainText("值得珍惜");
  for (const locale of ["fr", "es", "th", "ja", "en"]) {
    await page.locator("#languageSelect").selectOption(locale);
    await expect(page.locator("#games-gallery-title")).not.toBeEmpty();
    await expect(gameTile(page, "muyu").locator("strong")).not.toBeEmpty();
  }
  await openRetiredRitual(page, "lantern");
  await expect(page.locator("#ritualFocusDialog #lovingKindnessLanternCard")).toBeVisible();
  await expect(page.locator("#lanternJourneyTitle")).toContainText("kindness");
  await expect(page.locator("#lanternStepLabel")).toContainText("1 of 3");
  await page.locator("#offerLanternWish").click();
  await expect(page.locator("#lanternStepLabel")).toContainText("2 of 3");
  await page.locator("#offerLanternWish").click();
  await page.locator("#offerLanternWish").click();
  await expect(page.locator("#lanternJourneyStatus")).toContainText("three lights");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("foobow.lovingKindnessLantern.v1"))).toBe("1");
});

test("landing deep link opens the Quiet Moments hub", async ({ page }) => {
  await page.goto(`${appUrl}?view=rituals`);
  await expect(page.locator("#screen-blessings")).toBeVisible();
  await expect(page.locator(".games-gallery")).toBeVisible();
  await expect(page.locator(".top-nav-item[data-target=blessings]")).toHaveClass(/active/);
});

test.skip("Gratitude Pebble Garden settles three private good moments", async ({ page }) => {
  await browseFromToday(page);
  const opener = gameTile(page, "gratitudeGarden");
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
  await expect(page.locator("#gratitudePond")).toHaveClass(/garden-complete/);
  await expect(page.locator('#gratitudePond button[aria-pressed="true"]')).toHaveCount(3);
  await expect(page.locator("#gratitudeGardenStatus")).toContainText("settled");
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("foobow.peaceGarden.v1")).sessions)).toBe(1);

  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
});

test.skip("Gratitude Pebble Garden localizes its private reflection copy", async ({ page }) => {
  await browseFromToday(page);
  await page.locator("#languageSelect").selectOption("zh-Hans");
  await gameTile(page, "gratitudeGarden").click();

  await expect(page.locator("#ritualFocusTitle")).toHaveText("感恩石庭");
  await expect(page.locator("#gratitudeGardenTitle")).toContainText("三件美好");
  await expect(page.locator("#gratitudePrivacyNote")).toContainText("此设备只会保存");
});

test.skip("Kindness Quest awards only after a real-world completion attestation", async ({ page }) => {
  await browseFromToday(page);
  await openRetiredRitual(page, "kindnessQuest");
  await expect(page.locator("#ritualFocusDialog #kindnessQuestCard")).toBeVisible();
  await page.locator("#drawKindnessQuest").click();
  await expect(page.locator("#kindnessMission")).not.toHaveText("Choose a path and draw a card.");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("foobow.kindnessQuest.v1"))).toBeNull();
  await page.locator("#completeKindnessQuest").click();
  await expect(page.locator("#kindnessQuestStatus")).toContainText("real world");
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("foobow.kindnessQuest.v1")).sessions)).toBe(1);
  await page.keyboard.press("Escape");
  await expect(page.locator("#ritualFocusDialog")).not.toHaveJSProperty("open", true);
});

test.skip("Five Senses Garden supports notice, skip, completion, and restart", async ({ page }) => {
  await browseFromToday(page);
  await openRetiredRitual(page, "fiveSenses");
  await expect(page.locator("#ritualFocusDialog #fiveSensesCard")).toBeVisible();
  await page.locator("#noticeSenseBtn").click();
  await page.locator("#skipSenseBtn").click();
  await page.locator("#noticeSenseBtn").click();
  await page.locator("#noticeSenseBtn").click();
  await page.locator("#noticeSenseBtn").click();
  await expect(page.locator("#fiveSensesStatus")).toContainText("4 of 5");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("foobow.fiveSenses.v1"))).toBe("1");
  await expect(page.locator("#restartSensesBtn")).toBeVisible();
  await page.locator("#restartSensesBtn").click();
  await expect(page.locator("#senseStepLabel")).toContainText("1 of 5");
});

test.skip("new peace games localize their hubs and instructions", async ({ page }) => {
  await browseFromToday(page);
  await page.locator("#languageSelect").selectOption("zh-Hans");
  await expect(page.locator('[data-play-ritual="kindnessQuest"] strong')).toHaveText("善意任务");
  await openRetiredRitual(page, "fiveSenses");
  await expect(page.locator("#ritualFocusTitle")).toHaveText("五感花园");
  await expect(page.locator("#fiveSensesTitle")).toContainText("回到此刻");
  await expect(page.locator("#sensePromptTitle")).toContainText("颜色");
});

test("primary screens fit the viewport", async ({ page }) => {
  await expect(page.locator(".experience-feature")).toBeVisible();
  for (const target of ["blessings", "map", "deeds", "community", "profile", "today"]) {
    await page.locator(`.bottom-nav [data-target="${target}"]`).click();
    await expect(page.locator(`#screen-${target}`)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), target).toBeLessThanOrEqual(1);
    if (target === "profile") await expect(page.getByRole("heading", { name: "Privacy and data" })).toBeVisible();
  }
});
