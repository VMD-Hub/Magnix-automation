// n8n Code: Google Sheet upsert tab content_scorecard (dedupe post_id)
// Gán credential googleApi trên node này.

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__CONTENT_SCORECARD_TAB__';

const HEADERS = [
  'post_id',
  'platform',
  'segment',
  'performance_score',
  'ivi_pct',
  'verdict',
  'primary_retention_metric',
  'primary_retention_tier',
  'ivi_tier',
  'next_action',
  'recommendations',
  'scorecard_json',
  'analyzed_at',
  'status',
];

function toRow(item) {
  const scorecard = item.scorecard || {};
  return [
    String(item.post_id || ''),
    String(item.platform || ''),
    String(item.segment || ''),
    Number(scorecard.performance_score ?? 0),
    Number(scorecard.ivi_pct ?? 0),
    String(scorecard.verdict || item.verdict || ''),
    String(scorecard.primary_retention_metric || ''),
    String(scorecard.primary_retention_tier || ''),
    String(scorecard.ivi_tier || ''),
    String(item.next_action || scorecard.next_action || scorecard.verdict || ''),
    JSON.stringify(scorecard.recommendations || []),
    JSON.stringify(scorecard).slice(0, 50000),
    String(scorecard.analyzed_at || new Date().toISOString()),
    item.ok === false ? 'failed' : 'analyzed',
  ];
}

async function sheetRequest(opts) {
  return this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    json: true,
    ...opts,
  });
}

const base = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;
const readRange = `${TAB}!A:N`;

let existingByPostId = new Map();
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
      url: `${base}/values/${encodeURIComponent(`${TAB}!A1:N1`)}?valueInputOption=USER_ENTERED`,
      body: { values: [HEADERS] },
    });
  } else {
    const headerRow = rows[0].map((h) => String(h ?? '').trim().toLowerCase());
    const postIdx = headerRow.indexOf('post_id');
    const keyCol = postIdx >= 0 ? postIdx : 0;
    for (let i = 1; i < rows.length; i += 1) {
      const postId = String(rows[i][keyCol] ?? '').trim();
      if (postId) existingByPostId.set(postId, i + 1);
    }
    nextAppendRow = rows.length + 1;
  }
} catch (e) {
  throw new Error(`Sheet read failed (${TAB}): ${e.message}. Tạo tab trước — xem CONTENT_SCORECARD_SETUP.md`);
}

const results = [];

for (const item of $input.all()) {
  const row = item.json;
  if (!row.post_id) {
    results.push({ json: { ok: false, error: 'MISSING_POST_ID', message: 'Cannot upsert scorecard without post_id' } });
    continue;
  }

  const postId = String(row.post_id);
  const rowValues = toRow(row);
  const existingRow = existingByPostId.get(postId);

  try {
    if (existingRow) {
      await sheetRequest.call(this, {
        method: 'PUT',
        url: `${base}/values/${encodeURIComponent(`${TAB}!A${existingRow}:N${existingRow}`)}?valueInputOption=USER_ENTERED`,
        body: { values: [rowValues] },
      });
      results.push({ json: { ...row, ok: true, storage: 'sheet_content_scorecard', sheet_row: existingRow, action: 'update' } });
    } else {
      await sheetRequest.call(this, {
        method: 'POST',
        url: `${base}/values/${encodeURIComponent(`${TAB}!A:N`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
        body: { values: [rowValues] },
      });
      existingByPostId.set(postId, nextAppendRow);
      results.push({ json: { ...row, ok: true, storage: 'sheet_content_scorecard', sheet_row: nextAppendRow, action: 'create' } });
      nextAppendRow += 1;
    }
  } catch (e) {
    results.push({ json: { ...row, ok: false, error: 'SHEET_UPSERT_FAILED', message: e.message } });
  }
}

return results;

