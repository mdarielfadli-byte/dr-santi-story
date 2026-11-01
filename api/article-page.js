const apiVersion = '2025-02-19';
const siteUrl = 'https://www.drsantistory.com';

const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[character]));
const safeHref = value => {
  const href = String(value || '').trim();
  return /^(https?:\/\/|\/)/i.test(href) ? href : '';
};
const textFromBlock = block => (block.children || []).map(child => child.text || '').join('');
const inlineFromBlock = block => {
  const definitions = new Map((block.markDefs || []).map(definition => [definition._key, definition]));
  return (block.children || []).map(child => {
    let text = escapeHtml(child.text || '');
    (child.marks || []).forEach(mark => {
      if (mark === 'strong') text = `<strong>${text}</strong>`;
      else if (mark === 'em') text = `<em>${text}</em>`;
      else {
        const definition = definitions.get(mark);
        const href = definition?._type === 'link' ? safeHref(definition.href) : '';
        if (href) text = `<a href="${escapeHtml(href)}"${href.startsWith('http') ? ' rel="noopener noreferrer"' : ''}>${text}</a>`;
      }
    });
    return text;
  }).join('');
};
const toParagraphs = blocks => (blocks || []).map(block => {
  if (block._type === 'image' && block.url) return `<figure class="article-feature-image"><img src="${escapeHtml(block.url)}" alt="${escapeHtml(block.alt || '')}"></figure>`;
  const text = inlineFromBlock(block);
  if (!text) return '';
  if (block.style === 'h2') return `<h2>${text}</h2>`;
  if (block.style === 'h3') return `<h3>${text}</h3>`;
  if (block.style === 'blockquote') return `<aside class="article-pullquote">${text}</aside>`;
  return `<p>${text}</p>`;
}).join('');

async function getArticle(slug) {
  const projectId = process.env.SANITY_API_PROJECT_ID;
  const dataset = process.env.SANITY_API_DATASET;
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!projectId || !dataset || !token) throw new Error('CMS is not configured.');
  const query = `*[_type == "article" && !(_id in path("drafts.**")) && slug.current == $slug][0]{title,"slug":slug.current,language,authorName,category,summary,seoTitle,seoDescription,"imageUrl":featuredImage.asset->url,"imageAlt":featuredImage.alt,body[]{..., _type == "image" => {"url":asset->url,alt}},publishedAt,_updatedAt}`;
  const endpoint = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  endpoint.searchParams.set('query', query);
  endpoint.searchParams.set('$slug', JSON.stringify(slug));
  const result = await fetch(endpoint, {headers: {Authorization: `Bearer ${token}`}});
  const payload = await result.json();
  if (!result.ok) throw new Error(payload.error?.description || 'Could not load article.');
  return payload.result;
}

const articleLanguage = article => {
  if (article.language === 'id' || article.language === 'en') return article.language;
  const slug = String(article.slug || '');
  if (/^(dari-|kebiasaan-|cara-)/i.test(slug)) return 'id';
  return 'en';
};

async function getRelatedArticles(currentSlug) {
  const projectId = process.env.SANITY_API_PROJECT_ID;
  const dataset = process.env.SANITY_API_DATASET;
  const token = process.env.SANITY_API_READ_TOKEN;
  const query = `*[_type == "article" && !(_id in path("drafts.**")) && defined(slug.current) && slug.current != $slug] | order(coalesce(publishedAt, _updatedAt) desc)[0...12]{title,"slug":slug.current,language,category,summary,"imageUrl":featuredImage.asset->url,"imageAlt":featuredImage.alt}`;
  const endpoint = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  endpoint.searchParams.set('query', query);
  endpoint.searchParams.set('$slug', JSON.stringify(currentSlug));
  const result = await fetch(endpoint, {headers: {Authorization: `Bearer ${token}`}});
  const payload = await result.json();
  if (!result.ok) throw new Error(payload.error?.description || 'Could not load related articles.');
  return payload.result || [];
};

module.exports = async (request, response) => {
  const slug = String(request.query.slug || '').replace(/[^a-z0-9-]/gi, '');
  if (!slug) return response.status(404).send('Article not found.');

  try {
    const article = await getArticle(slug);
    if (!article) return response.status(404).send('Article not found.');
    const language = articleLanguage(article);
    const authorName = article.authorName || 'Dr. Santi Dharmaputra, Ph.D.';
    const relatedArticles = (await getRelatedArticles(slug).catch(() => []))
      .filter(item => articleLanguage(item) === language)
      .slice(0, 3);
    const title = article.seoTitle || article.title;
    const description = article.seoDescription || article.summary || `Article by Dr Santi's Story.`;
    const canonical = `${siteUrl}/articles/${article.slug}`;
    const publishedAt = article.publishedAt || article._updatedAt;
    const featuredImage = article.imageUrl || `${siteUrl}/assets/dr-santi-reading.webp`;
    const image = `<figure class="article-feature-image"><img src="${escapeHtml(featuredImage)}" alt="${escapeHtml(article.imageAlt || article.title)}"></figure>`;
    const date = publishedAt
      ? escapeHtml(article.category || 'Article') + ' · ' + new Date(publishedAt).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-GB', {day: 'numeric', month: 'long', year: 'numeric'})
      : escapeHtml(article.category || 'Article');
    const authorLine = `<p class="byline article-author">${language === 'id' ? 'Ditulis oleh' : 'By'} ${escapeHtml(authorName)}</p><p class="byline article-date">${date}</p>`;
    const banner = `<section class="article-post-banner section-shell"><div><p class="eyebrow">${language === 'id' ? 'Lanjutkan percakapan' : 'Keep the conversation going'}</p><h2>${language === 'id' ? 'Ingin membahas gagasan ini bersama keluarga atau komunitas Anda?' : 'Would you like to explore this with your family or community?'}</h2><p>${language === 'id' ? 'Ceritakan apa yang sedang Anda pikirkan. Kita bisa mulai dari sana.' : 'Tell us what is on your mind. We can start there.'}</p></div><a class="button button-primary" href="/contact">${language === 'id' ? 'Mulai percakapan' : 'Start a conversation'}</a></section>`;
    const relatedCards = relatedArticles.map(item => {
      const imageUrl = item.imageUrl || '/assets/dr-santi-reading.webp';
      const summary = item.summary ? `<p>${escapeHtml(item.summary)}</p>` : '';
      return `<article class="article-card"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(item.imageAlt || item.title)}" loading="lazy"><div><p class="story-type">${escapeHtml(item.category || (language === 'id' ? 'Artikel' : 'Article'))}</p><h3>${escapeHtml(item.title)}</h3>${summary}<a href="/articles/${encodeURIComponent(item.slug)}">${language === 'id' ? 'Baca selengkapnya' : 'Read more'} <span>→</span></a></div></article>`;
    }).join('');
    const relatedSection = `<section class="related-articles section-shell"><div class="related-articles-heading"><div><p class="eyebrow">${language === 'id' ? 'Bacaan berikutnya' : 'Keep reading'}</p><h2>${language === 'id' ? 'Artikel terkait' : 'Related articles'}</h2></div><a class="text-link" href="/stories-resources#articles">${language === 'id' ? 'Lihat semua artikel' : 'View all articles'} <span>→</span></a></div>${relatedCards ? `<div class="article-card-grid">${relatedCards}</div>` : `<p class="related-articles-empty">${language === 'id' ? 'Artikel terkait lainnya akan hadir di sini.' : 'More related articles will appear here.'}</p>`}</section>`;
    const schema = JSON.stringify({'@context': 'https://schema.org', '@type': 'Article', headline: title, description, mainEntityOfPage: canonical, datePublished: publishedAt, dateModified: article._updatedAt, author: {'@type': 'Person', name: authorName}, publisher: {'@type': 'Organization', name: "Dr Santi's Story"}, image: featuredImage});
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return response.status(200).send(`<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)} | Dr Santi's Story</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="article"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${escapeHtml(featuredImage)}"><script type="application/ld+json">${schema.replace(/</g, '\\u003c')}</script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/content-pages.css"></head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="wordmark" href="/">Dr Santi’s <span>Story</span></a><button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav" class="site-nav"><a href="/">Home</a><a href="/about">About</a><a href="/programs-services">Programs &amp; Services</a><a href="/stories-resources">Stories &amp; Resources</a><a class="nav-cta" href="/contact">Contact</a></nav></header><main id="main"><article class="article-page"><header class="article-header"><a class="back-link" href="/stories-resources#articles">${language === 'id' ? '← Semua artikel' : '← All articles'}</a><p class="eyebrow">${escapeHtml(article.category || 'Article')}</p><h1>${escapeHtml(article.title)}</h1>${article.summary ? `<p class="article-dek">${escapeHtml(article.summary)}</p>` : ''}${authorLine}</header>${image}<div class="article-body">${toParagraphs(article.body)}</div></article>${banner}${relatedSection}</main><footer class="site-footer"><a class="wordmark" href="/">Dr Santi’s <span>Story</span></a><p>Reading, leadership &amp; lifelong learning.</p><p>© 2026 Dr Santi’s Story</p></footer><script src="/script.js"></script></body></html>`);
  } catch (error) {
    return response.status(502).send('Article could not be loaded.');
  }
};
