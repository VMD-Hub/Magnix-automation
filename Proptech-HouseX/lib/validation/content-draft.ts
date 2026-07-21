import { z } from "zod";
import { NOXH_CTA_TOOL_IDS } from "@/lib/content/noxh-cta-tools";

export const contentDraftStatusSchema = z.enum([
  "DRAFT",
  "PENDING_L3",
  "APPROVED",
  "REJECTED",
  "PUBLISHED",
  "SCHEDULED",
  "ALL",
]);

export const contentDraftChannelSchema = z.enum([
  "WEBSITE",
  "FB_PAGE",
  "SHORT_VIDEO",
  "ZALO_OA",
]);

export const contentDraftListQuerySchema = z.object({
  status: contentDraftStatusSchema.optional().default("DRAFT"),
});

const optionalDateTime = z
  .union([z.string().datetime(), z.literal(""), z.null()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? null : v));

export const contentDraftWriteSchema = z.object({
  title: z.string().trim().min(3).max(240),
  hookLine: z.string().max(2000).optional().nullable(),
  artifactMarkdown: z.string().max(100000).optional().nullable(),
  ctaOptIn: z.string().max(2000).optional().nullable(),
  disclaimer: z.string().max(4000).optional().nullable(),
  exportHint: z.string().max(500).optional().nullable(),
  segment: z.string().max(80).optional().nullable(),
  qaTier: z.string().max(20).optional().nullable(),
  publishChannel: contentDraftChannelSchema.optional().nullable(),
  ctaToolId: z.enum(NOXH_CTA_TOOL_IDS).optional().nullable(),
  ctaLabel: z.string().trim().max(160).optional().nullable(),
  opsNotes: z.string().max(4000).optional().nullable(),
  scheduledAt: optionalDateTime,
  l3Checklist: z
    .object({
      pain: z.boolean(),
      ctaTool: z.boolean(),
      ctaCopy: z.boolean(),
    })
    .optional()
    .nullable(),
});

export const contentDraftUpdateSchema = contentDraftWriteSchema.partial();

export const contentDraftSyncSchema = z.object({
  limit: z.number().int().min(1).max(500).optional().default(100),
});

export const contentDraftStatusActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("submit_l3") }),
  z.object({ action: z.literal("approve") }),
  z.object({
    action: z.literal("reject"),
    rejectReason: z.string().min(5).max(2000),
  }),
  z.object({ action: z.literal("mark_published") }),
]);
