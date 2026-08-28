# Stock Return Trail v1 handoff

## What was built

- Offline-first Vite and TypeScript PWA for sending stock to temporary jobs and returning each remainder to its recorded origin.
- Real workflow: create a job, enter or scan stock codes, record counts and origins, enter partial-use counts, close the job, and review the resulting movements.
- CSV movement export plus full JSON backup and import.
- IndexedDB persistence with separate `stock-return-trail:real` and `stock-return-trail:demo` databases.
- One-click `/demo` with a ready-to-close pump-room job, persistent demo banner, reset control, and clean exit to real data.
- £19 one-time site kit flow through the Sociobot checkout and license verification contract. Core closeout, export, backup, and accessibility remain free.
- Installable PWA manifest, responsive icons, versioned service worker, generated precache list, offline navigation fallback, and update notice.
- SPA routes for `/`, `/demo`, `/app`, `/log`, `/settings`, `/privacy`, `/terms`, and a styled unknown-route page.
- Topographic cartography visual system with self-hosted fonts and original generated hero artwork in AVIF and WebP.
- Metadata, social preview, sitemap, robots file, CSP, security headers, keyboard focus handling, reduced-motion rules, and local error states.

## How to run and verify

```sh
npm install
npm test
npm run build
npm run preview
```

Production output is `./dist`, with `dist/index.html` at its root.

Verification completed on 28 August 2026:

- `npm test`: 11 passed.
- Claim tests: offline reload, CSV export, return provenance, stock-code entry, browser-local records, demo isolation, free/paid job limits, and JSON backup all passed.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse metrics: LCP 2.0 s, CLS 0, Total Blocking Time 0 ms.
- Factory `verify-url.sh`: HTTP 200, no console errors, one H1, one main landmark, language set, and no missing image alt text.
- Production bundle: 29.46 KB JavaScript (10.41 KB gzip), 19.69 KB CSS (5.63 KB gzip), and 53.30 KB of WOFF2 fonts.
- Hero: 67,917-byte AVIF and 101,872-byte WebP, both below the 300 KB budget.
- Manual visual review completed at 1440 px and 390 px. Evidence is in `.factory/verification/`, `.factory/home.png`, and `.factory/demo-mobile.png`.

## Product boundaries and known gaps

- This is a single-device, local-first v1. It does not sync teams. Conflict handling must be designed before shared-device sync is added.
- Camera scanning uses the browser `BarcodeDetector` API. Browsers without it show a clear manual-entry fallback.
- Movement logs are operational closeout records, not audit-grade inventory valuation.
- Clearing browser site data removes records unless the user exported a JSON backup.
- The factory must register the `stock-return-trail` billing product and confirm the final £19 checkout price before release.
- A real Android field-device scan check is recommended after deployment. The automated suite verifies the camera-detection path with a controlled barcode fixture.

## Next steps

1. Register the live Sociobot product and return URL.
2. Deploy `dist/` through the factory static pipeline.
3. Run a short field pilot and measure closeout completion and median reconciliation time against the brief.
