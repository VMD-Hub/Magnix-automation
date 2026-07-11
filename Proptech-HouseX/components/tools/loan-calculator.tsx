"use client";

import { useCallback, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { PercentInput } from "@/components/tools/percent-input";
import { DisbursementMilestoneTable } from "@/components/tools/disbursement-milestone-table";
import { cn } from "@/lib/ui/cn";
import { DEFAULT_LOAN_ANNUAL_RATE } from "@/lib/format/percent";
import { calculateLoan, type LoanMethod } from "@/lib/finance/loan";
import {
  calculateDisbursementPlan,
  createDefaultMilestones,
  type MilestoneInput,
  type PaymentScheduleMode,
} from "@/lib/finance/loan-disbursement";
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
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={cn(
          "mt-1 break-words text-base font-bold leading-snug sm:text-lg",
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
  const [rate, setRate] = useState(DEFAULT_LOAN_ANNUAL_RATE);
  const [method, setMethod] = useState<LoanMethod>("DECLINING");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [promoRate, setPromoRate] = useState(5.5);
  const [promoMonths, setPromoMonths] = useState(12);
  const [graceMonths, setGraceMonths] = useState(0);
  const [showAllRows, setShowAllRows] = useState(false);
  const [paymentMode, setPaymentMode] = useState<PaymentScheduleMode>("TIME");
  const [milestones, setMilestones] = useState<MilestoneInput[]>(() =>
    createDefaultMilestones("TIME"),
  );
  const [usePaymentSchedule, setUsePaymentSchedule] = useState(false);

  const principal = Math.round((price * loanPct) / 100);

  const handlePaymentModeChange = useCallback((mode: PaymentScheduleMode) => {
    setPaymentMode(mode);
    setMilestones(createDefaultMilestones(mode));
    setUsePaymentSchedule(true);
  }, []);

  const classicResult = useMemo(
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

  const disbursementResult = useMemo(() => {
    if (!usePaymentSchedule || milestones.length === 0) return null;
    return calculateDisbursementPlan({
      propertyPrice: price,
      loanPct,
      loanMonths: years * 12,
      annualRate: rate,
      method,
      promoRate: showAdvanced && promoMonths > 0 ? promoRate : undefined,
      promoMonths: showAdvanced ? promoMonths : 0,
      graceMonths: showAdvanced ? graceMonths : 0,
      mode: paymentMode,
      milestones,
    });
  }, [
    usePaymentSchedule,
    milestones,
    price,
    loanPct,
    years,
    rate,
    method,
    showAdvanced,
    promoRate,
    promoMonths,
    graceMonths,
    paymentMode,
  ]);

  const useDisbursement = disbursementResult != null;
  const visibleClassicRows = showAllRows
    ? classicResult.schedule
    : classicResult.schedule.slice(0, 12);
  const visibleDisbursementRows = showAllRows
    ? (disbursementResult?.schedule ?? [])
    : (disbursementResult?.schedule ?? []).slice(0, 12);

  const inputCls =
    "mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-base text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 sm:text-sm";

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-4 proptech-ruby-soft-panel p-4 sm:p-5 print:hidden">
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
          hint={`Số tiền vay tối đa: ${formatVnd(principal)}`}
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
          <PercentInput value={rate} onChange={setRate} />
        </Field>

        <div>
          <span className="text-sm font-medium text-slate-700">
            Phương pháp tính
          </span>
          <div className="mt-1 grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
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
          {showAdvanced ? "− Ẩn tuỳ chọn nâng cao" : "+ Tuỳ chọn nâng cao"}
        </button>

        {showAdvanced ? (
          <div className="space-y-4">
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Lãi ưu đãi / ân hạn gốc
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Lãi ưu đãi (%/năm)">
                  <PercentInput value={promoRate} onChange={setPromoRate} />
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
              <Field
                label="Ân hạn gốc (tháng)"
                hint="Chỉ trả lãi trong giai đoạn này"
              >
                <input
                  type="number"
                  value={graceMonths}
                  onChange={(e) => setGraceMonths(Number(e.target.value))}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={usePaymentSchedule}
                  onChange={(e) => {
                    setUsePaymentSchedule(e.target.checked);
                    if (e.target.checked && milestones.length === 0) {
                      setMilestones(createDefaultMilestones(paymentMode));
                    }
                  }}
                  className="accent-brand-600"
                />
                <span className="font-medium text-slate-700">
                  Dùng lịch thanh toán & giải ngân CĐT
                </span>
              </label>

              {usePaymentSchedule ? (
                <DisbursementMilestoneTable
                  mode={paymentMode}
                  onModeChange={handlePaymentModeChange}
                  milestones={milestones}
                  onMilestonesChange={(rows) => {
                    setMilestones(rows);
                    setUsePaymentSchedule(rows.length > 0);
                  }}
                  loanPct={loanPct}
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="min-w-0 space-y-5">
        <div className="hidden print:block">
          <h1 className="text-2xl font-bold text-slate-900">
            HouseX — Lịch trả nợ vay mua bất động sản
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Giá {formatVnd(price)} · Vay tối đa {loanPct}% · {years} năm ·{" "}
            {rate}%/năm
          </p>
        </div>

        {disbursementResult?.bankCapExceeded ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Tổng giải ngân NH vượt {loanPct}% — hệ thống đã cắt bớt ở đợt cuối
            theo trần vay.
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
          {useDisbursement && disbursementResult ? (
            <>
              <Stat
                label="NH giải ngân"
                value={formatVnd(disbursementResult.totalBankDisbursed) ?? "—"}
              />
              <Stat
                label="Áp lực tháng cao nhất"
                value={formatVnd(disbursementResult.maxMonthlyCashOut) ?? "—"}
                accent
              />
              <Stat
                label="Tổng lãi NH"
                value={formatVnd(disbursementResult.totalInterest) ?? "—"}
              />
              <Stat
                label="Tổng chi (KH + NH)"
                value={formatVnd(disbursementResult.totalCashOut) ?? "—"}
              />
            </>
          ) : (
            <>
              <Stat label="Số tiền vay" value={formatVnd(principal) ?? "—"} />
              <Stat
                label="Trả tháng đầu"
                value={formatVnd(classicResult.firstPayment) ?? "—"}
                accent
              />
              <Stat
                label="Tổng tiền lãi"
                value={formatVnd(classicResult.totalInterest) ?? "—"}
              />
              <Stat
                label="Tổng thanh toán"
                value={formatVnd(classicResult.totalPayment) ?? "—"}
              />
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <h2 className="text-lg font-bold text-slate-900">
            {useDisbursement
              ? "Dòng tiền hợp nhất (CĐT + NH)"
              : "Lịch trả nợ chi tiết"}
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="shrink-0"
          >
            <Icon.FileCheck className="text-base" /> Tải PDF
          </Button>
        </div>

        <div className="rounded-2xl border border-slate-200">
          <p className="border-b border-slate-100 px-3 py-2 text-xs text-slate-500 sm:hidden">
            Vuốt ngang để xem đủ cột
          </p>
          <div className="max-h-[28rem] overflow-auto [-webkit-overflow-scrolling:touch] print:max-h-none print:overflow-visible">
            {useDisbursement && disbursementResult ? (
              <table className="w-full min-w-[48rem] text-right text-sm">
                <thead className="sticky top-0 bg-slate-100 text-xs text-slate-600">
                  <tr>
                    <th className="px-2 py-2 text-left">Tháng</th>
                    <th className="px-2 py-2 text-left">Mốc</th>
                    <th className="px-2 py-2">Trả CĐT</th>
                    <th className="px-2 py-2">NH giải ngân</th>
                    <th className="px-2 py-2">Dư nợ</th>
                    <th className="px-2 py-2">Lãi</th>
                    <th className="px-2 py-2">Gốc</th>
                    <th className="px-2 py-2">Trả NH</th>
                    <th className="px-2 py-2 font-semibold text-brand-800">
                      Tổng ra tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleDisbursementRows.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50">
                      <td className="px-2 py-2 text-left font-medium text-slate-700">
                        {row.month === 0 ? "Ký HĐMB" : `+${row.month}`}
                      </td>
                      <td className="max-w-[8rem] truncate px-2 py-2 text-left text-xs text-slate-500">
                        {row.milestoneLabel ?? "—"}
                      </td>
                      <td className="px-2 py-2 text-slate-600">
                        {row.customerToDeveloper
                          ? groupVnd(row.customerToDeveloper)
                          : "—"}
                      </td>
                      <td className="px-2 py-2 text-slate-600">
                        {row.bankDisbursement
                          ? groupVnd(row.bankDisbursement)
                          : "—"}
                      </td>
                      <td className="px-2 py-2 text-slate-600">
                        {groupVnd(row.loanBalance)}
                      </td>
                      <td className="px-2 py-2 text-slate-600">
                        {row.interestPaid ? groupVnd(row.interestPaid) : "—"}
                      </td>
                      <td className="px-2 py-2 text-slate-600">
                        {row.principalPaid ? groupVnd(row.principalPaid) : "—"}
                      </td>
                      <td className="px-2 py-2 text-slate-600">
                        {row.bankPayment ? groupVnd(row.bankPayment) : "—"}
                      </td>
                      <td className="px-2 py-2 font-semibold text-slate-900">
                        {groupVnd(row.totalCashOut)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full min-w-[36rem] text-right text-sm">
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
                  {visibleClassicRows.map((row) => (
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
            )}
          </div>
          {!showAllRows &&
          (useDisbursement
            ? (disbursementResult?.schedule.length ?? 0) > 12
            : classicResult.schedule.length > 12) ? (
            <button
              type="button"
              onClick={() => setShowAllRows(true)}
              className="w-full border-t border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-brand-700 hover:bg-slate-100 print:hidden"
            >
              Xem toàn bộ{" "}
              {useDisbursement
                ? disbursementResult?.schedule.length
                : classicResult.schedule.length}{" "}
              dòng
            </button>
          ) : null}
        </div>

        <p className="text-xs text-slate-400">
          *** Kết quả chỉ mang tính tham khảo và có thể thay đổi theo chính sách
          từng ngân hàng / CĐT. Đơn vị: VND.
        </p>
      </div>
    </div>
  );
}
