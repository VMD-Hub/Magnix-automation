import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectLandingEditor } from "@/components/admin/project-landing-editor";

export const metadata: Metadata = {
  title: "Sửa landing dự án",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditProjectPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <AdminShell title="Chỉnh sửa landing dự án">
      <ProjectLandingEditor projectId={id} />
    </AdminShell>
  );
}
