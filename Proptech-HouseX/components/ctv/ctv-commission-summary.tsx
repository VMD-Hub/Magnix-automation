"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetch("/api/ctv/commissions")
      .then((r) => r.json())
      .then((j) => setSummary(j.data ?? null))
      .catch(() => setSummary(null));
  }, []);

  if (!summary) return null;

  const accrued = summary.totalsByStatus.ACCRUED?.amount ?? 0;
  const payable = summary.totalsByStatus.PAYABLE?.amount ?? 0;
  const paid = summary.totalsByStatus.PAID?.amount ?? 0;

  if (accrued + payable + paid === 0 && summary.items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
      <h2 className="text-lg font-bold text-slate-900">Hoa hồng NOXH</h2>
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
      {summary.items.slice(0, 3).map((c) => (
        <div
          key={c.id}
          className="mt-2 flex justify-between border-t border-emerald-100 pt-2 text-sm"
        >
          <span>{COMMISSION_STATUS_LABEL[c.status] ?? c.status}</span>
          <span className="font-medium">{vnd(Number(c.amount))}</span>
        </div>
      ))}
    </section>
  );
}
