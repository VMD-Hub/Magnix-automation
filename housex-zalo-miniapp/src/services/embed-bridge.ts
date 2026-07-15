/** postMessage: web iframe → Mini App shell (không dùng zalo.me trong iframe — thường trắng). */

export const HX_EMBED_MSG_SOURCE = "housex-embed" as const;

export type HxEmbedNavigateMessage = {
  source: typeof HX_EMBED_MSG_SOURCE;
  type: "navigate";
  path: string;
};

const ALLOWED_MINI_PATHS = new Set([
  "/",
  "/start",
  "/noxh",
  "/cctm",
  "/kham-pha",
  "/dich-vu",
  "/cong-cu",
  "/tu-van",
  "/tai-khoan",
  "/agent",
]);

export function isHxEmbedNavigateMessage(
  data: unknown,
): data is HxEmbedNavigateMessage {
  if (!data || typeof data !== "object") return false;
  const m = data as Record<string, unknown>;
  return (
    m.source === HX_EMBED_MSG_SOURCE &&
    m.type === "navigate" &&
    typeof m.path === "string"
  );
}

export function sanitizeMiniNavigatePath(path: string): string | null {
  const p = path.trim();
  if (!p.startsWith("/")) return null;
  if (p.includes("://") || p.includes("..")) return null;
  const base = p.split("?")[0] ?? p;
  if (ALLOWED_MINI_PATHS.has(base)) return base;
  if (base.startsWith("/du-an/")) return base;
  if (base.startsWith("/agent/")) return base;
  return null;
}

export function isTrustedHouseXOrigin(
  origin: string,
  apiBase: string,
): boolean {
  try {
    return new URL(apiBase).origin === origin;
  } catch {
    return false;
  }
}
