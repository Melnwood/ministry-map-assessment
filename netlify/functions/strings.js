// Translations -> Airtable. GET returns one language, POST saves one string.
//
// The English in index.html stays the source of truth. A row here is an
// override for one key in one language, and a missing row falls back to
// English — which is what lets a language go live at 60% and simply get
// better, instead of waiting to be perfect.
//
// A plural key stores a JSON object keyed by CLDR category ({one, few,
// many, other}) in the same text cell. The app hands tn() whatever shape it
// finds, so nothing downstream needs to know which kind it is.
const { refuse } = require('./lib/guard');

const BASE  = process.env.AIRTABLE_BASE_ID;
const TABLE = process.env.AIRTABLE_STRINGS_TABLE || 'Translations';
const KEY   = process.env.AIRTABLE_API_KEY;

const url = (p = '') => `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}${p}`;
const H = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

// Airtable pages at 100 records and there are 422 keys per language, so a
// single page would silently return a partial translation — which would look
// exactly like an unfinished one. Follow the cursor to the end.
const allRecords = async (query) => {
  const rows = [];
  let offset;
  do {
    const r = await fetch(url(`?pageSize=100${query}${offset ? `&offset=${offset}` : ''}`), { headers: H });
    const d = await r.json();
    if (!r.ok) { const e = new Error('airtable'); e.status = r.status; e.body = d; throw e; }
    rows.push(...(d.records || []));
    offset = d.offset;
  } while (offset);
  return rows;
};

// A plural set arrives as JSON; a plain string does not. Anything that fails
// to parse is treated as a plain string rather than dropped.
const value = (text) => {
  if (typeof text !== 'string') return '';
  const s = text.trim();
  if (s.startsWith('{') && s.endsWith('}')) {
    try { const o = JSON.parse(s); if (o && typeof o === 'object') return o; } catch { /* plain text */ }
  }
  return text;
};

const esc = (s) => String(s).replace(/'/g, "\\'");

exports.handler = async (event) => {
  const no = refuse(event);
  if (no) return no;

  if (!BASE || !KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Airtable env vars not set' }) };
  }

  try {
    // GET ?lang=cs -> { "today.where": "...", "notes.open": {one,few,other} }
    // GET with no lang -> { counts: { cs: 41, sk: 0, ... } } for the picker.
    if (event.httpMethod === 'GET') {
      const lang = (event.queryStringParameters || {}).lang;

      if (!lang) {
        const rows = await allRecords('&fields%5B%5D=Lang');
        const counts = {};
        rows.forEach(r => { const l = (r.fields || {}).Lang; if (l) counts[l] = (counts[l] || 0) + 1; });
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ counts }) };
      }

      const rows = await allRecords(`&filterByFormula=${encodeURIComponent(`{Lang}='${esc(lang)}'`)}`);
      const strings = {}, english = {};
      rows.forEach(r => {
        const f = r.fields || {};
        if (!f.Key) return;
        // An empty cell is "not translated yet", not "translate to nothing".
        // Sending it would blank the string instead of falling back.
        if (f.Text === undefined || String(f.Text).trim() === '') return;
        strings[f.Key] = value(f.Text);
        if (f.English) english[f.Key] = f.English;
      });
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ lang, strings, english }) };
    }

    // POST { lang, key, text, english, who } — one string at a time, because
    // that is how somebody actually translates: a box at a time, saved as
    // they go, with nothing to lose if they close the tab.
    if (event.httpMethod === 'POST') {
      const n = JSON.parse(event.body || '{}');
      if (!n.lang || !n.key) {
        return { statusCode: 400, body: JSON.stringify({ error: 'lang and key are required' }) };
      }
      const ref = `${n.lang}:${n.key}`;
      const text = typeof n.text === 'object' && n.text !== null
        ? JSON.stringify(n.text) : (n.text == null ? '' : String(n.text));

      const fields = {
        Ref: ref, Lang: n.lang, Key: n.key, Text: text,
        English: n.english == null ? '' : String(n.english),
        Who: n.who || 'Unknown',
        UpdatedAt: new Date().toISOString()
      };

      // Match on Ref so a second edit updates the row rather than adding a
      // rival one. Two rows for the same key would make the winner depend on
      // page order, which is not a thing anyone could debug from the app.
      const found = await allRecords(`&maxRecords=1&filterByFormula=${encodeURIComponent(`{Ref}='${esc(ref)}'`)}`);
      const rec = found[0];

      const r = rec
        ? await fetch(url(`/${rec.id}`), { method: 'PATCH', headers: H, body: JSON.stringify({ fields }) })
        : await fetch(url(), { method: 'POST', headers: H, body: JSON.stringify({ fields }) });
      const d = await r.json();
      if (!r.ok) return { statusCode: r.status, body: JSON.stringify(d) };
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ ok: true, ref }) };
    }

    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (e) {
    if (e.status) return { statusCode: e.status, body: JSON.stringify(e.body) };
    return { statusCode: 500, body: JSON.stringify({ error: String(e && e.message || e) }) };
  }
};
