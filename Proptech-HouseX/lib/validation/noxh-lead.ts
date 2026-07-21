import { z } from "zod";

/** Input cho POST /api/tools/noxh-eligibility — gửi raw để server tính lại (anti-tamper). */

const objectGroup = z.enum([
  "MERIT",
  "POOR_RURAL",
  "POOR_URBAN",
  "LOW_INCOME_URBAN",
  "WORKER",
  "ARMED_FORCES",
  "CIVIL_SERVANT",
  "RETURNED_OFFICIAL_HOUSING",
  "LAND_RECOVERED",
  "NONE",
]);

const money = z.number().nonnegative().max(1_000_000_000_000);

export const noxhEligibilityInputSchema = z.object({
  objectGroup,
  ownsHomeInProvince: z.boolean(),
  areaPerPersonSqm: z.number().nonnegative().max(10_000).optional(),
  everBenefitedHousingPolicy: z.boolean(),
  maritalStatus: z.enum(["SINGLE", "SINGLE_WITH_MINOR", "MARRIED"]),
  applicantMonthlyIncome: money,
  spouseMonthlyIncome: money.optional(),
  intendToBorrow: z.boolean(),
  existingMonthlyDebtPayment: money.optional(),
  creditCardLimitTotal: money.optional(),
  badDebtSelfOrSpouse: z.enum(["NONE", "GROUP_2_PLUS", "UNKNOWN"]),
  timeframe: z.enum(["NOW", "WITHIN_3M", "WITHIN_6M_PLUS", "UNSURE"]),
});

export const noxhLeadSchema = z.object({
  name: z.string().trim().min(2, "Họ tên tối thiểu 2 ký tự.").max(120),
  phone: z.string().trim().min(8, "Số điện thoại không hợp lệ.").max(20),
  email: z.string().trim().email("Email không hợp lệ."),
  /** ADR-017 — checkbox opt-in marketing email → ConsentRecord channel=email. */
  marketingEmailOptIn: z.boolean().optional().default(false),
  input: noxhEligibilityInputSchema,
});

export type NoxhLeadInput = z.infer<typeof noxhLeadSchema>;
export type NoxhEligibilityInput = z.infer<typeof noxhEligibilityInputSchema>;
