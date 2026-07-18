import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HouseXHeaderLogo } from "@/components/brand/housex-header-logo";
import { OpsLeadBoard } from "@/components/admin/ops-lead-board";
import { getSessionUser } from "@/lib/auth/session";
import { hasActiveTelesalesGrant } from "@/lib/admin/ops-telesales-access";
import { getAdminSessionFromCookies } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "CRM Telesales — House X",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OpsTelesalesPage() {
  const admin = await getAdminSessionFromCookies();
  if (admin?.role === "super") {
    redirect("/admin/ops-leads");
  }

  const session = await getSessionUser();
  if (!session) {
    redirect("/dang-nhap?next=/ops/telesales");
  }

  const allowed = await hasActiveTelesalesGrant(session.id);
  if (!allowed) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white px-4 py-3">
          <HouseXHeaderLogo />
        </header>
        <main className="mx-auto max-w-lg px-4 py-12 text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Chưa được cấp quyền CRM Telesales
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Super Admin cần duyệt tài khoản của bạn (SĐT hoặc Zalo id) tại{" "}
            <span className="font-medium">Quyền telesales</span> trên console.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-brand-800 underline"
          >
            Về trang chủ
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div>
          <HouseXHeaderLogo />
          <p className="mt-1 text-xs text-slate-500">
            CRM Telesales — gọi / SMS / Zalo · cập nhật lead
          </p>
        </div>
        <Link href="/" className="text-xs text-slate-500 underline">
          Site
        </Link>
      </header>
      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-4">
        <OpsLeadBoard />
      </main>
    </div>
  );
}
