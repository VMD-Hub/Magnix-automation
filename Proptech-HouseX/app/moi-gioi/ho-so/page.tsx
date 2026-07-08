import type { Metadata } from "next";
import { CtvCaseBoard } from "@/components/ctv/ctv-case-board";
import { CtvNotificationBell } from "@/components/ctv/ctv-notification-bell";
import { CtvCommissionSummary } from "@/components/ctv/ctv-commission-summary";

export const metadata: Metadata = {
  title: "Hồ sơ NOXH — CTV | HouseX",
  description:
    "Theo dõi tiến độ hồ sơ NOXH bạn giới thiệu — minh bạch từng mốc và checklist giấy tờ.",
};

export default function CtvCasesPage() {
  return (
    <div className="mx-auto max-w-6xl py-8 container-px">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hồ sơ NOXH</h1>
          <p className="mt-1 text-slate-500">
            Thả lead, theo dõi pipeline và checklist — chuyên viên HouseX tư vấn
            khách hộ bạn.
          </p>
        </div>
        <CtvNotificationBell />
      </div>
      <div className="mt-6">
        <CtvCommissionSummary />
      </div>
      <div className="mt-8">
        <CtvCaseBoard />
      </div>
    </div>
  );
}
