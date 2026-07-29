"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LeadContactForm } from "@/components/leads/lead-contact-form";
import { VndInput } from "@/components/tools/vnd-input";
import { PercentInput } from "@/components/tools/percent-input";
import {
  calculateRentalCashflow,
  DEFAULT_RENTAL_TAX_RATE,
} from "@/lib/finance/rental-cashflow";
import { formatVnd } from "@/lib/format";
import { RE_KNOWLEDGE_PATH } from "@/lib/content/article-routes";

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
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function RentalCashflowCalculator() {
  const [rentMonthly, setRentMonthly] = useState(12_000_000);
  const [opexMonthly, setOpexMonthly] = useState(1_500_000);
  const [vacancyMonths, setVacancyMonths] = useState(1);
  const [taxPct, setTaxPct] = useState(DEFAULT_RENTAL_TAX_RATE * 100);

  const result = useMemo(
    () =>
      calculateRentalCashflow({
        rentMonthly,
        opexMonthly,
        vacancyMonthsPerYear: vacancyMonths,
        taxRate: taxPct / 100,
      }),
    [rentMonthly, opexMonthly, vacancyMonths, taxPct],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <Field
          label="Giá thuê / tháng"
          hint="Số tiền khách trả theo hợp đồng (trước thuế)."
        >
          <div className="mt-1">
            <VndInput value={rentMonthly} onChange={setRentMonthly} />
          </div>
        </Field>
        <Field
          label="Chi phí vận hành / tháng"
          hint="Phí quản lý tòa, điện nước ước tính chủ chịu, internet, bảo trì nhỏ…"
        >
          <div className="mt-1">
            <VndInput value={opexMonthly} onChange={setOpexMonthly} />
          </div>
        </Field>
        <Field label="Số tháng trống / năm" hint="0 = luôn có khách; 12 = trống cả năm.">
          <input
            type="number"
            min={0}
            max={12}
            step={0.5}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            value={vacancyMonths}
            onChange={(e) => setVacancyMonths(Number(e.target.value) || 0)}
          />
        </Field>
        <Field
          label="Thuế ước tính trên doanh thu thuê (%)"
          hint="Tham chiếu phổ biến ~10% (5% GTGT + 5% TNCN) với cá nhân — từng hồ sơ khác nhau."
        >
          <div className="mt-1">
            <PercentInput value={taxPct} onChange={setTaxPct} />
          </div>
        </Field>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-800">
            Ước tính / tháng
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Thuê hiệu dụng (sau trống)</dt>
              <dd className="font-semibold tabular-nums">
                {formatVnd(result.effectiveRentMonthly) ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Thuế ước tính</dt>
              <dd className="font-semibold tabular-nums text-amber-800">
                −{formatVnd(result.taxMonthly) ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Chi phí vận hành</dt>
              <dd className="font-semibold tabular-nums">
                −{formatVnd(result.opexMonthly) ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-brand-200/80 pt-2">
              <dt className="font-medium text-slate-900">Dòng tiền ròng</dt>
              <dd
                className={`text-lg font-extrabold tabular-nums ${
                  result.netMonthly >= 0 ? "text-brand-800" : "text-rose-700"
                }`}
              >
                {formatVnd(result.netMonthly) ?? "—"}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-slate-600">
            Cả năm (ròng ước tính):{" "}
            <span className="font-semibold">
              {formatVnd(result.netAnnual) ?? "—"}
            </span>
            {result.netMarginOnGrossRent != null ? (
              <>
                {" "}
                · biên ~{(result.netMarginOnGrossRent * 100).toFixed(0)}% trên
                doanh thu thuê niêm yết
              </>
            ) : null}
          </p>
        </div>

        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
          Đây là <strong>ước lượng sơ bộ</strong> để so sánh phương án — không phải
          số thuế phải nộp chính thức, không thay thế kế toán / cơ quan thuế. Đọc
          thêm{" "}
          <Link
            href={`${RE_KNOWLEDGE_PATH}/thue-cho-thue-nha-2026-ma-nganh-68103`}
            className="font-semibold underline"
          >
            thuế cho thuê & mã 68103
          </Link>
          .
        </p>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">
            Cần hỗ trợ tiếp?
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Để lại SĐT — Minh An Land / đối tác kế toán liên hệ theo nhu cầu (không
            đồng nghĩa đang quản lý căn hộ của bạn).
          </p>
          <div className="mt-3 space-y-4">
            <LeadContactForm
              rentalIntent="tax_help"
              compact
              title="Tư vấn thuế / kế toán"
            />
            <LeadContactForm
              rentalIntent="landlord"
              compact
              title="Tôi là chủ — cần tìm khách thuê"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
