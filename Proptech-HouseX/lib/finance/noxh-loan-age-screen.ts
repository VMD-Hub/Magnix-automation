/**
 * Sàng lọc tuổi vay mua nhà ở xã hội — thuần hàm.
 *
 * Tham chiếu thông lệ ngân hàng VN (vd. Vietcombank): công dân VN từ 18 tuổi
 * đến không quá 75 tuổi tại thời điểm kết thúc khoản vay.
 *
 * Đây là lớp sàng lọc SƠ BỘ — không thay thế thẩm định ngân hàng.
 */

export type Salutation = "ANH" | "CHI" | "BAN";

export type AgeScreenStatus = "PROCEED" | "NEEDS_REVIEW" | "NOT_SUITABLE";

/** Ngưỡng tuổi tham chiếu thị trường VN. */
export const LOAN_AGE_RULES = {
  minAgeAtStart: 18,
  /** Ngưỡng an toàn sơ bộ — nhiều NH thận trọng hơn mức tối đa. */
  maxAgeAtEndSafe: 70,
  /** Mức tối đa phổ biến (VCB công bố). */
  maxAgeAtEndHard: 75,
  /** NOXH / gói ưu đãi thường 15–20 năm. */
  defaultLoanYearsNoxh: 20,
} as const;

export interface AgeScreenInput {
  birthYear: number;
  /** Năm hiện tại — inject để test. */
  referenceYear?: number;
  /** Thời hạn vay dự kiến (năm). */
  loanYears?: number;
  salutation?: Salutation;
}

export interface AgeScreenResult {
  status: AgeScreenStatus;
  salutation: Salutation;
  birthYear: number;
  currentAge: number;
  ageAtLoanEnd: number;
  loanYears: number;
  headline: string;
  summary: string;
  reasons: string[];
  nextSteps: string[];
}

const SALUTATION_LABEL: Record<Salutation, string> = {
  ANH: "Anh",
  CHI: "Chị",
  BAN: "Bạn",
};

export function salutationLabel(s: Salutation): string {
  return SALUTATION_LABEL[s];
}

function computeAge(birthYear: number, referenceYear: number): number {
  return Math.max(0, referenceYear - birthYear);
}

export function screenLoanAge(input: AgeScreenInput): AgeScreenResult {
  const referenceYear = input.referenceYear ?? new Date().getFullYear();
  const loanYears = input.loanYears ?? LOAN_AGE_RULES.defaultLoanYearsNoxh;
  const salutation = input.salutation ?? "BAN";
  const label = salutationLabel(salutation);

  const birthYear = input.birthYear;
  const currentAge = computeAge(birthYear, referenceYear);
  const ageAtLoanEnd = currentAge + loanYears;

  const reasons: string[] = [];
  const nextSteps: string[] = [];

  let status: AgeScreenStatus;
  let headline: string;
  let summary: string;

  if (currentAge < LOAN_AGE_RULES.minAgeAtStart) {
    status = "NOT_SUITABLE";
    headline = "Chưa đủ tuổi vay theo thông lệ ngân hàng";
    summary = `${label} chưa đủ 18 tuổi — chưa thể làm hồ sơ vay mua nhà theo quy định phổ biến.`;
    reasons.push(
      `Tuổi hiện tại ước tính ${currentAge} — ngân hàng thường yêu cầu từ ${LOAN_AGE_RULES.minAgeAtStart} tuổi.`,
    );
    nextSteps.push("Theo dõi chính sách NOXH và chuẩn bị hồ sơ khi đủ tuổi.");
    nextSteps.push("Rà soát thêm điều kiện đối tượng, nhà ở và thu nhập trên công cụ kiểm tra NOXH.");
  } else if (ageAtLoanEnd > LOAN_AGE_RULES.maxAgeAtEndHard) {
    status = "NOT_SUITABLE";
    headline = "Tuổi cuối kỳ vay vượt ngưỡng thông lệ";
    summary = `Với thời hạn ${loanYears} năm, ${label} sẽ khoảng ${ageAtLoanEnd} tuổi khi kết thúc vay — vượt mức ~${LOAN_AGE_RULES.maxAgeAtEndHard} tuổi mà nhiều ngân hàng áp dụng.`;
    reasons.push(
      `Tuổi hiện tại ~${currentAge}, cuối kỳ vay ~${ageAtLoanEnd} tuổi (tham chiếu ${LOAN_AGE_RULES.maxAgeAtEndHard} tuổi).`,
    );
    reasons.push("Có thể cần rút ngắn thời hạn vay, bổ sung người đồng vay trẻ hơn, hoặc điều chỉnh kế hoạch mua.");
    nextSteps.push("Trao đổi với chuyên gia HouseX về phương án thời hạn vay và cơ cấu hồ sơ.");
    nextSteps.push("Cân nhắc tính hạn mức vay nếu có người đồng vay.");
  } else if (ageAtLoanEnd > LOAN_AGE_RULES.maxAgeAtEndSafe) {
    status = "NEEDS_REVIEW";
    headline = "Có thể phù hợp — cần đối chiếu thêm";
    summary = `${label} nằm trong vùng cần thận trọng: cuối kỳ vay ~${ageAtLoanEnd} tuổi, sát ngưỡng ${LOAN_AGE_RULES.maxAgeAtEndHard} tuổi. Ngân hàng có thể yêu cầu rút thời hạn hoặc hồ sơ bổ sung.`;
    reasons.push(`Tuổi hiện tại ~${currentAge}, cuối kỳ vay ~${ageAtLoanEnd} tuổi.`);
    reasons.push("Tuổi chỉ là một tiêu chí — còn thu nhập, CIC, nghĩa vụ nợ và điều kiện NOXH.");
    nextSteps.push("Tra CIC trên cổng CIC Credit Connect trước khi nộp hồ sơ.");
    nextSteps.push("Tính hạn mức vay theo thu nhập và nghĩa vụ nợ thực tế.");
    nextSteps.push("Nhờ chuyên gia HouseX rà soát hồ sơ trước khi đặt cọc.");
  } else {
    status = "PROCEED";
    headline = "Tuổi vay nằm trong vùng an toàn sơ bộ";
    summary = `${label} ~${currentAge} tuổi, cuối kỳ vay ~${ageAtLoanEnd} tuổi (thời hạn ${loanYears} năm) — phù hợp sơ bộ với thông lệ ngân hàng. Tiếp theo cần xét thu nhập, CIC và điều kiện NOXH.`;
    reasons.push(`Tuổi hiện tại ~${currentAge} (≥ ${LOAN_AGE_RULES.minAgeAtStart}).`);
    reasons.push(
      `Tuổi cuối kỳ vay ~${ageAtLoanEnd} (≤ ${LOAN_AGE_RULES.maxAgeAtEndSafe} vùng an toàn sơ bộ).`,
    );
    nextSteps.push("Kiểm tra điều kiện mua NOXH: đối tượng, nhà ở, thu nhập.");
    nextSteps.push("Tính hạn mức vay theo thu nhập hộ gia đình.");
    nextSteps.push("Tra CIC trên CIC Credit Connect trước khi nộp hồ sơ chính thức.");
  }

  return {
    status,
    salutation,
    birthYear,
    currentAge,
    ageAtLoanEnd,
    loanYears,
    headline,
    summary,
    reasons,
    nextSteps,
  };
}

export function ageScreenStatusLabel(status: AgeScreenStatus): string {
  switch (status) {
    case "PROCEED":
      return "Có thể tiếp tục";
    case "NEEDS_REVIEW":
      return "Cần kiểm tra thêm";
    case "NOT_SUITABLE":
      return "Chưa phù hợp lúc này";
  }
}
