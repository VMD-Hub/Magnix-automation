import type { ArticleCardData } from "@/lib/data/article-types";
import { DTA_HAPPY_HOME_SLUG } from "@/lib/content/dta-happy-home-landing";
import { LTK_PROJECT_SLUG } from "@/lib/preview/phu-tho-dmc-mock";

/** Thứ tự ưu tiên bài trend trên landing từng dự án. */
export const PROJECT_FEATURED_ARTICLE_SLUGS: Partial<Record<string, string[]>> =
  {
    [LTK_PROJECT_SLUG]: [
      "tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc",
      "gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026",
      "so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026",
    ],
    [DTA_HAPPY_HOME_SLUG]: [
      "nhon-trach-cu-tang-truong-ha-tang-tod-2026",
      "metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026",
      "so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026",
      "lai-suat-vay-noxh-duoi-35-tuoi-nhnn-2026",
      "tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045",
      "quy-hoach-tong-the-tphcm-tam-nhin-100-nam-sieu-do-thi",
    ],
  };

/** Tag chủ đề tương ứng — dùng link “Xem thêm” từ landing dự án. */
export const PROJECT_ARTICLE_TAG_SLUG: Partial<Record<string, string>> = {
  [LTK_PROJECT_SLUG]: "nha-o-xa-hoi-ly-thuong-kiet",
  [DTA_HAPPY_HOME_SLUG]: "dta-happy-home-nhon-trach",
};

/** Tag hub bổ sung cho bài hạ tầng / TOD (landing DTA). */
export const DTA_INFRA_ARTICLE_TAG_SLUG = "do-thi-ve-tinh-tod" as const;

export function orderProjectRelatedArticles(
  projectSlug: string,
  articles: ArticleCardData[],
  limit = 6,
): ArticleCardData[] {
  const featured = PROJECT_FEATURED_ARTICLE_SLUGS[projectSlug] ?? [];
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const ordered: ArticleCardData[] = [];

  for (const slug of featured) {
    const article = bySlug.get(slug);
    if (article) {
      ordered.push(article);
      bySlug.delete(slug);
    }
  }

  for (const article of articles) {
    if (bySlug.has(article.slug)) {
      ordered.push(article);
    }
  }

  return ordered.slice(0, limit);
}

export function projectRelatedArticlesViewMoreHref(projectSlug: string): string {
  const tagSlug = PROJECT_ARTICLE_TAG_SLUG[projectSlug];
  if (tagSlug) return `/tin-tuc/chu-de/${tagSlug}`;
  return "/tin-tuc/chu-de/noxh";
}
