"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/ui/cn";
import type { RentalKpiPayload } from "@/lib/admin/rental-kpi";

type WindowDays = 7 | 30 | 90;

const WINDOWS: { days: WindowDays; label: string }[] = [
  { days: 7, label: "7 ngày" },
  { days: 30, label: "30 ngày" },
  { days: 90, label: "90 ngày" },
];

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function RentalKpiBoard() {
  const [days, setDays] = useState<WindowDays>(30);
  const [data, setData] = useState<RentalKpiPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/rental-kpi?days=${days}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không tải được KPI thuê.");
        setData(null);
        return;
      }
      setData(json.data);
    } catch {
      setError("Lỗi mạng khi tải KPI thuê.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {WINDOWS.map((w) => (
          <button
            key={w.days}
            type="button"
            onClick={() => setDays(w.days)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium",
              days === w.days
                ? "bg-brand-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200",
            )}
          >
            {w.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void load()}
          className="ml-auto rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Làm mới
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải…</p>
      ) : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {data ? (
        <>
          <p className="text-sm text-slate-600">{data.summary.note}</p>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">
              P1 — Chất lượng tin RENT
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <StatCard
                label="Đã review"
                value={data.p1ListingQa.reviewed}
                hint="Tin RENT có reviewedAt trong cửa sổ"
              />
              <StatCard
                label="Từ chối"
                value={data.p1ListingQa.rejected}
              />
              <StatCard
                label="% từ chối"
                value={
                  data.p1ListingQa.rejectPct != null
                    ? `${data.p1ListingQa.rejectPct}%`
                    : "—"
                }
              />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">
              P2 — Tìm khách / hoa hồng
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Lead chủ nhà"
                value={data.p2Leasing.landlordLeadsInWindow}
              />
              <StatCard
                label="Lead khách thuê"
                value={data.p2Leasing.tenantLeadsInWindow}
              />
              <StatCard
                label="Deal hoa hồng WON"
                value={data.p2Leasing.commissionWonInWindow}
              />
              <StatCard
                label="Median giờ → contact"
                value={
                  data.p2Leasing.landlordContact.medianHoursToContact != null
                    ? data.p2Leasing.landlordContact.medianHoursToContact
                    : "—"
                }
                hint={`Mẫu n=${data.p2Leasing.landlordContact.contactedSample} · SLA ${data.p2Leasing.landlordContact.slaHours}h`}
              />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-4">
              <StatCard
                label="Landlord NEW mở"
                value={data.p2Leasing.landlordContact.openNew}
              />
              <StatCard
                label="SLA ok"
                value={data.p2Leasing.landlordContact.sla.ok}
              />
              <StatCard
                label="SLA due"
                value={data.p2Leasing.landlordContact.sla.due}
              />
              <StatCard
                label="SLA overdue"
                value={data.p2Leasing.landlordContact.sla.overdue}
                hint="Ưu tiên gọi ≤ 4h"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Queue Ops:{" "}
              <Link
                href="/admin/ops-leads?rentalIntent=LANDLORD"
                className="font-semibold text-brand-700 underline"
              >
                filter LANDLORD
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">
              P3 — Thuế / referral KT
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <StatCard
                label="TAX_HELP trong cửa sổ"
                value={data.p3TaxReferral.taxHelpLeadsInWindow}
              />
              <StatCard
                label="Queue TAX_HELP mở"
                value={data.p3TaxReferral.taxHelpOpenQueue}
              />
              <StatCard
                label="Đã chuyển partner"
                value={data.p3TaxReferral.partnerHandedInWindow}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              <Link
                href="/admin/ops-leads?rentalIntent=TAX_HELP"
                className="font-semibold text-brand-700 underline"
              >
                Queue thuế / kế toán
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">
              P4 — NEED_PM waitlist (Sense only)
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <StatCard
                label="NEED_PM trong cửa sổ"
                value={data.p4NeedPmSense.needPmLeadsInWindow}
              />
              <StatCard
                label="Waitlist mở"
                value={data.p4NeedPmSense.needPmOpenWaitlist}
                hint={data.p4NeedPmSense.note}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              <Link
                href="/admin/ops-leads?rentalIntent=NEED_PM"
                className="font-semibold text-brand-700 underline"
              >
                Queue NEED_PM
              </Link>
              {" · "}
              Không bán Lớp 3 từ số liệu này.
            </p>
          </section>
        </>
      ) : null}
    </div>
  );
}
