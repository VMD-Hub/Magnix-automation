/**
 * Alias slug bài cũ (publish từ title / silo sai) → slug + path canonical.
 * Middleware 308; tránh 404 khi Google / link nội bộ còn URL lỗi.
 */
import {
  articlePath,
  knowledgeArticlePath,
} from "@/lib/content/article-routes";

type LegacyArticleRedirect = {
  /** Slug canonical hiện tại. */
  slug: string;
  /** true = /tin-tuc/kien-thuc ; false = /wiki-nha-o-xa-hoi */
  knowledge: boolean;
};

/**
 * Key = slug từng xuất hiện trên web (wiki hoặc kiến thức).
 * Value = bài đích.
 */
export const LEGACY_ARTICLE_SLUG_REDIRECTS: Record<string, LegacyArticleRedirect> =
  {
    // Publish queue cũ: slugify tiêu đề dài + gắn nhầm silo wiki.
    "can-ho-tren-truc-ql13-va-hanh-lang-vanh-dai-4-co-hoi-khai-thac-cho-thue-tu-nhom-khach-hang-chuyen-gi":
      {
        slug: "can-ho-cho-thue-chuyen-gia-truc-ql13-vanh-dai-4-2026",
        knowledge: true,
      },
    // Biến thể slugify từ title hiện tại (không có đuôi -2026).
    "can-ho-cho-thue-chuyen-gia-tren-truc-ql13-va-hanh-lang-vanh-dai-4": {
      slug: "can-ho-cho-thue-chuyen-gia-truc-ql13-vanh-dai-4-2026",
      knowledge: true,
    },
    // A3: đổi timeline (EN) → tien-trinh-giao-dich
    "chi-phi-an-khi-mua-nha-lan-dau-va-timeline-tu-ky-den-so-huu": {
      slug: "chi-phi-an-khi-mua-nha-lan-dau-va-tien-trinh-giao-dich",
      knowledge: false,
    },
  };

export function resolveLegacyArticleRedirectPath(
  legacySlug: string,
): string | null {
  const hit = LEGACY_ARTICLE_SLUG_REDIRECTS[legacySlug];
  if (!hit) return null;
  return hit.knowledge
    ? knowledgeArticlePath(hit.slug)
    : articlePath(hit.slug);
}

export function resolveLegacyArticleCanonicalSlug(
  legacySlug: string,
): string | null {
  return LEGACY_ARTICLE_SLUG_REDIRECTS[legacySlug]?.slug ?? null;
}
