import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { projectStatusPatchSchema } from "@/lib/validation/project";
import { assertNoxhSaleGate } from "@/lib/rules/project-noxh-gate";
import { recordStatusChange } from "@/lib/data/status-history";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// PATCH /api/projects/:id/status — đổi status, áp dụng rule #6 (NOXH legal gate).
// `:id` chấp nhận id hoặc slug để linh hoạt cho cả admin lẫn public tooling.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const { status } = projectStatusPatchSchema.parse(await req.json());

    const project = await prisma.project.findUnique({
      where: uuidRegex.test(slug) ? { id: slug } : { slug },
      select: { id: true, projectType: true, status: true },
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

    const updated = await prisma.$transaction(async (tx) => {
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
      return u;
    });

    return ok(updated);
  } catch (err) {
    return handleApiError(err);
  }
}
