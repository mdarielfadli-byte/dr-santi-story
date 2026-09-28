# Dr Santi’s Story — Website Baseline

## Production

- Public website: https://www.drsantistory.com
- CMS: https://cms.drsantistory.com
- Source repository: https://github.com/mdarielfadli-byte/dr-santi-story
- Hosting: Vercel team `darielfadli`, project `dr-santi-story`
- CMS hosting: Vercel team `darielfadli`, project `cms`

## Public routes

`/`, `/about`, `/programs-services`, `/contact`, `/stories-resources`,
`/stories-resources/cartea`, `/fantasia`, `/fantasia-event`, `/partnership`,
`/collaborate`, and `/articles` are the supported public pages.

Retired routes:

- `/books` redirects to `/stories-resources`
- `/invite-dr-santi` redirects to `/contact`
- `/fantasia/reading-ritual` redirects to `/fantasia`

## Form and CMS integration

- Contact form: `POST /api/inquiry`
- Participant ritual capture: `POST /api/reading-ritual`
- Published website copy: `GET /api/cms-content?page=<pageId>`
- Published article feed: `GET /api/articles`
- SEO-ready article page: `/articles/<slug>` (server-rendered from Sanity)
- Dynamic sitemap: `/sitemap.xml` (includes published Sanity articles)
- The public form endpoints proxy to the configured Google Apps Script endpoint.
- The 7 Days Reading Ritual PDF is stored at `/assets/7-days-reading-ritual.pdf`.

## Asset inventory

- Brand: `assets/logo-navbar.png`, `assets/logo-footer.png`, `assets/favicon.png`
- Dr Santi: `assets/dr-santi-portrait.jpg`, `assets/dr-santi-reading.jpg`, and WebP variants
- Programs: `assets/programs-services-1.webp`, `assets/programs-services-2.webp`
- Cartea: `assets/cartea/`
- Fantasia documentation: `assets/fantasia/`
- Participant resource: `assets/7-days-reading-ritual.pdf`
- QR graphics: `assets/collaborate-qr.*`, `assets/fantasia-qr.*`

## Test results

| Check | Result |
| --- | --- |
| Supported public routes | HTTP 200 |
| Retired routes | Redirected in this baseline |
| Contact validation endpoint | HTTP 400 for an empty submission, as expected |
| Ritual validation endpoint | HTTP 400 for an empty submission, as expected |
| Participant PDF | HTTP 200, `application/pdf` |
| CMS API | HTTP 200 and public copy renders from Sanity |
| Sanity Studio build | Passed |
| Article CMS synchronisation | Passed; existing copy was not replaced |

No real visitor form submission is used in testing, so the live Apps Script delivery path should be verified with a team-approved test contact before launch.

## SEO foundation

- `robots.txt` permits public crawling and points to the sitemap.
- Public pages use canonical URLs; article pages use a server-rendered canonical URL, per-article title, description, Open Graph data, and `Article` JSON-LD.
- The initial article is available in Sanity under **Artikel** with the URL `/articles/kebiasaan-membaca-anak`.
- Future team workflow: create an **Artikel** document, fill **URL artikel**, **Ringkasan**, **Isi artikel**, and **Deskripsi Google**, then publish. The article card, unique URL, metadata, and sitemap entry are generated automatically.

## Still requires account access

- Add a Google Analytics or Google Tag Manager measurement ID in Vercel environment settings.
- Verify `https://www.drsantistory.com` in Google Search Console.
- Submit `https://www.drsantistory.com/sitemap.xml`, then use Search Console for indexing status and the baseline of keywords, impressions, clicks, CTR, and average position.

## Intentionally deferred

- SEO: Google Analytics/Tag Manager, Search Console verification, indexing, and performance reporting require the Google account owner.
- CMS: event collection and protected participant-download workflow are future work.
- Privacy: the PDF remains a static asset. The present event-participant gate is not authentication and should not be treated as secure access control.
- QR: image files are included; end-to-end scans should be repeated after the final deployment.
