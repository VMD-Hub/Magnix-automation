import type { RuleResult } from "./listing-rules";

/**
 * P2 — Media/quality gate khi PUBLISH (chuyển sang ACTIVE).
 * Tiêu chuẩn tối thiểu để tin lên feed (ADR §10):
 *  - ≥ LISTING_MIN_PHOTOS ảnh READY,
 *  - mô tả ≥ LISTING_MIN_DESC_LEN ký tự,
 *  - nếu có video thì TẤT CẢ video phải READY (không để tin lên khi đang transcode/REJECTED).
 */
export const LISTING_GATE = {
  minPhotos: Number(process.env.LISTING_MIN_PHOTOS ?? "5"),
  minDescLen: Number(process.env.LISTING_MIN_DESC_LEN ?? "50"),
};

export interface PublishGateInput {
  readyImageCount: number;
  totalVideoCount: number;
  readyVideoCount: number;
  descriptionLength: number;
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
  return { ok: true };
}
