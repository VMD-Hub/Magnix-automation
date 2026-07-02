import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { listProjectUnits } from "@/lib/data/project-unit";
import { projectUnitListQuerySchema } from "@/lib/validation/project-unit";

// GET /api/projects/:slug/units — giỏ hàng / bảng hàng read-only (Phase A).
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const query = projectUnitListQuerySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams),
    );

    const result = await listProjectUnits(slug, query);
    if (!result) {
      return fail(404, "NOT_FOUND", "Không tìm thấy dự án.");
    }

    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
