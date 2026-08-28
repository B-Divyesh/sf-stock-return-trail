import { expect, test } from '@playwright/test';

test('@claim:offline-reload works after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Track stock out and back' })).toBeVisible();
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Track stock out and back' })).toBeVisible();
  await expect(page.getByText('You are offline. Saved records still work.')).toBeVisible();
});

test('@claim:csv-export exports all demo movements', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Record returns & finish job' }).click();
  await page.getByRole('link', { name: 'Open movement log' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const csv = Buffer.concat(chunks).toString('utf8');
  expect(csv).toContain('date,job,item_code,item_name,movement,count,from,to');
  expect(csv).toContain('"Riverside pump room"');
  expect(csv).toContain('"return"');
  expect(csv.trim().split(/\r?\n/)).toHaveLength(10);
});

test('@claim:local-records sends no demo records off-site', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Record returns & finish job' }).click();
  await expect(page.getByText('Return trail saved')).toBeVisible();
  expect(external).toEqual([]);
});

test('@claim:demo-isolation keeps real records empty', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Record returns & finish job' }).click();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { name: 'No jobs are on the trail' })).toBeVisible();
});

test('@claim:no-account-job-limit allows a field team to create more than two open jobs without a purchase gate', async ({ page }) => {
  await page.goto('/demo');
  for (const number of [1, 2, 3]) {
    await page.locator('.app-head').getByRole('button', { name: 'Create job' }).click();
    await page.getByLabel('Job name').fill(`Job ${number}`);
    await page.getByLabel('Temporary location').fill(`Site ${number}`);
    await page.getByRole('button', { name: 'Create job', exact: true }).last().click();
  }
  await expect(page.getByText('4 open')).toBeVisible();
});

test('@claim:json-backup contains jobs and movements', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Backup' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON backup' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const backup = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  expect(backup.jobs).toHaveLength(1);
  expect(backup.movements).toHaveLength(3);
  backup.jobs[0].name = 'Imported pump job';
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#import-file').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
  await expect(page.getByText('Backup imported. Your local records were replaced.')).toBeVisible();
});

test('@claim:no-analytics makes no analytics, beacon, or off-site request', async ({ page }) => {
  const external: string[] = [];
  const beacons: string[] = [];
  await page.addInitScript(() => {
    const original = navigator.sendBeacon.bind(navigator);
    Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: (url: string | URL, data?: BodyInit | null) => {
      (window as Window & { __beacons?: string[] }).__beacons ||= [];
      window.__beacons.push(String(url));
      return original(url, data);
    } });
  });
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.getByRole('button', { name: 'Record returns & finish job' }).click();
  await expect(page.getByText('Return trail saved')).toBeVisible();
  beacons.push(...await page.evaluate(() => (window as Window & { __beacons?: string[] }).__beacons || []));
  expect(external).toEqual([]);
  expect(beacons).toEqual([]);
});

test('@claim:scope-boundary has no pricing, ordering, or team-sync feature', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Record returns & finish job' }).click();
  await expect(page.getByText('Return trail saved')).toBeVisible();
  for (const route of ['/', '/demo', '/app', '/log', '/settings', '/privacy', '/terms']) {
    await page.goto(route);
    const featureControls = await page.locator('a, button, input, select, textarea').allTextContents();
    expect(featureControls.join(' ')).not.toMatch(/price|order|checkout|purchase|team sync|sync team/i);
    await expect(page.locator('a[href*="checkout"], button[data-action*="order"], button[data-action*="sync"]')).toHaveCount(0);
  }
  expect(external).toEqual([]);
});
