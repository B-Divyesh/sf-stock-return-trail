import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('landing page has the required structure and no serious accessibility findings', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Stock Return Trail — Return job stock to its origin');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
});

test('@claim:return-provenance calculates returns and records their origins', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('[data-return="line-valve"]')).toHaveText('4');
  await expect(page.locator('[data-return="line-cable"]')).toHaveText('3');
  await expect(page.locator('[data-return="line-clips"]')).toHaveText('6');
  await expect(page.getByText('Main stores · Bin B4').first()).toBeVisible();
  await expect(page.getByText('Workshop · Cable rack').first()).toBeVisible();
  await page.getByRole('button', { name: 'Record returns & close job' }).click();
  await expect(page.getByText('Return trail saved')).toBeVisible();
  await page.getByRole('link', { name: 'Open trail log' }).click();
  await expect(page.getByText('9 recorded movements')).toBeVisible();
});

test('@claim:stock-code-entry supports manual entry and camera detection', async ({ page }) => {
  await page.addInitScript(() => {
    class FakeBarcodeDetector {
      async detect() { return [{ rawValue: 'SCAN-123' }]; }
    }
    Object.defineProperty(window, 'BarcodeDetector', { value: FakeBarcodeDetector });
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { value: async () => new MediaStream() });
    HTMLMediaElement.prototype.play = async () => {};
  });
  await page.goto('/app');
  await page.getByRole('button', { name: 'Create your first job' }).click();
  await page.getByLabel('Job name').fill('North wing repair');
  await page.getByLabel('Temporary location').fill('North wing roof');
  await page.getByRole('button', { name: 'Create job', exact: true }).last().click();
  await page.getByRole('button', { name: 'Scan code' }).click();
  await expect(page.getByLabel('Stock code')).toHaveValue('SCAN-123');
  await page.getByLabel('Stock code').fill('SEAL-40');
  await page.getByLabel('Item name').fill('40 mm seal');
  await page.getByLabel('Count').fill('5');
  await page.getByLabel('Origin').fill('Main stores · Bin C2');
  await page.getByRole('button', { name: 'Add stock out' }).click();
  await expect(page.getByText('40 mm seal', { exact: true })).toBeVisible();
  await expect(page.getByText('Main stores · Bin C2').first()).toBeVisible();
});

test('mobile layout keeps primary controls visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.getByRole('button', { name: 'Record returns & close job' })).toBeVisible();
  await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
});

test('legal pages and unknown route have unique pages', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page).toHaveTitle('Privacy — Stock Return Trail');
  await expect(page.locator('h1')).toHaveText('Your stock records stay on your device');
  await page.goto('/terms');
  await expect(page).toHaveTitle('Terms — Stock Return Trail');
  await page.goto('/does-not-exist');
  await expect(page.getByRole('heading', { name: 'This page is not on the trail' })).toBeVisible();
});
