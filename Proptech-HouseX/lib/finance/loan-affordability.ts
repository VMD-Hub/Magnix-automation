/**
 * Engine ước tính hạn mức vay mua nhà theo thu nhập — thuần hàm.
 *
 * Mô phỏng hai lớp thẩm định phổ biến tại ngân hàng VN (lấy mức thấp hơn):
 *  1. DTI — tổng nghĩa vụ/thu nhập ≤ ngưỡng (~40–65%).
 *  2. Dòng tiền ròng — thu nhập − chi phí sinh hoạt tối thiểu/đầu người − nợ hiện tại.
 *
 * Bổ sung: hạn mức thẻ (~5%), đồng vay vợ/chồng, người phụ thuộc, CIC vợ/chồng.
 *
 * Đây là ước lượng sơ bộ — từng ngân hàng có ma trận thẩm định riêng.
 */

import {
  assessCreditReadiness,
  CREDIT_CARD_LIABILITY_RATE,
  DTI_SAFE,
  DTI_TIGHT,
  type BadDebtStatus,
  type CreditAssessment,
} from "@/lib/finance/credit-readiness";
import type { LoanMethod } from "@/lib/finance/loan";

export type DtiProfile = "CONSERVATIVE" | "STANDARD" | "MAXIMUM";

export type LivingCostRegion = "URBAN" | "PROVINCIAL" | "CUSTOM";

/** Phương pháp ràng buộc hạn mức trong kịch bản. */
export type BindingMethod = "DTI" | "RESIDUAL" | "EQUAL";

export const DTI_PROFILES: Record<
  DtiProfile,
  { label: string; ratio: number; hint: string }
> = {
  CONSERVATIVE: {
    label: "An toàn",
    ratio: 0.4,
    hint: "Dự phòng chi tiêu sinh hoạt — phù hợp gia đình có con nhỏ hoặc thu nhập biến động.",
  },
  STANDARD: {
    label: "Tiêu chuẩn ngân hàng",
    ratio: DTI_SAFE,
    hint: "Ngưỡng phổ biến theo Thông tư 39/2016/NHNN và quy định nội bộ đa số ngân hàng.",
  },
  MAXIMUM: {
    label: "Tối đa",
    ratio: 0.65,
    hint: "Cần hồ sơ mạnh (thu nhập ổn định, TSĐB tốt). Một số ngân hàng chấp nhận đến ~70%.",
  },
};

/**
 * Chi phí sinh hoạt tối thiểu/đầu người/tháng — tham chiếu thực tế thẩm định nội bộ NH.
 * Không có một con số quốc gia cố định; đây là mức phổ biến để ước lượng dòng tiền ròng.
 */
export const LIVING_COST_PRESETS: Record<
  LivingCostRegion,
  { label: string; perCapita: number; hint: string }
> = {
  URBAN: {
    label: "TP.HCM / Hà Nội",
    perCapita: 4_500_000,
    hint: "Mức tham chiếu đô thị lớn — ngân hàng thường dự phòng cao hơn cho hộ nhiều thành viên.",
  },
  PROVINCIAL: {
    label: "Tỉnh / thành phố khác",
    perCapita: 3_500_000,
    hint: "Phù hợp khu vực chi phí sinh hoạt thấp hơn TP.HCM, Hà Nội.",
  },
  CUSTOM: {
    label: "Tùy chỉnh",
    perCapita: 0,
    hint: "Nhập mức chi phí/đầu người theo tư vấn ngân hàng hoặc thực tế hộ bạn.",
  },
};

export interface AffordabilityInput {
  /** Thu nhập/tháng người vay chính — VND. */
  householdMonthlyIncome: number;
  /** Trả nợ hiện tại/tháng (người vay chính) — VND. */
  existingMonthlyDebtPayment?: number;
  /** Hạn mức thẻ tín dụng (người vay chính) — VND. */
  creditCardLimitTotal?: number;
  annualRate: number;
  years: number;
  method: LoanMethod;
  ltvPct?: number;
  /** @deprecated Dùng applicantBadDebt + spouseBadDebt */
  badDebtSelfOrSpouse?: BadDebtStatus;
  /** Nợ xấu nhóm 2+ của người vay chính. */
  applicantBadDebt?: BadDebtStatus;
  /** Nợ xấu nhóm 2+ của vợ/chồng (ngân hàng tra CIC hôn phố). */
  spouseBadDebt?: BadDebtStatus;
  /** Đã kết hôn — vợ/chồng được tính vào chi phí sinh hoạt hộ; CIC vợ/chồng được xét. */
  isMarried?: boolean;
  /** Vợ/chồng đồng vay — cộng thu nhập & nghĩa vụ vào hồ sơ. */
  coBorrower?: {
    monthlyIncome: number;
    existingMonthlyDebtPayment?: number;
    creditCardLimitTotal?: number;
  };
  /** Con chưa thu nhập / thành niên phụ thuộc (ở cùng, chưa chứng minh thu nhập). */
  dependentChildren?: number;
  /** Cha mẹ phụ thuộc không thu nhập. */
  dependentElderly?: number;
  /** Khu vực sinh hoạt — chọn mức chi phí/đầu người. */
  livingCostRegion?: LivingCostRegion;
  /** Chi phí/đầu người tùy chỉnh (khi region = CUSTOM). */
  customLivingCostPerCapita?: number;
}

export interface AffordabilityScenario {
  profile: DtiProfile;
  label: string;
  dtiCap: number;
  maxMonthlyPayment: number;
  maxLoanAmount: number;
  maxPropertyPrice: number;
  requiredDownPayment: number;
  estimatedDtiAfterLoan: number | null;
  /** Khoản trả theo công thức DTI thuần. */
  dtiBasedPayment: number;
  /** Khoản trả theo dòng tiền ròng (sau chi phí sinh hoạt). */
  residualBasedPayment: number;
  bindingMethod: BindingMethod;
}

export interface AffordabilityResult {
  primaryIncome: number;
  coBorrowerIncome: number;
  totalIncome: number;
  existingDebt: number;
  cardObligation: number;
  totalCurrentObligation: number;
  currentDti: number | null;
  livingCostReserve: number;
  livingCostPerCapita: number;
  householdMemberCount: number;
  dependentCount: number;
  ltvPct: number;
  scenarios: AffordabilityScenario[];
  creditAssessment: CreditAssessment;
  tips: string[];
  referenceFirstPayment: number;
  methodologyNotes: string[];
}

function round(n: number): number {
  return Math.round(n);
}

export function cardMonthlyObligation(cardLimit: number): number {
  return round(Math.max(0, cardLimit) * CREDIT_CARD_LIABILITY_RATE);
}

/** Khoản trả tối đa theo DTI = thu nhập × DTI cap − nghĩa vụ hiện tại. */
export function maxNewLoanPaymentByDti(
  income: number,
  dtiCap: number,
  existingDebt: number,
  cardObligation: number,
): number {
  const cap = Math.max(0, income) * dtiCap;
  return Math.max(0, cap - existingDebt - cardObligation);
}

/** Khoản trả tối đa theo dòng tiền ròng = thu nhập − chi phí sinh hoạt − nghĩa vụ. */
export function maxNewLoanPaymentByResidual(
  income: number,
  livingCostReserve: number,
  existingDebt: number,
  cardObligation: number,
): number {
  return Math.max(0, income - livingCostReserve - existingDebt - cardObligation);
}

/** @deprecated Alias DTI thuần — giữ cho test cũ. */
export function maxNewLoanPayment(
  income: number,
  dtiCap: number,
  existingDebt: number,
  cardObligation: number,
): number {
  return maxNewLoanPaymentByDti(income, dtiCap, existingDebt, cardObligation);
}

/**
 * Chi phí sinh hoạt tối thiểu dự phòng/tháng.
 * Đếm: người vay (+ vợ/chồng đồng vay nếu có) + người phụ thuộc.
 */
export function householdLivingCost(params: {
  perCapita: number;
  borrowerHeadcount: number;
  dependentChildren: number;
  dependentElderly: number;
}): { reserve: number; memberCount: number; dependentCount: number } {
  const perCapita = Math.max(0, params.perCapita);
  const borrowers = Math.max(1, params.borrowerHeadcount);
  const dependents =
    Math.max(0, params.dependentChildren) + Math.max(0, params.dependentElderly);
  const memberCount = borrowers + dependents;
  return {
    reserve: round(memberCount * perCapita),
    memberCount,
    dependentCount: dependents,
  };
}

export function resolveLivingCostPerCapita(input: AffordabilityInput): number {
  const region = input.livingCostRegion ?? "URBAN";
  if (region === "CUSTOM") {
    return Math.max(0, input.customLivingCostPerCapita ?? 4_000_000);
  }
  return LIVING_COST_PRESETS[region].perCapita;
}

export function combineBadDebtStatus(
  applicant: BadDebtStatus,
  spouse: BadDebtStatus,
): BadDebtStatus {
  if (applicant === "GROUP_2_PLUS" || spouse === "GROUP_2_PLUS") return "GROUP_2_PLUS";
  if (applicant === "UNKNOWN" || spouse === "UNKNOWN") return "UNKNOWN";
  return "NONE";
}

export function principalFromFirstPayment(
  monthlyPayment: number,
  annualRate: number,
  months: number,
  method: LoanMethod,
): number {
  if (monthlyPayment <= 0 || months <= 0) return 0;

  const r = annualRate / 100 / 12;

  if (method === "DECLINING") {
    const factor = 1 / months + r;
    return factor > 0 ? round(monthlyPayment / factor) : 0;
  }

  if (r === 0) return round(monthlyPayment * months);
  const pow = Math.pow(1 + r, months);
  const factor = (r * pow) / (pow - 1);
  return factor > 0 ? round(monthlyPayment / factor) : 0;
}

export function propertyFromLoan(
  loanAmount: number,
  ltvPct: number,
): { maxPropertyPrice: number; requiredDownPayment: number } {
  const ltv = Math.min(Math.max(ltvPct, 1), 95) / 100;
  if (loanAmount <= 0) return { maxPropertyPrice: 0, requiredDownPayment: 0 };
  const maxPropertyPrice = round(loanAmount / ltv);
  return {
    maxPropertyPrice,
    requiredDownPayment: maxPropertyPrice - loanAmount,
  };
}

function resolveBindingMethod(dtiPay: number, residualPay: number): BindingMethod {
  if (dtiPay === residualPay) return "EQUAL";
  return residualPay < dtiPay ? "RESIDUAL" : "DTI";
}

function formatCompactVnd(n: number): string {
  if (n >= 1_000_000_000) {
    return `${(n / 1_000_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} tỷ`;
  }
  return `${(n / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 0 })} triệu`;
}

function buildMethodologyNotes(
  livingCost: number,
  memberCount: number,
  perCapita: number,
  coBorrowerIncome: number,
): string[] {
  const notes: string[] = [
    "Ngân hàng thường áp dụng đồng thời DTI và dòng tiền ròng — lấy mức thấp hơn làm hạn mức thực tế.",
    `Chi phí sinh hoạt dự phòng: ${formatCompactVnd(livingCost)}/tháng (${memberCount} thành viên × ${formatCompactVnd(perCapita)}).`,
  ];
  if (coBorrowerIncome > 0) {
    notes.push(
      "Thu nhập vợ/chồng đồng vay được cộng vào tổng thu nhập; nghĩa vụ nợ và CIC của người đồng vay cũng được xét.",
    );
  }
  notes.push(
    "Vợ/chồng đã kết hôn thường bị tra CIC dù không đứng tên đồng vay — nợ xấu nhóm 2+ của một bên có thể ảnh hưởng hồ sơ chung.",
  );
  return notes;
}

function buildTips(
  input: AffordabilityInput,
  currentDti: number | null,
  credit: CreditAssessment,
  standardScenario: AffordabilityScenario | undefined,
  livingCost: number,
  dependentCount: number,
  coBorrowerIncome: number,
): string[] {
  const tips: string[] = [];

  if (credit.flag === "BLOCKER") {
    tips.push(
      "Ưu tiên xử lý nợ xấu nhóm 2 trở lên (tra CIC cả vợ/chồng) trước khi nộp hồ sơ.",
    );
  }

  if (dependentCount >= 2) {
    tips.push(
      `Hộ có ${dependentCount} người phụ thuộc — ngân hàng dự phòng ~${formatCompactVnd(livingCost)} chi phí sinh hoạt/tháng, làm hạn mức thấp hơn so với hộ ít thành viên.`,
    );
  }

  if (coBorrowerIncome <= 0 && dependentCount > 0) {
    tips.push(
      "Cân nhắc vợ/chồng làm người đồng vay nếu có thu nhập chứng minh được — giúp tăng tổng thu nhập xét duyệt.",
    );
  }

  if (standardScenario?.bindingMethod === "RESIDUAL") {
    tips.push(
      "Hạn mức đang bị giới hạn bởi chi phí sinh hoạt hộ gia đình, không phải ngưỡng DTI — giảm người phụ thuộc trên giấy tờ (nếu không còn phụ thuộc thực tế) hoặc tăng thu nhập chứng minh.",
    );
  }

  if (currentDti != null && currentDti > DTI_TIGHT) {
    tips.push("DTI hiện tại đã vượt ~70% — nên giảm nợ hoặc tăng thu nhập chứng minh.");
  } else if (currentDti != null && currentDti > DTI_SAFE) {
    tips.push("DTI hiện tại trên 50% — hạn mức vay mới sẽ bị thu hẹp đáng kể.");
  }

  const cardLimit = Math.max(0, input.creditCardLimitTotal || 0);
  const coCard = Math.max(0, input.coBorrower?.creditCardLimitTotal || 0);
  if (cardLimit + coCard >= 100_000_000) {
    tips.push("Hạn mức thẻ lớn (cả hai vợ chồng) làm giảm hạn mức vay — cân nhắc hạ hạn mức trước khi nộp hồ sơ.");
  }

  if (standardScenario && standardScenario.maxLoanAmount > 0) {
    tips.push(
      `Ở mức tiêu chuẩn, hạn mức sơ bộ ~${formatCompactVnd(standardScenario.maxLoanAmount)} — nhà ~${formatCompactVnd(standardScenario.maxPropertyPrice)} (LTV ${input.ltvPct ?? 70}%).`,
    );
    tips.push("Dùng công cụ Tính khoản vay để xem lịch trả nợ chi tiết theo lãi suất thực tế.");
  } else if (standardScenario?.maxLoanAmount === 0) {
    tips.push(
      "Không còn dư khả năng trả nợ sau chi phí sinh hoạt và nghĩa vụ hiện tại — cần giảm nợ, tăng thu nhập hoặc bổ sung đồng vay.",
    );
  }

  if ((input.ltvPct ?? 70) <= 70) {
    tips.push("NOXH thường giới hạn vay tối đa 70% giá căn — chuẩn bị vốn tự có từ 30%.");
  }

  return tips;
}

export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const primaryIncome = Math.max(0, input.householdMonthlyIncome || 0);
  const coBorrowerIncome = Math.max(0, input.coBorrower?.monthlyIncome || 0);
  const totalIncome = primaryIncome + coBorrowerIncome;

  const existingDebt =
    Math.max(0, input.existingMonthlyDebtPayment || 0) +
    Math.max(0, input.coBorrower?.existingMonthlyDebtPayment || 0);

  const cardObligation =
    cardMonthlyObligation(input.creditCardLimitTotal || 0) +
    cardMonthlyObligation(input.coBorrower?.creditCardLimitTotal || 0);

  const totalCurrentObligation = existingDebt + cardObligation;
  const currentDti = totalIncome > 0 ? totalCurrentObligation / totalIncome : null;

  const perCapita = resolveLivingCostPerCapita(input);
  const isMarried = input.isMarried ?? false;
  const householdHeadcount = 1 + (isMarried ? 1 : 0);

  const { reserve: livingCostReserve, memberCount, dependentCount } = householdLivingCost({
    perCapita,
    borrowerHeadcount: householdHeadcount,
    dependentChildren: input.dependentChildren ?? 0,
    dependentElderly: input.dependentElderly ?? 0,
  });

  const months = Math.max(1, Math.round(input.years * 12));
  const ltvPct = input.ltvPct ?? 70;

  const applicantBad =
    input.applicantBadDebt ?? input.badDebtSelfOrSpouse ?? "NONE";
  const spouseBad = input.spouseBadDebt ?? "NONE";
  const combinedBadDebt = combineBadDebtStatus(applicantBad, spouseBad);

  const scenarios: AffordabilityScenario[] = (
    Object.entries(DTI_PROFILES) as [DtiProfile, (typeof DTI_PROFILES)[DtiProfile]][]
  ).map(([profile, meta]) => {
    const dtiBasedPayment = maxNewLoanPaymentByDti(
      totalIncome,
      meta.ratio,
      existingDebt,
      cardObligation,
    );
    const residualBasedPayment = maxNewLoanPaymentByResidual(
      totalIncome,
      livingCostReserve,
      existingDebt,
      cardObligation,
    );
    const maxMonthlyPayment = Math.min(dtiBasedPayment, residualBasedPayment);
    const bindingMethod = resolveBindingMethod(dtiBasedPayment, residualBasedPayment);

    const maxLoanAmount = principalFromFirstPayment(
      maxMonthlyPayment,
      input.annualRate,
      months,
      input.method,
    );
    const { maxPropertyPrice, requiredDownPayment } = propertyFromLoan(maxLoanAmount, ltvPct);
    const estimatedDtiAfterLoan =
      totalIncome > 0
        ? (totalCurrentObligation + maxMonthlyPayment) / totalIncome
        : null;

    return {
      profile,
      label: meta.label,
      dtiCap: meta.ratio,
      maxMonthlyPayment: round(maxMonthlyPayment),
      maxLoanAmount,
      maxPropertyPrice,
      requiredDownPayment,
      estimatedDtiAfterLoan,
      dtiBasedPayment: round(dtiBasedPayment),
      residualBasedPayment: round(residualBasedPayment),
      bindingMethod,
    };
  });

  const standardScenario = scenarios.find((s) => s.profile === "STANDARD");

  const creditAssessment = assessCreditReadiness({
    intendToBorrow: true,
    householdMonthlyIncome: totalIncome,
    existingMonthlyDebtPayment: existingDebt,
    creditCardLimitTotal:
      (input.creditCardLimitTotal || 0) + (input.coBorrower?.creditCardLimitTotal || 0),
    badDebtSelfOrSpouse: combinedBadDebt,
    expectedNewLoanPayment: standardScenario?.maxMonthlyPayment ?? 0,
  });

  if (combinedBadDebt === "GROUP_2_PLUS") {
    for (const s of scenarios) {
      s.maxLoanAmount = 0;
      s.maxMonthlyPayment = 0;
      s.maxPropertyPrice = 0;
      s.requiredDownPayment = 0;
    }
  }

  const methodologyNotes = buildMethodologyNotes(
    livingCostReserve,
    memberCount,
    perCapita,
    coBorrowerIncome,
  );

  const tips = buildTips(
    input,
    currentDti,
    creditAssessment,
    standardScenario,
    livingCostReserve,
    dependentCount,
    coBorrowerIncome,
  );

  return {
    primaryIncome,
    coBorrowerIncome,
    totalIncome,
    existingDebt,
    cardObligation,
    totalCurrentObligation,
    currentDti,
    livingCostReserve,
    livingCostPerCapita: perCapita,
    householdMemberCount: memberCount,
    dependentCount,
    ltvPct,
    scenarios,
    creditAssessment,
    tips,
    referenceFirstPayment: standardScenario?.maxMonthlyPayment ?? 0,
    methodologyNotes,
  };
}
