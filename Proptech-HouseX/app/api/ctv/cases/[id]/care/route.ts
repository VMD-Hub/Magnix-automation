import type { NextRequest } from "next/server";
import { fail, handleApiError, created } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import {
  CareActivityError,
  createCareActivity,
} from "@/lib/data/care-activity";
import { careActivitySchema } from "@/lib/validation/noxh-case";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** CTV — ghi CS hợp lệ (enum + note + ảnh) — SoT §5.2. */
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
    const body = careActivitySchema.parse(await req.json());
    const occurredAt = body.occurredAt
      ? new Date(body.occurredAt)
      : new Date();

    const activity = await createCareActivity({
      caseId: id,
      brokerId: session.brokerId,
      activityType: body.activityType,
      occurredAt,
      note: body.note,
      imageUrls: body.imageUrls,
    });

    return applyApiCors(
      created({
        id: activity.id,
        activityType: activity.activityType,
        occurredAt: activity.occurredAt.toISOString(),
        status: activity.status,
      }),
      req,
    );
  } catch (err) {
    if (err instanceof CareActivityError) {
      const status = err.code === "NOT_FOUND" ? 404 : 400;
      return applyApiCors(fail(status, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
