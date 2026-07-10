import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import { updateCtvConsultSchedule } from "@/lib/data/noxh-case";
import { parseConsultScheduleInput } from "@/lib/noxh-case/ctv-lock-compliance";
import { serializeCaseForCtv } from "@/lib/noxh-case/serialize-ctv";
import { consultScheduleSchema } from "@/lib/validation/noxh-case";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** CTV — cập nhật lịch tư vấn (giữ lock CRM-R3). */
export async function PATCH(
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
    const body = consultScheduleSchema.parse(await req.json());
    let consultAt: Date;
    try {
      consultAt = parseConsultScheduleInput(body.consultScheduledAt);
    } catch (err) {
      const code =
        err instanceof Error && err.message === "CONSULT_SCHEDULE_PAST"
          ? "CONSULT_SCHEDULE_PAST"
          : "INVALID_CONSULT_SCHEDULE";
      return applyApiCors(
        fail(
          422,
          code,
          code === "CONSULT_SCHEDULE_PAST"
            ? "Lịch tư vấn phải ở tương lai."
            : "Lịch tư vấn không hợp lệ.",
        ),
        req,
      );
    }

    const updated = await updateCtvConsultSchedule(
      id,
      session.brokerId,
      consultAt,
    );
    if (!updated) {
      return applyApiCors(
        fail(404, "NOT_FOUND", "Không tìm thấy hồ sơ đang active."),
        req,
      );
    }

    return applyApiCors(ok(serializeCaseForCtv(updated)), req);
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}
