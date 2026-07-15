import { HOUSEX_API_BASE } from "../config";

const ALLOWED_PREFIXES = [
  "/cong-cu/",
  "/cong-cu",
  "/tin-tuc",
  "/khuyen-mai",
  "/dieu-khoan",
  "/chinh-sach",
  "/quy-dinh",
  "/lien-he",
  "/khach-hang/",
  "/moi-gioi/",
  "/dang-ky",
  "/tai-chinh",
  "/dinh-gia",
  "/noi-that",
  "/dich-vu",
];

const ALLOWED_HANDOFF_NEXT = new Set([
  "/khach-hang/tai-khoan",
  "/moi-gioi/tai-khoan",
]);

function normalizePath(raw: string): string {
  let path = raw.trim();
  try {
    path = decodeURIComponent(path);
  } catch {
    /* keep raw */
  }
  if (path.includes("://")) {
    try {
      path = new URL(path).pathname;
    } catch {
      return "";
    }
  }
  if (!path.startsWith("/")) path = `/${path}`;
  const q = path.indexOf("?");
  if (q >= 0) path = path.slice(0, q);
  const h = path.indexOf("#");
  if (h >= 0) path = path.slice(0, h);
  return path || "/";
}

/**
 * Path an toàn để nhúng trang House X.
 * Trả null nếu không thuộc allowlist — KHÔNG fallback /tin-tuc.
 */
export function sanitizeWebPath(raw: string): string | null {
  const path = normalizePath(raw);
  if (!path || path.includes("..")) return null;
  const ok = ALLOWED_PREFIXES.some(
    (p) => path === p.replace(/\/$/, "") || path.startsWith(p),
  );
  return ok ? path : null;
}

export function webAbsoluteUrl(path: string): string {
  const p = sanitizeWebPath(path);
  if (!p) return `${HOUSEX_API_BASE}/`;
  return `${HOUSEX_API_BASE}${p}`;
}

export function accountHandoffConsumeUrl(
  code: string,
  nextPath: string,
): string {
  const next = ALLOWED_HANDOFF_NEXT.has(nextPath)
    ? nextPath
    : "/khach-hang/tai-khoan";
  const q = new URLSearchParams({
    code,
    next,
  });
  return `${HOUSEX_API_BASE}/api/auth/miniapp-handoff/consume?${q.toString()}`;
}

export function sanitizeHandoffNext(path: string | null | undefined): string {
  if (!path) return "/khach-hang/tai-khoan";
  return ALLOWED_HANDOFF_NEXT.has(path) ? path : "/khach-hang/tai-khoan";
}
