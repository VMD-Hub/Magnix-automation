import type { Metadata } from "next";
import Link from "next/link";
import { CtvCommissionsPanel } from "@/components/ctv/ctv-commissions-panel";
import { CtvHelpFab } from "@/components/ctv/ctv-help-fab";

export const metadata: Metadata = {
  title: "Hoa hồng — CTV | HouseX",
  description:
    "Theo dõi hoa hồng sau HĐMB — % × giá căn do Ops nhập sau khi ký.",
};

export default function CtvCommissionsPage() {
  return (
    <div className="mx-auto max-w-2xl py-8 container-px">
      <Link
        href="/moi-gioi/ho-so"
        className="text-sm text-slate-500 hover:text-slate-800"
      >
        ← Hồ sơ NOXH
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">Hoa hồng</h1>
      <div className="mt-6">
        <CtvCommissionsPanel />
      </div>
      <CtvHelpFab />
    </div>
  );
}
