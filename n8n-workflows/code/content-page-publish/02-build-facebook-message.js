// n8n Code: ghép message Facebook Page từ draft (L0 cơ bản)

const FORBIDDEN = [
  /cam kết.*duyệt/i,
  /lãi suất\s*\d+([.,]\d+)?\s*%/i,
  /đảm bảo.*(vay|duyệt)/i,
  /100%\s*(thành công|duyệt)/i,
];

function stripMarkdownHeavy(md) {
  return String(md || '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\|[-:\s|]+\|/g, '')
    .replace(/\|/g, ' ')
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function excerpt(text, max = 6000) {
  const t = String(text || '').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

const row = $('Loop Page Publish').item?.json || $input.first().json;
const meta = row.meta_parsed || {};

const hook = String(row.hook_line || meta.hook || '').trim();
const bodyRaw = String(meta.publish_body || row.artifact_markdown || '').trim();
const body = excerpt(stripMarkdownHeavy(bodyRaw), 5500);
const cta = String(row.cta_opt_in || meta.cta || '').trim();
const disclaimer = String(row.disclaimer || meta.disclaimer || '').trim();
const hashtags = Array.isArray(meta.hashtags)
  ? meta.hashtags.map(String).join(' ')
  : String(meta.hashtags || '#NOXH #nhàởxãhội').trim();

const parts = [];
if (hook) parts.push(hook);
if (body) parts.push(body);
if (cta) parts.push(cta);
if (disclaimer) parts.push(disclaimer);
if (hashtags) parts.push(hashtags);

const message = parts.join('\n\n').trim().slice(0, 63000);

const hits = FORBIDDEN.filter((re) => re.test(message)).map((re) => re.source);
const draftId = row.id || row.draft_id || null;

if (hits.length) {
  return [{
    json: {
      ok: false,
      error: 'L0_FORBIDDEN',
      l0_hits: hits,
      id: draftId,
      draft_id: draftId,
      normalized_key: row.normalized_key,
    },
  }];
}

const link = String(meta.publish_link || meta.link || meta.drive_pack_url || '').trim();
const imageUrl = String(meta.publish_image_url || meta.cover_image_url || '').trim();
const pinAfter = meta.pin_after_publish === true;

return [{
  json: {
    ok: true,
    id: draftId,
    draft_id: draftId,
    normalized_key: row.normalized_key,
    segment: row.segment,
    title: String(row.title || '').slice(0, 200),
    message,
    link: link || null,
    publish_image_url: imageUrl || null,
    pin_after_publish: pinAfter,
    page_id: row.page_id || $env.META_PAGE_ID,
    product_type: row.product_type || meta.product_type || 'fb_page_post',
  },
}];
