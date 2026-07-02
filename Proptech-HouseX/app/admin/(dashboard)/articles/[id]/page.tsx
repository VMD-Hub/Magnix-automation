import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticleEditor } from "@/components/admin/article-editor";

export const metadata: Metadata = {
  title: "Sửa bài viết",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditArticlePage({ params }: PageProps) {
  const { id } = await params;
  return (
    <AdminShell title="Sửa bài viết">
      <ArticleEditor articleId={id} />
    </AdminShell>
  );
}
