// n8n Code: cập nhật content_drafts sau publish + append content_metrics

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const DRAFTS_TAB = '__CONTENT_DRAFTS_TAB__';
const METRICS_TAB = '__CONTENT_METRICS_TAB__';

const item = $input.first().json;
const row = item.sheet_row;
if (!row) {
  return [{ json: { ok: false, skip: true, reason: 'NO_SHEET_ROW' } }];
}

let existingMeta = {};
try {
  const getRes = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'GET',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${DRAFTS_TAB}!N${row}`)}`,
    json: true,
  });
  const cell = getRes.values?.[0]?.[0];
  if (cell) existingMeta = JSON.parse(cell);
} catch {
  existingMeta = {};
}

const metaPatch = {
  ...existingMeta,
  page_published: item.publish_ok === true,
  published_at: item.published_at || new Date().toISOString(),
  fb_post_id: item.fb_post_id || null,
  fb_permalink: item.fb_permalink || null,
  publish_error: item.publish_error || null,
  publish_agent: 'content-page-publish',
};

const metaStr = JSON.stringify(metaPatch).slice(0, 50000);
const status = item.publish_ok ? 'published' : 'approved';

await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
  method: 'PUT',
  url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${DRAFTS_TAB}!J${row}`)}?valueInputOption=USER_ENTERED`,
  body: { values: [[status]] },
  json: true,
});

await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
  method: 'PUT',
  url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${DRAFTS_TAB}!N${row}`)}?valueInputOption=USER_ENTERED`,
  body: { values: [[metaStr]] },
  json: true,
});

let metricsAppended = false;
if (item.publish_ok && item.fb_post_id) {
  try {
    await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
      method: 'POST',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${METRICS_TAB}!A:F`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      body: {
        values: [[
          String(item.fb_post_id),
          'fb_page',
          String(item.segment || ''),
          String(item.title || '').slice(0, 200),
          new Date().toISOString(),
          'pending',
        ]],
      },
      json: true,
    });
    metricsAppended = true;
  } catch {
    metricsAppended = false;
  }
}

const data = $getWorkflowStaticData('global');
if (!data.cpp_stats) data.cpp_stats = { publish_ok: 0, publish_fail: 0, l0_fail: 0 };
if (item.publish_ok) data.cpp_stats.publish_ok += 1;
else data.cpp_stats.publish_fail += 1;

return [{
  json: {
    ok: item.publish_ok === true,
    sheet_row: row,
    normalized_key: item.normalized_key,
    fb_post_id: item.fb_post_id,
    fb_permalink: item.fb_permalink,
    metrics_appended: metricsAppended,
    publish_error: item.publish_error || null,
  },
}];
