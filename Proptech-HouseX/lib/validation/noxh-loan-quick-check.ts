import { z } from "zod";

const incomeBand = z.enum([
  "UNDER_15M",
  "15_25M",
  "25_35M",
  "35_50M",
  "OVER_50M",
  "UNSURE",
]);

const housingType = z.enum([
  "NOXH",
  "NOXH_RENT_TO_OWN",
  "UNSURE",
]);

const region = z.enum([
  "TPHCM",
  "HA_NOI",
  "LONG_AN",
  "DONG_NAI",
  "CAN_THO",
  "OTHER",
  "UNSURE",
]);

const ageStatus = z.enum(["PROCEED", "NEEDS_REVIEW", "NOT_SUITABLE"]);

const salutation = z.enum(["ANH", "CHI", "BAN"]);

export const noxhLoanQuickLeadSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(8),
  email: z.string().trim().email().optional().or(z.literal("")),
  region,
  housingType,
  incomeBand,
  birthYear: z.number().int().min(1940).max(2010),
  salutation,
  /** Kết quả sàng lọc tuổi — server tính lại. */
  ageStatus: ageStatus.optional(),
  message: z.string().trim().max(2000).optional(),
});

export type NoxhLoanQuickLeadInput = z.infer<typeof noxhLoanQuickLeadSchema>;

export const noxhLoanQuickCheckSchema = z.object({
  birthYear: z.number().int().min(1940).max(2010),
  salutation,
  loanYears: z.number().int().min(5).max(30).optional(),
});

export type NoxhLoanQuickCheckInput = z.infer<typeof noxhLoanQuickCheckSchema>;
