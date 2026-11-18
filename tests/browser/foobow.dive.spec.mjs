import { expect, test } from '@playwright/test';

const sanctuary = 'http://127.0.0.1:4187/sanctuary/';
const dive = `${sanctuary}dive/`;

test('releases a koi and switches between the surface and koi-eye cameras', async ({ page }, info) => {
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' && /THREE|shader|WebGL|WebGPU/i.test(message.text())) errors.push(message.text());
  });
  await page.goto(sanctuary);
  await page.getByRole('link', { name: 'Beneath the Lilies' }).click();
  await expect(page).toHaveURL(dive);
  const release = page.getByRole('button', { name: 'Release the koi' });
  await expect(release).toBeEnabled({ timeout: 30_000 });
  await page.screenshot({ path: info.outputPath('pond-entry.png') });
  await release.focus();
  await page.keyboard.press('Enter');
  const pond = page.getByLabel('Interactive koi pond');
  await expect(pond).toBeFocused();
  await expect(pond).toHaveAttribute('data-view', 'surface');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('status')).toContainText('Koi guided');
  await page.screenshot({ path: info.outputPath('pond-surface.png') });
  await page.getByRole('button', { name: 'Koi view' }).click();
  await expect(pond).toHaveAttribute('data-view', 'koi');
  await expect(page.getByRole('button', { name: 'Resume motion' })).toBeVisible();
  await page.screenshot({ path: info.outputPath('pond-koi.png') });
  await page.getByRole('button', { name: 'Resume motion' }).click();
  await expect(page.getByRole('button', { name: 'Pause motion' })).toBeVisible();
  await page.getByRole('button', { name: 'Pause motion' }).click();
  await page.getByRole('button', { name: 'Surface', exact: true }).click();
  await expect(pond).toHaveAttribute('data-view', 'surface');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('the water accepts a tap or a click and controls fit an enlarged layout', async ({ page }, info) => {
  test.setTimeout(90_000);
  await page.goto(dive);
  const release = page.getByRole('button', { name: 'Release the koi' });
  await expect(release).toBeEnabled({ timeout: 30_000 });
  await release.click();
  const pond = page.getByLabel('Interactive koi pond');
  const box = await pond.boundingBox();
  if (info.project.use.hasTouch) await page.touchscreen.tap(box.width * .7, box.height * .47);
  else {
    await page.mouse.move(box.width * .65, box.height * .45);
    await page.mouse.click(box.width * .7, box.height * .47);
  }
  await expect(page.getByRole('status')).toHaveText('Koi guided.');
  await page.getByRole('button', { name: 'Pause motion' }).click();
  await expect(page.getByRole('button', { name: 'Resume motion' })).toBeVisible();
  await page.getByRole('button', { name: '中文' }).click();
  await expect(page.getByRole('button', { name: '锦鲤视角' })).toBeVisible();
  await page.setViewportSize({ width: 768, height: 900 });
  await page.addStyleTag({ content: ':root { font-size: 200%; }' });
  await page.getByRole('button', { name: '锦鲤视角' }).click();
  await expect(page.getByRole('region', { name: '互动锦鲤池塘' })).toHaveAttribute('data-view', 'koi');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('pond-zoomed-tablet.png') });
});

test('graphics failure keeps the artwork and a playable sanctuary route available', async ({ page }) => {
  await page.route('**/vendor/three.webgpu.js', route => route.abort());
  await page.goto(dive);
  await expect(page.getByRole('status')).toContainText('3D graphics are unavailable');
  await expect(page.getByRole('button', { name: 'Release the koi' })).toBeHidden();
  await page.getByRole('link', { name: 'Play the illustrated pond' }).click();
  await expect(page).toHaveURL(sanctuary);
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
});
