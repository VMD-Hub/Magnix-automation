import type { NextRequest } from "next/server";
import { fail, handleApiError, created } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import { createCtvNudge } from "@/lib/data/noxh-case";
import { nudgeSchema } from "@/lib/validation/noxh-case";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** CTV — nhắc khách qua hệ thống (Ops gọi hộ). */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        fail(session.status, session.code, session.message),
        req,
      );
    }

    const { id } = await params;
    const body = nudgeSchema.parse(await req.json().catch(() => ({})));

    const log = await createCtvNudge({
      caseId: id,
      brokerId: session.brokerId,
      docType: body.docType,
      message: body.message,
    });

    if (!log) {
      return applyApiCors(
        fail(404, "NOT_FOUND", "Không tìm thấy hồ sơ."),
        req,
      );
    }

    return applyApiCors(
      created({
        id: log.id,
        message: "Đã gửi yêu cầu nhắc — chuyên viên HouseX sẽ liên hệ khách.",
      }),
      req,
    );
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}
