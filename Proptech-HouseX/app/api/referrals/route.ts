import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { created, fail, handleApiError } from "@/lib/api/http";
import { resolveBrokerId } from "@/lib/api/current-broker";
import { referralCreateSchema } from "@/lib/validation/referral";
import { assertLicenseGate } from "@/lib/rules/listing-rules";
import { generateReferralCode } from "@/lib/rules/referral-attribution";

// POST /api/referrals — broker tạo mã giới thiệu. Áp dụng rule #2 (license gate):
// broker CTV bắt buộc licenseVerified = true.
export async function POST(req: NextRequest) {
  try {
    const body = referralCreateSchema.parse(await req.json());
    const brokerId = await resolveBrokerId(req, body.brokerId);

    if (!brokerId) {
      return fail(
        400,
        "BROKER_REQUIRED",
        "Thiếu brokerId (body hoặc header x-broker-id).",
      );
    }

    const broker = await prisma.broker.findUnique({
      where: { id: brokerId },
      select: { id: true, brokerType: true, licenseVerified: true },
    });
    if (!broker) {
      return fail(404, "BROKER_NOT_FOUND", "Không tìm thấy broker.");
    }

    // tier FREE → chỉ broker CTV mới bị chặn bởi license gate.
    const gate = assertLicenseGate(broker, "FREE");
    if (!gate.ok) {
      return fail(403, gate.code, gate.message);
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const referral = await prisma.referral.create({
          data: {
            brokerId: broker.id,
            type: body.type,
            projectId: body.projectId,
            listingId: body.listingId,
            expiresAt: body.expiresAt,
            code: generateReferralCode(),
          },
        });
        return created(referral);
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002" &&
          Array.isArray(e.meta?.target) &&
          (e.meta.target as string[]).includes("code")
        ) {
          continue;
        }
        throw e;
      }
    }

    return fail(500, "CODE_GENERATION_FAILED", "Không sinh được mã referral.");
  } catch (err) {
    return handleApiError(err);
  }
}
