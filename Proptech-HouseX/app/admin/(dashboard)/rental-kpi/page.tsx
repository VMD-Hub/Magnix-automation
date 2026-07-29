import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { RentalKpiBoard } from "@/components/admin/rental-kpi-board";

export const metadata: Metadata = {
  title: "KPI thuê | House X Admin",
  robots: { index: false, follow: false },
};

export default function RentalKpiAdminPage() {
  return (
    <AdminShell
      title="KPI thuê (P1–P3)"
      description="ADR-018 Wave 2 — reject tin RENT, SLA chủ nhà, hoa hồng, TAX_HELP referral, NEED_PM waitlist Sense. Không đo doanh thu quản lý căn."
    >
      <RentalKpiBoard />
    </AdminShell>
  );
}
