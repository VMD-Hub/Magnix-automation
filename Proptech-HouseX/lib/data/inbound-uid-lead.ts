import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { enqueueEvent } from "@/lib/events/outbox";
import {
  mergeInboundOpsMeta,
  readInboundOpsMeta,
  type InboundOpsStatus,
} from "@/lib/inbound/ops-meta";
import { magnixInboundSource } from "@/lib/leads/source";
import {
  mergeInboundMetaPreservingReserved,
  magnixInboundPayloadSchema,
  type MagnixInboundPayload,
} from "@/lib/validation/inbound-uid";

export function parseMagnixInboundPayload(body: unknown): MagnixInboundPayload {
  return magnixInboundPayloadSchema.parse(body);
}

export async function upsertInboundUidLead(payload: MagnixInboundPayload) {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`
      SELECT "id" FROM "inbound_uid_leads"
      WHERE "normalized_key" = ${payload.normalized_key}
      FOR UPDATE
    `;
    const existing = await tx.inboundUidLead.findUnique({
      where: { normalizedKey: payload.normalized_key },
      select: { meta: true },
    });
    const meta = mergeInboundMetaPreservingReserved(
      existing?.meta,
      payload.meta,
    ) as Prisma.InputJsonValue;
    const data: Prisma.InboundUidLeadCreateInput = {
      uid: payload.uid,
      uidSource: payload.uid_source,
      normalizedKey: payload.normalized_key,
      capturedAt: new Date(payload.captured_at),
      text: payload.text ?? null,
      segment: payload.segment,
      score: payload.score,
      interestKey: payload.interest_key ?? null,
      tags: payload.tags,
      meta,
      classifyMethod: payload.classify_method,
      consentBasis: payload.consent_basis ?? null,
      status: payload.status,
    };

    return tx.inboundUidLead.upsert({
      where: { normalizedKey: payload.normalized_key },
      create: data,
      update: {
        text: data.text,
        segment: data.segment,
        score: data.score,
        interestKey: data.interestKey,
        tags: data.tags,
        meta,
        classifyMethod: data.classifyMethod,
        consentBasis: data.consentBasis,
        status: data.status,
        capturedAt: data.capturedAt,
      },
    });
  });
}

export async function listInboundUidLeadsForAdmin(filters: {
  segment?: string;
  opsStatus?: InboundOpsStatus;
  queue?: "open" | "all";
  limit?: number;
}) {
  const rows = await prisma.inboundUidLead.findMany({
    where: filters.segment ? { segment: filters.segment } : undefined,
    orderBy: [{ score: "desc" }, { capturedAt: "desc" }],
    take: filters.limit ?? 150,
  });

  return rows.filter((row) => {
    const ops = readInboundOpsMeta(row.meta);
    if (filters.opsStatus && ops.ops_status !== filters.opsStatus) return false;
    if (filters.queue === "open") {
      return !["converted", "dismissed"].includes(ops.ops_status);
    }
    return true;
  });
}

export async function getInboundUidLeadForAdmin(id: string) {
  return prisma.inboundUidLead.findUnique({ where: { id } });
}

export async function updateInboundUidLeadOps(
  id: string,
  patch: { opsStatus?: InboundOpsStatus; opsNote?: string | null },
) {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`
      SELECT "id" FROM "inbound_uid_leads"
      WHERE "id" = ${id}
      FOR UPDATE
    `;
    const existing = await tx.inboundUidLead.findUnique({ where: { id } });
    if (!existing) return null;

    const meta = mergeInboundOpsMeta(existing.meta, {
      ops_status: patch.opsStatus,
      ops_note: patch.opsNote,
    });

    return tx.inboundUidLead.update({
      where: { id },
      data: { meta: meta as Prisma.InputJsonValue },
    });
  });
}

export async function promoteInboundUidLeadInTransaction(
  tx: Prisma.TransactionClient,
  id: string,
  opts?: { message?: string; projectId?: string | null },
) {
  // Serialize promotion for this touch. The typed FK below is authoritative;
  // the JSON value remains only for backward-compatible admin consumers.
  await tx.$queryRaw`
    SELECT "id"
    FROM "inbound_uid_leads"
    WHERE "id" = ${id}
    FOR UPDATE
  `;

  const inbound = await tx.inboundUidLead.findUnique({ where: { id } });
  if (!inbound) return null;

  const linkedLeadId = inbound.platformLeadId;
  if (linkedLeadId) {
    const existingLead = await tx.lead.findUnique({
      where: { id: linkedLeadId },
    });
    if (existingLead) {
      return {
        inbound,
        lead: existingLead,
        created: false as const,
      };
    }
  }

  const message =
    opts?.message?.trim() ||
    inbound.text ||
    `[Magnix inbound ${inbound.segment}] uid_source=${inbound.uidSource}`;

  const lead = await tx.lead.create({
    data: {
      projectId: opts?.projectId ?? undefined,
      source: magnixInboundSource(inbound.uidSource),
      message,
      status: "NEW",
    },
  });

  const meta = mergeInboundOpsMeta(inbound.meta, {
    ops_status: "converted",
    platform_lead_id: lead.id,
  });

  const updatedInbound = await tx.inboundUidLead.update({
    where: { id },
    data: {
      platformLeadId: lead.id,
      meta: meta as Prisma.InputJsonValue,
    },
  });

  await enqueueEvent(
    tx,
    "acquisition.touch_promoted",
    {
      touchId: inbound.id,
      leadId: lead.id,
      uidSource: inbound.uidSource,
      segment: inbound.segment,
      projectId: lead.projectId,
      promotedAt: new Date().toISOString(),
    },
    `acquisition.touch_promoted:${inbound.id}`,
  );

  return { inbound: updatedInbound, lead, created: true as const };
}

/** Tạo lead sàn từ Magnix inbound — không gán CTV (ADR-013). */
export async function convertInboundUidToPlatformLead(
  id: string,
  opts?: { message?: string; projectId?: string | null },
) {
  return prisma.$transaction((tx) =>
    promoteInboundUidLeadInTransaction(tx, id, opts),
  );
}
