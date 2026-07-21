import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { verifyEmailUnsubscribeToken } from "@/lib/email/unsubscribe-token";
import { withdrawMarketingEmailConsent } from "@/lib/sales-core/marketing-email-consent";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  token: z.string().trim().min(16).max(2000),
});

/**
 * POST /api/consent/email-unsubscribe
 * One-click unsubscribe (ADR-017 P0): WITHDRAWN + cancel email nurture enrollments.
 * GET also accepted with ?token= for List-Unsubscribe compatibility later.
 */
async function handleUnsubscribe(token: string) {
  const verified = verifyEmailUnsubscribeToken(token);
  if (!verified) {
    return fail(400, "INVALID_TOKEN", "Link hủy đăng ký không hợp lệ hoặc đã hết hạn.");
  }

  const lead = await prisma.lead.findUnique({
    where: { id: verified.leadId },
    select: { id: true },
  });
  if (!lead) {
    return fail(404, "LEAD_NOT_FOUND", "Không tìm thấy đăng ký tương ứng.");
  }

  const result = await withdrawMarketingEmailConsent({
    leadId: lead.id,
    source: "email:unsubscribe",
    proofType: "one_click_unsubscribe",
    withdrawKey: verified.tokenKey,
    actorId: "system:email-unsubscribe",
  });

  if (!result.withdrawn) {
    return fail(
      500,
      "WITHDRAW_FAILED",
      "Không hủy được đăng ký email. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
      { reason: result.reason },
    );
  }

  return ok({
    status: "unsubscribed",
    enrollmentsCancelled: result.enrollmentsCancelled,
  });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => ({}));
    const { token } = bodySchema.parse(json);
    return handleUnsubscribe(token);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token")?.trim() ?? "";
    if (!token) {
      return fail(400, "MISSING_TOKEN", "Thiếu mã hủy đăng ký.");
    }
    return handleUnsubscribe(token);
  } catch (err) {
    return handleApiError(err);
  }
}
