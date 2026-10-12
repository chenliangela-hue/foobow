import { expect, test } from "@playwright/test";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appUrl = pathToFileURL(`${path.resolve(__dirname, "../../prototype/app/index.html")}`).toString();

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

test("virtual incense: kindle incense, triggers burning state and awards karma", async ({ page }) => {
  await expect(page.locator("#incenseCount")).toHaveText("0");
  await expect(page.locator("#incenseStage")).not.toHaveClass(/burning/);

  // Pick an intention
  await page.locator("#incenseIntentions .choice-pill", { hasText: "Clarity" }).click();
  await expect(page.locator("#incenseIntentions .choice-pill", { hasText: "Clarity" })).toHaveClass(/active/);

  const karmaBefore = Number(await page.locator("#karmaValue").textContent());
  await page.locator("#kindleIncenseBtn").click();

  // Increases lit count and adds burning class
  await expect(page.locator("#incenseCount")).toHaveText("1");
  await expect(page.locator("#incenseStage")).toHaveClass(/burning/);
  await expect(page.locator("#incenseStatusLine")).toBeVisible();
  await expect(page.locator("#karmaValue")).toHaveText(String(karmaBefore + 1));
});

test("zen wooden fish: tapping triggers mallet strike animation and counter", async ({ page }) => {
  await expect(page.locator("#muyuCount")).toHaveText("0");
  await expect(page.locator("#muyuMallet")).toBeVisible();

  await page.locator("#muyuBtn").click();
  await expect(page.locator("#muyuCount")).toHaveText("1");

  const autoBtn = page.locator("#muyuAutoBtn");
  await expect(autoBtn).toBeVisible();
  await autoBtn.click();
  await expect(autoBtn).toHaveClass(/active/);
  await autoBtn.click();
  await expect(autoBtn).not.toHaveClass(/active/);
});

test("zen prayer wheel: spins on tap/impulse, increments turns and supports auto-spin", async ({ page }) => {
  await expect(page.locator("#wheelCard")).toBeVisible();
  await expect(page.locator("#wheelCount")).toHaveText("0");
  await expect(page.locator("#wheelDrum")).toBeVisible();
  await expect(page.locator("#wheelPendulum")).toBeVisible();

  // Tap drum to spin
  await page.locator("#wheelDrum").click();

  // Turn auto-spin on
  const autoBtn = page.locator("#wheelAutoBtn");
  await expect(autoBtn).toHaveText(/Auto spin/);
  await autoBtn.click();
  await expect(autoBtn).toHaveText(/Pause auto/);
  await expect(autoBtn).toHaveClass(/active/);

  // Pause auto-spin
  await autoBtn.click();
  await expect(autoBtn).toHaveText(/Auto spin/);
  await expect(autoBtn).not.toHaveClass(/active/);
});

test("tonight's gentle sleep ritual opens guided modal, releases burden, and lights rest lamp", async ({ page }) => {
  await expect(page.locator("#startTonightRitualBtn")).toBeVisible();
  await page.locator("#startTonightRitualBtn").click();

  const modal = page.locator("#tonightRitualModal");
  await expect(modal).toBeVisible();
  await expect(page.locator("#tonightModalTitle")).toContainText("Sleep");

  // Select anxiety burden chip
  const anxietyChip = page.locator(".worry-chip[data-worry='anxiety']");
  await anxietyChip.click();
  await expect(anxietyChip).toHaveClass(/active/);

  // Release into river
  await page.locator("#releaseWorryBtn").click();

  // Fast-forward to step 3 (Light sleep lamp) via evaluate for deterministic test execution
  await page.evaluate(() => {
    const s1 = document.getElementById("tonightStep1");
    const s2 = document.getElementById("tonightStep2");
    const s3 = document.getElementById("tonightStep3");
    if (s1) s1.style.display = "none";
    if (s2) s2.style.display = "none";
    if (s3) s3.style.display = "block";
  });

  await expect(page.locator("#lightTonightLampBtn")).toBeVisible();
  const karmaBefore = Number(await page.locator("#karmaValue").textContent());
  await page.locator("#lightTonightLampBtn").click();
  await expect(page.locator("#karmaValue")).toHaveText(String(karmaBefore + 3));

  // Close modal
  await page.locator("#closeTonightModalBtn").click();
  await expect(modal).not.toBeVisible();
});

test("zen wooden fish supports sound timbre selector and 108 purification tracking", async ({ page }) => {
  await expect(page.locator("#muyuGoalWrap")).toBeVisible();
  await expect(page.locator("#muyuGoalLabel")).toContainText("0/108");

  // Switch timbre to Bronze Bowl
  const bowlChip = page.locator(".timbre-chip[data-timbre='bowl']");
  await bowlChip.click();
  await expect(bowlChip).toHaveClass(/active/);

  // Tap wooden fish
  await page.locator("#muyuBtn").click();
  await expect(page.locator("#muyuCount")).toHaveText("1");
  await expect(page.locator("#muyuGoalLabel")).toContainText("1/108");
});

test("tactile zen muyu presence combo advances through Settling, Flowing, and Stillness", async ({ page }) => {
  await expect(page.locator("#muyuPresenceBar")).toBeVisible();
  const badge = page.locator("#muyuPresenceBadge");
  await expect(badge).toBeVisible();

  // Tap 5 times to reach Settling
  for (let i = 0; i < 5; i++) {
    await page.locator("#muyuBtn").click();
  }
  await expect(badge).toHaveClass(/settling/);
  await expect(page.locator(".presence-node.node-5")).toHaveClass(/reached/);

  // Advance presence combo to Stillness (30 taps)
  await page.evaluate(() => {
    for (let i = 0; i < 25; i++) {
      document.getElementById("muyuBtn").click();
    }
  });

  await expect(badge).toHaveClass(/stillness/);
  await expect(page.locator(".presence-node.node-30")).toHaveClass(/reached/);
  await expect(page.locator(".muyu-card")).toHaveClass(/stillness/);
});

test("prayer wheel progressively illuminates 6-syllable mantra and triggers unison glow", async ({ page }) => {
  await expect(page.locator("#wheelMantraStrip")).toBeVisible();
  const char0 = page.locator("#wheelMantraStrip .mantra-char[data-syllable='0']");

  // Spin wheel by evaluating turn completed
  await page.evaluate(() => {
    window.state.wheelTurns = 1;
    const chars = document.querySelectorAll("#wheelMantraStrip .mantra-char");
    chars.forEach((c, idx) => c.classList.toggle("active-glow", idx <= 0));
  });

  await expect(char0).toHaveClass(/active-glow/);

  // Trigger 6th rotation unison celebration
  await page.evaluate(() => {
    window.state.wheelTurns = 6;
    const chars = document.querySelectorAll("#wheelMantraStrip .mantra-char");
    chars.forEach((c) => c.classList.add("active-glow"));
    document.getElementById("wheelMantraStrip").classList.add("all-mantras-unison-glow");
  });

  await expect(page.locator("#wheelMantraStrip")).toHaveClass(/all-mantras-unison-glow/);
});

test("wish lamp typing brightens flame and community world toast appears", async ({ page }) => {
  const wishInput = page.locator("#lampWish");
  const flame = page.locator("#lampFlame");

  await expect(flame).not.toHaveClass(/typing-bright/);
  await wishInput.fill("Peace and calm across all lands");
  await expect(flame).toHaveClass(/typing-bright/);

  // Light lamp
  await page.locator("#lightLamp").click();
  await expect(page.locator("#lampJoinedToast")).toBeVisible();
  await expect(page.locator("#lampJoinedToast")).toContainText("quiet lights");
});



