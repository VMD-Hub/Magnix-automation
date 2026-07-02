"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";

type StatusFilter = "PENDING" | "APPROVED" | "REJECTED" | "ALL";

type Application = {
  id: string;
  status: StatusFilter;
  idNumber: string | null;
  experience: string | null;
  region: string | null;
  motivation: string | null;
  rejectReason: string | null;
  reviewedAt: string | null;
  createdAt: string;
  broker: {
    id: string;
    fullName: string;
    phone: string;
    licenseNo: string | null;
    licenseVerified: boolean;
    brokerType: string;
    ctvCode: string | null;
    userAccount: { email: string; emailVerified: boolean };
  };
};

type Counts = { pending: number; approved: number; rejected: number; total: number };

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "PENDING", label: "Chờ duyệt" },
  { key: "APPROVED", label: "Đã duyệt" },
  { key: "REJECTED", label: "Từ chối" },
  { key: "ALL", label: "Tất cả" },
];

function statusBadge(status: string) {
  const map: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    APPROVED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-rose-100 text-rose-800",
  };
  const labels: Record<string, string> = {
    PENDING: "Chờ duyệt",
    APPROVED: "Đã duyệt",
    REJECTED: "Từ chối",
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function CtvReviewBoard() {
  const [filter, setFilter] = useState<StatusFilter>("PENDING");
  const [items, setItems] = useState<Application[]>([]);
  const [counts, setCounts] = useState<Counts>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [trainingConfirmed, setTrainingConfirmed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/ctv-applications?status=${filter}`,
        { headers: { accept: "application/json" } },
      );
      if (res.status === 403) {
        window.location.href = "/admin/login";
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không tải được danh sách.");
        return;
      }
      setItems(json.data.items as Application[]);
      setCounts(json.data.counts as Counts);
      setSelectedId((prev) => {
        const ids = (json.data.items as Application[]).map((i) => i.id);
        if (prev && ids.includes(prev)) return prev;
        return ids[0] ?? null;
      });
    } catch {
      setError("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = items.find((i) => i.id === selectedId) ?? null;

  async function review(action: "approve" | "reject") {
    if (!selected) return;
    if (action === "approve" && !trainingConfirmed) {
      setError("Cần xác nhận ứng viên đã hoàn thành khóa đào tạo hội nhập.");
      return;
    }
    if (action === "reject" && rejectReason.trim().length < 5) {
      setError("Lý do từ chối tối thiểu 5 ký tự.");
      return;
    }
    setActionLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/admin/ctv-applications/${selected.id}/review`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action,
            rejectReason: action === "reject" ? rejectReason.trim() : undefined,
          }),
        },
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không xử lý được đơn.");
        return;
      }
      if (action === "approve") {
        setMessage(`Đã duyệt — mã CTV: ${json.data.ctvCode}`);
      } else {
        setMessage("Đã từ chối đơn.");
      }
      setRejectReason("");
      setTrainingConfirmed(false);
      await load();
    } catch {
      setError("Lỗi kết nối.");
    } finally {
      setActionLoading(false);
    }
  }

  function tabCount(key: StatusFilter) {
    if (key === "PENDING") return counts.pending;
    if (key === "APPROVED") return counts.approved;
    if (key === "REJECTED") return counts.rejected;
    return counts.total;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              filter === tab.key
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
            )}
          >
            {tab.label}
            <span className="ml-1.5 opacity-80">({tabCount(tab.key)})</span>
          </button>
        ))}
      </div>

      {message ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}

      {loading ? (
        <p className="text-center text-slate-500">Đang tải danh sách…</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Không có đơn nào trong mục này.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-5">
          <ul className="space-y-2 lg:col-span-2">
            {items.map((app) => (
              <li key={app.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(app.id);
                    setMessage(null);
                    setError(null);
                  }}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition-colors",
                    selectedId === app.id
                      ? "border-brand-400 bg-brand-50"
                      : "border-slate-200 bg-white hover:border-slate-300",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900">
                      {app.broker.fullName}
                    </p>
                    {statusBadge(app.status)}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{app.region ?? "—"}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Nộp {formatDate(app.createdAt)}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {selected ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {selected.broker.fullName}
                </h2>
                {statusBadge(selected.status)}
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Field label="SĐT" value={selected.broker.phone} />
                <Field
                  label="Email"
                  value={
                    selected.broker.userAccount.emailVerified
                      ? selected.broker.userAccount.email
                      : `${selected.broker.userAccount.email} (chưa xác nhận)`
                  }
                />
                <Field label="CMND/CCCD" value={selected.idNumber} />
                <Field label="Khu vực" value={selected.region} />
                <Field label="Số CCHN" value={selected.broker.licenseNo ?? "—"} />
                <Field
                  label="CCHN đã verify"
                  value={selected.broker.licenseVerified ? "Có" : "Chưa"}
                />
                {selected.broker.ctvCode ? (
                  <Field label="Mã CTV" value={selected.broker.ctvCode} mono />
                ) : null}
              </dl>

              <div className="mt-4 space-y-3">
                <Block label="Kinh nghiệm" text={selected.experience} />
                <Block label="Lý do đăng ký" text={selected.motivation} />
                {selected.rejectReason ? (
                  <Block label="Lý do từ chối (trước)" text={selected.rejectReason} />
                ) : null}
              </div>

              {selected.status === "PENDING" ? (
                <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
                  <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                    <strong>Quy tắc vận hành:</strong> Chỉ duyệt CTV khi ứng viên đã hoàn
                    thành khóa đào tạo hội nhập (nguyên tắc, cách đăng tin, vận hành).
                    Module LMS sẽ tích hợp sau — hiện xác nhận thủ công tại đây.
                  </div>
                  <label className="flex items-start gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={trainingConfirmed}
                      onChange={(e) => setTrainingConfirmed(e.target.checked)}
                      className="mt-1"
                    />
                    <span>
                      Tôi xác nhận ứng viên đã hoàn thành khóa đào tạo hội nhập và nắm rõ
                      nguyên tắc vận hành HouseX.
                    </span>
                  </label>
                  <p className="text-sm font-medium text-slate-700">Quyết định duyệt</p>
                  <label className="block">
                    <span className="text-xs text-slate-500">
                      Lý do từ chối (bắt buộc nếu từ chối)
                    </span>
                    <textarea
                      rows={2}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      placeholder="VD: Hồ sơ chưa đủ kinh nghiệm môi giới BĐS…"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      disabled={actionLoading || !trainingConfirmed}
                      onClick={() => review("approve")}
                    >
                      {actionLoading ? "Đang xử lý…" : "Duyệt CTV"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={actionLoading}
                      onClick={() => review("reject")}
                    >
                      Từ chối
                    </Button>
                  </div>
                </div>
              ) : selected.reviewedAt ? (
                <p className="mt-4 text-xs text-slate-400">
                  Xử lý lúc {formatDate(selected.reviewedAt)}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className={cn("font-medium text-slate-900", mono && "font-mono")}>
        {value ?? "—"}
      </dd>
    </div>
  );
}

function Block({ label, text }: { label: string; text: string | null }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
        {text ?? "—"}
      </p>
    </div>
  );
}
