"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";

type StatusFilter = "ACTIVE" | "ALL";

type BookingRow = {
  id: string;
  code: string;
  status: string;
  customerName: string;
  phone: string;
  expiresAt: string | null;
  createdAt: string;
  unit: { code: string; status: string; block: string | null };
  project: { slug: string; name: string };
  broker: { fullName: string; phone: string } | null;
};

type Counts = {
  active: number;
  converted: number;
  cancelled: number;
  expired: number;
  total: number;
};

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "ACTIVE", label: "Đang giữ suất" },
  { key: "ALL", label: "Tất cả" },
];

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đang giữ suất",
  EXPIRED: "Hết hạn",
  CANCELLED: "Đã huỷ",
  CONVERTED_TO_DEPOSIT: "Đã chuyển cọc",
};

function statusBadge(status: string) {
  const map: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-sky-100 text-sky-800",
    EXPIRED: "bg-slate-100 text-slate-600",
    CANCELLED: "bg-rose-100 text-rose-800",
    CONVERTED_TO_DEPOSIT: "bg-violet-100 text-violet-800",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
        map[status] ?? "bg-slate-100 text-slate-700",
      )}
    >
      {STATUS_LABEL[status] ?? status}
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

export function UnitBookingBoard() {
  const [filter, setFilter] = useState<StatusFilter>("ACTIVE");
  const [items, setItems] = useState<BookingRow[]>([]);
  const [counts, setCounts] = useState<Counts>({
    active: 0,
    converted: 0,
    cancelled: 0,
    expired: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/unit-bookings?status=${filter}`, {
        headers: { accept: "application/json" },
      });
      if (res.status === 403) {
        window.location.href = "/admin/login";
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setError(json.message ?? "Không tải được danh sách.");
        return;
      }
      setItems(json.data.items);
      setCounts(json.data.counts);
    } catch {
      setError("Lỗi mạng.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function convertDeposit(id: string, code: string) {
    if (
      !window.confirm(
        `Chuyển cọc thủ công cho suất ${code}?\n\nCăn sẽ khóa (DEPOSITED) và các suất khác trên cùng căn sẽ bị huỷ.`,
      )
    ) {
      return;
    }
    setActionId(id);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/unit-bookings/${id}/convert-deposit`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message ?? "Chuyển cọc thất bại.");
        return;
      }
      setMessage(`Đã chuyển cọc suất ${code} — căn đã khóa.`);
      await load();
    } catch {
      setError("Lỗi mạng.");
    } finally {
      setActionId(null);
    }
  }

  async function cancelBooking(id: string, code: string) {
    const reason = window.prompt(`Lý do huỷ suất ${code}:`, "khach_huy");
    if (!reason?.trim()) return;

    setActionId(id);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/unit-bookings/${id}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED", cancelReason: reason.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message ?? "Huỷ suất thất bại.");
        return;
      }
      setMessage(`Đã huỷ suất ${code}.`);
      await load();
    } catch {
      setError("Lỗi mạng.");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        <strong>Giữ suất</strong> ghi nhận nhu cầu mua — nhiều khách có thể giữ suất
        cùng căn khi căn còn <code className="text-xs">AVAILABLE</code>. Chỉ khi vận
        hành bấm <strong>Chuyển cọc</strong> thì căn mới khóa và các suất còn lại bị
        huỷ.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium",
              filter === tab.key
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
            )}
          >
            {tab.label}
            {tab.key === "ACTIVE" && counts.active > 0 && (
              <span className="ml-1.5 rounded-full bg-white/20 px-1.5 text-xs">
                {counts.active}
              </span>
            )}
          </button>
        ))}
        <span className="text-xs text-slate-500">
          Tổng {counts.total} · đã cọc {counts.converted} · huỷ {counts.cancelled} ·
          hết hạn {counts.expired}
        </span>
      </div>

      {message && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">Không có suất giữ nào.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Mã suất</th>
                <th className="px-3 py-2">Khách</th>
                <th className="px-3 py-2">Căn / dự án</th>
                <th className="px-3 py-2">Trạng thái</th>
                <th className="px-3 py-2">Hết hạn</th>
                <th className="px-3 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((row) => {
                const canConvert =
                  ["PENDING", "CONFIRMED"].includes(row.status) &&
                  row.unit.status === "AVAILABLE";
                const canCancel = ["PENDING", "CONFIRMED"].includes(row.status);
                const busy = actionId === row.id;

                return (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-3 py-2 font-mono text-xs">{row.code}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-900">{row.customerName}</div>
                      <div className="text-xs text-slate-500">{row.phone}</div>
                      {row.broker && (
                        <div className="text-xs text-brand-700">
                          CTV: {row.broker.fullName}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{row.unit.code}</div>
                      <div className="text-xs text-slate-500">
                        {row.project.name} · căn {row.unit.status}
                      </div>
                    </td>
                    <td className="px-3 py-2">{statusBadge(row.status)}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">
                      {formatDate(row.expiresAt)}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1.5">
                        {canConvert && (
                          <Button
                            size="sm"
                            disabled={busy}
                            onClick={() => convertDeposit(row.id, row.code)}
                          >
                            Chuyển cọc
                          </Button>
                        )}
                        {canCancel && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() => cancelBooking(row.id, row.code)}
                          >
                            Huỷ suất
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
