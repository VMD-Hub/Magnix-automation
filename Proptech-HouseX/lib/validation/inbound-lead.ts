import { z } from "zod";
import { INBOUND_OPS_STATUSES } from "@/lib/inbound/ops-meta";

export const inboundLeadListQuerySchema = z.object({
  segment: z.string().optional(),
  opsStatus: z.enum(INBOUND_OPS_STATUSES).optional(),
  queue: z.enum(["open", "all"]).optional().default("open"),
});

export const inboundLeadPatchSchema = z.object({
  opsStatus: z.enum(INBOUND_OPS_STATUSES).optional(),
  opsNote: z.string().max(4000).optional().nullable(),
});

export const inboundLeadConvertSchema = z.object({
  message: z.string().max(8000).optional(),
  projectId: z.string().uuid().optional().nullable(),
});
