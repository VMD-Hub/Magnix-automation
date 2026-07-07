"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { PercentInput } from "@/components/tools/percent-input";
import { cn } from "@/lib/ui/cn";
import { DEFAULT_LOAN_ANNUAL_RATE } from "@/lib/format/percent";
import {
  calculateAffordability,
  DTI_PROFILES,
  LIVING_COST_PRESETS,
  type BindingMethod,
  type DtiProfile,
  type LivingCostRegion,
} from "@/lib/finance/loan-affordability";
import type { BadDebtStatus } from "@/lib/finance/credit-readiness";
import type { LoanMethod } from "@/lib/finance/loan";
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

function Stepper({
  value,
  onChange,
  min = 0,
  max = 8,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-lg font-bold text-slate-600 hover:bg-slate-50"
        aria-label="Giảm"
      >
        −
      </button>
      <span className="min-w-[2rem] text-center text-sm font-bold text-slate-900">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-lg font-bold text-slate-600 hover:bg-slate-50"
        aria-label="Tăng"
      >
        +
      </button>
    </div>
  );
}

const PROFILE_ACCENT: Record<DtiProfile, string> = {
  CONSERVATIVE: "border-emerald-200 bg-emerald-50/60",
  STANDARD: "border-brand-200 bg-brand-50/60",
  MAXIMUM: "border-amber-200 bg-amber-50/60",
};

const FLAG_STYLE: Record<string, { label: string; cls: string }> = {
  CLEAN: { label: "Thuận lợi", cls: "bg-emerald-100 text-emerald-800" },
  CAUTION: { label: "Cần lưu ý", cls: "bg-amber-100 text-amber-800" },
  BLOCKER: { label: "Rào cản lớn", cls: "bg-red-100 text-red-800" },
  NOT_APPLICABLE: { label: "Không áp dụng", cls: "bg-slate-100 text-slate-600" },
};

const BINDING_LABEL: Record<BindingMethod, string> = {
  DTI: "Giới hạn bởi DTI",
  RESIDUAL: "Giới hạn bởi chi phí sinh hoạt",
  EQUAL: "DTI & sinh hoạt ngang nhau",
};

const YEARS = [10, 15, 20, 25, 30];
const LTV_OPTIONS = [70, 75, 80, 85];

const BAD_DEBT_OPTIONS: { id: BadDebtStatus; label: string }[] = [
  { id: "NONE", label: "Không / đã xử lý" },
  { id: "UNKNOWN", label: "Chưa tra CIC" },
  { id: "GROUP_2_PLUS", label: "Nợ xấu nhóm 2+" },
];

export function LoanAffordabilityCalculator() {
  const [income, setIncome] = useState(40_000_000);
  const [existingDebt, setExistingDebt] = useState(0);
  const [cardLimit, setCardLimit] = useState(0);
  const [isMarried, setIsMarried] = useState(false);
  const [coBorrow, setCoBorrow] = useState(false);
  const [coIncome, setCoIncome] = useState(0);
  const [coDebt, setCoDebt] = useState(0);
  const [coCard, setCoCard] = useState(0);
  const [applicantBadDebt, setApplicantBadDebt] = useState<BadDebtStatus>("NONE");
  const [spouseBadDebt, setSpouseBadDebt] = useState<BadDebtStatus>("NONE");
  const [dependentChildren, setDependentChildren] = useState(0);
  const [dependentElderly, setDependentElderly] = useState(0);
  const [livingRegion, setLivingRegion] = useState<LivingCostRegion>("URBAN");
  const [customPerCapita, setCustomPerCapita] = useState(4_000_000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(DEFAULT_LOAN_ANNUAL_RATE);
  const [ltvPct, setLtvPct] = useState(70);
  const [method, setMethod] = useState<LoanMethod>("DECLINING");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const result = useMemo(
    () =>
      calculateAffordability({
        householdMonthlyIncome: income,
        existingMonthlyDebtPayment: existingDebt,
        creditCardLimitTotal: cardLimit,
        isMarried,
        applicantBadDebt,
        spouseBadDebt: isMarried ? spouseBadDebt : "NONE",
        dependentChildren,
        dependentElderly,
        livingCostRegion: livingRegion,
        customLivingCostPerCapita: customPerCapita,
        coBorrower:
          coBorrow && coIncome > 0
            ? {
                monthlyIncome: coIncome,
                existingMonthlyDebtPayment: coDebt,
                creditCardLimitTotal: coCard,
              }
            : undefined,
        annualRate: rate,
        years,
        method,
        ltvPct,
      }),
    [
      income,
      existingDebt,
      cardLimit,
      isMarried,
      coBorrow,
      coIncome,
      coDebt,
      coCard,
      applicantBadDebt,
      spouseBadDebt,
      dependentChildren,
      dependentElderly,
      livingRegion,
      customPerCapita,
      rate,
      years,
      method,
      ltvPct,
    ],
  );

  const standard = result.scenarios.find((s) => s.profile === "STANDARD")!;
  const flagStyle = FLAG_STYLE[result.creditAssessment.flag] ?? FLAG_STYLE.CAUTION;

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100 sm:text-sm";

  const dtiPct = result.currentDti != null ? Math.round(result.currentDti * 100) : null;

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-4 proptech-ruby-soft-panel p-4 sm:p-5 print:hidden">
        <Field
          label="Thu nhập của bạn/tháng"
          hint="Lương + thu nhập chứng minh được (HĐLĐ, sao kê, hợp đồng…)"
        >
          <input
            inputMode="numeric"
            value={groupVnd(income)}
            onChange={(e) => setIncome(parseVnd(e.target.value))}
            className={inputCls}
          />
        </Field>

        <div>
          <span className="text-sm font-medium text-slate-700">Tình trạng hôn nhân</span>
          <div className="mt-2 flex gap-2">
            {(
              [
                [false, "Độc thân"],
                [true, "Đã kết hôn"],
              ] as const
            ).map(([val, label]) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setIsMarried(val);
                  if (!val) {
                    setCoBorrow(false);
                    setSpouseBadDebt("NONE");
                  }
                }}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
                  isMarried === val
                    ? "border-brand-400 bg-brand-50 text-brand-800"
                    : "border-slate-200 text-slate-600 hover:border-brand-200",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {isMarried ? (
            <span className="mt-1 block text-xs text-slate-400">
              Ngân hàng thường tra CIC vợ/chồng và tính chi phí sinh hoạt cho cả hộ.
            </span>
          ) : null}
        </div>

        {isMarried ? (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={coBorrow}
                onChange={(e) => setCoBorrow(e.target.checked)}
                className="accent-brand-600"
              />
              <span className="text-sm font-medium text-slate-700">
                Vợ/chồng đồng vay (cộng thu nhập)
              </span>
            </label>
            {coBorrow ? (
              <div className="space-y-3 border-t border-slate-100 pt-3">
                <Field label="Thu nhập vợ/chồng/tháng">
                  <input
                    inputMode="numeric"
                    value={groupVnd(coIncome)}
                    onChange={(e) => setCoIncome(parseVnd(e.target.value))}
                    className={inputCls}
                  />
                </Field>
                <Field label="Trả nợ hiện tại của vợ/chồng/tháng">
                  <input
                    inputMode="numeric"
                    value={groupVnd(coDebt)}
                    onChange={(e) => setCoDebt(parseVnd(e.target.value))}
                    className={inputCls}
                  />
                </Field>
                <Field label="Hạn mức thẻ tín dụng vợ/chồng">
                  <input
                    inputMode="numeric"
                    value={groupVnd(coCard)}
                    onChange={(e) => setCoCard(parseVnd(e.target.value))}
                    className={inputCls}
                  />
                </Field>
              </div>
            ) : null}
            <Field label="CIC vợ/chồng" hint="Nợ xấu nhóm 2+ của vợ/chồng ảnh hưởng hồ sơ chung">
              <select
                value={spouseBadDebt}
                onChange={(e) => setSpouseBadDebt(e.target.value as BadDebtStatus)}
                className={inputCls}
              >
                {BAD_DEBT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        ) : null}

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-sm font-medium text-slate-700">Người phụ thuộc trong hộ</p>
          <p className="mt-0.5 text-xs text-slate-400">
            Con chưa thu nhập, thành niên ở cùng, cha mẹ không lương — làm tăng chi phí sinh hoạt
            dự phòng.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-slate-600">Con / thành niên phụ thuộc</span>
              <Stepper value={dependentChildren} onChange={setDependentChildren} />
            </div>
            <div>
              <span className="text-xs text-slate-600">Cha mẹ phụ thuộc</span>
              <Stepper value={dependentElderly} onChange={setDependentElderly} max={4} />
            </div>
          </div>
        </div>

        <Field
          label="Chi phí sinh hoạt tối thiểu/đầu người"
          hint={LIVING_COST_PRESETS[livingRegion].hint}
        >
          <select
            value={livingRegion}
            onChange={(e) => setLivingRegion(e.target.value as LivingCostRegion)}
            className={inputCls}
          >
            {(Object.keys(LIVING_COST_PRESETS) as LivingCostRegion[]).map((k) => (
              <option key={k} value={k}>
                {LIVING_COST_PRESETS[k].label}
                {k !== "CUSTOM"
                  ? ` (~${groupVnd(LIVING_COST_PRESETS[k].perCapita)} đ/tháng)`
                  : ""}
              </option>
            ))}
          </select>
          {livingRegion === "CUSTOM" ? (
            <input
              inputMode="numeric"
              value={groupVnd(customPerCapita)}
              onChange={(e) => setCustomPerCapita(parseVnd(e.target.value))}
              className={cn(inputCls, "mt-2")}
            />
          ) : null}
        </Field>

        <Field
          label="Trả nợ hiện tại của bạn/tháng"
          hint="Vay tiêu dùng, mua xe, trả góp… (không gồm chi tiêu sinh hoạt)"
        >
          <input
            inputMode="numeric"
            value={groupVnd(existingDebt)}
            onChange={(e) => setExistingDebt(parseVnd(e.target.value))}
            className={inputCls}
          />
        </Field>

        <Field label="Hạn mức thẻ tín dụng của bạn" hint="Quy đổi ~5%/tháng khi thẩm định">
          <input
            inputMode="numeric"
            value={groupVnd(cardLimit)}
            onChange={(e) => setCardLimit(parseVnd(e.target.value))}
            className={inputCls}
          />
        </Field>

        <Field label="CIC của bạn">
          <select
            value={applicantBadDebt}
            onChange={(e) => setApplicantBadDebt(e.target.value as BadDebtStatus)}
            className={inputCls}
          >
            {BAD_DEBT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
        </div>

        <Field label={`Tỷ lệ vay (LTV): ${ltvPct}%`} hint="NOXH thường tối đa 70%">
          <input
            type="range"
            min={50}
            max={85}
            step={5}
            value={ltvPct}
            onChange={(e) => setLtvPct(Number(e.target.value))}
            className="mt-3 w-full accent-brand-600"
          />
          <div className="mt-1 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
            <div className="flex min-w-max justify-between gap-4 px-0.5 text-xs text-slate-400">
            {LTV_OPTIONS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setLtvPct(v)}
                className={cn(
                  "rounded px-1 hover:text-brand-600",
                  ltvPct === v && "font-semibold text-brand-700",
                )}
              >
                {v}%
              </button>
            ))}
            </div>
          </div>
        </Field>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          <Icon.Layers className="h-4 w-4" />
          {showAdvanced ? "Ẩn tuỳ chọn nâng cao" : "Tuỳ chọn nâng cao"}
        </button>

        {showAdvanced ? (
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div>
              <span className="text-sm font-medium text-slate-700">Phương pháp tính lãi</span>
              <div className="mt-2 flex gap-2">
                {(
                  [
                    ["DECLINING", "Dư nợ giảm dần"],
                    ["ANNUITY", "Trả góp đều"],
                  ] as const
                ).map(([m, label]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={cn(
                      "flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
                      method === m
                        ? "border-brand-400 bg-brand-50 text-brand-800"
                        : "border-slate-200 text-slate-600 hover:border-brand-200",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="min-w-0 space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Tổng quan hồ sơ</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">
                {dtiPct != null ? `${dtiPct}% DTI` : "—"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Thu nhập xét duyệt: {groupVnd(result.totalIncome)} đ/tháng
                {result.coBorrowerIncome > 0
                  ? ` (gồm ${groupVnd(result.coBorrowerIncome)} đ đồng vay)`
                  : ""}
              </p>
            </div>
            <span
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wide",
                flagStyle.cls,
              )}
            >
              {flagStyle.label}
            </span>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[10px] uppercase text-slate-400">Nghĩa vụ hiện tại</p>
              <p className="text-sm font-bold text-slate-800">
                {groupVnd(result.totalCurrentObligation)} đ
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[10px] uppercase text-slate-400">Chi phí sinh hoạt dự phòng</p>
              <p className="text-sm font-bold text-slate-800">
                {groupVnd(result.livingCostReserve)} đ
              </p>
              <p className="text-[10px] text-slate-400">
                {result.householdMemberCount} thành viên ×{" "}
                {groupVnd(result.livingCostPerCapita)} đ
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[10px] uppercase text-slate-400">Dư sau sinh hoạt & nợ</p>
              <p className="text-sm font-bold text-brand-700">
                {groupVnd(
                  Math.max(
                    0,
                    result.totalIncome -
                      result.livingCostReserve -
                      result.totalCurrentObligation,
                  ),
                )}{" "}
                đ
              </p>
            </div>
          </div>

          {dtiPct != null ? (
            <div className="mt-4">
              <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-all",
                    dtiPct <= 40
                      ? "bg-emerald-500"
                      : dtiPct <= 50
                        ? "bg-brand-500"
                        : dtiPct <= 70
                          ? "bg-amber-500"
                          : "bg-red-500",
                  )}
                  style={{ width: `${Math.min(dtiPct, 100)}%` }}
                />
                <div className="absolute inset-y-0 w-0.5 bg-emerald-600/40" style={{ left: "40%" }} />
                <div className="absolute inset-y-0 w-0.5 bg-brand-600/40" style={{ left: "50%" }} />
                <div className="absolute inset-y-0 w-0.5 bg-amber-600/40" style={{ left: "65%" }} />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>0%</span>
                <span>40%</span>
                <span>50%</span>
                <span>65%+</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="proptech-ruby-soft-panel p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            Cách ngân hàng thẩm định (sơ bộ)
          </p>
          <ul className="mt-2 space-y-1">
            {result.methodologyNotes.map((note) => (
              <li key={note} className="text-xs leading-relaxed text-slate-600">
                · {note}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid min-w-0 gap-3 sm:grid-cols-3">
          {result.scenarios.map((s) => {
            const meta = DTI_PROFILES[s.profile];
            return (
              <div
                key={s.profile}
                className={cn(
                  "rounded-2xl border p-4 transition-shadow",
                  PROFILE_ACCENT[s.profile],
                  s.profile === "STANDARD" && "ring-2 ring-brand-300 ring-offset-1",
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {s.label}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  DTI ≤ {Math.round(s.dtiCap * 100)}% · {BINDING_LABEL[s.bindingMethod]}
                </p>
                <p className="mt-3 text-xl font-extrabold text-slate-900">
                  {s.maxLoanAmount > 0 ? formatVnd(s.maxLoanAmount) : "—"}
                </p>
                <p className="text-xs text-slate-500">Hạn mức vay tối đa</p>
                {s.maxPropertyPrice > 0 ? (
                  <>
                    <p className="mt-2 text-sm font-bold text-brand-700">
                      Nhà ~{formatVnd(s.maxPropertyPrice)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Vốn tự có ≥ {formatVnd(s.requiredDownPayment)} · Trả ~{" "}
                      {groupVnd(s.maxMonthlyPayment)} đ/tháng
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      DTI cho phép ~{groupVnd(s.dtiBasedPayment)} đ · Sinh hoạt còn ~{" "}
                      {groupVnd(s.residualBasedPayment)} đ
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-xs text-red-600">
                    Không đủ dư khả năng trả nợ trong ngưỡng này
                  </p>
                )}
                <p className="mt-2 text-[10px] leading-snug text-slate-400">{meta.hint}</p>
              </div>
            );
          })}
        </div>

        {result.tips.length > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-sm font-bold text-slate-900">Gợi ý thực tế</p>
            <ul className="mt-3 space-y-2">
              {result.tips.map((tip) => (
                <li key={tip} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {result.creditAssessment.reasons.length > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-bold text-slate-900">Phân tích hồ sơ tín dụng (sơ bộ)</p>
            <ul className="mt-3 space-y-1.5">
              {result.creditAssessment.reasons.map((r) => (
                <li key={r} className="text-sm text-slate-600">
                  · {r}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 print:hidden">
          {standard.maxLoanAmount > 0 ? (
            <Link
              href="/cong-cu/tinh-khoan-vay"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              <Icon.Calculator className="h-4 w-4" />
              Tính lịch trả nợ chi tiết
            </Link>
          ) : null}
          <Link
            href="/tai-chinh#tu-van"
            className="inline-flex h-11 items-center rounded-xl border border-brand-200 px-5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            Nhận tư vấn vay
          </Link>
        </div>

        <p className="text-xs leading-relaxed text-slate-400">
          Kết quả mang tính tham khảo — mỗi ngân hàng có ma trận thẩm định riêng (thu nhập chấp
          nhận, CIC, nghề nghiệp, TSĐB). Chi phí sinh hoạt/đầu người là mức tham chiếu, không phải
          quy định NHNN cố định.
        </p>
      </div>
    </div>
  );
}
