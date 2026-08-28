# Stock Return Trail

Return unused job stock to its saved origin.

Stock Return Trail is a field tool for small service teams and makers. It works offline after your first visit. Record stock as it leaves an origin. Enter the used count when you finish a job. Return each remainder to its saved origin.

[Try it with sample data](https://stock-return-trail.sociobot.in/demo). The demo uses a separate local database and never changes real records.

## What it includes

- Stock-code entry by hand, or by camera in supported browsers
- Enter how many items were used. See where to return what remains.
- Export the movement log as CSV
- JSON backup and import
- Offline reload after the first visit
- Demo changes stay separate from your real records
- Use it without an account or a job limit

Use the movement log when you finish a field job. Do not use it for accounting or formal stock audits.

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

The Playwright suite checks finishing jobs, claims, offline reload, demo isolation, downloads, responsive layout, and serious accessibility findings.

## Data and deployment

Real records use IndexedDB database `stock-return-trail:real`. Demo records use `stock-return-trail:demo`. The app has no analytics and sends no stock records to a server.

Deploy the contents of `dist/` as a static site. Each public route is emitted as its own HTML page with route-specific metadata. `staticwebapp.config.json` provides security headers and a designed 404 response. The app saves the files it needs to reopen offline.

See [privacy](https://stock-return-trail.sociobot.in/privacy), [terms](https://stock-return-trail.sociobot.in/terms), and [.factory/demo.md](.factory/demo.md).

## License

MIT. See [LICENSE](LICENSE).
