import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import {
  getAdminSessionFromRequest,
  isAdminAuthorized,
} from "@/lib/admin/session";
import {
  CareActivityError,
  rejectCareActivity,
} from "@/lib/data/care-activity";
import { prisma } from "@/lib/prisma";
import { adminCareRejectSchema } from "@/lib/validation/noxh-case";

/** Ops — reject CS giả / không đủ bằng chứng. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; activityId: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const session = getAdminSessionFromRequest(req);
    const actor = session?.role === "ops" ? "ops" : "admin";
    const { id: caseId, activityId } = await params;
    const body = adminCareRejectSchema.parse(await req.json());

    const owned = await prisma.careActivity.findFirst({
      where: { id: activityId, caseId },
      select: { id: true, status: true },
    });
    if (!owned) {
      return fail(404, "NOT_FOUND", "Không tìm thấy hoạt động CS.");
    }
    if (owned.status === "REJECTED") {
      return fail(409, "ALREADY_REJECTED", "CS đã bị từ chối.");
    }

    const activity = await rejectCareActivity(activityId, actor, body.reason);
    return ok({
      id: activity.id,
      status: activity.status,
      rejectedReason: activity.rejectedReason,
      rejectedAt: activity.rejectedAt?.toISOString() ?? null,
    });
  } catch (err) {
    if (err instanceof CareActivityError) {
      return fail(422, err.code, err.message);
    }
    return handleApiError(err);
  }
}
