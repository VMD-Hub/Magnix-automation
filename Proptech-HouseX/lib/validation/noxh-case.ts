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

export const AFFILIATE_DEAL_TIER_VALUES = [
  "CONNECTOR",
  "CONSULTANT",
  "DEVELOPER_PARTNER",
  "MASTER_BROKER",
] as const;

export const ctvClaimSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(9).max(20),
  projectId: z.string().uuid().optional(),
  /** Nhãn dự án tự do (Giỏ hàng / gõ tay) khi chưa có projectId. */
  projectLabel: z.string().trim().max(200).optional(),
  /** Mức hợp tác trên deal — SoT A+B+C. */
  dealTier: z.enum(AFFILIATE_DEAL_TIER_VALUES).optional().default("CONNECTOR"),
  objectGroup: z.enum(NOXH_OBJECT_GROUP_VALUES).optional().default("WORKER"),
  intendToBorrow: z.boolean().optional().default(false),
  message: z.string().trim().max(500).optional(),
  /** Lịch tư vấn — optional; server mặc định +24h nếu thiếu. */
  consultScheduledAt: z.string().trim().min(10).max(40).optional(),
});

export const consultScheduleSchema = z.object({
  consultScheduledAt: z.string().trim().min(10).max(40),
});

/** CS hợp lệ SoT §5.2 — enum + note + ≥1 ảnh (URL /uploads hoặc https). */
export const careActivitySchema = z.object({
  activityType: z.enum([
    "CALL",
    "CHAT",
    "MEET",
    "SITE_VISIT",
    "DOCUMENT",
    "OTHER",
  ]),
  occurredAt: z.string().trim().min(10).max(40).optional(),
  note: z.string().trim().min(3).max(2000),
  imageUrls: z
    .array(
      z
        .string()
        .trim()
        .min(8)
        .max(2000)
        .refine(
          (u) =>
            u.startsWith("/uploads/") ||
            u.startsWith("https://") ||
            u.startsWith("http://localhost"),
          "URL ảnh không hợp lệ",
        ),
    )
    .min(1)
    .max(8),
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

/** Ops nhập giá căn HĐMB (chưa VAT). */
export const adminHdmbSchema = z.object({
  hdmbBaseAmount: z.number().positive().max(1_000_000_000_000),
});

export const adminCareRejectSchema = z.object({
  reason: z.string().trim().min(3).max(500),
});

export const adminExclusiveExtendSchema = z.object({
  action: z.enum(["approve", "deny"]),
  reason: z.string().trim().max(500).optional(),
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

export const adminCreateNoxhCaseSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(9).max(20),
  projectId: z.string().uuid().optional().nullable(),
  objectGroup: z.enum(NOXH_OBJECT_GROUP_VALUES).optional().default("WORKER"),
  intendToBorrow: z.boolean().optional().default(false),
  opsNote: z.string().trim().max(2000).optional(),
  leadId: z.string().uuid().optional().nullable(),
  inboundLeadId: z.string().uuid().optional().nullable(),
});
