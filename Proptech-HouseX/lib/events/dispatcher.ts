import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { backoffSeconds, handleEvent } from "./handlers";

export interface DispatchResult {
  claimed: number;
  done: number;
  retry: number;
  dead: number;
}

/**
 * Xử lý outbox: lấy event PENDING đã tới hạn, claim từng cái atomically
 * (updateMany where status=PENDING → PROCESSING) để an toàn với nhiều worker,
 * chạy handler, rồi DONE / retry(backoff) / DEAD khi vượt maxAttempts.
 */
export async function dispatchOutbox(
  opts: { limit?: number } = {},
  db: PrismaClient = prisma,
): Promise<DispatchResult> {
  const limit = opts.limit ?? 20;
  const now = new Date();

  const candidates = await db.outboxEvent.findMany({
    where: { status: "PENDING", availableAt: { lte: now } },
    orderBy: { availableAt: "asc" },
    take: limit,
    select: { id: true },
  });

  const result: DispatchResult = {
    claimed: 0,
    done: 0,
    retry: 0,
    dead: 0,
  };

  for (const c of candidates) {
    const claim = await db.outboxEvent.updateMany({
      where: { id: c.id, status: "PENDING" },
      data: { status: "PROCESSING", lockedAt: new Date() },
    });
    if (claim.count !== 1) continue; // worker khác đã giành
    result.claimed++;

    const ev = await db.outboxEvent.findUnique({ where: { id: c.id } });
    if (!ev) continue;

    try {
      await handleEvent(ev.type, ev.payload);
      await db.outboxEvent.update({
        where: { id: c.id },
        data: {
          status: "DONE",
          processedAt: new Date(),
          lockedAt: null,
          lastError: null,
        },
      });
      result.done++;
    } catch (e) {
      const attempts = ev.attempts + 1;
      const isDead = attempts >= ev.maxAttempts;
      await db.outboxEvent.update({
        where: { id: c.id },
        data: {
          status: isDead ? "DEAD" : "PENDING",
          attempts,
          lockedAt: null,
          availableAt: new Date(Date.now() + backoffSeconds(attempts) * 1000),
          lastError: (e instanceof Error ? e.message : String(e)).slice(0, 500),
        },
      });
      if (isDead) result.dead++;
      else result.retry++;
    }
  }

  return result;
}
