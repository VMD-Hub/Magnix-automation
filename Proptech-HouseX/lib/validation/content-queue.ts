import { z } from "zod";
import { NOXH_CTA_TOOL_IDS } from "@/lib/content/noxh-cta-tools";

export const contentQueueStatusSchema = z.enum([
  "INTAKE",
  "PENDING_L3",
  "APPROVED",
  "REJECTED",
  "PUBLISHED",
  "ALL",
]);

export const contentQueueChannelSchema = z.enum([
  "WEBSITE",
  "FB_PAGE",
  "SHORT_VIDEO",
  "ZALO_OA",
]);

export const noxhCtaToolIdSchema = z.enum(NOXH_CTA_TOOL_IDS);

export const l3ChecklistSchema = z.object({
  pain: z.boolean(),
  ctaTool: z.boolean(),
  ctaCopy: z.boolean(),
});

export const contentQueueListQuerySchema = z.object({
  status: contentQueueStatusSchema.optional().default("PENDING_L3"),
});

const optionalUrl = z
  .union([z.string().url(), z.literal(""), z.null()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? null : v));

export const contentQueueCreateSchema = z.object({
  title: z.string().trim().min(3).max(240),
  painPoint: z.string().trim().max(2000).optional().nullable(),
  bodyPreview: z.string().max(20000).optional().nullable(),
  segment: z.string().max(80).optional().nullable(),
  score: z.number().int().min(0).max(100).optional().nullable(),
  publishChannel: contentQueueChannelSchema.optional().nullable(),
  ctaToolId: noxhCtaToolIdSchema.optional().nullable(),
  ctaLabel: z.string().trim().max(160).optional().nullable(),
  sourceUrl: optionalUrl,
  sheetKey: z.string().max(200).optional().nullable(),
  articleId: z.string().uuid().optional().nullable(),
  opsNotes: z.string().max(4000).optional().nullable(),
  l3Checklist: l3ChecklistSchema.optional().nullable(),
});

export const contentQueueUpdateSchema = contentQueueCreateSchema.partial();

export const contentQueueStatusActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("submit_l3") }),
  z.object({ action: z.literal("approve") }),
  z.object({
    action: z.literal("reject"),
    rejectReason: z.string().min(5).max(2000),
  }),
  z.object({ action: z.literal("mark_published") }),
]);
