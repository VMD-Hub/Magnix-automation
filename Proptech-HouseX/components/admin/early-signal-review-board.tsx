"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import { DEFAULT_T1_READER_DISCLAIMER } from "@/lib/leads/early-signal-gates";

type StatusFilter =
  | "PENDING_L3"
  | "PACKAGED"
  | "CAPTURED"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "ALL";

type EarlySignalItem = {
  id: string;
  status: string;
  tier: string;
  pressUrl: string | null;
  sxdUrl: string | null;
  groupSlug: string | null;
  channelSlug: string | null;
  roleHint: string | null;
  resolveStatus: string | null;
  provinceHint: string | null;
  opsNotes: string | null;
  readerTitle: string | null;
  readerBody: string | null;
  readerDisclaimer: string | null;
  ctaLabel: string | null;
  nurtureOnApprove: boolean;
  packagedAt: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectReason: string | null;
  createdAt: string;
  project: { id: string; name: string; slug: string; status: string } | null;
  article: { id: string; slug: string; title: string; status: string } | null;
};

type Counts = {
  pendingL3: number;
  packaged: number;
  captured: number;
  approved: number;
  rejected: number;
  published: number;
  total: number;
};

type FormState = {
  tier: string;
  pressUrl: string;
  sxdUrl: string;
  groupSlug: string;
  channelSlug: string;
  provinceHint: string;
  roleHint: string;
  resolveStatus: string;
  opsNotes: string;
  readerTitle: string;
  readerBody: string;
  readerDisclaimer: string;
  ctaLabel: string;
};

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "PENDING_L3", label: "Chờ L3" },
  { key: "PACKAGED", label: "Đã đóng gói" },
  { key: "CAPTURED", label: "Intake" },
  { key: "APPROVED", label: "Đã duyệt" },
  { key: "REJECTED", label: "Từ chối" },
  { key: "PUBLISHED", label: "Đã đăng" },
  { key: "ALL", label: "Tất cả" },
];

const WIZARD_STEPS = [
  { id: 0, label: "1. Nguồn (ops)" },
  { id: 1, label: "2. Bản người đọc" },
  { id: 2, label: "3. Xem lại & duyệt" },
] as const;

const TIER_OPTIONS = ["T1_PRESS", "T2_SXD", "T3_DOSSIER", "T4_SOR"] as const;

const emptyForm: FormState = {
  tier: "T1_PRESS",
  pressUrl: "",
  sxdUrl: "",
  groupSlug: "",
  channelSlug: "",
  provinceHint: "",
  roleHint: "",
  resolveStatus: "",
  opsNotes: "",
  readerTitle: "",
  readerBody: "",
  readerDisclaimer: DEFAULT_T1_READER_DISCLAIMER,
  ctaLabel: "Đăng ký nhận cập nhật",
};

function itemToForm(item: EarlySignalItem): FormState {
  return {
    tier: item.tier,
    pressUrl: item.pressUrl ?? "",
    sxdUrl: item.sxdUrl ?? "",
    groupSlug: item.groupSlug ?? "",
    channelSlug: item.channelSlug ?? "",
    provinceHint: item.provinceHint ?? "",
    roleHint: item.roleHint ?? "",
    resolveStatus: item.resolveStatus ?? "",
    opsNotes: item.opsNotes ?? "",
    readerTitle: item.readerTitle ?? "",
    readerBody: item.readerBody ?? "",
    readerDisclaimer: item.readerDisclaimer ?? DEFAULT_T1_READER_DISCLAIMER,
    ctaLabel: item.ctaLabel ?? "Đăng ký nhận cập nhật",
  };
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    PENDING_L3: "bg-amber-100 text-amber-800",
    PACKAGED: "bg-sky-100 text-sky-800",
    CAPTURED: "bg-slate-100 text-slate-700",
    APPROVED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-rose-100 text-rose-800",
    PUBLISHED: "bg-violet-100 text-violet-800",
  };
  const labels: Record<string, string> = {
    PENDING_L3: "Chờ L3",
    PACKAGED: "Đã đóng gói",
    CAPTURED: "Intake",
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

export function EarlySignalReviewBoard() {
  const [filter, setFilter] = useState<StatusFilter>("PENDING_L3");
  const [items, setItems] = useState<EarlySignalItem[]>([]);
  const [counts, setCounts] = useState<Counts>({
    pendingL3: 0,
    packaged: 0,
    captured: 0,
    approved: 0,
    rejected: 0,
    published: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** null = hàng đợi; create | edit = wizard trong AdminShell */
  const [wizardKind, setWizardKind] = useState<"create" | "edit" | null>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/early-signals?status=${encodeURIComponent(filter)}`,
        { credentials: "include" },
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không tải được hàng đợi.");
        setItems([]);
        return;
      }
      setItems(json.data.items ?? []);
      setCounts(
        json.data.counts ?? {
          pendingL3: 0,
          packaged: 0,
          captured: 0,
          approved: 0,
          rejected: 0,
          published: 0,
          total: 0,
        },
      );
    } catch {
      setError("Lỗi mạng khi tải tin sớm.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    setWizardKind("create");
    setWizardStep(0);
    setEditingId(null);
    setEditingStatus(null);
    setForm(emptyForm);
    setMessage(null);
    setError(null);
  }

  function openEdit(item: EarlySignalItem) {
    setWizardKind("edit");
    setWizardStep(0);
    setEditingId(item.id);
    setEditingStatus(item.status);
    setForm(itemToForm(item));
    setMessage(null);
    setError(null);
  }

  function closeWizard() {
    setWizardKind(null);
    setWizardStep(0);
    setEditingId(null);
    setEditingStatus(null);
    setForm(emptyForm);
    setRejectReason("");
  }

  function patchForm(partial: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  async function runAction(
    id: string,
    action: "package" | "submit_l3" | "approve" | "reject" | "mark_published",
  ) {
    setActionLoading(true);
    setMessage(null);
    setError(null);
    try {
      const payload =
        action === "reject" ? { action, rejectReason } : { action };
      const res = await fetch(`/api/admin/early-signals/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        const detail =
          Array.isArray(json?.error?.details) && json.error.details.length
            ? `: ${json.error.details.join("; ")}`
            : "";
        setError((json?.error?.message ?? "Thao tác thất bại") + detail);
        return;
      }
      const next: EarlySignalItem = json.data;
      setEditingStatus(next.status);
      setMessage(
        action === "approve"
          ? "Đã duyệt L3 — chưa auto-nurture."
          : action === "reject"
            ? "Đã từ chối."
            : "Đã cập nhật trạng thái.",
      );
      setRejectReason("");
      await load();
      if (action === "approve" || action === "reject" || action === "mark_published") {
        closeWizard();
      }
    } catch {
      setError("Lỗi mạng khi cập nhật trạng thái.");
    } finally {
      setActionLoading(false);
    }
  }

  async function saveEdit(id: string) {
    setActionLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/early-signals/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: form.tier,
          pressUrl: form.pressUrl || null,
          sxdUrl: form.sxdUrl || null,
          groupSlug: form.groupSlug || null,
          channelSlug: form.channelSlug || null,
          provinceHint: form.provinceHint || null,
          roleHint: form.roleHint || null,
          resolveStatus: form.resolveStatus || null,
          opsNotes: form.opsNotes || null,
          readerTitle: form.readerTitle || null,
          readerBody: form.readerBody || null,
          readerDisclaimer: form.readerDisclaimer || null,
          ctaLabel: form.ctaLabel || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không lưu được.");
        return false;
      }
      setMessage("Đã lưu.");
      await load();
      return true;
    } catch {
      setError("Lỗi mạng khi lưu.");
      return false;
    } finally {
      setActionLoading(false);
    }
  }

  async function createItem() {
    setActionLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/early-signals", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: form.tier,
          pressUrl: form.pressUrl || null,
          sxdUrl: form.sxdUrl || null,
          groupSlug: form.groupSlug || null,
          channelSlug: form.channelSlug || null,
          provinceHint: form.provinceHint || null,
          roleHint: form.roleHint || null,
          resolveStatus: form.resolveStatus || null,
          opsNotes: form.opsNotes || null,
          readerTitle: form.readerTitle || null,
          readerBody: form.readerBody || null,
          readerDisclaimer: form.readerDisclaimer || null,
          ctaLabel: form.ctaLabel || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không tạo được.");
        return;
      }
      const created: EarlySignalItem = json.data;
      setMessage("Đã tạo intake — tiếp tục đóng gói / gửi L3 nếu sẵn sàng.");
      setWizardKind("edit");
      setEditingId(created.id);
      setEditingStatus(created.status);
      setForm(itemToForm(created));
      setWizardStep(2);
      setFilter("CAPTURED");
    } catch {
      setError("Lỗi mạng khi tạo.");
    } finally {
      setActionLoading(false);
    }
  }

  function canGoNextFromStep(step: number): boolean {
    if (step === 0) {
      return Boolean(form.pressUrl.trim() || form.sxdUrl.trim());
    }
    if (step === 1) {
      return Boolean(form.readerTitle.trim() && form.readerBody.trim());
    }
    return true;
  }

  function tabCount(key: StatusFilter) {
    if (key === "PENDING_L3") return counts.pendingL3;
    if (key === "PACKAGED") return counts.packaged;
    if (key === "CAPTURED") return counts.captured;
    if (key === "APPROVED") return counts.approved;
    if (key === "REJECTED") return counts.rejected;
    if (key === "PUBLISHED") return counts.published;
    return counts.total;
  }

  /* —— Wizard (giữ trong AdminShell — không full-page ngoài chrome) —— */
  if (wizardKind) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={closeWizard}>
            ← Về hàng đợi
          </Button>
          {editingStatus ? statusBadge(editingStatus) : null}
        </div>

        <ol className="flex flex-wrap gap-2">
          {WIZARD_STEPS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setWizardStep(s.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium",
                  wizardStep === s.id
                    ? "bg-brand-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                )}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ol>

        {message ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {error}
          </p>
        ) : null}

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
          {wizardStep === 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              <p className="md:col-span-2 text-sm text-slate-600">
                Bước ops — nguồn tin (không hiện khách).
              </p>
              <Field label="Tier">
                <select
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={form.tier}
                  onChange={(e) => patchForm({ tier: e.target.value })}
                >
                  {TIER_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tỉnh / khu vực (gợi ý)">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={form.provinceHint}
                  onChange={(e) => patchForm({ provinceHint: e.target.value })}
                />
              </Field>
              <Field label="Press URL *">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={form.pressUrl}
                  onChange={(e) => patchForm({ pressUrl: e.target.value })}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Sở URL">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={form.sxdUrl}
                  onChange={(e) => patchForm({ sxdUrl: e.target.value })}
                />
              </Field>
              <Field label="groupSlug (CĐT / brand)">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={form.groupSlug}
                  onChange={(e) => patchForm({ groupSlug: e.target.value })}
                  placeholder="vd. vingroup, nam-long"
                />
              </Field>
              <Field label="channelSlug (phân phối)">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={form.channelSlug}
                  onChange={(e) => patchForm({ channelSlug: e.target.value })}
                  placeholder="vd. kim-oanh — không = CĐT"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Ghi chú ops">
                  <textarea
                    className="min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    value={form.opsNotes}
                    onChange={(e) => patchForm({ opsNotes: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          ) : null}

          {wizardStep === 1 ? (
            <div className="grid gap-3">
              <p className="text-sm text-slate-600">
                Bước người đọc — đúng copy khách sẽ thấy.
              </p>
              <Field label="Tiêu đề *">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={form.readerTitle}
                  onChange={(e) => patchForm({ readerTitle: e.target.value })}
                />
              </Field>
              <Field label="Nội dung *">
                <textarea
                  className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={form.readerBody}
                  onChange={(e) => patchForm({ readerBody: e.target.value })}
                />
              </Field>
              <Field label="Disclaimer * (T1 bắt buộc)">
                <textarea
                  className="min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={form.readerDisclaimer}
                  onChange={(e) =>
                    patchForm({ readerDisclaimer: e.target.value })
                  }
                />
              </Field>
              <Field label="Nhãn CTA">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={form.ctaLabel}
                  onChange={(e) => patchForm({ ctaLabel: e.target.value })}
                />
              </Field>
            </div>
          ) : null}

          {wizardStep === 2 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Xem lại như khách — rồi lưu / đóng gói / gửi L3 / duyệt.
              </p>
              <section className="rounded-xl border border-brand-100 bg-brand-50/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-brand-800">
                  Preview người đọc
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {form.readerTitle || "(Chưa có tiêu đề)"}
                </h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {form.readerBody || "—"}
                </p>
                <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  {form.readerDisclaimer || DEFAULT_T1_READER_DISCLAIMER}
                </p>
                <Button type="button" className="mt-4" disabled>
                  {form.ctaLabel || "Đăng ký nhận cập nhật"}
                </Button>
                {form.channelSlug ? (
                  <p className="mt-3 text-xs text-slate-500">
                    Đơn vị tư vấn/phân phối (phụ): {form.channelSlug}
                  </p>
                ) : null}
              </section>

              <div className="flex flex-wrap gap-2">
                {wizardKind === "create" ? (
                  <Button
                    type="button"
                    disabled={actionLoading || !canGoNextFromStep(1)}
                    onClick={() => void createItem()}
                  >
                    Tạo intake (CAPTURED)
                  </Button>
                ) : null}
                {wizardKind === "edit" && editingId && editingStatus !== "PUBLISHED" ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={actionLoading}
                    onClick={() => void saveEdit(editingId)}
                  >
                    Lưu thay đổi
                  </Button>
                ) : null}
                {wizardKind === "edit" &&
                  editingId &&
                  (editingStatus === "CAPTURED" ||
                    editingStatus === "REJECTED" ||
                    editingStatus === "PACKAGED") && (
                    <Button
                      type="button"
                      disabled={actionLoading}
                      onClick={async () => {
                        const ok = await saveEdit(editingId);
                        if (ok) await runAction(editingId, "package");
                      }}
                    >
                      Lưu & đóng gói
                    </Button>
                  )}
                {wizardKind === "edit" &&
                  editingId &&
                  (editingStatus === "PACKAGED" || editingStatus === "REJECTED") && (
                    <Button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => void runAction(editingId, "submit_l3")}
                    >
                      Gửi duyệt L3
                    </Button>
                  )}
                {wizardKind === "edit" &&
                  editingId &&
                  editingStatus === "PENDING_L3" && (
                    <>
                      <Button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => void runAction(editingId, "approve")}
                      >
                        Duyệt L3
                      </Button>
                      <input
                        className="min-w-[200px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        placeholder="Lý do từ chối (≥5 ký tự)"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={
                          actionLoading || rejectReason.trim().length < 5
                        }
                        onClick={() => void runAction(editingId, "reject")}
                      >
                        Từ chối
                      </Button>
                    </>
                  )}
                {wizardKind === "edit" &&
                  editingId &&
                  editingStatus === "APPROVED" && (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={actionLoading}
                      onClick={() => void runAction(editingId, "mark_published")}
                    >
                      Đánh dấu đã đăng
                    </Button>
                  )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
          <Button
            type="button"
            variant="outline"
            disabled={wizardStep === 0}
            onClick={() => setWizardStep((s) => Math.max(0, s - 1))}
          >
            ← Lùi
          </Button>
          <span className="text-xs text-slate-500">
            Bước {wizardStep + 1}/{WIZARD_STEPS.length}
          </span>
          {wizardStep < 2 ? (
            <Button
              type="button"
              disabled={!canGoNextFromStep(wizardStep)}
              onClick={() => setWizardStep((s) => Math.min(2, s + 1))}
            >
              Tiếp →
            </Button>
          ) : (
            <Button type="button" variant="ghost" onClick={closeWizard}>
              Xong / về hàng đợi
            </Button>
          )}
        </div>
      </div>
    );
  }

  /* —— Hàng đợi —— */
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
                "rounded-full px-3 py-1.5 text-sm font-medium",
                filter === tab.key
                  ? "bg-brand-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200",
              )}
            >
              {tab.label} ({tabCount(tab.key)})
            </button>
          ))}
        </div>
        <Button type="button" onClick={openCreate}>
          Thêm tin sớm
        </Button>
      </div>

      {message ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5">
        {loading ? (
          <p className="p-4 text-sm text-slate-500">Đang tải…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            Không có bản ghi. Bấm «Thêm tin sớm» — wizard 3 bước trong House X
            Admin (không rời đầu trang).
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-brand-50/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-900">
                      {item.readerTitle || "(Chưa có tiêu đề)"}
                    </span>
                    {statusBadge(item.status)}
                  </div>
                  <span className="text-xs text-slate-500">
                    {item.tier}
                    {item.groupSlug ? ` · ${item.groupSlug}` : ""}
                    {" · "}
                    {formatDate(item.createdAt)}
                    {" · mở wizard →"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
