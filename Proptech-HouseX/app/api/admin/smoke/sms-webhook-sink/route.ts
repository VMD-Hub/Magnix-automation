import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";

/**
 * Fail-closed SMS webhook sink for Round 2 Wave 3 smoke only.
 * Enable with SMOKE_SMS_SINK_ENABLED=true and point SMS_WEBHOOK_URL here
 * (e.g. http://127.0.0.1:3000/api/admin/smoke/sms-webhook-sink).
 * Does not send carrier SMS; proves provider HTTP + NurtureDispatch writeback.
 * Never logs phone/text body.
 */
function sinkEnabled(): boolean {
  const v = process.env.SMOKE_SMS_SINK_ENABLED?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

function secretOk(req: NextRequest): boolean {
  const expected = process.env.SMS_WEBHOOK_SECRET?.trim() || "";
  if (!expected) {
    // Smoke-only: allow unsigned when secret unset (still requires SMOKE_SMS_SINK_ENABLED).
    return true;
  }
  const got = req.headers.get("x-sms-webhook-secret")?.trim() || "";
  return got.length > 0 && got === expected;
}

export async function POST(req: NextRequest) {
  if (!sinkEnabled()) {
    return fail(403, "SMOKE_SINK_DISABLED", "SMOKE_SMS_SINK_ENABLED chưa bật.");
  }
  if (!secretOk(req)) {
    return fail(401, "UNAUTHORIZED", "Thiếu hoặc sai x-sms-webhook-secret.");
  }

  let leadId: string | null = null;
  let correlationId: string | null = null;
  try {
    const body = (await req.json()) as Record<string, unknown>;
    leadId = typeof body.leadId === "string" ? body.leadId : null;
    correlationId =
      typeof body.correlationId === "string" ? body.correlationId : null;
    if (body.type !== "telesales.sms") {
      return fail(422, "VALIDATION_ERROR", "type phải là telesales.sms.");
    }
  } catch {
    return fail(422, "VALIDATION_ERROR", "JSON body không hợp lệ.");
  }

  return ok({
    sink: "sms-webhook-smoke",
    accepted: true,
    leadId,
    correlationId,
  });
}
