import type { Prisma } from "@prisma/client";

type DecimalLike = Prisma.Decimal | number | string | null | undefined;

/** Format a VND price. Accepts Prisma.Decimal, number or string. */
export function formatVnd(value: DecimalLike): string | null {
  if (value == null) return null;
  const num = typeof value === "number" ? value : Number(value.toString());
  if (!Number.isFinite(num)) return null;

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toLocaleString("vi-VN", {
      maximumFractionDigits: 2,
    })} tỷ`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toLocaleString("vi-VN", {
      maximumFractionDigits: 1,
    })} triệu`;
  }
  return `${num.toLocaleString("vi-VN")} đ`;
}

/** Giá trên mỗi m² (chống giá ảo). Trả "≈ 57 triệu/m²". */
export function formatPricePerM2(
  price: DecimalLike,
  area?: number | null,
): string | null {
  if (price == null || area == null || area <= 0) return null;
  const num = typeof price === "number" ? price : Number(price.toString());
  if (!Number.isFinite(num)) return null;
  const perM2 = num / area;
  if (perM2 >= 1_000_000) {
    return `≈ ${(perM2 / 1_000_000).toLocaleString("vi-VN", {
      maximumFractionDigits: 1,
    })} triệu/m²`;
  }
  return `≈ ${Math.round(perM2).toLocaleString("vi-VN")} đ/m²`;
}

export function formatArea(min?: number | null, max?: number | null): string | null {
  if (min != null && max != null && min !== max) return `${min}–${max} m²`;
  const single = min ?? max;
  return single != null ? `${single} m²` : null;
}

export const PROJECT_STATUS_LABEL: Record<string, string> = {
  SAP_MO_BAN: "Sắp mở bán",
  DANG_BAN: "Đang bán",
  DA_BAN_GIAO: "Đã bàn giao",
  TAM_DUNG: "Tạm dừng",
};

export const ARTICLE_STATUS_LABEL: Record<string, string> = {
  DRAFT: "Nháp",
  PUBLISHED: "Đã xuất bản",
  ARCHIVED: "Lưu trữ",
};

export const PROJECT_TYPE_LABEL: Record<string, string> = {
  THUONG_MAI: "Thương mại",
  NHA_O_XA_HOI: "Nhà ở xã hội",
};

export const TRANSACTION_TYPE_LABEL: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
};

export const LISTING_TIER_LABEL: Record<string, string> = {
  FREE: "Thường",
  VIP: "VIP",
  PREMIUM: "Premium",
};

export const PROJECT_UNIT_STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Còn trống",
  HELD: "Đang giữ chỗ",
  BOOKED: "Đã booking",
  DEPOSITED: "Đã cọc",
  SOLD: "Đã bán",
  HANDED_OVER: "Đã bàn giao",
  LIQUIDATED: "Thanh lý",
};

export const LISTING_STATUS_LABEL: Record<string, string> = {
  DRAFT: "Nháp",
  PENDING_REVIEW: "Chờ duyệt",
  ACTIVE: "Đang hiển thị",
  EXPIRED: "Hết hạn",
  SOLD: "Đã bán",
  REJECTED: "Bị từ chối",
};

export const PROPERTY_TYPE_LABEL: Record<string, string> = {
  can_ho: "Căn hộ",
  can_ho_dich_vu: "Căn hộ dịch vụ",
  phong_tro: "Phòng trọ",
  nha_pho: "Nhà phố",
  biet_thu: "Biệt thự",
  dat_nen: "Đất nền",
  van_phong: "Văn phòng",
  shophouse: "Shophouse",
};

export function propertyTypeLabel(value: string): string {
  return PROPERTY_TYPE_LABEL[value] ?? value;
}

export const LEGAL_DOC_LABEL: Record<string, string> = {
  giay_phep_xay_dung: "Giấy phép xây dựng",
  "1_50": "Quy hoạch 1/500",
  quy_hoach_1_500: "Quy hoạch 1/500",
  giay_chung_nhan_dau_tu: "Giấy chứng nhận đầu tư",
  chap_thuan_noxh: "Chấp thuận chủ trương NOXH",
  dieu_kien_kinh_doanh_bdshtl: "Điều kiện kinh doanh BĐSHTL",
  danh_gia_tac_dong_moi_truong: "Báo cáo ĐTM",
  pheduyet_thiet_ke_ky_thuat: "Phê duyệt TKKT thi công",
};

export const LEGAL_DOC_STATUS_LABEL: Record<string, string> = {
  da_co: "Đã có",
  dang_lam: "Đang làm",
  chua_co: "Chưa có",
};

export function legalDocLabel(docType: string): string {
  return LEGAL_DOC_LABEL[docType] ?? docType.replaceAll("_", " ");
}

export const COMMISSION_STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  PAID: "Đã chi trả",
  REJECTED: "Từ chối",
};

export const LEAD_STATUS_LABEL: Record<string, string> = {
  NEW: "Mới",
  CONTACTED: "Đã liên hệ",
  QUALIFIED: "Đạt chuẩn",
  WON: "Chốt thành công",
  LOST: "Thất bại",
};

export const UNIT_BOOKING_STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đang giữ suất",
  EXPIRED: "Hết hạn",
  CANCELLED: "Đã huỷ",
  CONVERTED_TO_DEPOSIT: "Đã chuyển cọc",
};
