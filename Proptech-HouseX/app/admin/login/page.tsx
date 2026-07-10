import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { defaultAdminHome } from "@/lib/admin/roles";
import { getAdminSessionFromCookies } from "@/lib/admin/session";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Đăng nhập Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSessionFromCookies();
  if (session) {
    redirect(defaultAdminHome(session.role));
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          House<span className="text-brand-600">X</span> Admin
        </h1>
        <p className="mt-1 text-sm text-slate-500">Console vận hành nền tảng House X</p>
      </div>
      <AdminLoginForm />
    </div>
  );
}
