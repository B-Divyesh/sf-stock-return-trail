# Adversarial first-read review 2 — Stock Return Trail

Reviewed 28 August 2026 against the live site and clean-clone commit `6cf50974aa41cef61157ecc39dd61244ecf76b9f`.

## Verdict

**PASS.** No finding remains. The product is clear on the first screen, immediately tryable in an isolated sample, honest about its boundaries, and all declared claims were verified from a clean clone.

## Findings

None.

## 1. Cold first screen

Fresh Chromium contexts, with service workers blocked, loaded the live home page at 390 × 844 and 1440 × 900 without console or page errors. At 390 px the document width was exactly 390 px.

- **What it does:** It records stock sent to a job, accounts for what was used, and shows where unused stock goes back.
- **For whom:** Field teams returning unused items.
- **What to click first:** **Try it with sample data**.

The exact first-screen copy that made this clear was:

> “Return job stock to the right place”

> “For field teams who return unused items without searching the movement log.”

> “Try it with sample data” — “Open a job ready to finish. Nothing is saved.”

This check passes. The 390 px view keeps the headline, audience sentence, action, action outcome, and three facts visible before the hero art. The cartographic field-kit artwork, paper palette, Bitter/Atkinson pairing, and route-line motif are product-specific rather than a generic SaaS surface.

## 2. Copy audit

Word counts use whitespace-delimited words; hyphenated terms and codes count once. No audited sentence exceeds 22 words. No banned marketing adjective appears. The terminology is consistent: **job**, **stock line**, **origin**, **movement log**, and **finish a job**.

### Landing-page sentences

| Copy | Words | Result |
|---|---:|---|
| Return job stock to the right place | 7 | Pass |
| For field teams who return unused items without searching the movement log. | 12 | Pass |
| Open a job ready to finish. | 6 | Pass |
| Nothing is saved. | 3 | Pass; demo isolation |
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
| Hero artwork generated for this product. | 6 | Pass; asset attribution, with provenance in `design.md` |
| A field parts case connected to its stockroom by a red route line. (alt) | 13 | Pass |

Headings (“Job stock returns”, “Live return preview”, “Three steps”, and “A return trail, not an accounts system”) make sense with their adjacent content. Actions are result-naming verbs: **Try**, **Finish**, **Record**, **Scan**, **Add**, **Count**, **Return**, **Export**, **Download**, **Import**, **Reset**, **Start**, **Create**, **Open**, and **Reload**. Navigation labels are nouns and are not action controls.

### README sentences and copy units

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
| Real records use IndexedDB database `stock-return-trail:real`. | 6 | Pass; implementation documentation |
| Demo records use `stock-return-trail:demo`. | 4 | Pass; implementation documentation |
| The app has no analytics and sends no stock records to a server. | 13 | Pass; `no-analytics`, `local-records` |
| Deploy the contents of `dist/` as a static site. | 8 | Pass |
| Each public route is emitted as its own HTML page with route-specific metadata. | 13 | Pass |
| `staticwebapp.config.json` provides security headers and a designed 404 response. | 9 | Pass |
| The app saves the files it needs to reopen offline. | 10 | Pass; `offline-reload` |
| See privacy, terms, and `.factory/demo.md`. | 5 | Pass |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

All visitor-relevant operational claims on the landing page and README map to a named entry in `.factory/claims.json`. No unlisted operational claim finding was identified.

## 3. Demo and sandbox

**Pass.** From a fresh live context, `/?demo=1` immediately showed the working “Riverside pump room” sample: three realistic stock lines, their used counts, saved origins, proposed returns, and **Record returns & finish job**. The first screen was product use, not an explanatory placeholder.

- The persistent banner read: “Demo — sample data, nothing is saved”, with **Reset demo** and **Start for real**.
- Finishing the sample showed “Return trail saved” and the movement-log outcome.
- Reset restored the ready-to-finish sample.
- Start for real opened the empty real workspace, “No jobs are on the trail”.
- Code inspection confirms distinct IndexedDB names, `stock-return-trail:demo` and `stock-return-trail:real`; demo actions receive only the demo boolean and `Start for real` calls `resetDemo()` before entering `/app`.
- A fresh service-worker-controlled live `/demo` reload worked offline and showed “You are offline. Saved records still work.”
- The live demo request log contained only `stock-return-trail.sociobot.in` document, JS, CSS, and self-hosted font requests. No off-origin request appeared.

## 4. Claims and clean-clone verification

Clean clone: `/tmp/stock-return-trail-review-2.5wJCOm`, created with `git clone --no-local`, followed by `npm ci` (96 packages; 0 vulnerabilities).

| Claim | Separate retry result | Note |
|---|---|---|
| `offline-reload` | Pass | Live offline behavior also confirmed. |
| `csv-export` | Pass | Observable CSV header and ten rows asserted. |
| `return-provenance` | Pass | Sample return counts/origins and nine movements asserted. |
| `stock-code-entry` | Pass | Manual and stubbed supported-camera paths asserted. |
| `local-records` | Pass | Demo request log stays same-origin. |
| `demo-isolation` | Pass | Finishing demo then entering real workspace is empty. |
| `no-account-job-limit` | Pass | Creates three extra jobs in the isolated sample without an account or gate. |
| `json-backup` | Pass | Download and replacement import asserted. |
| `no-analytics` | Pass | Landing/demo requests and `sendBeacon` asserted. |
| `scope-boundary` | Pass | Controls and demo request log asserted. |

Every declared ID has exactly one matching `@claim:<id>` tag. `npm test` passed all 22 tests; `npm run test:unit` passed 5 tests; `npm run test:static` passed and verified eight emitted route heads; `npm run build` produced `dist/`.

## 5. Earlier findings and handoff

Every earlier report and handoff was read. All fifteen earlier findings were rechecked on the live site and in the current source.

| Earlier finding(s) | Recheck |
|---|---|
| F-1-1, F-1-2 | `no-analytics` and `scope-boundary` now have claim entries and exactly one tagged test each. |
| F-1-3 | Raw and hydrated titles, descriptions, canonical URLs, OG titles, and OG URLs are route-specific for all seven public routes and the 404. |
| F-1-4 | `/does-not-exist` returns HTTP 404 and shows the designed recovery page. |
| F-1-5 to F-1-8 | **Movement log**, **origin**, and **finish a job** are consistent; the accounting boundary uses plain words. |
| F-1-9, F-1-10 | First-screen eyebrow is “Job stock returns”; the process label is “Three steps”. |
| F-1-11 to F-1-15 | README uses the tested offline phrasing, clear action/outcome wording, no storage jargon in feature copy, the same demo action, and plain service-worker wording. |

No earlier finding is unfixed, half-fixed, or regressed.

## 6. Structure, routing, and accessibility

- All public routes returned 200 and unknown `/does-not-exist` returned 404. All crawled internal links returned 200; `mailto:` links were valid exceptions.
- At both 390 px and 1440 px, `/`, `/demo`, `/app`, `/log`, `/settings`, `/privacy`, `/terms`, and the 404 each had one H1, a title, a plain meta description, canonical, and route-specific Open Graph title. Axe found zero violations on all sixteen route/viewport combinations.
- The raw head has canonical/OG/Twitter metadata, a self-hosted social card, SVG favicon, 180 px apple icon, manifest, `lang=en`, theme color, robots, sitemap, CSP, `nosniff`, and referrer policy.
- Live client navigation from home to Privacy moved focus to the new H1 and announced “Privacy — Stock Return Trail”. Browser Back returned home and focused its H1.
- Header/footer, skip link, Privacy, Terms, and the styled 404 are consistent. No console errors occurred in cold desktop, cold phone, demo, offline, navigation, or accessibility checks.

## 7. Missed leverage

No finding. The brief’s useful implied work is present: manual/camera code entry, return proposals by saved origin, movement-log CSV export, JSON backup/import, offline reopening, and a one-click isolated sample. Team sync is explicitly outside product scope. An AI feature would not improve this arithmetic/provenance workflow enough to justify the optional key, disclosure, network dependency, or cost.

## What would make this perfect

Keep the existing first-read standard as the product changes: preserve the one-click isolated demo, keep every operational promise mapped to an observable claim test, and rerun this complete review from fresh browser and repository contexts after material changes.
