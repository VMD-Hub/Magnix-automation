import type { Prisma } from "@prisma/client";
import type { OutboxEventType, OutboxPayloads } from "./types";

type Db = Prisma.TransactionClient | {
  outboxEvent: { createMany: (args: unknown) => Promise<unknown> };
};

export type OutboxEnvelope = {
  aggregateType: string;
  aggregateId: string;
  correlationId: string;
  occurredAt?: Date;
  schemaVersion?: number;
};

/**
 * Ghi sự kiện vào outbox — GỌI TRONG transaction cùng thay đổi domain để đảm bảo
 * atomic (transactional outbox). `dedupeKey` (unique) chống enqueue trùng;
 * `skipDuplicates` để không làm vỡ transaction khi key đã tồn tại.
 */
export async function enqueueEvent<T extends OutboxEventType>(
  tx: Db,
  type: T,
  payload: OutboxPayloads[T],
  dedupeKey?: string,
  envelope?: OutboxEnvelope,
): Promise<void> {
  await tx.outboxEvent.createMany({
    data: [
      {
        type,
        payload: payload as Prisma.InputJsonValue,
        dedupeKey: dedupeKey ?? null,
        aggregateType: envelope?.aggregateType ?? null,
        aggregateId: envelope?.aggregateId ?? null,
        correlationId: envelope?.correlationId ?? null,
        occurredAt: envelope?.occurredAt,
        schemaVersion: envelope?.schemaVersion ?? 1,
      },
    ],
    skipDuplicates: true,
  });
}
