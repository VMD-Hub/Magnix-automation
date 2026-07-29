import type { RuleResult } from "./listing-rules";
import type { TransactionType } from "@prisma/client";

/**
 * P2 — Media/quality gate khi PUBLISH (chuyển sang ACTIVE).
 * Tiêu chuẩn tối thiểu để tin lên feed (ADR §10):
 *  - ≥ LISTING_MIN_PHOTOS ảnh READY,
 *  - mô tả ≥ LISTING_MIN_DESC_LEN ký tự,
 *  - nếu có video thì TẤT CẢ video phải READY (không để tin lên khi đang transcode/REJECTED).
 * ADR-018 Wave 0 — tin RENT: giá > 0, loại hình thuê hợp lệ, diện tích bắt buộc với căn hộ/CHDV.
 */
export const LISTING_GATE = {
  minPhotos: Number(process.env.LISTING_MIN_PHOTOS ?? "5"),
  minDescLen: Number(process.env.LISTING_MIN_DESC_LEN ?? "50"),
};

/** Loại hình cho phép đăng thuê (khớp filter /cho-thue). */
export const RENT_PUBLISH_PROPERTY_TYPES = new Set([
  "can_ho",
  "can_ho_dich_vu",
  "phong_tro",
  "nha_pho",
  "biet_thu",
  "shophouse",
  "van_phong",
  "dat_nen",
]);

/** Căn hộ / CHDV bắt buộc có diện tích khi publish thuê. */
const RENT_AREA_REQUIRED_TYPES = new Set(["can_ho", "can_ho_dich_vu"]);

export interface PublishGateInput {
  readyImageCount: number;
  totalVideoCount: number;
  readyVideoCount: number;
  descriptionLength: number;
  transactionType?: TransactionType | string | null;
  price?: number | string | null;
  propertyType?: string | null;
  area?: number | null;
}

function parsePrice(price: PublishGateInput["price"]): number | null {
  if (price == null || price === "") return null;
  const n = typeof price === "number" ? price : Number(price);
  return Number.isFinite(n) ? n : null;
}

export function assertPublishGate(i: PublishGateInput): RuleResult {
  if (i.readyImageCount < LISTING_GATE.minPhotos) {
    return {
      ok: false,
      code: "PHOTO_MIN",
      message: `Cần tối thiểu ${LISTING_GATE.minPhotos} ảnh READY để đăng (hiện ${i.readyImageCount}).`,
    };
  }
  if (i.descriptionLength < LISTING_GATE.minDescLen) {
    return {
      ok: false,
      code: "DESC_MIN",
      message: `Mô tả cần ≥ ${LISTING_GATE.minDescLen} ký tự (hiện ${i.descriptionLength}).`,
    };
  }
  if (i.totalVideoCount > 0 && i.readyVideoCount < i.totalVideoCount) {
    return {
      ok: false,
      code: "VIDEO_NOT_READY",
      message:
        "Có video chưa sẵn sàng (đang transcode hoặc bị từ chối). Đợi READY hoặc gỡ video trước khi đăng.",
    };
  }

  if (i.transactionType === "RENT") {
    const price = parsePrice(i.price);
    if (price == null || price <= 0) {
      return {
        ok: false,
        code: "RENT_PRICE",
        message: "Tin cho thuê cần giá thuê tháng > 0 (hiển thị /tháng trên web).",
      };
    }
    const pt = (i.propertyType ?? "").trim();
    if (!pt || !RENT_PUBLISH_PROPERTY_TYPES.has(pt)) {
      return {
        ok: false,
        code: "RENT_PROPERTY_TYPE",
        message:
          "Tin cho thuê cần loại hình hợp lệ (căn hộ, CHDV, phòng trọ, nhà phố, VP…).",
      };
    }
    if (
      RENT_AREA_REQUIRED_TYPES.has(pt) &&
      (i.area == null || !Number.isFinite(i.area) || i.area <= 0)
    ) {
      return {
        ok: false,
        code: "RENT_AREA",
        message: "Căn hộ / CHDV cho thuê cần diện tích (m²) > 0.",
      };
    }
  }

  return { ok: true };
}
