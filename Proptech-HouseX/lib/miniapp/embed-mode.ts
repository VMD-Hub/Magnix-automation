/**
 * Chế độ xem web nhúng từ House X Mini App.
 * Logo / "Trang chủ" → quay về Mini App, không nhảy home web đầy đủ.
 */

export const HX_EMBED_QUERY = "hx_embed" as const;
export const HX_EMBED_MINIAPP = "miniapp" as const;
export const HX_EMBED_STORAGE_KEY = "hx_embed_mode" as const;

export function isMiniAppEmbedValue(value: string | null | undefined): boolean {
  return value === HX_EMBED_MINIAPP;
}

/** Gắn ?hx_embed=miniapp vào path web khi mở từ Mini App. */
export function withMiniAppEmbedParam(path: string): string {
  if (!path.startsWith("/")) return path;
  if (path.includes(`${HX_EMBED_QUERY}=`)) return path;
  const join = path.includes("?") ? "&" : "?";
  return `${path}${join}${HX_EMBED_QUERY}=${HX_EMBED_MINIAPP}`;
}

export function readMiniAppEmbedFromSearch(
  search: string | null | undefined,
): boolean {
  if (!search) return false;
  const q = search.startsWith("?") ? search.slice(1) : search;
  return isMiniAppEmbedValue(new URLSearchParams(q).get(HX_EMBED_QUERY));
}
