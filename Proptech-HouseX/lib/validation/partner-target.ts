import { z } from "zod";

export const partnerTargetKindSchema = z.enum([
  "UNION",
  "HR",
  "KCN",
  "ENTERPRISE",
  "OTHER",
]);

export const partnerTargetStatusSchema = z.enum([
  "TARGET",
  "CONTACTED",
  "MEETING",
  "PARTNER",
  "PAUSED",
  "DROP",
  "ALL",
]);

export const partnerTargetListQuerySchema = z.object({
  status: partnerTargetStatusSchema.optional().default("TARGET"),
});

const optionalDate = z
  .union([z.string().datetime(), z.literal(""), z.null()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? null : v));

export const partnerTargetWriteSchema = z.object({
  orgName: z.string().trim().min(2).max(200),
  kind: partnerTargetKindSchema.optional().default("OTHER"),
  areaHint: z.string().trim().max(120).optional().nullable(),
  contactName: z.string().trim().max(120).optional().nullable(),
  contactChannel: z.string().trim().max(160).optional().nullable(),
  status: partnerTargetStatusSchema
    .exclude(["ALL"])
    .optional()
    .default("TARGET"),
  nextAction: z.string().trim().max(240).optional().nullable(),
  nextActionAt: optionalDate,
  notes: z.string().max(4000).optional().nullable(),
});

export const partnerTargetUpdateSchema = partnerTargetWriteSchema.partial();

export type PartnerTargetWriteInput = z.infer<typeof partnerTargetWriteSchema>;
