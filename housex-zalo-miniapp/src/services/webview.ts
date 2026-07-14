import { HOUSEX_API_BASE } from "../config";

const ALLOWED_PREFIXES = [
  "/cong-cu/",
  "/tin-tuc",
  "/khuyen-mai",
  "/dieu-khoan",
  "/chinh-sach",
  "/quy-dinh",
  "/lien-he",
  "/khach-hang/",
  "/moi-gioi/",
];

const ALLOWED_HANDOFF_NEXT = new Set([
  "/khach-hang/tai-khoan",
  "/moi-gioi/tai-khoan",
]);

/** Path an toàn để nhúng trang House X web trong Mini App. */
export function sanitizeWebPath(path: string): string {
  if (!path.startsWith("/")) return "/";
  if (path.includes("://") || path.includes("..")) return "/tin-tuc";
  const ok = ALLOWED_PREFIXES.some(
    (p) => path === p.replace(/\/$/, "") || path.startsWith(p),
  );
  return ok ? path : "/tin-tuc";
}

export function webAbsoluteUrl(path: string): string {
  const p = sanitizeWebPath(path);
  return `${HOUSEX_API_BASE}${p}`;
}

/** URL consume handoff — Set-Cookie rồi redirect hồ sơ web. */
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
