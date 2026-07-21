import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ContentQueueBoard } from "@/components/admin/content-queue-board";

export const metadata: Metadata = {
  title: "Content queue | House X Admin",
  robots: { index: false, follow: false },
};

export default function ContentQueueAdminPage() {
  return (
    <AdminShell
      title="Content queue Magnix"
      description="Hàng đợi nội dung Super — L3 bắt buộc CTA tool NƠXH (điều kiện hoặc vay). Bài không CTA tool = không duyệt."
    >
      <ContentQueueBoard />
    </AdminShell>
  );
}
