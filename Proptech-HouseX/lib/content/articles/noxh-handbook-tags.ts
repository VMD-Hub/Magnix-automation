import type { ArticleCardData, ArticleTagSummary } from "@/lib/data/article-types";
import { NOXH_HANDBOOK_PATH } from "@/lib/content/article-routes";

/** Tag chính — mỗi bài cẩm nang NOXH chỉ gắn một tag. */
export const NOXH_TAG_CHINH_SACH = {
  slug: "chinh-sach-ho-so-noxh",
  name: "Chính sách & hồ sơ NOXH",
} as const;

export const NOXH_TAG_CHON_NHA = {
  slug: "chon-noxh-dung-cach",
  name: "Chọn nhà & an cư đúng cách",
} as const;

export const NOXH_TAG_THAM_DINH_VAY = {
  slug: "tham-dinh-vay-noxh",
  name: "Thẩm định vay & tài chính",
} as const;

export const NOXH_TAG_DU_AN_GIA = {
  slug: "du-an-gia-tien-do-noxh",
  name: "Dự án, giá & tiến độ",
} as const;

export const NOXH_TAG_HA_TANG = {
  slug: "ha-tang-ket-noi-vung",
  name: "Hạ tầng & kết nối vùng",
} as const;

/** Trục 1 — Bắc–Nam dọc sông Sài Gòn. */
export const NOXH_TAG_NORTH_SOUTH = {
  slug: "hanh-lang-bac-nam-song-sai-gon",
  name: "Hành lang Bắc – Nam sông Sài Gòn",
} as const;

/** Trục 2 — Đông–Tây Võ Văn Kiệt – Mai Chí Thọ. */
export const NOXH_TAG_EAST_WEST = {
  slug: "hanh-lang-dong-tay-vvk-mct",
  name: "Hành lang Đông – Tây VVK–MCT",
} as const;

/** Trục 3 — Kinh tế biển phía Đông (Cái Mép – Thị Vải / Nhơn Trạch). */
export const NOXH_TAG_EAST_COAST = {
  slug: "hanh-lang-kinh-te-bien-phia-dong",
  name: "Hành lang kinh tế biển phía Đông",
} as const;

/** Trục 4 — Vành đai 3 & 4. */
export const NOXH_TAG_RING_ROAD = {
  slug: "hanh-lang-vanh-dai-3-4",
  name: "Hành lang Vành đai 3 & 4",
} as const;

/** Trục 5 — Kết nối sân bay Long Thành & Tân Sơn Nhất (không trộn QL13). */
export const NOXH_TAG_AIRPORT = {
  slug: "hanh-lang-san-bay-long-thanh",
  name: "Hành lang sân bay Long Thành",
} as const;

/** Trục đặc biệt — Quốc lộ 13 Đại lộ tài chính Đông Bắc. */
export const NOXH_TAG_QL13 = {
  slug: "truc-quoc-lo-13-dong-bac",
  name: "Trục Quốc lộ 13 Đông Bắc",
} as const;

export const NOXH_HANDBOOK_TAGS = [
  NOXH_TAG_CHINH_SACH,
  NOXH_TAG_CHON_NHA,
  NOXH_TAG_THAM_DINH_VAY,
  NOXH_TAG_DU_AN_GIA,
  NOXH_TAG_HA_TANG,
  NOXH_TAG_NORTH_SOUTH,
  NOXH_TAG_EAST_WEST,
  NOXH_TAG_EAST_COAST,
  NOXH_TAG_RING_ROAD,
  NOXH_TAG_AIRPORT,
  NOXH_TAG_QL13,
] as const;

export const NOXH_HANDBOOK_TAG_SLUGS = new Set<string>(
  NOXH_HANDBOOK_TAGS.map((t) => t.slug),
);

/** Bài chỉ thuộc silo /phong-thuy — không liệt kê trên cẩm nang NOXH. */
export const PHONG_THUY_ONLY_ARTICLE_SLUGS = new Set([
  "huong-nha-hop-tuoi-bat-trach-tom-tat",
  "kim-lau-hoang-oc-tam-tai-xay-nha-giai-thich",
]);

export const PHONG_THUY_ARTICLE_TAG = {
  slug: "phong-thuy",
  name: "Phong thủy nhà ở",
} as const;

export const NOXH_HANDBOOK_TAG_DESCRIPTIONS: Record<
  (typeof NOXH_HANDBOOK_TAGS)[number]["slug"],
  string
> = {
  [NOXH_TAG_CHINH_SACH.slug]:
    "Luật Nhà ở, điều kiện đối tượng, thu nhập, quy trình mua và hồ sơ NOXH.",
  [NOXH_TAG_CHON_NHA.slug]:
    "Chọn căn, vị trí và chi phí sống theo năng lực — tránh mua theo cảm xúc hay FOMO.",
  [NOXH_TAG_THAM_DINH_VAY.slug]:
    "Tự kiểm tra tuổi vay, thu nhập, CIC và checklist trước khi cọc hoặc nộp hồ sơ.",
  [NOXH_TAG_DU_AN_GIA.slug]:
    "Giá bán, tiến độ, so sánh dự án và cập nhật thị trường NOXH.",
  [NOXH_TAG_HA_TANG.slug]:
    "Khung TOD, quy hoạch tổng thể và điều hướng 6 trục tăng trưởng toàn TP.HCM / liên vùng.",
  [NOXH_TAG_NORTH_SOUTH.slug]:
    "Trục dọc sông Sài Gòn hướng biển: Củ Chi – lõi – Nhà Bè – Cần Giờ; BĐS ven sông Nam Sài Gòn.",
  [NOXH_TAG_EAST_WEST.slug]:
    "Trục Võ Văn Kiệt – Mai Chí Thọ: liên kết Long An – trung tâm – Đồng Nai / thủ phủ công nghiệp.",
  [NOXH_TAG_EAST_COAST.slug]:
    "Hành lang biển Đông: Nhơn Trạch – Long Thành – Cái Mép – Thị Vải; logistics và đô thị vệ tinh.",
  [NOXH_TAG_RING_ROAD.slug]:
    "Vành đai 3 & 4: chuỗi đô thị vệ tinh Thủ Đức, Bình Dương, Đồng Nai, Long An, Củ Chi, Bình Chánh.",
  [NOXH_TAG_AIRPORT.slug]:
    "Kết nối sân bay Long Thành & Tân Sơn Nhất: đường sắt TTLT, đô thị sân bay bán kính 5–10 km.",
  [NOXH_TAG_QL13.slug]:
    "Đại lộ tài chính QL13 Đông Bắc: Lái Thiêu, Thuận An, Dĩ An — Metro số 2, cửa ngõ Thủ Đức.",
};

/** 301 slug chủ đề cũ → slug mới hoặc hub cẩm nang. */
export const LEGACY_NOXH_TOPIC_REDIRECTS: Record<string, string> = {
  noxh: NOXH_HANDBOOK_PATH,
  "goc-chuyen-gia": NOXH_HANDBOOK_PATH,
  "phap-ly": `/wiki-nha-o-xa-hoi/chu-de/${NOXH_TAG_CHINH_SACH.slug}`,
  "tien-do-du-an": `/wiki-nha-o-xa-hoi/chu-de/${NOXH_TAG_DU_AN_GIA.slug}`,
  "dau-tu": `/wiki-nha-o-xa-hoi/chu-de/${NOXH_TAG_DU_AN_GIA.slug}`,
  "ha-tang-giao-thong": `/wiki-nha-o-xa-hoi/chu-de/${NOXH_TAG_HA_TANG.slug}`,
  "do-thi-ve-tinh-tod": `/wiki-nha-o-xa-hoi/chu-de/${NOXH_TAG_AIRPORT.slug}`,
  "nha-o-xa-hoi-ly-thuong-kiet": NOXH_HANDBOOK_PATH,
  "dta-happy-home-nhon-trach": `/wiki-nha-o-xa-hoi/chu-de/${NOXH_TAG_EAST_COAST.slug}`,
};

export const NOXH_HANDBOOK_PILLAR_CLUSTERS = [
  {
    ...NOXH_TAG_CHINH_SACH,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[NOXH_TAG_CHINH_SACH.slug],
  },
  {
    ...NOXH_TAG_CHON_NHA,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[NOXH_TAG_CHON_NHA.slug],
  },
  {
    ...NOXH_TAG_THAM_DINH_VAY,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[NOXH_TAG_THAM_DINH_VAY.slug],
  },
] as const;

export const NOXH_HANDBOOK_SECONDARY_CLUSTERS = [
  {
    ...NOXH_TAG_DU_AN_GIA,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[NOXH_TAG_DU_AN_GIA.slug],
  },
  {
    ...NOXH_TAG_HA_TANG,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[NOXH_TAG_HA_TANG.slug],
  },
  {
    ...NOXH_TAG_NORTH_SOUTH,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[NOXH_TAG_NORTH_SOUTH.slug],
  },
  {
    ...NOXH_TAG_EAST_WEST,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[NOXH_TAG_EAST_WEST.slug],
  },
  {
    ...NOXH_TAG_EAST_COAST,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[NOXH_TAG_EAST_COAST.slug],
  },
  {
    ...NOXH_TAG_RING_ROAD,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[NOXH_TAG_RING_ROAD.slug],
  },
  {
    ...NOXH_TAG_AIRPORT,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[NOXH_TAG_AIRPORT.slug],
  },
  {
    ...NOXH_TAG_QL13,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[NOXH_TAG_QL13.slug],
  },
] as const;

export function isNoxhHandbookArticle(
  article: Pick<ArticleCardData, "slug" | "tags">,
): boolean {
  if (PHONG_THUY_ONLY_ARTICLE_SLUGS.has(article.slug)) return false;
  return article.tags.some((t) => NOXH_HANDBOOK_TAG_SLUGS.has(t.slug));
}

export function handbookTagSummaries(): ArticleTagSummary[] {
  return NOXH_HANDBOOK_TAGS.map((t) => ({
    slug: t.slug,
    name: t.name,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[t.slug],
    articleCount: 0,
  }));
}
