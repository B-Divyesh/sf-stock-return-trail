# Copy audit

Audited 28 August 2026. This includes every visitor-facing sentence on the landing page and README, plus headings and actions that must stand alone. Word counts treat hyphenated terms and codes as one word. No sentence exceeds 22 words. No banned marketing words appear.

| Copy | Words | Location / role | Result |
|---|---:|---|---|
| Return job stock to the right place | 7 | Landing H1 | Pass |
| For field teams who return unused items without searching the movement log. | 12 | Landing audience | Pass |
| Open a job ready to finish. | 6 | Demo outcome | Pass |
| Nothing is saved. | 3 | Demo outcome | Pass |
| Works offline after your first visit. | 6 | Landing fact | Pass |
| Your stock records stay in this browser. | 7 | Landing fact | Pass |
| Use it without an account or a job limit. | 9 | Landing fact | Pass |
| Each item keeps its origin while it is out on a job. | 12 | Art caption | Pass |
| The job sheet subtracts used stock and groups the remainder by origin. | 12 | Landing preview | Pass |
| Scan or enter a code. | 5 | Landing step | Pass |
| Add its count and origin. | 5 | Landing step | Pass |
| When you finish a job, enter the used count for each stock line. | 13 | Landing step | Pass |
| The sheet names each origin and adds each move to your movement log. | 13 | Landing step | Pass |
| Stock Return Trail does not price stock, place orders, or sync teams. | 12 | Landing boundary | Pass; `scope-boundary` claim |
| Use the movement log when you finish a field job. | 10 | Landing boundary | Pass |
| Do not use it for accounting or formal stock audits. | 10 | Landing boundary | Pass |
| You can export CSV and JSON backups at any time. | 10 | Landing export | Pass |
| Stock Return Trail is a field tool for small service teams and makers. | 13 | README introduction | Pass |
| It works offline after your first visit. | 7 | README introduction | Pass; `offline-reload` claim |
| Record stock as it leaves an origin. | 7 | README introduction | Pass |
| Enter the used count when you finish a job. | 10 | README introduction | Pass |
| Return each remainder to its saved origin. | 7 | README introduction | Pass |
| Try it with sample data. | 5 | README action | Pass |
| Enter how many items were used. | 7 | README feature | Pass |
| See where to return what remains. | 7 | README feature | Pass |
| Export the movement log as CSV. | 6 | README feature | Pass; `csv-export` claim |
| Demo changes stay separate from your real records. | 8 | README feature | Pass; `demo-isolation` claim |
| The app has no analytics and sends no stock records to a server. | 13 | README data section | Pass; `no-analytics` and `local-records` claims |
| The app saves the files it needs to reopen offline. | 10 | README deployment | Pass |

## Terminology

| Concept | One term used |
|---|---|
| Temporary unit of work | job |
| A product and count assigned to a job | stock line |
| Permanent source location | origin |
| Stored history and export | movement log |
| End-of-job action | finish a job |
| Downloadable movement file | movement log as CSV |
| Full portable data copy | JSON backup |
