import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, fail, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { getPublicProjectBySlug } from "@/lib/data/project-public";
import { recordStatusChange } from "@/lib/data/status-history";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

// GET /api/projects/:slug — chi tiết dự án + unitTypes + legalDocs (cho SSR / Mini App).
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const result = await getPublicProjectBySlug(slug);

    if (!result) {
      return applyApiCors(
        fail(404, "NOT_FOUND", "Không tìm thấy dự án."),
        req,
      );
    }

    return applyApiCors(ok(result.project), req);
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}

// DELETE /api/projects/:slug — soft delete (P3). Ẩn dự án + tin liên quan vẫn
// giữ bản ghi; không xoá cứng để bảo toàn lịch sử/attribution.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const project = await prisma.project.findFirst({
      where: uuidRegex.test(slug)
        ? { id: slug, deletedAt: null }
        : { slug, deletedAt: null },
      select: { id: true, status: true },
    });
    if (!project) {
      return fail(404, "NOT_FOUND", "Không tìm thấy dự án.");
    }

    await prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: project.id },
        data: { deletedAt: new Date() },
      });
      await recordStatusChange(tx, {
        entity: "project",
        entityId: project.id,
        fromStatus: project.status,
        toStatus: "DELETED",
        reason: "soft_delete",
      });
    });

    return ok({ id: project.id, deleted: true });
  } catch (err) {
    return handleApiError(err);
  }
}
