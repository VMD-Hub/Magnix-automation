import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

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
