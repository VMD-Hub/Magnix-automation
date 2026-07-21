import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { created, fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { leadCreateSchema } from "@/lib/validation/lead";
import { REFERRAL_COOKIE } from "@/lib/rules/referral-attribution";
import { resolveAttribution, type ReferralTouch } from "@/lib/rules/attribution-lock";
import { normalizeVnPhone, isValidVnPhone } from "@/lib/phone";
import { kv, isRateLimited } from "@/lib/redis";
import { ipHash } from "@/lib/api/request-meta";
import { enqueueEvent } from "@/lib/events/outbox";
import {
  buildLeadCreatedPayload,
  forwardLeadCreatedBestEffort,
} from "@/lib/events/lead-inquiry";
import { resolveLeadSegmentPrisma } from "@/lib/rules/lead-segment-resolve";
import {
  LEAD_CHANNEL_HEADER,
  LEAD_SOURCE,
  parseLeadChannelHeader,
  resolveLeadSource,
} from "@/lib/leads/source";
import { buildInitialLeadOpsMeta, readLeadOpsMeta } from "@/lib/leads/ops-meta";
import { tryEnqueueLeadNurture } from "@/lib/leads/nurture-auto";
import type { Prisma } from "@prisma/client";
import { queueConflictFromOpsLead } from "@/lib/attribution/conflict";
import {
  defaultChannelPreferencesForCapture,
  isWaitlistCapture,
  parseChannelPreferences,
  parseLeadCaptureType,
  WAITLIST_LEAD_SOURCE,
} from "@/lib/leads/capture-type";
import {
  createCustomerNotification,
  CUSTOMER_NOTIFY_TYPE,
} from "@/lib/data/customer-notification";
import { WAITLIST_NO_COLD_CALL } from "@/lib/content/messaging/interest-waitlist-copy";

const LEAD_RATE_MAX = Number(process.env.LEAD_RATE_MAX ?? "20");
const LEAD_RATE_WINDOW_SEC = Number(process.env.LEAD_RATE_WINDOW_SEC ?? "3600");
const IDEMPOTENCY_TTL_SEC = 24 * 3600;

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

// POST /api/leads — khách submit form liên hệ.
// ADR-016 P1: captureType=waitlist → source waitlist:project, không HOT notify/SLA.
export async function POST(req: NextRequest) {
  try {
    const body = leadCreateSchema.parse(await req.json());

    const normalizedPhone = normalizeVnPhone(body.phone);
    if (!isValidVnPhone(normalizedPhone)) {
      return applyApiCors(
        fail(422, "INVALID_PHONE", "Số điện thoại không hợp lệ."),
        req,
      );
    }

    // Rate limit theo IP (chống bơm lead).
    const ip = ipHash(req);
    if (await isRateLimited(`lead:${ip}`, LEAD_RATE_MAX, LEAD_RATE_WINDOW_SEC)) {
      return applyApiCors(
        fail(429, "RATE_LIMITED", "Quá nhiều yêu cầu, vui lòng thử lại sau."),
        req,
      );
    }

    // Idempotency: cùng Idempotency-Key trả lại lead đã tạo, không nhân đôi.
    const idemKey = req.headers.get("idempotency-key");
    if (idemKey) {
      const existingLeadId = await kv.get(`idem:lead:${idemKey}`);
      if (existingLeadId) {
        const existingLead = await prisma.lead.findUnique({
          where: { id: existingLeadId },
        });
        if (existingLead) return applyApiCors(ok(existingLead), req);
      }
    }

    // Attribution touch từ cookie (rule #3) → resolve broker + phone CTV.
    const refCode = req.cookies.get(REFERRAL_COOKIE)?.value;
    let referralTouch: ReferralTouch = null;
    if (refCode) {
      const referral = await prisma.referral.findUnique({
        where: { code: refCode },
        select: { id: true, broker: { select: { id: true, phone: true } } },
      });
      if (referral) {
        referralTouch = {
          id: referral.id,
          brokerId: referral.broker.id,
          brokerNormalizedPhone: normalizeVnPhone(referral.broker.phone),
        };
      }
    }

    const { lead, eventPayload } = await prisma.$transaction(async (tx) => {
      // Identity resolution: gộp về customer cũ theo normalizedPhone.
      const customer = await tx.customer.upsert({
        where: { normalizedPhone },
        update: {
          // chỉ bổ sung email/tên nếu trước đó thiếu (không ghi đè dữ liệu cũ).
          name: body.name,
          email: body.email ?? undefined,
        },
        create: {
          name: body.name,
          phone: body.phone,
          normalizedPhone,
          email: body.email,
        },
      });

      const attribution = await resolveAttribution(tx, {
        customerId: customer.id,
        customerNormalizedPhone: normalizedPhone,
        referral: referralTouch,
      });

      const segment = await resolveLeadSegmentPrisma(tx, body);

      const captureType = parseLeadCaptureType(body.captureType);
      const channelPreference =
        parseChannelPreferences(body.channelPreference).length > 0
          ? parseChannelPreferences(body.channelPreference)
          : captureType
            ? defaultChannelPreferencesForCapture(captureType)
            : [];
      const waitlist = isWaitlistCapture(captureType, null);

      const channel =
        parseLeadChannelHeader(req.headers.get(LEAD_CHANNEL_HEADER)) ??
        (body.source?.toLowerCase() === "zalo_miniapp" ? "miniapp" : "web");

      let { source, sourceMeta } = resolveLeadSource({
        bodySource: body.source,
        utm: body.utm,
        channel,
        referralAssigned: !!attribution.assignedBrokerId,
      });

      if (waitlist) {
        // Referral attribution vẫn giữ assignedBrokerId; source đánh dấu waitlist
        // để tách HOT notify / SLA gọi.
        source = WAITLIST_LEAD_SOURCE;
        sourceMeta = {
          ...(sourceMeta ?? {}),
          rawSource: body.source ?? LEAD_SOURCE.WEB_LEAD,
          channel,
        };
      }

      const created = await tx.lead.create({
        data: {
          customerId: customer.id,
          listingId: body.listingId,
          projectId: body.projectId,
          referralId: attribution.referralId,
          assignedBrokerId: attribution.assignedBrokerId,
          source,
          sourceMeta: sourceMeta as Prisma.InputJsonValue | undefined,
          opsMeta: buildInitialLeadOpsMeta({
            phone: body.phone,
            email: body.email,
            segment,
            source,
            captureType,
            channelPreference,
          }) as Prisma.InputJsonValue,
          segment,
          message: body.message,
        },
      });

      let finalLead = created;
      // Waitlist: không auto-enqueue nurture gọi/Zalo “trong 24h” — script manual.
      // P2: tạo thông báo in-app chào + CTA tài khoản / bài lọc đối tượng.
      if (waitlist && created.customerId) {
        await createCustomerNotification(tx, {
          customerId: created.customerId,
          type: CUSTOMER_NOTIFY_TYPE.WAITLIST_WELCOME,
          title: "Đã ghi nhận đăng ký nhận tin",
          body: `${WAITLIST_NO_COLD_CALL} Cập nhật sẽ hiện trong thông báo tài khoản. Nên hoàn thiện hồ sơ và làm bài lọc đối tượng NOXH.`,
          projectId: body.projectId ?? null,
          leadId: created.id,
          href: "/khach-hang/tai-khoan",
          dedupeKey: `waitlist_welcome:${created.id}`,
        });
      }

      if (!attribution.assignedBrokerId && !waitlist) {
        const ops = readLeadOpsMeta(created.opsMeta);
        const nurtureMeta = await tryEnqueueLeadNurture(tx, {
          leadId: created.id,
          opsMeta: created.opsMeta,
          nurtureScriptId: ops.nurtureScriptId,
          segment,
          source,
          trigger: "on_create",
          contact: {
            name: body.name,
            phone: body.phone,
            email: body.email,
          },
        });
        if (nurtureMeta) {
          finalLead = await tx.lead.update({
            where: { id: created.id },
            data: { opsMeta: nurtureMeta as Prisma.InputJsonValue },
          });
        }
      }

      const eventPayload = await buildLeadCreatedPayload(
        tx,
        finalLead,
        {
          name: body.name,
          phone: body.phone,
          email: body.email,
        },
        { captureType, channelPreference },
      );

      await enqueueEvent(
        tx,
        "lead.created",
        eventPayload,
        `lead.created:${created.id}`,
      );

      await queueConflictFromOpsLead(tx, {
        normalizedPhone,
        customerId: customer.id,
        platformLeadId: created.id,
        assignedBrokerId: attribution.assignedBrokerId,
      });

      return { lead: finalLead, eventPayload };
    });

    void forwardLeadCreatedBestEffort(eventPayload);

    if (idemKey) {
      await kv.set(`idem:lead:${idemKey}`, lead.id, IDEMPOTENCY_TTL_SEC);
    }

    return applyApiCors(created(lead), req);
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}
