// n8n Code: chuẩn bị POST mark Postgres sau Graph publish (P4.3)

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const METRICS_TAB = '__CONTENT_METRICS_TAB__';

const item = $input.first().json;
const loopRow = $('Loop Page Publish').item?.json || {};
const draftId = item.id || item.draft_id || loopRow.id || loopRow.draft_id;

if (!draftId) {
  return [{ json: { ok: false, skip: true, reason: 'NO_DRAFT_ID' } }];
}

const base = String(
  $env.HOUSEX_PUBLIC_URL || $env.NEXT_PUBLIC_SITE_URL || 'https://timnhaxahoi.com',
).replace(/\/$/, '');

const out = {
  ...item,
  id: draftId,
  draft_id: draftId,
  normalized_key: item.normalized_key || loopRow.normalized_key || null,
  segment: item.segment || loopRow.segment || null,
  title: item.title || loopRow.title || null,
  housex_mark_url: `${base}/api/cron/content-page-publish-due`,
  housex_mark_body: {
    id: draftId,
    publish_ok: item.publish_ok === true,
    fb_post_id: item.fb_post_id || null,
    fb_permalink: item.fb_permalink || null,
    publish_error: item.publish_error || null,
    publish_mode: item.publish_mode || null,
    pin_after_publish: item.pin_after_publish === true,
  },
  housex_mark_headers: {
    Authorization: `Bearer ${String($env.CRON_SECRET || '').trim()}`,
    'Content-Type': 'application/json',
  },
  need_metrics_append: item.publish_ok === true && Boolean(item.fb_post_id),
};

if (out.need_metrics_append) {
  out.metrics_append_url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${METRICS_TAB}!A:F`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  out.metrics_append_body = {
    values: [[
      String(item.fb_post_id),
      'fb_page',
      String(out.segment || ''),
      String(out.title || '').slice(0, 200),
      new Date().toISOString(),
      'pending',
    ]],
  };
}

return [{ json: out }];
