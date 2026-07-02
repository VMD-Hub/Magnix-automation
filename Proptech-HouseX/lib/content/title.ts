import { TRANSACTION_TYPE_LABEL, propertyTypeLabel } from "@/lib/format";

type TitleInput = {
  transactionType: string;
  propertyType: string;
  area?: number | null;
  district: string;
  province: string;
  project?: { name: string } | null;
};

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
