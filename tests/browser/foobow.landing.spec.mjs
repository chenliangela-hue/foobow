import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";

const landingUrl = pathToFileURL(`${process.cwd()}/prototype/index.html`).toString();

test.beforeEach(async ({ page }) => {
  await page.goto(landingUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator(".hero").waitFor();
});

test("landing shows brand, tagline, a blessing couplet, and gates", async ({ page }) => {
  await expect(page).toHaveTitle(/Foobow/);
  await expect(page.locator(".brand-word")).toContainText("Foobow");
  await expect(page.locator("#coupletTagline")).toContainText("积善德");
  await expect(page.locator("#phraseZh")).not.toBeEmpty();
  await expect(page.locator("#phraseGloss")).not.toBeEmpty();

  // Five gates render with localized names.
  await expect(page.locator(".gate-card")).toHaveCount(5);
  await expect(page.locator(".phrase-chip")).toHaveCount(15);
});

test("Enter CTA links into the app at /app/", async ({ page }) => {
  const href = await page.locator("#enterCta").getAttribute("href");
  expect(href).toBe("/app/");
});

test("language switcher flips html lang and visible copy across all six locales", async ({ page }) => {
  const cases = [
    { value: "ja", lang: "ja", enter: "Foobow に入る" },
    { value: "fr", lang: "fr", enter: "Entrer dans Foobow" },
    { value: "es", lang: "es", enter: "Entrar en Foobow" },
    { value: "th", lang: "th", enter: "เข้าสู่ Foobow" },
    { value: "zh-Hans", lang: "zh-Hans", enter: "进入 Foobow" },
    { value: "en", lang: "en", enter: "Enter Foobow" }
  ];

  for (const testCase of cases) {
    await page.selectOption("#langSelect", testCase.value);
    await expect(page.locator("html")).toHaveAttribute("lang", testCase.lang);
    await expect(page.locator("#enterCta")).toHaveText(testCase.enter);
  }

  // Choice persists across reload.
  await page.selectOption("#langSelect", "ja");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
});

test("landing body tokens meet WCAG contrast thresholds", async ({ page }) => {
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
    const linear = (value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    const luminance = (hex) => {
      const [red, green, blue] = hexToRgb(hex).map(linear);
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const contrast = (foreground, background) => {
      const first = luminance(foreground);
      const second = luminance(background);
      return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
    };
    return {
      inkOnSurface: contrast(token("--ink"), token("--surface")),
      mutedOnSurface: contrast(token("--muted"), token("--surface")),
      vermilionOnSurface: contrast(token("--vermilion"), token("--surface"))
    };
  });

  for (const [name, ratio] of Object.entries(ratios)) {
    expect.soft(ratio, `${name} contrast`).toBeGreaterThanOrEqual(4.5);
  }
});

test("landing respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(landingUrl);
  const orbDuration = await page.evaluate(() => getComputedStyle(document.querySelector(".orb")).animationDuration);
  // Reduced-motion rule collapses animation duration to ~0.
  expect(Number.parseFloat(orbDuration)).toBeLessThan(0.01);
});
