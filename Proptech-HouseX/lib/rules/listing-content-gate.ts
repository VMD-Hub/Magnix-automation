import { hammingDistance } from "../content/simhash";
import type { FingerprintResult } from "../content/fingerprint";

/** Ngưỡng near-dupe (số bit khác nhau của SimHash). Mặc định 3/64. */
export const NEAR_DUPE_BITS = Number(process.env.CONTENT_NEAR_DUPE_BITS ?? "3");

export type ContentCandidate = {
  listingId: string;
  brokerId: string;
  dupeKey: string;
  contentHash: string;
};

export type ContentGateResult =
  | { decision: "ok" }
  | {
      decision: "hard_dupe";
      code: "DUPLICATE_LISTING" | "NEAR_DUPLICATE_LISTING";
      message: string;
      matchedListingId: string;
    };

/**
 * Rule P1 — Content dedup gate (pure).
 *
 * - Hard dupe: cùng `dupeKey` (cùng broker + cùng BĐS) → chặn (đăng lại y hệt).
 * - Near dupe cùng broker: SimHash mô tả gần giống (đổi câu chữ) → chặn spam.
 * - Khác broker dù gần giống → KHÔNG chặn (đó là nhiều broker cùng bán 1 BĐS,
 *   sẽ gom về CanonicalProperty thay vì từ chối).
 */
export function evaluateContent(params: {
  brokerId: string;
  fingerprint: FingerprintResult;
  candidates: ContentCandidate[];
  nearThreshold?: number;
}): ContentGateResult {
  const { brokerId, fingerprint, candidates } = params;
  const threshold = params.nearThreshold ?? NEAR_DUPE_BITS;

  const exact = candidates.find((c) => c.dupeKey === fingerprint.dupeKey);
  if (exact) {
    return {
      decision: "hard_dupe",
      code: "DUPLICATE_LISTING",
      message: "Tin đăng trùng (cùng BĐS, cùng môi giới) đã tồn tại.",
      matchedListingId: exact.listingId,
    };
  }

  const nearSameBroker = candidates.find(
    (c) =>
      c.brokerId === brokerId &&
      hammingDistance(fingerprint.contentHash, c.contentHash) <= threshold,
  );
  if (nearSameBroker) {
    return {
      decision: "hard_dupe",
      code: "NEAR_DUPLICATE_LISTING",
      message:
        "Nội dung gần trùng với tin bạn đã đăng (đổi câu chữ không đủ khác biệt).",
      matchedListingId: nearSameBroker.listingId,
    };
  }

  return { decision: "ok" };
}
