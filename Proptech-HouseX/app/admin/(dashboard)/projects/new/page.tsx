import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectLandingEditor } from "@/components/admin/project-landing-editor";

export const metadata: Metadata = {
  title: "Tạo landing dự án",
  robots: { index: false, follow: false },
};

export default function AdminNewProjectPage() {
  return (
    <AdminShell title="Tạo landing dự án mới">
      <ProjectLandingEditor />
    </AdminShell>
  );
}
