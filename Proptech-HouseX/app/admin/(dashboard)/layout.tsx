import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AdminRoleProvider } from "@/lib/admin/admin-role-context";
import {
  defaultAdminHome,
  isSuperAdminOnlyPage,
} from "@/lib/admin/roles";
import { getAdminSessionFromCookies } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSessionFromCookies();
  const pathname = (await headers()).get("x-pathname");

  if (!session) {
    const next =
      pathname && pathname.startsWith("/admin") ? pathname : "/admin";
    redirect(`/admin/login?next=${encodeURIComponent(next)}`);
  }

  // Missing x-pathname must not be treated as "/admin" (false super-only).
  if (
    session.role === "ops" &&
    pathname &&
    isSuperAdminOnlyPage(pathname)
  ) {
    redirect(defaultAdminHome("ops"));
  }

  return (
    <AdminRoleProvider role={session.role}>{children}</AdminRoleProvider>
  );
}
