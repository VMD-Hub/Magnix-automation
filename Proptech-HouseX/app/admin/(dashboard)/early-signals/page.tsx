import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { EarlySignalReviewBoard } from "@/components/admin/early-signal-review-board";

export const metadata: Metadata = {
  title: "Tin sớm NOXH | House X Admin",
  robots: { index: false, follow: false },
};

export default function EarlySignalsAdminPage() {
  return (
    <AdminShell
      title="Tin sớm NOXH"
      description="Hàng đợi tin báo/CĐT — khác Tin đăng CTV. Wizard 3 bước trong Admin House X: nguồn → bản người đọc → xem lại & duyệt L3. Không auto-nurture."
    >
      <EarlySignalReviewBoard />
    </AdminShell>
  );
}
