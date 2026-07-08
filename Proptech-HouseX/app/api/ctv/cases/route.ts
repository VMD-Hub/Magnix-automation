import type { NextRequest } from "next/server";
import { fail, handleApiError, ok, created } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
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
import { isServiceActive } from "@/lib/data/agent-services";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** CTV — danh sách hồ sơ NOXH (Contact Firewall: mask SĐT). */
export async function GET(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        fail(session.status, session.code, session.message),
        req,
      );
    }

    const cases = await listNoxhCasesForBroker(session.brokerId);
    return applyApiCors(
      ok({
        items: cases.map(serializeCaseListItemForCtv),
      }),
      req,
    );
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}

/** CTV — thả lead (Tên + SĐT). */
export async function POST(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        fail(session.status, session.code, session.message),
        req,
      );
    }

    const body = ctvClaimSchema.parse(await req.json());
    const normalizedPhone = normalizeVnPhone(body.phone);
    if (!isValidVnPhone(normalizedPhone)) {
      return applyApiCors(
        fail(422, "INVALID_PHONE", "Số điện thoại không hợp lệ."),
        req,
      );
    }

    const broker = await prisma.broker.findUnique({
      where: { id: session.brokerId },
      select: { phone: true },
    });
    if (!broker) {
      return applyApiCors(
        fail(403, "BROKER_NOT_FOUND", "Không tìm thấy hồ sơ môi giới."),
        req,
      );
    }

    const claimUnlocked = await isServiceActive(session.brokerId, "NOXH_CLAIM");
    if (!claimUnlocked) {
      return applyApiCors(
        fail(
          403,
          "SERVICE_LOCKED",
          "Cần đậu «Đào tạo hội nhập CTV» để mở dịch vụ thả lead NOXH.",
        ),
        req,
      );
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
    return applyApiCors(created(serializeCaseForCtv(noxhCase)), req);
  } catch (err) {
    if (err instanceof CtvClaimError) {
      return applyApiCors(fail(409, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
