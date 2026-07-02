/**
 * Engine tính lãi vay mua nhà — thuần hàm, không phụ thuộc framework.
 *
 * Hỗ trợ 2 phương pháp phổ biến tại VN:
 *  - "DECLINING" (dư nợ giảm dần): gốc trả đều mỗi tháng, lãi tính trên dư nợ
 *    còn lại → tiền trả giảm dần. Đa số ngân hàng VN dùng.
 *  - "ANNUITY" (trả góp đều / EMI): tổng tiền trả hằng tháng cố định
 *    (PMT = P·r·(1+r)^n / ((1+r)^n − 1)); lãi cao đầu kỳ, gốc tăng dần.
 *
 * Tuỳ chọn nâng cao:
 *  - promoRate + promoMonths: lãi suất ưu đãi trong N tháng đầu.
 *  - graceMonths: ân hạn gốc — chỉ trả lãi, chưa trả gốc trong N tháng đầu.
 */

export type LoanMethod = "DECLINING" | "ANNUITY";

export interface LoanInput {
  /** Số tiền vay (VND). */
  principal: number;
  /** Lãi suất danh nghĩa %/năm (sau ưu đãi). */
  annualRate: number;
  /** Tổng số tháng vay. */
  months: number;
  method: LoanMethod;
  /** Lãi suất ưu đãi %/năm (tuỳ chọn). */
  promoRate?: number;
  /** Số tháng áp dụng lãi ưu đãi. */
  promoMonths?: number;
  /** Số tháng ân hạn gốc (chỉ trả lãi). */
  graceMonths?: number;
}

export interface AmortizationRow {
  month: number;
  /** Lãi suất tháng áp dụng (%/năm) cho dòng này. */
  annualRate: number;
  principalPaid: number;
  interestPaid: number;
  payment: number;
  balance: number;
}

export interface LoanResult {
  schedule: AmortizationRow[];
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  /** Khoản trả tháng đầu tiên có trả gốc (tham khảo). */
  firstPayment: number;
  /** Khoản trả lớn nhất trong kỳ. */
  maxPayment: number;
  /** Khoản trả trung bình. */
  avgPayment: number;
}

function rateForMonth(input: LoanInput, monthIndex: number): number {
  const promoMonths = input.promoMonths ?? 0;
  if (promoMonths > 0 && input.promoRate != null && monthIndex <= promoMonths) {
    return input.promoRate;
  }
  return input.annualRate;
}

function round(n: number): number {
  return Math.round(n);
}

/** Tính lịch trả nợ chi tiết theo tháng. */
export function calculateLoan(input: LoanInput): LoanResult {
  const { principal, months, method } = input;
  if (principal <= 0 || months <= 0) {
    return {
      schedule: [],
      totalPrincipal: 0,
      totalInterest: 0,
      totalPayment: 0,
      firstPayment: 0,
      maxPayment: 0,
      avgPayment: 0,
    };
  }

  const grace = Math.min(input.graceMonths ?? 0, months - 1);
  const amortizingMonths = months - grace;
  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let totalInterest = 0;
  let totalPrincipal = 0;

  // Gốc đều / tháng (dùng cho DECLINING).
  const flatPrincipal = principal / amortizingMonths;

  for (let m = 1; m <= months; m++) {
    const annualRate = rateForMonth(input, m);
    const monthlyRate = annualRate / 100 / 12;
    const interest = balance * monthlyRate;
    let principalPaid: number;

    const inGrace = m <= grace;

    if (inGrace) {
      principalPaid = 0;
    } else if (method === "DECLINING") {
      principalPaid = flatPrincipal;
    } else {
      // ANNUITY: PMT cố định cho phần còn lại tại thời điểm bắt đầu trả gốc.
      // Tính lại PMT dựa trên dư nợ và số kỳ còn lại + lãi suất hiện hành.
      const remaining = months - m + 1;
      const pmt =
        monthlyRate === 0
          ? balance / remaining
          : (balance * monthlyRate * Math.pow(1 + monthlyRate, remaining)) /
            (Math.pow(1 + monthlyRate, remaining) - 1);
      principalPaid = pmt - interest;
    }

    // Tháng cuối: dồn hết dư nợ còn lại (tránh sai số làm tròn).
    if (m === months) {
      principalPaid = balance;
    }
    principalPaid = Math.min(principalPaid, balance);

    const payment = principalPaid + interest;
    balance -= principalPaid;
    if (balance < 0.01) balance = 0;

    totalInterest += interest;
    totalPrincipal += principalPaid;

    schedule.push({
      month: m,
      annualRate,
      principalPaid: round(principalPaid),
      interestPaid: round(interest),
      payment: round(payment),
      balance: round(balance),
    });
  }

  const payments = schedule.map((r) => r.payment);
  const totalPayment = round(totalPrincipal + totalInterest);
  const amortizingPayments = schedule
    .filter((r) => r.principalPaid > 0)
    .map((r) => r.payment);

  return {
    schedule,
    totalPrincipal: round(totalPrincipal),
    totalInterest: round(totalInterest),
    totalPayment,
    firstPayment: amortizingPayments[0] ?? payments[0] ?? 0,
    maxPayment: payments.length ? Math.max(...payments) : 0,
    avgPayment: payments.length
      ? round(totalPayment / payments.length)
      : 0,
  };
}
