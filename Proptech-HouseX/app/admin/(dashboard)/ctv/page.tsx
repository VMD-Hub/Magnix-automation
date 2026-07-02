import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { CtvReviewBoard } from "@/components/admin/ctv-review-board";

export const metadata: Metadata = {
  title: "Duyệt CTV",
  robots: { index: false, follow: false },
};

export default function AdminCtvPage() {
  return (
    <AdminShell title="Duyệt đơn đăng ký CTV">
      <CtvReviewBoard />
    </AdminShell>
  );
}
