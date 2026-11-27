import { expect, test } from '@playwright/test';
import { withStaticServer } from '../helpers.mjs';

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:)/, route => route.abort());
});

test('game gallery descriptions follow the selected language', async ({ page }) => {
  await withStaticServer(async base => {
    await page.goto(`${base}/app/?view=rituals`);
    const descriptions = page.locator('.game-tile small');
    const english = await descriptions.allTextContents();
    for (const locale of ['zh-Hans', 'fr', 'es', 'th', 'ja']) {
      await page.locator('#languageSelect').selectOption(locale);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      const translated = await descriptions.allTextContents();
      expect(translated).toHaveLength(3);
      expect(translated.every((text, index) => text && text !== english[index])).toBe(true);
    }
  });
});

test('deed search has a recoverable empty state and Map opens the matching deed', async ({ page }) => {
  await withStaticServer(async base => {
    await page.goto(`${base}/app/`);
    const nav = page.locator('.bottom-nav');
    await nav.locator('[data-target="deeds"]').click();
    const search = page.getByRole('searchbox', { name: 'Search deeds' });
    await search.fill('zz-no-matching-deed');
    await expect(page.getByText('No deeds match your search.')).toBeVisible();
    await expect(page.locator('#deedRitualPreview')).toBeHidden();
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(search).toHaveValue('');
    await expect(search).toBeFocused();
    await expect(page.locator('.deed-item').first()).toBeVisible();

    await search.fill('zz-no-matching-deed');
    await nav.locator('[data-target="map"]').click();
    await page.locator('#spotActionBtn').click();
    await expect(page.locator('#screen-deeds')).toHaveClass(/active/);
    await expect(search).toHaveValue('');
    await expect(page.locator('#ritualTitle')).toContainText('Fish Release');
    await expect(page.locator('#ritualTitle')).toBeFocused();
  });
});

test('personal settings and local community draft are clearly labeled', async ({ page }) => {
  await withStaticServer(async base => {
    await page.goto(`${base}/app/`);
    const nav = page.locator('.bottom-nav');
    await nav.locator('[data-target="profile"]').click();
    await expect(page.getByRole('heading', { name: 'Privacy and data' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Merit progress' })).toBeVisible();
    await nav.locator('[data-target="community"]').click();
    await expect(page.getByText('Posts in this preview stay on this device.')).toBeVisible();
    await expect(page.getByText('Illustrative preview')).toBeVisible();
  });
});
