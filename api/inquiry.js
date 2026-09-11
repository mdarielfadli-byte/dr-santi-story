const { createSign } = require('node:crypto');

const spreadsheetId = '1wjfD6aiHc_nK0X5aG4CbsGhVQjEmzVOoYiKC8D3qtJw';
const sheetRange = "'Inquiry'!A:I";

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

async function sendNotification(inquiry) {
  if (!process.env.RESEND_API_KEY) return false;
  const mailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.NOTIFICATION_FROM || 'Dr Santi’s Story <onboarding@resend.dev>',
      to: ['drsantistory@gmail.com'],
      subject: `New website inquiry — ${inquiry.name}`,
      text: [
        `Name: ${inquiry.name}`,
        `Organization: ${inquiry.organization}`,
        `Email: ${inquiry.email}`,
        `WhatsApp: ${inquiry.whatsapp || '-'}`,
        `Interest: ${inquiry.interest}`,
        `Audience details: ${inquiry.message}`
      ].join('\n')
    })
  });
  if (!mailResponse.ok) throw new Error('The email notification could not be sent.');
  return true;
}

module.exports = async (request, response) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ message: 'Method not allowed.' });
  }

  const { name, organization, email, whatsapp = '', interest, message, consent } = request.body || {};
  if (!name || !organization || !email || !interest || !message || consent !== true) {
    return response.status(400).json({ message: 'Please complete the required fields.' });
  }

  const serviceAccount = {
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  };
  if (!serviceAccount.clientEmail || !serviceAccount.privateKey) {
    return response.status(503).json({ message: 'The inquiry form is not connected yet.' });
  }

  try {
    const token = await accessToken(serviceAccount);
    const sheetResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetRange)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          values: [[new Date().toISOString(), name.trim(), organization.trim(), email.trim(), whatsapp.trim(), interest.trim(), message.trim(), 'Yes', 'Website — Contact']]
        })
      }
    );
    if (!sheetResponse.ok) throw new Error('Could not save the inquiry.');
    let emailed = false;
    try {
      emailed = await sendNotification({ name, organization, email, whatsapp, interest, message });
    } catch (error) {
      // Keep the successfully saved inquiry; a notification can be retried without asking the visitor to submit twice.
      console.error('Inquiry email notification failed:', error.message);
    }
    return response.status(200).json({ ok: true, emailed });
  } catch (error) {
    return response.status(502).json({ message: error.message || 'Could not save the inquiry.' });
  }
};
