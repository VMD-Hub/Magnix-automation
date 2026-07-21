import { prisma } from "@/lib/prisma";
import { toPrismaJsonObject } from "@/lib/sales-core/json";

export type EmailEngagementType =
  | "open"
  | "click"
  | "bounce"
  | "complaint"
  | "delivered";

export async function recordEmailEngagementEvent(input: {
  type: EmailEngagementType;
  leadId?: string | null;
  enrollmentId?: string | null;
  dispatchId?: string | null;
  providerMessageId?: string | null;
  campaignKey?: string | null;
  payload?: Record<string, unknown>;
  occurredAt?: Date;
  idempotencyKey: string;
}) {
  const prior = await prisma.emailEngagementEvent.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
  });
  if (prior) return { event: prior, created: false as const };

  const event = await prisma.emailEngagementEvent.create({
    data: {
      type: input.type,
      leadId: input.leadId ?? null,
      enrollmentId: input.enrollmentId ?? null,
      dispatchId: input.dispatchId ?? null,
      providerMessageId: input.providerMessageId ?? null,
      campaignKey: input.campaignKey ?? null,
      payload: toPrismaJsonObject(input.payload ?? {}),
      occurredAt: input.occurredAt ?? new Date(),
      idempotencyKey: input.idempotencyKey,
    },
  });
  return { event, created: true as const };
}
