import type { AccountRole } from "@prisma/client";

/** Chỉ cho phép redirect nội bộ (chống open redirect). */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export function accountHomeForRole(role: AccountRole | string): string {
  return role === "BROKER" ? "/moi-gioi/tai-khoan" : "/khach-hang/tai-khoan";
}

/**
 * CTA «Đăng tin» trên header theo phiên.
 * Guest → funnel đăng ký môi giới; broker → form đăng tin; khách → /dang-tin (redirect broker form + gate).
 */
export function postListingHrefForSession(
  role: AccountRole | string | null | undefined,
): string {
  if (role === "BROKER") return "/moi-gioi/dang-tin";
  if (role === "CUSTOMER") return "/dang-tin";
  return "/dang-ky/moi-gioi";
}

/**
 * Đã có session mà mở /dang-nhap hoặc /dang-ky/* → đưa về hub (hoặc next hợp lệ).
 * Tránh form Đăng ký/Đăng nhập khi cookie đã login.
 */
export function resolveAuthPageRedirect(
  nextRaw: string | null | undefined,
  role: AccountRole | string,
): string {
  return resolvePostAuthPath(nextRaw, role);
}

/**
 * Sau đăng ký / đăng nhập: ưu tiên hub Tài khoản theo role.
 * `next=/` hoặc trống = không có ý định sâu → vào hub (tránh «login xong về home như chưa vào»).
 */
export function resolvePostAuthPath(
  nextRaw: string | null | undefined,
  role: AccountRole | string,
): string {
  const trimmed = nextRaw?.trim() ?? "";
  if (!trimmed) return accountHomeForRole(role);
  const next = safeNextPath(trimmed);
  if (next === "/") return accountHomeForRole(role);
  return next;
}
