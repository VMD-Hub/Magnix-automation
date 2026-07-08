import type { NextRequest } from "next/server";
import { z } from "zod";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { listNoxhCasesForAdmin } from "@/lib/data/noxh-case";
import { MILESTONE_LABEL } from "@/lib/noxh-case/milestone-labels";
import { countDocProgress } from "@/lib/noxh-case/doc-catalog";

const querySchema = z.object({
  status: z.enum(["ACTIVE", "ALL"]).optional().default("ACTIVE"),
});

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
      items: items.map((c) => {
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
      }),
      counts: {
        active: items.filter((i) => i.caseStatus === "ACTIVE").length,
        total: items.length,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
