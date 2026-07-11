/**
 * Snapshot wizard NOXH cho Admin Ops — lưu trong Lead.opsMeta.wizardSnapshot.
 * Chỉ hiển thị trên /admin/*; không expose qua API công khai.
 */

import type { NoxhEligibilityInput } from "@/lib/validation/noxh-lead";
import type { NoxhEvaluation } from "@/lib/finance/noxh-eligibility";
import type { CreditAssessment } from "@/lib/finance/credit-readiness";
import type {
  LeadClassification,
  LeadTier,
  PurchaseTimeframe,
} from "@/lib/finance/noxh-lead";
import {
  NOXH_OBJECT_GROUPS,
  type NoxhObjectGroupId,
} from "@/lib/finance/noxh-rules";
import type { BadDebtStatus } from "@/lib/finance/credit-readiness";

export const WIZARD_SNAPSHOT_VERSION = 1 as const;

const OBJECT_K_CODE: Partial<Record<NoxhObjectGroupId, string>> = {
  MERIT: "K1",
  POOR_RURAL: "K2–K3",
  POOR_URBAN: "K4",
  LOW_INCOME_URBAN: "K5",
  WORKER: "K6",
  ARMED_FORCES: "K7",
  CIVIL_SERVANT: "K8",
  RETURNED_OFFICIAL_HOUSING: "K9",
  LAND_RECOVERED: "K10",
};

const TIER_LABELS: Record<LeadTier, { vi: string; en: string }> = {
  HOT: { vi: "Ưu tiên cao — gọi/tư vấn ngay", en: "HOT — call now" },
  WARM: {
    vi: "Tiềm năng — nurture + chuyên gia nếu cần",
    en: "WARM — nurture + expert if needed",
  },
  COLD: { vi: "Nurture dài hạn", en: "COLD — long nurture" },
  OUT: { vi: "Ngoài phạm vi NOXH", en: "OUT — not NOXH scope" },
};

const OVERALL_LABELS = {
  ELIGIBLE: { vi: "Đủ điều kiện sơ bộ", en: "Eligible (preliminary)" },
  CONDITIONAL: { vi: "Cần bổ sung thông tin", en: "Conditional" },
  NOT_ELIGIBLE: { vi: "Chưa đủ điều kiện NOXH", en: "Not eligible" },
} as const;

const STATUS_LABELS = {
  PASS: { vi: "Đạt", en: "Pass" },
  FAIL: { vi: "Chưa đạt", en: "Fail" },
  CONDITIONAL: { vi: "Cần bổ sung", en: "Conditional" },
  UNKNOWN: { vi: "Chưa rõ", en: "Unknown" },
} as const;

const MARITAL_LABELS = {
  SINGLE: { vi: "Độc thân", en: "Single" },
  SINGLE_WITH_MINOR: {
    vi: "Độc thân nuôi con nhỏ",
    en: "Single with minor child",
  },
  MARRIED: { vi: "Đã kết hôn", en: "Married" },
} as const;

const TIMEFRAME_LABELS: Record<
  PurchaseTimeframe,
  { vi: string; en: string }
> = {
  NOW: { vi: "Muốn mua ngay", en: "Buy now" },
  WITHIN_3M: { vi: "Trong 3 tháng", en: "Within 3 months" },
  WITHIN_6M_PLUS: { vi: "Sau 3–6 tháng trở lên", en: "6+ months" },
  UNSURE: { vi: "Chưa rõ thời điểm", en: "Unsure" },
};

const BAD_DEBT_LABELS: Record<BadDebtStatus, { vi: string; en: string }> = {
  NONE: { vi: "Không có nợ xấu nhóm 2+", en: "No group-2+ bad debt" },
  GROUP_2_PLUS: {
    vi: "Có nợ xấu nhóm 2+ (bản thân hoặc vợ/chồng)",
    en: "Group-2+ bad debt (self or spouse)",
  },
  UNKNOWN: { vi: "Chưa rõ / chưa kiểm tra CIC", en: "Unknown / CIC not checked" },
};

const CREDIT_FLAG_LABELS = {
  NOT_APPLICABLE: { vi: "Không vay NH", en: "Not borrowing" },
  CLEAN: { vi: "Tín dụng thuận lợi", en: "Clean credit" },
  CAUTION: { vi: "Cần lưu ý (DTI/thẻ/nợ)", en: "Caution" },
  BLOCKER: { vi: "Rào cản lớn (nợ xấu)", en: "Blocker" },
} as const;

const REASON_CODE_LABELS: Record<string, { vi: string; en: string }> = {
  object_mismatch: {
    vi: "Sai nhóm đối tượng NOXH",
    en: "Object group mismatch",
  },
  housing_fail: { vi: "Không đạt điều kiện nhà ở", en: "Housing fail" },
  income_over_ceiling: {
    vi: "Thu nhập vượt trần",
    en: "Income over ceiling",
  },
  income_near_ceiling: {
    vi: "Thu nhập sát trần",
    en: "Income near ceiling",
  },
  info_incomplete: { vi: "Thiếu thông tin", en: "Incomplete info" },
  credit_blocker: { vi: "Rào cản tín dụng", en: "Credit blocker" },
  credit_caution: { vi: "Tín dụng cần lưu ý", en: "Credit caution" },
  eligible_ready: { vi: "Đủ điều kiện + sẵn sàng", en: "Eligible & ready" },
  no_contact: { vi: "Chưa để liên hệ", en: "No contact" },
  timeframe_far: { vi: "Thời điểm mua xa", en: "Far timeframe" },
};

export type NoxhWizardSnapshot = {
  version: typeof WIZARD_SNAPSHOT_VERSION;
  capturedAt: string;
  rulesVersion: string;
  tier: LeadTier;
  tierLabelVi: string;
  tierLabelEn: string;
  reasonCodes: string[];
  reasonLabelsVi: string[];
  reasonLabelsEn: string[];
  recommendedAction: string;
  situation: {
    objectGroup: NoxhObjectGroupId;
    objectGroupLabel: string;
    objectGroupCode: string | null;
    maritalStatus: NoxhEligibilityInput["maritalStatus"];
    maritalStatusLabelVi: string;
    maritalStatusLabelEn: string;
    applicantMonthlyIncome: number;
    spouseMonthlyIncome: number | null;
    householdMonthlyIncome: number;
    ownsHomeInProvince: boolean;
    areaPerPersonSqm: number | null;
    everBenefitedHousingPolicy: boolean;
    intendToBorrow: boolean;
    existingMonthlyDebtPayment: number | null;
    creditCardLimitTotal: number | null;
    badDebtSelfOrSpouse: BadDebtStatus;
    badDebtLabelVi: string;
    badDebtLabelEn: string;
    timeframe: PurchaseTimeframe;
    timeframeLabelVi: string;
    timeframeLabelEn: string;
  };
  evaluation: {
    overall: NoxhEvaluation["overall"];
    overallLabelVi: string;
    overallLabelEn: string;
    objectStatus: NoxhEvaluation["object"]["status"];
    objectReason: string;
    housingStatus: NoxhEvaluation["housing"]["status"];
    housingReason: string;
    incomeStatus: NoxhEvaluation["income"]["status"];
    incomeReason: string;
    incomeCeiling: number | null;
    effectiveIncome: number;
    incomeNearCeiling: boolean;
    reasons: string[];
    nextSteps: string[];
    alternativeHints: string[];
  };
  credit: {
    applicable: boolean;
    flag: CreditAssessment["flag"];
    flagLabelVi: string;
    flagLabelEn: string;
    dti: number | null;
    dtiPercent: string | null;
    estimatedMonthlyObligation: number;
    reasons: string[];
    recommendation: string;
  };
  /** Một dòng cho danh sách Ops Leads. */
  listPreviewVi: string;
};

export function fmtVndFull(n: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(Math.round(n))} đ`;
}

export function fmtDtiPercent(dti: number | null): string | null {
  if (dti == null) return null;
  return `${Math.round(dti * 100)}%`;
}

function buildAlternativeHints(
  input: NoxhEligibilityInput,
  evaluation: NoxhEvaluation,
): string[] {
  const hints: string[] = [];
  const group = NOXH_OBJECT_GROUPS[input.objectGroup];

  if (input.objectGroup === "NONE") {
    hints.push(
      "Khách chọn «Không thuộc các nhóm trên» — vẫn có thể thuộc K1–K10 nếu chứng minh được (hộ nghèo, công nhân KCN, quân đội…). Xác minh giấy tờ đối tượng trước khi kết luận loại lead.",
    );
  }

  if (
    evaluation.income.status === "FAIL" &&
    group.eligibleForPurchase &&
    group.requiresIncome
  ) {
    hints.push(
      "Thu nhập vượt trần nhóm K5/K6/K8 — nếu khách thực tế thuộc nhóm miễn trần (K1–K4, K7, K9, K10), cần rà lại nhóm đối tượng và chuyển hồ sơ sang nhóm phù hợp thay vì loại ngay.",
    );
  }

  if (evaluation.housing.status === "FAIL") {
    hints.push(
      "Không đạt điều kiện nhà ở NOXH — vẫn có thể tư vấn nhà thương mại hoặc phương án khác; không loại lead chỉ vì mục nhà ở.",
    );
  }

  if (evaluation.object.status === "FAIL" && input.objectGroup !== "NONE") {
    hints.push(
      "Nhóm đối tượng khách chọn không hợp NOXH — kiểm tra xem có nhầm nhóm hoặc có thể chuyển sang nhóm khác sau khi có giấy tờ.",
    );
  }

  if (evaluation.overall === "CONDITIONAL") {
    hints.push(
      "Kết quả còn thiếu dữ liệu — ưu tiên bổ sung thông tin khách đã khai trước khi hỏi lại từ đầu.",
    );
  }

  return hints;
}

function buildListPreviewVi(
  tier: LeadTier,
  evaluation: NoxhEvaluation,
  input: NoxhEligibilityInput,
  householdIncome: number,
  credit: CreditAssessment,
): string {
  const group = NOXH_OBJECT_GROUPS[input.objectGroup];
  const parts = [
    TIER_LABELS[tier].vi,
    `${group.label}`,
    `TN hộ ${fmtVndFull(householdIncome)}/tháng`,
    OVERALL_LABELS[evaluation.overall].vi,
  ];
  if (credit.applicable && credit.dti != null) {
    parts.push(`DTI ~${fmtDtiPercent(credit.dti)}`);
  }
  return parts.join(" · ");
}

export function buildNoxhWizardSnapshot(input: {
  wizardInput: NoxhEligibilityInput;
  evaluation: NoxhEvaluation;
  credit: CreditAssessment;
  classification: LeadClassification;
  householdMonthlyIncome: number;
  capturedAt?: string;
}): NoxhWizardSnapshot {
  const i = input.wizardInput;
  const ev = input.evaluation;
  const cr = input.credit;
  const cl = input.classification;
  const group = NOXH_OBJECT_GROUPS[i.objectGroup];
  const marital = MARITAL_LABELS[i.maritalStatus];
  const timeframe = TIMEFRAME_LABELS[i.timeframe];
  const badDebt = BAD_DEBT_LABELS[i.badDebtSelfOrSpouse];
  const creditLabels = CREDIT_FLAG_LABELS[cr.flag];

  const reasonLabelsVi = cl.reasonCodes.map(
    (c) => REASON_CODE_LABELS[c]?.vi ?? c,
  );
  const reasonLabelsEn = cl.reasonCodes.map(
    (c) => REASON_CODE_LABELS[c]?.en ?? c,
  );

  const householdIncome = input.householdMonthlyIncome;

  return {
    version: WIZARD_SNAPSHOT_VERSION,
    capturedAt: input.capturedAt ?? new Date().toISOString(),
    rulesVersion: ev.rulesVersion,
    tier: cl.tier,
    tierLabelVi: TIER_LABELS[cl.tier].vi,
    tierLabelEn: TIER_LABELS[cl.tier].en,
    reasonCodes: cl.reasonCodes,
    reasonLabelsVi,
    reasonLabelsEn,
    recommendedAction: cl.recommendedAction,
    situation: {
      objectGroup: i.objectGroup,
      objectGroupLabel: group.label,
      objectGroupCode: OBJECT_K_CODE[i.objectGroup] ?? null,
      maritalStatus: i.maritalStatus,
      maritalStatusLabelVi: marital.vi,
      maritalStatusLabelEn: marital.en,
      applicantMonthlyIncome: i.applicantMonthlyIncome,
      spouseMonthlyIncome:
        i.maritalStatus === "MARRIED" ? (i.spouseMonthlyIncome ?? 0) : null,
      householdMonthlyIncome: householdIncome,
      ownsHomeInProvince: i.ownsHomeInProvince,
      areaPerPersonSqm: i.areaPerPersonSqm ?? null,
      everBenefitedHousingPolicy: i.everBenefitedHousingPolicy,
      intendToBorrow: i.intendToBorrow,
      existingMonthlyDebtPayment: i.existingMonthlyDebtPayment ?? null,
      creditCardLimitTotal: i.creditCardLimitTotal ?? null,
      badDebtSelfOrSpouse: i.badDebtSelfOrSpouse,
      badDebtLabelVi: badDebt.vi,
      badDebtLabelEn: badDebt.en,
      timeframe: i.timeframe,
      timeframeLabelVi: timeframe.vi,
      timeframeLabelEn: timeframe.en,
    },
    evaluation: {
      overall: ev.overall,
      overallLabelVi: OVERALL_LABELS[ev.overall].vi,
      overallLabelEn: OVERALL_LABELS[ev.overall].en,
      objectStatus: ev.object.status,
      objectReason: ev.object.reason,
      housingStatus: ev.housing.status,
      housingReason: ev.housing.reason,
      incomeStatus: ev.income.status,
      incomeReason: ev.income.reason,
      incomeCeiling: ev.income.ceiling,
      effectiveIncome: ev.income.effectiveIncome,
      incomeNearCeiling: ev.income.nearCeiling,
      reasons: ev.reasons,
      nextSteps: ev.nextSteps,
      alternativeHints: buildAlternativeHints(i, ev),
    },
    credit: {
      applicable: cr.applicable,
      flag: cr.flag,
      flagLabelVi: creditLabels.vi,
      flagLabelEn: creditLabels.en,
      dti: cr.dti,
      dtiPercent: fmtDtiPercent(cr.dti),
      estimatedMonthlyObligation: cr.estimatedMonthlyObligation,
      reasons: cr.reasons,
      recommendation: cr.recommendation,
    },
    listPreviewVi: buildListPreviewVi(cl.tier, ev, i, householdIncome, cr),
  };
}

export function readNoxhWizardSnapshot(
  meta: unknown,
): NoxhWizardSnapshot | null {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return null;
  const raw = (meta as Record<string, unknown>).wizardSnapshot;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const s = raw as Partial<NoxhWizardSnapshot>;
  if (s.version !== WIZARD_SNAPSHOT_VERSION) return null;
  if (typeof s.capturedAt !== "string" || typeof s.tier !== "string") {
    return null;
  }
  if (!s.situation || !s.evaluation || !s.credit) return null;
  return s as NoxhWizardSnapshot;
}

export function statusTone(
  status: keyof typeof STATUS_LABELS,
): "ok" | "warn" | "bad" | "muted" {
  if (status === "PASS") return "ok";
  if (status === "FAIL") return "bad";
  if (status === "CONDITIONAL" || status === "UNKNOWN") return "warn";
  return "muted";
}

export { STATUS_LABELS, TIER_LABELS, OVERALL_LABELS, REASON_CODE_LABELS };
