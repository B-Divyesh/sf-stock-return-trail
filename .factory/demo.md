# Demo sandbox

- URL: `https://stock-return-trail.sociobot.in/demo` (local: `http://localhost:4173/demo`)
- Sample: the open “Riverside pump room” job with three stock lines from two origins. Used counts are prefilled, so it is ready for closeout.
- Reset: use **Reset demo** in the persistent demo banner.
- Leave: use **Start for real**. The real workspace starts empty and never reads demo records.
- Storage: demo data uses the IndexedDB database `stock-return-trail:demo`. Real data uses `stock-return-trail:real`.
- Offline check: open the demo online once, then reload after the service worker controls the page. The sample and closeout workflow remain available offline.
