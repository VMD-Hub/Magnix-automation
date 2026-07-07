"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CampaignListItem = {
  id: string;
  slug: string;
  name: string;
  status: string;
  _count: { wins: number; spins: number };
};

export function PromotionListBoard() {
  const [items, setItems] = useState<CampaignListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/promotions")
      .then((r) => r.json())
      .then((j) => setItems(j.data?.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Đang tải…</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Chương trình</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3">Lượt quay</th>
            <th className="px-4 py-3">Trúng</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-500">/{c.slug}</p>
              </td>
              <td className="px-4 py-3">{c.status}</td>
              <td className="px-4 py-3">{c._count.spins}</td>
              <td className="px-4 py-3">{c._count.wins}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/promotions/${c.id}`}
                  className="font-medium text-brand-700 hover:underline"
                >
                  Quản lý
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
