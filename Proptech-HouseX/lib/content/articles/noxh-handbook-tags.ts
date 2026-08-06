import type { ArticleCardData, ArticleTagSummary } from "@/lib/data/article-types";

/** Tag hành trình hồ sơ / dự án NOXH — silo Wiki nhà ở xã hội. */
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

/** Hạ tầng & hành lang — silo Kiến thức BĐS (`/tin-tuc/kien-thuc`). */
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

/** Vùng Thủ đô — Trục Đông / Đông Nam. */
export const NOXH_TAG_HN_EAST = {
  slug: "truc-dong-dong-nam-vung-thu-do",
  name: "Trục Đông – Đông Nam Vùng Thủ đô",
} as const;

/** Vùng Thủ đô — Nội Bài / Bắc sông Hồng. */
export const NOXH_TAG_HN_AIRPORT = {
  slug: "truc-san-bay-noi-bai-bac-song-hong",
  name: "Trục Nội Bài – Bắc sông Hồng",
} as const;

/** Vùng Thủ đô — Vành đai 4. */
export const NOXH_TAG_HN_RING4 = {
  slug: "truc-vanh-dai-4-vung-thu-do",
  name: "Trục Vành đai 4 Vùng Thủ đô",
} as const;

/** Vùng Thủ đô — Đại lộ Thăng Long / Hòa Lạc. */
export const NOXH_TAG_HN_WEST = {
  slug: "truc-dai-lo-thang-long-hoa-lac",
  name: "Trục Đại lộ Thăng Long – Hòa Lạc",
} as const;

/** Vùng Thủ đô — Tây Nam Hà Nam – Ninh Bình. */
export const NOXH_TAG_HN_SOUTHWEST = {
  slug: "truc-tay-nam-ha-nam-ninh-binh",
  name: "Trục Tây Nam Hà Nam – Ninh Bình",
} as const;

/** Nhà ở cho thuê dài hạn (BTR) — kiến thức BĐS, không thuộc hành trình hồ sơ NOXH. */
export const NOXH_TAG_BTR = {
  slug: "nha-o-cho-thue-dai-han",
  name: "Nhà ở cho thuê dài hạn",
} as const;

/** Tag Wiki NOXH — chỉ hành trình hồ sơ / dự án. */
export const NOXH_JOURNEY_TAGS = [
  NOXH_TAG_CHINH_SACH,
  NOXH_TAG_CHON_NHA,
  NOXH_TAG_THAM_DINH_VAY,
  NOXH_TAG_DU_AN_GIA,
] as const;

/** Tag Kiến thức BĐS — BTR, hạ tầng, hành lang tăng trưởng. */
export const GENERAL_RE_KNOWLEDGE_TAGS = [
  NOXH_TAG_HA_TANG,
  NOXH_TAG_NORTH_SOUTH,
  NOXH_TAG_EAST_WEST,
  NOXH_TAG_EAST_COAST,
  NOXH_TAG_RING_ROAD,
  NOXH_TAG_AIRPORT,
  NOXH_TAG_QL13,
  NOXH_TAG_HN_EAST,
  NOXH_TAG_HN_AIRPORT,
  NOXH_TAG_HN_RING4,
  NOXH_TAG_HN_WEST,
  NOXH_TAG_HN_SOUTHWEST,
  NOXH_TAG_BTR,
] as const;

/** @deprecated Alias — dùng NOXH_JOURNEY_TAGS cho listing Wiki. */
export const NOXH_HANDBOOK_TAGS = NOXH_JOURNEY_TAGS;

export const NOXH_HANDBOOK_TAG_SLUGS = new Set<string>(
  NOXH_JOURNEY_TAGS.map((t) => t.slug),
);

export const GENERAL_RE_TAG_SLUGS = new Set<string>(
  GENERAL_RE_KNOWLEDGE_TAGS.map((t) => t.slug),
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

/** Mọi tag có tên hiển thị chuẩn (Wiki + Kiến thức + phong thủy). */
export const CANONICAL_ARTICLE_TAGS = [
  ...NOXH_JOURNEY_TAGS,
  ...GENERAL_RE_KNOWLEDGE_TAGS,
  PHONG_THUY_ARTICLE_TAG,
] as const;

const CANONICAL_TAG_BY_SLUG = new Map(
  CANONICAL_ARTICLE_TAGS.map((t) => [t.slug, t] as const),
);

/** Alias slug cũ / ngắn → tag chuẩn (seed queue, draft frontmatter). */
export const ARTICLE_TAG_SLUG_ALIASES: Record<string, string> = {
  "tham-dinh-vay": NOXH_TAG_THAM_DINH_VAY.slug,
  "phap-ly": NOXH_TAG_CHINH_SACH.slug,
  noxh: NOXH_TAG_CHINH_SACH.slug,
};

export function resolveCanonicalArticleTag(slug: string): {
  slug: string;
  name: string;
} | null {
  const canonicalSlug = ARTICLE_TAG_SLUG_ALIASES[slug] ?? slug;
  const hit = CANONICAL_TAG_BY_SLUG.get(canonicalSlug);
  return hit ? { slug: hit.slug, name: hit.name } : null;
}

/** Tên pill trên card / hub — ưu tiên SoR handbook, không Title-Case từ slug. */
export function resolveArticleTagDisplayName(
  slug: string,
  fallbackName?: string | null,
): string {
  return resolveCanonicalArticleTag(slug)?.name ?? fallbackName?.trim() ?? slug;
}

const WIKI_PATH = "/wiki-nha-o-xa-hoi";
const RE_KNOWLEDGE_PATH = "/tin-tuc/kien-thuc";

export const NOXH_HANDBOOK_TAG_DESCRIPTIONS: Record<string, string> = {
  [NOXH_TAG_CHINH_SACH.slug]:
    "Luật Nhà ở, điều kiện đối tượng, thu nhập, quy trình mua và hồ sơ NOXH.",
  [NOXH_TAG_CHON_NHA.slug]:
    "Chọn căn, vị trí và chi phí sống theo năng lực — tránh mua theo cảm xúc hay FOMO.",
  [NOXH_TAG_THAM_DINH_VAY.slug]:
    "Tự kiểm tra tuổi vay, thu nhập, CIC và checklist trước khi cọc hoặc nộp hồ sơ.",
  [NOXH_TAG_DU_AN_GIA.slug]:
    "Giá bán, tiến độ, so sánh dự án và cập nhật thị trường NOXH.",
  [NOXH_TAG_HA_TANG.slug]:
    "Quy hoạch, metro/đường vành đai và các trục tăng trưởng ở TP.HCM và Vùng Thủ đô.",
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
  [NOXH_TAG_HN_EAST.slug]:
    "Trục Đông – Đông Nam Vùng Thủ đô: Hà Nội – Hưng Yên – Hải Phòng – Quảng Ninh; cao tốc 5B / ven biển.",
  [NOXH_TAG_HN_AIRPORT.slug]:
    "Trục Nội Bài – Bắc sông Hồng: Võ Nguyên Giáp, Đông Anh, Sóc Sơn, Mê Linh.",
  [NOXH_TAG_HN_RING4.slug]:
    "Vành đai 4 Vùng Thủ đô (~113,5 km): Hà Nội – Hưng Yên – Bắc Ninh; đô thị vệ tinh quanh nút giao.",
  [NOXH_TAG_HN_WEST.slug]:
    "Đại lộ Thăng Long – Hòa Lạc: công nghệ, giáo dục bậc cao, Nam Từ Liêm / Mỹ Đình.",
  [NOXH_TAG_HN_SOUTHWEST.slug]:
    "Tây Nam Vùng Thủ đô: Hà Nam – Ninh Bình; QL1A, Pháp Vân – Cầu Giẽ, công nghiệp sạch và sinh thái.",
  [NOXH_TAG_BTR.slug]:
    "Nhà ở xây để cho thuê dài hạn: chính sách, hợp đồng dài hạn và vận hành thuê chuyên nghiệp.",
};

/** 301 slug chủ đề cũ → hub đúng silo. */
export const LEGACY_NOXH_TOPIC_REDIRECTS: Record<string, string> = {
  noxh: WIKI_PATH,
  "goc-chuyen-gia": WIKI_PATH,
  "phap-ly": `${WIKI_PATH}/chu-de/${NOXH_TAG_CHINH_SACH.slug}`,
  "tien-do-du-an": `${WIKI_PATH}/chu-de/${NOXH_TAG_DU_AN_GIA.slug}`,
  "dau-tu": `${WIKI_PATH}/chu-de/${NOXH_TAG_DU_AN_GIA.slug}`,
  "ha-tang-giao-thong": `${RE_KNOWLEDGE_PATH}/chu-de/${NOXH_TAG_HA_TANG.slug}`,
  "do-thi-ve-tinh-tod": `${RE_KNOWLEDGE_PATH}/chu-de/${NOXH_TAG_AIRPORT.slug}`,
  "nha-o-xa-hoi-ly-thuong-kiet": WIKI_PATH,
  "dta-happy-home-nhon-trach": `${RE_KNOWLEDGE_PATH}/chu-de/${NOXH_TAG_EAST_COAST.slug}`,
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

/** Cụm phụ trên Wiki — chỉ dự án/giá NOXH. */
export const NOXH_HANDBOOK_SECONDARY_CLUSTERS = [
  {
    ...NOXH_TAG_DU_AN_GIA,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[NOXH_TAG_DU_AN_GIA.slug],
  },
] as const;

/** Cụm chủ đề trên hub Kiến thức BĐS. */
export const GENERAL_RE_KNOWLEDGE_CLUSTERS = GENERAL_RE_KNOWLEDGE_TAGS.map(
  (t) => ({
    ...t,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[t.slug],
  }),
);

export function isNoxhHandbookArticle(
  article: Pick<ArticleCardData, "slug" | "tags">,
): boolean {
  if (PHONG_THUY_ONLY_ARTICLE_SLUGS.has(article.slug)) return false;
  return article.tags.some((t) => NOXH_HANDBOOK_TAG_SLUGS.has(t.slug));
}

export function isGeneralReKnowledgeArticle(
  article: Pick<ArticleCardData, "slug" | "tags">,
): boolean {
  if (PHONG_THUY_ONLY_ARTICLE_SLUGS.has(article.slug)) return false;
  return article.tags.some((t) => GENERAL_RE_TAG_SLUGS.has(t.slug));
}

export function handbookTagSummaries(): ArticleTagSummary[] {
  return NOXH_JOURNEY_TAGS.map((t) => ({
    slug: t.slug,
    name: t.name,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[t.slug] ?? "",
    articleCount: 0,
  }));
}

export function generalReKnowledgeTagSummaries(): ArticleTagSummary[] {
  return GENERAL_RE_KNOWLEDGE_TAGS.map((t) => ({
    slug: t.slug,
    name: t.name,
    description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[t.slug] ?? "",
    articleCount: 0,
  }));
}
