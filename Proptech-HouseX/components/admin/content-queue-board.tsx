"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import {
  L3_CHECKLIST_LABELS,
  NOXH_CTA_TOOLS,
  EMPTY_L3_CHECKLIST,
  getNoxhCtaTool,
  type L3ContentChecklist,
  type NoxhCtaToolId,
  parseL3Checklist,
} from "@/lib/content/noxh-cta-tools";
import { resolveArticleTagDisplayName } from "@/lib/content/articles/noxh-handbook-tags";
import { articlePath } from "@/lib/content/article-routes";
import { QueueArticleReaderPreview } from "@/components/admin/queue-article-reader-preview";
import {
  normalizeQueueBodyForReader,
  queueBodyHasCtaSection,
  READER_CTA_HEADING,
} from "@/lib/content/content-queue-article";

type StatusFilter =
  | "PENDING_L3"
  | "INTAKE"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "SCHEDULED"
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
  scheduledAt: string | null;
  sheetSyncedAt: string | null;
  platform: string | null;
  sheetStatus: string | null;
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
  scheduled: number;
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
  scheduledAt: string;
  l3Checklist: L3ContentChecklist;
};

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "PENDING_L3", label: "Chờ L3" },
  { key: "INTAKE", label: "Intake" },
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
  painPoint: "",
  bodyPreview: "",
  publishChannel: "WEBSITE",
  ctaToolId: "noxh-check",
  ctaLabel: NOXH_CTA_TOOLS[0].defaultCtaLabel,
  sourceUrl: "",
  sheetKey: "",
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
    scheduledAt: toLocalInput(item.scheduledAt),
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

/** Chủ đề từ opsNotes `tags: slug-a, slug-b` — không nhầm với CTA href. */
function parseOpsTopicSlugs(opsNotes: string | null | undefined): string[] {
  const m = opsNotes?.match(/^tags:\s*(.+)$/m);
  if (!m?.[1]) return [];
  return m[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function queueListTopicBadges(item: ContentQueueItem) {
  const slugs = parseOpsTopicSlugs(item.opsNotes).slice(0, 2);
  if (slugs.length === 0) return null;
  return slugs.map((slug) => (
    <span
      key={slug}
      className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-900"
      title={slug}
    >
      {resolveArticleTagDisplayName(slug)}
    </span>
  ));
}

function queueListCtaBadge(item: ContentQueueItem) {
  if (!item.ctaToolId) {
    return (
      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800">
        Thiếu CTA
      </span>
    );
  }
  const tool = getNoxhCtaTool(item.ctaToolId);
  const label = item.ctaLabel?.trim() || tool?.title || item.ctaToolId;
  return (
    <span
      className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800"
      title={item.ctaHref ?? tool?.href ?? undefined}
    >
      CTA: {label}
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
  const [bodyTab, setBodyTab] = useState<"edit" | "reader">("reader");
  const [items, setItems] = useState<ContentQueueItem[]>([]);
  const [counts, setCounts] = useState<Counts>({
    intake: 0,
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
  const [search, setSearch] = useState("");

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
          scheduled: 0,
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
    setBodyTab("reader");
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
      const res = await fetch("/api/admin/content-queue/sync", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 100, minScore: 70 }),
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

  /** Chèn khối CTA vào body để Super Admin duyệt đúng thứ người đọc thấy. */
  function insertCtaBlockIntoBody() {
    const tool = getNoxhCtaTool(form.ctaToolId);
    if (!tool) {
      setError("Chọn CTA tool trước khi chèn khối Kiểm tra nhanh.");
      return;
    }
    const label = form.ctaLabel.trim() || tool.defaultCtaLabel;
    const href = tool.href;
    if (queueBodyHasCtaSection(form.bodyPreview)) {
      setMessage("Body đã có ## Kiểm tra nhanh — xem tab Như người đọc.");
      return;
    }
    const block = [
      "",
      READER_CTA_HEADING,
      "",
      `[${label}](${href})`,
      "",
    ].join("\n");
    setForm((f) => ({
      ...f,
      bodyPreview: `${f.bodyPreview.trim()}${block}`.trim(),
      l3Checklist: { ...f.l3Checklist, ctaCopy: true },
    }));
    setBodyTab("reader");
    setMessage("Đã chèn khối Kiểm tra nhanh vào bài — kiểm tra tab Như người đọc.");
  }

  async function save() {
    setActionLoading(true);
    setError(null);
    setMessage(null);
    const payload = {
      title: form.title.trim(),
      painPoint: form.painPoint.trim() || null,
      bodyPreview: form.bodyPreview.trim()
        ? normalizeQueueBodyForReader(form.bodyPreview)
        : null,
      publishChannel: form.publishChannel || null,
      ctaToolId: form.ctaToolId || null,
      ctaLabel: form.ctaLabel.trim() || null,
      sourceUrl: form.sourceUrl.trim() || null,
      sheetKey: form.sheetKey.trim() || null,
      opsNotes: form.opsNotes.trim() || null,
      l3Checklist: form.l3Checklist,
      scheduledAt: fromLocalInput(form.scheduledAt),
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
      if (mode === "create") {
        setMessage("Đã tạo item.");
        setMode("edit");
        setEditingId(json.data.id);
        setEditingStatus(json.data.status);
        await load();
        return;
      }

      setEditingStatus(json.data.status);

      // Bài đã PUBLISHED: Lưu phải đẩy luôn lên Article CMS + xóa ISR cache.
      if (editingStatus === "PUBLISHED" && editingId) {
        const sync = await fetch(`/api/admin/content-queue/${editingId}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "publish_web", publishNow: true }),
        });
        const syncJson = await sync.json();
        if (!sync.ok) {
          const details = Array.isArray(syncJson?.error?.details)
            ? `\n• ${syncJson.error.details.join("\n• ")}`
            : "";
          setError(
            (syncJson?.error?.message ??
              "Đã lưu queue nhưng đồng bộ web thất bại.") + details,
          );
          await load();
          return;
        }
        if (syncJson.data?.article) setEditingArticle(syncJson.data.article);
        setMessage(
          "Đã lưu và đồng bộ lên web. Hard refresh trang bài nếu vẫn thấy bản cũ.",
        );
      } else {
        setMessage("Đã cập nhật queue (chưa lên web — dùng Publish web khi duyệt xong).");
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
      | "publish_web"
      | "hide_public"
      | "delete_item"
      | "pull_web",
    publishNow?: boolean,
  ) {
    if (!editingId) return;
    if (action === "reject" && rejectReason.trim().length < 5) {
      setError("Lý do từ chối tối thiểu 5 ký tự.");
      return;
    }
    if (action === "hide_public") {
      const okHide = window.confirm(
        "Ẩn bài khỏi site + sitemap? Catalog demo cùng slug cũng bị chặn. Queue chuyển REJECTED để bạn sửa lại nếu cần.",
      );
      if (!okHide) return;
    }
    if (action === "delete_item") {
      const okDel = window.confirm(
        "Xóa item khỏi queue? Bài vẫn bị ẩn trên site (ARCHIVED) để không ảnh hưởng uy tín. Không hoàn tác.",
      );
      if (!okDel) return;
    }
    if (action === "pull_web") {
      const okPull = window.confirm(
        "Kéo bản đang live trên web vào Super Admin? Nội dung queue hiện tại sẽ bị ghi đè bằng CMS.",
      );
      if (!okPull) return;
    }
    setActionLoading(true);
    setError(null);
    setMessage(null);
    try {
      // Persist form before gate / publish actions
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
            bodyPreview: form.bodyPreview.trim()
              ? normalizeQueueBodyForReader(form.bodyPreview)
              : null,
            publishChannel: form.publishChannel || null,
            ctaToolId: form.ctaToolId || null,
            ctaLabel: form.ctaLabel.trim() || null,
            sourceUrl: form.sourceUrl.trim() || null,
            sheetKey: form.sheetKey.trim() || null,
            opsNotes: form.opsNotes.trim() || null,
            l3Checklist: form.l3Checklist,
            scheduledAt: fromLocalInput(form.scheduledAt),
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
              : action === "hide_public"
                ? {
                    action,
                    reason:
                      rejectReason.trim().length >= 5
                        ? rejectReason.trim()
                        : undefined,
                  }
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
      if (action === "delete_item") {
        setMessage("Đã xóa khỏi queue; slug vẫn ẩn trên site.");
        setRejectReason("");
        closeEditor();
        await load();
        return;
      }
      if (action === "pull_web" && json.data) {
        setForm(itemToForm(json.data));
        setEditingStatus(json.data.status);
        if (json.data.article) setEditingArticle(json.data.article);
        setMessage("Đã kéo bản web vào Super Admin — kiểm tra tab Như người đọc rồi Lưu & đồng bộ nếu sửa tiếp.");
        await load();
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
              : action === "hide_public"
                ? "Đã ẩn khỏi site + sitemap."
                : action === "publish_web"
                  ? publishNow === false
                    ? "Đã tạo bài nháp trên CMS."
                    : "Đã đồng bộ lên web (PUBLISHED)."
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
              <p className="mb-1 font-medium text-slate-900">
                Khối chốt copy-paste (nội bộ ops — không đăng nguyên khối này)
              </p>
              {selectedTool.closingBlock}
            </div>
          ) : null}

          <div className="md:col-span-2 space-y-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-950">
            <p className="font-semibold">Duyệt L2/L3 = nhìn như người đọc</p>
            <ul className="list-disc space-y-1 pl-5 text-sky-900/90">
              <li>
                Tab <strong>Như người đọc</strong>: markdown đã render — đúng lớp{" "}
                <code className="rounded bg-sky-100 px-1">ArticleBody</code> trên
                web. Tab <strong>Sửa markdown</strong>: nguồn thô; không dùng tab
                này để “duyệt cảm nhận bài”.
              </li>
              <li>
                <strong>Cú pháp hỗ trợ:</strong>{" "}
                <code className="rounded bg-sky-100 px-1">**đậm**</code>
                {" · "}
                <code className="rounded bg-sky-100 px-1">
                  [nhãn](/duong-dan)
                </code>
                {" · "}
                <code className="rounded bg-sky-100 px-1">## / ###</code> tiêu đề
                {" · "}
                <code className="rounded bg-sky-100 px-1">- mục</code> /{" "}
                <code className="rounded bg-sky-100 px-1">1. mục</code> danh sách
                {" · "}
                <code className="rounded bg-sky-100 px-1">&gt; đoạn</code> khối
                nổi (disclaimer) · dòng trống = ngắt đoạn · bảng{" "}
                <code className="rounded bg-sky-100 px-1">| … |</code> · ảnh{" "}
                <code className="rounded bg-sky-100 px-1">![alt](url)</code>
              </li>
              <li>
                <strong>FAQ dạng dropdown:</strong> H2{" "}
                <code className="rounded bg-sky-100 px-1">
                  ## Câu hỏi thường gặp
                </code>{" "}
                hoặc{" "}
                <code className="rounded bg-sky-100 px-1">## FAQ</code>, mỗi câu
                hỏi là{" "}
                <code className="rounded bg-sky-100 px-1">
                  ### Câu hỏi kết thúc bằng ?
                </code>{" "}
                (hoặc{" "}
                <code className="rounded bg-sky-100 px-1">
                  **Câu hỏi?**
                </code>
                ), trả lời ở đoạn ngay dưới — tab Như người đọc sẽ hiện accordion.
              </li>
              <li>
                <strong>Không hỗ trợ thụt đầu dòng / thụt khối:</strong> khoảng
                trắng hoặc Tab đầu dòng bị bỏ khi render. Muốn “nhấn” cả đoạn →
                dùng{" "}
                <code className="rounded bg-sky-100 px-1">&gt; …</code>, không
                cách thụt như Word.
              </li>
              <li>
                Không để lộ nhãn hệ thống trên bài:{" "}
                <code className="rounded bg-sky-100 px-1">(CTA)</code>, ghi chú
                ops, frontmatter, hướng dẫn seed. Ops chỉ ở khung riêng bên dưới.
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium">Nội dung bài</span>
              <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setBodyTab("reader")}
                  className={cn(
                    "rounded px-3 py-1.5 font-medium transition-colors",
                    bodyTab === "reader"
                      ? "bg-brand-600 text-white"
                      : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  Như người đọc
                </button>
                <button
                  type="button"
                  onClick={() => setBodyTab("edit")}
                  className={cn(
                    "rounded px-3 py-1.5 font-medium transition-colors",
                    bodyTab === "edit"
                      ? "bg-brand-600 text-white"
                      : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  Sửa markdown
                </button>
              </div>
            </div>
            {bodyTab === "reader" ? (
              <div className="max-h-[32rem] overflow-y-auto rounded-md border border-slate-200 bg-white p-4">
                <QueueArticleReaderPreview markdown={form.bodyPreview} />
                <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  Preview = đúng renderer trên web. Khối{" "}
                  <code>## Kiểm tra nhanh</code> (nếu có trong markdown) phải
                  hiện ở đây trước khi duyệt / publish.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  className="min-h-64 w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-sm"
                  value={form.bodyPreview}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bodyPreview: e.target.value }))
                  }
                  spellCheck={false}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={actionLoading || !form.ctaToolId}
                  onClick={insertCtaBlockIntoBody}
                >
                  Chèn khối Kiểm tra nhanh vào bài
                </Button>
              </div>
            )}
          </div>

          <label className="block space-y-1 text-sm md:col-span-2">
            <span className="font-medium">
              Ghi chú Ops (nội bộ — không lên bài đọc giả)
            </span>
            <textarea
              className="min-h-20 w-full rounded-md border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm"
              value={form.opsNotes}
              onChange={(e) =>
                setForm((f) => ({ ...f, opsNotes: e.target.value }))
              }
              placeholder="L2 /devil, neo văn bản, cảnh báo… — chỉ admin thấy"
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
              Sync Sheet không ghi đè field này. Publish tự động theo lịch =
              slice P4 sau.
            </span>
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
            {editingStatus === "PUBLISHED"
              ? "Lưu & đồng bộ lên web"
              : "Lưu"}
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
          {editingStatus === "PUBLISHED" ? (
            <>
              {editingArticle ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={actionLoading}
                  onClick={() => void runAction("pull_web")}
                >
                  Kéo từ web → Admin
                </Button>
              ) : null}
            </>
          ) : null}
          <Button
            type="button"
            variant="outline"
            disabled={actionLoading}
            className="border-amber-300 text-amber-900 hover:bg-amber-50"
            onClick={() => void runAction("hide_public")}
          >
            Ẩn khỏi site
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={actionLoading}
            className="border-red-300 text-red-800 hover:bg-red-50"
            onClick={() => void runAction("delete_item")}
          >
            Xóa khỏi queue
          </Button>
        </div>

        <p className="rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-950">
          <strong>Đồng bộ 2 chiều:</strong> bài đã đăng — nút{" "}
          <em>Lưu &amp; đồng bộ lên web</em> ghi CMS và xóa cache trang ngay.
          Thấy lệch trên site → <em>Kéo từ web → Admin</em>, sửa, rồi lưu lại.
          Tab <strong>Như người đọc</strong> là bản sẽ lên web (gồm{" "}
          <code>## Kiểm tra nhanh</code>).
        </p>

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

  const visibleItems = items.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.normalizedKey.toLowerCase().includes(q) ||
      (item.opsNotes ?? "").toLowerCase().includes(q) ||
      (item.article?.slug ?? "").toLowerCase().includes(q) ||
      (item.painPoint ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
        Bài live trên web nhưng không thấy ở đây? Chúng thường còn trong{" "}
        <strong>catalog code</strong> (chưa nạp Super Admin). Trên VPS chạy{" "}
        <code className="rounded bg-amber-100 px-1">
          npm run db:seed:wiki-noxh-queue
        </code>{" "}
        và{" "}
        <code className="rounded bg-amber-100 px-1">
          npm run db:seed:kien-thuc-queue
        </code>{" "}
        (mặc định đồng bộ CMS + tab <strong>Đã đăng</strong>). Badge xanh lá =
        chủ đề bài; badge xanh dương = CTA tool — không phải cùng một loại nhãn.
        Tab <strong>Intake</strong> chỉ là chờ biên tập; bài đã publish xem tab{" "}
        <strong>Đã đăng</strong> / <strong>Tất cả</strong>.
      </p>
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
              {tab.key === "SCHEDULED" ? ` (${counts.scheduled})` : ""}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            className="min-w-56 rounded-md border border-slate-200 px-3 py-2 text-sm"
            placeholder="Tìm tiêu đề / slug / kien-thuc:…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            disabled={syncLoading}
            onClick={() => void syncFromSheet()}
          >
            {syncLoading ? "Đang sync…" : "Sync từ Sheet"}
          </Button>
          <Button type="button" onClick={openCreate}>
            + Thêm bài
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
      ) : visibleItems.length === 0 ? (
        <p className="text-sm text-slate-500">
          {items.length === 0
            ? "Tab trống. Thử «Tất cả» / «Intake», hoặc seed kien-thuc / wiki trên VPS."
            : "Không khớp từ khóa — xóa ô tìm hoặc đổi tab."}
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {visibleItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                onClick={() => openEdit(item)}
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {statusBadge(item.status)}
                    {queueListTopicBadges(item)}
                    {queueListCtaBadge(item)}
                    {item.scheduledAt ? (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
                        Lịch {formatDate(item.scheduledAt)}
                      </span>
                    ) : null}
                    {item.platform ? (
                      <span className="text-xs text-slate-400">{item.platform}</span>
                    ) : null}
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
