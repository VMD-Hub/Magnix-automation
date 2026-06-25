// n8n Code: Google Sheet upsert tab content_queue (dedupe normalized_key)
// Gán credential googleApi trên node này (cùng Service Account với Fetch project_config)

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__CONTENT_QUEUE_TAB__';

const HEADERS = [
  'normalized_key',
  'post_id',
  'platform',
  'post_url',
  'author_id',
  'text',
  'segment',
  'score',
  'claude_verdict',
  'interest_key',
  'status',
  'captured_at',
  'source',
  'tags',
  'meta',
];

function toRow(record) {
  const tags = Array.isArray(record.tags) ? record.tags.join(',') : String(record.tags ?? '');
  const meta =
    typeof record.meta === 'string' ? record.meta : JSON.stringify(record.meta ?? {}).slice(0, 50000);
  return [
    String(record.normalized_key ?? ''),
    String(record.post_id ?? ''),
    String(record.platform ?? ''),
    String(record.post_url ?? ''),
    String(record.author_id ?? ''),
    String(record.text ?? '').slice(0, 50000),
    String(record.segment ?? 'unclassified'),
    Number(record.score ?? 0),
    String(record.claude_verdict ?? ''),
    String(record.interest_key ?? 'unknown'),
    String(record.status ?? 'raw'),
    String(record.captured_at ?? ''),
    String(record.source ?? 'apify_social_listen'),
    tags,
    meta,
  ];
}

async function sheetRequest(opts) {
  return this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    json: true,
    ...opts,
  });
}

const base = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;
const readRange = `${TAB}!A:O`;

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
      url: `${base}/values/${encodeURIComponent(`${TAB}!A1:O1`)}?valueInputOption=USER_ENTERED`,
      body: { values: [HEADERS] },
    });
  } else {
    const headerRow = rows[0].map((h) => String(h ?? '').trim().toLowerCase());
    const nkIdx = headerRow.indexOf('normalized_key');
    const keyCol = nkIdx >= 0 ? nkIdx : 0;
    for (let i = 1; i < rows.length; i++) {
      const nk = String(rows[i][keyCol] ?? '').trim();
      if (nk) existingByKey.set(nk, i + 1);
    }
    nextAppendRow = rows.length + 1;
  }
} catch (e) {
  throw new Error(
    `Sheet read failed (${TAB}): ${e.message}. Tạo tab trước — xem SHEET_CONTENT_QUEUE_SETUP.md`
  );
}

const results = [];

for (const item of $input.all()) {
  if (!item.json.ok || !item.json.record) {
    results.push({ json: { ok: false, error: 'SKIP_SHEET', message: item.json.error } });
    continue;
  }

  const record = item.json.record;
  const nk = record.normalized_key;
  const rowValues = toRow(record);
  const existingRow = existingByKey.get(nk);

  try {
    if (existingRow) {
      const updateRange = `${TAB}!A${existingRow}:O${existingRow}`;
      await sheetRequest.call(this, {
        method: 'PUT',
        url: `${base}/values/${encodeURIComponent(updateRange)}?valueInputOption=USER_ENTERED`,
        body: { values: [rowValues] },
      });
      results.push({
        json: {
          ok: true,
          storage: 'sheet_content_queue',
          sheet_row: existingRow,
          action: 'update',
          normalized_key: nk,
          record,
        },
      });
    } else {
      await sheetRequest.call(this, {
        method: 'POST',
        url: `${base}/values/${encodeURIComponent(`${TAB}!A:O`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
        body: { values: [rowValues] },
      });
      existingByKey.set(nk, nextAppendRow);
      results.push({
        json: {
          ok: true,
          storage: 'sheet_content_queue',
          sheet_row: nextAppendRow,
          action: 'create',
          normalized_key: nk,
          record,
        },
      });
      nextAppendRow += 1;
    }
  } catch (e) {
    results.push({
      json: { ok: false, error: 'SHEET_WRITE', message: e.message, normalized_key: nk },
    });
  }
}

return results;
