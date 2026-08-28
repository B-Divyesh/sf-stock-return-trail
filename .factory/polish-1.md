# Polish 1 — finding closure

Repair commit: `85201378fe36a3da77cbf92e34b3b579fac9c765` (pushed to `main`). Deployed to `https://stock-return-trail.sociobot.in` on 2026-08-28.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Registered the README analytics statement as `no-analytics`; its sandbox test observes landing plus demo completion, off-site requests, and `sendBeacon`. | Clean clone: `npm test -- --grep @claim:no-analytics` passed. Live same-origin request capture: `polish-1-evidence/live-links-privacy.json`. |
| F-1-2 | Registered the useful scope sentence as `scope-boundary`; its sandbox test starts in demo, completes it, checks every public route for price/order/sync controls, and observes requests. | Clean clone: `npm test -- --grep @claim:scope-boundary` passed. Live landing: `https://stock-return-trail.sociobot.in/`. |
| F-1-3 | Build now emits a distinct HTML page for every public route, with raw title, description, canonical, OG, and Twitter tags. Client navigation also updates all of those tags. | `npm run test:static` passed; raw live responses are retained under `polish-1-evidence/`; `https://stock-return-trail.sociobot.in/privacy` returns Privacy metadata. |
| F-1-4 | Removed blanket SPA fallback, explicitly rewrote only known routes, and retained the designed 404 response override. | `src/static-config.test.ts`; live `https://stock-return-trail.sociobot.in/does-not-exist` returned HTTP 404 and the designed recovery page in `live-browser-a11y.json`. |
| F-1-5 | Standardised the history/export term as **movement log** in navigation, landing, app, log screen, privacy text, README, and actions. | `copy-audit.md`; live mobile screenshot `polish-1-evidence/live-mobile-demo-query.png`. |
| F-1-6 | Standardised the permanent source location as **origin**. | Landing workflow and README audited in `copy-audit.md`; `/demo` live sample shows origins. |
| F-1-7 | Replaced user-facing “closeout” language with direct “finish job” wording. | `copy-audit.md`; live sample screenshot and full browser report. |
| F-1-8 | Rewrote the accounting disclaimer as “Do not use it for accounting or formal stock audits.” | Landing, log, terms, and README; `copy-audit.md`. |
| F-1-9 | Replaced the first-screen metaphor eyebrow with “Job stock returns.” | Live cold home screenshot: `polish-1-evidence/live-desktop-home.png`. |
| F-1-10 | Replaced “Three field marks” with “Three steps.” | `copy-audit.md`; live home URL. |
| F-1-11 | Rewrote README “offline-first” sentence using the tested plain wording. | `README.md`; clean clone `@claim:offline-reload` passed. |
| F-1-12 | Rewrote the partial-use feature bullet as user actions and outcomes. | `README.md`; `copy-audit.md`. |
| F-1-13 | Rewrote the README feature bullet to describe demo isolation without storage jargon. | `README.md`; clean clone `@claim:demo-isolation` passed. |
| F-1-14 | Standardised the README entry action as “Try it with sample data.” | `README.md`; live `/demo` and `/?demo=1` checks. |
| F-1-15 | Rewrote the service-worker implementation sentence in plain language. | `README.md`; clean clone `@claim:offline-reload` passed. |

## Additional acceptance checks

- `?demo=1` is a one-click direct entry: it opens the isolated Riverside sample with the persistent Demo banner, Reset demo, and Start for real. Evidence: `polish-1-evidence/live-browser-a11y.json` and `polish-1-evidence/live-mobile-demo-query.png`.
- All ten declared claims have exactly one matching `@claim:` test. Every declared command passed from a fresh clone after `npm ci`.
- Live browser audit checked all eight routes at 1440 px and 390 px: one H1 each, no axe violations, no unexpected console errors, and an actual 404 response. It also checked live offline reload. Evidence: `polish-1-evidence/live-browser-a11y.json`.
- `verify-url.sh` passed on `/` and `/demo`. Evidence: `polish-1-evidence/verify-root/verify.json` and `polish-1-evidence/verify-demo/verify.json`.
