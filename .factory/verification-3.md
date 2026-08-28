# Independent verification 3 — PASS

**Candidate:** `9d835651472b63fc604ceef70e6c83c09f2dfe63`  
**Live URL:** https://stock-return-trail.sociobot.in  
**Verified:** 2026-08-28 (UTC)  
**Scope:** independent release QA against the researched brief and factory product contract. No product source was changed.

## Decision

**PASS.** The live deployment is the tested candidate, not the stale artifact described in the preceding handoff. No release-blocking defects were found.

## Mandatory first read and demo

Fresh desktop and 390 px browser contexts opened the live home page cold. The first screen says **“Return job stock to the right place,”** says it is **“For field teams”** returning unused items without searching old records, and has one visible **“Try it with sample data”** action. Its adjacent text says that it opens a ready-to-close job and saves nothing. The action opened `/demo`, which showed the persistent **“Demo — sample data, nothing is saved”** banner, Reset demo, Start for real, and a realistic Riverside pump-room closeout. This passes the plain-words and one-click sandbox gates.

## Clean-checkout test evidence

- `npm ci`: pass; 96 packages installed; npm reported 0 vulnerabilities.
- `npm run build`: pass. It runs TypeScript checking, Vite production build, service-worker injection, and produces `dist/`.
- `npm run test:unit`: pass; 2 files / 4 tests.
- Browser tests: all 17 repository Playwright tests passed. The 8 claim cases below were run individually through `npm test -- --grep @claim:<id>`; the remaining 9 browser cases passed together with `npx playwright test --workers=2 --grep 'landing page has|required structure|keyboard users|app and privacy routes|mobile layout keeps|rejects whitespace|rejects malformed|mobile demo, navigation|legal pages and unknown|does not advertise'` (9 passed, 22.7 s).

| Claim ID | Required command | Result |
| --- | --- | --- |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS — first visit, service-worker control, offline reload, and offline notice |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS — header plus nine recorded sample movements |
| `return-provenance` | `npm test -- --grep @claim:return-provenance` | PASS — 4/3/6 returns to saved origins; nine movements after closeout |
| `stock-code-entry` | `npm test -- --grep @claim:stock-code-entry` | PASS — manual entry and stubbed supported-browser scanner in `/demo` |
| `local-records` | `npm test -- --grep @claim:local-records` | PASS — demo closeout made only same-origin requests |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS — closing demo then starting for real leaves real workspace empty |
| `no-account-job-limit` | `npm test -- --grep @claim:no-account-job-limit` | PASS — three additional demo jobs, no sign-in or purchase gate |
| `json-backup` | `npm test -- --grep @claim:json-backup` | PASS — JSON contains jobs/movements and restores after explicit confirmation |

## Live functional and PWA evidence

- Normal path: closed the live demo job, verified **9 recorded movements**, and downloaded CSV.
- Boundary path: a used count of 7 for 6 sent items has `validity.rangeOverflow`; count 0 for a stock-out has `validity.rangeUnderflow`. A real one-item job, with all 1 used, closed successfully and wrote exactly 2 movements (out + used; no spurious return).
- Invalid/recovery coverage: repository browser tests passed whitespace-only job/origin errors with focus and live announcement, and malformed-backup rejection without replacing sample records.
- PWA: the live registration was active at scope `/`; `registration.update()` completed with no error; `/sw.js` is no-store and contains versioned cache, `skipWaiting`, and `clients.claim`. After first online load and service-worker control, offline reload of `/demo` rendered the sample closeout and “You are offline. Saved records still work.”
- The manifest has standalone display, matching light palette colors, versioned start URL, 192/512/maskable icons. No server API, product-unlock call, or sign-in exists, so API rate-limit and Entra checks are not applicable.

## Accessibility, mobile, privacy, and policies

- `/opt/fleet/lib/verify-url.sh https://stock-return-trail.sociobot.in/demo`: pass — HTTP 200; title; `lang=en`; one H1; main landmark; zero missing image alts, unlabeled buttons, console errors, or page errors. Evidence: `/tmp/srt-verify-url.9I9T0b/` in this verification container.
- Live Axe (`@axe-core/playwright`) on `/`, `/demo`, `/app`, `/log`, `/settings`, `/privacy`, `/terms`, and an unknown-route page: **0 serious/critical findings**. Each had one H1; 390 px had no horizontal overflow.
- Keyboard: Skip link focuses first and moves focus to main; the designed focus ring is solid 3 px teal; dialog opens by Enter and closes with Escape; the mobile route strip supports Arrow keys. Reduced-motion browser context reports a near-zero animation duration.
- Browser request capture across all live routes and closeout found only `https://stock-return-trail.sociobot.in`; no analytics, remote fonts, or stock-data request. The real and demo workspaces use distinct IndexedDB databases, as also asserted by the claim test.
- Live headers include a self-only CSP, `nosniff`, strict-origin referrer policy, HSTS, and restrictive permissions policy. Hashed JS/CSS and AVIF carry `Cache-Control: public, max-age=31536000, immutable`; `sw.js` is no-store; the AVIF is correctly `image/avif`.

## Deployment identity and performance

The local production build and live asset bytes are identical:

| File | SHA-256 |
| --- | --- |
| `index.html` | `215bd29030a461415ba982bbde5dbea72615ed776d3a241af186af2ab132c6e7` |
| `assets/index-sEZvs4_Y.js` | `465e01b9274834eb34d2967e1128aa19efd9f840d2ba098581d48b60a129c9ee` |
| `assets/index-DejY7Tsb.css` | `00e19eba1ac28923beed3f9244bfafb0bbc5c1f19e2cab24d4e4976d8e04ad77` |

Build output: JS 29.39 kB / 10.25 kB gzip; CSS 19.99 kB / 5.67 kB gzip; self-hosted fonts 53.30 kB total; hero AVIF 67.9 kB. All are within stated budgets. A live Lighthouse run on `/demo` (provided throttling) produced Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 742 ms and CLS 0.030. Lighthouse emitted a post-audit Chromium target-crash warning while taking its final screenshot, but wrote the complete scored report and found no console errors; independent Playwright browser runs were error-free.

## Defects

None found.

## Reproduce

```sh
npm ci
npm run test:unit
npm test
npm run build
npm run preview
```
