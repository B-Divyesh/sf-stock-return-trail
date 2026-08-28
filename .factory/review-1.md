# Adversarial first-read review 1 — Stock Return Trail

Reviewed 28 August 2026 against `https://stock-return-trail.sociobot.in` and repository commit `2313806ead862e1201a9ed92078e4a917c395255`.

## Verdict

**FAIL.** There are 15 findings: 2 major and 13 minor. There are no blocking findings. The core product, demo, declared claims, offline path, privacy boundary, accessibility baseline, and earlier mobile repairs all worked, but PASS requires zero findings and no unlisted claim.

## Findings

### Major

#### F-1-1 — The README makes an unlisted analytics claim

- **Quote/location:** README, “The app has no analytics and sends no stock records to a server.”
- **Why this fails:** “No analytics” is a privacy claim a visitor can rely on. `.factory/claims.json` lists the separate stock-record locality claim, but it does not list or name the analytics claim. The existing `@claim:local-records` test only classifies requests by origin during one demo closeout.
- **Concrete fix:** Either remove “The app has no analytics” or add a `no-analytics` claim entry and one `@claim:no-analytics` test. The test should observe the landing page and the full demo flow in a fresh context and assert that no analytics request, beacon, or third-party request occurs.

#### F-1-2 — The landing page makes an unlisted scope claim

- **Quote/location:** landing page, “Stock Return Trail does not price stock, place orders, or sync teams.”
- **Why this fails:** This is a three-part product-boundary claim. No claim entry covers pricing, ordering, or team sync. A separate untagged test only checks that two pages do not advertise a checkout; it does not prove the full sentence.
- **Concrete fix:** Keep the useful boundary sentence, but add one named claims entry and tagged sandbox test that checks every route for pricing/order/sync controls and observes the demo flow for sync requests. Alternatively, remove the sentence.

### Minor

#### F-1-3 — Deep routes expose the landing page’s raw and social metadata

- **Quote/location:** the raw response for `/privacy`, `/terms`, `/demo`, `/app`, `/log`, and `/settings` says `<title>Stock Return Trail — Return job stock to its origin</title>` and canonical `/`. After JavaScript runs, `/privacy` changes its title and canonical correctly, but its Open Graph title and URL still describe `/`.
- **Why this fails:** Link unfurlers and crawlers commonly do not run the SPA. They identify every route as the landing page. Even an executing browser retains the wrong Open Graph and Twitter route metadata.
- **Concrete fix:** Serve or prerender route-specific head markup for every public route. Also update Open Graph and Twitter title, description, and URL during client navigation. Verify both the raw response and the post-navigation DOM.

#### F-1-4 — The designed 404 is returned with HTTP 200

- **Quote/location:** `GET /does-not-exist` returns `200`; the client then renders “This page is not on the trail.”
- **Why this fails:** The visual 404 works, but the HTTP response is a soft 404. Crawlers, caches, and monitoring cannot distinguish a missing route from a valid page.
- **Concrete fix:** Configure known SPA routes explicitly and let unknown paths reach the 404 response override, or otherwise serve the designed page with status 404. Add a test that asserts both the status and the visible recovery link.

#### F-1-5 — One concept has four names

- **Quote/location:** landing page “old movement records,” navigation “Trail log,” workflow “CSV log,” and README “CSV movement-log export.”
- **Why this fails:** A new visitor has to decide whether records, trail log, movement log, and CSV log are different things.
- **Concrete fix:** Use **movement log** everywhere. Suggested rewrites: “without searching the movement log,” “Movement log,” “adds each move to your movement log,” and “Export the movement log as CSV.”

#### F-1-6 — The saved source location changes names

- **Quote/location:** landing workflow “Add its count and store location,” README “recorded origin,” and landing/footer “saved origin.”
- **Why this fails:** The form itself labels the field “Origin.” Switching to “store location” and “recorded origin” makes one field sound like three concepts.
- **Concrete fix:** Use **origin** consistently: “Add its count and origin” and “send each remainder back to its saved origin.”

#### F-1-7 — “Closeout” is unexplained field jargon

- **Quote/location:** “Open a ready-to-close job,” “Live closeout preview,” “At closeout,” “field closeout,” and the same term in README.
- **Why this fails:** A first-time visitor can infer the meaning, but the text needlessly asks them to translate an internal process noun.
- **Concrete fix:** Use direct verbs: “Open a job that is ready to finish,” “Live return preview,” “When you finish a job, enter the used count,” and “Movement logs help teams finish field jobs.”

#### F-1-8 — The accounting disclaimer uses specialist wording

- **Quote/location:** landing page and README, “They are not audit-grade inventory valuation.”
- **Why this fails:** “Audit-grade inventory valuation” is a dense accounting phrase and does not plainly state the prohibited use.
- **Concrete fix:** Rewrite it as: “Do not use these logs for accounting or formal stock audits.”

#### F-1-9 — The first eyebrow is a metaphor, not a task

- **Quote/location:** landing first screen, “Field stock · plotted home.”
- **Why this fails:** “Plotted home” depends on the cartography theme and does not add information for a visitor deciding what the tool does.
- **Concrete fix:** Replace it with “Job stock returns,” or remove it because the H1 already names the job.

#### F-1-10 — “Three field marks” does not make sense alone

- **Quote/location:** landing page above “How the trail works,” “Three field marks.”
- **Why this fails:** It is decorative map language rather than a description of the three instructions beneath it.
- **Concrete fix:** Replace it with “Three steps.”

#### F-1-11 — The README introduces “offline-first” instead of the tested wording

- **Quote/location:** README, “Stock Return Trail is an offline-first field tool for small service teams and makers.”
- **Why this fails:** “Offline-first” is product-development jargon and differs from the plain, tested claim on the landing page.
- **Concrete fix:** Rewrite it as: “Stock Return Trail is a field tool for small service teams and makers. It works offline after your first visit.”

#### F-1-12 — A README feature bullet is a noun stack

- **Quote/location:** README, “Partial-use counts and return proposals by origin.”
- **Why this fails:** The phrase describes implementation concepts instead of what the user does and sees.
- **Concrete fix:** Rewrite it as: “Enter how many items were used. See where to return what remains.”

#### F-1-13 — The user-facing feature list exposes a storage implementation

- **Quote/location:** README under “What it includes,” “Separate demo and real IndexedDB databases.”
- **Why this fails:** IndexedDB is browser implementation jargon. The exact database names already belong in the later deployment section.
- **Concrete fix:** Rewrite the feature bullet as: “Demo changes stay separate from your real records.” Keep the exact IndexedDB names only under “Data and deployment.”

#### F-1-14 — The README renames the primary action

- **Quote/location:** landing “Try it with sample data”; README “Try the sample job.”
- **Why this fails:** The same entry point has two labels, contrary to the one-term rule.
- **Concrete fix:** Use “Try it with sample data” in README too.

#### F-1-15 — The offline implementation sentence is unnecessary jargon

- **Quote/location:** README, “The service worker precaches the built app shell.”
- **Why this fails:** “Precache” and “app shell” are implementation terms that do not help a reader deploy or use the product.
- **Concrete fix:** Rewrite it as: “The app saves the files it needs to reopen offline.”

## 1. Cold first screen

Fresh Chromium contexts used 390×844 and 1440×900 viewports with service workers blocked for the cold load. Evidence: [mobile screenshot](review-1-evidence/cold-mobile.png), [desktop screenshot](review-1-evidence/cold-desktop.png), and [captured DOM](review-1-evidence/cold.json).

Before scrolling, my answers were the same at both sizes:

- **What does it do?** It records stock taken to a job, subtracts what was used, and tells the team where to return the rest.
- **For whom?** Field teams returning unused job stock without searching older movement records.
- **What should I click first?** “Try it with sample data.” The adjacent text says it opens a ready-to-close job and saves nothing to real records.

The exact first-screen copy that made those answers possible was “Return job stock to the right place,” “For field teams who need each unused item sent back without searching old movement records,” and “Try it with sample data.” This check passes.

## 2. Copy audit

Counts treat each whitespace-separated token as one word; codes, URLs, and hyphenated terms count as one. No sentence exceeds 22 words and no banned marketing adjective appears. Flags below point to findings above.

### Landing-page sentences

| Sentence | Words | Result |
|---|---:|---|
| Return job stock to the right place | 7 | Pass |
| For field teams who need each unused item sent back without searching old movement records. | 15 | F-1-5 |
| Open a ready-to-close job. | 4 | F-1-7 |
| Nothing is saved. | 3 | Pass |
| Works offline after your first visit. | 6 | Pass |
| Your stock records stay in this browser. | 7 | Pass |
| Use it without an account or a job limit. | 9 | Pass |
| Each item keeps its origin while it is out on a job. | 12 | Pass |
| The job sheet subtracts used stock and groups the remainder by origin. | 12 | Pass |
| Scan or enter a code. | 5 | Pass |
| Add its count and store location. | 6 | F-1-6 |
| At closeout, enter the used count for each stock line. | 10 | F-1-7 |
| The sheet names each origin and adds the moves to your CSV log. | 13 | F-1-5 |
| Stock Return Trail does not price stock, place orders, or sync teams. | 12 | F-1-2 |
| Movement logs help with field closeout. | 6 | F-1-5, F-1-7 |
| They are not audit-grade inventory valuation. | 6 | F-1-8 |
| You can export CSV and JSON backups at any time. | 10 | Pass |
| Return unused job stock to its saved origin. | 8 | Pass |
| Hero artwork generated for this product. | 6 | Pass |
| A field parts case connected to its stockroom by a red route line. (image alt) | 13 | Pass |

### Landing headings, actions, and short labels

These are not sentences, but they were checked because headings must work alone and actions must name a result.

| Copy | Words | Role | Result |
|---|---:|---|---|
| Stock Return Trail | 3 | Wordmark | Pass |
| Demo | 1 | Navigation | Pass |
| Jobs | 1 | Navigation | Pass |
| Trail log | 2 | Navigation | F-1-5 |
| Privacy | 1 | Navigation | Pass |
| Field stock · plotted home | 5 | Eyebrow | F-1-9 |
| Try it with sample data | 5 | Primary action | Pass |
| Live closeout preview | 3 | Eyebrow | F-1-7 |
| See every return before you move it | 7 | H2 | Pass |
| Close the sample job | 4 | Action | Pass |
| Three field marks | 3 | Eyebrow | F-1-10 |
| How the trail works | 4 | H2 | Pass |
| Record stock out | 3 | H3 | Pass |
| Count what was used | 4 | H3 | Pass |
| Return the remainder | 3 | H3 | Pass |
| A narrow tool on purpose | 5 | Eyebrow | Pass |
| A return trail, not an accounts system | 7 | H2 | Pass |
| Terms | 1 | Footer link | Pass |
| Backup | 1 | Footer link | Pass |
| Built by Param Factory · v1.0.0 | 6 | Footer | Pass |

The preview’s structured labels and sample values are not sentences: Origin, Job, Return, VAL-22, Isolation valve, 6 out − 2 used, 4 → Bin B4, CBL-3C, 3-core flex, 4 out − 1 used, and 3 → Cable rack. They are concise and understandable.

### README sentences and copy units

| Sentence or copy unit | Words | Result |
|---|---:|---|
| Stock Return Trail | 3 | Pass |
| Return unused job stock to its saved origin. | 8 | Pass |
| Stock Return Trail is an offline-first field tool for small service teams and makers. | 14 | F-1-11 |
| Record stock as it leaves a store, enter the used count at closeout, and send each remainder back to the recorded origin. | 22 | F-1-6, F-1-7 |
| Try the sample job. | 4 | F-1-14 |
| The demo uses a separate local database and never changes real records. | 12 | Pass |
| What it includes | 3 | Pass |
| Stock-code entry by hand, or by camera in supported browsers | 10 | Pass |
| Partial-use counts and return proposals by origin | 7 | F-1-12 |
| CSV movement-log export | 3 | F-1-5 |
| JSON backup and import | 4 | Pass |
| Offline reload after the first visit | 6 | Pass |
| Separate demo and real IndexedDB databases | 6 | F-1-13 |
| Use it without an account or a job limit | 9 | Pass |
| Movement logs support field closeout. | 5 | F-1-7 |
| They are not audit-grade inventory valuation. | 6 | F-1-8 |
| Develop | 1 | Pass |
| Requires Node.js 20 or later. | 5 | Pass |
| Open `http://localhost:5173/`. | 2 | Pass |
| Use `http://localhost:5173/demo` for the isolated sample. | 6 | Pass |
| Test and build | 3 | Pass |
| The exact production build command is `npm run build`. | 9 | Pass |
| It writes the static site to `./dist`, with `dist/index.html` at the root. | 12 | Pass |
| The Playwright suite checks closeout, claims, offline reload, demo isolation, downloads, responsive layout, and serious accessibility findings. | 17 | Pass; developer context |
| Data and deployment | 3 | Pass |
| Real records use IndexedDB database `stock-return-trail:real`. | 6 | Pass; implementation section |
| Demo records use `stock-return-trail:demo`. | 4 | Pass; implementation section |
| The app has no analytics and sends no stock records to a server. | 13 | F-1-1 |
| Deploy the contents of `dist/` as a static site. | 9 | Pass |
| `staticwebapp.config.json` provides SPA fallback and security headers for Azure Static Web Apps. | 12 | Pass; deployment context |
| The service worker precaches the built app shell. | 8 | F-1-15 |
| See privacy, terms, and `.factory/demo.md`. | 5 | Pass |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

Every landing action starts with a result-naming verb: Try, Close, Record, Scan, Add, Export, Download, Import, Reset, Start, Create, Open, Return, or Reload. Navigation labels are nouns by design. The only primary-action naming mismatch is F-1-14.

## 3. Demo and sandbox

**Pass.** Evidence: [mobile demo screenshot](review-1-evidence/demo-mobile.png) and [live demo trace](review-1-evidence/demo-live.json).

- One click on “Try it with sample data” opened `/demo`.
- The first 390 px screen already showed the working app, “Riverside pump room,” “3 stock lines,” and the ready-for-closeout state. The DOM contained three realistic lines: an isolation valve, three-core flex, and pipe clips from two origins.
- The persistent banner said “Demo — sample data, nothing is saved” and exposed Reset demo and Start for real.
- Closing the sample job produced nine movements. Reset restored the open sample and its close button.
- Start for real opened an empty real workspace with no demo banner.
- IndexedDB inspection showed `stock-return-trail:demo` in demo mode and `stock-return-trail:real` in real mode. The real workspace remained empty.
- A fresh service-worker-controlled demo reloaded offline and displayed the offline notice.
- All 25 observed live requests were same-origin; no console or page errors occurred.

## 4. Claims

All eight commands from `.factory/claims.json` were run exactly as written after `npm ci` in one clean clone of the reviewed commit. Each Playwright command created a fresh browser context and used `/demo` sample data.

| Claim ID | Result | Evidence |
|---|---|---|
| `offline-reload` | Pass, 1 test | [log](review-1-evidence/claim-offline-reload.log) |
| `csv-export` | Pass, 1 test | [log](review-1-evidence/claim-csv-export.log) |
| `return-provenance` | Pass, 1 test | [log](review-1-evidence/claim-return-provenance.log) |
| `stock-code-entry` | Pass, 1 test | [log](review-1-evidence/claim-stock-code-entry.log) |
| `local-records` | Pass, 1 test | [log](review-1-evidence/claim-local-records.log) |
| `demo-isolation` | Pass, 1 test | [log](review-1-evidence/claim-demo-isolation.log) |
| `no-account-job-limit` | Pass, 1 test | [log](review-1-evidence/claim-no-account-job-limit.log) |
| `json-backup` | Pass, 1 test | [log](review-1-evidence/claim-json-backup.log) |

Every listed ID has exactly one `@claim:<id>` test. The full local browser suite also passed: 17/17 tests. `npm run build` passed and produced `dist/`; the application bundle was 10.25 kB gzip. F-1-1 and F-1-2 are the two unlisted claims found when the landing page and README were cross-checked.

## 5. History

Before this report, the repository contained no `.factory/review-*.md` or `.factory/polish-*.md` files. The existing `.factory/handoff.md` was read and its four repaired areas were independently checked in live behavior and code.

| Earlier handoff item | Re-check |
|---|---|
| 390 px closeout containment | Confirmed live: job sheet, route strip, and closeout bar were 366 px wide at x=12; the close button was 326 px at x=32. Document scroll width was exactly 390 px. |
| Keyboard route strip | Confirmed live: Arrow Right moved `scrollLeft` from 0 to 120. |
| Claim tests use demo storage | Confirmed in source and by all claim commands; stock-code and job-limit tests start at `/demo`. |
| AVIF response policy | Confirmed live: `image/avif`, immutable one-year cache. |

The live and local built `index.html` SHA-256 values also matched. Evidence is in [history-check.json](review-1-evidence/history-check.json). No earlier repaired finding regressed.

## 6. Structure, routing, identity, and accessibility

- Client-rendered titles, descriptions, canonicals, one H1, main/header/footer landmarks, and route content passed for `/`, `/demo`, `/app`, `/log`, `/settings`, `/privacy`, `/terms`, and an unknown route. F-1-3 records the raw/social metadata defect.
- Direct deep links loaded. Internal navigation moved focus to the new H1. Back returned to `/` and focused its H1.
- Every crawled HTTP link returned 200; mail links and fragment links were valid exemptions. There were no dead links.
- The designed 404 had a clear recovery action and consistent shell. F-1-4 records its incorrect HTTP status.
- The social image was a real 1200×630 product asset. SVG favicon, 180×180 apple icon, manifest, robots file, sitemap, theme color, and security headers were present.
- The header and footer were consistent across routes and included Privacy and Terms.
- The topographic field-map identity, original parts-case artwork, clipped map-sheet cards, serif/sans pairing, route line, and paper/ink/coral palette were distinct rather than a generic SaaS template. Asset provenance is recorded in `.factory/design.md` and `assets/src/`.
- The provided `verify-url.sh` passed with no console errors, one H1, `lang=en`, main landmark, and complete image alt text. [Evidence](review-1-evidence/verify-url/verify.json).
- Axe was run on all eight routes at 390 px and 1440 px. It found zero violations at any impact level. [Evidence](review-1-evidence/axe-live.json).
- Reduced-motion handling is present in CSS and the app avoids looping motion. The 390 px target checks and keyboard checks passed in the full suite.

## 7. Missed leverage

No finding. The brief implies camera/manual entry, return proposals, CSV export, offline use, and backup portability; all are present. JSON import supplies the obvious restore path. Team sync is explicitly outside scope. An AI step would add cost and network disclosure without improving the core arithmetic or provenance job, so it would be decorative rather than useful.

## What would make this perfect

Resolve F-1-1 through F-1-15, then rerun this complete review from fresh browser and repository contexts. Perfect means the two unlisted claims are either registered and tested or removed, every route serves accurate share/search metadata, unknown routes return HTTP 404, and every flagged copy unit uses one plain term on the first read. No additional product feature is needed after those fixes.
