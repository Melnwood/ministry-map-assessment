// Workbench notes -> Airtable. GET list, POST upsert, DELETE remove.
// Screenshots are stored as base64 in a long-text field: simple, no file
// hosting, and they never leave the base. Airtable caps a cell at 100k
// characters, so oversized shots are dropped with a marker rather than
// silently corrupting the record.
const BASE  = process.env.AIRTABLE_BASE_ID;
const TABLE = process.env.AIRTABLE_NOTES_TABLE || 'Workbench';
const KEY   = process.env.AIRTABLE_API_KEY;
const CELL_MAX = 95000;

const url = (p = '') => `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}${p}`;
const H = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

const out = (rec) => {
  const f = rec.fields || {};
  let shots = [];
  try { shots = f.Shots ? JSON.parse(f.Shots) : []; } catch { shots = []; }
  return {
    rec: rec.id,
    id: Number(f.LocalId) || Date.parse(f.LoggedAt) || Date.now(),
    text: f.Note || '', area: f.Screen || '', kind: f.Kind || 'idea',
    state: f.State || 'open', at: f.LoggedAt || new Date().toISOString(),
    reply: f.ClaudeRead || null, shots
  };
};

exports.handler = async (event) => {
  if (!BASE || !KEY) return { statusCode: 500, body: JSON.stringify({ error: 'Airtable env vars not set' }) };

  try {
    if (event.httpMethod === 'GET') {
      const r = await fetch(url('?pageSize=100&sort%5B0%5D%5Bfield%5D=LoggedAt&sort%5B0%5D%5Bdirection%5D=desc'), { headers: H });
      const d = await r.json();
      if (!r.ok) return { statusCode: r.status, body: JSON.stringify(d) };
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify((d.records || []).map(out)) };
    }

    if (event.httpMethod === 'POST') {
      const n = JSON.parse(event.body || '{}');
      let shotsJson = JSON.stringify(n.shots || []);
      if (shotsJson.length > CELL_MAX) {
        shotsJson = JSON.stringify((n.shots || []).map(s => ({ name: s.name, data: null, tooBig: true })));
      }
      const fields = {
        LocalId: String(n.id), Note: n.text || '', Screen: n.area || '',
        Kind: n.kind || 'idea', State: n.state || 'open',
        LoggedAt: n.at || new Date().toISOString(),
        ClaudeRead: n.reply || '', Shots: shotsJson
      };
      const has = n.rec;
      const r = await fetch(has ? url('/' + n.rec) : url(), {
        method: has ? 'PATCH' : 'POST', headers: H, body: JSON.stringify({ fields })
      });
      const d = await r.json();
      if (!r.ok) return { statusCode: r.status, body: JSON.stringify(d) };
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(out(d)) };
    }

    if (event.httpMethod === 'DELETE') {
      const id = (event.queryStringParameters || {}).id;
      if (!id || !id.startsWith('rec')) return { statusCode: 400, body: JSON.stringify({ error: 'Need an Airtable record id' }) };
      const r = await fetch(url('/' + id), { method: 'DELETE', headers: H });
      return { statusCode: r.status, body: await r.text() };
    }

    return { statusCode: 405, body: 'Method not allowed' };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: String(err.message || err) }) };
  }
};
