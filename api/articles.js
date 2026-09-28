const apiVersion = '2025-02-19';

const articleProjection = `{
  _id,
  title,
  "slug": slug.current,
  category,
  summary,
  seoTitle,
  seoDescription,
  "imageUrl": featuredImage.asset->url,
  "imageAlt": featuredImage.alt,
  publishedAt,
  _updatedAt
}`;

async function querySanity(query, params = {}) {
  const projectId = process.env.SANITY_API_PROJECT_ID;
  const dataset = process.env.SANITY_API_DATASET;
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!projectId || !dataset || !token) throw new Error('CMS is not configured.');

  const endpoint = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  endpoint.searchParams.set('query', query);
  Object.entries(params).forEach(([key, value]) => endpoint.searchParams.set(`$${key}`, JSON.stringify(value)));
  const result = await fetch(endpoint, {headers: {Authorization: `Bearer ${token}`}});
  const payload = await result.json();
  if (!result.ok) throw new Error(payload.error?.description || 'Could not load articles.');
  return payload.result;
}

module.exports = async (request, response) => {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({message: 'Method not allowed.'});
  }

  const slug = String(request.query.slug || '').replace(/[^a-z0-9-]/gi, '');
  try {
    const result = slug
      ? await querySanity(`*[_type == "article" && slug.current == $slug][0] ${articleProjection}`, {slug})
      : await querySanity(`*[_type == "article" && defined(slug.current)] | order(publishedAt desc, _updatedAt desc) ${articleProjection}`);
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return response.status(200).json({article: slug ? result || null : undefined, articles: slug ? undefined : result || []});
  } catch (error) {
    return response.status(502).json({message: error.message || 'Could not load articles.'});
  }
};
