/** House X Mini App config — ADR-014 */

/** API House X (không slash cuối). Prod: https://timnhaxahoi.com */
export const HOUSEX_API_BASE =
  (import.meta.env.VITE_HOUSEX_API_BASE as string | undefined)?.replace(
    /\/$/,
    "",
  ) || "http://localhost:3000";

/** Bật mock login (zaloUserId) khi API có ZALO_AUTH_DEV_BYPASS — chỉ local. */
export const AUTH_DEV_BYPASS =
  (import.meta.env.VITE_AUTH_DEV_BYPASS as string | undefined) === "true";

export const TOKEN_STORAGE_KEY = "hx_zalo_session_token";
