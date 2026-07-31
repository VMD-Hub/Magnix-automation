import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";

/** Admin — xem snapshot e-contract đã ký (read-only). */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const { id: brokerId } = await params;
    const broker = await prisma.broker.findUnique({
      where: { id: brokerId },
      select: {
        id: true,
        fullName: true,
        ctvCode: true,
        partnerContractStatus: true,
        partnerContractSignedAt: true,
        partnerContractVersion: true,
        partnerContractSnapshot: true,
        partnerContractSigHash: true,
      },
    });
    if (!broker) {
      return fail(404, "NOT_FOUND", "Không tìm thấy môi giới.");
    }

    return ok({
      brokerId: broker.id,
      fullName: broker.fullName,
      ctvCode: broker.ctvCode,
      status: broker.partnerContractStatus,
      signedAt: broker.partnerContractSignedAt?.toISOString() ?? null,
      version: broker.partnerContractVersion,
      snapshot: broker.partnerContractSnapshot,
      sigHash: broker.partnerContractSigHash,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
