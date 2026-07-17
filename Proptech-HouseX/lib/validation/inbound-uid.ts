import { z } from "zod";

const normalizedKeySchema = z.string().trim().min(1).max(1024);

export const RESERVED_INBOUND_META_KEYS = new Set([
  "ops_status",
  "ops_note",
  "platform_lead_id",
  "noxh_case_id",
  "noxh_case_code",
]);

export function stripReservedInboundMeta(
  meta: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(meta).filter(
      ([key]) => !RESERVED_INBOUND_META_KEYS.has(key),
    ),
  );
}

export function mergeInboundMetaPreservingReserved(
  existing: unknown,
  external: Record<string, unknown>,
): Record<string, unknown> {
  const merged = { ...stripReservedInboundMeta(external) };
  if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
    return merged;
  }
  for (const key of RESERVED_INBOUND_META_KEYS) {
    if (Object.prototype.hasOwnProperty.call(existing, key)) {
      merged[key] = (existing as Record<string, unknown>)[key];
    }
  }
  return merged;
}

export function deriveInboundNormalizedKey(
  uidSource: string,
  uid: string,
): string {
  return `${uidSource.trim()}:${uid.trim()}`;
}

const inboundUidBaseSchema = z.object({
  uid: z.string().trim().min(1).max(512),
  uid_source: z.string().trim().min(1).max(128),
  normalized_key: normalizedKeySchema.optional(),
  captured_at: z.string().datetime({ offset: true }),
  text: z.string().max(50_000).optional().nullable(),
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

export const magnixInboundPayloadSchema = inboundUidBaseSchema.transform(
  (payload, ctx) => {
    const normalizedKey = deriveInboundNormalizedKey(
      payload.uid_source,
      payload.uid,
    );
    if (
      payload.normalized_key !== undefined &&
      payload.normalized_key !== normalizedKey
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["normalized_key"],
        message: "normalized_key does not match uid_source and uid",
      });
      return z.NEVER;
    }

    return {
      ...payload,
      normalized_key: normalizedKey,
      meta: stripReservedInboundMeta(payload.meta),
    };
  },
);

export type MagnixInboundPayload = z.infer<
  typeof magnixInboundPayloadSchema
>;

export function isMagnixIngestAuthorized(
  headers: Headers,
  expectedSecret = process.env.MAGNIX_INGEST_SECRET,
): boolean {
  const secret = expectedSecret?.trim();
  if (!secret) return false;

  const supplied =
    headers.get("x-magnix-ingest-secret") ??
    headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return supplied === secret;
}
