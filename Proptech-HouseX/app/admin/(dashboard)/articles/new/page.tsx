import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticleEditor } from "@/components/admin/article-editor";

export const metadata: Metadata = {
  title: "Bài viết mới",
  robots: { index: false, follow: false },
};

export default function AdminNewArticlePage() {
  return (
    <AdminShell title="Tạo bài viết mới">
      <ArticleEditor />
    </AdminShell>
  );
}
