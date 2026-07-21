import type { NextRequest } from "next/server";
import { z } from "zod";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import { requireIdempotencyKey, handleSalesCoreError } from "@/lib/sales-core/http";
import {
  runEmailMarketingAction,
  type EmailMarketingAction,
} from "@/lib/admin/email-marketing-ops";
import { SalesCoreRuleError } from "@/lib/sales-core/domain";

const bodySchema = z
  .object({
    action: z.enum([
      "grant",
      "withdraw",
      "enroll",
      "stop",
      "send_welcome",
      "send_campaign",
      "esp_sync",
    ]),
    leadId: z.string().trim().min(1).max(128).optional(),
    scriptId: z.string().trim().min(1).max(128).optional(),
    stepIndex: z.number().int().min(1).max(3).optional(),
  })
  .strict();

/** Super: grant/withdraw/enroll/stop/send/esp_sync. */
export async function POST(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản thao tác Email marketing.");
    }
    const idempotencyKey = requireIdempotencyKey(req);
    const body = bodySchema.parse(await req.json());
    const correlationId = `admin-email:${body.action}:${Date.now()}`;

    const result = await runEmailMarketingAction({
      action: body.action as EmailMarketingAction,
      leadId: body.leadId,
      scriptId: body.scriptId,
      stepIndex: body.stepIndex,
      actorId: "admin:super",
      correlationId,
      idempotencyKey,
    });
    return ok(result);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "leadId_required") {
        return fail(400, "VALIDATION", "Thiếu leadId.");
      }
      if (err.message === "invalid_email_script") {
        return fail(400, "VALIDATION", "scriptId không phải kênh email.");
      }
      if (err.message === "unsupported_campaign_script") {
        return fail(400, "VALIDATION", "Script chưa hỗ trợ send_campaign.");
      }
    }
    if (err instanceof SalesCoreRuleError) {
      return handleSalesCoreError(err);
    }
    return handleApiError(err);
  }
}
