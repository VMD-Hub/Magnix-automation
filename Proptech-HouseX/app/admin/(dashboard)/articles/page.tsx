import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticleListBoard } from "@/components/admin/article-list-board";

export const metadata: Metadata = {
  title: "Quản lý tin tức",
  robots: { index: false, follow: false },
};

export default function AdminArticlesPage() {
  return (
    <AdminShell title="Tin tức & bài viết">
      <ArticleListBoard />
    </AdminShell>
  );
}
