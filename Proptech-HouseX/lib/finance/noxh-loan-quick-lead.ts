import type { AgeScreenResult, AgeScreenStatus } from "@/lib/finance/noxh-loan-age-screen";
import { ageScreenStatusLabel } from "@/lib/finance/noxh-loan-age-screen";
import type { NoxhLoanQuickLeadInput } from "@/lib/validation/noxh-loan-quick-check";

const REGION_LABEL: Record<NoxhLoanQuickLeadInput["region"], string> = {
  TPHCM: "TP.HCM",
  HA_NOI: "Hà Nội",
  LONG_AN: "Long An",
  DONG_NAI: "Đồng Nai",
  CAN_THO: "Cần Thơ",
  OTHER: "Khu vực khác",
  UNSURE: "Chưa rõ",
};

const INCOME_LABEL: Record<NoxhLoanQuickLeadInput["incomeBand"], string> = {
  UNDER_15M: "Dưới 15 triệu/tháng",
  "15_25M": "15–25 triệu/tháng",
  "25_35M": "25–35 triệu/tháng",
  "35_50M": "35–50 triệu/tháng",
  OVER_50M: "Trên 50 triệu/tháng",
  UNSURE: "Chưa rõ",
};

const HOUSING_LABEL: Record<NoxhLoanQuickLeadInput["housingType"], string> = {
  NOXH: "Mua NOXH",
  NOXH_RENT_TO_OWN: "Thuê mua NOXH",
  UNSURE: "Chưa rõ",
};

export function noxhLoanQuickLeadMessage(
  screen: AgeScreenResult,
  form: Pick<
    NoxhLoanQuickLeadInput,
    "region" | "housingType" | "incomeBand" | "birthYear" | "salutation"
  >,
): string {
  return [
    "[tool:noxh-loan-quick-check]",
    `Tuổi sơ bộ: sinh ${form.birthYear} → ${screen.currentAge} tuổi, cuối kỳ ~${screen.ageAtLoanEnd}`,
    `Kết quả tuổi: ${ageScreenStatusLabel(screen.status)} (${screen.status})`,
    `Khu vực: ${REGION_LABEL[form.region]}`,
    `Loại nhà: ${HOUSING_LABEL[form.housingType]}`,
    `Thu nhập ước tính: ${INCOME_LABEL[form.incomeBand]}`,
  ].join(" | ");
}

export function quickCheckTier(status: AgeScreenStatus): "HOT" | "WARM" | "COLD" {
  if (status === "PROCEED") return "WARM";
  if (status === "NEEDS_REVIEW") return "HOT";
  return "COLD";
}
