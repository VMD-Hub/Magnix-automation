/** Slug campaign Phase 1 — seed mặc định. */
export const DEFAULT_PROMOTION_SLUG = "khai-xuan-housex-2026";

export const PROMOTION_LIMITS = {
  maxSpinsPerAccount: 6,
  maxSpinsPerDay: 3,
  spinDurationMs: 8000,
  wheelSegments: 12,
} as const;

/** Khách chưa đăng nhập — quay thử, lưu sau khi claim. */
export const PROMOTION_GUEST_LIMITS = {
  maxSpinsPerDay: 2,
  claimTtlSec: 1800,
} as const;
