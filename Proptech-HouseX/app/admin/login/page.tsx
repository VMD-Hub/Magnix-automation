import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { HouseXHeaderLogo } from "@/components/brand/housex-header-logo";
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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-silver-100">
      <header className="admin-chrome__top site-header-bar proptech-header-ruby">
        <div className="admin-chrome__top-inner mx-auto max-w-lg w-full justify-center sm:justify-between">
          <HouseXHeaderLogo href="/" surface="ruby" className="admin-chrome__logo" />
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Console vận hành
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Đăng nhập quản trị nền tảng House X
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-slate-500">Đang tải form…</p>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
