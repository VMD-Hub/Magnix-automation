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
  | "DRAFT"
  | "PENDING_L3"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "SCHEDULED"
  | "ALL";

type ContentDraftItem = {
  id: string;
  normalizedKey: string;
  title: string;
  hookLine: string | null;
  artifactMarkdown: string | null;
  ctaOptIn: string | null;
  disclaimer: string | null;
  exportHint: string | null;
  segment: string | null;
  qaTier: string | null;
  source: string | null;
  status: string;
  publishChannel: string | null;
  ctaToolId: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  opsNotes: string | null;
  l3Checklist: unknown;
  scheduledAt: string | null;
  sheetSyncedAt: string | null;
  sheetStatus: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectReason: string | null;
  publishedAt: string | null;
  createdAt: string;
  article: { id: string; slug: string; title: string; status: string } | null;
};

type Counts = {
  draft: number;
  pendingL3: number;
  approved: number;
  rejected: number;
  published: number;
  scheduled: number;
  total: number;
  missingCta: number;
};

type FormState = {
  title: string;
  hookLine: string;
  artifactMarkdown: string;
  ctaOptIn: string;
  disclaimer: string;
  segment: string;
  publishChannel: string;
  ctaToolId: NoxhCtaToolId | "";
  ctaLabel: string;
  opsNotes: string;
  scheduledAt: string;
  l3Checklist: L3ContentChecklist;
};

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "DRAFT", label: "Nháp" },
  { key: "PENDING_L3", label: "Chờ L3" },
  { key: "SCHEDULED", label: "Lịch đăng" },
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
  hookLine: "",
  artifactMarkdown: "",
  ctaOptIn: "",
  disclaimer: "",
  segment: "",
  publishChannel: "WEBSITE",
  ctaToolId: "noxh-check",
  ctaLabel: NOXH_CTA_TOOLS[0].defaultCtaLabel,
  opsNotes: "",
  scheduledAt: "",
  l3Checklist: { ...EMPTY_L3_CHECKLIST },
};

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(local: string): string | null {
  if (!local.trim()) return null;
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function itemToForm(item: ContentDraftItem): FormState {
  const tool = NOXH_CTA_TOOLS.find((t) => t.id === item.ctaToolId);
  return {
    title: item.title,
    hookLine: item.hookLine ?? "",
    artifactMarkdown: item.artifactMarkdown ?? "",
    ctaOptIn: item.ctaOptIn ?? "",
    disclaimer: item.disclaimer ?? "",
    segment: item.segment ?? "",
    publishChannel: item.publishChannel ?? "WEBSITE",
    ctaToolId: (item.ctaToolId as NoxhCtaToolId) || "",
    ctaLabel: item.ctaLabel ?? tool?.defaultCtaLabel ?? "",
    opsNotes: item.opsNotes ?? "",
    scheduledAt: toLocalInput(item.scheduledAt),
    l3Checklist: parseL3Checklist(item.l3Checklist),
  };
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    PENDING_L3: "bg-amber-100 text-amber-800",
    APPROVED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-rose-100 text-rose-800",
    PUBLISHED: "bg-violet-100 text-violet-800",
  };
  const labels: Record<string, string> = {
    DRAFT: "Nháp",
    PENDING_L3: "Chờ L3",
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

export function ContentDraftBoard() {
  const [filter, setFilter] = useState<StatusFilter>("DRAFT");
  const [items, setItems] = useState<ContentDraftItem[]>([]);
  const [counts, setCounts] = useState<Counts>({
    draft: 0,
    pendingL3: 0,
    approved: 0,
    rejected: 0,
    published: 0,
    scheduled: 0,
    total: 0,
    missingCta: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
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
        `/api/admin/content-drafts?status=${encodeURIComponent(filter)}`,
        { credentials: "include" },
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không tải được content drafts.");
        setItems([]);
        return;
      }
      setItems(json.data.items ?? []);
      setCounts(
        json.data.counts ?? {
          draft: 0,
          pendingL3: 0,
          approved: 0,
          rejected: 0,
          published: 0,
          scheduled: 0,
          total: 0,
          missingCta: 0,
        },
      );
    } catch {
      setError("Lỗi mạng khi tải content drafts.");
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

  function openEdit(item: ContentDraftItem) {
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

  async function syncFromSheet() {
    setSyncLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content-drafts/sync", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 100 }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(
          json?.error?.message ??
            "Sync thất bại — kiểm tra GOOGLE_SERVICE_ACCOUNT_JSON + MAGNIX_CONTENT_SHEET_ID trên VPS.",
        );
        return;
      }
      const r = json.data;
      setMessage(
        `Sync OK: +${r.created} mới · ${r.updated} cập nhật · quét ${r.scanned} dòng Sheet.`,
      );
      await load();
    } catch {
      setError("Lỗi mạng khi sync Sheet.");
    } finally {
      setSyncLoading(false);
    }
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

  function payloadFromForm() {
    return {
      title: form.title.trim(),
      hookLine: form.hookLine.trim() || null,
      artifactMarkdown: form.artifactMarkdown.trim() || null,
      ctaOptIn: form.ctaOptIn.trim() || null,
      disclaimer: form.disclaimer.trim() || null,
      segment: form.segment.trim() || null,
      publishChannel: form.publishChannel || null,
      ctaToolId: form.ctaToolId || null,
      ctaLabel: form.ctaLabel.trim() || null,
      opsNotes: form.opsNotes.trim() || null,
      l3Checklist: form.l3Checklist,
      scheduledAt: fromLocalInput(form.scheduledAt),
    };
  }

  async function save() {
    setActionLoading(true);
    setError(null);
    setMessage(null);
    const payload = payloadFromForm();
    try {
      const res =
        mode === "create"
          ? await fetch("/api/admin/content-drafts", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/content-drafts/${editingId}`, {
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
      setMessage(mode === "create" ? "Đã tạo draft." : "Đã cập nhật.");
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
    action: "submit_l3" | "approve" | "reject" | "mark_published",
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
      if (action === "submit_l3" || action === "approve") {
        const patch = await fetch(`/api/admin/content-drafts/${editingId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadFromForm()),
        });
        if (!patch.ok) {
          const j = await patch.json();
          setError(j?.error?.message ?? "Không lưu trước khi duyệt.");
          return;
        }
      }

      const res = await fetch(`/api/admin/content-drafts/${editingId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          action === "reject"
            ? { action, rejectReason: rejectReason.trim() }
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
      if (json.data.article) setEditingArticle(json.data.article);
      setMessage(
        action === "approve"
          ? "Đã duyệt L3."
          : action === "submit_l3"
            ? "Đã gửi chờ L3."
            : action === "reject"
              ? "Đã từ chối."
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
            ← Quay lại drafts
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
            <span className="font-medium">Hook / nỗi đau (1 câu)</span>
            <textarea
              className="min-h-20 w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.hookLine}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  hookLine: e.target.value,
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
            <span className="font-medium">Segment</span>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.segment}
              onChange={(e) =>
                setForm((f) => ({ ...f, segment: e.target.value }))
              }
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

          <label className="block space-y-1 text-sm">
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
            <span className="font-medium">Artifact markdown</span>
            <textarea
              className="min-h-40 w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs"
              value={form.artifactMarkdown}
              onChange={(e) =>
                setForm((f) => ({ ...f, artifactMarkdown: e.target.value }))
              }
            />
          </label>

          <label className="block space-y-1 text-sm md:col-span-2">
            <span className="font-medium">CTA opt-in (Sheet)</span>
            <textarea
              className="min-h-16 w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.ctaOptIn}
              onChange={(e) =>
                setForm((f) => ({ ...f, ctaOptIn: e.target.value }))
              }
            />
          </label>

          <label className="block space-y-1 text-sm md:col-span-2">
            <span className="font-medium">Disclaimer</span>
            <textarea
              className="min-h-16 w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.disclaimer}
              onChange={(e) =>
                setForm((f) => ({ ...f, disclaimer: e.target.value }))
              }
            />
          </label>

          <label className="block space-y-1 text-sm md:col-span-2">
            <span className="font-medium">Ghi chú Ops</span>
            <textarea
              className="min-h-16 w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.opsNotes}
              onChange={(e) =>
                setForm((f) => ({ ...f, opsNotes: e.target.value }))
              }
            />
          </label>

          <label className="block space-y-1 text-sm md:col-span-2">
            <span className="font-medium">Lịch đăng (P4)</span>
            <input
              type="datetime-local"
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.scheduledAt}
              onChange={(e) =>
                setForm((f) => ({ ...f, scheduledAt: e.target.value }))
              }
            />
            <span className="text-xs text-slate-500">
              Sync Sheet không ghi đè field này. Cron Page Publish (P4.3) đọc Postgres khi tới giờ.
            </span>
          </label>

          <div className="md:col-span-2 space-y-2 rounded-md border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-semibold text-amber-900">
              Checklist L3 — thiếu 1 mục = không duyệt
            </p>
            {(
              Object.keys(L3_CHECKLIST_LABELS) as (keyof L3ContentChecklist)[]
            ).map((key) => (
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
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={actionLoading} onClick={() => void save()}>
            Lưu
          </Button>
          {editingStatus === "DRAFT" || editingStatus === "REJECTED" ? (
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
            <Button
              type="button"
              variant="outline"
              disabled={actionLoading}
              onClick={() => void runAction("mark_published")}
            >
              Đánh dấu đã đăng (tay)
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
              {tab.key === "DRAFT" ? ` (${counts.draft})` : ""}
              {tab.key === "PENDING_L3" ? ` (${counts.pendingL3})` : ""}
              {tab.key === "SCHEDULED" ? ` (${counts.scheduled})` : ""}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={syncLoading}
            onClick={() => void syncFromSheet()}
          >
            {syncLoading ? "Đang sync…" : "Sync từ Sheet"}
          </Button>
          <Button type="button" onClick={openCreate}>
            + Thêm draft
          </Button>
        </div>
      </div>

      {message ? (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}

      <p className="text-sm text-slate-600">
        Tổng {counts.total} · Lịch đăng: {counts.scheduled} · Thiếu CTA tool:{" "}
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
          Chưa có draft. Sync Sheet tab content_drafts hoặc bấm «Thêm draft».
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
                    {item.scheduledAt ? (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
                        Lịch {formatDate(item.scheduledAt)}
                      </span>
                    ) : null}
                    {item.segment ? (
                      <span className="text-xs text-slate-400">{item.segment}</span>
                    ) : null}
                  </div>
                  <p className="truncate font-medium text-slate-900">
                    {item.title}
                  </p>
                  {item.hookLine ? (
                    <p className="truncate text-sm text-slate-500">
                      {item.hookLine}
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
