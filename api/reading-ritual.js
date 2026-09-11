const { createSign } = require('node:crypto');

const spreadsheetId = '1wjfD6aiHc_nK0X5aG4CbsGhVQjEmzVOoYiKC8D3qtJw';
const sheetRange = "'7 Days Reading'!A:F";

const base64url = (value) => Buffer.from(value).toString('base64url');

function createAssertion(serviceAccount) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: serviceAccount.clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: issuedAt,
    exp: issuedAt + 3600
  }));
  const unsignedToken = `${header}.${payload}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  return `${unsignedToken}.${signer.sign(serviceAccount.privateKey, 'base64url')}`;
}

async function accessToken(serviceAccount) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: createAssertion(serviceAccount)
    })
  });
  if (!response.ok) throw new Error('Google authentication failed.');
  return (await response.json()).access_token;
}

module.exports = async (request, response) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ message: 'Method not allowed.' });
  }

  const { name, email, whatsapp, consent } = request.body || {};
  if (!name || !email || !whatsapp || consent !== true) {
    return response.status(400).json({ message: 'Please complete the required fields.' });
  }

  const serviceAccount = {
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  };
  if (!serviceAccount.clientEmail || !serviceAccount.privateKey) {
    return response.status(503).json({ message: 'The form is not connected yet.' });
  }

  try {
    const token = await accessToken(serviceAccount);
    const googleResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetRange)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          values: [[new Date().toISOString(), name.trim(), email.trim(), whatsapp.trim(), 'Yes', 'Fantasia — 7 Days Reading Ritual']]
        })
      }
    );
    if (!googleResponse.ok) throw new Error('Could not save the submission.');
    return response.status(200).json({ ok: true });
  } catch (error) {
    return response.status(502).json({ message: error.message || 'Could not save the submission.' });
  }
};
