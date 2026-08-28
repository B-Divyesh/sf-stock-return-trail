# Stock Return Trail verification handoff

## Result: FAIL

Independent verification of candidate `1c87f3bf63da794568e2d50bc9d1fe22c392dd2d` at https://stock-return-trail.sociobot.in completed on 2026-08-28. The live artifact is byte-identical to a fresh local production build, so there is no deployment-only mismatch.

The candidate must not release yet. At 390 px the demo job sheet is 550 px wide and clipped by `main { overflow: clip; }`; the core **Record returns & close job** button is 510 px wide and extends from x=32 to x=542 in a 390 px viewport. Two declared claim tests also use `/app` rather than the required isolated `/demo` entry point.

## What passed

- `npm ci`, all eight individual claim commands, `npm run test:unit` (4 tests), `npm test` (17 Chromium tests), and the exact `npm run build` command.
- Cold first-read and one-click sample demo requirements.
- Live normal return closeout, CSV export, invalid-count recovery, Axe serious/critical scans, keyboard skip navigation, focus visibility, reduced motion, offline reload, service-worker control/update path, local-only requests, headers/caching, and live-to-local artifact hashes.
- Live Lighthouse `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.053 s and CLS 0.034.

## Required repair and re-verification

1. Constrain the mobile job sheet, route strip, and closeout button so all essential controls are completely visible and usable at 390 px. Add a bounding-box assertion, not only `toBeVisible()`.
2. Run all claim scenarios from isolated demo storage and update `.factory/claims.json` metadata accordingly.
3. Configure the AVIF response as `image/avif`.
4. Rebuild/deploy, then rerun every claim command, unit suite, full suite, build, mobile browser QA, and live verification.

See `.factory/verification-2.md` for exact commands, measurements, evidence, and defect severity.
