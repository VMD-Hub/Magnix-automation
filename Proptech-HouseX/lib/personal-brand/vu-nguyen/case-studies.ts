/**
 * Case studies — dữ liệu cho pipeline SEO website (không render trên /vu-nguyen).
 * Draft: docs/strategy/personal-brand/.../sale-kit/
 */

import { getSiteUrl } from "@/lib/site-config";

export type VuNguyenCaseStudySummary = {
  slug: string;
  title: string;
  outcome: string;
  segment: string;
};

export type VuNguyenCaseStudyAccent = "finance" | "legal" | "education";

export type VuNguyenCaseSlide = {
  headline: string;
  line: string;
};

export type VuNguyenCaseStudyDeck = {
  accent: VuNguyenCaseStudyAccent;
  slides: readonly VuNguyenCaseSlide[];
};

export type VuNguyenCaseStudyArticle = VuNguyenCaseStudySummary & {
  kicker: string;
  disclaimer: string;
  deck: VuNguyenCaseStudyDeck;
};

export const VU_NGUYEN_CASE_PATH_PREFIX = "/vu-nguyen/case" as const;

export function getVuNguyenCaseUrl(slug: string): string {
  return `${getSiteUrl()}${VU_NGUYEN_CASE_PATH_PREFIX}/${slug}`;
}

export const CASE_CAI_BAY_DTI_SLUG = "cai-bay-dti" as const;
export const CASE_TU_VAN_HO_SO_NOXH_SLUG = "tu-van-ho-so-noxh-k200" as const;
export const CASE_CON_MO_NHA_PHO_SLUG = "con-mo-nha-pho" as const;

export const CASE_CAI_BAY_DTI: VuNguyenCaseStudyArticle = {
  slug: CASE_CAI_BAY_DTI_SLUG,
  title: "Cái bẫy DTI",
  outcome: "Dừng trước cọc · căn nhỏ hơn · còn thở được",
  segment: "Case 01",
  kicker: "Ẩn danh · Tài chính",
  disclaimer: "Case minh họa. Không cam kết kết quả vay cho mọi hồ sơ.",
  deck: {
    accent: "finance",
    slides: [
      { headline: "60 triệu / tháng", line: "Mơ căn 6,3 tỷ cho thuê" },
      { headline: "«Vay 70% được»", line: "Booking 50 triệu · sắp cọc" },
      { headline: "39 triệu", line: "Một tháng — mới chỉ trả lãi" },
      { headline: "20 triệu", line: "Căn 3,2 tỷ · cùng ngân hàng" },
      { headline: "Chị L.T.", line: "Vẫn đi tiếp. Còn thở được." },
    ],
  },
};

export const CASE_TU_VAN_HO_SO_NOXH: VuNguyenCaseStudyArticle = {
  slug: CASE_TU_VAN_HO_SO_NOXH_SLUG,
  title: "Hồ sơ NOXH",
  outcome: "Mua DTA Happy Home · hồ sơ sạch · một lần",
  segment: "Case 02",
  kicker: "Ẩn danh · Pháp lý",
  disclaimer: "Case minh họa. Điều kiện NOXH theo thẩm định từng hồ sơ.",
  deck: {
    accent: "legal",
    slides: [
      { headline: "Anh T.", line: "NOXH cho gia đình — con còn nhỏ" },
      { headline: "«Chỉ giúp kê hồ sơ»", line: "Trong khi anh đã có nhà" },
      { headline: "Không nộp", line: "Bộ hồ sơ không trung thực" },
      { headline: "DTA Happy Home", line: "Đồng Nai · làm đúng một lần" },
      { headline: "Có chìa khóa", line: "Nhà sạch — con sau này đứng được" },
    ],
  },
};

export const CASE_CON_MO_NHA_PHO: VuNguyenCaseStudyArticle = {
  slug: CASE_CON_MO_NHA_PHO_SLUG,
  title: "160 triệu",
  outcome: "Chưa có nhà · đã biết đường đi",
  segment: "Case 03",
  kicker: "Ẩn danh · Thị trường",
  disclaimer: "Case minh họa. Chưa mua dự án tại thời điểm ghi nhận.",
  deck: {
    accent: "education",
    slides: [
      { headline: "160 triệu", line: "Tìm nhà phố có sổ" },
      { headline: "Đất nền xa", line: "Chưa đường · chưa điện" },
      { headline: "Vài tỷ", line: "Nhà phố thật — không cùng 160 triệu" },
      { headline: "Chưa có chìa khóa", line: "Thật." },
      { headline: "Chị X.", line: "Biết mình đang đi đâu" },
    ],
  },
};

const CASE_REGISTRY: Record<string, VuNguyenCaseStudyArticle> = {
  [CASE_CAI_BAY_DTI_SLUG]: CASE_CAI_BAY_DTI,
  [CASE_TU_VAN_HO_SO_NOXH_SLUG]: CASE_TU_VAN_HO_SO_NOXH,
  [CASE_CON_MO_NHA_PHO_SLUG]: CASE_CON_MO_NHA_PHO,
};

export function getVuNguyenCaseStudy(slug: string): VuNguyenCaseStudyArticle | null {
  return CASE_REGISTRY[slug] ?? null;
}

export function getVuNguyenCaseStudySlugs(): string[] {
  return Object.keys(CASE_REGISTRY);
}

export const VU_NGUYEN_CASE_SUMMARIES: readonly VuNguyenCaseStudySummary[] = [
  {
    slug: CASE_CAI_BAY_DTI.slug,
    title: CASE_CAI_BAY_DTI.title,
    outcome: CASE_CAI_BAY_DTI.outcome,
    segment: CASE_CAI_BAY_DTI.segment,
  },
  {
    slug: CASE_TU_VAN_HO_SO_NOXH.slug,
    title: CASE_TU_VAN_HO_SO_NOXH.title,
    outcome: CASE_TU_VAN_HO_SO_NOXH.outcome,
    segment: CASE_TU_VAN_HO_SO_NOXH.segment,
  },
  {
    slug: CASE_CON_MO_NHA_PHO.slug,
    title: CASE_CON_MO_NHA_PHO.title,
    outcome: CASE_CON_MO_NHA_PHO.outcome,
    segment: CASE_CON_MO_NHA_PHO.segment,
  },
];
