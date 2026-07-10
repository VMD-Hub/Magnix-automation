import { z } from "zod";
import { leadStatusEnum } from "@/lib/validation/lead";

const leadContactChannelsSchema = z
  .object({
    phone: z.string().max(30).nullable().optional(),
    zalo: z.string().max(120).nullable().optional(),
    email: z.string().email().max(200).nullable().optional(),
    facebook: z.string().max(200).nullable().optional(),
  })
  .partial();

export const opsLeadListQuerySchema = z.object({
  status: leadStatusEnum.optional(),
  source: z.string().max(80).optional(),
  segment: z.enum(["NOXH", "CCTM"]).optional(),
});

export const opsLeadPatchSchema = z.object({
  status: leadStatusEnum.optional(),
  opsNote: z.string().max(2000).nullable().optional(),
  nurtureScriptId: z.string().max(80).nullable().optional(),
  channels: leadContactChannelsSchema.optional(),
  commission: z
    .object({
      amount: z.number().nonnegative().optional(),
      rate: z.number().min(0).max(1).optional(),
      dealValue: z.number().nonnegative().optional(),
      brokerId: z.string().uuid().optional(),
    })
    .optional(),
});
