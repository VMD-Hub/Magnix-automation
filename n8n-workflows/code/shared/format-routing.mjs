/**
 * Format routing — đúng agent/prompt theo product_type / content_format.
 */

const DEFAULT = {
  agent3_text_post_formats: ['fb_page_post_image', 'fb_page_post', 'facebook_page'],
  agent6_video_formats: ['fb_reels', 'tiktok', 'youtube_shorts'],
  carousel_formats: ['carousel_image'],
  format_type_by_product: {},
};

/** @param {object} cfg format_routing.json */
export function mergeFormatRouting(cfg = {}) {
  return { ...DEFAULT, ...cfg };
}

/** @param {object} row @param {object} meta */
export function resolveProductFormat(row, meta = {}) {
  const raw = String(
    meta.content_format
    || meta.product_type
    || row.product_type
    || meta.editorial_brief_v1?.content_format
    || meta.editorial_brief_v1?.target_platform
    || '',
  ).trim().toLowerCase();
  return raw || 'fb_page_post_image';
}

/**
 * @param {string} format
 * @param {object} cfg
 */
export function resolveFormatAgent(format, cfg) {
  const f = String(format || '').trim().toLowerCase();
  if ((cfg.agent6_video_formats || []).includes(f)) return 'agent6';
  if ((cfg.carousel_formats || []).includes(f)) return 'carousel';
  if ((cfg.agent3_text_post_formats || []).includes(f)) return 'agent3';
  return 'unknown';
}

/**
 * @param {string} format
 * @param {object} cfg
 */
export function isAgent3Candidate(format, cfg) {
  return resolveFormatAgent(format, cfg) === 'agent3';
}

/**
 * @param {string} format
 * @param {object} cfg
 */
export function isAgent6Candidate(format, cfg) {
  return resolveFormatAgent(format, cfg) === 'agent6';
}
