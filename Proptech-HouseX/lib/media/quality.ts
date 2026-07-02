/**
 * Tiêu chuẩn chất lượng media (rule P1) — vừa là điều kiện duyệt, vừa là tín hiệu
 * ranking sau này. Giá trị có thể chỉnh qua env.
 */
export const MEDIA_LIMITS = {
  minImagePx: Number(process.env.MEDIA_MIN_IMAGE_PX ?? "1024"),
  minVideoHeight: Number(process.env.MEDIA_MIN_VIDEO_HEIGHT ?? "720"),
  minVideoSec: Number(process.env.MEDIA_MIN_VIDEO_SEC ?? "5"),
  maxVideoSec: Number(process.env.MEDIA_MAX_VIDEO_SEC ?? "120"),
};

export type MediaKind = "image" | "video";

export interface MediaMeta {
  kind: MediaKind;
  width?: number | null;
  height?: number | null;
  durationSec?: number | null;
}

export type QualityResult = { ok: true } | { ok: false; reasons: string[] };

/** Đánh giá chất lượng media từ metadata (không cần giải mã file ở web-VPS). */
export function evaluateMediaQuality(meta: MediaMeta): QualityResult {
  const reasons: string[] = [];

  if (meta.kind === "image") {
    const minSide = Math.min(meta.width ?? 0, meta.height ?? 0);
    if (minSide < MEDIA_LIMITS.minImagePx) {
      reasons.push(
        `Ảnh phải có cạnh ngắn ≥ ${MEDIA_LIMITS.minImagePx}px (hiện ${minSide}px).`,
      );
    }
  } else {
    if ((meta.height ?? 0) < MEDIA_LIMITS.minVideoHeight) {
      reasons.push(
        `Video phải ≥ ${MEDIA_LIMITS.minVideoHeight}p (hiện ${meta.height ?? 0}p).`,
      );
    }
    const dur = meta.durationSec ?? 0;
    if (dur < MEDIA_LIMITS.minVideoSec || dur > MEDIA_LIMITS.maxVideoSec) {
      reasons.push(
        `Video dài ${MEDIA_LIMITS.minVideoSec}–${MEDIA_LIMITS.maxVideoSec}s (hiện ${dur}s).`,
      );
    }
  }

  return reasons.length === 0 ? { ok: true } : { ok: false, reasons };
}
