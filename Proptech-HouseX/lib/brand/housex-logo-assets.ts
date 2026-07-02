/** Logo header (nền sáng) — master artwork, thanh tiêu đề. */
export const HOUSEX_HEADER_LOGO_SRC = "/brand/housex-header-logo.png" as const;
export const HOUSEX_HEADER_LOGO_WIDTH = 940;
export const HOUSEX_HEADER_LOGO_HEIGHT = 397;

/** Logo header — nền trong suốt, texture lấy từ thanh tiêu đề bên dưới. */
export const HOUSEX_HEADER_LOGO_MARK_SRC =
  "/brand/housex-header-logo-mark.png" as const;

/** Logo footer (nền tối gradient) — file gốc brand, KHÔNG sinh từ header. */
export const HOUSEX_FOOTER_LOGO_DARK_SRC =
  "/brand/housex-footer-logo-dark.png" as const;
export const HOUSEX_FOOTER_LOGO_WIDTH = 1024;
export const HOUSEX_FOOTER_LOGO_HEIGHT = 473;

/** Texture nền giấy cắt từ logo header — lặp trên thanh tiêu đề. */
export const HOUSEX_HEADER_PAPER_TILE = "/brand/header-paper-tile.webp" as const;
export const HOUSEX_HEADER_PAPER_STRIP = "/brand/header-paper-strip.webp" as const;

/** @deprecated Bản auto-generate — đã thay bằng `housex-footer-logo-dark.png`. */
export const HOUSEX_FOOTER_LOGO_SRC = "/brand/housex-footer-logo.png" as const;

/** @deprecated Dùng `HOUSEX_HEADER_LOGO_WIDTH` / `HOUSEX_FOOTER_LOGO_WIDTH`. */
export const HOUSEX_BRAND_LOGO_WIDTH = HOUSEX_HEADER_LOGO_WIDTH;
export const HOUSEX_BRAND_LOGO_HEIGHT = HOUSEX_HEADER_LOGO_HEIGHT;

/** Trung bình pixel nền giấy header PNG — fallback dưới texture tile. */
export const HOUSEX_BRAND_LOGO_PAPER = "#ebebe6" as const;

export const HOUSEX_HEADER_PAPER_TILE_SIZE_PX = 128;

export const HOUSEX_FOOTER_TAGLINE = "Trusted Real Estate Radar" as const;
