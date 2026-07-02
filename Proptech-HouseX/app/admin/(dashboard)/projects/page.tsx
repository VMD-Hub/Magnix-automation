import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectListBoard } from "@/components/admin/project-list-board";

export const metadata: Metadata = {
  title: "Quản lý landing dự án",
  robots: { index: false, follow: false },
};

export default function AdminProjectsPage() {
  return (
    <AdminShell title="Landing dự án">
      <ProjectListBoard />
    </AdminShell>
  );
}
