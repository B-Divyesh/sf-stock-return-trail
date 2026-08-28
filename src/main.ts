import './style.css';
import { importState, loadState, resetDemo, saveState } from './db';
import type { AppState, Job, Movement, StockLine } from './types';

const root = document.querySelector<HTMLDivElement>('#app')!;
let state: AppState = { jobs: [], movements: [], updatedAt: '' };
let isDemo = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
let activeJobId = '';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollPositions = new Map<string, number>();
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const routeMeta: Record<string, { title: string; description: string }> = {
  '/': { title: 'Stock Return Trail — Return job stock to its origin', description: 'Record stock sent to a job, count what was used, and return each remainder to its saved origin.' },
  '/demo': { title: 'Demo — Stock Return Trail', description: 'Try a ready-to-close stock return with sample data.' },
  '/app': { title: 'Jobs — Stock Return Trail', description: 'Record stock leaving a store and close each job with returns.' },
  '/log': { title: 'Movement log — Stock Return Trail', description: 'Review and export your local stock movement log.' },
  '/settings': { title: 'Backup — Stock Return Trail', description: 'Back up and restore your local Stock Return Trail records.' },
  '/privacy': { title: 'Privacy — Stock Return Trail', description: 'How Stock Return Trail stores and handles your data.' },
  '/terms': { title: 'Terms — Stock Return Trail', description: 'Terms for using Stock Return Trail.' },
  '/404': { title: 'Page not found — Stock Return Trail', description: 'Return to Stock Return Trail.' },
};

const id = () => crypto.randomUUID();
const esc = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);
const fmtDate = (value: string) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

function currentPath() {
  const path = location.pathname.replace(/\/$/, '') || '/';
  return routeMeta[path] ? path : '/404';
}

function setMeta(path: string) {
  const meta = routeMeta[path];
  document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://stock-return-trail.sociobot.in${path === '/' ? '/' : path}`);
}

function iconMark() {
  return `<svg class="wordmark-mark" viewBox="0 0 42 42" aria-hidden="true"><path d="M5 23c4-7 8-11 16-13 8-2 14 3 16 9 2 7-2 14-8 17-7 3-17 0-20-6-3-6 2-13 9-15 6-3 13 1 14 7 2 6-4 11-10 11-4 0-7-2-7-5"/><path class="route-mark" d="M9 30c5-7 9-2 14-9 3-4 5-6 11-4"/></svg>`;
}

function shell(content: string) {
  const banner = isDemo ? `<aside class="demo-banner" aria-label="Demo mode"><span><strong>Demo</strong> — sample data, nothing is saved</span><div><button class="text-button" data-action="reset-demo">Reset demo</button><a href="/app" data-real>Start for real</a></div></aside>` : '';
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    ${banner}
    <header class="site-header">
      <a class="wordmark" href="/" aria-label="Stock Return Trail home">${iconMark()}<span>Stock Return Trail</span></a>
      <nav aria-label="Main navigation">
        <a href="/demo">Demo</a><a href="/app">Jobs</a><a href="/log">Trail log</a><a href="/privacy">Privacy</a>
      </nav>
    </header>
    <div id="network-state" class="network-state" role="status" hidden>You are offline. Saved records still work.</div>
    <main id="main" tabindex="-1">${content}</main>
    <footer class="site-footer">
      <p><strong>Stock Return Trail</strong><br><span>Return unused job stock to its saved origin.</span></p>
      <nav aria-label="Footer"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/settings">Backup</a></nav>
      <p>Built by Param Factory · v1.0.0<br><small>Hero artwork generated for this product.</small></p>
    </footer>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
    <div class="sr-only" id="route-status" aria-live="polite"></div>`;
}

function homePage() {
  return shell(`
    <section class="hero contour-field">
      <div class="hero-copy">
        <p class="eyebrow">Field stock · plotted home</p>
        <h1 tabindex="-1">Return job stock to the right place</h1>
        <p class="lede">For field teams who need each unused item sent back without searching old movement records.</p>
        <div class="hero-action"><a class="button primary" href="/demo">Try it with sample data</a><span>Open a ready-to-close job. Nothing is saved.</span></div>
        <ul class="plain-facts" aria-label="Product facts"><li>Works offline after your first visit.</li><li>Your stock records stay in this browser.</li><li>Use it without an account or a job limit.</li></ul>
      </div>
      <figure class="hero-art"><picture><source srcset="/assets/hero-topographic.avif" type="image/avif"><img src="/assets/hero-topographic.webp" width="900" height="600" fetchpriority="high" alt="A field parts case connected to its stockroom by a red route line."></picture><figcaption>Each item keeps its origin while it is out on a job.</figcaption></figure>
    </section>
    <section class="live-preview section-rule" aria-labelledby="preview-title">
      <div class="section-heading"><p class="eyebrow">Live closeout preview</p><h2 id="preview-title">See every return before you move it</h2><p>The job sheet subtracts used stock and groups the remainder by origin.</p></div>
      <div class="preview-sheet" aria-label="Example closeout sheet">
        <div class="preview-route" aria-hidden="true"><span>Origin</span><i></i><span>Job</span><i></i><span>Return</span></div>
        <div class="preview-row"><span><b>VAL-22</b> Isolation valve</span><span>6 out − 2 used</span><strong>4 → Bin B4</strong></div>
        <div class="preview-row"><span><b>CBL-3C</b> 3-core flex</span><span>4 out − 1 used</span><strong>3 → Cable rack</strong></div>
        <a class="text-link" href="/demo">Close the sample job →</a>
      </div>
    </section>
    <section class="how section-rule" aria-labelledby="how-title"><div class="section-heading"><p class="eyebrow">Three field marks</p><h2 id="how-title">How the trail works</h2></div><ol class="steps"><li><span>01</span><h3>Record stock out</h3><p>Scan or enter a code. Add its count and store location.</p></li><li><span>02</span><h3>Count what was used</h3><p>At closeout, enter the used count for each stock line.</p></li><li><span>03</span><h3>Return the remainder</h3><p>The sheet names each origin and adds the moves to your CSV log.</p></li></ol></section>
    <section class="limits section-rule" aria-labelledby="limits-title"><div><p class="eyebrow">A narrow tool on purpose</p><h2 id="limits-title">A return trail, not an accounts system</h2></div><div><p>Stock Return Trail does not price stock, place orders, or sync teams.</p><p>Movement logs help with field closeout. They are not audit-grade inventory valuation.</p><p>You can export CSV and JSON backups at any time.</p></div></section>
  `);
}

function appPage() {
  const openJobs = state.jobs.filter((job) => job.status === 'open');
  const active = state.jobs.find((job) => job.id === activeJobId) || openJobs[0] || state.jobs[0];
  if (active) activeJobId = active.id;
  const jobContent = active ? jobPanel(active) : `<section class="empty-state"><div class="contour-pin" aria-hidden="true">＋</div><h2>No jobs are on the trail</h2><p>Create a job, then add stock as it leaves its origin.</p><button class="button primary" data-action="show-job-form">Create your first job</button></section>`;
  return shell(`
    <section class="app-head"><div><p class="eyebrow">Field board</p><h1 tabindex="-1">Track stock out and back</h1><p>${isDemo ? 'This sample job is ready for closeout.' : 'Each stock line keeps the origin you record.'}</p></div><button class="button secondary" data-action="show-job-form">Create job</button></section>
    <div class="job-layout">
      <aside class="job-rail" aria-label="Jobs"><div class="rail-title"><h2>Jobs</h2><span>${openJobs.length} open</span></div>${state.jobs.length ? `<div class="job-list">${state.jobs.map((job) => `<button class="job-tab ${job.id === active?.id ? 'active' : ''}" data-job="${job.id}" aria-pressed="${job.id === active?.id}"><span>${esc(job.name)}</span><small>${job.status === 'open' ? `${job.lines.length} stock lines` : 'Closed'}</small></button>`).join('')}</div>` : '<p class="rail-empty">Created jobs appear here.</p>'}</aside>
      <div class="job-work">${jobContent}</div>
    </div>
    <dialog id="job-dialog"><form method="dialog" id="job-form"><div class="dialog-head"><div><p class="eyebrow">New trail</p><h2>Create a job</h2></div><button class="icon-button" type="button" data-action="close-job-dialog" aria-label="Close create job dialog">×</button></div><label>Job name<input name="name" required maxlength="60" autocomplete="off"></label><label>Temporary location<input name="site" required maxlength="80" autocomplete="off"></label><p class="field-help">Example: “Riverside pump room” at “Riverside Court”.</p><p class="form-error" id="job-error" role="alert"></p><button class="button primary" value="default">Create job</button></form></dialog>
    <dialog id="scanner-dialog"><div class="dialog-head"><h2>Scan a stock code</h2><button class="icon-button" data-action="close-scanner" aria-label="Close scanner">×</button></div><video id="scanner-video" playsinline muted></video><p id="scanner-status">Point the camera at a barcode.</p></dialog>
  `);
}

function jobPanel(job: Job) {
  const isClosed = job.status === 'closed';
  return `<article class="job-sheet">
    <header class="job-sheet-head"><div><p class="eyebrow">${isClosed ? 'Closed trail' : 'Open trail'}</p><h2>${esc(job.name)}</h2><p>${esc(job.site)} · started ${fmtDate(job.createdAt)}</p></div><span class="status-chip ${isClosed ? 'closed' : ''}">${isClosed ? '✓ Closed' : '● Open'}</span></header>
    <div class="route-strip" aria-label="Movement route"><span><small>FROM</small>Saved origins</span><i aria-hidden="true"></i><span><small>AT</small>${esc(job.site)}</span><i aria-hidden="true"></i><span><small>BACK</small>${isClosed ? 'Returns recorded' : 'Ready at closeout'}</span></div>
    ${job.lines.length ? `<form id="closeout-form"><div class="stock-table"><div class="stock-head"><span>Stock</span><span>Origin</span><span>${isClosed ? 'Used' : 'Used now'}</span><span>Return</span></div>${job.lines.map((line) => stockRow(line, isClosed)).join('')}</div>${isClosed ? `<div class="complete-panel"><strong>Return trail saved</strong><p>The movement log now includes used and returned counts.</p><a class="button secondary" href="/log">Open trail log</a></div>` : `<div class="closeout-bar"><p><strong>Closeout check</strong><span>Enter used counts, then record every return.</span></p><button class="button primary" data-action="close-job">Record returns &amp; close job</button></div>`}</form>` : `<div class="inline-empty"><h3>No stock is on this job</h3><p>Add the first item as it leaves a store.</p></div>`}
    ${!isClosed ? `<form id="stock-form" class="stock-form"><div class="form-title"><div><p class="eyebrow">Stock out</p><h3>Add stock to this job</h3></div><button class="button scan-button" type="button" data-action="scan-code">⌁ Scan code</button></div><div class="field-grid"><label>Stock code<input name="code" required maxlength="30" autocomplete="off" placeholder="VAL-22"></label><label>Item name<input name="name" required maxlength="80" autocomplete="off" placeholder="Isolation valve"></label><label>Count<input name="quantity" required type="number" min="1" max="99999" step="1" inputmode="numeric" value="1"></label><label>Origin<input name="origin" required maxlength="80" autocomplete="off" placeholder="Main stores · Bin B4"></label></div><p class="form-error" id="stock-error" role="alert"></p><button class="button secondary" type="submit">Add stock out</button></form>` : ''}
  </article>`;
}

function stockRow(line: StockLine, closed: boolean) {
  const returned = Math.max(0, line.quantity - line.used);
  return `<div class="stock-row" data-line="${line.id}"><span class="item-cell"><b>${esc(line.code)}</b><span>${esc(line.name)}</span><small>${line.quantity} sent out</small></span><span class="origin-cell">${esc(line.origin)}</span><label><span class="mobile-label">Used</span><input class="used-input" name="used-${line.id}" type="number" min="0" max="${line.quantity}" step="1" inputmode="numeric" value="${line.used}" ${closed ? 'disabled' : ''}><span class="sr-only"> used of ${line.quantity} ${esc(line.name)}</span></label><span class="return-cell"><strong data-return="${line.id}">${returned}</strong><small>to ${esc(line.origin)}</small></span></div>`;
}

function logPage() {
  const rows = [...state.movements].reverse();
  return shell(`<section class="page-head"><div><p class="eyebrow">Movement record</p><h1 tabindex="-1">Review the stock trail</h1><p>Every stock-out, use, and return stays in this browser.</p></div><button class="button primary" data-action="export-csv" ${rows.length ? '' : 'disabled'}>Export CSV</button></section>${rows.length ? `<div class="log-wrap"><table><caption>${rows.length} recorded movements</caption><thead><tr><th>Date</th><th>Job</th><th>Item</th><th>Move</th><th>Count</th><th>From → to</th></tr></thead><tbody>${rows.map((move) => `<tr><td>${fmtDate(move.at)}</td><td>${esc(move.jobName)}</td><td><b>${esc(move.itemCode)}</b><br>${esc(move.itemName)}</td><td><span class="move-chip ${move.kind}">${move.kind === 'out' ? 'Stock out' : move.kind === 'used' ? 'Used' : 'Returned'}</span></td><td>${move.quantity}</td><td>${esc(move.from)} → ${esc(move.to)}</td></tr>`).join('')}</tbody></table></div>` : `<section class="empty-state"><div class="contour-pin" aria-hidden="true">↝</div><h2>No movements are recorded</h2><p>Add stock to a job. Its route will appear here.</p><a class="button primary" href="/app">Open jobs</a></section>`}<p class="valuation-note"><strong>Record note:</strong> This movement log is for field closeout. It is not audit-grade inventory valuation.</p>`);
}

function settingsPage() {
  return shell(`<section class="page-head"><div><p class="eyebrow">Your records</p><h1 tabindex="-1">Back up your records</h1><p>Exports let you move or copy the records kept in this browser.</p></div></section><div class="settings-grid settings-grid-single"><section><h2>Back up your records</h2><p>Download all jobs and movements as one JSON file.</p><div class="button-row"><button class="button primary" data-action="export-json">Download JSON backup</button><label class="button secondary file-button">Import JSON<input id="import-file" type="file" accept="application/json,.json"></label></div><p class="notice" id="import-status" role="status"></p></section></div>`);
}

function privacyPage() {
  return shell(`<article class="prose"><p class="eyebrow">Plain privacy</p><h1 tabindex="-1">Your stock records stay on your device</h1><p class="lede">Stock Return Trail keeps jobs and movements in your browser’s IndexedDB storage.</p><h2>What stays local</h2><p>Job names, locations, stock codes, counts, and movement logs stay in your browser. Demo records use a separate database and are discarded when you reset the demo.</p><h2>When the network is used</h2><p>The app downloads its files on your first visit. It does not send stock records to a server.</p><h2>Your choices</h2><p>You can export a JSON backup or CSV log. Clearing site data removes local records. We cannot recover records you have not backed up.</p><h2>Contact</h2><p>For privacy questions, email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p><p>Last updated: 28 August 2026.</p></article>`);
}

function termsPage() {
  return shell(`<article class="prose"><p class="eyebrow">Use terms</p><h1 tabindex="-1">Use the trail as a field record</h1><p class="lede">These terms cover Stock Return Trail.</p><h2>The tool</h2><p>Stock Return Trail records movements you enter. It does not verify physical stock or provide audit-grade inventory valuation.</p><h2>Your responsibility</h2><p>Check counts and origins before moving stock. Keep backups you need. Do not rely on the app as your only legal or accounting record.</p><h2>Availability</h2><p>The software is provided as-is under the MIT license. We may fix or change it without promising continuous service.</p><h2>Contact</h2><p>For terms questions, email <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p><p>Last updated: 28 August 2026.</p></article>`);
}

function notFoundPage() {
  return shell(`<section class="not-found contour-field"><div class="map-code">404</div><p class="eyebrow">Off the plotted route</p><h1 tabindex="-1">This page is not on the trail</h1><p>The address may have changed. Your local stock records are untouched.</p><a class="button primary" href="/">Return to the start</a></section>`);
}

async function render(focus = false) {
  const path = currentPath();
  setMeta(path);
  if (path === '/demo') isDemo = true;
  if (path === '/app' && !new URLSearchParams(location.search).has('demo')) isDemo = false;
  if (['/demo', '/app', '/log', '/settings'].includes(path)) state = await loadState(isDemo);
  const content = path === '/' ? homePage() : path === '/demo' || path === '/app' ? appPage() : path === '/log' ? logPage() : path === '/settings' ? settingsPage() : path === '/privacy' ? privacyPage() : path === '/terms' ? termsPage() : notFoundPage();
  root.innerHTML = content;
  bindEvents();
  updateNetworkState();
  if (focus) {
    scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    root.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
    const status = document.querySelector('#route-status');
    if (status) status.textContent = document.title;
  }
}

function navigate(path: string) {
  scrollPositions.set(`${location.pathname}${location.search}`, scrollY);
  if (isDemo && path !== '/demo') path += `${path.includes('?') ? '&' : '?'}demo=1`;
  history.pushState({}, '', path);
  void render(true);
}

function showToast(message: string) {
  const toast = document.querySelector<HTMLElement>('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

function updateNetworkState() {
  const bar = document.querySelector<HTMLElement>('#network-state');
  if (bar) bar.hidden = navigator.onLine;
}

function bindEvents() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((link) => link.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || link.hasAttribute('download')) return;
    event.preventDefault();
    if (link.hasAttribute('data-real')) { isDemo = false; void resetDemo(); }
    navigate(link.getAttribute('href')!);
  }));
  document.querySelectorAll<HTMLElement>('[data-action]').forEach((element) => element.addEventListener('click', handleAction));
  document.querySelectorAll<HTMLButtonElement>('[data-job]').forEach((button) => button.addEventListener('click', () => { activeJobId = button.dataset.job!; void render(); }));
  document.querySelector<HTMLFormElement>('#job-form')?.addEventListener('submit', createJob);
  document.querySelector<HTMLFormElement>('#stock-form')?.addEventListener('submit', addStock);
  document.querySelectorAll<HTMLInputElement>('.used-input').forEach((input) => input.addEventListener('input', updateReturnCount));
  document.querySelectorAll<HTMLInputElement>('#job-form input, #stock-form input').forEach((input) => input.addEventListener('input', () => input.setCustomValidity('')));
  document.querySelector<HTMLInputElement>('#import-file')?.addEventListener('change', handleImport);
}

async function handleAction(event: Event) {
  const target = event.currentTarget as HTMLElement;
  const action = target.dataset.action;
  if (action === 'show-job-form') document.querySelector<HTMLDialogElement>('#job-dialog')?.showModal();
  if (action === 'close-job-dialog') document.querySelector<HTMLDialogElement>('#job-dialog')?.close();
  if (action === 'reset-demo') { await resetDemo(); state = await loadState(true); activeJobId = ''; await render(); showToast('Demo reset to its starting job.'); }
  if (action === 'close-job') { event.preventDefault(); await closeJob(); }
  if (action === 'export-csv') exportCsv();
  if (action === 'export-json') exportJson();
  if (action === 'scan-code') await startScanner();
  if (action === 'close-scanner') stopScanner();
}

async function createJob(event: SubmitEvent) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const name = requiredFormText(form, 'name', 'job name', '#job-error');
  if (!name) return;
  const site = requiredFormText(form, 'site', 'temporary location', '#job-error');
  if (!site) return;
  const job: Job = { id: id(), name, site, status: 'open', createdAt: new Date().toISOString(), lines: [] };
  state.jobs.unshift(job);
  activeJobId = job.id;
  await saveState(isDemo, state);
  form.closest('dialog')?.close();
  await render();
  showToast(`${job.name} created.`);
}

async function addStock(event: SubmitEvent) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const job = state.jobs.find((item) => item.id === activeJobId);
  if (!job) return;
  const code = requiredFormText(form, 'code', 'stock code', '#stock-error');
  if (!code) return;
  const name = requiredFormText(form, 'name', 'item name', '#stock-error');
  if (!name) return;
  const origin = requiredFormText(form, 'origin', 'origin', '#stock-error');
  if (!origin) return;
  const quantity = Number(data.get('quantity'));
  if (!Number.isInteger(quantity) || quantity < 1) { document.querySelector('#stock-error')!.textContent = 'The count must be a whole number of at least one.'; return; }
  const line: StockLine = { id: id(), code, name, quantity, used: 0, origin };
  job.lines.push(line);
  state.movements.push(movement(job, line, 'out', quantity, line.origin, job.site));
  await saveState(isDemo, state);
  await render();
  showToast(`${line.name} added to ${job.name}.`);
}

function requiredFormText(form: HTMLFormElement, fieldName: string, label: string, errorSelector: string): string | undefined {
  const input = form.elements.namedItem(fieldName) as HTMLInputElement | null;
  const value = input?.value.trim() || '';
  if (value) {
    input?.setCustomValidity('');
    return value;
  }
  const message = `Enter a ${label}, not only spaces.`;
  if (input) {
    input.setCustomValidity(message);
    input.reportValidity();
    input.focus();
  }
  const error = document.querySelector<HTMLElement>(errorSelector);
  if (error) error.textContent = message;
  return undefined;
}

function movement(job: Job, line: StockLine, kind: Movement['kind'], quantity: number, from: string, to: string): Movement {
  return { id: id(), at: new Date().toISOString(), jobId: job.id, jobName: job.name, itemCode: line.code, itemName: line.name, quantity, kind, from, to };
}

function updateReturnCount(event: Event) {
  const input = event.currentTarget as HTMLInputElement;
  const row = input.closest<HTMLElement>('[data-line]')!;
  const line = state.jobs.find((job) => job.id === activeJobId)?.lines.find((item) => item.id === row.dataset.line);
  if (!line) return;
  const value = Number(input.value);
  const output = document.querySelector(`[data-return="${line.id}"]`);
  if (output) output.textContent = Number.isFinite(value) ? String(Math.max(0, line.quantity - value)) : '—';
}

async function closeJob() {
  const job = state.jobs.find((item) => item.id === activeJobId);
  if (!job) return;
  const inputs = [...document.querySelectorAll<HTMLInputElement>('.used-input')];
  for (const input of inputs) {
    const lineId = input.closest<HTMLElement>('[data-line]')!.dataset.line;
    const line = job.lines.find((item) => item.id === lineId)!;
    const used = Number(input.value);
    if (!Number.isInteger(used) || used < 0 || used > line.quantity) {
      input.setCustomValidity(`Enter a whole number from 0 to ${line.quantity}.`);
      input.reportValidity();
      input.focus();
      return;
    }
    line.used = used;
  }
  for (const line of job.lines) {
    if (line.used > 0) state.movements.push(movement(job, line, 'used', line.used, job.site, 'Used on job'));
    const returned = line.quantity - line.used;
    if (returned > 0) state.movements.push(movement(job, line, 'return', returned, job.site, line.origin));
  }
  job.status = 'closed';
  job.closedAt = new Date().toISOString();
  await saveState(isDemo, state);
  await render();
  showToast(`${job.name} closed. Returns were added to the trail log.`);
}

function csvText() {
  const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const header = ['date', 'job', 'item_code', 'item_name', 'movement', 'count', 'from', 'to'];
  return [header.join(','), ...state.movements.map((move) => [move.at, move.jobName, move.itemCode, move.itemName, move.kind, move.quantity, move.from, move.to].map(quote).join(','))].join('\r\n');
}

function download(name: string, contents: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement('a');
  link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportCsv() { download('stock-return-trail.csv', csvText(), 'text/csv;charset=utf-8'); showToast('CSV log exported.'); }
function exportJson() { download('stock-return-trail-backup.json', JSON.stringify(state, null, 2), 'application/json'); showToast('JSON backup downloaded.'); }

async function handleImport(event: Event) {
  const input = event.currentTarget as HTMLInputElement;
  const status = document.querySelector<HTMLElement>('#import-status')!;
  try {
    const file = input.files?.[0];
    if (!file) return;
    const parsed = await importState(JSON.parse(await file.text()));
    if (!confirm(`Replace this browser's records with ${parsed.jobs.length} jobs and ${parsed.movements.length} movements?`)) return;
    state = parsed;
    await saveState(isDemo, state);
    status.textContent = 'Backup imported. Your local records were replaced.';
  } catch (error) {
    status.textContent = error instanceof Error ? `${error.message} Choose a Stock Return Trail JSON backup.` : 'The backup could not be read. Choose another file.';
    status.classList.add('warning');
  }
}

let scannerStream: MediaStream | undefined;
async function startScanner() {
  const dialog = document.querySelector<HTMLDialogElement>('#scanner-dialog')!;
  const status = dialog.querySelector<HTMLElement>('#scanner-status')!;
  dialog.showModal();
  try {
    const Detector = (window as typeof window & { BarcodeDetector?: new (options: { formats: string[] }) => { detect(source: CanvasImageSource): Promise<{ rawValue: string }[]> } }).BarcodeDetector;
    if (!Detector) throw new Error('This browser does not support camera barcode scanning. Enter the stock code instead.');
    scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    const video = dialog.querySelector<HTMLVideoElement>('#scanner-video')!;
    video.srcObject = scannerStream; await video.play();
    const detector = new Detector({ formats: ['code_128', 'code_39', 'ean_13', 'qr_code'] });
    while (scannerStream) {
      const codes = await detector.detect(video);
      if (codes[0]) { const input = document.querySelector<HTMLInputElement>('#stock-form input[name="code"]'); if (input) input.value = codes[0].rawValue; stopScanner(); input?.focus(); showToast(`Code ${codes[0].rawValue} scanned.`); return; }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  } catch (error) { status.textContent = error instanceof Error ? error.message : 'The camera could not start. Enter the stock code instead.'; }
}
function stopScanner() { scannerStream?.getTracks().forEach((track) => track.stop()); scannerStream = undefined; document.querySelector<HTMLDialogElement>('#scanner-dialog')?.close(); }

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) showToast('An update is ready. Reload to use it.'); });
    });
  }).catch(() => { /* The app still works online when registration is blocked. */ });
}

window.addEventListener('popstate', () => void render(false).then(() => {
  const heading = root.querySelector<HTMLElement>('h1');
  heading?.focus({ preventScroll: true });
  scrollTo({ top: scrollPositions.get(`${location.pathname}${location.search}`) || 0, behavior: 'auto' });
}));
window.addEventListener('online', updateNetworkState);
window.addEventListener('offline', updateNetworkState);
async function initialise() {
  try {
    await render();
  } catch {
    root.innerHTML = shell(`<section class="empty-state"><div class="contour-pin" aria-hidden="true">!</div><h1 tabindex="-1">Local records could not open</h1><p>Check that browser storage is allowed, then reload this page.</p><button class="button primary" id="reload-app">Reload the app</button></section>`);
    document.querySelector('#reload-app')?.addEventListener('click', () => location.reload());
    return;
  }
}
void initialise();
registerServiceWorker();
