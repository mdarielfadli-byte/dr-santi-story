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

No real visitor form submission is used in testing, so the live Apps Script delivery path should be verified with a team-approved test contact before launch.

## Intentionally deferred

- SEO: metadata review, sitemap/robots, canonical URLs, structured data, and analytics.
- CMS: article/event collections are editorially available, but a fully CMS-driven article renderer and protected participant-download workflow are future work.
- Privacy: the PDF remains a static asset. The present event-participant gate is not authentication and should not be treated as secure access control.
- QR: image files are included; end-to-end scans should be repeated after the final deployment.
