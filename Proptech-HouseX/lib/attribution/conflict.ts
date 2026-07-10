import type {
  AttributionConflictKind,
  AttributionConflictResolution,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ClaimRejectReason } from "@/lib/noxh-case/attribution-claim";
import { enqueueEvent } from "@/lib/events/outbox";
import type { OutboxPayloads } from "@/lib/events/types";
import { maskLeadPhone } from "@/lib/leads/ops-meta";

type Tx = Prisma.TransactionClient;

export const CONFLICT_KIND_LABEL: Record<AttributionConflictKind, string> = {
  CTV_CLAIM_BLOCKED: "CTV claim bị chặn",
  OPS_LEAD_CTV_LOCK: "Lead Ops trùng CTV đang lock",
};

export const CONFLICT_REJECT_LABEL: Record<string, string> = {
  PLATFORM_LEAD_ACTIVE: "Ops đang tư vấn (R4)",
  ACTIVE_CASE_OTHER_CTV: "CTV khác đang giữ hồ sơ (R3)",
};

export const CONFLICT_RESOLUTION_LABEL: Record<
  AttributionConflictResolution,
  string
> = {
  KEEP_PLATFORM: "Giữ Ops",
  RELEASE_TO_CTV: "Chuyển CTV",
  SPLIT_LANE: "Chia lane",
  DISMISS_BOTH: "Đóng cả hai",
};

export type QueueConflictInput = {
  kind: AttributionConflictKind;
  normalizedPhone: string;
  rejectReason?: ClaimRejectReason | string;
  customerId?: string | null;
  platformLeadId?: string | null;
  noxhCaseId?: string | null;
  brokerId?: string | null;
  meta?: Record<string, unknown>;
};

const conflictInclude = {
  customer: { select: { id: true, name: true, phone: true } },
  platformLead: {
    select: {
      id: true,
      status: true,
      source: true,
      segment: true,
      message: true,
      updatedAt: true,
    },
  },
  noxhCase: {
    select: {
      id: true,
      code: true,
      customerName: true,
      phone: true,
      caseStatus: true,
      lockExpiresAt: true,
      brokerId: true,
      broker: { select: { id: true, fullName: true, ctvCode: true } },
    },
  },
  broker: { select: { id: true, fullName: true, ctvCode: true } },
} satisfies Prisma.AttributionConflictInclude;

export function buildAttributionConflictNotifyPayload(input: {
  phase: "opened" | "resolved";
  conflictId: string;
  kind: AttributionConflictKind;
  normalizedPhone: string;
  brokerId: string;
  rejectReason?: string | null;
  resolution?: AttributionConflictResolution | null;
  platformLeadSource?: string | null;
  noxhCaseCode?: string | null;
  customerName?: string | null;
}): OutboxPayloads["attribution.conflict"] {
  return {
    phase: input.phase,
    conflictId: input.conflictId,
    kind: input.kind,
    normalizedPhoneMasked: maskLeadPhone(input.normalizedPhone) ?? "***",
    brokerId: input.brokerId,
    rejectReason: input.rejectReason ?? null,
    rejectLabel: input.rejectReason
      ? (CONFLICT_REJECT_LABEL[input.rejectReason] ?? input.rejectReason)
      : null,
    resolution: input.resolution ?? null,
    resolutionLabel: input.resolution
      ? CONFLICT_RESOLUTION_LABEL[input.resolution]
      : null,
    platformLeadSource: input.platformLeadSource ?? null,
    noxhCaseCode: input.noxhCaseCode ?? null,
    customerName: input.customerName ?? null,
  };
}

async function enqueueAttributionConflictNotify(
  tx: Tx,
  payload: OutboxPayloads["attribution.conflict"],
): Promise<void> {
  if (!payload.brokerId.trim()) return;
  await enqueueEvent(
    tx,
    "attribution.conflict",
    payload,
    `attribution.conflict:${payload.phase}:${payload.conflictId}`,
  );
}

/** Upsert hàng đợi OPEN — tránh nhân đôi cùng SĐT + kind. */
export async function queueAttributionConflict(
  tx: Tx,
  input: QueueConflictInput,
): Promise<void> {
  const meta = (input.meta ?? {}) as Prisma.InputJsonValue;

  const existing = await tx.attributionConflict.findFirst({
    where: {
      normalizedPhone: input.normalizedPhone,
      kind: input.kind,
      status: "OPEN",
    },
    select: { id: true, meta: true },
  });

  if (existing) {
    const merged = {
      ...(typeof existing.meta === "object" && existing.meta
        ? (existing.meta as Record<string, unknown>)
        : {}),
      ...(input.meta ?? {}),
      lastTriggeredAt: new Date().toISOString(),
    };
    await tx.attributionConflict.update({
      where: { id: existing.id },
      data: {
        rejectReason: input.rejectReason ?? undefined,
        customerId: input.customerId ?? undefined,
        platformLeadId: input.platformLeadId ?? undefined,
        noxhCaseId: input.noxhCaseId ?? undefined,
        brokerId: input.brokerId ?? undefined,
        meta: merged as Prisma.InputJsonValue,
      },
    });
    return;
  }

  const created = await tx.attributionConflict.create({
    data: {
      normalizedPhone: input.normalizedPhone,
      kind: input.kind,
      rejectReason: input.rejectReason,
      customerId: input.customerId ?? undefined,
      platformLeadId: input.platformLeadId ?? undefined,
      noxhCaseId: input.noxhCaseId ?? undefined,
      brokerId: input.brokerId ?? undefined,
      meta: {
        ...((input.meta ?? {}) as object),
        firstTriggeredAt: new Date().toISOString(),
      } as Prisma.InputJsonValue,
    },
    select: {
      id: true,
      kind: true,
      normalizedPhone: true,
      brokerId: true,
      rejectReason: true,
      platformLead: { select: { source: true } },
      noxhCase: { select: { code: true } },
    },
  });

  if (created.brokerId) {
    const customerName =
      typeof input.meta?.customerName === "string"
        ? input.meta.customerName
        : null;
    await enqueueAttributionConflictNotify(
      tx,
      buildAttributionConflictNotifyPayload({
        phase: "opened",
        conflictId: created.id,
        kind: created.kind,
        normalizedPhone: created.normalizedPhone,
        brokerId: created.brokerId,
        rejectReason: created.rejectReason,
        platformLeadSource: created.platformLead?.source ?? null,
        noxhCaseCode: created.noxhCase?.code ?? null,
        customerName,
      }),
    );
  }
}

/** Ghi conflict khi CTV claim bị R3/R4 chặn. */
export async function queueConflictFromCtvClaim(
  tx: Tx,
  params: {
    normalizedPhone: string;
    brokerId: string;
    reason: ClaimRejectReason;
    customerName?: string;
  },
): Promise<void> {
  if (
    params.reason !== "PLATFORM_LEAD_ACTIVE" &&
    params.reason !== "ACTIVE_CASE_OTHER_CTV"
  ) {
    return;
  }

  const customer = await tx.customer.findUnique({
    where: { normalizedPhone: params.normalizedPhone },
    select: { id: true },
  });

  let platformLeadId: string | undefined;
  if (customer) {
    const platformLead = await tx.lead.findFirst({
      where: {
        customerId: customer.id,
        assignedBrokerId: null,
        status: { in: ["CONTACTED", "QUALIFIED"] },
      },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });
    platformLeadId = platformLead?.id;
  }

  let noxhCaseId: string | undefined;
  let rivalBrokerId: string | undefined;
  const now = new Date();
  const activeCase = await tx.noxhCase.findFirst({
    where: {
      normalizedPhone: params.normalizedPhone,
      caseStatus: "ACTIVE",
      OR: [
        { attributionLockedAt: { not: null } },
        { lockExpiresAt: { gt: now } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    select: { id: true, brokerId: true },
  });
  if (activeCase) {
    noxhCaseId = activeCase.id;
    if (activeCase.brokerId && activeCase.brokerId !== params.brokerId) {
      rivalBrokerId = activeCase.brokerId;
    }
  }

  await queueAttributionConflict(tx, {
    kind: "CTV_CLAIM_BLOCKED",
    normalizedPhone: params.normalizedPhone,
    rejectReason: params.reason,
    customerId: customer?.id,
    platformLeadId,
    noxhCaseId,
    brokerId: params.brokerId,
    meta: {
      customerName: params.customerName,
      rivalBrokerId,
    },
  });
}

/** Ops tạo lead trong khi CTV đang giữ lock hồ sơ ACTIVE. */
export async function queueConflictFromOpsLead(
  tx: Tx,
  params: {
    normalizedPhone: string;
    customerId: string;
    platformLeadId: string;
    assignedBrokerId: string | null;
  },
): Promise<void> {
  if (params.assignedBrokerId) return;

  const now = new Date();
  const ctvCase = await tx.noxhCase.findFirst({
    where: {
      normalizedPhone: params.normalizedPhone,
      caseStatus: "ACTIVE",
      brokerId: { not: null },
      OR: [
        { attributionLockedAt: { not: null } },
        { lockExpiresAt: { gt: now } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    select: { id: true, brokerId: true },
  });

  if (!ctvCase?.brokerId) return;

  await queueAttributionConflict(tx, {
    kind: "OPS_LEAD_CTV_LOCK",
    normalizedPhone: params.normalizedPhone,
    customerId: params.customerId,
    platformLeadId: params.platformLeadId,
    noxhCaseId: ctvCase.id,
    brokerId: ctvCase.brokerId,
  });
}

export async function listAttributionConflictsForAdmin(filters: {
  status?: "OPEN" | "ALL";
  limit?: number;
}) {
  const status =
    filters.status === "ALL" ? undefined : ("OPEN" as const);

  return prisma.attributionConflict.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: filters.limit ?? 100,
    include: conflictInclude,
  });
}

export async function getAttributionConflictForAdmin(id: string) {
  return prisma.attributionConflict.findUnique({
    where: { id },
    include: conflictInclude,
  });
}

async function writeAttributionAudit(
  tx: Tx,
  params: {
    customerId: string | null | undefined;
    reason: string;
    fromBroker?: string | null;
    toBroker?: string | null;
  },
) {
  if (!params.customerId) return;
  await tx.attributionEvent.create({
    data: {
      customerId: params.customerId,
      fromBroker: params.fromBroker ?? null,
      toBroker: params.toBroker ?? null,
      reason: params.reason,
    },
  });
}

export async function resolveAttributionConflict(
  id: string,
  input: {
    resolution: AttributionConflictResolution;
    note?: string;
    resolvedBy?: string;
  },
) {
  return prisma.$transaction(async (tx) => {
    const conflict = await tx.attributionConflict.findUnique({
      where: { id },
      include: conflictInclude,
    });
    if (!conflict) return null;
    if (conflict.status !== "OPEN") {
      throw new ConflictResolveError(
        "ALREADY_RESOLVED",
        "Xung đột đã được xử lý trước đó.",
      );
    }

    const note = input.note?.trim() || null;
    const now = new Date();

    switch (input.resolution) {
      case "KEEP_PLATFORM":
        await writeAttributionAudit(tx, {
          customerId: conflict.customerId,
          reason: "conflict_kept_platform",
          fromBroker: conflict.brokerId,
        });
        break;

      case "RELEASE_TO_CTV": {
        if (conflict.platformLeadId) {
          const lead = await tx.lead.findUnique({
            where: { id: conflict.platformLeadId },
            select: { message: true },
          });
          await tx.lead.update({
            where: { id: conflict.platformLeadId },
            data: {
              status: "LOST",
              message: [lead?.message, note ? `[Ops] ${note}` : "[Ops] Chuyển CTV"]
                .filter(Boolean)
                .join("\n"),
            },
          });
        }

        if (
          conflict.rejectReason === "ACTIVE_CASE_OTHER_CTV" &&
          conflict.noxhCaseId &&
          conflict.brokerId
        ) {
          const rivalId = readRivalBrokerId(conflict.meta);
          await tx.noxhCase.update({
            where: { id: conflict.noxhCaseId },
            data: { brokerId: conflict.brokerId },
          });
          if (conflict.customerId) {
            await tx.attributionLock.upsert({
              where: { customerId: conflict.customerId },
              create: {
                customerId: conflict.customerId,
                brokerId: conflict.brokerId,
                source: "conflict_release_to_ctv",
                expiresAt: new Date(now.getTime() + 30 * 24 * 3600 * 1000),
              },
              update: {
                brokerId: conflict.brokerId,
                source: "conflict_release_to_ctv",
                lockedAt: now,
              },
            });
          }
          await writeAttributionAudit(tx, {
            customerId: conflict.customerId,
            reason: "conflict_release_to_ctv",
            fromBroker: rivalId,
            toBroker: conflict.brokerId,
          });
        } else {
          await writeAttributionAudit(tx, {
            customerId: conflict.customerId,
            reason: "conflict_release_to_ctv",
            toBroker: conflict.brokerId,
          });
        }
        break;
      }

      case "SPLIT_LANE":
        await writeAttributionAudit(tx, {
          customerId: conflict.customerId,
          reason: "conflict_split_lane",
          fromBroker: conflict.brokerId,
        });
        break;

      case "DISMISS_BOTH":
        if (conflict.platformLeadId) {
          await tx.lead.update({
            where: { id: conflict.platformLeadId },
            data: { status: "LOST" },
          });
        }
        if (conflict.noxhCaseId) {
          await tx.noxhCase.update({
            where: { id: conflict.noxhCaseId },
            data: { caseStatus: "RELEASED", completedAt: now },
          });
        }
        await writeAttributionAudit(tx, {
          customerId: conflict.customerId,
          reason: "conflict_dismissed",
          fromBroker: conflict.brokerId,
        });
        break;
    }

    const updated = await tx.attributionConflict.update({
      where: { id },
      data: {
        status: input.resolution === "DISMISS_BOTH" ? "DISMISSED" : "RESOLVED",
        resolution: input.resolution,
        resolutionNote: note,
        resolvedBy: input.resolvedBy ?? "admin",
        resolvedAt: now,
      },
      include: conflictInclude,
    });

    if (updated.brokerId) {
      const meta =
        updated.meta && typeof updated.meta === "object"
          ? (updated.meta as Record<string, unknown>)
          : {};
      await enqueueAttributionConflictNotify(
        tx,
        buildAttributionConflictNotifyPayload({
          phase: "resolved",
          conflictId: updated.id,
          kind: updated.kind,
          normalizedPhone: updated.normalizedPhone,
          brokerId: updated.brokerId,
          rejectReason: updated.rejectReason,
          resolution: input.resolution,
          platformLeadSource: updated.platformLead?.source ?? null,
          noxhCaseCode: updated.noxhCase?.code ?? null,
          customerName:
            updated.customer?.name ??
            (typeof meta.customerName === "string" ? meta.customerName : null),
        }),
      );
    }

    return updated;
  });
}

function readRivalBrokerId(meta: unknown): string | null {
  if (!meta || typeof meta !== "object") return null;
  const id = (meta as Record<string, unknown>).rivalBrokerId;
  return typeof id === "string" ? id : null;
}

export class ConflictResolveError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ConflictResolveError";
  }
}

export function serializeConflictListItem(
  row: Awaited<ReturnType<typeof listAttributionConflictsForAdmin>>[number],
) {
  const meta =
    row.meta && typeof row.meta === "object"
      ? (row.meta as Record<string, unknown>)
      : {};
  return {
    id: row.id,
    normalizedPhone: row.normalizedPhone,
    kind: row.kind,
    kindLabel: CONFLICT_KIND_LABEL[row.kind],
    status: row.status,
    rejectReason: row.rejectReason,
    rejectLabel: row.rejectReason
      ? (CONFLICT_REJECT_LABEL[row.rejectReason] ?? row.rejectReason)
      : null,
    customerName:
      row.customer?.name ??
      (typeof meta.customerName === "string" ? meta.customerName : null),
    platformLeadStatus: row.platformLead?.status ?? null,
    platformLeadSource: row.platformLead?.source ?? null,
    noxhCaseCode: row.noxhCase?.code ?? null,
    brokerName: row.broker?.fullName ?? row.noxhCase?.broker?.fullName ?? null,
    ctvCode: row.broker?.ctvCode ?? row.noxhCase?.broker?.ctvCode ?? null,
    resolution: row.resolution,
    resolutionLabel: row.resolution
      ? CONFLICT_RESOLUTION_LABEL[row.resolution]
      : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function serializeConflictDetail(
  row: NonNullable<Awaited<ReturnType<typeof getAttributionConflictForAdmin>>>,
) {
  const base = serializeConflictListItem(row);
  return {
    ...base,
    resolutionNote: row.resolutionNote,
    resolvedBy: row.resolvedBy,
    resolvedAt: row.resolvedAt?.toISOString() ?? null,
    meta: row.meta,
    customer: row.customer,
    platformLead: row.platformLead,
    noxhCase: row.noxhCase,
    broker: row.broker,
  };
}
