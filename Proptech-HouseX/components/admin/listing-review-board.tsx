"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  formatVnd,
  propertyTypeLabel,
  TRANSACTION_TYPE_LABEL,
} from "@/lib/format";
import { LISTING_REMOVAL_REASONS } from "@/lib/email/listing-removal-reasons";
import type { ListingRemovalReasonCode } from "@/lib/email/listing-removal-reasons";
import { cn } from "@/lib/ui/cn";

type StatusFilter = "PENDING_REVIEW" | "ACTIVE" | "REJECTED" | "ALL";

type ListingMedia = {
  id: string;
  url: string;
  status: string;
  width: number | null;
  height: number | null;
  position: number;
};

type ListingItem = {
  id: string;
  code: string;
  status: StatusFilter | string;
  transactionType: string;
  propertyType: string;
  price: string | number;
  area: number | null;
  address: string | null;
  province: string;
  district: string;
  ward: string | null;
  description: string | null;
  rejectReason: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  photoCount: number;
  qualityScore: number;
  createdAt: string;
  broker: {
    id: string;
    fullName: string;
    phone: string;
    brokerType: string;
    licenseVerified: boolean;
    userAccount: { email: string; emailVerified: boolean };
  };
  media: ListingMedia[];
};

type Counts = { pending: number; active: number; rejected: number; total: number };

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "PENDING_REVIEW", label: "Chờ duyệt" },
  { key: "ACTIVE", label: "Đang hiển thị" },
  { key: "REJECTED", label: "Từ chối" },
  { key: "ALL", label: "Tất cả" },
];

const REASON_OPTIONS = Object.values(LISTING_REMOVAL_REASONS);

function statusBadge(status: string) {
  const map: Record<string, string> = {
    PENDING_REVIEW: "bg-amber-100 text-amber-800",
    ACTIVE: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-rose-100 text-rose-800",
    DRAFT: "bg-slate-100 text-slate-700",
  };
  const labels: Record<string, string> = {
    PENDING_REVIEW: "Chờ duyệt",
    ACTIVE: "Đang hiển thị",
    REJECTED: "Từ chối",
    DRAFT: "Nháp",
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

export function ListingReviewBoard() {
  const [filter, setFilter] = useState<StatusFilter>("PENDING_REVIEW");
  const [items, setItems] = useState<ListingItem[]>([]);
  const [counts, setCounts] = useState<Counts>({
    pending: 0,
    active: 0,
    rejected: 0,
    total: 0,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [reasonCode, setReasonCode] = useState<ListingRemovalReasonCode>("inappropriate_photos");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/listings?status=${filter}`, {
        headers: { accept: "application/json" },
      });
      if (res.status === 403) {
        window.location.href = "/admin/login";
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không tải được danh sách.");
        return;
      }
      setItems(json.data.items as ListingItem[]);
      setCounts(json.data.counts as Counts);
      setSelectedId((prev) => {
        const ids = (json.data.items as ListingItem[]).map((i) => i.id);
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
  const readyImages = selected?.media.filter((m) => m.status === "READY") ?? [];

  async function review(action: "approve" | "reject") {
    if (!selected) return;
    if (action === "reject" && rejectReason.trim().length < 5) {
      setError("Ghi chú từ chối tối thiểu 5 ký tự (mã lý do đã chọn ở trên).");
      return;
    }
    setActionLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/listings/${selected.id}/review`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action,
          reasonCode: action === "reject" ? reasonCode : undefined,
          rejectReason: action === "reject" ? rejectReason.trim() : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không xử lý được tin.");
        return;
      }
      if (action === "approve") {
        setMessage(`Đã duyệt — tin ${json.data.code} đang hiển thị.`);
      } else {
        setMessage("Đã từ chối tin và gửi email thông báo (nếu email đã xác nhận).");
      }
      setRejectReason("");
      await load();
    } catch {
      setError("Lỗi kết nối.");
    } finally {
      setActionLoading(false);
    }
  }

  function tabCount(key: StatusFilter) {
    if (key === "PENDING_REVIEW") return counts.pending;
    if (key === "ACTIVE") return counts.active;
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
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}

      {loading ? (
        <p className="text-center text-slate-500">Đang tải danh sách…</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Không có tin nào trong mục này.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-5">
          <ul className="space-y-2 lg:col-span-2">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(item.id);
                    setMessage(null);
                    setError(null);
                  }}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition-colors",
                    selectedId === item.id
                      ? "border-brand-400 bg-brand-50"
                      : "border-slate-200 bg-white hover:border-slate-300",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900">
                      {item.code}
                    </p>
                    {statusBadge(item.status)}
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    {propertyTypeLabel(item.propertyType)} · {item.district}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{item.broker.fullName}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Gửi {formatDate(item.submittedAt ?? item.createdAt)}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {selected ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-slate-900">{selected.code}</h2>
                {statusBadge(selected.status)}
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Field label="Môi giới" value={selected.broker.fullName} />
                <Field label="SĐT" value={selected.broker.phone} />
                <Field
                  label="Email"
                  value={
                    selected.broker.userAccount.emailVerified
                      ? selected.broker.userAccount.email
                      : `${selected.broker.userAccount.email} (chưa xác nhận)`
                  }
                />
                <Field
                  label="Loại tin"
                  value={`${TRANSACTION_TYPE_LABEL[selected.transactionType] ?? selected.transactionType} · ${propertyTypeLabel(selected.propertyType)}`}
                />
                <Field label="Giá" value={formatVnd(selected.price) ?? "—"} />
                <Field
                  label="Diện tích"
                  value={selected.area != null ? `${selected.area} m²` : "—"}
                />
                <Field label="Khu vực" value={`${selected.district}, ${selected.province}`} />
                <Field label="Địa chỉ" value={selected.address} />
                <Field label="Ảnh READY" value={String(readyImages.length)} />
                <Field label="Quality score" value={String(selected.qualityScore)} />
              </dl>

              {selected.description ? (
                <div className="mt-4">
                  <p className="text-xs font-medium text-slate-500">Mô tả</p>
                  <p className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
                    {selected.description}
                  </p>
                </div>
              ) : null}

              {selected.media.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {selected.media.map((m) => (
                    <li key={m.id} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.url}
                        alt=""
                        className={cn(
                          "h-24 w-24 rounded-lg border object-cover",
                          m.status === "READY" ? "border-slate-200" : "border-rose-300 opacity-60",
                        )}
                      />
                      <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">
                        {m.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {selected.status === "ACTIVE" ? (
                <p className="mt-4">
                  <Link
                    href={`/tin-dang/${selected.code}`}
                    className="text-sm font-semibold text-brand-700 underline"
                    target="_blank"
                  >
                    Xem trên marketplace →
                  </Link>
                </p>
              ) : null}

              {selected.rejectReason ? (
                <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">
                  <strong>Lý do từ chối:</strong> {selected.rejectReason}
                </div>
              ) : null}

              {selected.status === "PENDING_REVIEW" ? (
                <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
                  <p className="text-sm font-medium text-slate-700">Quyết định duyệt</p>
                  <label className="block text-sm">
                    <span className="text-xs text-slate-500">Mã lý do (khi từ chối)</span>
                    <select
                      value={reasonCode}
                      onChange={(e) =>
                        setReasonCode(e.target.value as ListingRemovalReasonCode)
                      }
                      className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400"
                    >
                      {REASON_OPTIONS.map((r) => (
                        <option key={r.code} value={r.code}>
                          {r.labelVi}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs text-slate-500">
                      Ghi chú thêm (bắt buộc nếu từ chối, tối thiểu 5 ký tự)
                    </span>
                    <textarea
                      rows={2}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      placeholder="VD: Ảnh không khớp mô tả căn hộ…"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      disabled={actionLoading || readyImages.length < 5}
                      onClick={() => review("approve")}
                    >
                      {actionLoading ? "Đang xử lý…" : "Duyệt hiển thị"}
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
                  {readyImages.length < 5 ? (
                    <p className="text-xs text-amber-700">
                      Tin chưa đủ 5 ảnh READY — không thể duyệt.
                    </p>
                  ) : null}
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
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-900">{value ?? "—"}</dd>
    </div>
  );
}
