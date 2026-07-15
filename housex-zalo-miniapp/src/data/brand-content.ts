/** Đồng bộ Proptech-HouseX/lib/content/messaging/brand.ts + housex-logo-assets.ts */

export const BRAND_TAGLINE_EN = "Smart Tools · Trusted Utility";

export const BRAND_TAGLINE_VN =
  "Công cụ mua nhà thông minh — minh bạch từ điều kiện đến vay";

/**
 * Logo nhúng trong gói Mini App (`public/brand/` → `www/brand/` sau build).
 * Dùng path tương đối `./` — Zalo CDN không resolve được `/brand/...` tuyệt đối.
 */
export const HOUSEX_LOGO_SRC = "./brand/housex-footer-logo-transparent.png";
