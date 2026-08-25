// Proxies model calls so ANTHROPIC_API_KEY never reaches the browser.
// Everything the coach and the workbench send passes through here.
const MODEL = 'claude-sonnet-4-6';
const MAX_BODY = 6 * 1024 * 1024;          // screenshots are base64; cap the payload

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  if ((event.body || '').length > MAX_BODY) return { statusCode: 413, body: 'Payload too large' };

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { statusCode: 500, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }) };

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'Bad JSON' }) }; }

  // Pin the model server-side. The browser chooses nothing that costs money.
  const payload = {
    model: MODEL,
    max_tokens: Math.min(body.max_tokens || 1000, 2000),
    system: body.system,
    messages: body.messages
  };

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload)
    });
    const text = await r.text();
    return { statusCode: r.status, headers: { 'Content-Type': 'application/json' }, body: text };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: String(err.message || err) }) };
  }
};
