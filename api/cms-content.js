const apiVersion = '2025-02-19';

module.exports = async (request, response) => {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({message: 'Method not allowed.'});
  }

  const page = String(request.query.page || '').replace(/[^a-z0-9-]/gi, '');
  if (!page) return response.status(400).json({message: 'A page ID is required.'});

  const query = '*[_type == "pageCopy" && pageId == $page][0]{seoDescription, fields[]{key, value}}';
  const endpoint = `https://${process.env.SANITY_API_PROJECT_ID}.api.sanity.io/v${apiVersion}/data/query/${process.env.SANITY_API_DATASET}?query=${encodeURIComponent(query)}&$page=${encodeURIComponent(JSON.stringify(page))}`;

  try {
    const result = await fetch(endpoint, {
      headers: {Authorization: `Bearer ${process.env.SANITY_API_READ_TOKEN}`}
    });
    const payload = await result.json();
    if (!result.ok) throw new Error(payload.error?.description || 'Could not load CMS content.');
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return response.status(200).json({page: payload.result || null});
  } catch (error) {
    return response.status(502).json({message: error.message || 'Could not load CMS content.'});
  }
};
