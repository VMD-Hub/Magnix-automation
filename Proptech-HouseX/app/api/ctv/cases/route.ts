import type { NextRequest } from "next/server";
import { fail, handleApiError, ok, created } from "@/lib/api/http";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import {
  createCtvClaim,
  CtvClaimError,
  listNoxhCasesForBroker,
} from "@/lib/data/noxh-case";
import { serializeCaseListItemForCtv } from "@/lib/noxh-case/serialize-ctv";
import { ctvClaimSchema } from "@/lib/validation/noxh-case";
import { isValidVnPhone, normalizeVnPhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";

/** CTV — danh sách hồ sơ NOXH (Contact Firewall: mask SĐT). */
export async function GET(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return fail(session.status, session.code, session.message);
    }

    const cases = await listNoxhCasesForBroker(session.brokerId);
    return ok({
      items: cases.map(serializeCaseListItemForCtv),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/** CTV — thả lead (Tên + SĐT). */
export async function POST(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return fail(session.status, session.code, session.message);
    }

    const body = ctvClaimSchema.parse(await req.json());
    const normalizedPhone = normalizeVnPhone(body.phone);
    if (!isValidVnPhone(normalizedPhone)) {
      return fail(422, "INVALID_PHONE", "Số điện thoại không hợp lệ.");
    }

    const broker = await prisma.broker.findUnique({
      where: { id: session.brokerId },
      select: { phone: true },
    });
    if (!broker) {
      return fail(403, "BROKER_NOT_FOUND", "Không tìm thấy hồ sơ môi giới.");
    }

    const noxhCase = await createCtvClaim({
      brokerId: session.brokerId,
      brokerPhone: broker.phone,
      customerName: body.customerName,
      phone: body.phone,
      projectId: body.projectId,
      objectGroup: body.objectGroup,
      intendToBorrow: body.intendToBorrow,
      message: body.message,
    });

    const { serializeCaseForCtv } = await import("@/lib/noxh-case/serialize-ctv");
    return created(serializeCaseForCtv(noxhCase));
  } catch (err) {
    if (err instanceof CtvClaimError) {
      return fail(409, err.code, err.message);
    }
    return handleApiError(err);
  }
}
