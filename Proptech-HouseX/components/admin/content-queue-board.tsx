"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import {
  L3_CHECKLIST_LABELS,
  NOXH_CTA_TOOLS,
  EMPTY_L3_CHECKLIST,
  type L3ContentChecklist,
  type NoxhCtaToolId,
  parseL3Checklist,
} from "@/lib/content/noxh-cta-tools";
import { articlePath } from "@/lib/content/article-routes";

type StatusFilter =
  | "PENDING_L3"
  | "INTAKE"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "ALL";

type ContentQueueItem = {
  id: string;
  normalizedKey: string;
  title: string;
  painPoint: string | null;
  bodyPreview: string | null;
  segment: string | null;
  score: number | null;
  status: string;
  publishChannel: string | null;
  ctaToolId: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  sourceUrl: string | null;
  sheetKey: string | null;
  opsNotes: string | null;
  l3Checklist: unknown;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectReason: string | null;
  publishedAt: string | null;
  createdAt: string;
  article: { id: string; slug: string; title: string; status: string } | null;
};

type Counts = {
  intake: number;
  pendingL3: number;
  approved: number;
  rejected: number;
  published: number;
  total: number;
  missingCta: number;
};

type FormState = {
  title: string;
  painPoint: string;
  bodyPreview: string;
  publishChannel: string;
  ctaToolId: NoxhCtaToolId | "";
  ctaLabel: string;
  sourceUrl: string;
  sheetKey: string;
  opsNotes: string;
  l3Checklist: L3ContentChecklist;
};

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "PENDING_L3", label: "Chờ L3" },
  { key: "INTAKE", label: "Intake" },
  { key: "APPROVED", label: "Đã duyệt" },
  { key: "REJECTED", label: "Từ chối" },
  { key: "PUBLISHED", label: "Đã đăng" },
  { key: "ALL", label: "Tất cả" },
];

const CHANNELS = [
  { value: "WEBSITE", label: "Website / SEO" },
  { value: "FB_PAGE", label: "Facebook Page" },
  { value: "SHORT_VIDEO", label: "Short video" },
  { value: "ZALO_OA", label: "Zalo OA" },
] as const;

const emptyForm: FormState = {
  title: "",
  painPoint: "",
  bodyPreview: "",
  publishChannel: "WEBSITE",
  ctaToolId: "noxh-check",
  ctaLabel: NOXH_CTA_TOOLS[0].defaultCtaLabel,
  sourceUrl: "",
  sheetKey: "",
  opsNotes: "",
  l3Checklist: { ...EMPTY_L3_CHECKLIST },
};

function itemToForm(item: ContentQueueItem): FormState {
  const tool = NOXH_CTA_TOOLS.find((t) => t.id === item.ctaToolId);
  return {
    title: item.title,
    painPoint: item.painPoint ?? "",
    bodyPreview: item.bodyPreview ?? "",
    publishChannel: item.publishChannel ?? "WEBSITE",
    ctaToolId: (item.ctaToolId as NoxhCtaToolId) || "",
    ctaLabel: item.ctaLabel ?? tool?.defaultCtaLabel ?? "",
    sourceUrl: item.sourceUrl ?? "",
    sheetKey: item.sheetKey ?? "",
    opsNotes: item.opsNotes ?? "",
    l3Checklist: parseL3Checklist(item.l3Checklist),
  };
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    PENDING_L3: "bg-amber-100 text-amber-800",
    INTAKE: "bg-slate-100 text-slate-700",
    APPROVED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-rose-100 text-rose-800",
    PUBLISHED: "bg-violet-100 text-violet-800",
  };
  const labels: Record<string, string> = {
    PENDING_L3: "Chờ L3",
    INTAKE: "Intake",
    APPROVED: "Đã duyệt",
    REJECTED: "Từ chối",
    PUBLISHED: "Đã đăng",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
        map[status] ?? "bg-slate-100 text-slate-700",
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function ContentQueueBoard() {
  const [filter, setFilter] = useState<StatusFilter>("PENDING_L3");
  const [items, setItems] = useState<ContentQueueItem[]>([]);
  const [counts, setCounts] = useState<Counts>({
    intake: 0,
    pendingL3: 0,
    approved: 0,
    rejected: 0,
    published: 0,
    total: 0,
    missingCta: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<{
    id: string;
    slug: string;
    title: string;
    status: string;
  } | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/content-queue?status=${encodeURIComponent(filter)}`,
        { credentials: "include" },
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không tải được content queue.");
        setItems([]);
        return;
      }
      setItems(json.data.items ?? []);
      setCounts(
        json.data.counts ?? {
          intake: 0,
          pendingL3: 0,
          approved: 0,
          rejected: 0,
          published: 0,
          total: 0,
          missingCta: 0,
        },
      );
    } catch {
      setError("Lỗi mạng khi tải content queue.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    setMode("create");
    setEditingId(null);
    setEditingStatus(null);
    setEditingArticle(null);
    setForm(emptyForm);
    setMessage(null);
    setError(null);
  }

  function openEdit(item: ContentQueueItem) {
    setMode("edit");
    setEditingId(item.id);
    setEditingStatus(item.status);
    setEditingArticle(item.article);
    setForm(itemToForm(item));
    setMessage(null);
    setError(null);
  }

  function closeEditor() {
    setMode("list");
    setEditingId(null);
    setEditingStatus(null);
    setEditingArticle(null);
    setForm(emptyForm);
    setRejectReason("");
  }

  function onCtaToolChange(id: NoxhCtaToolId | "") {
    const tool = NOXH_CTA_TOOLS.find((t) => t.id === id);
    setForm((f) => ({
      ...f,
      ctaToolId: id,
      ctaLabel: tool?.defaultCtaLabel ?? f.ctaLabel,
      l3Checklist: {
        ...f.l3Checklist,
        ctaTool: Boolean(id),
      },
    }));
  }

  async function save() {
    setActionLoading(true);
    setError(null);
    setMessage(null);
    const payload = {
      title: form.title.trim(),
      painPoint: form.painPoint.trim() || null,
      bodyPreview: form.bodyPreview.trim() || null,
      publishChannel: form.publishChannel || null,
      ctaToolId: form.ctaToolId || null,
      ctaLabel: form.ctaLabel.trim() || null,
      sourceUrl: form.sourceUrl.trim() || null,
      sheetKey: form.sheetKey.trim() || null,
      opsNotes: form.opsNotes.trim() || null,
      l3Checklist: form.l3Checklist,
    };
    try {
      const res =
        mode === "create"
          ? await fetch("/api/admin/content-queue", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/content-queue/${editingId}`, {
              method: "PATCH",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không lưu được.");
        return;
      }
      setMessage(mode === "create" ? "Đã tạo item." : "Đã cập nhật.");
      if (mode === "create") {
        setMode("edit");
        setEditingId(json.data.id);
        setEditingStatus(json.data.status);
      } else {
        setEditingStatus(json.data.status);
      }
      await load();
    } catch {
      setError("Lỗi mạng khi lưu.");
    } finally {
      setActionLoading(false);
    }
  }

  async function runAction(
    action:
      | "submit_l3"
      | "approve"
      | "reject"
      | "mark_published"
      | "publish_web",
    publishNow?: boolean,
  ) {
    if (!editingId) return;
    if (action === "reject" && rejectReason.trim().length < 5) {
      setError("Lý do từ chối tối thiểu 5 ký tự.");
      return;
    }
    setActionLoading(true);
    setError(null);
    setMessage(null);
    try {
      // Persist form before gate actions
      if (
        action === "submit_l3" ||
        action === "approve" ||
        action === "publish_web"
      ) {
        const patch = await fetch(`/api/admin/content-queue/${editingId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title.trim(),
            painPoint: form.painPoint.trim() || null,
            bodyPreview: form.bodyPreview.trim() || null,
            publishChannel: form.publishChannel || null,
            ctaToolId: form.ctaToolId || null,
            ctaLabel: form.ctaLabel.trim() || null,
            sourceUrl: form.sourceUrl.trim() || null,
            sheetKey: form.sheetKey.trim() || null,
            opsNotes: form.opsNotes.trim() || null,
            l3Checklist: form.l3Checklist,
          }),
        });
        if (!patch.ok) {
          const j = await patch.json();
          setError(j?.error?.message ?? "Không lưu trước khi duyệt.");
          return;
        }
      }

      const res = await fetch(`/api/admin/content-queue/${editingId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          action === "reject"
            ? { action, rejectReason: rejectReason.trim() }
            : action === "publish_web"
              ? { action, publishNow: publishNow !== false }
              : { action },
        ),
      });
      const json = await res.json();
      if (!res.ok) {
        const details = Array.isArray(json?.error?.details)
          ? `\n• ${json.error.details.join("\n• ")}`
          : "";
        setError((json?.error?.message ?? "Thao tác thất bại.") + details);
        return;
      }
      setEditingStatus(json.data.status);
      if (json.data.article) {
        setEditingArticle(json.data.article);
      }
      setMessage(
        action === "approve"
          ? "Đã duyệt L3."
          : action === "submit_l3"
            ? "Đã gửi chờ L3."
            : action === "reject"
              ? "Đã từ chối."
              : action === "publish_web"
                ? publishNow === false
                  ? "Đã tạo bài nháp trên CMS."
                  : "Đã publish bài web + đánh dấu queue published."
                : "Đã đánh dấu published.",
      );
      setRejectReason("");
      await load();
    } catch {
      setError("Lỗi mạng khi chuyển trạng thái.");
    } finally {
      setActionLoading(false);
    }
  }

  if (mode !== "list") {
    const selectedTool = NOXH_CTA_TOOLS.find((t) => t.id === form.ctaToolId);
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" onClick={closeEditor}>
            ← Quay lại hàng đợi
          </Button>
          {editingStatus ? statusBadge(editingStatus) : null}
        </div>

        {message ? (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="whitespace-pre-wrap rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {error}
          </p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1 text-sm md:col-span-2">
            <span className="font-medium">Tiêu đề</span>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </label>

          <label className="block space-y-1 text-sm md:col-span-2">
            <span className="font-medium">Nỗi đau NƠXH (1 câu)</span>
            <textarea
              className="min-h-20 w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.painPoint}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  painPoint: e.target.value,
                  l3Checklist: {
                    ...f.l3Checklist,
                    pain: e.target.value.trim().length > 0,
                  },
                }))
              }
              placeholder="VD: Không biết thu nhập 12tr có đủ điều kiện NƠXH 2026 không"
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Kênh publish</span>
            <select
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.publishChannel}
              onChange={(e) =>
                setForm((f) => ({ ...f, publishChannel: e.target.value }))
              }
            >
              {CHANNELS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">CTA tool (bắt buộc L3)</span>
            <select
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.ctaToolId}
              onChange={(e) =>
                onCtaToolChange(e.target.value as NoxhCtaToolId | "")
              }
            >
              <option value="">— Chọn tool —</option>
              {NOXH_CTA_TOOLS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
            {selectedTool ? (
              <span className="block text-xs text-slate-500">
                {selectedTool.when} · {selectedTool.href}
              </span>
            ) : null}
          </label>

          <label className="block space-y-1 text-sm md:col-span-2">
            <span className="font-medium">Câu CTA trên bài</span>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.ctaLabel}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  ctaLabel: e.target.value,
                  l3Checklist: {
                    ...f.l3Checklist,
                    ctaCopy: e.target.value.trim().length > 0,
                  },
                }))
              }
            />
          </label>

          {selectedTool ? (
            <div className="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm whitespace-pre-wrap text-slate-700">
              <p className="mb-1 font-medium text-slate-900">Khối chốt copy-paste</p>
              {selectedTool.closingBlock}
            </div>
          ) : null}

          <label className="block space-y-1 text-sm md:col-span-2">
            <span className="font-medium">Preview / ghi chú nội dung</span>
            <textarea
              className="min-h-28 w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.bodyPreview}
              onChange={(e) =>
                setForm((f) => ({ ...f, bodyPreview: e.target.value }))
              }
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Source URL (optional)</span>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.sourceUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, sourceUrl: e.target.value }))
              }
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Sheet key (optional)</span>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.sheetKey}
              onChange={(e) =>
                setForm((f) => ({ ...f, sheetKey: e.target.value }))
              }
              placeholder="content_queue.normalized_key"
            />
          </label>

          <div className="md:col-span-2 space-y-2 rounded-md border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-semibold text-amber-900">
              Checklist L3 — thiếu 1 mục = không duyệt
            </p>
            {(Object.keys(L3_CHECKLIST_LABELS) as (keyof L3ContentChecklist)[]).map(
              (key) => (
                <label key={key} className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={form.l3Checklist[key]}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        l3Checklist: {
                          ...f.l3Checklist,
                          [key]: e.target.checked,
                        },
                      }))
                    }
                  />
                  <span>{L3_CHECKLIST_LABELS[key]}</span>
                </label>
              ),
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={actionLoading} onClick={() => void save()}>
            Lưu
          </Button>
          {editingStatus === "INTAKE" || editingStatus === "REJECTED" ? (
            <Button
              type="button"
              variant="outline"
              disabled={actionLoading}
              onClick={() => void runAction("submit_l3")}
            >
              Gửi chờ L3
            </Button>
          ) : null}
          {editingStatus === "PENDING_L3" ? (
            <>
              <Button
                type="button"
                disabled={actionLoading}
                onClick={() => void runAction("approve")}
              >
                Duyệt L3
              </Button>
              <input
                className="min-w-48 flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Lý do từ chối (≥5 ký tự)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                disabled={actionLoading}
                onClick={() => void runAction("reject")}
              >
                Từ chối
              </Button>
            </>
          ) : null}
          {editingStatus === "APPROVED" ? (
            <>
              <Button
                type="button"
                disabled={actionLoading}
                onClick={() => void runAction("publish_web", true)}
              >
                Publish web ngay
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={actionLoading}
                onClick={() => void runAction("publish_web", false)}
              >
                Tạo nháp CMS
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={actionLoading}
                onClick={() => void runAction("mark_published")}
              >
                Đánh dấu đã đăng (tay)
              </Button>
            </>
          ) : null}
          {editingStatus === "PUBLISHED" && editingArticle ? (
            <Button
              type="button"
              variant="outline"
              disabled={actionLoading}
              onClick={() => void runAction("publish_web", true)}
            >
              Đồng bộ lại bài web
            </Button>
          ) : null}
        </div>

        {editingArticle ? (
          <p className="text-sm text-slate-600">
            CMS:{" "}
            <a
              className="font-medium text-sky-700 underline"
              href={`/admin/articles/${editingArticle.id}`}
            >
              {editingArticle.title}
            </a>
            {" · "}
            <span className="text-slate-500">{editingArticle.status}</span>
            {editingArticle.status === "PUBLISHED" ? (
              <>
                {" · "}
                <a
                  className="font-medium text-sky-700 underline"
                  href={articlePath(editingArticle.slug)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Xem public
                </a>
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium",
                filter === tab.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200",
              )}
            >
              {tab.label}
              {tab.key === "PENDING_L3" ? ` (${counts.pendingL3})` : ""}
              {tab.key === "INTAKE" ? ` (${counts.intake})` : ""}
            </button>
          ))}
        </div>
        <Button type="button" onClick={openCreate}>
          + Thêm bài
        </Button>
      </div>

      <p className="text-sm text-slate-600">
        Tổng {counts.total} · Thiếu CTA tool:{" "}
        <span className="font-semibold text-rose-700">{counts.missingCta}</span>
      </p>

      {error ? (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">
          Chưa có item. Bấm «Thêm bài» — mỗi bài bắt buộc 1 CTA tool NƠXH trước L3.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                onClick={() => openEdit(item)}
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {statusBadge(item.status)}
                    {!item.ctaToolId ? (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800">
                        Thiếu CTA
                      </span>
                    ) : (
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">
                        {item.ctaHref ?? item.ctaToolId}
                      </span>
                    )}
                  </div>
                  <p className="truncate font-medium text-slate-900">
                    {item.title}
                  </p>
                  {item.painPoint ? (
                    <p className="truncate text-sm text-slate-500">
                      {item.painPoint}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 text-xs text-slate-400">
                  {formatDate(item.createdAt)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
