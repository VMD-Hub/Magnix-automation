import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/admin/session";
import { defaultAdminHome } from "@/lib/admin/roles";

export default async function AdminIndexPage() {
  const session = await getAdminSessionFromCookies();
  redirect(defaultAdminHome(session?.role ?? "super"));
}
