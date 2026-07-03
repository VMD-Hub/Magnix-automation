/**
 * Engine đánh giá điều kiện mua NOXH — thuần hàm, không phụ thuộc framework.
 *
 * Ba trụ điều kiện (theo Luật Nhà ở 2023 + NĐ 100/2024 và các sửa đổi):
 *  1. ĐỐI TƯỢNG (Đ.76): có thuộc nhóm được mua/thuê mua NOXH không.
 *  2. NHÀ Ở (Đ.29): chưa có nhà / có nhà nhưng < 15 m² sàn/người, chưa hưởng NOXH.
 *  3. THU NHẬP (Đ.30): với nhóm K5/K6/K8, thu nhập ≤ trần theo tình trạng hôn nhân.
 *
 * Toàn bộ ngưỡng lấy từ noxh-rules.ts (versioned). Kết quả kèm rulesVersion,
 * reasons (vì sao) và nextSteps (làm gì tiếp) để dùng trực tiếp cho UI wizard.
 */

import {
  CURRENT_NOXH_RULES,
  NOXH_OBJECT_GROUPS,
  type NoxhObjectGroupId,
  type NoxhRuleSet,
} from "./noxh-rules";

export type MaritalStatus = "SINGLE" | "SINGLE_WITH_MINOR" | "MARRIED";

/** Trạng thái từng trụ điều kiện. */
export type ConditionStatus = "PASS" | "FAIL" | "CONDITIONAL" | "UNKNOWN";

export interface NoxhInput {
  /** Nhóm đối tượng người dùng chọn (null = chưa chọn). */
  objectGroup: NoxhObjectGroupId | null;

  // --- Điều kiện nhà ở ---
  /** Đang đứng tên sở hữu nhà tại tỉnh/TP nơi có dự án. */
  ownsHomeInProvince: boolean;
  /** Diện tích ở bình quân đầu người hiện tại (m²) — chỉ dùng khi đang có nhà. */
  areaPerPersonSqm?: number;
  /** Đã từng mua/thuê mua NOXH hoặc đã hưởng chính sách hỗ trợ nhà ở. */
  everBenefitedHousingPolicy: boolean;

  // --- Điều kiện thu nhập ---
  maritalStatus: MaritalStatus;
  /** Thu nhập bình quân/tháng của người đứng đơn (VND). */
  applicantMonthlyIncome: number;
  /** Thu nhập bình quân/tháng của vợ/chồng (VND) — dùng khi MARRIED. */
  spouseMonthlyIncome?: number;
}

export interface ConditionResult {
  status: ConditionStatus;
  /** Lý do ngắn gọn, thân thiện với người dùng. */
  reason: string;
}

export type NoxhOverall = "ELIGIBLE" | "CONDITIONAL" | "NOT_ELIGIBLE";

export interface NoxhEvaluation {
  rulesVersion: string;
  object: ConditionResult;
  housing: ConditionResult;
  income: ConditionResult & {
    /** Trần áp dụng (VND) — null nếu nhóm được miễn xét thu nhập. */
    ceiling: number | null;
    /** Thu nhập dùng để so trần (VND). */
    effectiveIncome: number;
    /** Có sát trần (đạt nhưng cần lưu ý) không. */
    nearCeiling: boolean;
  };
  overall: NoxhOverall;
  /** Tổng hợp lý do (để hiển thị bảng kết quả). */
  reasons: string[];
  /** Việc cần làm tiếp theo (định hướng hành động, không dọa khách). */
  nextSteps: string[];
}

const fmtVnd = (n: number): string =>
  `${new Intl.NumberFormat("vi-VN").format(Math.round(n))} đ`;

/** Trần thu nhập theo tình trạng hôn nhân. */
function ceilingFor(status: MaritalStatus, rules: NoxhRuleSet): number {
  switch (status) {
    case "SINGLE":
      return rules.incomeCeilings.single;
    case "SINGLE_WITH_MINOR":
      return rules.incomeCeilings.singleWithMinor;
    case "MARRIED":
      return rules.incomeCeilings.married;
  }
}

/** Thu nhập dùng để so trần: độc thân → bản thân; kết hôn → tổng hai vợ chồng. */
function effectiveIncomeFor(input: NoxhInput): number {
  const self = Math.max(0, input.applicantMonthlyIncome || 0);
  if (input.maritalStatus === "MARRIED") {
    return self + Math.max(0, input.spouseMonthlyIncome || 0);
  }
  return self;
}

function evaluateObject(input: NoxhInput): ConditionResult {
  if (!input.objectGroup) {
    return { status: "UNKNOWN", reason: "Chưa chọn nhóm đối tượng." };
  }
  const group = NOXH_OBJECT_GROUPS[input.objectGroup];
  if (!group.eligibleForPurchase) {
    return {
      status: "FAIL",
      reason:
        "Nhóm bạn chọn không thuộc diện được mua/thuê mua NOXH theo Điều 76.",
    };
  }
  return {
    status: "PASS",
    reason: group.note
      ? `Thuộc diện được mua NOXH: ${group.label}. ${group.note}`
      : `Thuộc diện được mua NOXH: ${group.label}.`,
  };
}

function evaluateHousing(input: NoxhInput, rules: NoxhRuleSet): ConditionResult {
  if (input.everBenefitedHousingPolicy) {
    return {
      status: "FAIL",
      reason:
        "Đã từng mua/thuê mua NOXH hoặc đã hưởng chính sách hỗ trợ nhà ở — không đủ điều kiện.",
    };
  }
  if (!input.ownsHomeInProvince) {
    return {
      status: "PASS",
      reason: "Chưa có nhà thuộc sở hữu tại tỉnh/TP nơi có dự án.",
    };
  }
  // Đang có nhà: xét diện tích bình quân đầu người.
  const area = input.areaPerPersonSqm;
  if (area == null) {
    return {
      status: "UNKNOWN",
      reason:
        "Đang có nhà nhưng chưa rõ diện tích bình quân đầu người — cần bổ sung để xác định.",
    };
  }
  if (area < rules.minAreaPerPersonSqm) {
    return {
      status: "PASS",
      reason: `Có nhà nhưng diện tích bình quân ${area} m²/người < ${rules.minAreaPerPersonSqm} m² — vẫn đủ điều kiện.`,
    };
  }
  return {
    status: "FAIL",
    reason: `Đã có nhà với diện tích bình quân ${area} m²/người ≥ ${rules.minAreaPerPersonSqm} m² — không đủ điều kiện về nhà ở.`,
  };
}

function evaluateIncome(
  input: NoxhInput,
  rules: NoxhRuleSet,
): NoxhEvaluation["income"] {
  const effectiveIncome = effectiveIncomeFor(input);

  const group = input.objectGroup
    ? NOXH_OBJECT_GROUPS[input.objectGroup]
    : null;

  // Nhóm được miễn trần Đ.30 k1 (K1–K4, K7, K9, K10) hoặc chưa chọn nhóm.
  if (group && group.eligibleForPurchase && !group.requiresIncome) {
    const reason =
      group.id === "ARMED_FORCES"
        ? "Nhóm lực lượng vũ trang không áp trần 25/35/50 triệu — xác nhận theo Điều 67 NĐ 100/2024 và mẫu đơn vị BQP/BCA."
        : "Nhóm đối tượng của bạn được miễn trần thu nhập Điều 30 k1 (chứng minh đối tượng hoặc chuẩn nghèo).";
    return {
      status: "PASS",
      reason,
      ceiling: null,
      effectiveIncome,
      nearCeiling: false,
    };
  }

  const ceiling = ceilingFor(input.maritalStatus, rules);
  const nearThreshold = ceiling * (1 - rules.incomeNearCeilingMargin);

  if (effectiveIncome > ceiling) {
    return {
      status: "FAIL",
      reason: `Thu nhập ${fmtVnd(effectiveIncome)}/tháng vượt trần ${fmtVnd(ceiling)} — chưa đủ điều kiện thu nhập cho NOXH.`,
      ceiling,
      effectiveIncome,
      nearCeiling: false,
    };
  }

  const nearCeiling = effectiveIncome > nearThreshold;
  return {
    status: "PASS",
    reason: nearCeiling
      ? `Thu nhập ${fmtVnd(effectiveIncome)}/tháng sát trần ${fmtVnd(ceiling)} — đạt nhưng cần lưu ý khi xác minh 12 tháng.`
      : `Thu nhập ${fmtVnd(effectiveIncome)}/tháng trong ngưỡng cho phép (≤ ${fmtVnd(ceiling)}).`,
    ceiling,
    effectiveIncome,
    nearCeiling,
  };
}

function buildNextSteps(ev: {
  object: ConditionResult;
  housing: ConditionResult;
  income: NoxhEvaluation["income"];
  overall: NoxhOverall;
}): string[] {
  const steps: string[] = [];

  if (ev.object.status === "UNKNOWN") {
    steps.push("Chọn nhóm đối tượng để hoàn tất kiểm tra.");
  }
  if (ev.object.status === "FAIL") {
    steps.push(
      "Bạn có thể cân nhắc nhà ở thương mại — để chuyên gia HouseX tư vấn lựa chọn phù hợp.",
    );
  }
  if (ev.housing.status === "UNKNOWN") {
    steps.push("Bổ sung diện tích bình quân đầu người của nhà đang ở.");
  }
  if (ev.housing.status === "FAIL") {
    steps.push(
      "Điều kiện nhà ở chưa đạt — chuyên gia sẽ rà soát hồ sơ để xác định phương án.",
    );
  }
  if (ev.income.status === "FAIL") {
    steps.push(
      "Thu nhập vượt trần NOXH — chuyên gia HouseX tư vấn nhà thương mại hoặc phương án khác.",
    );
  } else if (ev.income.nearCeiling) {
    steps.push(
      "Thu nhập sát trần — chuẩn bị bảng lương/xác nhận thu nhập 12 tháng để chứng minh.",
    );
  }

  if (ev.overall === "ELIGIBLE") {
    steps.push("Chuẩn bị hồ sơ và để chuyên gia HouseX hướng dẫn nộp đăng ký.");
  }
  if (ev.overall === "CONDITIONAL") {
    steps.push("Hoàn thiện thông tin còn thiếu để có kết luận chính xác.");
  }
  return steps;
}

/** Đánh giá điều kiện mua NOXH theo bộ quy tắc hiện hành (mặc định CURRENT). */
export function evaluateNoxhEligibility(
  input: NoxhInput,
  rules: NoxhRuleSet = CURRENT_NOXH_RULES,
): NoxhEvaluation {
  const object = evaluateObject(input);
  const housing = evaluateHousing(input, rules);
  const income = evaluateIncome(input, rules);

  const statuses = [object.status, housing.status, income.status];
  let overall: NoxhOverall;
  if (statuses.includes("FAIL")) {
    overall = "NOT_ELIGIBLE";
  } else if (statuses.includes("UNKNOWN")) {
    overall = "CONDITIONAL";
  } else {
    overall = "ELIGIBLE";
  }

  const reasons = [object.reason, housing.reason, income.reason];
  const nextSteps = buildNextSteps({ object, housing, income, overall });

  return {
    rulesVersion: rules.version,
    object,
    housing,
    income,
    overall,
    reasons,
    nextSteps,
  };
}
