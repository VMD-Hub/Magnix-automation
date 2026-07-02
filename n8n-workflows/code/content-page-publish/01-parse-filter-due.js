// n8n Code: lọc content_drafts → candidate đăng Facebook Page

const BATCH = __PAGE_PUBLISH_BATCH_SIZE__;
const TZ_OFFSET_MIN = 7 * 60; // Asia/Ho_Chi_Minh fallback khi parse scheduled_at không có offset

function parseMeta(raw) {
  if (!raw) return {};
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

function parseScheduledMs(value) {
  const s = String(value || '').trim();
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.getTime();
}

function nowMs() {
  return Date.now();
}

const enabled = String($env.CONTENT_PAGE_PUBLISH_ENABLED || '').toLowerCase() === 'true';
if (!enabled) {
  return [{
    json: {
      empty: true,
      message: 'CONTENT_PAGE_PUBLISH_ENABLED không bật — set true trên VPS',
    },
  }];
}

const pageId = String($env.META_PAGE_ID || '').trim();
const token = String($env.META_PAGE_ACCESS_TOKEN || '').trim();
if (!pageId || !token) {
  return [{
    json: {
      empty: true,
      message: 'Thiếu META_PAGE_ID hoặc META_PAGE_ACCESS_TOKEN',
    },
  }];
}

const res = $input.first().json;
const rows = Array.isArray(res.values) ? res.values : [];
if (rows.length < 2) {
  return [{ json: { empty: true, message: 'content_drafts trống' } }];
}

const headers = rows[0].map((x) => String(x ?? '').trim().toLowerCase());
const out = [];
const blockers = {
  not_approved: 0,
  already_published: 0,
  wrong_channel: 0,
  wrong_format: 0,
  not_due: 0,
  empty_body: 0,
};

for (let i = 1; i < rows.length; i++) {
  const cells = rows[i];
  if (!cells?.some((c) => String(c ?? '').trim())) continue;

  const row = { sheet_row: i + 1 };
  headers.forEach((key, j) => {
    if (key) row[key] = cells[j] ?? '';
  });

  const status = String(row.status || '').trim().toLowerCase();
  const meta = parseMeta(row.meta);

  if (status !== 'approved') {
    blockers.not_approved += 1;
    continue;
  }
  if (meta.page_published === true || meta.fb_post_id) {
    blockers.already_published += 1;
    continue;
  }

  const channel = String(meta.target_channel || '').trim().toLowerCase();
  const productType = String(row.product_type || '').trim().toLowerCase();
  const wantsPage =
    channel === 'facebook_page'
    || channel === 'fb_page'
    || productType === 'fb_page_post'
    || meta.schedule_page_publish === true;

  if (!wantsPage) {
    blockers.wrong_channel += 1;
    continue;
  }

  const fmt = String(meta.content_format || meta.product_type || 'fb_page_post').trim().toLowerCase();
  const pagePublishFormats = new Set(['fb_page_post', 'fb_page_post_image']);
  if (!pagePublishFormats.has(fmt)) {
    blockers.wrong_format += 1;
    continue;
  }

  const scheduledMs = parseScheduledMs(meta.scheduled_at);
  if (scheduledMs != null && scheduledMs > nowMs()) {
    blockers.not_due += 1;
    continue;
  }

  const body =
    String(meta.publish_body || '').trim()
    || String(row.artifact_markdown || '').trim()
    || String(row.hook_line || '').trim();

  if (body.length < 40) {
    blockers.empty_body += 1;
    continue;
  }

  row.meta_parsed = meta;
  row.page_id = pageId;
  out.push({ json: row });
  if (out.length >= BATCH) break;
}

if (!out.length) {
  return [{
    json: {
      empty: true,
      message: 'Không có bài Page due — cần status=approved, meta.target_channel=facebook_page, scheduled_at<=now',
      blockers,
    },
  }];
}

return out;
