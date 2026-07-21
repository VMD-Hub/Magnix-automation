import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { created, fail, handleApiError } from "@/lib/api/http";
import { noxhLoanQuickLeadSchema } from "@/lib/validation/noxh-loan-quick-check";
import { normalizeVnPhone, isValidVnPhone } from "@/lib/phone";
import { isRateLimited, kv } from "@/lib/redis";
import { ipHash } from "@/lib/api/request-meta";
import { enqueueEvent } from "@/lib/events/outbox";
import { forwardEventToWebhook } from "@/lib/events/handlers";
import { screenLoanAge } from "@/lib/finance/noxh-loan-age-screen";
import {
  noxhLoanQuickLeadMessage,
  quickCheckTier,
} from "@/lib/finance/noxh-loan-quick-lead";
import { grantMarketingEmailConsent } from "@/lib/sales-core/marketing-email-consent";
import { tryEnrollNoxhWelcomeAfterConsent } from "@/lib/messaging/email-nurture-server-send";
import { LEAD_SOURCE } from "@/lib/leads/source";

const RATE_MAX = Number(process.env.LEAD_RATE_MAX ?? "20");
const RATE_WINDOW = Number(process.env.LEAD_RATE_WINDOW_SEC ?? "3600");

/**
 * POST /api/tools/noxh-loan-quick-check — lead từ lead magnet kiểm tra vay NOXH 60 giây.
 * Chỉ lưu tóm tắt (tier, tuổi sơ bộ) vào Postgres; không lưu chi tiết tài chính.
 */
export async function POST(req: NextRequest) {
  try {
    const body = noxhLoanQuickLeadSchema.parse(await req.json());
    const normalizedPhone = normalizeVnPhone(body.phone);
    if (!isValidVnPhone(normalizedPhone)) {
      return fail(422, "INVALID_PHONE", "Số điện thoại không hợp lệ.");
    }

    if (await isRateLimited(`noxh-loan-quick:${ipHash(req)}`, RATE_MAX, RATE_WINDOW)) {
      return fail(429, "RATE_LIMITED", "Quá nhiều yêu cầu. Vui lòng thử lại sau.");
    }

    const screen = screenLoanAge({
      birthYear: body.birthYear,
      salutation: body.salutation,
    });
    const tier = quickCheckTier(screen.status);
    const message = noxhLoanQuickLeadMessage(screen, body);
    const idemKey = req.headers.get("idempotency-key");
    if (idemKey) {
      const existingLeadId = await kv.get(`idem:noxh-loan-quick:${idemKey}`);
      if (existingLeadId) {
        return created({
          id: existingLeadId,
          tier,
          screen: { status: screen.status },
          deduplicated: true,
        });
      }
    }

    const { lead, eventPayload } = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { normalizedPhone },
        update: { name: body.name, email: body.email || undefined },
        create: {
          name: body.name,
          phone: body.phone,
          normalizedPhone,
          email: body.email || undefined,
        },
      });

      const createdLead = await tx.lead.create({
        data: {
          customerId: customer.id,
          source: "tool:noxh-loan-quick-check",
          message: body.message ? `${message} | Ghi chú: ${body.message}` : message,
        },
      });

      const eventPayload = {
        leadId: createdLead.id,
        tier,
        ageStatus: screen.status,
        currentAge: screen.currentAge,
        ageAtLoanEnd: screen.ageAtLoanEnd,
        region: body.region,
        housingType: body.housingType,
        incomeBand: body.incomeBand,
        contact: {
          name: body.name,
          phone: body.phone,
          email: body.email,
        },
      };

      await enqueueEvent(
        tx,
        "lead.noxh_loan_quick_check",
        eventPayload,
        `lead.noxh_loan_quick_check:${createdLead.id}`,
      );

      return { lead: createdLead, eventPayload };
    });

    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (body.marketingEmailOptIn && email) {
      const consentResult = await grantMarketingEmailConsent({
        leadId: lead.id,
        source: LEAD_SOURCE.TOOL_NOXH_LOAN_QUICK,
        proofType: "tool_opt_in",
        proofRef: email,
      });
      if (!consentResult.granted) {
        console.error("[noxh-loan-quick] marketing email consent not recorded", {
          reason: consentResult.reason,
        });
      } else {
        const welcome = await tryEnrollNoxhWelcomeAfterConsent({
          leadId: lead.id,
          correlationId: `noxh-loan:${lead.id}`,
        });
        if (!welcome.enrolled) {
          console.error("[noxh-loan-quick] email welcome enroll skipped", {
            reason: welcome.reason,
          });
        }
      }
    }

    void forwardEventToWebhook("lead.noxh_loan_quick_check", eventPayload).catch(
      (error) => {
        console.error("[noxh-loan-quick-check] realtime forward failed", {
          leadId: lead.id,
          message: error instanceof Error ? error.message : String(error),
        });
      },
    );

    if (idemKey) {
      await kv.set(`idem:noxh-loan-quick:${idemKey}`, lead.id, 86_400);
    }

    return created({ id: lead.id, tier, screen: { status: screen.status } });
  } catch (err) {
    return handleApiError(err);
  }
}
