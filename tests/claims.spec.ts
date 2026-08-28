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
  await page.getByRole('button', { name: 'Record returns & close job' }).click();
  await page.getByRole('link', { name: 'Open trail log' }).click();
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
  await page.getByRole('button', { name: 'Record returns & close job' }).click();
  await expect(page.getByText('Return trail saved')).toBeVisible();
  expect(external).toEqual([]);
});

test('@claim:demo-isolation keeps real records empty', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Record returns & close job' }).click();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { name: 'No jobs are on the trail' })).toBeVisible();
});

test('@claim:free-job-limit allows two free jobs and removes the limit with a valid license', async ({ page, browser }) => {
  await page.goto('/app');
  for (const number of [1, 2]) {
    if (number === 1) await page.getByRole('button', { name: 'Create your first job' }).click();
    else await page.locator('.app-head').getByRole('button', { name: 'Create job' }).click();
    await page.getByLabel('Job name').fill(`Job ${number}`);
    await page.getByLabel('Temporary location').fill(`Site ${number}`);
    await page.getByRole('button', { name: 'Create job', exact: true }).last().click();
  }
  await page.locator('.app-head').getByRole('button', { name: 'Create job' }).click();
  await page.getByLabel('Job name').fill('Job 3');
  await page.getByLabel('Temporary location').fill('Site 3');
  await page.getByRole('button', { name: 'Create job', exact: true }).last().click();
  await expect(page.getByText('The free plan allows two open jobs.')).toBeVisible();
  await expect(page.getByText('2 open')).toBeVisible();

  const paidContext = await browser.newContext();
  const paidPage = await paidContext.newPage();
  await paidPage.addInitScript(() => {
    localStorage.setItem('sb_license:stock-return-trail', 'test-license');
    localStorage.setItem('sb_license_verdict:stock-return-trail', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await paidPage.goto('/settings');
  await expect(paidPage.getByText('Site kit is active on this device.')).toBeVisible();
  for (const number of [1, 2, 3]) {
    await paidPage.goto('/app');
    const first = paidPage.getByRole('button', { name: 'Create your first job' });
    if (await first.isVisible().catch(() => false)) await first.click();
    else await paidPage.locator('.app-head').getByRole('button', { name: 'Create job' }).click();
    await paidPage.getByLabel('Job name').fill(`Paid job ${number}`);
    await paidPage.getByLabel('Temporary location').fill(`Paid site ${number}`);
    await paidPage.getByRole('button', { name: 'Create job', exact: true }).last().click();
    await expect(paidPage.getByText(`${number} open`)).toBeVisible();
  }
  await paidContext.close();
});

test('@claim:json-backup contains jobs and movements', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Backup & license' }).click();
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
