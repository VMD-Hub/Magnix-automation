/**
 * Hồ sơ chuyên gia, nguồn pháp lý và resolver — tín hiệu E-E-A-T / AIO.
 */

import { CURRENT_NOXH_RULES } from "@/lib/finance/noxh-rules";
import { BRAND_NAME } from "@/lib/site-config";

/** Nhãn tác giả thống nhất trên bài viết & công cụ (không dùng tên cá nhân ở byline). */
export const EDITORIAL_BYLINE = `Ban biên tập ${BRAND_NAME}` as const;

export type EditorialExpert = {
  slug: string;
  name: string;
  jobTitle: string;
  knowsAbout: string[];
  bio: string;
  credentials: string[];
};

export type LegalSourceRef = {
  id: string;
  /** Nhãn hiển thị ngắn. */
  label: string;
  /** Trích dẫn pháp lý (số hiệu, Điều/khoản). */
  cite: string;
  url: string;
  /** ISO hoặc mô tả hiệu lực — hiển thị UI. */
  effectiveNote?: string;
};

/** Nguồn pháp lý NOXH — dùng chung bài viết, FAQ, công cụ. */
export const NOXH_LEGAL_SOURCES: LegalSourceRef[] = [
  {
    id: "luat-nha-o-2023",
    label: "Luật Nhà ở 2023",
    cite: "27/2023/QH15 — Điều 76 (đối tượng), Điều 78 (điều kiện mua/thuê mua)",
    url: "https://vanban.chinhphu.vn/?docid=209627&pageid=27160",
  },
  {
    id: "nd-100-2024",
    label: "Nghị định 100/2024/NĐ-CP",
    cite: "Điều 29 (nhà ở), Điều 30 (thu nhập), thủ tục xác nhận",
    url: "https://vanban.chinhphu.vn/?docid=210760&pageid=27160",
  },
  {
    id: "nd-136-2026",
    label: "Nghị định 136/2026/NĐ-CP",
    cite: "Sửa trần thu nhập: 25 / 35 / 50 triệu/tháng",
    url: "https://vanban.chinhphu.vn/?classid=1&docid=217605&pageid=27160",
    effectiveNote: "Hiệu lực 07/04/2026",
  },
];

/** Nguồn tham chiếu thị trường / báo chí — discovery T1 (ADR-016 trust ladder).
 * Không thay công bố Sở (T2) hay SoR mở bán (T4).
 * Allowlist ops: docs/INFO_TRUST_LADDER_ALLOWLIST.md
 */
export const NOXH_MEDIA_SOURCES: LegalSourceRef[] = [
  {
    id: "vnexpress-noxh",
    label: "VnExpress",
    cite: "Tin công bố giá & hồ sơ NOXH TP.HCM",
    url: "https://vnexpress.net/bat-dong-san/nha-o-xa-hoi",
  },
  {
    id: "moc-gov",
    label: "Bộ Xây dựng",
    cite: "Chính sách nhà ở xã hội",
    url: "https://moc.gov.vn/",
  },
];

export const HOUSEX_EXPERTS: Record<string, EditorialExpert> = {
  "noxh-policy": {
    slug: "noxh-policy",
    name: "Nguyễn Vũ",
    jobTitle: "Biên tập viên / Luật sư / Chuyên gia Nhà Ở Xã Hội",
    knowsAbout: [
      "Nhà ở xã hội",
      "Luật Nhà ở 2023",
      "Nghị định 100/2024",
      "Vay NHCSXH",
      "Điều kiện đối tượng Điều 76",
      "Thủ tục xác nhận đối tượng NOXH",
    ],
    bio: "Nguyễn Vũ biên tập và rà soát nội dung NOXH trên House X: đối chiếu văn bản tại Cổng Thông tin Chính phủ, thông báo Sở Xây dựng và nguồn báo chí được trích dẫn. Các chủ đề thu nhập, vay, điều kiện đối tượng và thủ tục được cập nhật khi có nghị định mới; mỗi bài được rà soát giọng văn và nguồn trước khi xuất bản.",
    credentials: [
      "Đối chiếu văn bản tại vanban.chinhphu.vn trước mỗi đợt cập nhật số liệu",
      "Phân tách rõ nội dung tổng hợp và công bố chính thức của cơ quan NN / CĐT",
      "Không cam kết lãi suất hoặc giá nếu chưa được công bố chính thức",
    ],
  },
};

const NOXH_TRUST_TAGS = new Set([
  "noxh",
  "phap-ly",
  "goc-chuyen-gia",
  "chon-noxh-dung-cach",
  "tham-dinh-vay-noxh",
  "nha-o-xa-hoi-ly-thuong-kiet",
  "dta-happy-home-nhon-trach",
]);

export function getExpertBySlug(slug: string): EditorialExpert | null {
  return HOUSEX_EXPERTS[slug] ?? null;
}

export function listExpertSlugs(): string[] {
  return Object.keys(HOUSEX_EXPERTS);
}

/** Gán chuyên gia theo chủ đề bài viết. */
export function resolveExpertForTags(tagSlugs: string[]): EditorialExpert | null {
  if (tagSlugs.some((t) => NOXH_TRUST_TAGS.has(t))) {
    return HOUSEX_EXPERTS["noxh-policy"] ?? null;
  }
  return null;
}

/** Nguồn căn cứ hiển thị cuối bài / công cụ. */
export function resolveSourcesForTags(tagSlugs: string[]): LegalSourceRef[] {
  if (tagSlugs.some((t) => NOXH_TRUST_TAGS.has(t))) {
    return [...NOXH_LEGAL_SOURCES, ...NOXH_MEDIA_SOURCES];
  }
  return [];
}

/** Trust panel chuẩn cho danh mục NOXH, hub chủ đề và công cụ. */
export function getNoxhEditorialTrust() {
  return {
    expert: HOUSEX_EXPERTS["noxh-policy"] ?? null,
    sources: [...NOXH_LEGAL_SOURCES, ...NOXH_MEDIA_SOURCES],
    updatedAt: new Date(CURRENT_NOXH_RULES.effectiveFrom),
  };
}

export function formatEditorialDate(d: Date): string {
  return d.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const EDITORIAL_METHODOLOGY_PATH = "/gioi-thieu/phuong-phap-bien-tap" as const;

export function expertProfilePath(slug: string): string {
  return `/chuyen-gia/${slug}`;
}
