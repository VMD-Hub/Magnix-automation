import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { defaultAdminHome } from "@/lib/admin/roles";
import { getAdminSessionFromCookies } from "@/lib/admin/session";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Đăng nhập Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function resolvePostLoginPath(
  role: "super" | "ops",
  next?: string | null,
): string {
  if (
    next &&
    next.startsWith("/admin/") &&
    !next.startsWith("/admin/login")
  ) {
    return next;
  }
  return defaultAdminHome(role);
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getAdminSessionFromCookies();
  const params = await searchParams;
  if (session) {
    redirect(resolvePostLoginPath(session.role, params.next));
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          House<span className="text-brand-600">X</span> Admin
        </h1>
        <p className="mt-1 text-sm text-slate-500">Console vận hành nền tảng House X</p>
      </div>
      <Suspense fallback={<p className="text-sm text-slate-500">Đang tải form…</p>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
