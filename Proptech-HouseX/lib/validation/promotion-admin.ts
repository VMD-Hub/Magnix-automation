import { z } from "zod";

export const promotionPrizeAdminSchema = z.object({
  id: z.string().uuid().optional(),
  tier: z.enum(["SPECIAL", "FIRST", "SECOND", "THIRD", "CONSOLATION", "EMPTY"]),
  prizeType: z.enum(["PHYSICAL", "SERVICE", "VOUCHER", "EMPTY"]),
  label: z.string().min(1).max(200),
  shortLabel: z.string().min(1).max(40),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional().nullable(),
  weightPercent: z.number().min(0).max(1000),
  totalQty: z.number().int().min(0),
  remainingQty: z.number().int().min(0).optional(),
  activeFrom: z.string().datetime().optional().nullable(),
  activeUntil: z.string().datetime().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

export const promotionCampaignAdminSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  termsMarkdown: z.string().max(50000).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ENDED"]),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  maxSpinsPerAccount: z.number().int().min(1).max(20).optional(),
  maxSpinsPerDay: z.number().int().min(1).max(10).optional(),
  spinDurationMs: z.number().int().min(3000).max(15000).optional(),
  wheelLayout: z.array(z.string().uuid()).length(12).optional(),
  prizes: z.array(promotionPrizeAdminSchema).optional(),
});

export const promotionFulfillmentSchema = z.object({
  fulfillmentStatus: z.enum([
    "PENDING_CONTRACT",
    "CONTRACT_SIGNED",
    "DELIVERED",
    "EXPIRED",
    "VOID",
  ]),
});

export const promotionTermsUpdateSchema = z.object({
  termsMarkdown: z.string().min(1).max(50000),
});
