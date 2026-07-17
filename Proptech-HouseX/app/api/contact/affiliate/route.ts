import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { created, fail, handleApiError } from "@/lib/api/http";
import { affiliateContactSchema } from "@/lib/validation/contact";
import { normalizeVnPhone, isValidVnPhone } from "@/lib/phone";
import { isRateLimited, kv } from "@/lib/redis";
import { ipHash } from "@/lib/api/request-meta";
import { enqueueEvent } from "@/lib/events/outbox";
import { forwardEventToWebhook } from "@/lib/events/handlers";
import type { OutboxPayloads } from "@/lib/events/types";

const RATE_MAX = Number(process.env.LEAD_RATE_MAX ?? "20");
const RATE_WINDOW = Number(process.env.LEAD_RATE_WINDOW_SEC ?? "3600");

/** Form liên hệ dịch vụ liên kết — không bắt buộc listing/project. */
export async function POST(req: NextRequest) {
  try {
    const body = affiliateContactSchema.parse(await req.json());
    const normalizedPhone = normalizeVnPhone(body.phone);

    if (!isValidVnPhone(normalizedPhone)) {
      return fail(422, "INVALID_PHONE", "Số điện thoại không hợp lệ.");
    }

    if (await isRateLimited(`contact:${ipHash(req)}`, RATE_MAX, RATE_WINDOW)) {
      return fail(429, "RATE_LIMITED", "Quá nhiều yêu cầu. Vui lòng thử lại sau.");
    }

    const idemKey = req.headers.get("idempotency-key");
    if (idemKey) {
      const existingLeadId = await kv.get(`idem:affiliate-contact:${idemKey}`);
      if (existingLeadId) {
        return created({ id: existingLeadId, received: true, deduplicated: true });
      }
    }

    const needLine = body.need ? `[Nhu cầu: ${body.need}]` : "";
    const msg = [needLine, body.message].filter(Boolean).join("\n") || undefined;

    const { lead, eventPayload } = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { normalizedPhone },
        update: {
          name: body.name,
          email: body.email || undefined,
        },
        create: {
          name: body.name,
          phone: body.phone,
          normalizedPhone,
          email: body.email || undefined,
        },
      });

      const lead = await tx.lead.create({
        data: {
          customerId: customer.id,
          source: `affiliate:${body.vertical}`,
          message: msg,
        },
      });

      const eventPayload: OutboxPayloads["lead.affiliate_contact"] = {
        leadId: lead.id,
        vertical: body.vertical,
        need: body.need || null,
        message: body.message || null,
        contact: {
          name: body.name,
          phone: body.phone,
          email: body.email || null,
        },
        createdAt: lead.createdAt.toISOString(),
      };

      await enqueueEvent(
        tx,
        "lead.affiliate_contact",
        eventPayload,
        `lead.affiliate_contact:${lead.id}`,
      );

      return { lead, eventPayload };
    });

    void forwardEventToWebhook("lead.affiliate_contact", eventPayload).catch(
      (error) => {
        console.error("[affiliate-contact] realtime forward failed", {
          leadId: lead.id,
          message: error instanceof Error ? error.message : String(error),
        });
      },
    );

    if (idemKey) {
      await kv.set(`idem:affiliate-contact:${idemKey}`, lead.id, 86_400);
    }

    return created({ id: lead.id, received: true });
  } catch (err) {
    return handleApiError(err);
  }
}
