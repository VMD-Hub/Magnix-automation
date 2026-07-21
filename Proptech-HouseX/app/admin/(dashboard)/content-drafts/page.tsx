import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ContentDraftBoard } from "@/components/admin/content-draft-board";

export const metadata: Metadata = {
  title: "Content drafts | House X Admin",
  robots: { index: false, follow: false },
};

export default function ContentDraftsAdminPage() {
  return (
    <AdminShell
      title="Content drafts Magnix"
      description="Bản nháp Agent 3 — xem/sửa/L3 trên Admin. Sync Sheet content_drafts. CTA tool NƠXH bắt buộc trước duyệt."
    >
      <ContentDraftBoard />
    </AdminShell>
  );
}
