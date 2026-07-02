"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminQuickReferencePanel } from "@/components/admin/admin-section-guide";
import { cn } from "@/lib/ui/cn";
import {
  PROJECT_STATUS_LABEL,
  PROJECT_TYPE_LABEL,
} from "@/lib/format";

type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  projectType: string;
  status: string;
  province: string;
  district: string;
  updatedAt: string;
  developer: { id: string; name: string };
  _count: { unitTypes: number; listings: number };
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function ProjectListBoard() {
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cloneSource, setCloneSource] = useState<ProjectRow | null>(null);
  const [cloneSlug, setCloneSlug] = useState("");
  const [cloneName, setCloneName] = useState("");
  const [cloneLoading, setCloneLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/projects", {
        headers: { accept: "application/json" },
      });
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

  async function handleClone(e: React.FormEvent) {
    e.preventDefault();
    if (!cloneSource) return;
    setCloneLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/projects/${cloneSource.id}/clone`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            newSlug: cloneSlug.trim(),
            newName: cloneName.trim() || undefined,
          }),
        },
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message ?? "Nhân bản thất bại.");
        return;
      }
      setMessage(`Đã tạo bản sao: ${json.data.project.name}`);
      setCloneSource(null);
      setCloneSlug("");
      setCloneName("");
      await load();
    } catch {
      setError("Lỗi mạng khi nhân bản.");
    } finally {
      setCloneLoading(false);
    }
  }

  function openCloneModal(row: ProjectRow) {
    setCloneSource(row);
    setCloneSlug(`${row.slug}-copy`);
    setCloneName(`${row.name} (bản sao)`);
    setMessage(null);
    setError(null);
  }

  return (
    <div className="space-y-4">
      <AdminQuickReferencePanel />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Mỗi dự án = một landing SEO chuẩn. Tạo mới hoặc nhân bản từ dự án có
          sẵn.
        </p>
        <ButtonLink href="/admin/projects/new" variant="primary" size="sm">
          + Tạo dự án mới
        </ButtonLink>
      </div>

      {message && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-800">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">Chưa có dự án nào.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Dự án</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">
                  Loại / Trạng thái
                </th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">
                  Khu vực
                </th>
                <th className="px-4 py-3 font-medium">Cập nhật</th>
                <th className="px-4 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-500">/{p.slug}</div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {p.developer.name}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <div>
                      {PROJECT_TYPE_LABEL[p.projectType as keyof typeof PROJECT_TYPE_LABEL] ??
                        p.projectType}
                    </div>
                    <div className="text-xs text-slate-500">
                      {PROJECT_STATUS_LABEL[p.status as keyof typeof PROJECT_STATUS_LABEL] ??
                        p.status}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    {p.district}, {p.province}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {formatDate(p.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className="text-brand-700 hover:underline"
                      >
                        Sửa
                      </Link>
                      <a
                        href={`/du-an/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:underline"
                      >
                        Xem
                      </a>
                      <button
                        type="button"
                        onClick={() => openCloneModal(p)}
                        className="text-amber-700 hover:underline"
                      >
                        Nhân bản
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {cloneSource && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleClone}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-slate-900">
              Nhân bản từ &ldquo;{cloneSource.name}&rdquo;
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Sao chép landing, loại hình sản phẩm và hồ sơ pháp lý. Slug phải
              unique.
            </p>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Slug mới
              <input
                required
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                value={cloneSlug}
                onChange={(e) => setCloneSlug(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="ten-du-an-moi"
              />
            </label>
            <label className="mt-3 block text-sm font-medium text-slate-700">
              Tên hiển thị (tuỳ chọn)
              <input
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCloneSource(null)}
              >
                Huỷ
              </Button>
              <Button type="submit" size="sm" disabled={cloneLoading}>
                {cloneLoading ? "Đang nhân bản…" : "Nhân bản"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function ButtonLink({
  href,
  children,
  variant,
  size,
}: {
  href: string;
  children: React.ReactNode;
  variant: "primary" | "outline";
  size: "sm" | "md";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-colors",
        variant === "primary" &&
          "bg-brand-600 text-white hover:bg-brand-700",
        variant === "outline" &&
          "border border-slate-300 text-slate-700 hover:bg-slate-50",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-5 text-sm",
      )}
    >
      {children}
    </Link>
  );
}
