"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import { calculateLoan, type LoanMethod } from "@/lib/finance/loan";
import { formatVnd } from "@/lib/format";

function groupVnd(n: number): string {
  return n.toLocaleString("vi-VN");
}

function parseVnd(s: string): number {
  const digits = s.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={cn(
          "mt-1 text-lg font-bold",
          accent ? "text-brand-700" : "text-slate-900",
        )}
      >
        {value}
      </p>
    </div>
  );
}

const YEARS = [5, 10, 15, 20, 25, 30];

export function LoanCalculator() {
  const [price, setPrice] = useState(3_000_000_000);
  const [loanPct, setLoanPct] = useState(70);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [method, setMethod] = useState<LoanMethod>("DECLINING");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [promoRate, setPromoRate] = useState(6);
  const [promoMonths, setPromoMonths] = useState(12);
  const [graceMonths, setGraceMonths] = useState(0);
  const [showAllRows, setShowAllRows] = useState(false);

  const principal = Math.round((price * loanPct) / 100);

  const result = useMemo(
    () =>
      calculateLoan({
        principal,
        annualRate: rate,
        months: years * 12,
        method,
        promoRate: showAdvanced && promoMonths > 0 ? promoRate : undefined,
        promoMonths: showAdvanced ? promoMonths : 0,
        graceMonths: showAdvanced ? graceMonths : 0,
      }),
    [principal, rate, years, method, showAdvanced, promoRate, promoMonths, graceMonths],
  );

  const visibleRows = showAllRows ? result.schedule : result.schedule.slice(0, 12);

  const inputCls =
    "mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* Inputs */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 print:hidden">
        <Field label="Giá trị bất động sản" hint={`${groupVnd(price)} đ`}>
          <input
            inputMode="numeric"
            value={groupVnd(price)}
            onChange={(e) => setPrice(parseVnd(e.target.value))}
            className={inputCls}
          />
        </Field>

        <Field
          label={`Tỷ lệ vay: ${loanPct}%`}
          hint={`Số tiền vay: ${formatVnd(principal)}`}
        >
          <input
            type="range"
            min={10}
            max={85}
            step={5}
            value={loanPct}
            onChange={(e) => setLoanPct(Number(e.target.value))}
            className="mt-3 w-full accent-brand-600"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Thời hạn vay">
            <select
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className={inputCls}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y} năm
                </option>
              ))}
            </select>
          </Field>
          <Field label="Lãi suất (%/năm)">
            <input
              type="number"
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
        </div>

        <div>
          <span className="text-sm font-medium text-slate-700">
            Phương pháp tính
          </span>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(
              [
                { id: "DECLINING", label: "Dư nợ giảm dần" },
                { id: "ANNUITY", label: "Trả góp đều" },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={cn(
                  "h-11 rounded-xl border text-sm font-semibold transition-colors",
                  method === m.id
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          {showAdvanced ? "− Ẩn tuỳ chọn nâng cao" : "+ Lãi ưu đãi / ân hạn gốc"}
        </button>

        {showAdvanced ? (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Lãi ưu đãi (%/năm)">
                <input
                  type="number"
                  step={0.1}
                  value={promoRate}
                  onChange={(e) => setPromoRate(Number(e.target.value))}
                  className={inputCls}
                />
              </Field>
              <Field label="Số tháng ưu đãi">
                <input
                  type="number"
                  value={promoMonths}
                  onChange={(e) => setPromoMonths(Number(e.target.value))}
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="Ân hạn gốc (tháng)" hint="Chỉ trả lãi trong giai đoạn này">
              <input
                type="number"
                value={graceMonths}
                onChange={(e) => setGraceMonths(Number(e.target.value))}
                className={inputCls}
              />
            </Field>
          </div>
        ) : null}
      </div>

      {/* Results */}
      <div className="space-y-5">
        {/* Tiêu đề chỉ hiện khi in/PDF */}
        <div className="hidden print:block">
          <h1 className="text-2xl font-bold text-slate-900">
            HouseX — Lịch trả nợ vay mua bất động sản
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Số tiền vay {formatVnd(principal)} · {years} năm · {rate}%/năm ·{" "}
            {method === "DECLINING" ? "Dư nợ giảm dần" : "Trả góp đều"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Số tiền vay" value={formatVnd(principal) ?? "—"} />
          <Stat
            label="Trả tháng đầu"
            value={formatVnd(result.firstPayment) ?? "—"}
            accent
          />
          <Stat label="Tổng tiền lãi" value={formatVnd(result.totalInterest) ?? "—"} />
          <Stat
            label="Tổng thanh toán"
            value={formatVnd(result.totalPayment) ?? "—"}
          />
        </div>

        <div className="flex items-center justify-between print:hidden">
          <h2 className="text-lg font-bold text-slate-900">Lịch trả nợ chi tiết</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
          >
            <Icon.FileCheck className="text-base" /> Tải PDF
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="max-h-[28rem] overflow-auto print:max-h-none print:overflow-visible">
            <table className="w-full text-right text-sm">
              <thead className="sticky top-0 bg-slate-100 text-xs text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">Tháng</th>
                  <th className="px-3 py-2">Gốc</th>
                  <th className="px-3 py-2">Lãi</th>
                  <th className="px-3 py-2">Trả/tháng</th>
                  <th className="px-3 py-2">Dư nợ còn lại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRows.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-left font-medium text-slate-700">
                      {row.month}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {groupVnd(row.principalPaid)}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {groupVnd(row.interestPaid)}
                    </td>
                    <td className="px-3 py-2 font-semibold text-slate-900">
                      {groupVnd(row.payment)}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {groupVnd(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!showAllRows && result.schedule.length > 12 ? (
            <button
              type="button"
              onClick={() => setShowAllRows(true)}
              className="w-full border-t border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-brand-700 hover:bg-slate-100 print:hidden"
            >
              Xem toàn bộ {result.schedule.length} tháng
            </button>
          ) : null}
        </div>

        <p className="text-xs text-slate-400">
          *** Kết quả chỉ mang tính tham khảo và có thể thay đổi theo chính sách
          từng ngân hàng. Đơn vị: VND.
        </p>
      </div>
    </div>
  );
}
