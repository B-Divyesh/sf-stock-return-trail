# Stock Return Trail repair handoff

## Result

**Local release verification: PASS.** This repair addresses every release blocker recorded in verifier reports `.factory/verification-1.md` and `.factory/verification-2.md` for candidate `1c87f3bf63da794568e2d50bc9d1fe22c392dd2d`.

## Repairs

1. **390 px closeout containment:** the job work area and job sheet now opt into shrinking (`min-width: 0`, bounded to `100%`). The route strip scrolls inside that bounded sheet; the closeout bar and primary close button are bounded and fill the available mobile width. At 390 px, measured local boxes are: job sheet 366 px (`x=12–378`), route strip 366 px (`x=12–378`), closeout bar 366 px (`x=12–378`), and **Record returns & close job** 326 px (`x=32–358`).
2. **Keyboard route strip:** because the bounded route strip can scroll on a phone, it is focusable and Arrow Left/Right now scroll it. The mobile Playwright regression focuses the strip, presses Arrow Right, and asserts `scrollLeft > 0`.
3. **Demo-only claims:** `@claim:stock-code-entry` and `@claim:no-account-job-limit` now begin at `/demo` and operate only in the sample IndexedDB namespace. Their `.factory/claims.json` sandbox descriptions now match this behavior. The existing real-workspace behavior remains covered by non-claim workflow tests.
4. **AVIF response policy:** `public/staticwebapp.config.json` maps `.avif` to `image/avif`; the static-host unit test asserts that mapping alongside the existing cache rules.

## Verification evidence

- Clean dependency install: `npm ci` — pass (96 packages, 0 vulnerabilities).
- Unit/type/static policy: `npm run test:unit` — pass, 4 tests. `npm run build` — pass; TypeScript typecheck is part of the build.
- Complete browser suite: `npm test` — pass, 17 Chromium tests. This covers desktop and 390 × 844 mobile, closeout, validation recovery, keyboard skip navigation, route-strip arrow scrolling, focus sizing, privacy/network isolation, offline reload, demo isolation, backup, CSV, and serious/critical Axe findings.
- Claims: every command declared in `.factory/claims.json` was run as `npm test -- --grep @claim:<id>` for all eight IDs; all passed from fresh browser contexts. The two repaired claim scenarios now enter `/demo`.
- URL smoke: `VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo <evidence-dir>` — pass: HTTP 200, title `Demo — Stock Return Trail`, `lang=en`, one H1, main landmark, zero missing image alts, zero unlabeled buttons, and zero console/page errors.
- Accessibility: the Playwright Axe integration in the complete suite reports zero serious/critical issues on the landing page, app, privacy page, and repaired mobile demo. The mobile route strip is focusable and keyboard-operable.
- Production build size: JavaScript 29.39 kB (10.25 kB gzip), CSS 19.99 kB (5.67 kB gzip), and self-hosted fonts 53.30 kB total; all within the product budgets.
- Local mobile Lighthouse `/demo` (Chromium with `--no-sandbox`): Performance 97, Accessibility 100, Best Practices 100, SEO 100; LCP 1,360 ms and CLS 0.030.

## Deployment and live verification

Repair commit `a73835a` was pushed to `origin/main`. The artifact remains a static Vite PWA. Post-push checks at https://stock-return-trail.sociobot.in still served the previous `index-DIYXczTj.js` bundle and `application/octet-stream` for `/assets/hero-topographic.avif`; therefore the factory static deployment has not yet promoted this commit. The repository has no GitHub Actions deployment run, and no direct deployment credential or infrastructure configuration is in this repository. Once the factory promotion runs, verify `/demo` and confirm that the AVIF response header is `Content-Type: image/avif`.

## Known gaps / next steps

No product gaps are known. The only pending step is factory static deployment/promotion and its live identity and AVIF-header check.

## Run locally

```sh
npm ci
npm run test:unit
npm test
npm run build
npm run preview
```
