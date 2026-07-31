"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { COMMISSION_STATUS_LABEL } from "@/lib/format";

const vnd = (n: number) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

type CommissionItem = {
  id: string;
  amount: string;
  status: string;
  lead?: {
    project?: { name: string } | null;
    listing?: { code: string } | null;
  } | null;
};

type Summary = {
  totalAmount: number;
  totalsByStatus: Record<string, { count: number; amount: number }>;
  items: CommissionItem[];
};

/** Trang hoa hồng đầy đủ — copy “sau HĐMB” parity Mini. */
export function CtvCommissionsPanel() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/ctv/commissions");
        if (res.status === 401 || res.status === 403) {
          window.location.href = "/dang-ky/moi-gioi";
          return;
        }
        const json = await res.json();
        if (!res.ok) {
          if (alive) setError(json?.error?.message ?? "Không tải được.");
          return;
        }
        if (alive) setSummary(json.data ?? null);
      } catch {
        if (alive) setError("Không tải được hoa hồng.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Hoa hồng nội bộ tính theo % × giá HĐMB (chưa VAT, chưa 2% bảo trì) sau khi
        ký — Ops nhập giá. Trước HĐMB chỉ theo dõi tiến độ deal, chưa có số chi.
        Thưởng thăm dự án +500k khi Admin xác nhận với CĐT.
      </p>

      {loading ? <p className="text-sm text-slate-500">Đang tải…</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {summary ? (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-slate-900">Đã ghi nhận</h2>
            <p className="mt-2 text-2xl font-bold text-emerald-800">
              {vnd(summary.totalAmount)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Tổng theo mọi trạng thái (sau HĐMB / deal cũ)
            </p>
            <ul className="mt-4 space-y-2">
              {Object.entries(summary.totalsByStatus).map(([k, v]) =>
                v.count > 0 ? (
                  <li
                    key={k}
                    className="flex justify-between text-sm text-slate-700"
                  >
                    <span>{COMMISSION_STATUS_LABEL[k] ?? k}</span>
                    <span>
                      {v.count} khoản · {vnd(v.amount)}
                    </span>
                  </li>
                ) : null,
              )}
            </ul>
          </section>

          {summary.items.length === 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-medium text-slate-900">
                Chưa có khoản hoa hồng sau HĐMB.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Khi deal còn đang chạy, theo dõi tại{" "}
                <Link
                  href="/moi-gioi/ho-so"
                  className="text-brand-700 underline"
                >
                  Hồ sơ
                </Link>{" "}
                — số tiền xuất hiện sau Ops nhập giá HĐMB.
              </p>
            </section>
          ) : (
            <ul className="space-y-3">
              {summary.items.map((c) => (
                <li
                  key={c.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <p className="text-lg font-bold text-slate-900">
                    {vnd(Number(c.amount))}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {COMMISSION_STATUS_LABEL[c.status] ?? c.status}
                    {c.lead?.project?.name
                      ? ` · ${c.lead.project.name}`
                      : c.lead?.listing?.code
                        ? ` · ${c.lead.listing.code}`
                        : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </div>
  );
}
