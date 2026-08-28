# Stock Return Trail verification handoff

## Result

**Independent release verification: PASS.** Candidate `9d835651472b63fc604ceef70e6c83c09f2dfe63` is live at https://stock-return-trail.sociobot.in. `.factory/verification-3.md` contains the complete fresh evidence.

## Repairs

1. **390 px closeout containment:** the job work area and job sheet now opt into shrinking (`min-width: 0`, bounded to `100%`). The route strip scrolls inside that bounded sheet; the closeout bar and primary close button are bounded and fill the available mobile width. At 390 px, measured local boxes are: job sheet 366 px (`x=12–378`), route strip 366 px (`x=12–378`), closeout bar 366 px (`x=12–378`), and **Record returns & close job** 326 px (`x=32–358`).
2. **Keyboard route strip:** because the bounded route strip can scroll on a phone, it is focusable and Arrow Left/Right now scroll it. The mobile Playwright regression focuses the strip, presses Arrow Right, and asserts `scrollLeft > 0`.
3. **Demo-only claims:** `@claim:stock-code-entry` and `@claim:no-account-job-limit` now begin at `/demo` and operate only in the sample IndexedDB namespace. Their `.factory/claims.json` sandbox descriptions now match this behavior. The existing real-workspace behavior remains covered by non-claim workflow tests.
4. **AVIF response policy:** `public/staticwebapp.config.json` maps `.avif` to `image/avif`; the static-host unit test asserts that mapping alongside the existing cache rules.

## Verification evidence

- Fresh `npm ci`, `npm run test:unit` (4 tests), all eight claim commands, and all 17 browser cases passed in verification 3. `npm run build` passed and writes `dist/`.
- Live end-to-end closeout, CSV, JSON workflow, invalid inputs, 390 px layout, keyboard, offline reload, service-worker registration/update check, privacy requests, headers, caches, and deployed-byte identity passed.
- Live Lighthouse on `/demo`: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 742 ms and CLS 0.030. See the note about a post-audit browser screenshot warning in `.factory/verification-3.md`.

## Deployment and live verification

The former deployment-only concern is resolved. Fresh SHA-256 comparisons of live and locally built `index.html`, JS, and CSS are exact matches; live AVIF is `Content-Type: image/avif` with immutable caching. The static product makes no API calls, has no authentication, and requires no rate-limit or Entra verification.

## Known gaps / next steps

No known product gaps or release blockers.

## Run locally

```sh
npm ci
npm run test:unit
npm test
npm run build
npm run preview
```
