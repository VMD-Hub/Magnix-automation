import { HOUSEX_API_BASE } from "../config";

const ALLOWED_PREFIXES = [
  "/cong-cu/",
  "/tin-tuc",
  "/dieu-khoan",
  "/chinh-sach",
  "/quy-dinh",
  "/lien-he",
];

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
