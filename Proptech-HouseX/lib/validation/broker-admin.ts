import { z } from "zod";
import { brokerTypeEnum } from "@/lib/validation/listing";

export const adminBrokerTypePatchSchema = z.object({
  brokerType: brokerTypeEnum,
});

export const adminAssignLeadToInternalSchema = z.object({
  brokerId: z.string().uuid(),
  reason: z.string().max(500).nullable().optional(),
  actorId: z.string().trim().min(1).max(120).default("admin:super"),
  correlationId: z.string().trim().min(1).max(200),
});
