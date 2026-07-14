/** House X Mini App config — ADR-014 */

/**
 * API House X (không slash cuối).
 * Production tuyệt đối không bundle localhost — Zalo WebView không gọi được máy local.
 */
function isLocalApi(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

function resolveApiBase(): string {
  const fromEnv = (
    import.meta.env.VITE_HOUSEX_API_BASE as string | undefined
  )?.replace(/\/$/, "");

  if (import.meta.env.PROD) {
    if (fromEnv && !isLocalApi(fromEnv)) return fromEnv;
    return "https://timnhaxahoi.com";
  }

  if (fromEnv) return fromEnv;
  return "http://localhost:3000";
}

export const HOUSEX_API_BASE = resolveApiBase();

/** Bật mock login (zaloUserId) khi API có ZALO_AUTH_DEV_BYPASS — chỉ local. */
export const AUTH_DEV_BYPASS =
  (import.meta.env.VITE_AUTH_DEV_BYPASS as string | undefined) === "true" &&
  !import.meta.env.PROD;

export const TOKEN_STORAGE_KEY = "hx_zalo_session_token";
