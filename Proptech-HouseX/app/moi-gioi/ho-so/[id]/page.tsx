import type { Metadata } from "next";
import Link from "next/link";
import { CtvCaseDetailPageClient } from "@/components/ctv/ctv-case-detail-page-client";
import { CtvHelpFab } from "@/components/ctv/ctv-help-fab";

export const metadata: Metadata = {
  title: "Chi tiết hồ sơ — CTV | HouseX",
  description: "Chăm sóc hợp lệ, checklist giấy tờ và tiến độ hồ sơ NOXH.",
};

export default async function CtvCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl py-8 container-px">
      <Link
        href="/moi-gioi/ho-so"
        className="text-sm text-slate-500 hover:text-slate-800"
      >
        ← Hồ sơ NOXH
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">Chi tiết hồ sơ</h1>
      <p className="mt-1 text-slate-500">
        Ghi CS (nhiều ảnh trên desktop), nhắc khách và theo dõi checklist.
      </p>
      <div className="mt-6">
        <CtvCaseDetailPageClient caseId={id} />
      </div>
      <CtvHelpFab />
    </div>
  );
}
