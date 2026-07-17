import { NextRequest } from "next/server";
import { created, fail, handleApiError } from "@/lib/api/http";
import {
  parseMagnixInboundPayload,
  upsertInboundUidLead,
} from "@/lib/data/inbound-uid-lead";
import { isMagnixIngestAuthorized } from "@/lib/validation/inbound-uid";

/** Magnix / n8n — upsert inbound UID vào Postgres (ADR-013). */
export async function POST(req: NextRequest) {
  try {
    if (!isMagnixIngestAuthorized(req.headers)) {
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
