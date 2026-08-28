# Independent verification 1 — FAIL

**Candidate:** `2093f33ed6abffac398a11c775ccb8ccd9d8ee0b`  
**Live URL:** https://stock-return-trail.sociobot.in  
**Verified:** 2026-08-28, from a clean checkout

## Verdict

**FAIL.** The core demo and return-to-origin workflow work, but this candidate
does not meet the release contract. It has a broken paid checkout, destructive
invalid-backup handling, a failing repository test command, and mobile target
size failures.

## First-read result

**Pass.** On a cold live visit the first screen says it will “Return job stock
to the right place,” identifies “field teams” as the audience, and makes the
first action explicit: **Try it with sample data**. The adjacent text says it
opens a ready-to-close job and nothing is saved. The one-click demo is present.

## Required claims

`.factory/claims.json` exists and declares eight claims. After `npm ci`, every
declared command passed from a fresh local browser context:

| Claim | Result |
| --- | --- |
| `offline-reload` | PASS |
| `csv-export` | PASS |
| `return-provenance` | PASS |
| `stock-code-entry` | PASS |
| `local-records` | PASS |
| `demo-isolation` | PASS |
| `free-job-limit` | PASS |
| `json-backup` | PASS |

The production Playwright suite also passed: `npx playwright test` — **11
passed**. The exact production command `npm run build` passed and produced
`dist/`: JS 29.46 KB (10.41 KB gzip), CSS 19.69 KB (5.63 KB gzip), and WOFF2
fonts 53.30 KB total.

`npm run test:unit` **fails**. Vitest collects `tests/app.spec.ts` and
`tests/claims.spec.ts`, which call Playwright's `test()`, and exits with
“Playwright Test did not expect test() to be called here.” This is an available
repository test command and therefore a release-gate failure.

## End-to-end, accessibility, PWA, privacy, and deployment evidence

- Demo closeout correctly rejected a used count of 7 for 6 stock (`Enter a
  whole number from 0 to 6.`), focused the invalid field, then closed normally
  and produced eight movements for the deliberately changed input.
- A real job and stock line were created successfully. Quantity `0` was blocked
  by native validation. Invalid JSON syntax showed a recoverable error.
- Independent Playwright axe scans found **zero serious/critical violations**
  on `/`, `/demo`, `/app`, and `/privacy`. The factory `verify-url.sh` passed:
  HTTP 200, title/lang/one H1/main/alt checks, and no console errors.
  The standalone axe CLI could not start because this container has no Chrome
  binary; the Playwright axe scan is the equivalent successful check.
- Keyboard testing reached the skip link first; Enter moved focus to `#main`.
  All checked routes had one H1 and a main landmark. Reduced motion was active
  with animation and transition durations of `1e-05s`. At 390 px there was no
  horizontal overflow.
- A live service worker was controlling the page (`stock-return-trail-v3`,
  active/activated). Offline reload of `/demo` returned 200 from cache and
  showed “You are offline. Saved records still work.” The worker contains the
  `updatefound`, `skipWaiting`, and `clients.claim` update path; no newer live
  worker was available to activate during this stable-deployment check.
- Cold live-page requests were only same-origin assets; the passing
  `local-records` claim also intercepts the whole demo closeout and asserts
  same-origin traffic. Source review found only the optional Sociobot checkout
  and license-verification endpoints. No analytics or third-party font/script
  requests were observed.
- Response policy is sound: HTTPS, HSTS, CSP, `nosniff`, strict referrer policy,
  and a camera-only permissions policy. The live site matches this candidate:
  **20 public production artifacts were byte-identical** to freshly built
  `dist` artifacts (shell, worker, manifest, JS/CSS, images, icons, and fonts).
- The license API rate-limited an invalid-token burst: 60 concurrent requests
  returned 30 × 200 and 30 × 429 with `Retry-After: 4`. A serial follow-up after
  five seconds reached 429 on request **3** with `Retry-After: 2` (the shared
  rate-limit window makes this the observed threshold, not a product-specific
  capacity claim).

Evidence is retained in `.factory/verification-1/`, especially
`browser-qa.json`, `invalid-inputs.json`, `malformed-import.json`,
`rate-limit*.json`, and the desktop/mobile screenshots.

## Defects

### High

1. **Paid checkout is dead.** Both “Buy the site kit” links target
   `https://api.sociobot.in/api/v1/products/stock-return-trail/checkout`.
   Fresh GET and HEAD checks return HTTP 404 with
   `{"error":"enabled factory product","status":404}`. The product advertises a
   £19 one-time purchase that cannot be made. Register/enable the product and
   verify the end-to-end return URL before release.

2. **A malformed structural JSON backup destroys the accessible workspace.**
   Importing `{"jobs":[{}],"movements":[]}` was confirmed as “Backup imported.
   Your local records were replaced.” On opening Jobs, the app rendered “Local
   records could not open.” The import validation only checks that `jobs` and
   `movements` are arrays; it must validate the full backup schema before the
   replacement transaction and preserve current records on failure.

3. **The repository's `npm run test:unit` quality gate fails.** Configure
   Vitest to exclude Playwright specs, remove the invalid script, or provide
   actual unit-test discovery. Do not report this release as locally green
   until the documented command exits zero.

### Medium

4. **Whitespace-only job and stock fields are accepted.** A job with name/site
   of spaces was created with an empty title. A stock line with space-only code,
   name, and origin was also saved. This creates untraceable movements and
   defeats the product's provenance purpose. Trim and reject blank values with
   an announced, actionable field error.

5. **Core mobile controls miss the 44 px target requirement.** At 390 px the
   demo banner’s Reset demo is 84 × 30 px and Start for real is 93 × 18 px;
   the wordmark/nav and footer links are also below 44 px in one dimension.
   Make the interactive hit areas at least 44 × 44 CSS px without reducing the
   visual hierarchy.

6. **Hashed static assets are not cached immutably.** Live JS, CSS, fonts,
   images, manifest, and service worker all return
   `Cache-Control: public, must-revalidate, max-age=30`. This does not meet the
   PWA requirement for long-lived immutable caching of hashed assets and adds
   unnecessary repeat-load traffic. Apply a long-lived immutable policy to
   content-hashed assets while keeping the HTML and service worker short-lived.

## Required next steps

1. Fix all High defects, then rerun the complete claim suite and `npm test` /
   `npm run test:unit` from a clean install.
2. Repair the mobile hit areas, whitespace validation, and cache headers.
3. Re-deploy, confirm checkout returns a hosted Sociobot checkout rather than
   404, and request a fresh independent verification.
