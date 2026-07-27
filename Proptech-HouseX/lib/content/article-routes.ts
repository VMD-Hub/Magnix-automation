import {
  GENERAL_RE_TAG_SLUGS,
  NOXH_HANDBOOK_TAG_SLUGS,
} from "@/lib/content/articles/noxh-handbook-tags";

/** Hub phong thủy — tách khỏi phong-thuy-public để tránh circular import. */
const PHONG_THUY_HUB_PATH = "/phong-thuy" as const;

export { PHONG_THUY_HUB_PATH };

/** Thư mục mẹ — tin tức & kiến thức đa lĩnh vực. */
export const NEWS_HUB_PATH = "/tin-tuc" as const;

export const NEWS_HUB_TITLE = "Tin tức" as const;

export const NEWS_HUB_SEO_TITLE =
  "Tin tức bất động sản — kiến thức & cẩm nang" as const;

export const NEWS_HUB_INTRO =
  "Tin thị trường, lộ trình mua nhà ở xã hội và phân tích dự án — thông tin có căn cứ để bạn quyết định." as const;

/** Meta description riêng hub tin tức (70–160 ký tự). */
export const NEWS_HUB_SEO_DESCRIPTION =
  "Tin tức bất động sản trên House X: nhà ở xã hội, vay mua nhà, dự án và phân tích thực tế — giúp bạn quyết định có căn cứ." as const;

/** Segment filesystem (app/tin-tuc/cam-nang-noxh) — không dùng làm URL công khai. */
export const NOXH_HANDBOOK_FS_SEGMENT = "cam-nang-noxh" as const;

/** Canonical public hub — Wiki nhà ở xã hội. */
export const NOXH_HANDBOOK_PATH = "/wiki-nha-o-xa-hoi" as const;

/** Hub kiến thức BĐS chung (BTR, hành lang, hạ tầng vùng). */
export const RE_KNOWLEDGE_PATH = "/tin-tuc/kien-thuc" as const;

export const RE_KNOWLEDGE_TITLE = "Kiến thức bất động sản" as const;

export const RE_KNOWLEDGE_SEO_TITLE =
  "Kiến thức bất động sản — hạ tầng, thuê dài hạn & đô thị | House X" as const;

export const RE_KNOWLEDGE_INTRO =
  "Hạ tầng vùng, hành lang đô thị và nhà ở cho thuê dài hạn — khung để chọn vị trí và cách an cư phù hợp khả năng." as const;

export const RE_KNOWLEDGE_SEO_DESCRIPTION =
  "Kiến thức bất động sản trên House X: hành lang đô thị TP.HCM và Hà Nội, nhà ở cho thuê dài hạn, hạ tầng và quy hoạch kết nối vùng." as const;

/** @deprecated Dùng NOXH_HANDBOOK_PATH — giữ alias tên cũ trong import. */
export const NOXH_HANDBOOK_SEGMENT = NOXH_HANDBOOK_FS_SEGMENT;

const LEGACY_ARTICLE_RE =
  /^\/tin-tuc\/(?!cam-nang-noxh(?:\/|$)|kien-thuc(?:\/|$)|chu-de(?:\/|$))([^?#]+)/;

const LEGACY_TOPIC_RE = /^\/tin-tuc\/chu-de\/([^?#]+)/;

const LEGACY_WIKI_SILO_RE = /^\/tin-tuc\/cam-nang-noxh(\/.*)?$/;

const LEGACY_KNOWLEDGE_SILO_RE = /^\/tin-tuc\/kien-thuc(\/.*)?$/;

/** URL bài viết Wiki NOXH — silo `/wiki-nha-o-xa-hoi/[slug]`. */
export function articlePath(slug: string): string {
  return `${NOXH_HANDBOOK_PATH}/${slug}`;
}

/** URL bài viết Kiến thức BĐS. */
export function knowledgeArticlePath(slug: string): string {
  return `${RE_KNOWLEDGE_PATH}/${slug}`;
}

/** URL hub chủ đề — nhánh theo tag (Wiki NOXH / Kiến thức / phong thủy). */
export function topicPath(tagSlug: string): string {
  if (tagSlug === "phong-thuy") return PHONG_THUY_HUB_PATH;
  if (GENERAL_RE_TAG_SLUGS.has(tagSlug)) {
    return `${RE_KNOWLEDGE_PATH}/chu-de/${tagSlug}`;
  }
  return `${NOXH_HANDBOOK_PATH}/chu-de/${tagSlug}`;
}

/** @deprecated Alias — dùng topicPath. */
export function knowledgeTopicPath(tagSlug: string): string {
  return topicPath(tagSlug);
}

/** Canonical URL bài theo tag (ưu tiên Kiến thức BĐS nếu có tag RE). */
export function canonicalArticlePath(article: {
  slug: string;
  tags: readonly { slug: string }[];
}): string {
  if (article.tags.some((t) => GENERAL_RE_TAG_SLUGS.has(t.slug))) {
    return knowledgeArticlePath(article.slug);
  }
  if (article.tags.some((t) => NOXH_HANDBOOK_TAG_SLUGS.has(t.slug))) {
    return articlePath(article.slug);
  }
  return articlePath(article.slug);
}

/** Canonical hub chủ đề theo tag slug. */
export function canonicalTopicPath(tagSlug: string): string {
  return topicPath(tagSlug);
}

/** Rewrite link nội bộ cũ `/tin-tuc/...` → canonical silo. */
export function rewriteLegacyArticleHref(href: string): string {
  if (!href.startsWith("/tin-tuc")) return href;

  const [path, query] = href.split("?");
  const suffix = query ? `?${query}` : "";

  if (path === RE_KNOWLEDGE_PATH || path?.startsWith(`${RE_KNOWLEDGE_PATH}/`)) {
    return href;
  }

  const knowledgeSilo = path.match(LEGACY_KNOWLEDGE_SILO_RE);
  if (knowledgeSilo) {
    return href;
  }

  const wikiSilo = path.match(LEGACY_WIKI_SILO_RE);
  if (wikiSilo) {
    const rest = wikiSilo[1] ?? "";
    return `${NOXH_HANDBOOK_PATH}${rest}${suffix}`;
  }

  const topicMatch = path.match(LEGACY_TOPIC_RE);
  if (topicMatch) {
    return `${topicPath(topicMatch[1]!)}${suffix}`;
  }

  if (path === NEWS_HUB_PATH) {
    return href;
  }

  const articleMatch = path.match(LEGACY_ARTICLE_RE);
  if (articleMatch) {
    return `${articlePath(articleMatch[1]!)}${suffix}`;
  }

  return href;
}

/**
 * Rewrite href wiki cũ sang silo đúng nếu biết tag bài/chủ đề.
 * Dùng khi body còn hardcode `/wiki-nha-o-xa-hoi/...`.
 */
export function rewriteWikiHrefToCanonical(
  href: string,
  opts?: { tagSlug?: string; isKnowledgeArticle?: boolean },
): string {
  if (!href.startsWith(NOXH_HANDBOOK_PATH)) return href;
  const rest = href.slice(NOXH_HANDBOOK_PATH.length) || "";
  if (opts?.tagSlug && GENERAL_RE_TAG_SLUGS.has(opts.tagSlug)) {
    return `${RE_KNOWLEDGE_PATH}${rest}`;
  }
  if (opts?.isKnowledgeArticle) {
    return `${RE_KNOWLEDGE_PATH}${rest}`;
  }
  const topicMatch = rest.match(/^\/chu-de\/([^/?#]+)/);
  if (topicMatch && GENERAL_RE_TAG_SLUGS.has(topicMatch[1]!)) {
    return `${RE_KNOWLEDGE_PATH}${rest}`;
  }
  return href;
}
