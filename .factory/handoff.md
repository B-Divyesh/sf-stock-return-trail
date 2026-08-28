# Stock Return Trail polish 1 handoff

## Result

**PASS.** Repair commit `85201378fe36a3da77cbf92e34b3b579fac9c765` is pushed to `main` and deployed to https://stock-return-trail.sociobot.in. All F-1-1 through F-1-15 findings are closed in `.factory/polish-1.md`.

## What changed

- Added two missing claim records and observable, isolated demo tests for analytics absence and product scope.
- Added direct `?demo=1` sample entry with its isolated banner, reset, and real-workspace exit.
- Emitted real static HTML for every public route with route-specific raw/client metadata; unknown URLs now return the styled 404 with HTTP 404.
- Standardised field language around **movement log**, **origin**, and **finish a job**; rewrote all reviewed jargon in product copy and README.
- Added complete raw-route, all-route accessibility, metadata, and live link/privacy evidence.

## Verification

Fresh clone (`/tmp/stock-return-trail-clean.5g1hyX`) after `npm ci`:

```sh
npm run test:unit       # 5 tests passed
npm run test:static     # 8 raw route pages passed
npm test                # 22 Playwright tests passed
```

Every command in `.factory/claims.json` passed individually from that fresh clone: `offline-reload`, `csv-export`, `return-provenance`, `stock-code-entry`, `local-records`, `demo-isolation`, `no-account-job-limit`, `json-backup`, `no-analytics`, and `scope-boundary`.

Post-deploy:

- `verify-url.sh` passed on `/` and `/demo`; no errors, one H1, `lang=en`, main landmark, and complete image alt text. Evidence: `.factory/polish-1-evidence/verify-root/verify.json` and `.factory/polish-1-evidence/verify-demo/verify.json`.
- Playwright + axe scanned `/`, `/demo`, `/app`, `/log`, `/settings`, `/privacy`, `/terms`, and `/does-not-exist` at 1440 px and 390 px: zero violations; every valid route 200; unknown route 404; direct `?demo=1` and offline demo reload passed. Evidence: `.factory/polish-1-evidence/live-browser-a11y.json`.
- Live link crawl found all internal links returned 200 and all observed requests stayed same-origin. Evidence: `.factory/polish-1-evidence/live-links-privacy.json`.
- Lighthouse on live `/demo`: Performance 98, Accessibility 100, Best Practices 100, SEO 100; LCP 1.352 s, CLS 0.030. Evidence: `.factory/polish-1-evidence/lighthouse-live.json`. The runner reported a post-audit Chromium target crash while capturing its final screenshot, but it wrote the complete scored report; independent Playwright checks were error-free.

## Run and deploy

```sh
npm ci
npm test
npm run test:unit
npm run test:static
npm run build
```

Deploy `dist/` as the configured static app.

## Known gaps

None in the product. The Lighthouse runner’s final-screenshot crash is a verifier-process caveat only; its completed report and independent live browser checks are retained as evidence.
