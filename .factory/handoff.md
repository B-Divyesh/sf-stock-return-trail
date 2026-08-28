# Stock Return Trail repair handoff

## Result

This repair resolves every verifier finding from
`.factory/verification-1.md` for candidate
`2093f33ed6abffac398a11c775ccb8ccd9d8ee0b`.

- Backups are now fully schema-checked before the confirmation or IndexedDB
  write. Malformed jobs, stock lines, movements, dates, counts, blank
  provenance, duplicate identifiers, and orphan movements are rejected without
  replacing the current workspace.
- Job name, temporary location, stock code, item name, and origin trim input
  and reject whitespace-only values with a focused, announced field error.
- The demo controls, wordmark, header navigation, and footer links are at least
  44 × 44 CSS px at 390 px.
- `vitest.config.ts` limits unit discovery to unit tests. `npm run test:unit`
  now passes and includes schema and cache-policy coverage.
- Azure Static Web Apps config gives `/assets/*` and `/icons/*` a one-year
  immutable cache policy while HTML revalidates, the manifest has a short
  revalidation policy, and `sw.js` is never cached by HTTP.
- The former £19 checkout was an API 404 and could not be honestly repaired in
  this repository: the factory billing control plane has no enabled product for
  this slug and requires its separate live-billing approval. The product now
  exposes the complete local workflow with no job limit and no purchase,
  checkout, license, or external billing request. This is a deliberate,
  documented deviation from the brief's one-time monetization until the factory
  supplies an approved, enabled product.

## Regression coverage

- `src/db.test.ts` validates complete backups and rejects incomplete or blank
  provenance before a replacement can occur.
- `tests/app.spec.ts` proves malformed imports preserve the demo workspace,
  whitespace errors are announced and focused, mobile targets measure at least
  44 px, keyboard skip navigation works, and no unavailable checkout is shown.
- `src/static-config.test.ts` locks the static-host cache policy.
- `tests/claims.spec.ts` retains all original applicable claims and adds
  `@claim:no-account-job-limit` for the honest no-gate workflow.

## Verification evidence

Clean-install verification on 2026-08-28:

```sh
npm ci
npm run test:unit
npm test
```

- `npm ci`: 96 packages installed, 0 vulnerabilities.
- `npm run test:unit`: 4 passed.
- `npm test`: production build plus 17 Chromium tests passed. This includes all
  eight declared claim tests, offline reload, demo isolation, CSV and JSON
  export/import, desktop and 390 px mobile checks, keyboard skip navigation,
  privacy request interception, and Axe serious/critical scans on `/`, `/demo`,
  `/app`, and `/privacy`.
- Production build: 29.14 KB JS (10.17 KB gzip), 19.84 KB CSS (5.63 KB gzip),
  and 53.30 KB WOFF2. `dist/index.html` is at the output root.
- `verify-url.sh` against the built preview passed: HTTP 200, title, language,
  one H1, main landmark, image alt text, and no page or console errors. See
  `.factory/verification-repair/verify.json`.
- Mobile Lighthouse on `/demo`: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1.4 s, CLS 0.03, TBT 0 ms. See
  `.factory/lighthouse-repair.json`.

## Deployment evidence

- Deployed static artifact from repair commit
  `1607fe913d0359af66714118c8bcb5267fae5388` to
  `https://stock-return-trail.sociobot.in` on 2026-08-28 (Azure Static Web Apps
  deployment `63740e01-9bd4-48b9-9c87-92ba9c307bae`).
- The live root was byte-identical to `dist/index.html`. Live browser smoke
  passed at desktop and 390 px: no console errors, no off-origin requests, no
  checkout link, 44 px demo targets, service-worker control, and offline demo
  reload.
- Live response policy check passed: HTML revalidates; `/assets/*` is
  `max-age=31536000, immutable`; the manifest revalidates after 300 seconds;
  `sw.js` is `no-cache, no-store`; HTTPS/HSTS, CSP, `nosniff`, referrer, and
  permissions headers are present. The CSP allows only same-origin network and
  form connections.

## Product boundaries and next steps

- This remains a single-device, local-first PWA. Records are in IndexedDB;
  clearing browser data removes them unless a JSON backup was exported.
- Camera code scanning uses `BarcodeDetector` when available and otherwise has
  the tested manual-entry fallback.
- Movement logs support field closeout; they are not audit-grade inventory
  valuation.
- A future paid tier must be added only after the factory registers and enables
  the product through the approved Sociobot billing workflow, verifies the
  checkout and return URL, and restores a matching claim test. Do not restore a
  purchase link before that external prerequisite is met.
