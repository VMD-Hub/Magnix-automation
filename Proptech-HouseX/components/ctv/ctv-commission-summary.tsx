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
  expectedPayDate: string | null;
  paidAt: string | null;
};

type Summary = {
  totalsByStatus: Record<string, { count: number; amount: number }>;
  items: CommissionItem[];
};

export function CtvCommissionSummary() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/ctv/commissions")
      .then((r) => r.json())
      .then((j) => setSummary(j.data ?? null))
      .catch(() => setSummary(null))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  const accrued = summary?.totalsByStatus.ACCRUED?.amount ?? 0;
  const payable = summary?.totalsByStatus.PAYABLE?.amount ?? 0;
  const paid = summary?.totalsByStatus.PAID?.amount ?? 0;
  const empty =
    !summary ||
    (accrued + payable + paid === 0 && summary.items.length === 0);

  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900">Hoa hồng NOXH</h2>
        <Link
          href="/moi-gioi/hoa-hong"
          className="text-sm font-medium text-brand-700 hover:underline"
        >
          Xem đầy đủ
        </Link>
      </div>
      <p className="mt-1 text-xs text-slate-600">
        Số chi xuất hiện sau khi ký HĐMB và Ops nhập giá căn (% × HĐMB theo mức
        deal).
      </p>
      {empty ? (
        <p className="mt-3 text-sm text-slate-600">
          Chưa có khoản sau HĐMB — theo dõi tiến độ deal tại hồ sơ.
        </p>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-slate-500">Chờ chi</p>
              <p className="font-semibold text-amber-800">{vnd(accrued)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Sắp chi</p>
              <p className="font-semibold text-violet-800">{vnd(payable)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Đã chi</p>
              <p className="font-semibold text-emerald-800">{vnd(paid)}</p>
            </div>
          </div>
          {summary!.items.slice(0, 3).map((c) => (
            <div
              key={c.id}
              className="mt-2 flex justify-between border-t border-emerald-100 pt-2 text-sm"
            >
              <span>{COMMISSION_STATUS_LABEL[c.status] ?? c.status}</span>
              <span className="font-medium">{vnd(Number(c.amount))}</span>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
