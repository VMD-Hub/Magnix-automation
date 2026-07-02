import type { Prisma, PrismaClient } from "@prisma/client";

type Db = PrismaClient | Prisma.TransactionClient;

export type StatusEntity = "listing" | "lead" | "project" | "project_unit";

export interface StatusChange {
  entity: StatusEntity;
  entityId: string;
  fromStatus?: string | null;
  toStatus: string;
  reason?: string | null;
  actor?: string | null;
}

/**
 * Ghi một dòng audit khi entity đổi trạng thái. Gọi trong cùng transaction với
 * update để lịch sử và trạng thái luôn nhất quán. No-op nếu from === to.
 */
export async function recordStatusChange(
  db: Db,
  change: StatusChange,
): Promise<void> {
  if (change.fromStatus === change.toStatus) return;
  await db.statusHistory.create({
    data: {
      entity: change.entity,
      entityId: change.entityId,
      fromStatus: change.fromStatus ?? null,
      toStatus: change.toStatus,
      reason: change.reason ?? null,
      actor: change.actor ?? null,
    },
  });
}
