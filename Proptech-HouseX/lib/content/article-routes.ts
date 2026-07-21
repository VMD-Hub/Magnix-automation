/** Hub phong thủy — tách khỏi phong-thuy-public để tránh circular import. */
const PHONG_THUY_HUB_PATH = "/phong-thuy" as const;

export { PHONG_THUY_HUB_PATH };

/** Thư mục mẹ — tin tức & kiến thức đa lĩnh vực. */
export const NEWS_HUB_PATH = "/tin-tuc" as const;

export const NEWS_HUB_TITLE = "Tin tức" as const;

export const NEWS_HUB_SEO_TITLE =
  "Tin tức bất động sản — kiến thức & cẩm nang" as const;

export const NEWS_HUB_INTRO =
  "Cập nhật biến động thị trường bất động sản, lộ trình mua nhà ở xã hội và phân tích thực tế theo từng chuyên mục — đọc đúng chỗ, quyết định có căn cứ." as const;

/** Meta description riêng hub tin tức (70–160 ký tự). */
export const NEWS_HUB_SEO_DESCRIPTION =
  "Tin tức và cẩm nang BĐS trên House X: nhà ở xã hội, vay mua nhà, dự án và kiến thức thực tế — giúp bạn quyết định có căn cứ." as const;

/** Segment silo NOXH. */
export const NOXH_HANDBOOK_SEGMENT = "cam-nang-noxh" as const;

export const NOXH_HANDBOOK_PATH =
  `${NEWS_HUB_PATH}/${NOXH_HANDBOOK_SEGMENT}` as const;

const LEGACY_ARTICLE_RE =
  /^\/tin-tuc\/(?!cam-nang-noxh(?:\/|$)|chu-de(?:\/|$))([^?#]+)/;

const LEGACY_TOPIC_RE = /^\/tin-tuc\/chu-de\/([^?#]+)/;

/** URL bài viết NOXH — silo `/tin-tuc/cam-nang-noxh/[slug]`. */
export function articlePath(slug: string): string {
  return `${NOXH_HANDBOOK_PATH}/${slug}`;
}

/** URL hub chủ đề trong cẩm nang NOXH. */
export function topicPath(tagSlug: string): string {
  if (tagSlug === "phong-thuy") return PHONG_THUY_HUB_PATH;
  return `${NOXH_HANDBOOK_PATH}/chu-de/${tagSlug}`;
}

/** Rewrite link nội bộ cũ `/tin-tuc/...` → silo mới (markdown & legacy copy). */
export function rewriteLegacyArticleHref(href: string): string {
  if (!href.startsWith("/tin-tuc")) return href;

  const [path, query] = href.split("?");
  const suffix = query ? `?${query}` : "";

  const topicMatch = path.match(LEGACY_TOPIC_RE);
  if (topicMatch) {
    return `${topicPath(topicMatch[1]!)}${suffix}`;
  }

  if (path === NEWS_HUB_PATH || path === NOXH_HANDBOOK_PATH) {
    return href;
  }

  const articleMatch = path.match(LEGACY_ARTICLE_RE);
  if (articleMatch) {
    return `${articlePath(articleMatch[1]!)}${suffix}`;
  }

  return href;
}
