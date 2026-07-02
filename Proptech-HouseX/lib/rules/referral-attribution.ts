/**
 * Rule #3 — Lead attribution (first-touch).
 *
 * Khi khách bấm link `Referral.code`:
 *   - tăng `Referral.clickCount += 1`
 *   - lưu `code` vào cookie httpOnly (first-touch: KHÔNG ghi đè nếu đã có)
 * Khi khách submit form tạo `Lead`, nếu cookie tồn tại → gán `Lead.referralId`.
 * Một khi đã gán thì KHÔNG cho sửa lại (chống tranh giành khách giữa broker).
 */

export const REFERRAL_COOKIE = "mx_ref";
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 ngày

export const referralCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: REFERRAL_COOKIE_MAX_AGE,
  secure: process.env.NODE_ENV === "production",
};

/** Sinh mã referral public, dạng `RF-XXXXXXXX`. */
export function generateReferralCode(): string {
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `RF-${rand}`;
}

type RedirectableReferral = {
  type: "CTV_PROJECT" | "SHARE_LISTING";
  project?: { slug: string } | null;
  listing?: { code: string } | null;
};

/** Đích redirect tương ứng loại referral; null nếu thiếu dữ liệu liên kết. */
export function resolveReferralTarget(
  referral: RedirectableReferral,
): string | null {
  if (referral.type === "CTV_PROJECT" && referral.project) {
    return `/du-an/${referral.project.slug}`;
  }
  if (referral.type === "SHARE_LISTING" && referral.listing) {
    return `/tin-dang/${referral.listing.code}`;
  }
  return null;
}
