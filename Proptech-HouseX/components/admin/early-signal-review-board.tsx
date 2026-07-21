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

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "PENDING_L3", label: "Chờ L3" },
  { key: "PACKAGED", label: "Đã đóng gói" },
  { key: "CAPTURED", label: "Intake" },
  { key: "APPROVED", label: "Đã duyệt" },
  { key: "REJECTED", label: "Từ chối" },
  { key: "PUBLISHED", label: "Đã đăng" },
  { key: "ALL", label: "Tất cả" },
];

const TIER_OPTIONS = ["T1_PRESS", "T2_SXD", "T3_DOSSIER", "T4_SOR"] as const;

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

const emptyForm = {
  tier: "T1_PRESS" as string,
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  const selected = items.find((i) => i.id === selectedId) ?? null;

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
      const nextItems: EarlySignalItem[] = json.data.items ?? [];
      setItems(nextItems);
      setCounts(json.data.counts ?? {
        pendingL3: 0,
        packaged: 0,
        captured: 0,
        approved: 0,
        rejected: 0,
        published: 0,
        total: 0,
      });
      setSelectedId((prev) =>
        prev && nextItems.some((i) => i.id === prev) ? prev : null,
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

  useEffect(() => {
    if (!selected) return;
    setEditForm({
      tier: selected.tier,
      pressUrl: selected.pressUrl ?? "",
      sxdUrl: selected.sxdUrl ?? "",
      groupSlug: selected.groupSlug ?? "",
      channelSlug: selected.channelSlug ?? "",
      provinceHint: selected.provinceHint ?? "",
      roleHint: selected.roleHint ?? "",
      resolveStatus: selected.resolveStatus ?? "",
      opsNotes: selected.opsNotes ?? "",
      readerTitle: selected.readerTitle ?? "",
      readerBody: selected.readerBody ?? "",
      readerDisclaimer: selected.readerDisclaimer ?? DEFAULT_T1_READER_DISCLAIMER,
      ctaLabel: selected.ctaLabel ?? "Đăng ký nhận cập nhật",
    });
  }, [selected]);

  async function runAction(
    id: string,
    action: "package" | "submit_l3" | "approve" | "reject" | "mark_published",
  ) {
    setActionLoading(true);
    setMessage(null);
    setError(null);
    try {
      const payload =
        action === "reject"
          ? { action, rejectReason }
          : { action };
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
      setMessage(
        action === "approve"
          ? "Đã duyệt L3 — chưa auto-nurture."
          : action === "reject"
            ? "Đã từ chối."
            : "Đã cập nhật trạng thái.",
      );
      setRejectReason("");
      await load();
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
          tier: editForm.tier,
          pressUrl: editForm.pressUrl || null,
          sxdUrl: editForm.sxdUrl || null,
          groupSlug: editForm.groupSlug || null,
          channelSlug: editForm.channelSlug || null,
          provinceHint: editForm.provinceHint || null,
          roleHint: editForm.roleHint || null,
          resolveStatus: editForm.resolveStatus || null,
          opsNotes: editForm.opsNotes || null,
          readerTitle: editForm.readerTitle || null,
          readerBody: editForm.readerBody || null,
          readerDisclaimer: editForm.readerDisclaimer || null,
          ctaLabel: editForm.ctaLabel || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không lưu được.");
        return;
      }
      setMessage("Đã lưu dossier / preview.");
      await load();
    } catch {
      setError("Lỗi mạng khi lưu.");
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
      setShowCreate(false);
      setForm(emptyForm);
      setFilter("CAPTURED");
      setSelectedId(json.data.id);
      setMessage("Đã tạo intake tin sớm — đang ở tab Intake.");
      // load() sẽ chạy khi filter đổi sang CAPTURED
    } catch {
      setError("Lỗi mạng khi tạo.");
    } finally {
      setActionLoading(false);
    }
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
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200",
              )}
            >
              {tab.label} ({tabCount(tab.key)})
            </button>
          ))}
        </div>
        <Button
          type="button"
          onClick={() => {
            setShowCreate((v) => {
              const next = !v;
              if (next) setSelectedId(null);
              return next;
            });
          }}
        >
          {showCreate ? "Đóng form thêm" : "Thêm tin sớm"}
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

      {showCreate ? (
        <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
          <Field label="Tier">
            <select
              className="w-full rounded border px-2 py-1.5 text-sm"
              value={form.tier}
              onChange={(e) => setForm({ ...form, tier: e.target.value })}
            >
              {TIER_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Press URL">
            <input
              className="w-full rounded border px-2 py-1.5 text-sm"
              value={form.pressUrl}
              onChange={(e) => setForm({ ...form, pressUrl: e.target.value })}
            />
          </Field>
          <Field label="Sở URL">
            <input
              className="w-full rounded border px-2 py-1.5 text-sm"
              value={form.sxdUrl}
              onChange={(e) => setForm({ ...form, sxdUrl: e.target.value })}
            />
          </Field>
          <Field label="groupSlug (CĐT)">
            <input
              className="w-full rounded border px-2 py-1.5 text-sm"
              value={form.groupSlug}
              onChange={(e) => setForm({ ...form, groupSlug: e.target.value })}
            />
          </Field>
          <Field label="channelSlug">
            <input
              className="w-full rounded border px-2 py-1.5 text-sm"
              value={form.channelSlug}
              onChange={(e) => setForm({ ...form, channelSlug: e.target.value })}
            />
          </Field>
          <Field label="Tiêu đề người đọc">
            <input
              className="w-full rounded border px-2 py-1.5 text-sm"
              value={form.readerTitle}
              onChange={(e) => setForm({ ...form, readerTitle: e.target.value })}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Nội dung người đọc">
              <textarea
                className="min-h-24 w-full rounded border px-2 py-1.5 text-sm"
                value={form.readerBody}
                onChange={(e) => setForm({ ...form, readerBody: e.target.value })}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Disclaimer người đọc">
              <textarea
                className="min-h-16 w-full rounded border px-2 py-1.5 text-sm"
                value={form.readerDisclaimer}
                onChange={(e) =>
                  setForm({ ...form, readerDisclaimer: e.target.value })
                }
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Button type="button" disabled={actionLoading} onClick={() => void createItem()}>
              Tạo CAPTURED
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {loading ? (
            <p className="p-4 text-sm text-slate-500">Đang tải…</p>
          ) : items.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">Không có bản ghi.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreate(false);
                      setSelectedId(item.id);
                    }}
                    className={cn(
                      "flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-slate-50",
                      selectedId === item.id && "bg-amber-50",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-900">
                        {item.readerTitle || "(Chưa có tiêu đề)"}
                      </span>
                      {statusBadge(item.status)}
                    </div>
                    <span className="text-xs text-slate-500">
                      {item.tier}
                      {item.groupSlug ? ` · brand:${item.groupSlug}` : ""}
                      {item.channelSlug ? ` · channel:${item.channelSlug}` : ""}
                      {" · "}
                      {formatDate(item.createdAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          {!selected ? (
            <p className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
              Chọn một tin để xem ops dossier + preview người đọc.
            </p>
          ) : (
            <>
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-sm font-semibold text-slate-800">
                  Ops dossier (nội bộ)
                </h2>
                <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                  <Row label="Status" value={selected.status} />
                  <Row label="Tier" value={selected.tier} />
                  <Row label="groupSlug" value={selected.groupSlug ?? "—"} />
                  <Row label="channelSlug" value={selected.channelSlug ?? "—"} />
                  <Row label="roleHint" value={selected.roleHint ?? "—"} />
                  <Row label="resolve" value={selected.resolveStatus ?? "—"} />
                  <Row
                    label="Press"
                    value={
                      selected.pressUrl ? (
                        <a
                          className="text-sky-700 underline"
                          href={selected.pressUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Mở nguồn
                        </a>
                      ) : (
                        "—"
                      )
                    }
                  />
                  <Row
                    label="Sở"
                    value={
                      selected.sxdUrl ? (
                        <a
                          className="text-sky-700 underline"
                          href={selected.sxdUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Mở Sở
                        </a>
                      ) : (
                        "—"
                      )
                    }
                  />
                  <Row
                    label="Dự án"
                    value={
                      selected.project
                        ? `${selected.project.name} (${selected.project.status})`
                        : "—"
                    }
                  />
                </dl>
                {selected.rejectReason ? (
                  <p className="mt-2 text-sm text-rose-700">
                    Lý do từ chối: {selected.rejectReason}
                  </p>
                ) : null}

                {selected.status !== "PUBLISHED" ? (
                  <div className="mt-4 grid gap-2 md:grid-cols-2">
                    <Field label="Tier">
                      <select
                        className="w-full rounded border px-2 py-1.5 text-sm"
                        value={editForm.tier}
                        onChange={(e) =>
                          setEditForm({ ...editForm, tier: e.target.value })
                        }
                      >
                        {TIER_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="groupSlug">
                      <input
                        className="w-full rounded border px-2 py-1.5 text-sm"
                        value={editForm.groupSlug}
                        onChange={(e) =>
                          setEditForm({ ...editForm, groupSlug: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Press URL">
                      <input
                        className="w-full rounded border px-2 py-1.5 text-sm"
                        value={editForm.pressUrl}
                        onChange={(e) =>
                          setEditForm({ ...editForm, pressUrl: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Sở URL">
                      <input
                        className="w-full rounded border px-2 py-1.5 text-sm"
                        value={editForm.sxdUrl}
                        onChange={(e) =>
                          setEditForm({ ...editForm, sxdUrl: e.target.value })
                        }
                      />
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="Tiêu đề người đọc">
                        <input
                          className="w-full rounded border px-2 py-1.5 text-sm"
                          value={editForm.readerTitle}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              readerTitle: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>
                    <div className="md:col-span-2">
                      <Field label="Body người đọc">
                        <textarea
                          className="min-h-24 w-full rounded border px-2 py-1.5 text-sm"
                          value={editForm.readerBody}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              readerBody: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>
                    <div className="md:col-span-2">
                      <Field label="Disclaimer">
                        <textarea
                          className="min-h-16 w-full rounded border px-2 py-1.5 text-sm"
                          value={editForm.readerDisclaimer}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              readerDisclaimer: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>
                    <div className="md:col-span-2">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={actionLoading}
                        onClick={() => void saveEdit(selected.id)}
                      >
                        Lưu dossier / preview
                      </Button>
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Preview người đọc
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {editForm.readerTitle || selected.readerTitle || "(Chưa có tiêu đề)"}
                </h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {editForm.readerBody || selected.readerBody || "—"}
                </p>
                <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  {editForm.readerDisclaimer ||
                    selected.readerDisclaimer ||
                    DEFAULT_T1_READER_DISCLAIMER}
                </p>
                <Button type="button" className="mt-4" disabled>
                  {editForm.ctaLabel || selected.ctaLabel || "Đăng ký nhận cập nhật"}
                </Button>
                {selected.channelSlug ? (
                  <p className="mt-3 text-xs text-slate-500">
                    Đơn vị tư vấn/phân phối (phụ): {selected.channelSlug} — không
                    thay CĐT trên filter.
                  </p>
                ) : null}
              </section>

              <div className="flex flex-wrap gap-2">
                {(selected.status === "CAPTURED" ||
                  selected.status === "REJECTED" ||
                  selected.status === "PACKAGED") && (
                  <Button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => void runAction(selected.id, "package")}
                  >
                    Đóng gói (PACKAGED)
                  </Button>
                )}
                {(selected.status === "PACKAGED" ||
                  selected.status === "REJECTED") && (
                  <Button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => void runAction(selected.id, "submit_l3")}
                  >
                    Gửi duyệt L3
                  </Button>
                )}
                {selected.status === "PENDING_L3" && (
                  <>
                    <Button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => void runAction(selected.id, "approve")}
                    >
                      Duyệt L3
                    </Button>
                    <div className="flex min-w-[240px] flex-1 gap-2">
                      <input
                        className="flex-1 rounded border px-2 py-1.5 text-sm"
                        placeholder="Lý do từ chối (≥5 ký tự)"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={actionLoading || rejectReason.trim().length < 5}
                        onClick={() => void runAction(selected.id, "reject")}
                      >
                        Từ chối
                      </Button>
                    </div>
                  </>
                )}
                {selected.status === "APPROVED" && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={actionLoading}
                    onClick={() => void runAction(selected.id, "mark_published")}
                  >
                    Đánh dấu đã đăng
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
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

function Row({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
