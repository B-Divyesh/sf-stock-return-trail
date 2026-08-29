# Adversarial first-read review 3 — Stock Return Trail

Reviewed 29 August 2026 against `https://stock-return-trail.sociobot.in` and a clean clone of commit `0cd5db804c52792144a4fad86e75b566756a939b`.

## Verdict

**PASS.** No finding remains. The first screen states the job, audience, and first action; the sample is one click away and isolated; every declared claim passed from a clean clone; and the site structure, offline path, privacy boundary, routing, and accessibility checks passed.

## Findings

None.

## 1. Cold first screen

Fresh Chromium contexts loaded the live home page with service workers blocked at 390 × 844 and 1440 × 900. There were no page or console errors. At 390 px the document was exactly 390 px wide and the complete first-screen copy ended at 563 px, before the viewport edge.

Before scrolling, the answers were:

- **What it does:** Records stock sent to a job, records what was used, and sends the unused amount back to its origin.
- **For whom:** Field teams returning unused items.
- **What to click first:** **Try it with sample data**.

The exact copy that made this clear was “Return job stock to the right place”, “For field teams who return unused items without searching the movement log.”, and “Try it with sample data” followed by “Open a job ready to finish. Nothing is saved.” This passes the cold-read check.

## 2. Copy audit

Word counts are whitespace-delimited; hyphenated words and codes count once. Every landing-page and README sentence/copy unit appears below. No sentence exceeds 22 words. No jargon, unsupported marketing adjective, metaphor-only heading, inconsistent core term, or non-result-naming action was identified. The terms **job**, **stock line**, **origin**, **movement log**, and **finish a job** are used consistently.

### Landing page

| Copy | Words | Result |
|---|---:|---|
| Return job stock to the right place | 7 | Pass |
| For field teams who return unused items without searching the movement log. | 12 | Pass |
| Open a job ready to finish. | 6 | Pass |
| Nothing is saved. | 3 | Pass; `demo-isolation` |
| Works offline after your first visit. | 6 | Pass; `offline-reload` |
| Your stock records stay in this browser. | 7 | Pass; `local-records` |
| Use it without an account or a job limit. | 9 | Pass; `no-account-job-limit` |
| Each item keeps its origin while it is out on a job. | 12 | Pass; `return-provenance` |
| See every return before you move it | 7 | Pass |
| The job sheet subtracts used stock and groups the remainder by origin. | 12 | Pass; `return-provenance` |
| Scan or enter a code. | 5 | Pass; `stock-code-entry` |
| Add its count and origin. | 5 | Pass |
| When you finish a job, enter the used count for each stock line. | 13 | Pass; `return-provenance` |
| The sheet names each origin and adds each move to your movement log. | 13 | Pass; `return-provenance` |
| Stock Return Trail does not price stock, place orders, or sync teams. | 12 | Pass; `scope-boundary` |
| Use the movement log when you finish a field job. | 10 | Pass |
| Do not use it for accounting or formal stock audits. | 10 | Pass |
| You can export CSV and JSON backups at any time. | 10 | Pass; `csv-export`, `json-backup` |
| Return unused job stock to its saved origin. | 8 | Pass |
| Hero artwork generated for this product. | 6 | Pass; provenance is in `design.md` |
| A field parts case connected to its stockroom by a red route line. | 13 | Pass; image alt |

Headings that stand alone are “Job stock returns”, “Live return preview”, “How the trail works”, “Three steps”, and “A return trail, not an accounts system”; each names its adjacent section. Actions name outcomes: **Try**, **Finish**, **Record**, **Scan**, **Add**, **Count**, **Return**, **Export**, **Download**, **Import**, **Reset**, **Start**, **Create**, **Open**, and **Reload**.

### README

| Copy | Words | Result |
|---|---:|---|
| Stock Return Trail | 3 | Pass |
| Return unused job stock to its saved origin. | 8 | Pass |
| Stock Return Trail is a field tool for small service teams and makers. | 13 | Pass |
| It works offline after your first visit. | 7 | Pass; `offline-reload` |
| Record stock as it leaves an origin. | 7 | Pass |
| Enter the used count when you finish a job. | 10 | Pass |
| Return each remainder to its saved origin. | 7 | Pass |
| Try it with sample data. | 5 | Pass |
| The demo uses a separate local database and never changes real records. | 12 | Pass; `demo-isolation` |
| What it includes | 3 | Pass |
| Stock-code entry by hand, or by camera in supported browsers | 10 | Pass; `stock-code-entry` |
| Enter how many items were used. | 7 | Pass |
| See where to return what remains. | 7 | Pass |
| Export the movement log as CSV | 6 | Pass; `csv-export` |
| JSON backup and import | 4 | Pass; `json-backup` |
| Offline reload after the first visit | 6 | Pass; `offline-reload` |
| Demo changes stay separate from your real records | 8 | Pass; `demo-isolation` |
| Use it without an account or a job limit | 9 | Pass; `no-account-job-limit` |
| Use the movement log when you finish a field job. | 10 | Pass |
| Do not use it for accounting or formal stock audits. | 10 | Pass |
| Develop | 1 | Pass |
| Requires Node.js 20 or later. | 5 | Pass |
| Open `http://localhost:5173/`. | 2 | Pass |
| Use `http://localhost:5173/demo` for the isolated sample. | 6 | Pass |
| Test and build | 3 | Pass |
| The exact production build command is `npm run build`. | 9 | Pass |
| It writes the static site to `./dist`, with `dist/index.html` at the root. | 12 | Pass |
| The Playwright suite checks finishing jobs, claims, offline reload, demo isolation, downloads, responsive layout, and serious accessibility findings. | 18 | Pass; developer documentation |
| Data and deployment | 3 | Pass |
| Real records use IndexedDB database `stock-return-trail:real`. | 6 | Pass; deployment documentation |
| Demo records use `stock-return-trail:demo`. | 4 | Pass; deployment documentation |
| The app has no analytics and sends no stock records to a server. | 13 | Pass; `no-analytics`, `local-records` |
| Deploy the contents of `dist/` as a static site. | 8 | Pass |
| Each public route is emitted as its own HTML page with route-specific metadata. | 13 | Pass |
| `staticwebapp.config.json` provides security headers and a designed 404 response. | 9 | Pass |
| The app saves the files it needs to reopen offline. | 10 | Pass; `offline-reload` |
| See privacy, terms, and `.factory/demo.md`. | 5 | Pass |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

All claim-like landing and README statements map to a named claim. No unlisted claim was found.

## 3. Demo and sandbox

**Pass.** From a fresh phone-sized context, `/?demo=1` immediately opened a working “Riverside pump room” job. It showed three realistic stock lines, saved origins, prefilled used counts, proposed returns, and **Record returns & finish job** on its first screen.

- The persistent banner read “Demo — sample data, nothing is saved” and included **Reset demo** and **Start for real**.
- Recording returns showed “Return trail saved”; Reset demo restored the ready-to-finish job.
- Start for real opened `/app` with “No jobs are on the trail” and no demo banner.
- IndexedDB contained only `stock-return-trail:demo` in demo mode and only `stock-return-trail:real` after leaving it. The real workspace was empty.
- The live demo request log contained only `https://stock-return-trail.sociobot.in`.
- After the demo had service-worker control, an offline reload displayed “You are offline. Saved records still work.” and retained the sample job.

## 4. Claims and clean-clone verification

Clean clone: `/tmp/stock-return-trail-review-3.q0iBFX`, installed with `npm ci` (96 packages added; no vulnerabilities). Every command listed in `.factory/claims.json` was run as written and passed.

| Claim ID | Result |
|---|---|
| `offline-reload` | Pass |
| `csv-export` | Pass |
| `return-provenance` | Pass |
| `stock-code-entry` | Pass |
| `local-records` | Pass |
| `demo-isolation` | Pass |
| `no-account-job-limit` | Pass |
| `json-backup` | Pass |
| `no-analytics` | Pass |
| `scope-boundary` | Pass |

Each declared id has exactly one matching `@claim:<id>` test. The complete Playwright coverage also passed as two suites: `tests/claims.spec.ts` (8/8) and `tests/app.spec.ts` (14/14). `npm run test:unit` passed 5/5 tests; `npm run test:static` passed its eight-route metadata check; and `npm run build` produced `dist/` with a 10.29 kB gzip application bundle.

## 5. Earlier findings and handoff

Every earlier review, polish report, and handoff was read. There were no prior F-2 findings. Each F-1 finding was checked against the current source and live behavior:

| Earlier finding | Confirmation |
|---|---|
| F-1-1, F-1-2 | `no-analytics` and `scope-boundary` are declared claims with tagged tests that passed. |
| F-1-3 | Raw and hydrated metadata is route-specific for all public routes. |
| F-1-4 | `/does-not-exist` returned HTTP 404 and rendered the recovery page. |
| F-1-5 to F-1-8 | The live copy consistently uses movement log, origin, and finish a job; the accounting limit is plain language. |
| F-1-9, F-1-10 | The live labels are “Job stock returns” and “Three steps”. |
| F-1-11 to F-1-15 | README copy uses the tested offline wording, clear sample action, plain feature wording, and no user-facing service-worker jargon. |

No earlier finding is unfixed, half-fixed, or regressed.

## 6. Structure, routing, identity, and accessibility

- `/`, `/demo`, `/app`, `/log`, `/settings`, `/privacy`, and `/terms` each returned 200. `/does-not-exist` returned 404. The crawled internal links all returned 200.
- At 390 px and 1440 px, all eight checked routes had one H1, a route-specific title, meta description, canonical, and Open Graph title. Axe returned zero violations across all sixteen route/viewport checks.
- Client navigation from home to Privacy focused the new H1; browser Back returned to home and focused its H1.
- The raw live site exposes its self-hosted social card, favicon, apple touch icon, manifest, `lang=en`, theme color, robots file, sitemap, CSP, `nosniff`, referrer policy, and designed 404.
- The header/footer include the required Privacy and Terms links. Cold home, demo, offline reload, and navigation produced no console/page errors.
- The topographic paper-map system is product-specific: original field-kit artwork, warm paper/ink/coral palette, Bitter/Atkinson pairing, route line, contour dividers, and map-sheet card corners. It is not a generic SaaS template. Asset provenance is recorded in `.factory/design.md`.

## 7. Missed leverage

No finding. The brief implies offline use, manual/camera code entry, stock-return proposals by saved origin, CSV export, and backup portability; each is present. Team sync is explicitly outside scope. An AI feature would add network dependency and cost without materially improving the simple stock-count/provenance task.

## What would make this perfect

Preserve this standard on future changes: keep the one-click isolated sample, retain exact claim-to-test coverage, and repeat the cold phone, offline, metadata, and route checks after any product or deployment change.
