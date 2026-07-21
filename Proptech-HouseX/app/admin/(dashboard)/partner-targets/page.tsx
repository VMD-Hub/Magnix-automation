import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { PartnerTargetBoard } from "@/components/admin/partner-target-board";

export const metadata: Metadata = {
  title: "Partner targets | House X Admin",
  robots: { index: false, follow: false },
};

export default function PartnerTargetsAdminPage() {
  return (
    <AdminShell
      title="Partner targets B2B"
      description="Danh sách target Công đoàn / HR / KCN — outreach tay ≤1h/tuần. Không CRM. Form công khai vẫn ở /hop-tac."
    >
      <PartnerTargetBoard />
    </AdminShell>
  );
}
