"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/listings" className="text-lg font-bold text-slate-900">
              House<span className="text-brand-600">X</span> Admin
            </Link>
            <span className="hidden rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 sm:inline">
              Lớp 3
            </span>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/admin/listings"
              className="font-medium text-brand-700 hover:text-brand-800"
            >
              Duyệt tin
            </Link>
            <Link
              href="/admin/articles"
              className="text-slate-600 hover:text-slate-800"
            >
              Tin tức
            </Link>
            <Link
              href="/admin/projects"
              className="text-slate-600 hover:text-slate-800"
            >
              Landing dự án
            </Link>
            <Link
              href="/admin/unit-bookings"
              className="text-slate-600 hover:text-slate-800"
            >
              Giữ suất F1
            </Link>
            <Link
              href="/admin/ctv"
              className="text-slate-600 hover:text-slate-800"
            >
              Duyệt CTV
            </Link>
            <AdminLogoutButton />
            <Link href="/" className="text-slate-500 hover:text-slate-700">
              ← Về site
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="mb-6 text-2xl font-bold text-slate-900">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}

function AdminLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="text-slate-500 hover:text-slate-700"
    >
      Đăng xuất
    </button>
  );
}
