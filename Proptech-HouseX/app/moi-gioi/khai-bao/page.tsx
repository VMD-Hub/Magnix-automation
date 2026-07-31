import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CtvDeclarePageClient } from "@/components/ctv/ctv-declare-page-client";
import { CtvHelpFab } from "@/components/ctv/ctv-help-fab";

export const metadata: Metadata = {
  title: "Khai báo giao dịch — CTV | HouseX",
  description:
    "Khai báo khách, dự án và mức hợp tác (A+B+C) — House X bố trí hỗ trợ theo deal.",
};

export default function CtvDeclarePage() {
  return (
    <div className="mx-auto max-w-2xl py-8 container-px">
      <Link
        href="/moi-gioi/ho-so"
        className="text-sm text-slate-500 hover:text-slate-800"
      >
        ← Hồ sơ NOXH
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">
        Khai báo giao dịch
      </h1>
      <p className="mt-1 text-slate-500">
        Cùng luồng Mini App Agent — A khách, B dự án, C mức hợp tác.
      </p>
      <div className="mt-6">
        <Suspense fallback={<p className="text-sm text-slate-500">Đang tải…</p>}>
          <CtvDeclarePageClient />
        </Suspense>
      </div>
      <CtvHelpFab />
    </div>
  );
}
