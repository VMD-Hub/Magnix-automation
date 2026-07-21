import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { projectStatusPatchSchema } from "@/lib/validation/project";
import { assertNoxhSaleGate } from "@/lib/rules/project-noxh-gate";
import { recordStatusChange } from "@/lib/data/status-history";
import { notifyWaitlistCohortOnLaunch } from "@/lib/leads/waitlist-launch";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// PATCH /api/projects/:id/status — đổi status, áp dụng rule #6 (NOXH legal gate).
// ADR-016 P3: SAP_MO_BAN → DANG_BAN → notify waitlist cohort in-app.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const { status } = projectStatusPatchSchema.parse(await req.json());

    const project = await prisma.project.findUnique({
      where: uuidRegex.test(slug) ? { id: slug } : { slug },
      select: { id: true, name: true, slug: true, projectType: true, status: true },
    });

    if (!project) {
      return fail(404, "NOT_FOUND", "Không tìm thấy dự án.");
    }

    const gate = await assertNoxhSaleGate(prisma, {
      projectId: project.id,
      projectType: project.projectType,
      targetStatus: status,
    });
    if (!gate.ok) {
      return fail(409, gate.code, gate.message);
    }

    const { updated, launch } = await prisma.$transaction(async (tx) => {
      const u = await tx.project.update({
        where: { id: project.id },
        data: { status },
      });
      await recordStatusChange(tx, {
        entity: "project",
        entityId: project.id,
        fromStatus: project.status,
        toStatus: status,
      });
      const launchResult = await notifyWaitlistCohortOnLaunch(tx, {
        projectId: project.id,
        projectName: project.name,
        projectSlug: project.slug,
        fromStatus: project.status,
        toStatus: status,
      });
      return { updated: u, launch: launchResult };
    });

    return ok({
      ...updated,
      waitlistLaunch: launch,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
