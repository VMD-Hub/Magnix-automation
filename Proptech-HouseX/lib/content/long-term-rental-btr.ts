import { NOXH_TAG_BTR } from "@/lib/content/articles/noxh-handbook-tags";
import { topicPath } from "@/lib/content/article-routes";

/**
 * Silo SEO Nhà ở cho thuê dài hạn (Build-to-Rent) — GENERAL_POLICY.
 * Hub: Kiến thức BĐS (`/tin-tuc/kien-thuc`); soft-link NOXH / corridors khi cần.
 */

export type BtrToneGroup =
  | "policy-macro"
  | "mindset-culture"
  | "corridor-tod"
  | "cashflow-ops";

export type BtrArticleMeta = {
  slug: string;
  toneGroup: BtrToneGroup;
  isPillar?: boolean;
};

export const BTR_PILLAR_SLUG =
  "chinh-sach-nha-o-cho-thue-dai-han-tru-cot-an-cu-2030" as const;

export const BTR_TAG_SLUG = NOXH_TAG_BTR.slug;

export const BTR_HUB_PATH = topicPath(NOXH_TAG_BTR.slug);

export const BTR_ARTICLE_META: Readonly<Record<string, BtrArticleMeta>> = {
  "mo-hinh-build-to-rent-nha-o-cho-thue-dai-han-tai-cau-truc-2026": {
    slug: "mo-hinh-build-to-rent-nha-o-cho-thue-dai-han-tai-cau-truc-2026",
    toneGroup: "policy-macro",
  },
  [BTR_PILLAR_SLUG]: {
    slug: BTR_PILLAR_SLUG,
    toneGroup: "policy-macro",
    isPillar: true,
  },
  "hop-dong-thue-nha-dai-han-15-20-nam-lech-pha-cung-cau-2026": {
    slug: "hop-dong-thue-nha-dai-han-15-20-nam-lech-pha-cung-cau-2026",
    toneGroup: "policy-macro",
  },
  "gia-nha-vuot-kha-nang-co-nen-thue-dai-han-2026": {
    slug: "gia-nha-vuot-kha-nang-co-nen-thue-dai-han-2026",
    toneGroup: "mindset-culture",
  },
  "thue-can-ho-dai-han-vs-chung-cu-mini-phong-tro-2026": {
    slug: "thue-can-ho-dai-han-vs-chung-cu-mini-phong-tro-2026",
    toneGroup: "mindset-culture",
  },
  "quyen-loi-nguoi-thue-nha-o-cho-thue-the-he-moi-2026": {
    slug: "quyen-loi-nguoi-thue-nha-o-cho-thue-the-he-moi-2026",
    toneGroup: "mindset-culture",
  },
  "tod-vanh-dai-nha-o-cho-thue-dai-han-2026": {
    slug: "tod-vanh-dai-nha-o-cho-thue-dai-han-2026",
    toneGroup: "corridor-tod",
  },
  "can-ho-cho-thue-chuyen-gia-truc-ql13-vanh-dai-4-2026": {
    slug: "can-ho-cho-thue-chuyen-gia-truc-ql13-vanh-dai-4-2026",
    toneGroup: "corridor-tod",
  },
  "dong-von-dau-tu-can-ho-cho-thue-dai-han-2026": {
    slug: "dong-von-dau-tu-can-ho-cho-thue-dai-han-2026",
    toneGroup: "cashflow-ops",
  },
  "du-an-can-ho-van-hanh-cho-thue-dai-han-2026": {
    slug: "du-an-can-ho-van-hanh-cho-thue-dai-han-2026",
    toneGroup: "cashflow-ops",
  },
  "tinh-dong-tien-don-bay-can-ho-cho-thue-2026": {
    slug: "tinh-dong-tien-don-bay-can-ho-cho-thue-2026",
    toneGroup: "cashflow-ops",
  },
  "thue-cho-thue-nha-2026-ma-nganh-68103": {
    slug: "thue-cho-thue-nha-2026-ma-nganh-68103",
    toneGroup: "cashflow-ops",
  },
};

export function getBtrArticleMeta(slug: string): BtrArticleMeta | null {
  return BTR_ARTICLE_META[slug] ?? null;
}

export function isBtrPillarSlug(slug: string): boolean {
  return slug === BTR_PILLAR_SLUG;
}
