import { notFound } from "next/navigation";
import { getBrokerCommissions } from "@/lib/data/commission";
import {
  COMMISSION_STATUS_LABEL,
  LEAD_STATUS_LABEL,
} from "@/lib/format";

export const dynamic = "force-dynamic";

const vnd = (n: number) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

type PageProps = { params: Promise<{ id: string }> };

export default async function BrokerCommissionPage({ params }: PageProps) {
  const { id } = await params;
  const summary = await getBrokerCommissions(id);

  if (!summary.broker) {
    notFound();
  }

  const statuses = ["PENDING", "APPROVED", "PAID", "REJECTED"] as const;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Bảng hoa hồng</h1>
        <p className="mt-1 text-slate-600">
          Môi giới: <strong>{summary.broker.fullName}</strong>
        </p>

        <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="text-xs uppercase text-emerald-700">Tổng</div>
            <div className="mt-1 text-lg font-bold text-emerald-800">
              {vnd(summary.totalAmount)}
            </div>
          </div>
          {statuses.map((s) => (
            <div
              key={s}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="text-xs uppercase text-slate-500">
                {COMMISSION_STATUS_LABEL[s]}
              </div>
              <div className="mt-1 font-semibold">
                {vnd(summary.totalsByStatus[s]?.amount ?? 0)}
              </div>
              <div className="text-xs text-slate-400">
                {summary.totalsByStatus[s]?.count ?? 0} khoản
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Nguồn</th>
                <th className="px-4 py-3 font-medium">Lead</th>
                <th className="px-4 py-3 font-medium">Tỷ lệ</th>
                <th className="px-4 py-3 font-medium">Số tiền</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {summary.items.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={6}>
                    Chưa có khoản hoa hồng nào.
                  </td>
                </tr>
              )}
              {summary.items.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    {c.lead.project?.name ??
                      c.lead.listing?.code ??
                      c.referral?.code ??
                      "—"}
                  </td>
                  <td className="px-4 py-3">
                    {LEAD_STATUS_LABEL[c.lead.status] ?? c.lead.status}
                  </td>
                  <td className="px-4 py-3">
                    {c.rate != null ? `${(c.rate * 100).toFixed(2)}%` : "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {vnd(Number(c.amount.toString()))}
                  </td>
                  <td className="px-4 py-3">
                    {COMMISSION_STATUS_LABEL[c.status] ?? c.status}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
