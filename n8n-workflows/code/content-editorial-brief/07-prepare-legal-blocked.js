// n8n Code: prepare persistence for a Layer B legal-gate failure.

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__CONTENT_QUEUE_TAB__';
const item = $input.first().json || {};
const row = Number(item.sheet_row || 0);

if (item.legal_gate?.pass !== false || !row) {
  return [{ json: { ok: false, skip: true, reason: 'NOT_A_LEGAL_BLOCK' } }];
}

return [{
  json: {
    ok: true,
    sheet_row: row,
    normalized_key: String(item.normalized_key || ''),
    segment: String(item.segment || ''),
    title: String(item.meta_parsed?.editorial_title || item.text || 'Legal source needed')
      .replace(/\s+/g, ' ')
      .slice(0, 120),
    existing_meta: item.meta_parsed || {},
    legal_retrieval_pack: item.legal_retrieval_pack || null,
    legal_gate: item.legal_gate,
    get_meta_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!O${row}`)}`,
    put_meta_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!O${row}`)}?valueInputOption=USER_ENTERED`,
  },
}];
