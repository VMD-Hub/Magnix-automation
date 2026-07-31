import type { Metadata } from "next";
import Link from "next/link";
import { CtvCaseBoard } from "@/components/ctv/ctv-case-board";
import { CtvNotificationBell } from "@/components/ctv/ctv-notification-bell";
import { CtvCommissionSummary } from "@/components/ctv/ctv-commission-summary";
import { CtvHelpFab } from "@/components/ctv/ctv-help-fab";

export const metadata: Metadata = {
  title: "Hồ sơ NOXH — CTV | HouseX",
  description:
    "Khai báo A+B+C, ghi CS hợp lệ và theo dõi tiến độ hồ sơ NOXH bạn giới thiệu.",
};

export default function CtvCasesPage() {
  return (
    <div className="mx-auto max-w-6xl py-8 container-px">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hồ sơ NOXH</h1>
          <p className="mt-1 text-slate-500">
            Khai báo deal, ghi CS và theo dõi pipeline — cùng API với Mini App
            Agent.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link
              href="/moi-gioi/khai-bao"
              className="font-medium text-brand-700 hover:underline"
            >
              Khai báo
            </Link>
            <Link
              href="/moi-gioi/gio-hang"
              className="font-medium text-brand-700 hover:underline"
            >
              Giỏ hàng
            </Link>
            <Link
              href="/moi-gioi/hoa-hong"
              className="font-medium text-brand-700 hover:underline"
            >
              Hoa hồng
            </Link>
          </div>
        </div>
        <CtvNotificationBell />
      </div>
      <div className="mt-6">
        <CtvCommissionSummary />
      </div>
      <div className="mt-8">
        <CtvCaseBoard />
      </div>
      <CtvHelpFab />
    </div>
  );
}
