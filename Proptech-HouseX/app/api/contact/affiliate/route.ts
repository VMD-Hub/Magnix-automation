import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { created, fail, handleApiError } from "@/lib/api/http";
import { affiliateContactSchema } from "@/lib/validation/contact";
import { normalizeVnPhone, isValidVnPhone } from "@/lib/phone";
import { isRateLimited } from "@/lib/redis";
import { ipHash } from "@/lib/api/request-meta";

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

    const needLine = body.need ? `[Nhu cầu: ${body.need}]` : "";
    const msg = [needLine, body.message].filter(Boolean).join("\n") || undefined;

    const lead = await prisma.$transaction(async (tx) => {
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

      return tx.lead.create({
        data: {
          customerId: customer.id,
          source: `affiliate:${body.vertical}`,
          message: msg,
        },
      });
    });

    return created({ id: lead.id, received: true });
  } catch (err) {
    return handleApiError(err);
  }
}
