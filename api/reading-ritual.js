const formEndpoint = 'https://script.google.com/macros/s/AKfycbwM1jcexrk26zXtcjGR-8CeXIj5547ZZV4MQ8ddVqbg5xodKj-Ce0orAlAWNKWKdSpt/exec';

module.exports = async (request, response) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ message: 'Method not allowed.' });
  }

  const { name, email, whatsapp = '', consent } = request.body || {};
  if (!name || !email || consent !== true) {
    return response.status(400).json({ message: 'Please complete the required fields.' });
  }

  try {
    const endpointResponse = await fetch(formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type: 'ritual', name, email, whatsapp, consent })
    });
    const result = await endpointResponse.json();
    if (!endpointResponse.ok || !result.ok) throw new Error(result.message || 'Could not save the submission.');
    return response.status(200).json({ ok: true });
  } catch (error) {
    return response.status(502).json({ message: error.message || 'Could not save the submission.' });
  }
};
