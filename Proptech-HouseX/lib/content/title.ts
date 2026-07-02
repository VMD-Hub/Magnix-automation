import { TRANSACTION_TYPE_LABEL, propertyTypeLabel } from "@/lib/format";

export type ListingTitleInput = {
  transactionType: string;
  propertyType: string;
  area?: number | null;
  district: string;
  province: string;
  project?: { name: string } | null;
  /** Tiêu đề biên tập (hook SEO) — ưu tiên hơn template mặc định. */
  title?: string | null;
  code?: string;
};

type TitleInput = ListingTitleInput;

/**
 * Sinh tiêu đề listing chuẩn cho SEO (thay vì để mỗi tin tự đặt tiêu đề lệch
 * chuẩn / spam keyword). Template: "{giao dịch} {loại} {diện tích} tại {nơi}".
 */
export function buildListingTitle(l: TitleInput): string {
  const parts = [
    TRANSACTION_TYPE_LABEL[l.transactionType] ?? l.transactionType,
    propertyTypeLabel(l.propertyType),
  ];
  if (l.area) parts.push(`${l.area}m²`);
  const place = l.project?.name ?? l.district;
  return `${parts.join(" ")} tại ${place}, ${l.province}`;
}

/** Tiêu đề hiển thị H1 / JSON-LD — ưu tiên title biên tập, fallback template chuẩn. */
export function resolveListingDisplayTitle(l: ListingTitleInput): string {
  const custom = l.title?.trim();
  if (custom) return custom;
  return buildListingTitle(l);
}

/** Meta `<title>` — gắn mã tin nếu chưa có trong headline. */
export function resolveListingMetaTitle(l: ListingTitleInput): string {
  const display = resolveListingDisplayTitle(l);
  if (l.code && !display.includes(l.code)) {
    return `${display} — ${l.code}`;
  }
  return display;
}
