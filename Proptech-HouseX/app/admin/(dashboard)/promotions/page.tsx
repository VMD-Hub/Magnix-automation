import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { PromotionListBoard } from "@/components/admin/promotion-list-board";

export const metadata: Metadata = {
  title: "Quản lý khuyến mãi",
  robots: { index: false, follow: false },
};

export default function AdminPromotionsPage() {
  return (
    <AdminShell title="Khuyến mãi — Vòng quay">
      <PromotionListBoard />
    </AdminShell>
  );
}
