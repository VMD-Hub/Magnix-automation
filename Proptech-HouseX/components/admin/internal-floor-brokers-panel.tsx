"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type BrokerRow = {
  id: string;
  fullName: string;
  phone: string;
  brokerType?: string;
  ctvCode: string | null;
  userAccount?: { email: string } | null;
};

/**
 * Super: đánh dấu môi giới Nội sàn (INTERNAL) bằng SĐT / id.
 * Gắn trên trang Quyền telesales — tách lane Ops grant.
 */
export function InternalFloorBrokersPanel() {
  const [items, setItems] = useState<BrokerRow[]>([]);
  const [brokerId, setBrokerId] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/brokers?brokerType=INTERNAL");
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMsg(json.error?.message ?? "Không tải được danh sách nội sàn.");
      return;
    }
    setItems(json.data?.items ?? []);
    setMsg(null);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function markInternal(e: React.FormEvent) {
    e.preventDefault();
    const id = brokerId.trim();
    if (!id) return;
    setMsg(null);
    const res = await fetch(`/api/admin/brokers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brokerType: "INTERNAL" }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error?.message ?? "Cập nhật thất bại.");
      return;
    }
    setMsg(`Đã đánh dấu nội sàn: ${json.data?.broker?.fullName ?? id}`);
    setBrokerId("");
    void load();
  }

  async function revertToCtv(id: string) {
    const res = await fetch(`/api/admin/brokers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brokerType: "CTV" }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error?.message ?? "Đổi type thất bại.");
      return;
    }
    setMsg("Đã chuyển về CTV.");
    void load();
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <h3 className="font-semibold text-slate-900">Môi giới nội sàn</h3>
        <p className="text-xs text-slate-500">
          Đánh dấu <code className="text-[11px]">BrokerType.INTERNAL</code> —
          Super gán lead từ pool Ops; họ gọi trên{" "}
          <code className="text-[11px]">#/agent/telesales</code> /{" "}
          <code className="text-[11px]">/moi-gioi/telesales</code>. Không dùng
          grant TELESALES_CRM.
        </p>
      </div>

      <form
        onSubmit={(e) => void markInternal(e)}
        className="flex flex-wrap gap-2"
      >
        <input
          className="min-w-[240px] flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-sm font-mono"
          placeholder="Broker UUID"
          value={brokerId}
          onChange={(e) => setBrokerId(e.target.value)}
        />
        <Button type="submit" size="sm">
          Đánh dấu Nội sàn
        </Button>
      </form>

      {msg ? <p className="text-xs text-brand-800">{msg}</p> : null}

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">Chưa có môi giới nội sàn.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-100">
          {items.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium text-slate-900">{row.fullName}</p>
                <p className="text-xs text-slate-500">
                  {row.phone}
                  {row.userAccount?.email
                    ? ` · ${row.userAccount.email}`
                    : ""}
                </p>
                <p className="font-mono text-[10px] text-slate-400">{row.id}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => void revertToCtv(row.id)}
              >
                Về CTV
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
