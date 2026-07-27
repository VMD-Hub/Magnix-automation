import { DTA_HAPPY_HOME_SLUG } from "@/lib/content/dta-happy-home-landing";
import { ID_TOWN_SLUG } from "@/lib/content/id-town-landing";
import { HGX_PROJECT_SLUG } from "@/lib/preview/ho-guom-xanh-mock";
import {
  ASTRAL_CITY_SLUG,
  AT_SKY_GARDEN_SLUG,
  EMERALD_68_SLUG,
  EMERALD_BOULEVARD_SLUG,
} from "@/lib/preview/ql13-commercial-mocks";
import { topicPath } from "@/lib/content/article-routes";
import {
  NOXH_TAG_AIRPORT,
  NOXH_TAG_EAST_COAST,
  NOXH_TAG_EAST_WEST,
  NOXH_TAG_HA_TANG,
  NOXH_TAG_NORTH_SOUTH,
  NOXH_TAG_QL13,
  NOXH_TAG_RING_ROAD,
} from "@/lib/content/articles/noxh-handbook-tags";

const THU_THIEM_GREEN_HOUSE_SLUG = "thu-thiem-green-house-thu-duc";

/**
 * 6 trục tăng trưởng đô thị HCMC / liên vùng (quy hoạch quốc gia)
 * + framework (pillar / TOD khái niệm).
 * Phễu SEO 18 bài: `growth-corridor-funnel.ts`.
 */
export type GrowthCorridorId =
  | "north-south-saigon-river"
  | "east-west-vvk-mct"
  | "east-coast-brvt"
  | "ring-road-3-4"
  | "airport-long-thanh"
  | "ql13-northeast"
  | "framework";

export type GrowthCorridor = {
  id: GrowthCorridorId;
  nameVi: string;
  seoBlurb: string;
  hubPath: string | null;
  tagSlug: string | null;
};

export const GROWTH_CORRIDORS: readonly GrowthCorridor[] = [
  {
    id: "north-south-saigon-river",
    nameVi: "Hành lang Bắc – Nam (dọc sông Sài Gòn hướng biển)",
    seoBlurb:
      "Trục dọc sông từ Củ Chi về Nhà Bè – Cần Giờ: kinh tế dịch vụ, du lịch, giao thông thủy và BĐS ven sông Nam Sài Gòn.",
    hubPath: topicPath(NOXH_TAG_NORTH_SOUTH.slug),
    tagSlug: NOXH_TAG_NORTH_SOUTH.slug,
  },
  {
    id: "east-west-vvk-mct",
    nameVi: "Hành lang Đông – Tây (Võ Văn Kiệt – Mai Chí Thọ)",
    seoBlurb:
      "Xương sống liên kết vùng: Long An xuyên lõi trung tâm đến Đồng Nai — cửa ngõ công nghiệp hai đầu.",
    hubPath: topicPath(NOXH_TAG_EAST_WEST.slug),
    tagSlug: NOXH_TAG_EAST_WEST.slug,
  },
  {
    id: "east-coast-brvt",
    nameVi: "Hành lang kinh tế biển phía Đông (hướng Bà Rịa – Vũng Tàu)",
    seoBlurb:
      "Chuỗi logistics TP.HCM – Nhơn Trạch – Long Thành – Cái Mép – Thị Vải; cao tốc Biên Hòa – Vũng Tàu / Bến Lức – Long Thành.",
    hubPath: topicPath(NOXH_TAG_EAST_COAST.slug),
    tagSlug: NOXH_TAG_EAST_COAST.slug,
  },
  {
    id: "ring-road-3-4",
    nameVi: "Hành lang Vành đai 3 & Vành đai 4 (đô thị vệ tinh)",
    seoBlurb:
      "Chuỗi đô thị vệ tinh quanh Vành đai 3–4: Thủ Đức, Củ Chi, Bình Chánh, Thuận An, Bình Dương, Đồng Nai, Long An.",
    hubPath: topicPath(NOXH_TAG_RING_ROAD.slug),
    tagSlug: NOXH_TAG_RING_ROAD.slug,
  },
  {
    id: "airport-long-thanh",
    nameVi: "Hành lang kết nối sân bay (Long Thành & Tân Sơn Nhất)",
    seoBlurb:
      "Trục liên cảng hàng không: Long Thành – TSN, đường sắt Thủ Thiêm – Long Thành, đô thị sân bay bán kính 5–10 km.",
    hubPath: topicPath(NOXH_TAG_AIRPORT.slug),
    tagSlug: NOXH_TAG_AIRPORT.slug,
  },
  {
    id: "ql13-northeast",
    nameVi: "Trục Đông Bắc – Đại lộ tài chính Quốc lộ 13",
    seoBlurb:
      "Lái Thiêu, Thuận An, Dĩ An: mở rộng QL13, Metro số 2, cửa ngõ Thủ Đức — Đại lộ tài chính Đông Bắc.",
    hubPath: topicPath(NOXH_TAG_QL13.slug),
    tagSlug: NOXH_TAG_QL13.slug,
  },
  {
    id: "framework",
    nameVi: "Khung hạ tầng & TOD (toàn vùng)",
    seoBlurb:
      "Bài tổng quan 6 trục, TOD khái niệm / quy hoạch tổng thể — không gắn một hành lang địa lý duy nhất.",
    hubPath: topicPath(NOXH_TAG_HA_TANG.slug),
    tagSlug: NOXH_TAG_HA_TANG.slug,
  },
] as const;

/** Sáu trục địa lý (không gồm framework). */
export const GROWTH_CORRIDOR_AXIS_IDS = [
  "north-south-saigon-river",
  "east-west-vvk-mct",
  "east-coast-brvt",
  "ring-road-3-4",
  "airport-long-thanh",
  "ql13-northeast",
] as const satisfies readonly GrowthCorridorId[];

/** Dự án → trục tăng trưởng. */
export const PROJECT_GROWTH_CORRIDOR: Readonly<Record<string, GrowthCorridorId>> =
  {
    [ID_TOWN_SLUG]: "airport-long-thanh",
    [DTA_HAPPY_HOME_SLUG]: "east-coast-brvt",
    [HGX_PROJECT_SLUG]: "ql13-northeast",
    [EMERALD_68_SLUG]: "ql13-northeast",
    [AT_SKY_GARDEN_SLUG]: "ql13-northeast",
    [ASTRAL_CITY_SLUG]: "ql13-northeast",
    [EMERALD_BOULEVARD_SLUG]: "ql13-northeast",
    [THU_THIEM_GREEN_HOUSE_SLUG]: "north-south-saigon-river",
  };

/** Bài viết → trục tăng trưởng (SoR SEO). */
export const ARTICLE_GROWTH_CORRIDOR: Readonly<Record<string, GrowthCorridorId>> =
  {
    "id-town-long-thanh-ha-tang-san-bay-metro-2026": "airport-long-thanh",
    "metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026": "airport-long-thanh",
    "bds-thanh-pho-san-bay-long-thanh-mo-hinh-sinh-loi-2026": "airport-long-thanh",

    "nhon-trach-cu-tang-truong-ha-tang-tod-2026": "east-coast-brvt",
    "hanh-lang-kinh-te-bien-phia-dong-tphcm-cai-mep-2026": "east-coast-brvt",
    "bds-do-thi-bien-phia-dong-cua-ngo-dau-tu-dai-han-2026": "east-coast-brvt",

    "truc-doc-song-sai-gon-hanh-lang-kinh-te-ty-do-2026":
      "north-south-saigon-river",
    "ly-tam-bds-nam-sai-gon-can-gio-dong-tien-2026": "north-south-saigon-river",
    "top-du-an-can-ho-biet-thu-ven-song-nam-sai-gon-2026":
      "north-south-saigon-river",

    "truc-dong-tay-tphcm-vo-van-kiet-mai-chi-tho-2026": "east-west-vvk-mct",
    "bds-truc-dong-tay-bien-do-gia-cua-ngo-2026": "east-west-vvk-mct",
    "can-ho-vo-van-kiet-mai-chi-tho-an-cu-dau-tu-2026": "east-west-vvk-mct",

    "tien-do-vanh-dai-3-vanh-dai-4-do-thi-ve-tinh-2026": "ring-road-3-4",
    "tod-doc-vanh-dai-3-mo-vang-nha-dau-tu-2026": "ring-road-3-4",
    "dat-nen-nha-pho-don-dau-thong-xe-vanh-dai-3-2026": "ring-road-3-4",

    "ho-guom-xanh-metro-so-2-ql13-tod-2026": "ql13-northeast",
    "lai-thieu-quy-hoach-2040-phuong-trung-tam-metro-2026": "ql13-northeast",
    "can-ho-lai-thieu-quoc-lo-13-du-an-noi-bat-2026": "ql13-northeast",
    "mua-can-ho-lai-thieu-o-thuc-hay-dau-tu-cho-thue-2026": "ql13-northeast",
    "can-ho-lai-thieu-sap-mo-ban-emerald-boulevard-hgx-2026": "ql13-northeast",

    "tp-hcm-5-khu-tod-metro-so-2-ben-thanh-tham-luong": "framework",
    "quy-hoach-tong-the-tphcm-tam-nhin-100-nam-sieu-do-thi": "framework",
    "tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045": "framework",
    "bon-cuc-tang-truong-do-thi-tp-hcm-2026": "framework",
  };

export function getProjectCorridor(
  projectSlug: string,
): GrowthCorridorId | null {
  return PROJECT_GROWTH_CORRIDOR[projectSlug] ?? null;
}

export function getArticleCorridor(
  articleSlug: string,
): GrowthCorridorId | null {
  return ARTICLE_GROWTH_CORRIDOR[articleSlug] ?? null;
}

export function getCorridorById(id: GrowthCorridorId): GrowthCorridor {
  const found = GROWTH_CORRIDORS.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown growth corridor: ${id}`);
  return found;
}

/** Pillar SEO điều hướng 6 trục (giữ slug URL cũ). */
export const GROWTH_CORRIDORS_PILLAR_SLUG =
  "bon-cuc-tang-truong-do-thi-tp-hcm-2026" as const;
