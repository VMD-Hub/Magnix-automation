import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AdminRoleProvider } from "@/lib/admin/admin-role-context";
import { getAdminSessionFromCookies } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    const pathname = (await headers()).get("x-pathname") ?? "/admin";
    redirect(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }

  return (
    <AdminRoleProvider role={session.role}>{children}</AdminRoleProvider>
  );
}
