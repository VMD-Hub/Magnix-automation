import { z } from "zod";

const NOXH_OBJECT_GROUP_VALUES = [
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
] as const;

export const ctvClaimSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(9).max(20),
  projectId: z.string().uuid().optional(),
  objectGroup: z.enum(NOXH_OBJECT_GROUP_VALUES).optional().default("WORKER"),
  intendToBorrow: z.boolean().optional().default(false),
  message: z.string().trim().max(500).optional(),
});

export const assistLogSchema = z.object({
  assistType: z.enum(["NUDGE", "ESCORT", "NOTE"]),
  message: z.string().trim().min(3).max(500),
});

export const nudgeSchema = z.object({
  docType: z
    .enum([
      "DOC_ID",
      "DOC_MARRIAGE",
      "DOC_RESIDENCE",
      "DOC_OBJECT",
      "DOC_HOUSING",
      "DOC_INCOME",
      "DOC_APPLICATION",
      "DOC_CIC",
      "DOC_BANK_INCOME",
      "DOC_LOAN_APP",
    ])
    .optional(),
  message: z.string().trim().max(300).optional(),
});

export const adminCasePatchSchema = z.object({
  milestone: z
    .enum([
      "M1_RECEIVED",
      "M2_DOCUMENTS",
      "M3_SUBMITTED",
      "M4_APPROVED",
      "M5_SIGNED",
    ])
    .optional(),
  milestoneSub: z.string().trim().max(80).optional().nullable(),
  caseStatus: z
    .enum(["ACTIVE", "UNREACHABLE", "DECLINED", "COMPLETED", "RELEASED"])
    .optional(),
  opsNote: z.string().trim().max(2000).optional().nullable(),
  objectGroup: z.string().optional(),
  intendToBorrow: z.boolean().optional(),
  projectId: z.string().uuid().optional().nullable(),
  markContacted: z.boolean().optional(),
});

export const adminDocPatchSchema = z.object({
  status: z.enum([
    "NOT_REQUIRED",
    "MISSING",
    "RECEIVED",
    "REVIEWING",
    "PASSED",
    "REJECTED",
    "EXPIRED",
  ]),
  rejectReason: z.string().trim().max(500).optional().nullable(),
  opsNote: z.string().trim().max(500).optional(),
});
