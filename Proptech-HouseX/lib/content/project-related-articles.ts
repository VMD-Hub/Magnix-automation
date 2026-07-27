import type { ArticleCardData } from "@/lib/data/article-types";
import { DTA_HAPPY_HOME_SLUG } from "@/lib/content/dta-happy-home-landing";
import { ID_TOWN_SLUG } from "@/lib/content/id-town-landing";
import { HGX_PROJECT_SLUG } from "@/lib/preview/ho-guom-xanh-mock";
import { LTK_PROJECT_SLUG } from "@/lib/preview/phu-tho-dmc-mock";
import {
  LA_HOME_SLUG,
  MY_HANH_SLUG,
  ORI_SLUG,
} from "@/lib/preview/noxh-long-an-projects";
import {
  LEGACY_NOXH_TOPIC_REDIRECTS,
  NOXH_TAG_AIRPORT,
  NOXH_TAG_EAST_COAST,
  NOXH_TAG_QL13,
} from "@/lib/content/articles/noxh-handbook-tags";
import {
  ASTRAL_CITY_SLUG,
  AT_SKY_GARDEN_SLUG,
  EMERALD_68_SLUG,
  EMERALD_BOULEVARD_SLUG,
} from "@/lib/preview/ql13-commercial-mocks";
import { GROWTH_CORRIDORS_PILLAR_SLUG } from "@/lib/content/growth-corridors";

const PHUC_LOC_THO_SLUG = "chung-cu-phuc-loc-tho-noxh";

/** Featured QL13 / Lái Thiêu — không lẫn sân bay / biển Đông. */
const QL13_FEATURED = [
  GROWTH_CORRIDORS_PILLAR_SLUG,
  "ho-guom-xanh-metro-so-2-ql13-tod-2026",
  "lai-thieu-quy-hoach-2040-phuong-trung-tam-metro-2026",
  "can-ho-lai-thieu-quoc-lo-13-du-an-noi-bat-2026",
  "can-ho-lai-thieu-sap-mo-ban-emerald-boulevard-hgx-2026",
  "mua-can-ho-lai-thieu-o-thuc-hay-dau-tu-cho-thue-2026",
] as const;

/** Featured hành lang sân bay — ID Town; không lẫn QL13. */
const AIRPORT_FEATURED = [
  GROWTH_CORRIDORS_PILLAR_SLUG,
  "id-town-long-thanh-ha-tang-san-bay-metro-2026",
  "bds-thanh-pho-san-bay-long-thanh-mo-hinh-sinh-loi-2026",
  "metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026",
  "tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045",
  "quy-hoach-tong-the-tphcm-tam-nhin-100-nam-sieu-do-thi",
] as const;

/**
 * Featured hành lang biển Đông — DTA / Nhơn Trạch.
 * Có thể link bài sân bay liên vùng nhưng hub tag là east-coast.
 */
const EAST_COAST_FEATURED = [
  GROWTH_CORRIDORS_PILLAR_SLUG,
  "hanh-lang-kinh-te-bien-phia-dong-tphcm-cai-mep-2026",
  "nhon-trach-cu-tang-truong-ha-tang-tod-2026",
  "bds-do-thi-bien-phia-dong-cua-ngo-dau-tu-dai-han-2026",
  "metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026",
  "tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045",
] as const;

/** Thứ tự ưu tiên bài trend trên landing từng dự án. */
export const PROJECT_FEATURED_ARTICLE_SLUGS: Partial<Record<string, string[]>> =
  {
    [LTK_PROJECT_SLUG]: [
      "gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026",
      "ho-so-mua-noxh-ly-thuong-kiet-doi-tuong-checklist-2026",
      "vi-sao-noxh-ly-thuong-kiet-sot-so-sanh-gia-quan-10-2026",
      "canh-bao-lua-dao-suat-noi-bo-noxh-ly-thuong-kiet-2026",
      "giai-ma-4-don-thao-tung-tam-ly-suat-noi-bo-noxh-ly-thuong-kiet-2026",
      "mua-noxh-ly-thuong-kiet-co-kho-khong-canh-giac-ve-bua-thu-tuc-2026",
      "tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc",
      "so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026",
      "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
      "dieu-kien-nha-o-mua-noxh-dieu-77-2026",
    ],
    [DTA_HAPPY_HOME_SLUG]: [
      ...EAST_COAST_FEATURED,
      "so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026",
      "lai-suat-vay-noxh-duoi-35-tuoi-nhnn-2026",
      "vay-noxh-goi-120000-ty-nhcsxh-2026",
      "quy-trinh-mua-thue-mua-noxh-2026",
    ],
    [ID_TOWN_SLUG]: [
      ...AIRPORT_FEATURED,
      "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
      "quy-trinh-mua-thue-mua-noxh-2026",
    ],
    [HGX_PROJECT_SLUG]: [
      ...QL13_FEATURED,
      "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
      "quy-trinh-mua-thue-mua-noxh-2026",
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
    [EMERALD_68_SLUG]: [...QL13_FEATURED],
    [AT_SKY_GARDEN_SLUG]: [...QL13_FEATURED],
    [ASTRAL_CITY_SLUG]: [...QL13_FEATURED],
    [EMERALD_BOULEVARD_SLUG]: [...QL13_FEATURED],
  };

/** Tag chủ đề “Xem thêm” — tách 6 trục (sân bay vs biển Đông vs QL13). */
export const PROJECT_ARTICLE_TAG_SLUG: Partial<Record<string, string>> = {
  [LTK_PROJECT_SLUG]: "nha-o-xa-hoi-ly-thuong-kiet",
  [DTA_HAPPY_HOME_SLUG]: NOXH_TAG_EAST_COAST.slug,
  [ID_TOWN_SLUG]: NOXH_TAG_AIRPORT.slug,
  [HGX_PROJECT_SLUG]: NOXH_TAG_QL13.slug,
  [EMERALD_68_SLUG]: NOXH_TAG_QL13.slug,
  [AT_SKY_GARDEN_SLUG]: NOXH_TAG_QL13.slug,
  [ASTRAL_CITY_SLUG]: NOXH_TAG_QL13.slug,
  [EMERALD_BOULEVARD_SLUG]: NOXH_TAG_QL13.slug,
};

/** @deprecated Dùng NOXH_TAG_EAST_COAST cho DTA; giữ alias cũ. */
export const DTA_INFRA_ARTICLE_TAG_SLUG = NOXH_TAG_EAST_COAST.slug;

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
      `/wiki-nha-o-xa-hoi/chu-de/${tagSlug}`
    );
  }
  return "/wiki-nha-o-xa-hoi";
}
