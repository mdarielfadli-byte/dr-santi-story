const apiVersion = '2025-02-19';
const siteUrl = 'https://www.drsantistory.com';

const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, character => ({'&': '&amp;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[character]));
const safeUrl = value => /^(https?:\/\/|\/)/.test(String(value || '')) ? value : '';
const textFromBlock = block => (block.children || []).map(child => child.text || '').join('');
const renderBlocks = blocks => (blocks || []).map(block => {
  const text = escapeHtml(textFromBlock(block));
  if (!text) return '';
  if (block.style === 'h2') return `<h2>${text}</h2>`;
  if (block.style === 'h3') return `<h3>${text}</h3>`;
  if (block.style === 'blockquote') return `<aside class="article-pullquote">${text}</aside>`;
  return `<p>${text}</p>`;
}).join('');

async function getEvent(slug) {
  const {SANITY_API_PROJECT_ID: projectId, SANITY_API_DATASET: dataset, SANITY_API_READ_TOKEN: token} = process.env;
  if (!projectId || !dataset || !token) throw new Error('CMS is not configured.');
  const query = '*[_type == "event" && slug.current == $slug && status != "Draft"][0]{title,"slug":slug.current,status,eventDate,location,summary,details,ctaLabel,ctaUrl,"imageUrl":featuredImage.asset->url,"imageAlt":featuredImage.alt,_updatedAt}';
  const endpoint = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  endpoint.searchParams.set('query', query);
  endpoint.searchParams.set('$slug', JSON.stringify(slug));
  const result = await fetch(endpoint, {headers: {Authorization: `Bearer ${token}`}});
  const payload = await result.json();
  if (!result.ok) throw new Error(payload.error?.description || 'Could not load event.');
  return payload.result;
}

module.exports = async (request, response) => {
  const slug = String(request.query.slug || '').replace(/[^a-z0-9-]/gi, '');
  if (!slug) return response.status(404).send('Event not found.');

  try {
    const event = await getEvent(slug);
    if (!event) return response.status(404).send('Event not found.');
    const canonical = `${siteUrl}/events/${event.slug}`;
    const date = event.eventDate ? new Date(event.eventDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '';
    const description = event.summary || `Event by Dr Santi's Story.`;
    const image = event.imageUrl ? `<figure class="article-feature-image"><img src="${escapeHtml(event.imageUrl)}" alt="${escapeHtml(event.imageAlt || event.title)}"></figure>` : '';
    const details = renderBlocks(event.details);
    const ctaUrl = safeUrl(event.ctaUrl);
    const cta = event.ctaLabel && ctaUrl ? `<p><a class="button button-primary" href="${escapeHtml(ctaUrl)}">${escapeHtml(event.ctaLabel)} <span>→</span></a></p>` : '';
    const schema = JSON.stringify({'@context': 'https://schema.org', '@type': 'Event', name: event.title, description, startDate: event.eventDate, eventStatus: event.status === 'Upcoming' ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventCompleted', location: event.location ? {'@type': 'Place', name: event.location} : undefined, image: event.imageUrl, url: canonical, organizer: {'@type': 'Organization', name: "Dr Santi's Story"}});
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return response.status(200).send(`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(event.title)} | Dr Santi's Story</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(event.title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}">${event.imageUrl ? `<meta property="og:image" content="${escapeHtml(event.imageUrl)}">` : ''}<script type="application/ld+json">${schema.replace(/</g, '\\u003c')}</script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/content-pages.css"></head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="wordmark" href="/">Dr Santi’s <span>Story</span></a><button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav" class="site-nav"><a href="/">Home</a><a href="/about">About</a><a href="/programs-services">Programs &amp; Services</a><a href="/stories-resources">Stories &amp; Resources</a><a class="nav-cta" href="/contact">Contact</a></nav></header><main id="main"><article class="article-page"><header class="article-header"><a class="back-link" href="/stories-resources">← Stories &amp; Resources</a><p class="eyebrow">${escapeHtml(event.status || 'Event')}</p><h1>${escapeHtml(event.title)}</h1>${event.summary ? `<p class="article-dek">${escapeHtml(event.summary)}</p>` : ''}<p class="byline">${escapeHtml([date, event.location].filter(Boolean).join(' · '))}</p></header>${image}<div class="article-body">${details}${cta}</div></article></main><footer class="site-footer"><a class="wordmark" href="/">Dr Santi’s <span>Story</span></a><p>Reading, leadership &amp; lifelong learning.</p><p>© 2026 Dr Santi’s Story</p></footer><script src="/script.js"></script></body></html>`);
  } catch (_) {
    return response.status(502).send('Event could not be loaded.');
  }
};
