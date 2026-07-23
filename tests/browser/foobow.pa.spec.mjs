import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";

const prototypeUrl = pathToFileURL(`${process.cwd()}/prototype/index.html`).toString();

test.beforeEach(async ({ page }) => {
  await page.goto(prototypeUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("daily ritual, map, deed, community, and profile flows work", async ({ page }) => {
  await expect(page).toHaveTitle("Foobow Prototype");
  await expect(page.getByRole("heading", { name: "Foobow" })).toBeVisible();

  await page.getByRole("button", { name: "Heavy" }).click();
  await expect(page.locator("#recommendedDeed")).toHaveText("Light a path home");

  await page.getByRole("button", { name: "Complete deed" }).click();
  await expect(page.locator("#karmaValue")).toHaveText("72");

  await page.getByRole("button", { name: "Map" }).click();
  await page.getByLabel("Toronto crosswalk good deed spot").click();
  await expect(page.locator("#spotName")).toHaveText("Toronto crosswalk");

  await page.getByRole("button", { name: "Deeds" }).click();
  await page.getByText("Anonymous blessing").first().click();
  await expect(page.locator("#ritualTitle")).toHaveText("Anonymous blessing");
  await page.getByRole("button", { name: "Perform ritual" }).click();
  await expect(page.locator("#karmaValue")).toHaveText("77");

  await page.getByRole("button", { name: "Community" }).click();
  await page.locator("#blessingInput").fill("May your next step feel lighter.");
  await page.getByRole("button", { name: "Send blessing" }).click();
  await expect(page.locator(".blessing p").first()).toHaveText("May your next step feel lighter.");

  await page.locator("button", { hasText: "Report" }).first().click();
  await expect(page.locator("button", { hasText: "Reported for review" }).first()).toBeDisabled();

  await page.getByRole("button", { name: "Profile" }).click();
  await expect(page.locator("#exportDataButton")).toBeVisible();
  await expect(page.locator("#deleteDataButton")).toBeVisible();

  await page.getByRole("button", { name: "Donate" }).click();
  await expect(page.locator("#impactDialog")).toHaveJSProperty("open", true);
  await expect(page.locator("#impactDialog")).toContainText("does not buy luck, virtue, or guaranteed karma");
});

test("theme, language, and local persistence work", async ({ page }) => {
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await expect(page.locator("body")).toHaveClass(/dark/);

  await page.getByRole("button", { name: "Switch language" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");

  await page.locator("#journalEntry").fill("A private note that should persist.");
  await page.reload();
  await expect(page.locator("#journalEntry")).toHaveValue("A private note that should persist.");
  await expect(page.locator("body")).toHaveClass(/dark/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");
});

test("category filters narrow map spots and deed catalog", async ({ page }) => {
  await page.getByRole("button", { name: "Map" }).click();
  await page.locator("#mapLayerRow").getByRole("button", { name: "Elders" }).click();
  await expect(page.locator("#spotName")).toHaveText("Toronto crosswalk");
  await expect(page.getByLabel("East Lake good deed spot")).toBeHidden();
  await expect(page.getByLabel("Toronto crosswalk good deed spot")).toBeVisible();

  await page.getByRole("button", { name: "Deeds" }).click();
  await expect(page.locator("#deedTypeCount")).toHaveText("1 shown");
  await expect(page.getByRole("button", { name: /扶老奶奶过马路/ })).toBeVisible();

  await page.locator("#deedCategoryRow").getByRole("button", { name: "All" }).click();
  await expect(page.locator("#deedTypeCount")).toHaveText("4 shown");
});

test("keyboard users can reach controls and activate deed cards", async ({ page }) => {
  const focusedNames = [];
  for (let index = 0; index < 7; index += 1) {
    await page.keyboard.press("Tab");
    focusedNames.push(await page.evaluate(() => document.activeElement?.ariaLabel || document.activeElement?.textContent?.trim()));
  }

  expect(focusedNames).toContain("Switch language");
  expect(focusedNames).toContain("Toggle dark mode");
  expect(focusedNames).toContain("Calm");
  expect(focusedNames).toContain("Heavy");

  await page.getByRole("button", { name: "Deeds" }).click();
  await page.getByRole("button", { name: /Clean a coastline/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#ritualTitle")).toHaveText("Clean a coastline");
});

test("senior readability mode enlarges type and persists", async ({ page }) => {
  const toggle = page.getByRole("button", { name: "Toggle senior readability mode" });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");

  await toggle.click();
  await expect(page.locator("body")).toHaveClass(/senior-mode/);
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  const fontSize = await page.evaluate(() => getComputedStyle(document.body).fontSize);
  expect(Number.parseFloat(fontSize)).toBeGreaterThan(16);

  await page.reload();
  await expect(page.locator("body")).toHaveClass(/senior-mode/);

  await page.getByRole("button", { name: "Toggle senior readability mode" }).click();
  await expect(page.locator("body")).not.toHaveClass(/senior-mode/);
});

test("core design tokens meet WCAG contrast thresholds", async ({ page }) => {
  const ratios = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    const token = (name) => styles.getPropertyValue(name).trim();
    const hexToRgb = (hex) => {
      const normalized = hex.replace("#", "");
      return [
        Number.parseInt(normalized.slice(0, 2), 16) / 255,
        Number.parseInt(normalized.slice(2, 4), 16) / 255,
        Number.parseInt(normalized.slice(4, 6), 16) / 255
      ];
    };
    const linear = (value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    const luminance = (hex) => {
      const [red, green, blue] = hexToRgb(hex).map(linear);
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const contrast = (foreground, background) => {
      const first = luminance(foreground);
      const second = luminance(background);
      const lighter = Math.max(first, second);
      const darker = Math.min(first, second);
      return (lighter + 0.05) / (darker + 0.05);
    };

    return {
      inkOnSurface: contrast(token("--ink"), token("--surface")),
      mutedOnSurface: contrast(token("--muted"), token("--surface")),
      tealOnSurface: contrast(token("--teal"), token("--surface")),
      surfaceOnInk: contrast(token("--surface"), token("--ink")),
      coralOnSurface: contrast(token("--coral"), token("--surface"))
    };
  });

  for (const [name, ratio] of Object.entries(ratios)) {
    expect.soft(ratio, `${name} contrast`).toBeGreaterThanOrEqual(4.5);
  }
});
