import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import {
  handleProviderEmailEvent,
  normalizeInboundEmailProviderPayload,
} from "@/lib/email/email-provider-events";

export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/email-provider
 * Inbound ESP / n8n events (bounce, complaint, open, click).
 * Auth: header x-email-webhook-secret === EMAIL_WEBHOOK_SECRET
 *   (or Authorization Bearer EMAIL_WEBHOOK_SECRET).
 */
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.EMAIL_WEBHOOK_SECRET?.trim();
    if (!secret) {
      return fail(503, "WEBHOOK_UNCONFIGURED", "EMAIL_WEBHOOK_SECRET chưa cấu hình.");
    }

    const headerSecret =
      req.headers.get("x-email-webhook-secret")?.trim() ||
      req.headers.get("x-email-secret")?.trim() ||
      "";
    const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
    if (headerSecret !== secret && bearer !== secret) {
      return fail(401, "UNAUTHORIZED", "Secret không hợp lệ.");
    }

    const body = (await req.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    if (!body || typeof body !== "object") {
      return fail(400, "INVALID_BODY", "Payload JSON không hợp lệ.");
    }

    const normalized = normalizeInboundEmailProviderPayload(body);
    if (!normalized) {
      return fail(422, "UNSUPPORTED_EVENT", "Loại sự kiện email không hỗ trợ.");
    }

    const result = await handleProviderEmailEvent(normalized);
    return ok({
      type: normalized.type,
      suppressed: result.suppressed,
      engagementRecorded: result.engagementRecorded,
      reason: result.reason ?? null,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
