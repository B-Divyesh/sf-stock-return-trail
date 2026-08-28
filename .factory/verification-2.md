# Independent verification 2 — FAIL

**Candidate:** `1c87f3bf63da794568e2d50bc9d1fe22c392dd2d`  
**Live URL:** https://stock-return-trail.sociobot.in  
**Verified:** 2026-08-28 from a clean checkout

## Verdict

**FAIL.** The deployed artifact is the tested candidate and the core return-to-origin workflow works, but the release contract is not met on a 390 px phone. The primary demo closeout control is clipped outside the viewport. In addition, two declared claim tests use the real-workspace route instead of the required isolated demo entry point.

## Cold first read

**Pass.** A fresh live visit says **“Return job stock to the right place”**; it identifies **field teams** that need unused items returned without searching movement records; and it makes the first step explicit: **“Try it with sample data.”** Adjacent copy says it opens a ready-to-close job and saves nothing. The one-click demo is present.

## Required claims

`.factory/claims.json` exists, contains eight claims, and each ID has one matching `@claim:` tag. After `npm ci`, I ran every declared command separately from a fresh checkout. All passed:

| Claim | Command result |
| --- | --- |
| `offline-reload` | PASS |
| `csv-export` | PASS |
| `return-provenance` | PASS |
| `stock-code-entry` | PASS |
| `local-records` | PASS |
| `demo-isolation` | PASS |
| `no-account-job-limit` | PASS |
| `json-backup` | PASS |

The observable outcomes included offline reload after service-worker control, ten CSV rows (header plus nine movements), provenance-backed closeout, local-only demo requests, demo/real separation, three ungated jobs, and JSON backup/import status.

**Claim-contract finding:** `@claim:stock-code-entry` and `@claim:no-account-job-limit` both call `page.goto('/app')` in the test source, and their claim metadata says “fresh real workspace.” The acceptance contract requires every claim test to start through the isolated demo entry point and sample namespace. Their browser contexts are fresh, but they do not meet that sandbox requirement.

## Local quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 96 packages installed; 0 vulnerabilities |
| `npm run test:unit` | PASS — 4 tests in 2 files |
| `npm test` | PASS — 17 Chromium tests; `test-results/.last-run.json` reports `passed` |
| Exact production build: `npm run build` | PASS — `dist/` produced |
| Type checking | PASS — included in `npm run build` via `tsc` |
| Lint | No lint script is declared |

Production output: JavaScript 29,138 B (10.17 KB gzip), CSS 19,843 B (5.63 KB gzip), and self-hosted WOFF2 fonts 53,304 B total. These are within the static PWA JS, CSS, and font budgets. The AVIF hero is 67,917 B and the WebP fallback is 101,872 B.

## End-to-end and browser evidence

- **Return workflow:** live demo proposed saved origins and correct remainders; closeout created nine movements. A live CSV download was named `stock-return-trail.csv`, had the documented header, and contained ten lines.
- **Normal, boundary, and recovery paths:** a real workspace accepted a job and stock line, rejected quantity `0` with native validation focused on Count, then accepted `1` and successfully closed the job. A demo used count of `7` for a quantity of `6` focused the field with “Enter a whole number from 0 to 6.” Returning it to `6` closed successfully.
- **Privacy:** cold live traffic and all checked route traffic were same-origin only. The demo claim test also intercepted the entire closeout flow and passed with no off-origin requests. No analytics, third-party scripts, or third-party fonts were observed. This static product has no server API or sign-in flow, so rate-limit and Entra checks are not applicable.
- **Accessibility:** `/opt/fleet/lib/verify-url.sh` passed live: HTTP 200, title, `lang=en`, one H1, main landmark, zero missing image alts, zero unlabeled buttons, and zero page/console errors (875 ms navigation in that smoke check). Independent Axe scans on `/`, `/demo`, `/app`, `/log`, `/settings`, `/privacy`, `/terms`, and the 404 route found zero serious/critical violations. Keyboard Tab reached the skip link first; Enter moved focus to main. Focus was visible; normal links used a 3 px water-blue focus outline. Reduced motion reported `scroll-behavior: auto` and a 0.01 ms button transition.
- **PWA:** the live service worker controlled `/demo` from `https://stock-return-trail.sociobot.in/sw.js`; `registration.update()` completed with an active worker; an offline reload of the controlled demo showed the sample and “You are offline. Saved records still work.” The live worker includes a versioned cache, `skipWaiting`, `clients.claim`, and the app’s `updatefound` toast path.
- **Security, caching, and deployment:** live HTML revalidates; hashed JS/CSS/assets and icons are `max-age=31536000, immutable`; the manifest revalidates after 300 seconds; `sw.js` is `no-cache, no-store, must-revalidate`. HTTPS/HSTS, CSP limited to self, `nosniff`, strict referrer policy, and camera-only permissions policy were present. Fresh local and live SHA-256 values were identical for `index.html`, JS, CSS, `sw.js`, and the manifest. Therefore the live deployment matches this candidate.
- **Lighthouse, live `/demo`:** Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 903 ms, LCP 1,053 ms, TBT 51 ms, CLS 0.034.

## Defects

### High — release blocking

1. **The core mobile closeout action is clipped at 390 px.** On live `/demo` at a 390 × 844 viewport, `.job-sheet` measures 550 px wide (x=12 through x=562) while `main { overflow: clip; }` suppresses horizontal access. The required **“Record returns & close job”** button is x=32 through x=542, width 510 px: its rightmost 152 px and part of its label are outside the viewport. The route strip is also cut off. The visible left part remains clickable, but the main action is not fully visible or phone-appropriate, violating the mobile and clarity requirements. Constrain the job sheet and closeout bar to the viewport at the mobile breakpoint; rerun a measured 390 px test that asserts the complete control bounding box is within the viewport.

2. **Two claim tests bypass the demo sandbox.** `stock-code-entry` and `no-account-job-limit` start at `/app`, not `/demo`, contrary to the required isolated demo-entry claim harness. Move those scenarios into demo storage (or provide an isolated demo route that permits the setup) and update their `sandbox` metadata. This is a claims-contract failure even though the current commands pass.

### Low

3. **The AVIF asset is served as `application/octet-stream`.** `/assets/hero-topographic.avif` loads in Chromium because the `<source>` declares `type="image/avif"`, but the HTTP content type is not the correct image type. Configure the static host to serve `image/avif` for better interoperability and accurate response policy.

## Required next steps

1. Repair the 390 px containment failure and add an assertion that all essential closeout controls are fully inside the viewport.
2. Make every claim test enter the isolated demo sandbox; retain the same observable assertions.
3. Correct the AVIF MIME type, rebuild, redeploy, and request a new independent verification.
