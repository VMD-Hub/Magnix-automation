import { z } from "zod";

export const earlySignalStatusSchema = z.enum([
  "CAPTURED",
  "PACKAGED",
  "PENDING_L3",
  "APPROVED",
  "REJECTED",
  "PUBLISHED",
  "ALL",
]);

export const earlySignalTierSchema = z.enum([
  "T1_PRESS",
  "T2_SXD",
  "T3_DOSSIER",
  "T4_SOR",
]);

export const earlySignalRoleHintSchema = z.enum([
  "SPONSOR",
  "JV_SUBSIDIARY",
  "CONTRACTOR",
  "CHANNEL",
]);

export const earlySignalResolveStatusSchema = z.enum([
  "LINKED",
  "UNLINKED",
  "CONTRACTOR_ONLY",
  "CHANNEL_PENDING_SPONSOR",
]);

export const earlySignalListQuerySchema = z.object({
  status: earlySignalStatusSchema.optional().default("PENDING_L3"),
});

const optionalUrl = z
  .union([z.string().url(), z.literal(""), z.null()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? null : v));

export const earlySignalCreateSchema = z.object({
  tier: earlySignalTierSchema.optional().default("T1_PRESS"),
  pressUrl: optionalUrl,
  sxdUrl: optionalUrl,
  groupSlug: z.string().max(80).optional().nullable(),
  channelSlug: z.string().max(80).optional().nullable(),
  roleHint: earlySignalRoleHintSchema.optional().nullable(),
  resolveStatus: earlySignalResolveStatusSchema.optional().nullable(),
  provinceHint: z.string().max(120).optional().nullable(),
  projectId: z.string().uuid().optional().nullable(),
  opsNotes: z.string().max(4000).optional().nullable(),
  readerTitle: z.string().max(200).optional().nullable(),
  readerBody: z.string().max(20000).optional().nullable(),
  readerDisclaimer: z.string().max(2000).optional().nullable(),
  ctaLabel: z.string().max(120).optional().nullable(),
  nurtureOnApprove: z.boolean().optional().default(false),
});

export const earlySignalUpdateSchema = earlySignalCreateSchema.partial().extend({
  articleId: z.string().uuid().optional().nullable(),
  nurtureOnApprove: z.boolean().optional(),
});

export const earlySignalStatusActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("package") }),
  z.object({ action: z.literal("submit_l3") }),
  z.object({ action: z.literal("approve") }),
  z.object({
    action: z.literal("reject"),
    rejectReason: z.string().min(5).max(2000),
  }),
  z.object({ action: z.literal("mark_published") }),
]);
