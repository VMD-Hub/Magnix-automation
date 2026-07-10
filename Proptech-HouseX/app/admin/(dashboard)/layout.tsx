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
  const pathname = (await headers()).get("x-pathname") ?? "/admin";

  if (!session) {
    redirect(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }

  if (session.role === "ops" && isSuperAdminOnlyPage(pathname)) {
    redirect(defaultAdminHome("ops"));
  }

  return (
    <AdminRoleProvider role={session.role}>{children}</AdminRoleProvider>
  );
}
