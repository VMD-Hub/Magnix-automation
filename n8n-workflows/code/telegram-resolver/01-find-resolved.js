// n8n Code: read unresolved events + check approval tabs → rows to mark resolved

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB_EVENTS = '__NOTIFICATION_EVENTS_TAB__';
const TAB_VIDEO = '__VIDEO_DRAFTS_TAB__';
const TAB_DRAFTS = '__CONTENT_DRAFTS_TAB__';
const TAB_OUTREACH = '__OUTREACH_QUEUE_TAB__';

let res;
try {
  res = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'GET',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB_EVENTS}!A:L`)}`,
    json: true,
  });
} catch (e) {
  return [{
    json: {
      ok: false,
      empty: true,
      error: 'SHEET_READ_FAIL',
      message: e.message || String(e),
      hint: 'Gán googleApi credential + tạo tab notification_events',
    },
  }];
}

const rows = res.values || [];
if (rows.length < 2) {
  return [{ json: { ok: true, empty: true, resolved: 0 } }];
}

async function fetchCol(tab, col) {
  const r = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'GET',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${tab}!${col}:${col}`)}`,
    json: true,
  });
  return (r.values || []).map((v) => String(v[0] || '').trim().toLowerCase());
}

const videoStatus = await fetchCol.call(this, TAB_VIDEO, 'Q');
const draftStatus = await fetchCol.call(this, TAB_DRAFTS, 'J');
const outreachStatus = await fetchCol.call(this, TAB_OUTREACH, 'I');
const outreachL3 = await fetchCol.call(this, TAB_OUTREACH, 'J');

function checkResolved(targetTab, sheetRow, eventType) {
  const idx = Number(sheetRow) - 1;
  if (!Number.isFinite(idx) || idx < 0) return false;

  if (targetTab === TAB_VIDEO) {
    const status = videoStatus[idx] || '';
    if (eventType === 'render_review_needed') {
      return ['published', 'rejected'].includes(status);
    }
    return ['approved', 'rejected', 'ready_for_review', 'published'].includes(status);
  }

  if (targetTab === TAB_DRAFTS) {
    const status = draftStatus[idx] || '';
    return ['approved', 'rejected', 'published'].includes(status);
  }

  if (targetTab === TAB_OUTREACH) {
    const status = outreachStatus[idx] || '';
    const l3 = outreachL3[idx] || '';
    return status === 'approved' || l3 === 'true';
  }

  return false;
}

function normalizeTab(name) {
  const n = String(name || '').trim().toLowerCase();
  if (n === TAB_VIDEO.toLowerCase() || n === 'video_drafts') return TAB_VIDEO;
  if (n === TAB_DRAFTS.toLowerCase() || n === 'content_drafts') return TAB_DRAFTS;
  if (n === TAB_OUTREACH.toLowerCase() || n === 'outreach_queue') return TAB_OUTREACH;
  return '';
}

const now = new Date().toISOString();
const updates = [];

for (let i = 1; i < rows.length; i += 1) {
  const r = rows[i];
  const event_id = String(r[0] || '').trim();
  const event_type = String(r[1] || '').trim();
  const target_tab = normalizeTab(r[4]);
  const status = String(r[5] || '').trim().toLowerCase();
  const resolved_at = String(r[10] || '').trim();
  const metaRaw = String(r[11] || '{}');

  if (!event_id || resolved_at) continue;
  if (!['sent', 'reminded', 'pending'].includes(status)) continue;

  let meta = {};
  try {
    meta = JSON.parse(metaRaw);
  } catch {
    meta = {};
  }

  const sheet_row = Number(meta.sheet_row || 0);
  if (!target_tab || !sheet_row) continue;
  if (!checkResolved(target_tab, sheet_row, event_type)) continue;

  updates.push({
    json: {
      event_id,
      event_sheet_row: i + 1,
      resolved_at: now,
      target_tab,
      source_sheet_row: sheet_row,
    },
  });
}

if (!updates.length) {
  return [{ json: { ok: true, empty: true, resolved: 0 } }];
}

return updates;
