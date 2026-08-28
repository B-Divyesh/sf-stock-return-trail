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

test('keyboard users can skip navigation and open the main landmark', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('app and privacy routes have no serious accessibility findings', async ({ page }) => {
  for (const path of ['/app', '/privacy']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  }
});

test('all public routes have no accessibility violations at desktop and phone widths', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const path of ['/', '/demo', '/app', '/log', '/settings', '/privacy', '/terms', '/does-not-exist']) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations, `${path} at ${viewport.width}px`).toEqual([]);
      await expect(page.locator('h1')).toHaveCount(1);
    }
  }
});

test('@claim:return-provenance calculates returns and records their origins', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('[data-return="line-valve"]')).toHaveText('4');
  await expect(page.locator('[data-return="line-cable"]')).toHaveText('3');
  await expect(page.locator('[data-return="line-clips"]')).toHaveText('6');
  await expect(page.getByText('Main stores · Bin B4').first()).toBeVisible();
  await expect(page.getByText('Workshop · Cable rack').first()).toBeVisible();
  await page.getByRole('button', { name: 'Record returns & finish job' }).click();
  await expect(page.getByText('Return trail saved')).toBeVisible();
  await page.getByRole('link', { name: 'Open movement log' }).click();
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
  await page.goto('/demo');
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
  const essentialControls = [
    ['job sheet', page.locator('.job-sheet')],
    ['route strip', page.locator('.route-strip')],
    ['closeout bar', page.locator('.closeout-bar')],
    ['finish job button', page.getByRole('button', { name: 'Record returns & finish job' })],
  ] as const;
  for (const [name, control] of essentialControls) {
    await expect(control).toBeVisible();
    const box = await control.boundingBox();
    expect(box, `missing ${name} bounding box`).not.toBeNull();
    expect(box!.x, `${name} starts outside the viewport`).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width, `${name} extends beyond the 390px viewport`).toBeLessThanOrEqual(390);
  }
  const routeStrip = page.locator('.route-strip');
  await routeStrip.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => routeStrip.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
});

test('rejects whitespace-only job and stock provenance with an announced field error', async ({ page }) => {
  await page.goto('/app');
  await page.getByRole('button', { name: 'Create your first job' }).click();
  await page.getByLabel('Job name').fill('   ');
  await page.getByLabel('Temporary location').fill('   ');
  await page.getByRole('button', { name: 'Create job', exact: true }).last().click();
  await expect(page.locator('#job-error')).toHaveText('Enter a job name, not only spaces.');
  await expect(page.getByLabel('Job name')).toBeFocused();

  await page.getByLabel('Job name').fill('North wing repair');
  await page.getByLabel('Temporary location').fill('North wing roof');
  await page.getByRole('button', { name: 'Create job', exact: true }).last().click();
  await page.getByLabel('Stock code').fill('  ');
  await page.getByLabel('Item name').fill('  ');
  await page.getByLabel('Origin').fill('  ');
  await page.getByRole('button', { name: 'Add stock out' }).click();
  await expect(page.locator('#stock-error')).toHaveText('Enter a stock code, not only spaces.');
  await expect(page.getByLabel('Stock code')).toBeFocused();
  await expect(page.getByText('No stock is on this job')).toBeVisible();
});

test('rejects malformed backups before replacing the accessible workspace', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Backup' }).click();
  const malformed = { jobs: [{}], movements: [], updatedAt: '2026-08-28T12:00:00.000Z' };
  await page.locator('#import-file').setInputFiles({ name: 'broken-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(malformed)) });
  await expect(page.locator('#import-status')).toContainText('invalid job 1');
  await page.getByRole('link', { name: 'Jobs' }).click();
  await expect(page.getByRole('heading', { name: 'Riverside pump room' })).toBeVisible();
  await expect(page.getByText('22 mm isolation valve', { exact: true })).toBeVisible();
});

test('mobile demo, navigation, and footer controls have 44 px hit areas', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  const controls = [
    page.getByRole('button', { name: 'Reset demo' }),
    page.getByRole('link', { name: 'Start for real' }),
    page.getByRole('link', { name: 'Stock Return Trail home' }),
    page.locator('.site-header nav').getByRole('link', { name: 'Jobs' }),
    page.locator('.site-footer').getByRole('link', { name: 'Privacy' }),
  ];
  for (const control of controls) {
    const box = await control.boundingBox();
    expect(box, `missing box for ${await control.innerText()}`).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
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

test('direct ?demo=1 opens the isolated sample with its banner and reset action', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Stock Return Trail');
  await expect(page.getByRole('heading', { name: 'Track stock out and back' })).toBeVisible();
  await expect(page.getByLabel('Demo mode')).toContainText('sample data, nothing is saved');
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
});

test('client navigation updates social metadata and moves focus to the new heading', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Main navigation').getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveTitle('Privacy — Stock Return Trail');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Privacy — Stock Return Trail');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://stock-return-trail.sociobot.in/privacy');
  await expect(page.getByRole('heading', { name: 'Your stock records stay on your device' })).toBeFocused();
});

test('does not advertise a checkout that is unavailable', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href*="api.sociobot.in/api/v1/products"]')).toHaveCount(0);
  await expect(page.getByText('£19')).toHaveCount(0);
  await page.goto('/settings');
  await expect(page.locator('a[href*="api.sociobot.in/api/v1/products"]')).toHaveCount(0);
});
