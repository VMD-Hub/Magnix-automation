import { NextRequest } from "next/server";
import { created, fail, handleApiError } from "@/lib/api/http";
import {
  parseMagnixInboundPayload,
  upsertInboundUidLead,
} from "@/lib/data/inbound-uid-lead";

function isIngestAuthorized(req: NextRequest): boolean {
  const secret = process.env.MAGNIX_INGEST_SECRET?.trim();
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  const header =
    req.headers.get("x-magnix-ingest-secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return header === secret;
}

/** Magnix / n8n — upsert inbound UID vào Postgres (ADR-013). */
export async function POST(req: NextRequest) {
  try {
    if (!isIngestAuthorized(req)) {
      return fail(401, "UNAUTHORIZED", "Ingest secret không hợp lệ.");
    }

    const payload = parseMagnixInboundPayload(await req.json());
    const record = await upsertInboundUidLead(payload);

    return created({
      id: record.id,
      normalized_key: record.normalizedKey,
      status: record.status,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
