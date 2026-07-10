/** Logo header (nền sáng / auth) — cùng lockup đã duyệt. */
export const HOUSEX_HEADER_LOGO_SRC = "/brand/housex-header-logo.png" as const;
export const HOUSEX_HEADER_LOGO_WIDTH = 1196;
export const HOUSEX_HEADER_LOGO_HEIGHT = 365;

/** Logo footer — nền trong suốt, hiển thị trên footer ruby. */
export const HOUSEX_FOOTER_LOGO_SRC =
  "/brand/housex-footer-logo-transparent.png" as const;
export const HOUSEX_FOOTER_LOGO_WIDTH = 1196;
export const HOUSEX_FOOTER_LOGO_HEIGHT = 365;

/** @deprecated Thay bằng `housex-footer-logo-transparent.png`. */
export const HOUSEX_FOOTER_LOGO_DARK_SRC =
  "/brand/housex-footer-logo-dark.png" as const;

/** Logo brand mark — nền trong suốt, dùng header (ruby) + footer. */
export const HOUSEX_BRAND_LOGO_MARK_SRC = HOUSEX_FOOTER_LOGO_SRC;
export const HOUSEX_BRAND_LOGO_MARK_WIDTH = HOUSEX_FOOTER_LOGO_WIDTH;
export const HOUSEX_BRAND_LOGO_MARK_HEIGHT = HOUSEX_FOOTER_LOGO_HEIGHT;

/** @deprecated Dùng `HOUSEX_BRAND_LOGO_MARK_SRC`. */
export const HOUSEX_HEADER_LOGO_MARK_SRC = HOUSEX_BRAND_LOGO_MARK_SRC;

/** Mark-only X — favicon / OA / icon. */
export const HOUSEX_MARK_ONLY_SRC = "/brand/housex-mark-only.png" as const;
export const HOUSEX_OA_AVATAR_SRC = "/brand/housex-oa-avatar.png" as const;

/** Texture nền giấy cắt từ logo header cũ — giữ cho script tham khảo. */
export const HOUSEX_HEADER_PAPER_TILE = "/brand/header-paper-tile.webp" as const;
export const HOUSEX_HEADER_PAPER_STRIP = "/brand/header-paper-strip.webp" as const;

/** @deprecated Bản auto-generate cũ. */
export const HOUSEX_FOOTER_LOGO_LEGACY_SRC = "/brand/housex-footer-logo.png" as const;

/** @deprecated Dùng `HOUSEX_BRAND_LOGO_MARK_WIDTH` / `HOUSEX_FOOTER_LOGO_WIDTH`. */
export const HOUSEX_BRAND_LOGO_WIDTH = HOUSEX_FOOTER_LOGO_WIDTH;
export const HOUSEX_BRAND_LOGO_HEIGHT = HOUSEX_FOOTER_LOGO_HEIGHT;

/** Trung bình pixel nền giấy header PNG — fallback dưới texture tile. */
export const HOUSEX_BRAND_LOGO_PAPER = "#ebebe6" as const;

export const HOUSEX_HEADER_PAPER_TILE_SIZE_PX = 128;

/** Tagline dưới logo (EN) — lockup đã duyệt. */
export const HOUSEX_FOOTER_TAGLINE = "Smart Tools · Trusted Utility" as const;
