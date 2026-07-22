import type { ArticleCardData } from "@/lib/data/article-types";
import { DTA_HAPPY_HOME_SLUG } from "@/lib/content/dta-happy-home-landing";
import { LTK_PROJECT_SLUG } from "@/lib/preview/phu-tho-dmc-mock";
import {
  LA_HOME_SLUG,
  MY_HANH_SLUG,
  ORI_SLUG,
} from "@/lib/preview/noxh-long-an-projects";
import { LEGACY_NOXH_TOPIC_REDIRECTS } from "@/lib/content/articles/noxh-handbook-tags";

const PHUC_LOC_THO_SLUG = "chung-cu-phuc-loc-tho-noxh";

/** Thứ tự ưu tiên bài trend trên landing từng dự án. */
export const PROJECT_FEATURED_ARTICLE_SLUGS: Partial<Record<string, string[]>> =
  {
    [LTK_PROJECT_SLUG]: [
      "tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc",
      "gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026",
      "so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026",
      "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
      "dieu-kien-nha-o-mua-noxh-dieu-77-2026",
    ],
    [DTA_HAPPY_HOME_SLUG]: [
      "nhon-trach-cu-tang-truong-ha-tang-tod-2026",
      "metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026",
      "so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026",
      "lai-suat-vay-noxh-duoi-35-tuoi-nhnn-2026",
      "vay-noxh-goi-120000-ty-nhcsxh-2026",
      "quy-trinh-mua-thue-mua-noxh-2026",
      "tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045",
      "quy-hoach-tong-the-tphcm-tam-nhin-100-nam-sieu-do-thi",
    ],
    [PHUC_LOC_THO_SLUG]: [
      "phuc-loc-tho-block-c-noxh-gia-ho-so-2026",
      "tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc",
      "so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026",
      "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
    ],
    [LA_HOME_SLUG]: [
      "noxh-long-an-6-du-an-mien-nam-2026",
      "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
      "quy-trinh-mua-thue-mua-noxh-2026",
    ],
    [MY_HANH_SLUG]: [
      "noxh-long-an-6-du-an-mien-nam-2026",
      "vay-noxh-goi-120000-ty-nhcsxh-2026",
    ],
    [ORI_SLUG]: [
      "noxh-long-an-6-du-an-mien-nam-2026",
      "so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026",
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
  if (tagSlug) {
    return (
      LEGACY_NOXH_TOPIC_REDIRECTS[tagSlug] ??
      `/tin-tuc/cam-nang-noxh/chu-de/${tagSlug}`
    );
  }
  return "/tin-tuc/cam-nang-noxh";
}
