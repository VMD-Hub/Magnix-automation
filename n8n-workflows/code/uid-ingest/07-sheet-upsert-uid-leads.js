// n8n Code: Google Sheet upsert tab uid_leads (dedupe normalized_key)
// Gán credential googleApi trên node này.

const SHEET_ID = $env.GOOGLE_SHEET_DATABASE_ID || '__GOOGLE_SHEET_ID__';
const TAB = $env.GOOGLE_SHEET_UID_TAB || '__UID_LEADS_TAB__';

const HEADERS = [
  'uid',
  'uid_source',
  'normalized_key',
  'captured_at',
  'text',
  'segment',
  'score',
  'interest_key',
  'tags',
  'meta',
  'classify_method',
  'consent_basis',
  'status',
];

function toRow(record) {
  return [
    String(record.uid ?? ''),
    String(record.uid_source ?? ''),
    String(record.normalized_key ?? ''),
    String(record.captured_at ?? ''),
    String(record.text ?? '').slice(0, 50000),
    String(record.segment ?? 'unclassified'),
    Number(record.score ?? 0),
    String(record.interest_key ?? ''),
    Array.isArray(record.tags) ? record.tags.join(',') : String(record.tags ?? ''),
    (typeof record.meta === 'string' ? record.meta : JSON.stringify(record.meta ?? {})).slice(0, 50000),
    String(record.classify_method ?? ''),
    String(record.consent_basis ?? ''),
    String(record.status ?? 'raw'),
  ];
}

async function sheetRequest(opts) {
  return this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    json: true,
    ...opts,
  });
}

const base = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;
const readRange = `${TAB}!A:M`;

let existingByKey = new Map();
let nextAppendRow = 2;

try {
  const getRes = await sheetRequest.call(this, {
    method: 'GET',
    url: `${base}/values/${encodeURIComponent(readRange)}`,
  });
  const rows = getRes.values || [];

  if (!rows.length) {
    await sheetRequest.call(this, {
      method: 'PUT',
      url: `${base}/values/${encodeURIComponent(`${TAB}!A1:M1`)}?valueInputOption=USER_ENTERED`,
      body: { values: [HEADERS] },
    });
  } else {
    const headerRow = rows[0].map((h) => String(h ?? '').trim().toLowerCase());
    const nkIdx = headerRow.indexOf('normalized_key');
    const keyCol = nkIdx >= 0 ? nkIdx : 2;
    for (let i = 1; i < rows.length; i += 1) {
      const nk = String(rows[i][keyCol] ?? '').trim();
      if (nk) existingByKey.set(nk, i + 1);
    }
    nextAppendRow = rows.length + 1;
  }
} catch (e) {
  throw new Error(`Sheet read failed (${TAB}): ${e.message}. Tạo tab uid_leads theo ARCHITECTURE_MAGNIX.md §3.1`);
}

const results = [];

for (const item of $input.all()) {
  if (!item.json.ok || !item.json.record) {
    results.push({ json: { ok: false, error: 'SKIP_SHEET', message: item.json.error || item.json.message } });
    continue;
  }

  const record = item.json.record;
  const nk = String(record.normalized_key || '').trim();
  if (!nk) {
    results.push({ json: { ok: false, error: 'MISSING_NORMALIZED_KEY', record } });
    continue;
  }

  const rowValues = toRow(record);
  const existingRow = existingByKey.get(nk);

  try {
    if (existingRow) {
      await sheetRequest.call(this, {
        method: 'PUT',
        url: `${base}/values/${encodeURIComponent(`${TAB}!A${existingRow}:M${existingRow}`)}?valueInputOption=USER_ENTERED`,
        body: { values: [rowValues] },
      });
      results.push({ json: { ok: true, storage: 'sheet_uid_leads', sheet_row: existingRow, action: 'update', normalized_key: nk, record } });
    } else {
      await sheetRequest.call(this, {
        method: 'POST',
        url: `${base}/values/${encodeURIComponent(`${TAB}!A:M`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
        body: { values: [rowValues] },
      });
      existingByKey.set(nk, nextAppendRow);
      results.push({ json: { ok: true, storage: 'sheet_uid_leads', sheet_row: nextAppendRow, action: 'create', normalized_key: nk, record } });
      nextAppendRow += 1;
    }
  } catch (e) {
    results.push({ json: { ok: false, error: 'SHEET_UPSERT_FAILED', message: e.message, normalized_key: nk, record } });
  }
}

return results;

