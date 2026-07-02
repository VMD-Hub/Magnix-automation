// n8n Code: chuẩn bị HTTP batchUpdate Sheet sau publish

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const DRAFTS_TAB = '__CONTENT_DRAFTS_TAB__';
const METRICS_TAB = '__CONTENT_METRICS_TAB__';

const item = $input.first().json;
const row = item.sheet_row;
if (!row) {
  return [{ json: { ok: false, skip: true, reason: 'NO_SHEET_ROW' } }];
}

const loopRow = $('Loop Page Publish').item?.json || {};
const existingMeta = loopRow.meta_parsed || {};

const metaPatch = {
  ...existingMeta,
  page_published: item.publish_ok === true,
  published_at: item.published_at || new Date().toISOString(),
  fb_post_id: item.fb_post_id || null,
  fb_permalink: item.fb_permalink || null,
  publish_error: item.publish_error || null,
  publish_agent: 'content-page-publish',
  publish_mode: item.publish_mode || null,
  pin_after_publish: item.pin_after_publish === true,
};

const metaStr = JSON.stringify(metaPatch).slice(0, 50000);
const status = item.publish_ok ? 'published' : 'approved';

const out = {
  ...item,
  sheet_row: row,
  sheet_batch_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchUpdate`,
  sheet_batch_body: {
    valueInputOption: 'USER_ENTERED',
    data: [
      { range: `${DRAFTS_TAB}!J${row}`, values: [[status]] },
      { range: `${DRAFTS_TAB}!N${row}`, values: [[metaStr]] },
    ],
  },
  need_metrics_append: item.publish_ok === true && Boolean(item.fb_post_id),
};

if (out.need_metrics_append) {
  out.metrics_append_url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${METRICS_TAB}!A:F`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  out.metrics_append_body = {
    values: [[
      String(item.fb_post_id),
      'fb_page',
      String(item.segment || ''),
      String(item.title || '').slice(0, 200),
      new Date().toISOString(),
      'pending',
    ]],
  };
}

return [{ json: out }];
