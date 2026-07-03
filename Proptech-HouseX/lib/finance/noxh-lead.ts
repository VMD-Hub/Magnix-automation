/**
 * Phân loại & định tuyến lead từ công cụ "Kiểm tra điều kiện mua NOXH".
 *
 * Kết hợp 3 nguồn tín hiệu:
 *  - Kết quả điều kiện NOXH (đối tượng/nhà ở/thu nhập).
 *  - Kết quả sàng lọc tín dụng/khả năng vay.
 *  - Tín hiệu ý định (mốc thời gian mua, có để lại liên hệ).
 *
 * Mục tiêu: giúp House X KHÔNG phí thời gian tư vấn sai đối tượng / người lướt
 * xem, và ưu tiên chuyển chuyên gia cho hồ sơ đắt giá nhất (đủ điều kiện nhưng
 * vướng tín dụng, hoặc đủ điều kiện + sẵn sàng mua).
 *
 * toLeadSummary() tạo bản tóm tắt KHÔNG chứa PII (không thu nhập tuyệt đối,
 * không nợ xấu chi tiết) để lưu Postgres; chi tiết đầy đủ forward n8n.
 */

import type { NoxhEvaluation } from "./noxh-eligibility";
import type { CreditAssessment, CreditFlag } from "./credit-readiness";

/** Nhãn lead cho pipeline chăm sóc. */
export type LeadTier = "HOT" | "WARM" | "COLD" | "OUT";

/** Mốc thời gian dự định mua. */
export type PurchaseTimeframe = "NOW" | "WITHIN_3M" | "WITHIN_6M_PLUS" | "UNSURE";

export interface LeadIntent {
  timeframe: PurchaseTimeframe;
  /** Đã để lại SĐT/email để nhận file & được tư vấn. */
  hasContact: boolean;
}

export interface LeadClassification {
  tier: LeadTier;
  /** Mã lý do (ổn định để n8n route), không phải câu hiển thị. */
  reasonCodes: string[];
  /** Hành động đề xuất cho đội House X. */
  recommendedAction: string;
  rulesVersion: string;
}

const near = (timeframe: PurchaseTimeframe): boolean =>
  timeframe === "NOW" || timeframe === "WITHIN_3M";

const creditNeedsExpert = (flag: CreditFlag): boolean =>
  flag === "BLOCKER" || flag === "CAUTION";

export function classifyLead(
  evaluation: NoxhEvaluation,
  credit: CreditAssessment,
  intent: LeadIntent,
): LeadClassification {
  const reasonCodes: string[] = [];
  let tier: LeadTier;
  let recommendedAction: string;

  const objectFail = evaluation.object.status === "FAIL";

  if (objectFail) {
    // Sai đối tượng NOXH: không hợp NOXH, nhưng có thể là khách nhà thương mại.
    tier = "OUT";
    reasonCodes.push("object_mismatch");
    recommendedAction = intent.hasContact
      ? "Không hợp NOXH — chuyển tư vấn nhà thương mại (nurture nhẹ), không dùng slot chuyên gia NOXH."
      : "Không hợp NOXH và không có liên hệ — giữ ẩn danh để đo funnel, không phân bổ nhân lực.";
    return { tier, reasonCodes, recommendedAction, rulesVersion: evaluation.rulesVersion };
  }

  if (evaluation.overall === "NOT_ELIGIBLE") {
    // Đủ đối tượng nhưng rớt nhà ở hoặc thu nhập → khách thật nhưng chưa/không hợp NOXH.
    tier = "COLD";
    if (evaluation.housing.status === "FAIL") reasonCodes.push("housing_fail");
    if (evaluation.income.status === "FAIL") reasonCodes.push("income_over_ceiling");
    recommendedAction =
      "Nurture dài hạn — gửi nội dung phù hợp; cân nhắc gợi ý nhà thương mại nếu thu nhập vượt trần.";
    return { tier, reasonCodes, recommendedAction, rulesVersion: evaluation.rulesVersion };
  }

  // Tới đây: ELIGIBLE hoặc CONDITIONAL (đủ đối tượng, chưa có FAIL).
  if (evaluation.overall === "CONDITIONAL") {
    reasonCodes.push("info_incomplete");
  }
  if (evaluation.income.nearCeiling) {
    reasonCodes.push("income_near_ceiling");
  }

  // Ưu tiên: hồ sơ đủ điều kiện NOXH nhưng vướng tín dụng → chuyên gia gỡ hồ sơ.
  if (credit.applicable && creditNeedsExpert(credit.flag)) {
    tier = "WARM";
    reasonCodes.push(
      credit.flag === "BLOCKER" ? "credit_blocker" : "credit_caution",
    );
    recommendedAction =
      "Chuyển chuyên gia HouseX tư vấn gỡ hồ sơ vay (nợ xấu/DTI/hạn mức thẻ) + nurture ngắn hạn.";
    return { tier, reasonCodes, recommendedAction, rulesVersion: evaluation.rulesVersion };
  }

  // Đủ điều kiện + tín dụng ổn (hoặc không vay) + sẵn sàng + có liên hệ → HOT.
  const eligibleClean =
    evaluation.overall === "ELIGIBLE" &&
    (!credit.applicable || credit.flag === "CLEAN");

  if (eligibleClean && intent.hasContact && near(intent.timeframe)) {
    tier = "HOT";
    reasonCodes.push("eligible_ready");
    recommendedAction =
      "Chuyển chuyên gia tư vấn realtime — hồ sơ đủ điều kiện và sẵn sàng mua.";
    return { tier, reasonCodes, recommendedAction, rulesVersion: evaluation.rulesVersion };
  }

  // Đủ/gần đủ điều kiện nhưng chưa sẵn sàng hoặc chưa để lại liên hệ.
  tier = "WARM";
  if (!intent.hasContact) reasonCodes.push("no_contact");
  if (!near(intent.timeframe)) reasonCodes.push("timeframe_far");
  recommendedAction = intent.hasContact
    ? "Gửi checklist hồ sơ + hẹn gọi tư vấn; nuôi dưỡng tới khi sẵn sàng."
    : "Khuyến khích để lại liên hệ nhận checklist; nurture qua nội dung.";
  return { tier, reasonCodes, recommendedAction, rulesVersion: evaluation.rulesVersion };
}

/**
 * Tóm tắt KHÔNG chứa PII để lưu Postgres (theo phương án lưu trữ đã chốt).
 * Không lưu thu nhập tuyệt đối, không lưu nợ xấu chi tiết — chỉ trạng thái/tier.
 */
export interface NoxhLeadSummary {
  rulesVersion: string;
  tier: LeadTier;
  reasonCodes: string[];
  objectEligible: boolean;
  objectGroupLabelKnown: boolean;
  housingStatus: NoxhEvaluation["housing"]["status"];
  incomeStatus: NoxhEvaluation["income"]["status"];
  incomeNearCeiling: boolean;
  overall: NoxhEvaluation["overall"];
  intendToBorrow: boolean;
  creditFlag: CreditFlag;
  /** Ước lượng DTI làm tròn theo bậc 10% để tránh lộ số cụ thể. */
  dtiBucket: string | null;
}

function bucketDti(dti: number | null): string | null {
  if (dti == null) return null;
  const lower = Math.floor(dti * 10) / 10;
  const upper = lower + 0.1;
  return `${Math.round(lower * 100)}-${Math.round(upper * 100)}%`;
}

/**
 * Chuỗi tóm tắt cho Lead.message — KHÔNG chứa PII tài chính (không thu nhập
 * tuyệt đối, không nợ xấu chi tiết). An toàn để lưu Postgres.
 */
export function noxhLeadMessage(summary: NoxhLeadSummary): string {
  return [
    "[NOXH check]",
    `tier=${summary.tier}`,
    `overall=${summary.overall}`,
    `housing=${summary.housingStatus}`,
    `income=${summary.incomeStatus}`,
    summary.incomeNearCeiling ? "income_near_ceiling" : null,
    `borrow=${summary.intendToBorrow ? "yes" : "no"}`,
    `credit=${summary.creditFlag}`,
    summary.dtiBucket ? `dti=${summary.dtiBucket}` : null,
    summary.reasonCodes.length ? `reasons=${summary.reasonCodes.join(",")}` : null,
    `rules=${summary.rulesVersion}`,
  ]
    .filter(Boolean)
    .join(" | ");
}

export function toLeadSummary(
  evaluation: NoxhEvaluation,
  credit: CreditAssessment,
  classification: LeadClassification,
): NoxhLeadSummary {
  return {
    rulesVersion: evaluation.rulesVersion,
    tier: classification.tier,
    reasonCodes: classification.reasonCodes,
    objectEligible: evaluation.object.status !== "FAIL",
    objectGroupLabelKnown: evaluation.object.status !== "UNKNOWN",
    housingStatus: evaluation.housing.status,
    incomeStatus: evaluation.income.status,
    incomeNearCeiling: evaluation.income.nearCeiling,
    overall: evaluation.overall,
    intendToBorrow: credit.applicable,
    creditFlag: credit.flag,
    dtiBucket: bucketDti(credit.dti),
  };
}
