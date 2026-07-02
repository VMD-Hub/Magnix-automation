import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { listCtvApplicationsForAdmin } from "@/lib/data/ctv";
import type { CtvApplicationStatus } from "@prisma/client";
import { z } from "zod";

const querySchema = z.object({
  status: z
    .enum(["PENDING", "APPROVED", "REJECTED", "ALL"])
    .optional()
    .default("PENDING"),
});

/** Admin: danh sách đơn đăng ký CTV. */
export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const parsed = querySchema.parse({
      status: req.nextUrl.searchParams.get("status") ?? undefined,
    });

    const [items, all] = await Promise.all([
      listCtvApplicationsForAdmin(
        parsed.status as CtvApplicationStatus | "ALL",
      ),
      listCtvApplicationsForAdmin("ALL"),
    ]);

    const counts = {
      pending: all.filter((i) => i.status === "PENDING").length,
      approved: all.filter((i) => i.status === "APPROVED").length,
      rejected: all.filter((i) => i.status === "REJECTED").length,
      total: all.length,
    };

    return ok({ items, counts });
  } catch (err) {
    return handleApiError(err);
  }
}
