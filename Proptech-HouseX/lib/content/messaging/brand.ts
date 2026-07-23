/** L0 — Brand promise (logo, header, footer). */

import { HOUSEX_FOOTER_TAGLINE } from "@/lib/brand/housex-logo-assets";

/** Tagline dưới logo / header — đồng bộ lockup. */
export const BRAND_TAGLINE_HEADER = HOUSEX_FOOTER_TAGLINE;

/** Tagline đầy đủ — footer lockup / alt text. */
export const BRAND_TAGLINE = HOUSEX_FOOTER_TAGLINE;

/** Mô tả thương hiệu VN — footer blurb, email. */
export const BRAND_TAGLINE_FOOTER =
  "Nền tảng số tìm nhà Việt Nam — wiki nhà ở xã hội, vay mua nhà, tính trả góp và dự án minh bạch trên House X." as const;

export const SEO_TITLE_DEFAULT =
  `House X — ${HOUSEX_FOOTER_TAGLINE}` as const;

export const SEO_DESCRIPTION_DEFAULT =
  "House X — nền tảng số tìm nhà Việt Nam (timnhaxahoi.com): wiki nhà ở xã hội, hỗ trợ hồ sơ vay, tính trả góp và dự án — thông tin có căn cứ để quyết định." as const;
