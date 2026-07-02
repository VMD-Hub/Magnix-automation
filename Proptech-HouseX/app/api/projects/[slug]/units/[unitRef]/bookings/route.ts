import { NextRequest } from "next/server";
import { created, fail, handleApiError } from "@/lib/api/http";
import { createUnitBooking } from "@/lib/data/unit-booking";
import { unitBookingCreateSchema } from "@/lib/validation/unit-booking";
import { REFERRAL_COOKIE } from "@/lib/rules/referral-attribution";
import { prisma } from "@/lib/prisma";
import { normalizeVnPhone } from "@/lib/phone";
import type { ReferralTouch } from "@/lib/rules/attribution-lock";

// POST /api/projects/:slug/units/:unitRef/bookings — giữ suất mua (không lock căn).
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; unitRef: string }> },
) {
  try {
    const { slug, unitRef } = await params;
    const body = unitBookingCreateSchema.parse(await req.json());

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

    const result = await createUnitBooking({
      slugOrId: slug,
      unitRef: decodeURIComponent(unitRef),
      input: body,
      referralTouch,
    });

    if (!result.ok) {
      const status =
        result.code === "NOT_FOUND"
          ? 404
          : result.code === "INVALID_PHONE"
            ? 422
            : 409;
      return fail(status, result.code, result.message);
    }

    return created(result.booking);
  } catch (err) {
    return handleApiError(err);
  }
}
