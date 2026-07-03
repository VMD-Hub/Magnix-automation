/**
 * Engine sàng lọc khả năng vay & tình trạng tín dụng — thuần hàm.
 *
 * Đây KHÔNG phải điều kiện mua NOXH (đối tượng/nhà ở/thu nhập), mà là điều kiện
 * để NGÂN HÀNG duyệt cho vay. Một người có thể đủ điều kiện NOXH nhưng vẫn khó
 * vay vì: nợ xấu nhóm 2 trở lên (kể cả vợ/chồng), tỷ lệ nợ/thu nhập (DTI) cao,
 * hoặc hạn mức thẻ tín dụng lớn kéo giảm hạn mức có thể vay.
 *
 * Mục tiêu: đưa ra tín hiệu SƠ BỘ + luôn kèm khuyến nghị để chuyên gia HouseX
 * giải thích rõ hồ sơ và tìm giải pháp. Tuyệt đối không "tuyên án" khách.
 */

/** Tình trạng nợ xấu của bản thân hoặc vợ/chồng. */
export type BadDebtStatus = "NONE" | "GROUP_2_PLUS" | "UNKNOWN";

/** Cờ kết luận tín dụng. */
export type CreditFlag =
  | "NOT_APPLICABLE" // không có nhu cầu vay
  | "CLEAN" // hồ sơ tín dụng thuận lợi
  | "CAUTION" // có điểm cần lưu ý (DTI cao / thẻ lớn / chưa rõ nợ xấu)
  | "BLOCKER"; // rào cản lớn (nợ xấu nhóm 2+)

export interface CreditInput {
  /** Có dự định vay ngân hàng để mua không. */
  intendToBorrow: boolean;
  /**
   * Thu nhập/tháng dùng để xét khả năng trả nợ (VND).
   * Lưu ý: đây là thu nhập trả nợ, có thể khác cách tính trần NOXH.
   */
  householdMonthlyIncome: number;
  /** Tổng khoản trả nợ hiện tại/tháng (vay hiện hữu) — VND. */
  existingMonthlyDebtPayment?: number;
  /** Tổng hạn mức thẻ tín dụng đang dùng — VND. */
  creditCardLimitTotal?: number;
  /** Nợ xấu nhóm 2 trở lên của bản thân hoặc vợ/chồng. */
  badDebtSelfOrSpouse: BadDebtStatus;
  /** Dự kiến khoản trả/tháng cho khoản vay mới (nếu đã ước lượng) — VND. */
  expectedNewLoanPayment?: number;
}

export interface CreditAssessment {
  applicable: boolean;
  flag: CreditFlag;
  /** Ước lượng tỷ lệ nợ/thu nhập (DTI), 0..n. null nếu không đủ dữ liệu. */
  dti: number | null;
  /** Nghĩa vụ nợ/tháng quy đổi đã dùng để tính DTI (VND). */
  estimatedMonthlyObligation: number;
  reasons: string[];
  /** CTA luôn hướng về chuyên gia HouseX. */
  recommendation: string;
}

/**
 * Tỷ lệ nghĩa vụ/tháng quy đổi từ hạn mức thẻ tín dụng.
 * Ngân hàng thường tính ~5% hạn mức thẻ như một khoản nợ tiềm tàng khi thẩm định.
 */
export const CREDIT_CARD_LIABILITY_RATE = 0.05;

/** Ngưỡng DTI: ≤ safe an toàn; (safe, tight] cần cân nhắc; > tight rủi ro cao. */
export const DTI_SAFE = 0.5;
export const DTI_TIGHT = 0.7;

const EXPERT_CTA =
  "Để chuyên gia HouseX tư vấn và giải thích rõ tình trạng hồ sơ của bạn để tìm giải pháp phù hợp.";

const fmtPct = (n: number): string => `${Math.round(n * 100)}%`;

export function assessCreditReadiness(input: CreditInput): CreditAssessment {
  if (!input.intendToBorrow) {
    return {
      applicable: false,
      flag: "NOT_APPLICABLE",
      dti: null,
      estimatedMonthlyObligation: 0,
      reasons: ["Không có nhu cầu vay — không cần xét điều kiện tín dụng."],
      recommendation: EXPERT_CTA,
    };
  }

  const reasons: string[] = [];

  const existing = Math.max(0, input.existingMonthlyDebtPayment || 0);
  const cardLimit = Math.max(0, input.creditCardLimitTotal || 0);
  const cardObligation = cardLimit * CREDIT_CARD_LIABILITY_RATE;
  const newLoan = Math.max(0, input.expectedNewLoanPayment || 0);
  const monthlyObligation = existing + cardObligation + newLoan;

  const income = Math.max(0, input.householdMonthlyIncome || 0);
  const dti = income > 0 ? monthlyObligation / income : null;

  let flag: CreditFlag = "CLEAN";

  // Rào cản lớn nhất: nợ xấu nhóm 2 trở lên (bản thân hoặc vợ/chồng).
  if (input.badDebtSelfOrSpouse === "GROUP_2_PLUS") {
    flag = "BLOCKER";
    reasons.push(
      "Có nợ xấu nhóm 2 trở lên (bản thân hoặc vợ/chồng) — ngân hàng thường từ chối hoặc hạn chế cho vay.",
    );
  } else if (input.badDebtSelfOrSpouse === "UNKNOWN") {
    flag = "CAUTION";
    reasons.push(
      "Chưa rõ tình trạng nợ xấu — nên kiểm tra CIC trước khi nộp hồ sơ vay.",
    );
  }

  if (cardObligation > 0) {
    reasons.push(
      `Hạn mức thẻ tín dụng ~${new Intl.NumberFormat("vi-VN").format(cardLimit)} đ được ngân hàng quy đổi ~${new Intl.NumberFormat("vi-VN").format(Math.round(cardObligation))} đ/tháng nghĩa vụ — làm giảm hạn mức có thể vay.`,
    );
  }

  if (dti != null) {
    if (dti > DTI_TIGHT) {
      if (flag !== "BLOCKER") flag = "CAUTION";
      reasons.push(
        `Tỷ lệ nợ/thu nhập (DTI) ước tính ${fmtPct(dti)} vượt ngưỡng an toàn ~${fmtPct(DTI_TIGHT)} — khó được duyệt hạn mức mong muốn.`,
      );
    } else if (dti > DTI_SAFE) {
      if (flag === "CLEAN") flag = "CAUTION";
      reasons.push(
        `DTI ước tính ${fmtPct(dti)} ở mức cần cân nhắc (an toàn ≤ ${fmtPct(DTI_SAFE)}).`,
      );
    } else {
      reasons.push(`DTI ước tính ${fmtPct(dti)} trong ngưỡng an toàn.`);
    }
  } else {
    if (flag === "CLEAN") flag = "CAUTION";
    reasons.push("Chưa đủ dữ liệu thu nhập để ước tính DTI.");
  }

  if (flag === "CLEAN") {
    reasons.push("Chưa phát hiện rào cản tín dụng rõ ràng ở bước sàng lọc sơ bộ.");
  }

  return {
    applicable: true,
    flag,
    dti,
    estimatedMonthlyObligation: Math.round(monthlyObligation),
    reasons,
    recommendation: EXPERT_CTA,
  };
}
