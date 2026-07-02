"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ARTICLE_STATUS_LABEL } from "@/lib/format";

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
  publishedAt: string | null;
  updatedAt: string;
  tags: { tag: { slug: string; name: string } }[];
  projects: { project: { slug: string; name: string } }[];
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function ArticleListBoard() {
  const [items, setItems] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/articles");
      if (res.status === 403) {
        window.location.href = "/admin/login";
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message ?? "Không tải được danh sách.");
        return;
      }
      setItems(json.data.items);
    } catch {
      setError("Lỗi mạng.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="text-slate-600">Đang tải…</p>;
  }

  if (error) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/admin/articles/new">
          <Button>+ Bài viết mới</Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Tiêu đề</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium">Tag / Dự án</th>
              <th className="px-4 py-3 font-medium">Xuất bản</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{a.title}</p>
                  <p className="text-xs text-slate-500">/{a.slug}</p>
                </td>
                <td className="px-4 py-3">
                  {ARTICLE_STATUS_LABEL[a.status] ?? a.status}
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {a.tags.map((t) => t.tag.name).join(", ") || "—"}
                  {a.projects.length > 0 && (
                    <span className="mt-1 block text-brand-700">
                      {a.projects.map((p) => p.project.name).join(", ")}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {formatDate(a.publishedAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/articles/${a.id}`}
                    className="font-medium text-brand-700 hover:underline"
                  >
                    Sửa
                  </Link>
                  {a.status === "PUBLISHED" && (
                    <Link
                      href={`/tin-tuc/${a.slug}`}
                      target="_blank"
                      className="ml-3 text-slate-500 hover:text-slate-700"
                    >
                      Xem
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="p-8 text-center text-slate-500">Chưa có bài viết.</p>
        )}
      </div>
    </div>
  );
}
