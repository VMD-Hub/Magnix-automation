import type { NextRequest } from "next/server";
import { z } from "zod";
import { created, fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  createPlatformNoxhCase,
  listNoxhCasesForAdmin,
  PlatformNoxhCaseError,
} from "@/lib/data/noxh-case";
import { MILESTONE_LABEL } from "@/lib/noxh-case/milestone-labels";
import { countDocProgress } from "@/lib/noxh-case/doc-catalog";
import { adminCreateNoxhCaseSchema } from "@/lib/validation/noxh-case";

const querySchema = z.object({
  status: z.enum(["ACTIVE", "ALL"]).optional().default("ACTIVE"),
});

function serializeAdminCaseListItem(
  c: Awaited<ReturnType<typeof listNoxhCasesForAdmin>>[number],
) {
  const progress = countDocProgress(c.documents);
  return {
    id: c.id,
    code: c.code,
    customerName: c.customerName,
    phone: c.phone,
    milestone: c.milestone,
    milestoneLabel: MILESTONE_LABEL[c.milestone],
    milestoneSub: c.milestoneSub,
    caseStatus: c.caseStatus,
    docPercent: progress.percent,
    opsNote: c.opsNote,
    brokerName: c.broker?.fullName ?? null,
    ctvCode: c.broker?.ctvCode ?? null,
    projectName: c.project?.name ?? null,
    attributionLocked: !!c.attributionLockedAt,
    updatedAt: c.updatedAt.toISOString(),
  };
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const parsed = querySchema.parse({
      status: req.nextUrl.searchParams.get("status") ?? undefined,
    });

    const items = await listNoxhCasesForAdmin({ status: parsed.status });

    return ok({
      items: items.map(serializeAdminCaseListItem),
      counts: {
        active: items.filter((i) => i.caseStatus === "ACTIVE").length,
        total: items.length,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const body = adminCreateNoxhCaseSchema.parse(await req.json());
    const result = await createPlatformNoxhCase({
      customerName: body.customerName,
      phone: body.phone,
      projectId: body.projectId,
      objectGroup: body.objectGroup,
      intendToBorrow: body.intendToBorrow,
      opsNote: body.opsNote,
      leadId: body.leadId,
      inboundLeadId: body.inboundLeadId,
    });

    const payload = {
      created: result.created,
      case: serializeAdminCaseListItem(result.case),
      platformLeadId: result.case.leadId,
      inboundLeadId: result.inbound?.id ?? null,
    };

    return result.created ? created(payload) : ok(payload);
  } catch (err) {
    if (err instanceof PlatformNoxhCaseError) {
      const status =
        err.code === "CASE_EXISTS"
          ? 409
          : err.code === "INVALID_PHONE"
            ? 422
            : 404;
      return fail(status, err.code, err.message, {
        caseId: err.existingCaseId,
        caseCode: err.existingCaseCode,
      });
    }
    return handleApiError(err);
  }
}
