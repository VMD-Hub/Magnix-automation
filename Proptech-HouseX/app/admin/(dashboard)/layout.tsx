import { redirect } from "next/navigation";
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
    redirect("/admin/login");
  }

  return (
    <AdminRoleProvider role={session.role}>{children}</AdminRoleProvider>
  );
}
