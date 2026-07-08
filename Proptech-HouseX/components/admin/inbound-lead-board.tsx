"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";

type InboundRow = {
  id: string;
  uidMasked: string;
  uidSource: string;
  normalizedKey: string;
  segment: string;
  segmentLabel: string;
  score: number;
  interestKey: string | null;
  textPreview: string | null;
  magnixStatus: string;
  opsStatus: string;
  opsStatusLabel: string;
  opsNote: string | null;
  platformLeadId: string | null;
  capturedAt: string;
};

import { OPS_STATUS_LABEL } from "@/lib/inbound/segment-labels";

export function InboundLeadBoard() {
  const [items, setItems] = useState<InboundRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<InboundRow & { text: string | null } | null>(
    null,
  );
  const [opsNote, setOpsNote] = useState("");
  const [opsStatus, setOpsStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/inbound-leads?queue=open");
    if (res.status === 403) {
      window.location.href = "/admin/login";
      return;
    }
    const json = await res.json();
    setItems(json.data?.items ?? []);
    setLoading(false);
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/inbound-leads/${id}`);
    const json = await res.json();
    const row = json.data;
    setDetail(row);
    setOpsNote(row?.opsNote ?? "");
    setOpsStatus(row?.opsStatus ?? "pending");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  async function saveOps() {
    if (!selectedId) return;
    setMsg(null);
    const res = await fetch(`/api/admin/inbound-leads/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opsStatus, opsNote }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error?.message ?? "Lỗi lưu");
      return;
    }
    setMsg("Đã lưu");
    await load();
    await loadDetail(selectedId);
  }

  async function convertToPlatformLead() {
    if (!selectedId) return;
    setMsg(null);
    const res = await fetch(`/api/admin/inbound-leads/${selectedId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error?.message ?? "Lỗi tạo lead");
      return;
    }
    setMsg(
      json.data?.created
        ? `Đã tạo lead sàn #${json.data.platformLeadId.slice(0, 8)}…`
        : "Lead sàn đã tồn tại",
    );
    await load();
    await loadDetail(selectedId);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Magnix inbound — lead sàn, không auto-gán CTV. UID được mask; dùng kênh
        ngoài để liên hệ khách.
      </p>

      {msg && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {msg}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-2">
          {loading && <p className="text-sm text-slate-500">Đang tải…</p>}
          {!loading && items.length === 0 && (
            <p className="text-sm text-slate-500">Không có inbound mở.</p>
          )}
          {items.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => setSelectedId(row.id)}
              className={cn(
                "w-full rounded-xl border p-3 text-left transition",
                selectedId === row.id
                  ? "border-brand-500 bg-white shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-slate-900">
                  {row.segmentLabel}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    row.score >= 70
                      ? "bg-rose-100 text-rose-800"
                      : "bg-slate-100 text-slate-700",
                  )}
                >
                  {row.score}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {row.uidSource} · {row.uidMasked}
              </p>
              {row.textPreview && (
                <p className="mt-2 line-clamp-2 text-sm text-slate-700">
                  {row.textPreview}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500">{row.opsStatusLabel}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-4">
          {!selectedId && (
            <p className="text-sm text-slate-500">Chọn một inbound để xử lý.</p>
          )}
          {selectedId && detail && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {detail.segmentLabel}
                </h2>
                <p className="text-sm text-slate-600">
                  {detail.uidSource} · {detail.uidMasked} · score {detail.score}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-400">
                  {detail.normalizedKey}
                </p>
              </div>

              {detail.text && (
                <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-800">
                  {detail.text}
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">
                    Trạng thái Ops
                  </span>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={opsStatus}
                    onChange={(e) => setOpsStatus(e.target.value)}
                  >
                    {Object.entries(OPS_STATUS_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">
                  Ghi chú Ops
                </span>
                <textarea
                  className="min-h-[100px] w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={opsNote}
                  onChange={(e) => setOpsNote(e.target.value)}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void saveOps()}>
                  Lưu
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void convertToPlatformLead()}
                  disabled={!!detail.platformLeadId}
                >
                  {detail.platformLeadId
                    ? "Đã có lead sàn"
                    : "Tạo lead sàn (không CTV)"}
                </Button>
              </div>

              {detail.platformLeadId && (
                <p className="text-xs text-slate-500">
                  Lead sàn ID: {detail.platformLeadId}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
