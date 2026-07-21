import { NextRequest } from "next/server";
import { z } from "zod";
import { handleApiError, ok } from "@/lib/api/http";
import { cronAuthError } from "@/lib/api/cron-auth";
import { isEmailNurtureSendEnabled } from "@/lib/messaging/email-nurture-server-send";
import {
  runInactiveReengageBatch,
  runInactiveSuppressAfterReengage,
  runCctmUtilityBatch,
  syncEspAudienceFromHouseX,
  INACTIVE_DAYS_DEFAULT,
  REENGAGE_GRACE_DAYS_DEFAULT,
} from "@/lib/messaging/email-p3-campaigns";
import { isEspSyncEnabled } from "@/lib/email/esp-adapter";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  task: z
    .enum(["reengage", "suppress", "cctm", "esp_sync", "all"])
    .default("all"),
  limit: z.coerce.number().int().positive().max(200).default(50),
  inactiveDays: z.coerce.number().int().positive().max(365).optional(),
  graceDays: z.coerce.number().int().positive().max(90).optional(),
});

/**
 * POST /api/cron/email-nurture-hygiene
 * ADR-017 P3 — inactive re-engage / suppress · CCTM utility · ESP sync outbound.
 */
export async function POST(req: NextRequest) {
  try {
    const authError = cronAuthError(req);
    if (authError) return authError;

    const parsed = querySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams),
    );
    const correlationId = `cron-email-hygiene:${Date.now()}`;
    const actorId = "cron:email-nurture-hygiene";
    const result: Record<string, unknown> = {
      task: parsed.task,
      sendEnabled: isEmailNurtureSendEnabled(),
      espSyncEnabled: isEspSyncEnabled(),
    };

    if (parsed.task === "esp_sync" || parsed.task === "all") {
      result.espSync = await syncEspAudienceFromHouseX({
        limit: parsed.limit,
        actorId,
      });
    }

    if (
      (parsed.task === "reengage" || parsed.task === "all") &&
      isEmailNurtureSendEnabled()
    ) {
      result.reengage = await runInactiveReengageBatch({
        actorId,
        correlationId: `${correlationId}:reengage`,
        limit: parsed.limit,
        inactiveDays: parsed.inactiveDays ?? INACTIVE_DAYS_DEFAULT,
      });
    } else if (parsed.task === "reengage") {
      result.reengage = { skipped: true, reason: "EMAIL_NURTURE_SEND_ENABLED_OFF" };
    }

    if (parsed.task === "suppress" || parsed.task === "all") {
      result.suppress = await runInactiveSuppressAfterReengage({
        limit: parsed.limit,
        graceDays: parsed.graceDays ?? REENGAGE_GRACE_DAYS_DEFAULT,
        actorId,
      });
    }

    if (
      (parsed.task === "cctm" || parsed.task === "all") &&
      isEmailNurtureSendEnabled()
    ) {
      result.cctm = await runCctmUtilityBatch({
        actorId,
        correlationId: `${correlationId}:cctm`,
        limit: parsed.limit,
      });
    } else if (parsed.task === "cctm") {
      result.cctm = { skipped: true, reason: "EMAIL_NURTURE_SEND_ENABLED_OFF" };
    }

    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
