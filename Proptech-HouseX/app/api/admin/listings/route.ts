import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { listListingsForAdmin } from "@/lib/data/listing-admin";
import { listingAdminListQuerySchema } from "@/lib/validation/listing-admin";
import type { ListingStatus } from "@prisma/client";

/** Admin: danh sách tin đăng chờ duyệt / đã xử lý. */
export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const parsed = listingAdminListQuerySchema.parse({
      status: req.nextUrl.searchParams.get("status") ?? undefined,
    });

    const [items, all] = await Promise.all([
      listListingsForAdmin(parsed.status as ListingStatus | "ALL"),
      listListingsForAdmin("ALL"),
    ]);

    const counts = {
      pending: all.filter((i) => i.status === "PENDING_REVIEW").length,
      active: all.filter((i) => i.status === "ACTIVE").length,
      rejected: all.filter((i) => i.status === "REJECTED").length,
      total: all.length,
    };

    return ok({ items, counts });
  } catch (err) {
    return handleApiError(err);
  }
}
