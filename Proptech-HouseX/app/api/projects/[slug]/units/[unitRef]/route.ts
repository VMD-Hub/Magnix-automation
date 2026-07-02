import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { getProjectUnitByRef } from "@/lib/data/project-unit";

// GET /api/projects/:slug/units/:unitRef — chi tiết 1 căn (uuid hoặc mã căn).
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; unitRef: string }> },
) {
  try {
    const { slug, unitRef } = await params;
    const result = await getProjectUnitByRef(slug, decodeURIComponent(unitRef));

    if (!result?.project) {
      return fail(404, "NOT_FOUND", "Không tìm thấy dự án.");
    }
    if (!result.unit) {
      return fail(404, "NOT_FOUND", "Không tìm thấy căn trong dự án.");
    }

    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
