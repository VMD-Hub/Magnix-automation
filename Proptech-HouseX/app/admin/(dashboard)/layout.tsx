import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/admin/session";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await getAdminSessionFromCookies();
  if (!authenticated) {
    redirect("/admin/login");
  }

  return children;
}
