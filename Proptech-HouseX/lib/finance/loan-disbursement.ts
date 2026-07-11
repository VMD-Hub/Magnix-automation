/**
 * Lịch thanh toán CĐT + giải ngân NH theo đợt — engine thuần hàm.
 *
 * Spec v1 (2026-07):
 * - % mỗi đợt: từng kỳ (không tích lũy).
 * - TIME / CONSTRUCTION: tự tách vốn tự có / NH theo trần equity (100% − loanPct).
 * - PARALLEL: KH nhập % trả + % NH từng dòng (theo công bố CĐT).
 * - Trần NH: tổng giải ngân ≤ loanPct — cắt đợt cuối nếu vượt.
 * - Lãi chỉ trên dư nợ đã giải ngân; trước giải ngân đầu dư nợ = 0.
 * - Ân hạn / lãi ưu đãi: tính từ tháng giải ngân NH đầu tiên.
 */

import type { LoanMethod } from "@/lib/finance/loan";

export type PaymentScheduleMode = "TIME" | "CONSTRUCTION" | "PARALLEL";

export type MilestoneInput = {
  id: string;
  /** Tháng sau ký HĐMB (0 = ký HĐMB). */
  month: number;
  /** Mốc tiến độ (CONSTRUCTION) — vd. tầng 10, cất nóc. */
  label?: string;
  /** % giá căn phải trả CĐT trong kỳ này (từng đợt). */
  installmentPct: number;
  /** PARALLEL: % vốn tự có KH trả trong kỳ. */
  customerPct?: number;
  /** PARALLEL: % NH giải ngân trong kỳ. */
  bankPct?: number;
};

export type DisbursementPlanInput = {
  propertyPrice: number;
  loanPct: number;
  loanMonths: number;
  annualRate: number;
  method: LoanMethod;
  promoRate?: number;
  promoMonths?: number;
  graceMonths?: number;
  mode: PaymentScheduleMode;
  milestones: MilestoneInput[];
};

export type ResolvedMilestone = {
  month: number;
  label?: string;
  installmentPct: number;
  customerPct: number;
  bankPct: number;
  customerVnd: number;
  bankVnd: number;
  installmentVnd: number;
  /** Cảnh báo nếu bị cắt do trần vay. */
  bankTrimmed?: boolean;
};

export type UnifiedScheduleRow = {
  /** Tháng sau ký HĐMB. */
  month: number;
  milestoneLabel?: string;
  /** KH trả CĐT trong tháng. */
  customerToDeveloper: number;
  /** NH giải ngân thêm trong tháng. */
  bankDisbursement: number;
  /** Dư nợ NH cuối tháng. */
  loanBalance: number;
  annualRate: number;
  interestPaid: number;
  principalPaid: number;
  bankPayment: number;
  /** KH trả CĐT + trả NH. */
  totalCashOut: number;
};

export type DisbursementPlanResult = {
  milestones: ResolvedMilestone[];
  schedule: UnifiedScheduleRow[];
  totalCustomerToDeveloper: number;
  totalBankDisbursed: number;
  totalInterest: number;
  totalBankPayment: number;
  totalCashOut: number;
  firstBankPaymentMonth: number | null;
  maxMonthlyCashOut: number;
  bankCapPct: number;
  bankCapExceeded: boolean;
};

function round(n: number): number {
  return Math.round(n);
}

function rateForLoanMonth(
  input: DisbursementPlanInput,
  loanMonthIndex: number,
): number {
  const promoMonths = input.promoMonths ?? 0;
  if (
    promoMonths > 0 &&
    input.promoRate != null &&
    loanMonthIndex <= promoMonths
  ) {
    return input.promoRate;
  }
  return input.annualRate;
}

/** Phân bổ KH/NH và cắt trần vay. */
export function resolveMilestones(
  input: DisbursementPlanInput,
): ResolvedMilestone[] {
  const { propertyPrice, loanPct, mode, milestones } = input;
  const equityCapPct = Math.max(0, 100 - loanPct);
  let cumulativeCustomerPct = 0;
  const resolved: ResolvedMilestone[] = [];

  for (const m of milestones) {
    if (mode === "PARALLEL") {
      const customerPct = Math.max(0, m.customerPct ?? 0);
      const bankPct = Math.max(0, m.bankPct ?? 0);
      const parallelInstallment = customerPct + bankPct;
      resolved.push({
        month: Math.max(0, m.month),
        label: m.label?.trim() || undefined,
        installmentPct: parallelInstallment,
        customerPct,
        bankPct,
        customerVnd: round((propertyPrice * customerPct) / 100),
        bankVnd: round((propertyPrice * bankPct) / 100),
        installmentVnd: round((propertyPrice * parallelInstallment) / 100),
      });
      continue;
    }

    const installmentPct = Math.max(0, m.installmentPct);
    let customerPct: number;
    let bankPct: number;

    {
      const equityLeft = Math.max(0, equityCapPct - cumulativeCustomerPct);
      customerPct = Math.min(installmentPct, equityLeft);
      bankPct = Math.max(0, installmentPct - customerPct);
      cumulativeCustomerPct += customerPct;
    }

    resolved.push({
      month: Math.max(0, m.month),
      label: m.label?.trim() || undefined,
      installmentPct,
      customerPct,
      bankPct,
      customerVnd: round((propertyPrice * customerPct) / 100),
      bankVnd: round((propertyPrice * bankPct) / 100),
      installmentVnd: round((propertyPrice * installmentPct) / 100),
    });
  }

  return capBankDisbursements(resolved, propertyPrice, loanPct);
}

/** Cắt giải ngân đợt cuối nếu vượt trần loanPct. */
function capBankDisbursements(
  rows: ResolvedMilestone[],
  propertyPrice: number,
  loanPct: number,
): ResolvedMilestone[] {
  const capVnd = round((propertyPrice * loanPct) / 100);
  let totalBank = rows.reduce((s, r) => s + r.bankVnd, 0);
  if (totalBank <= capVnd) return rows;

  const out = rows.map((r) => ({ ...r }));
  for (let i = out.length - 1; i >= 0 && totalBank > capVnd; i--) {
    const excess = totalBank - capVnd;
    const cut = Math.min(out[i].bankVnd, excess);
    if (cut <= 0) continue;
    out[i] = {
      ...out[i],
      bankVnd: out[i].bankVnd - cut,
      bankPct: round(((out[i].bankVnd - cut) / propertyPrice) * 100 * 1000) / 1000,
      bankTrimmed: true,
    };
    totalBank -= cut;
  }
  return out;
}

export function calculateDisbursementPlan(
  input: DisbursementPlanInput,
): DisbursementPlanResult {
  const milestones = resolveMilestones(input);
  const totalBankPlanned = milestones.reduce((s, m) => s + m.bankVnd, 0);
  const capVnd = round((input.propertyPrice * input.loanPct) / 100);
  const bankCapExceeded = totalBankPlanned > capVnd;

  const eventsByMonth = new Map<number, ResolvedMilestone[]>();
  for (const m of milestones) {
    const list = eventsByMonth.get(m.month) ?? [];
    list.push(m);
    eventsByMonth.set(m.month, list);
  }

  const lastMilestoneMonth = milestones.reduce(
    (max, m) => Math.max(max, m.month),
    0,
  );

  let firstDisbursementMonth: number | null = null;
  for (const m of milestones) {
    if (m.bankVnd > 0) {
      firstDisbursementMonth =
        firstDisbursementMonth == null
          ? m.month
          : Math.min(firstDisbursementMonth, m.month);
    }
  }

  if (firstDisbursementMonth == null) {
    const schedule: UnifiedScheduleRow[] = [];
    for (const [month, events] of [...eventsByMonth.entries()].sort(
      (a, b) => a[0] - b[0],
    )) {
      const customerToDeveloper = events.reduce((s, e) => s + e.customerVnd, 0);
      schedule.push({
        month,
        milestoneLabel: events.map((e) => e.label).filter(Boolean).join(" · "),
        customerToDeveloper,
        bankDisbursement: 0,
        loanBalance: 0,
        annualRate: 0,
        interestPaid: 0,
        principalPaid: 0,
        bankPayment: 0,
        totalCashOut: customerToDeveloper,
      });
    }
    const totalCustomer = milestones.reduce((s, m) => s + m.customerVnd, 0);
    const maxCash = schedule.reduce((m, r) => Math.max(m, r.totalCashOut), 0);
    return {
      milestones,
      schedule,
      totalCustomerToDeveloper: totalCustomer,
      totalBankDisbursed: 0,
      totalInterest: 0,
      totalBankPayment: 0,
      totalCashOut: totalCustomer,
      firstBankPaymentMonth: null,
      maxMonthlyCashOut: maxCash,
      bankCapPct: input.loanPct,
      bankCapExceeded,
    };
  }

  const horizon = Math.max(
    lastMilestoneMonth,
    firstDisbursementMonth + input.loanMonths,
  );

  const schedule: UnifiedScheduleRow[] = [];
  let balance = 0;
  let loanMonthIndex = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalCustomer = 0;
  let totalBankDisbursed = 0;
  const grace = Math.min(input.graceMonths ?? 0, input.loanMonths - 1);

  for (let month = 0; month <= horizon; month++) {
    const events = eventsByMonth.get(month) ?? [];
    let customerToDeveloper = events.reduce((s, e) => s + e.customerVnd, 0);
    let bankDisbursement = events.reduce((s, e) => s + e.bankVnd, 0);
    const milestoneLabel = events
      .map((e) => e.label)
      .filter(Boolean)
      .join(" · ");

    if (bankDisbursement > 0) {
      balance += bankDisbursement;
      totalBankDisbursed += bankDisbursement;
    }
    totalCustomer += customerToDeveloper;

    let interestPaid = 0;
    let principalPaid = 0;
    let bankPayment = 0;
    let annualRate = 0;

    if (month >= firstDisbursementMonth && balance > 0.01) {
      loanMonthIndex++;
      annualRate = rateForLoanMonth(input, loanMonthIndex);
      const monthlyRate = annualRate / 100 / 12;
      interestPaid = balance * monthlyRate;

      const inGrace = loanMonthIndex <= grace;
      const isLastLoanMonth =
        loanMonthIndex >= input.loanMonths ||
        month >= firstDisbursementMonth + input.loanMonths;

      if (!inGrace) {
        const amortizingMonthsLeft =
          input.loanMonths - loanMonthIndex + 1;
        if (input.method === "DECLINING") {
          principalPaid =
            amortizingMonthsLeft > 0
              ? balance / amortizingMonthsLeft
              : balance;
        } else {
          const remaining = Math.max(1, amortizingMonthsLeft);
          const pmt =
            monthlyRate === 0
              ? balance / remaining
              : (balance * monthlyRate * Math.pow(1 + monthlyRate, remaining)) /
                (Math.pow(1 + monthlyRate, remaining) - 1);
          principalPaid = pmt - interestPaid;
        }
      }

      if (isLastLoanMonth) {
        principalPaid = balance;
      }
      principalPaid = Math.min(Math.max(0, principalPaid), balance);

      bankPayment = interestPaid + principalPaid;
      balance -= principalPaid;
      if (balance < 0.01) balance = 0;

      totalInterest += interestPaid;
      totalPrincipal += principalPaid;
    }

    const hasActivity =
      customerToDeveloper > 0 ||
      bankDisbursement > 0 ||
      bankPayment > 0.01;

    if (!hasActivity) continue;

    schedule.push({
      month,
      milestoneLabel: milestoneLabel || undefined,
      customerToDeveloper: round(customerToDeveloper),
      bankDisbursement: round(bankDisbursement),
      loanBalance: round(balance),
      annualRate: round(annualRate * 1000) / 1000,
      interestPaid: round(interestPaid),
      principalPaid: round(principalPaid),
      bankPayment: round(bankPayment),
      totalCashOut: round(customerToDeveloper + bankPayment),
    });

    if (balance <= 0 && month > lastMilestoneMonth) break;
  }

  const totalBankPayment = round(totalInterest + totalPrincipal);
  const totalCashOut = round(totalCustomer + totalBankPayment);
  const maxMonthlyCashOut = schedule.reduce(
    (m, r) => Math.max(m, r.totalCashOut),
    0,
  );

  const firstPaymentRow = schedule.find((r) => r.bankPayment > 0);

  return {
    milestones,
    schedule,
    totalCustomerToDeveloper: round(totalCustomer),
    totalBankDisbursed: round(totalBankDisbursed),
    totalInterest: round(totalInterest),
    totalBankPayment,
    totalCashOut,
    firstBankPaymentMonth: firstPaymentRow?.month ?? null,
    maxMonthlyCashOut,
    bankCapPct: input.loanPct,
    bankCapExceeded,
  };
}

export function newMilestoneId(): string {
  return `ms-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createDefaultMilestones(
  mode: PaymentScheduleMode,
): MilestoneInput[] {
  const base = {
    id: newMilestoneId(),
    month: 0,
    installmentPct: 10,
    label: mode === "CONSTRUCTION" ? "Ký HĐMB" : undefined,
  };
  if (mode === "PARALLEL") {
    return [{ ...base, customerPct: 10, bankPct: 0 }];
  }
  return [base];
}
