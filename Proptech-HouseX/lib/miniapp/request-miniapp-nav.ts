/**
 * Gửi lệnh điều hướng cho shell Mini App (khi trang web chạy trong #/mo iframe).
 * Không mở zalo.me trong iframe — hay ra trang trắng.
 */

import { getHouseXMiniAppEntryUrl } from "@/lib/personal-brand/vu-nguyen/channel-links";

export const HX_EMBED_MSG_SOURCE = "housex-embed" as const;

export function requestMiniAppNavigate(path: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (!window.parent || window.parent === window) return false;
    window.parent.postMessage(
      { source: HX_EMBED_MSG_SOURCE, type: "navigate", path },
      "*",
    );
    return true;
  } catch {
    return false;
  }
}

/** Về home Mini App: postMessage parent; fallback deep link nếu không nằm trong iframe. */
export function goMiniAppHome(): void {
  if (requestMiniAppNavigate("/")) return;
  window.location.assign(getHouseXMiniAppEntryUrl());
}
