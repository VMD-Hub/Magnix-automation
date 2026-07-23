import type { NextRequest } from "next/server";
import type { SalesRegion } from "@prisma/client";
import { created, fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  createProjectFromAdmin,
  listProjectsForAdmin,
} from "@/lib/data/project-admin";
import {
  projectAdminSaveSchema,
  salesRegionEnum,
} from "@/lib/validation/project-admin";

/** Admin: danh sách dự án / landing. ?salesRegion=SOUTH|CENTRAL|NORTH */
export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const raw = req.nextUrl.searchParams.get("salesRegion");
    const salesRegion =
      raw && salesRegionEnum.safeParse(raw).success
        ? (raw as SalesRegion)
        : undefined;
    const items = await listProjectsForAdmin(
      salesRegion ? { salesRegion } : undefined,
    );
    return ok({ items });
  } catch (err) {
    return handleApiError(err);
  }
}

/** Admin: tạo dự án mới (kèm landing template). */
export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const body = projectAdminSaveSchema.parse(await req.json());
    const project = await createProjectFromAdmin(body);
    return created({ project });
  } catch (err) {
    return handleApiError(err);
  }
}
