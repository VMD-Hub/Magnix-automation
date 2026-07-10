"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notifyAdminQueueRefresh } from "@/components/admin/use-admin-queue-counts";
import { cn } from "@/lib/ui/cn";

type ConflictRow = {
  id: string;
  normalizedPhone: string;
  kind: string;
  kindLabel: string;
  status: string;
  rejectReason: string | null;
  rejectLabel: string | null;
  customerName: string | null;
  platformLeadStatus: string | null;
  platformLeadSource: string | null;
  noxhCaseCode: string | null;
  brokerName: string | null;
  ctvCode: string | null;
  resolution: string | null;
  resolutionLabel: string | null;
  createdAt: string;
};

type ConflictDetail = ConflictRow & {
  resolutionNote: string | null;
  resolvedAt: string | null;
  platformLead: {
    id: string;
    status: string;
    source: string;
    segment: string | null;
    message: string | null;
  } | null;
  noxhCase: {
    id: string;
    code: string;
    customerName: string;
    phone: string;
    caseStatus: string;
    lockExpiresAt: string | null;
  } | null;
  broker: { id: string; fullName: string; ctvCode: string | null } | null;
};

const RESOLUTIONS = [
  { id: "KEEP_PLATFORM", label: "Giữ Ops", hint: "Ops tiếp tục pipeline chính." },
  {
    id: "RELEASE_TO_CTV",
    label: "Chuyển CTV",
    hint: "Đóng lead Ops (LOST); CTV có thể claim lại.",
  },
  {
    id: "SPLIT_LANE",
    label: "Chia lane",
    hint: "Ghi nhận 2 intent khác nhau — chỉ audit.",
  },
  {
    id: "DISMISS_BOTH",
    label: "Đóng cả hai",
    hint: "Spam / sai SĐT — lead LOST, hồ sơ RELEASED.",
  },
] as const;

export function AttributionConflictBoard() {
  const [items, setItems] = useState<ConflictRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ConflictDetail | null>(null);
  const [note, setNote] = useState("");
  const [resolution, setResolution] = useState<string>("KEEP_PLATFORM");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [queue, setQueue] = useState<"OPEN" | "ALL">("OPEN");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/conflicts?status=${queue}`);
    if (res.status === 403) {
      window.location.href = "/admin/login";
      return;
    }
    const json = await res.json();
    setItems(json.data?.items ?? []);
    setLoading(false);
  }, [queue]);

  const loadDetail = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/conflicts/${id}`);
    const json = await res.json();
    if (res.ok) {
      setDetail(json.data);
      setNote(json.data?.resolutionNote ?? "");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  async function resolve() {
    if (!selectedId) return;
    setMsg(null);
    const res = await fetch(`/api/admin/conflicts/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolution, note }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error?.message ?? "Lỗi xử lý");
      return;
    }
    setMsg("Đã xử lý xung đột");
    notifyAdminQueueRefresh();
    setSelectedId(null);
    setDetail(null);
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-semibold text-slate-800">Hàng đợi xung đột</p>
          <div className="flex gap-2">
            <button
              type="button"
              className={cn(
                "rounded-lg px-2 py-1 text-xs font-medium",
                queue === "OPEN"
                  ? "bg-brand-100 text-brand-800"
                  : "text-slate-600 hover:bg-slate-100",
              )}
              onClick={() => setQueue("OPEN")}
            >
              Đang mở
            </button>
            <button
              type="button"
              className={cn(
                "rounded-lg px-2 py-1 text-xs font-medium",
                queue === "ALL"
                  ? "bg-brand-100 text-brand-800"
                  : "text-slate-600 hover:bg-slate-100",
              )}
              onClick={() => setQueue("ALL")}
            >
              Tất cả
            </button>
          </div>
        </div>

        {loading ? (
          <p className="p-4 text-sm text-slate-500">Đang tải…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">
            Không có xung đột {queue === "OPEN" ? "đang mở" : ""}.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(row.id)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-slate-50",
                    selectedId === row.id && "bg-brand-50",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">
                        {row.customerName ?? "Khách"} · {row.normalizedPhone}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {row.kindLabel}
                        {row.rejectLabel ? ` — ${row.rejectLabel}` : ""}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                        row.status === "OPEN"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-600",
                      )}
                    >
                      {row.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {row.platformLeadSource && `Lead: ${row.platformLeadSource}`}
                    {row.noxhCaseCode && ` · Hồ sơ: ${row.noxhCaseCode}`}
                    {row.ctvCode && ` · CTV: ${row.ctvCode}`}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {!selectedId || !detail ? (
          <p className="text-sm text-slate-500">
            Chọn một xung đột để xem chi tiết và quyết định.
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Chi tiết</h2>
              <p className="text-sm text-slate-600">{detail.kindLabel}</p>
              {detail.rejectLabel && (
                <p className="mt-1 text-xs text-amber-800">{detail.rejectLabel}</p>
              )}
            </div>

            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs text-slate-500">SĐT</dt>
                <dd className="font-medium">{detail.normalizedPhone}</dd>
              </div>
              {detail.platformLead && (
                <div>
                  <dt className="text-xs text-slate-500">Lead Ops</dt>
                  <dd>
                    {detail.platformLead.source} · {detail.platformLead.status}
                    {detail.platformLead.segment
                      ? ` · ${detail.platformLead.segment}`
                      : ""}
                  </dd>
                </div>
              )}
              {detail.noxhCase && (
                <div>
                  <dt className="text-xs text-slate-500">Hồ sơ CTV</dt>
                  <dd>
                    <Link
                      href={`/admin/noxh-cases?case=${detail.noxhCase.id}`}
                      className="text-brand-700 underline"
                    >
                      {detail.noxhCase.code}
                    </Link>{" "}
                    · {detail.noxhCase.caseStatus}
                  </dd>
                </div>
              )}
              {detail.broker && (
                <div>
                  <dt className="text-xs text-slate-500">CTV liên quan</dt>
                  <dd>
                    {detail.broker.fullName}
                    {detail.broker.ctvCode ? ` (${detail.broker.ctvCode})` : ""}
                  </dd>
                </div>
              )}
            </dl>

            {detail.status === "OPEN" ? (
              <>
                <label className="block text-sm">
                  <span className="text-xs font-medium text-slate-700">Quyết định</span>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                  >
                    {RESOLUTIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <span className="mt-1 block text-xs text-slate-500">
                    {RESOLUTIONS.find((r) => r.id === resolution)?.hint}
                  </span>
                </label>

                <label className="block text-sm">
                  <span className="text-xs font-medium text-slate-700">Ghi chú Ops</span>
                  <textarea
                    className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Lý do quyết định (bắt buộc khi chuyển CTV)…"
                  />
                </label>

                <Button type="button" className="w-full" onClick={() => void resolve()}>
                  Xác nhận quyết định
                </Button>
              </>
            ) : (
              <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                Đã {detail.resolutionLabel ?? detail.status}
                {detail.resolutionNote ? `: ${detail.resolutionNote}` : ""}
              </p>
            )}

            {msg && (
              <p
                className={cn(
                  "text-sm",
                  msg.startsWith("Đã") ? "text-emerald-700" : "text-red-600",
                )}
              >
                {msg}
              </p>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
