"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import {
  PARTNER_TARGET_KIND_LABEL,
  PARTNER_TARGET_STATUS_LABEL,
} from "@/lib/admin/partner-target-labels";

type StatusFilter =
  | "TARGET"
  | "CONTACTED"
  | "MEETING"
  | "PARTNER"
  | "PAUSED"
  | "DROP"
  | "ALL";

type PartnerItem = {
  id: string;
  orgName: string;
  kind: keyof typeof PARTNER_TARGET_KIND_LABEL;
  areaHint: string | null;
  contactName: string | null;
  contactChannel: string | null;
  status: keyof typeof PARTNER_TARGET_STATUS_LABEL;
  nextAction: string | null;
  nextActionAt: string | null;
  notes: string | null;
  updatedAt: string;
};

type Counts = {
  target: number;
  contacted: number;
  meeting: number;
  partner: number;
  paused: number;
  drop: number;
  total: number;
  active: number;
  softCap: number;
  overCap: boolean;
};

type FormState = {
  orgName: string;
  kind: string;
  areaHint: string;
  contactName: string;
  contactChannel: string;
  status: string;
  nextAction: string;
  nextActionAt: string;
  notes: string;
};

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "TARGET", label: "Target" },
  { key: "CONTACTED", label: "Đã LH" },
  { key: "MEETING", label: "Hẹn" },
  { key: "PARTNER", label: "Hợp tác" },
  { key: "PAUSED", label: "Pause" },
  { key: "DROP", label: "Bỏ" },
  { key: "ALL", label: "Tất cả" },
];

const KIND_OPTIONS = Object.entries(PARTNER_TARGET_KIND_LABEL) as [
  string,
  string,
][];
const STATUS_OPTIONS = Object.entries(PARTNER_TARGET_STATUS_LABEL) as [
  string,
  string,
][];

const emptyForm: FormState = {
  orgName: "",
  kind: "UNION",
  areaHint: "",
  contactName: "",
  contactChannel: "",
  status: "TARGET",
  nextAction: "",
  nextActionAt: "",
  notes: "",
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

function itemToForm(item: PartnerItem): FormState {
  return {
    orgName: item.orgName,
    kind: item.kind,
    areaHint: item.areaHint ?? "",
    contactName: item.contactName ?? "",
    contactChannel: item.contactChannel ?? "",
    status: item.status,
    nextAction: item.nextAction ?? "",
    nextActionAt: toLocalInput(item.nextActionAt),
    notes: item.notes ?? "",
  };
}

export function PartnerTargetBoard() {
  const [filter, setFilter] = useState<StatusFilter>("TARGET");
  const [items, setItems] = useState<PartnerItem[]>([]);
  const [counts, setCounts] = useState<Counts>({
    target: 0,
    contacted: 0,
    meeting: 0,
    partner: 0,
    paused: 0,
    drop: 0,
    total: 0,
    active: 0,
    softCap: 40,
    overCap: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/partner-targets?status=${encodeURIComponent(filter)}`,
        { credentials: "include" },
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không tải được danh sách.");
        setItems([]);
        return;
      }
      setItems(json.data.items ?? []);
      setCounts(json.data.counts ?? counts);
    } catch {
      setError("Lỗi mạng khi tải partner targets.");
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
    setForm(emptyForm);
    setMessage(null);
    setError(null);
  }

  function openEdit(item: PartnerItem) {
    setMode("edit");
    setEditingId(item.id);
    setForm(itemToForm(item));
    setMessage(null);
    setError(null);
  }

  function closeEditor() {
    setMode("list");
    setEditingId(null);
    setForm(emptyForm);
  }

  async function save() {
    setSaving(true);
    setError(null);
    setMessage(null);
    const payload = {
      orgName: form.orgName.trim(),
      kind: form.kind,
      areaHint: form.areaHint.trim() || null,
      contactName: form.contactName.trim() || null,
      contactChannel: form.contactChannel.trim() || null,
      status: form.status,
      nextAction: form.nextAction.trim() || null,
      nextActionAt: fromLocalInput(form.nextActionAt),
      notes: form.notes.trim() || null,
    };
    try {
      const res =
        mode === "create"
          ? await fetch("/api/admin/partner-targets", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/partner-targets/${editingId}`, {
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
      setMessage(mode === "create" ? "Đã thêm target." : "Đã cập nhật.");
      if (mode === "create") {
        setMode("edit");
        setEditingId(json.data.id);
      }
      await load();
    } catch {
      setError("Lỗi mạng khi lưu.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!editingId) return;
    if (!window.confirm("Xóa target này?")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/partner-targets/${editingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không xóa được.");
        return;
      }
      closeEditor();
      await load();
    } catch {
      setError("Lỗi mạng khi xóa.");
    } finally {
      setSaving(false);
    }
  }

  if (mode !== "list") {
    return (
      <div className="space-y-4">
        <Button type="button" variant="outline" onClick={closeEditor}>
          ← Quay lại
        </Button>
        {message ? (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {error}
          </p>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <label className="block space-y-1 text-sm md:col-span-2">
            <span className="font-medium">Tên tổ chức *</span>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.orgName}
              onChange={(e) =>
                setForm((f) => ({ ...f, orgName: e.target.value }))
              }
              placeholder="VD: Công đoàn KCN Tân Thuận"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Loại</span>
            <select
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.kind}
              onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))}
            >
              {KIND_OPTIONS.map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Trạng thái</span>
            <select
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value }))
              }
            >
              {STATUS_OPTIONS.map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Khu vực</span>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.areaHint}
              onChange={(e) =>
                setForm((f) => ({ ...f, areaHint: e.target.value }))
              }
              placeholder="TP.HCM / Đồng Nai / …"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Người liên hệ</span>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.contactName}
              onChange={(e) =>
                setForm((f) => ({ ...f, contactName: e.target.value }))
              }
            />
          </label>
          <label className="block space-y-1 text-sm md:col-span-2">
            <span className="font-medium">Kênh liên hệ</span>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.contactChannel}
              onChange={(e) =>
                setForm((f) => ({ ...f, contactChannel: e.target.value }))
              }
              placeholder="SĐT / email / Zalo — không gửi marketing tự động"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Việc tiếp theo</span>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.nextAction}
              onChange={(e) =>
                setForm((f) => ({ ...f, nextAction: e.target.value }))
              }
              placeholder="Gọi giới thiệu hội thảo hồ sơ NƠXH"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Hẹn ngày</span>
            <input
              type="datetime-local"
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.nextActionAt}
              onChange={(e) =>
                setForm((f) => ({ ...f, nextActionAt: e.target.value }))
              }
            />
          </label>
          <label className="block space-y-1 text-sm md:col-span-2">
            <span className="font-medium">Ghi chú</span>
            <textarea
              className="min-h-24 w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={saving} onClick={() => void save()}>
            Lưu
          </Button>
          {mode === "edit" ? (
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => void remove()}
            >
              Xóa
            </Button>
          ) : null}
        </div>
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
              {tab.key === "TARGET" ? ` (${counts.target})` : ""}
            </button>
          ))}
        </div>
        <Button type="button" onClick={openCreate}>
          + Thêm target
        </Button>
      </div>

      <p className="text-sm text-slate-600">
        Active (target/LH/hẹn):{" "}
        <span
          className={cn(
            "font-semibold",
            counts.overCap ? "text-rose-700" : "text-slate-900",
          )}
        >
          {counts.active}/{counts.softCap}
        </span>
        {counts.overCap
          ? " — quá soft cap, hãy pause/drop trước khi thêm."
          : " · giữ list ngắn, ≤1h outreach/tuần."}
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
          Chưa có target. Thêm Công đoàn / HR / KCN đang nhắm — chưa cần partner
          thật.
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
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                      {PARTNER_TARGET_STATUS_LABEL[item.status]}
                    </span>
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 text-sky-800">
                      {PARTNER_TARGET_KIND_LABEL[item.kind]}
                    </span>
                    {item.areaHint ? (
                      <span className="text-slate-400">{item.areaHint}</span>
                    ) : null}
                  </div>
                  <p className="truncate font-medium text-slate-900">
                    {item.orgName}
                  </p>
                  {item.nextAction ? (
                    <p className="truncate text-sm text-slate-500">
                      → {item.nextAction}
                      {item.nextActionAt
                        ? ` · ${new Date(item.nextActionAt).toLocaleString("vi-VN")}`
                        : ""}
                    </p>
                  ) : null}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
