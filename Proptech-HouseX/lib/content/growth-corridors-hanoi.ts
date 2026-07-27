import {
  NOXH_TAG_HA_TANG,
  NOXH_TAG_HN_AIRPORT,
  NOXH_TAG_HN_EAST,
  NOXH_TAG_HN_RING4,
  NOXH_TAG_HN_SOUTHWEST,
  NOXH_TAG_HN_WEST,
} from "@/lib/content/articles/noxh-handbook-tags";
import { topicPath } from "@/lib/content/article-routes";

/**
 * 5 trục tăng trưởng Vùng Thủ đô Hà Nội (đô thị chùm) — SoR SEO.
 * Tách biệt hoàn toàn khỏi growth-corridors.ts (HCMC).
 */
export type HanoiGrowthCorridorId =
  | "hn-east-southeast"
  | "hn-airport-north"
  | "hn-ring-road-4"
  | "hn-west-thang-long"
  | "hn-southwest-ha-nam"
  | "hn-framework";

export type HanoiGrowthCorridor = {
  id: HanoiGrowthCorridorId;
  nameVi: string;
  seoBlurb: string;
  hubPath: string | null;
  tagSlug: string | null;
};

export const HANOI_GROWTH_CORRIDORS: readonly HanoiGrowthCorridor[] = [
  {
    id: "hn-east-southeast",
    nameVi: "Trục Đông – Đông Nam (Hà Nội – Hưng Yên – Hải Phòng – Quảng Ninh)",
    seoBlurb:
      "Hành lang kinh tế ven biển / cao tốc 5B: lõi Thủ đô nối cụm cảng Hải Phòng và vùng di sản Quảng Ninh; Hưng Yên là cửa ngõ ly tâm bờ Đông sông Hồng.",
    hubPath: topicPath(NOXH_TAG_HN_EAST.slug),
    tagSlug: NOXH_TAG_HN_EAST.slug,
  },
  {
    id: "hn-airport-north",
    nameVi: "Trục Nội Bài & hành lang kinh tế phía Bắc",
    seoBlurb:
      "Đại lộ Võ Nguyên Giáp (Nhật Tân – Nội Bài), Đông Anh / Sóc Sơn / Mê Linh — logistics hàng không và KCN phía Bắc sông Hồng.",
    hubPath: topicPath(NOXH_TAG_HN_AIRPORT.slug),
    tagSlug: NOXH_TAG_HN_AIRPORT.slug,
  },
  {
    id: "hn-ring-road-4",
    nameVi: "Trục Vành đai 4 – Vùng Thủ đô",
    seoBlurb:
      "Siêu hạ tầng ~113,5 km qua Hà Nội, Hưng Yên, Bắc Ninh — giảm tải nội đô lịch sử, mở đô thị vệ tinh quanh nút giao.",
    hubPath: topicPath(NOXH_TAG_HN_RING4.slug),
    tagSlug: NOXH_TAG_HN_RING4.slug,
  },
  {
    id: "hn-west-thang-long",
    nameVi: "Trục phía Tây – Đại lộ Thăng Long / Hòa Lạc",
    seoBlurb:
      "Hành lang công nghệ – giáo dục bậc cao: Nam Từ Liêm, Mỹ Đình tới trung tâm Hòa Lạc và cửa ngõ Tây Bắc.",
    hubPath: topicPath(NOXH_TAG_HN_WEST.slug),
    tagSlug: NOXH_TAG_HN_WEST.slug,
  },
  {
    id: "hn-southwest-ha-nam",
    nameVi: "Trục Tây Nam (Hà Nội – Hà Nam – Ninh Bình)",
    seoBlurb:
      "Công nghiệp sạch, logistics QL1A / Pháp Vân – Cầu Giẽ và du lịch tâm linh – sinh thái phía Nam Vùng Thủ đô.",
    hubPath: topicPath(NOXH_TAG_HN_SOUTHWEST.slug),
    tagSlug: NOXH_TAG_HN_SOUTHWEST.slug,
  },
  {
    id: "hn-framework",
    nameVi: "Khung đô thị chùm Vùng Thủ đô",
    seoBlurb:
      "Bài tổng quan 5 trục: hạt nhân Hà Nội và đô thị vệ tinh / đối trọng Hưng Yên, Bắc Ninh, Vĩnh Phúc, Hải Phòng, Quảng Ninh, Hà Nam.",
    hubPath: topicPath(NOXH_TAG_HA_TANG.slug),
    tagSlug: NOXH_TAG_HA_TANG.slug,
  },
] as const;

export const HANOI_GROWTH_CORRIDOR_AXIS_IDS = [
  "hn-east-southeast",
  "hn-airport-north",
  "hn-ring-road-4",
  "hn-west-thang-long",
  "hn-southwest-ha-nam",
] as const satisfies readonly HanoiGrowthCorridorId[];

export const HANOI_ARTICLE_GROWTH_CORRIDOR: Readonly<
  Record<string, HanoiGrowthCorridorId>
> = {
  "cao-toc-5b-hanh-lang-kinh-te-ven-bien-dong-nam-vung-thu-do-2026":
    "hn-east-southeast",
  "di-dan-quan-phia-dong-hung-yen-dong-tien-2026": "hn-east-southeast",
  "du-an-dai-do-thi-chung-cu-truc-phia-dong-ha-noi-2026": "hn-east-southeast",

  "quy-hoach-nhat-tan-noi-bai-dai-lo-vo-nguyen-giap-2026": "hn-airport-north",
  "bds-thanh-pho-san-bay-noi-bai-bac-song-hong-2026": "hn-airport-north",
  "du-an-can-ho-dat-nen-dong-anh-me-linh-2026": "hn-airport-north",

  "tien-do-vanh-dai-4-vung-thu-do-2026": "hn-ring-road-4",
  "tod-doc-vanh-dai-4-vung-thu-do-2026": "hn-ring-road-4",
  "dat-nen-nha-pho-don-dau-vanh-dai-4-bac-ninh-hung-yen-2026": "hn-ring-road-4",

  "quy-hoach-truc-phia-tay-dai-lo-thang-long-hoa-lac-2026": "hn-west-thang-long",
  "an-cu-phia-tay-nam-tu-liem-my-dinh-2026": "hn-west-thang-long",
  "can-ho-cao-cap-dai-lo-thang-long-dang-mo-ban-2026": "hn-west-thang-long",

  "quy-hoach-truc-phia-nam-ha-nam-ve-tinh-2026": "hn-southwest-ha-nam",
  "dat-nen-nha-pho-kcn-sach-phia-nam-ha-noi-2026": "hn-southwest-ha-nam",
  "bds-sinh-thai-do-thi-dich-vu-tay-nam-vung-thu-do-2026":
    "hn-southwest-ha-nam",

  "nam-truc-tang-truong-vung-thu-do-ha-noi-2026": "hn-framework",
};

export function getHanoiArticleCorridor(
  articleSlug: string,
): HanoiGrowthCorridorId | null {
  return HANOI_ARTICLE_GROWTH_CORRIDOR[articleSlug] ?? null;
}

export function getHanoiCorridorById(
  id: HanoiGrowthCorridorId,
): HanoiGrowthCorridor {
  const found = HANOI_GROWTH_CORRIDORS.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown Hanoi growth corridor: ${id}`);
  return found;
}

export const HANOI_GROWTH_CORRIDORS_PILLAR_SLUG =
  "nam-truc-tang-truong-vung-thu-do-ha-noi-2026" as const;
