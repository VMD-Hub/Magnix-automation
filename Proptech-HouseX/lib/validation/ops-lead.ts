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

export const opsLeadCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(8).max(30),
  source: z
    .enum(["hot:manual", "ads:offline", "partner", "ops:manual"])
    .optional(),
  segment: z.enum(["NOXH", "CCTM"]).nullable().optional(),
  note: z.string().max(2000).nullable().optional(),
  actorId: z.string().trim().min(1).max(120).default("ops-ui"),
});

export const opsLeadContactSchema = z.object({
  result: z.enum([
    "CONNECTED",
    "SEND_INFO",
    "NO_ANSWER",
    "WRONG_NUMBER",
    "HARD_REJECT",
    "NOT_THIS_PROJECT",
    "SMS_SENT",
    "ZALO_OPENED",
  ]),
  note: z.string().max(2000).nullable().optional(),
  actorId: z.string().trim().min(1).max(120).default("ops-ui"),
  correlationId: z.string().trim().min(1).max(200),
});

export const opsLeadServerSendSchema = z.object({
  channels: z
    .array(z.enum(["oa", "sms"]))
    .min(1)
    .max(2),
  actorId: z.string().trim().min(1).max(120).default("ops-ui"),
  correlationId: z.string().trim().min(1).max(200),
});
