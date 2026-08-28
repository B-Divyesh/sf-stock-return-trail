# Stock Return Trail

Return unused job stock to its saved origin.

Stock Return Trail is an offline-first field tool for small service teams and makers. Record stock as it leaves a store, enter the used count at closeout, and send each remainder back to the recorded origin.

[Try the sample job](https://stock-return-trail.sociobot.in/demo). The demo uses a separate local database and never changes real records.

## What it includes

- Stock-code entry by hand, or by camera in supported browsers
- Partial-use counts and return proposals by origin
- CSV movement-log export
- JSON backup and import
- Offline reload after the first visit
- Separate demo and real IndexedDB databases

Movement logs support field closeout. They are not audit-grade inventory valuation.

## Price

The free version supports two open jobs. Core closeout, CSV export, JSON backup, and offline use remain free. A £19 one-time site kit license removes the open-job limit.

Checkout and license verification use the Sociobot billing API. No product ID or payment-provider secret is stored here.

## Develop

Requires Node.js 20 or later.

```sh
npm install
npm run dev
```

Open `http://localhost:5173/`. Use `http://localhost:5173/demo` for the isolated sample.

## Test and build

```sh
npm test
npm run build
```

The exact production build command is `npm run build`. It writes the static site to `./dist`, with `dist/index.html` at the root.

The Playwright suite checks closeout, claims, offline reload, demo isolation, downloads, responsive layout, and serious accessibility findings.

## Data and deployment

Real records use IndexedDB database `stock-return-trail:real`. Demo records use `stock-return-trail:demo`. The app has no analytics and sends no stock records to a server.

Deploy the contents of `dist/` as a static site. `staticwebapp.config.json` provides SPA fallback and security headers for Azure Static Web Apps. The service worker precaches the built app shell.

See [privacy](https://stock-return-trail.sociobot.in/privacy), [terms](https://stock-return-trail.sociobot.in/terms), and [.factory/demo.md](.factory/demo.md).

## License

MIT. See [LICENSE](LICENSE).
