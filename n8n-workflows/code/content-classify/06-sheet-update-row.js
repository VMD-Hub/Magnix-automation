// n8n Code: ghi 1 dòng content_queue (cột G:O) qua googleApi
// Gán credential googleApi trên node này

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__CONTENT_QUEUE_TAB__';

const item = $input.first().json;
if (!item.ok || !item.sheet_row || !item.update) {
  return [{ json: { ok: false, error: 'SKIP_SHEET_UPDATE', ...item } }];
}

const u = item.update;
const rowValues = [
  String(u.segment ?? ''),
  Number(u.score ?? 0),
  String(u.claude_verdict ?? ''),
  String(u.interest_key ?? ''),
  String(u.status ?? ''),
  String(item.captured_at ?? $('Loop Pending Rows').item?.json?.captured_at ?? ''),
  String(item.source ?? $('Loop Pending Rows').item?.json?.source ?? ''),
  String(u.tags ?? ''),
  String(u.meta ?? ''),
];

const row = item.sheet_row;
const range = `${TAB}!G${row}:O${row}`;

await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
  method: 'PUT',
  url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
  body: { values: [rowValues] },
  json: true,
});

const data = $getWorkflowStaticData('global');
if (!data.a2_stats) data.a2_stats = { sheet_ok: 0, sheet_fail: 0, llm: 0, regex: 0, parse_fail: 0 };
data.a2_stats.sheet_ok += 1;
if (item.classify_method === 'llm') data.a2_stats.llm += 1;
else data.a2_stats.regex += 1;

return [{
  json: {
    ok: true,
    storage: 'sheet_content_queue',
    sheet_row: row,
    normalized_key: item.normalized_key,
    segment: u.segment,
    score: u.score,
    classify_method: item.classify_method || u.classify_method,
  },
}];
