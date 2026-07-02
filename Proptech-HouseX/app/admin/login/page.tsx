import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/admin/session";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Đăng nhập Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const authenticated = await getAdminSessionFromCookies();
  if (authenticated) {
    redirect("/admin/ctv");
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-100 px-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          House<span className="text-brand-600">X</span> Admin
        </h1>
        <p className="mt-1 text-sm text-slate-500">Duyệt đơn CTV — Lớp 3</p>
      </div>
      <AdminLoginForm />
    </div>
  );
}
