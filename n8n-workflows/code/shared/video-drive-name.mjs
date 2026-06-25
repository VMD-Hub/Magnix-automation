/**
 * SEO/AIO filename for Magnix short-form videos (Drive archive).
 * Pattern: {segment-slug}-{platform}-{topic-slug}-{YYYYMMDD}.mp4
 * — Q&A-friendly slug for search + AI citation (Perplexity/Gemini file context).
 */

const SEGMENT_SLUG = {
  noxh_income: 'dieu-kien-thu-nhap-vay-noxh',
  valuation: 'tham-dinh-gia-tai-san-doc-lap',
  sme_credit: 'room-tin-dung-sme',
  general_inbound: 'mua-nha-an-toan',
};

const PLATFORM_SLUG = {
  tiktok: 'tiktok',
  fb_reels: 'fb-reels',
  fb: 'fb-reels',
  youtube_shorts: 'yt-shorts',
  shorts: 'yt-shorts',
};

/** Vietnamese → ASCII slug (lowercase, hyphen). */
export function slugifyVi(input, maxLen = 56) {
  if (!input) return 'video';
  const map = {
    à: 'a', á: 'a', ả: 'a', ã: 'a', ạ: 'a',
    ă: 'a', ằ: 'a', ắ: 'a', ẳ: 'a', ẵ: 'a', ặ: 'a',
    â: 'a', ầ: 'a', ấ: 'a', ẩ: 'a', ẫ: 'a', ậ: 'a',
    è: 'e', é: 'e', ẻ: 'e', ẽ: 'e', ẹ: 'e',
    ê: 'e', ề: 'e', ế: 'e', ể: 'e', ễ: 'e', ệ: 'e',
    ì: 'i', í: 'i', ỉ: 'i', ĩ: 'i', ị: 'i',
    ò: 'o', ó: 'o', ỏ: 'o', õ: 'o', ọ: 'o',
    ô: 'o', ồ: 'o', ố: 'o', ổ: 'o', ỗ: 'o', ộ: 'o',
    ơ: 'o', ờ: 'o', ớ: 'o', ở: 'o', ỡ: 'o', ợ: 'o',
    ù: 'u', ú: 'u', ủ: 'u', ũ: 'u', ụ: 'u',
    ư: 'u', ừ: 'u', ứ: 'u', ử: 'u', ữ: 'u', ự: 'u',
    ỳ: 'y', ý: 'y', ỷ: 'y', ỹ: 'y', ỵ: 'y',
    đ: 'd',
  };
  let s = String(input).trim().toLowerCase();
  s = s.replace(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/g, (ch) => map[ch] || ch);
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');
  if (!s) return 'video';
  return s.slice(0, maxLen).replace(/-+$/g, '') || 'video';
}

export function platformSlug(platform) {
  const key = String(platform || 'tiktok').trim().toLowerCase();
  return PLATFORM_SLUG[key] || key.replace(/_/g, '-');
}

export function segmentSlug(segment) {
  const key = String(segment || 'general_inbound').trim().toLowerCase();
  return SEGMENT_SLUG[key] || slugifyVi(key.replace(/_/g, ' '), 32);
}

/**
 * @param {{ segment?: string, platform?: string, title?: string, hook_3s?: string, date?: Date|string }} opts
 */
export function buildVideoDriveFileName(opts = {}) {
  const seg = segmentSlug(opts.segment);
  const plat = platformSlug(opts.platform);
  const topicSource = opts.title || opts.hook_3s || 'video-ngan-bds';
  const topic = slugifyVi(topicSource, 52);
  let datePart;
  if (opts.date instanceof Date) {
    datePart = opts.date.toISOString().slice(0, 10).replace(/-/g, '');
  } else if (typeof opts.date === 'string' && opts.date.length >= 8) {
    datePart = opts.date.replace(/-/g, '').slice(0, 8);
  } else {
    datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  }
  const name = `${seg}-${plat}-${topic}-${datePart}.mp4`;
  return name.slice(0, 120);
}

/** Inline body for n8n Code nodes (no import). */
export function toN8nInline() {
  return `
const SEGMENT_SLUG = ${JSON.stringify(SEGMENT_SLUG)};
const PLATFORM_SLUG = ${JSON.stringify(PLATFORM_SLUG)};
function slugifyVi(input, maxLen = 56) {
  if (!input) return 'video';
  const map = { à:'a',á:'a',ả:'a',ã:'a',ạ:'a',ă:'a',ằ:'a',ắ:'a',ẳ:'a',ẵ:'a',ặ:'a',â:'a',ầ:'a',ấ:'a',ẩ:'a',ẫ:'a',ậ:'a',è:'e',é:'e',ẻ:'e',ẽ:'e',ẹ:'e',ê:'e',ề:'e',ế:'e',ể:'e',ễ:'e',ệ:'e',ì:'i',í:'i',ỉ:'i',ĩ:'i',ị:'i',ò:'o',ó:'o',ỏ:'o',õ:'o',ọ:'o',ô:'o',ồ:'o',ố:'o',ổ:'o',ỗ:'o',ộ:'o',ơ:'o',ờ:'o',ớ:'o',ở:'o',ỡ:'o',ợ:'o',ù:'u',ú:'u',ủ:'u',ũ:'u',ụ:'u',ư:'u',ừ:'u',ứ:'u',ử:'u',ữ:'u',ự:'u',ỳ:'y',ý:'y',ỷ:'y',ỹ:'y',ỵ:'y',đ:'d' };
  let s = String(input).trim().toLowerCase();
  s = s.replace(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/g, (ch) => map[ch] || ch);
  s = s.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
  s = s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');
  if (!s) return 'video';
  return s.slice(0, maxLen).replace(/-+$/g, '') || 'video';
}
function platformSlug(platform) {
  const key = String(platform || 'tiktok').trim().toLowerCase();
  return PLATFORM_SLUG[key] || key.replace(/_/g, '-');
}
function segmentSlug(segment) {
  const key = String(segment || 'general_inbound').trim().toLowerCase();
  return SEGMENT_SLUG[key] || slugifyVi(key.replace(/_/g, ' '), 32);
}
function buildVideoDriveFileName(opts) {
  opts = opts || {};
  const seg = segmentSlug(opts.segment);
  const plat = platformSlug(opts.platform);
  const topic = slugifyVi(opts.title || opts.hook_3s || 'video-ngan-bds', 52);
  const datePart = (opts.date ? String(opts.date) : new Date().toISOString()).replace(/-/g, '').slice(0, 8);
  return (seg + '-' + plat + '-' + topic + '-' + datePart + '.mp4').slice(0, 120);
}
`.trim();
}
