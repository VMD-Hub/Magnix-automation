import { NextRequest } from "next/server";
import { z } from "zod";
import { handleApiError, ok } from "@/lib/api/http";
import { cronAuthError } from "@/lib/api/cron-auth";
import { isEmailNurtureSendEnabled } from "@/lib/messaging/email-nurture-server-send";
import {
  runWaitlistDigestBatch,
  runWeeklyNewsletterBatch,
} from "@/lib/messaging/email-campaign-send";
import { isoWeekCampaignKey } from "@/lib/email/ab-subject";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  kind: z.enum(["weekly_newsletter", "waitlist_digest", "both"]).default("both"),
  limit: z.coerce.number().int().positive().max(200).default(50),
  weekKey: z.string().trim().max(16).optional(),
});

/**
 * POST /api/cron/email-nurture-weekly
 * ADR-017 P2 — gửi newsletter / waitlist digest theo batch (kill switch).
 */
export async function POST(req: NextRequest) {
  try {
    const authError = cronAuthError(req);
    if (authError) return authError;

    if (!isEmailNurtureSendEnabled()) {
      return ok({
        skipped: true,
        reason: "EMAIL_NURTURE_SEND_ENABLED_OFF",
        weekKey: isoWeekCampaignKey(),
      });
    }

    const parsed = querySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams),
    );
    const weekKey = parsed.weekKey || isoWeekCampaignKey();
    const correlationId = `cron-email-nurture:${weekKey}:${Date.now()}`;
    const actorId = "cron:email-nurture-weekly";

    const result: Record<string, unknown> = { weekKey, kind: parsed.kind };

    if (parsed.kind === "weekly_newsletter" || parsed.kind === "both") {
      result.weekly = await runWeeklyNewsletterBatch({
        actorId,
        correlationId: `${correlationId}:weekly`,
        limit: parsed.limit,
        weekKey,
      });
    }
    if (parsed.kind === "waitlist_digest" || parsed.kind === "both") {
      result.waitlistDigest = await runWaitlistDigestBatch({
        actorId,
        correlationId: `${correlationId}:digest`,
        limit: parsed.limit,
        weekKey,
      });
    }

    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
