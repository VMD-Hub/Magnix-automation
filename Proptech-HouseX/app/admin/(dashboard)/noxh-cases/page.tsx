import { Suspense } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { NoxhCaseBoard } from "@/components/admin/noxh-case-board";

export const metadata = {
  title: "Hồ sơ NOXH — Admin",
};

export default function AdminNoxhCasesPage() {
  return (
    <AdminShell title="Hồ sơ NOXH — Pipeline Ops">
      <Suspense fallback={<p className="text-sm text-slate-500">Đang tải…</p>}>
        <NoxhCaseBoard />
      </Suspense>
    </AdminShell>
  );
}
