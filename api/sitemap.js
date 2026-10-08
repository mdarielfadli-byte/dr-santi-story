const apiVersion = '2025-02-19';
const siteUrl = 'https://www.drsantistory.com';
const staticPaths = ['/', '/about', '/programs-services', '/speaking-collaboration', '/stories-resources', '/stories-resources/cartea', '/articles', '/fantasia', '/fantasia-event', '/partnership', '/collaborate', '/contact'];
const escapeXml = value => String(value).replace(/[<>&'\"]/g, character => ({'<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'}[character]));

module.exports = async (_request, response) => {
  let articles = [];
  try {
    const {SANITY_API_PROJECT_ID: projectId, SANITY_API_DATASET: dataset, SANITY_API_READ_TOKEN: token} = process.env;
    if (projectId && dataset && token) {
      const query = '*[_type == "article" && !(_id in path("drafts.**")) && defined(slug.current)] | order(_updatedAt desc){"slug":slug.current,_updatedAt}';
      const endpoint = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
      endpoint.searchParams.set('query', query);
      // Crawlers must never wait for the CMS. The core sitemap remains useful
      // even if Sanity is slow or temporarily unavailable.
      const timeout = new Promise(resolve => setTimeout(() => resolve(null), 1500));
      const result = await Promise.race([
        fetch(endpoint, {headers: {Authorization: `Bearer ${token}`}}),
        timeout
      ]);
      if (result.ok) articles = (await result.json()).result || [];
    }
  } catch (_) {
    // Keep the core sitemap available even when the CMS is temporarily unavailable.
  }
  const urls = [...staticPaths.map(path => ({loc: `${siteUrl}${path}`})), ...articles.map(article => ({loc: `${siteUrl}/articles/${article.slug}`, lastmod: article._updatedAt?.slice(0, 10)}))];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>`;
  response.setHeader('Content-Type', 'application/xml; charset=utf-8');
  response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
  return response.status(200).send(xml);
};
