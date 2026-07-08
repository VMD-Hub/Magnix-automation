import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { enqueueEvent } from "@/lib/events/outbox";
import { buildLeadCreatedPayload } from "@/lib/events/lead-inquiry";
import {
  mergeInboundOpsMeta,
  readInboundOpsMeta,
  type InboundOpsStatus,
} from "@/lib/inbound/ops-meta";

const ingestSchema = z.object({
  uid: z.string().min(1),
  uid_source: z.string().min(1),
  normalized_key: z.string().min(1),
  captured_at: z.string().datetime({ offset: true }),
  text: z.string().optional().nullable(),
  segment: z.string().default("unclassified"),
  score: z.number().int().min(0).max(100).default(0),
  interest_key: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  meta: z.record(z.string(), z.unknown()).optional().default({}),
  classify_method: z.enum(["regex", "llm"]).default("regex"),
  consent_basis: z.string().optional().nullable(),
  status: z
    .enum(["raw", "classified", "review", "failed"])
    .default("classified"),
});

export type MagnixInboundPayload = z.infer<typeof ingestSchema>;

export function parseMagnixInboundPayload(body: unknown): MagnixInboundPayload {
  return ingestSchema.parse(body);
}

export async function upsertInboundUidLead(payload: MagnixInboundPayload) {
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
    meta: payload.meta as Prisma.InputJsonValue,
    classifyMethod: payload.classify_method,
    consentBasis: payload.consent_basis ?? null,
    status: payload.status,
  };

  return prisma.inboundUidLead.upsert({
    where: { normalizedKey: payload.normalized_key },
    create: data,
    update: {
      text: data.text,
      segment: data.segment,
      score: data.score,
      interestKey: data.interestKey,
      tags: data.tags,
      meta: data.meta,
      classifyMethod: data.classifyMethod,
      consentBasis: data.consentBasis,
      status: data.status,
      capturedAt: data.capturedAt,
    },
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
  const existing = await prisma.inboundUidLead.findUnique({ where: { id } });
  if (!existing) return null;

  const meta = mergeInboundOpsMeta(existing.meta, {
    ops_status: patch.opsStatus,
    ops_note: patch.opsNote,
  });

  return prisma.inboundUidLead.update({
    where: { id },
    data: { meta: meta as Prisma.InputJsonValue },
  });
}

/** Tạo lead sàn từ Magnix inbound — không gán CTV (ADR-013). */
export async function convertInboundUidToPlatformLead(
  id: string,
  opts?: { message?: string; projectId?: string | null },
) {
  return prisma.$transaction(async (tx) => {
    const inbound = await tx.inboundUidLead.findUnique({ where: { id } });
    if (!inbound) return null;

    const ops = readInboundOpsMeta(inbound.meta);
    if (ops.platform_lead_id) {
      const lead = await tx.lead.findUnique({
        where: { id: ops.platform_lead_id },
      });
      return { inbound, lead, created: false };
    }

    const message =
      opts?.message?.trim() ||
      inbound.text ||
      `[Magnix inbound ${inbound.segment}] uid_source=${inbound.uidSource}`;

    const lead = await tx.lead.create({
      data: {
        projectId: opts?.projectId ?? undefined,
        source: `magnix:${inbound.uidSource}`,
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
      data: { meta: meta as Prisma.InputJsonValue },
    });

    if (opts?.projectId) {
      const eventPayload = await buildLeadCreatedPayload(tx, lead, {
        name: "Khách Magnix inbound",
        phone: inbound.normalizedKey,
      });
      await enqueueEvent(
        tx,
        "lead.created",
        eventPayload,
        `lead.created:${lead.id}`,
      );
    }

    return { inbound: updatedInbound, lead, created: true };
  });
}
