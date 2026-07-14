/** House X Mini App config — ADR-014 */

/**
 * API House X (không slash cuối).
 * Production mặc định timnhaxahoi.com — tránh bundle DEV trỏ localhost trong Zalo.
 */
function resolveApiBase(): string {
  const fromEnv = (
    import.meta.env.VITE_HOUSEX_API_BASE as string | undefined
  )?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (import.meta.env.PROD) return "https://timnhaxahoi.com";
  return "http://localhost:3000";
}

export const HOUSEX_API_BASE = resolveApiBase();

/** Bật mock login (zaloUserId) khi API có ZALO_AUTH_DEV_BYPASS — chỉ local. */
export const AUTH_DEV_BYPASS =
  (import.meta.env.VITE_AUTH_DEV_BYPASS as string | undefined) === "true";

export const TOKEN_STORAGE_KEY = "hx_zalo_session_token";
