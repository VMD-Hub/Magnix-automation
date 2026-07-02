// n8n Code: lọc content_drafts cần ảnh cover Page

const BATCH = __PAGE_COVER_BATCH_SIZE__;

function parseMeta(raw) {
  if (!raw) return {};
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

const enabled = String($env.CONTENT_PAGE_COVER_ENABLED || '').toLowerCase() === 'true';
if (!enabled) {
  return [{
    json: {
      empty: true,
      message: 'CONTENT_PAGE_COVER_ENABLED không bật — set true trên VPS',
    },
  }];
}

const apiKey = String(
  $env.GEMINI_API_KEY
  || $env.GOOGLE_GEMINI_API_KEY
  || $env.GOOGLE_AI_API_KEY
  || $env.GENERATIVE_LANGUAGE_API_KEY
  || ''
).trim();
if (!apiKey) {
  return [{
    json: {
      empty: true,
      message: 'Thiếu GEMINI_API_KEY — lấy tại https://aistudio.google.com/apikey',
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
  not_ready: 0,
  has_image: 0,
  wrong_format: 0,
  no_prompt: 0,
};

const allowedStatus = new Set(['approved', 'draft']);

for (let i = 1; i < rows.length; i++) {
  const cells = rows[i];
  if (!cells?.some((c) => String(c ?? '').trim())) continue;

  const row = { sheet_row: i + 1 };
  headers.forEach((key, j) => {
    if (key) row[key] = cells[j] ?? '';
  });

  const status = String(row.status || '').trim().toLowerCase();
  const meta = parseMeta(row.meta);

  if (!allowedStatus.has(status)) {
    blockers.not_ready += 1;
    continue;
  }

  const imageUrl = String(meta.publish_image_url || meta.cover_image_url || '').trim();
  if (imageUrl) {
    blockers.has_image += 1;
    continue;
  }

  const channel = String(meta.target_channel || '').trim().toLowerCase();
  const fmt = String(meta.content_format || '').trim().toLowerCase();
  const wantsCover =
    fmt === 'fb_page_post_image'
    || (channel === 'facebook_page' && fmt === 'fb_page_post_image');

  if (!wantsCover) {
    blockers.wrong_format += 1;
    continue;
  }

  const prompt = String(
    meta.publish_image_prompt
    || meta.cover_image_prompt
    || ''
  ).trim();
  const title = String(row.title || '').trim();
  const hook = String(row.hook_line || '').trim();

  if (!prompt && !title && !hook) {
    blockers.no_prompt += 1;
    continue;
  }

  if (status === 'draft' && meta.publish_image_pending !== true && !meta.needs_cover_image) {
    blockers.not_ready += 1;
    continue;
  }

  row.meta_parsed = meta;
  out.push({ json: row });
  if (out.length >= BATCH) break;
}

if (!out.length) {
  return [{
    json: {
      empty: true,
      message: 'Không có bài cần cover — cần fb_page_post_image + thiếu publish_image_url + có prompt/title',
      blockers,
    },
  }];
}

return out;
