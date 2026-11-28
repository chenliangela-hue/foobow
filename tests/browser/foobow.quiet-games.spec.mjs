import { expect, test } from '@playwright/test';
import { withStaticServer } from '../helpers.mjs';

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:)/, route => route.abort());
});

test('gallery lists only the new puzzles and retired URLs return to the gallery', async ({ page }) => {
  await withStaticServer(async baseUrl => {
    await page.goto(baseUrl);
    await page.getByRole('link', { name: 'Browse games' }).press('Enter');
    await expect(page.locator('#games-gallery-title')).toBeFocused();
    const tiles = page.locator('.games-gallery .game-tile');
    await expect(tiles).toHaveCount(3);
    await expect(tiles.first()).toBeEnabled();
    await page.locator('.games-gallery').screenshot({ path: test.info().outputPath('gallery.png') });
    await page.keyboard.press('Tab');
    await expect(tiles.first()).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog', { name: 'After the Rain' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tiles.first()).toBeFocused();
    for (const retired of ['play/lamp', 'play/courtyard', 'sanctuary', 'sanctuary/dive', 'review']) {
      await page.goto(`${baseUrl}/${retired}/`);
      await expect(page).toHaveURL(/\/app\/\?view=rituals$/);
    }
  });
});

test('After the Rain routes water and starts another puzzle with a distinct layout', async ({ page }) => {
  await withStaticServer(async baseUrl => {
    await page.goto(`${baseUrl}/app/?view=rituals`);
    await page.getByRole('button', { name: /After the Rain/ }).press('Enter');
    const cells = page.locator('.puzzle-board button');
    for (const index of [4, 5, 1, 2, 6, 7]) {
      for (let turn = 0; turn < 3 - index % 2; turn += 1) await cells.nth(index).press('Enter');
    }
    await expect(page.getByRole('dialog').getByRole('status')).toContainText('The pond is flowing');
    await page.getByRole('button', { name: 'New board' }).click();
    await expect(cells.nth(8)).toHaveAccessibleName(/Spring/);
    await expect(page.getByRole('dialog').getByRole('status')).toContainText('spring');
  });
});

test('The Herbarium handles a mismatch, matches every pair and resets', async ({ page }) => {
  await withStaticServer(async baseUrl => {
    await page.addInitScript(() => { Math.random = () => .999; });
    await page.goto(`${baseUrl}/app/?view=rituals`);
    await page.getByRole('button', { name: /The Herbarium/ }).click();
    const cells = page.locator('.puzzle-board button');
    await cells.nth(0).click();
    await cells.nth(1).click();
    await expect(page.getByRole('dialog').getByRole('status')).toContainText('Try another pair');
    await expect(cells.first()).toHaveAccessibleName('Covered tile 1');
    for (let index = 0; index < 6; index += 1) {
      await cells.nth(index).click();
      await cells.nth(index + 6).click();
    }
    await expect(page.getByRole('dialog').getByRole('status')).toContainText('Collection complete');
    await page.getByRole('button', { name: 'New board' }).click();
    await expect(page.getByRole('dialog').getByRole('status')).toContainText('0 of 6 pairs');
  });
});

test('Courtyard Mosaic handles invalid placement, undo and completion', async ({ page }) => {
  await withStaticServer(async baseUrl => {
    await page.goto(`${baseUrl}/app/?view=rituals`);
    await page.getByRole('button', { name: /Courtyard Mosaic/ }).click();
    const cells = page.locator('.puzzle-board button');
    await cells.nth(3).click();
    await expect(page.getByRole('dialog').getByRole('status')).toContainText('does not fit');
    await cells.nth(0).click();
    await page.getByRole('button', { name: 'Undo last piece' }).click();
    await expect(cells.nth(0)).toHaveAccessibleName(/empty/);
    for (const index of [0, 3, 8, 10]) await cells.nth(index).click();
    await expect(page.getByRole('dialog').getByRole('status')).toContainText('mosaic is complete');
    await expect(page.getByRole('dialog')).toBeInViewport();
    await page.getByRole('dialog').screenshot({ path: test.info().outputPath('mosaic.png') });
  });
});
