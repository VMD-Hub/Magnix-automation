/** Vai trò console vận hành nền tảng House X (không phải admin group Zalo). */
export type AdminRole = "super" | "ops";

export const ADMIN_ROLE_LABEL: Record<AdminRole, string> = {
  super: "Chủ quản",
  ops: "Ops",
};

/** Trang Ops (không gồm telesales — telesales cần Super hoặc UserAccount grant). */
export const OPS_ADMIN_PAGE_PREFIXES = [
  "/admin/conflicts",
  "/admin/inbound-leads",
  "/admin/noxh-cases",
  "/admin/playbook",
  "/admin/conversion",
] as const;

/** API Ops được phép (ngoài /api/admin/session). ops-leads dùng grant gate riêng. */
export const OPS_ADMIN_API_PREFIXES = [
  "/api/admin/queue-counts",
  "/api/admin/conflicts",
  "/api/admin/inbound-leads",
  "/api/admin/noxh-cases",
  "/api/admin/conversion",
] as const;

export function isOpsAdminPage(pathname: string): boolean {
  return OPS_ADMIN_PAGE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function isOpsAdminApi(pathname: string): boolean {
  if (pathname === "/api/admin/session") return true;
  return OPS_ADMIN_API_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function isSuperAdminOnlyPage(pathname: string): boolean {
  if (!pathname.startsWith("/admin")) return false;
  if (pathname === "/admin/login") return false;
  if (pathname === "/admin") return true;
  return !isOpsAdminPage(pathname);
}

export function isSuperAdminOnlyApi(pathname: string): boolean {
  if (!pathname.startsWith("/api/admin")) return false;
  return !isOpsAdminApi(pathname);
}

export function defaultAdminHome(role: AdminRole): string {
  return role === "ops" ? "/admin/playbook" : "/admin/ctv";
}
