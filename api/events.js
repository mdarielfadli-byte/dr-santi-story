const apiVersion = '2025-02-19';

const eventProjection = `{
  _id,
  title,
  "slug": slug.current,
  status,
  eventDate,
  location,
  summary,
  details,
  ctaLabel,
  ctaUrl,
  "imageUrl": featuredImage.asset->url,
  "imageAlt": featuredImage.alt,
  _updatedAt
}`;

async function querySanity(query, params = {}) {
  const {SANITY_API_PROJECT_ID: projectId, SANITY_API_DATASET: dataset, SANITY_API_READ_TOKEN: token} = process.env;
  if (!projectId || !dataset || !token) throw new Error('CMS is not configured.');

  const endpoint = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  endpoint.searchParams.set('query', query);
  Object.entries(params).forEach(([key, value]) => endpoint.searchParams.set(`$${key}`, JSON.stringify(value)));
  const result = await fetch(endpoint, {headers: {Authorization: `Bearer ${token}`}});
  const payload = await result.json();
  if (!result.ok) throw new Error(payload.error?.description || 'Could not load events.');
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
      ? await querySanity(`*[_type == "event" && slug.current == $slug && status != "Draft"][0] ${eventProjection}`, {slug})
      : await querySanity(`*[_type == "event" && defined(slug.current) && status != "Draft"] | order(eventDate desc, _updatedAt desc) ${eventProjection}`);
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return response.status(200).json({event: slug ? result || null : undefined, events: slug ? undefined : result || []});
  } catch (error) {
    return response.status(502).json({message: error.message || 'Could not load events.'});
  }
};
