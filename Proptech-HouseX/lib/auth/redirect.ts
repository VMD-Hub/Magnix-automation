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
