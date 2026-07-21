import type { NextRequest } from "next/server";
import { created, fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import {
  createContentQueueItem,
  listContentQueueForAdmin,
} from "@/lib/data/content-queue";
import {
  contentQueueCreateSchema,
  contentQueueListQuerySchema,
} from "@/lib/validation/content-queue";
import type { ContentQueueStatus } from "@prisma/client";

/** Super: danh sách content queue Magnix. */
export async function GET(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản truy cập content queue.");
    }

    const parsed = contentQueueListQuerySchema.parse({
      status: req.nextUrl.searchParams.get("status") ?? undefined,
    });

    const [items, all] = await Promise.all([
      listContentQueueForAdmin(parsed.status as ContentQueueStatus | "ALL"),
      listContentQueueForAdmin("ALL"),
    ]);

    const counts = {
      intake: all.filter((i) => i.status === "INTAKE").length,
      pendingL3: all.filter((i) => i.status === "PENDING_L3").length,
      approved: all.filter((i) => i.status === "APPROVED").length,
      rejected: all.filter((i) => i.status === "REJECTED").length,
      published: all.filter((i) => i.status === "PUBLISHED").length,
      total: all.length,
      missingCta: all.filter(
        (i) =>
          i.status !== "REJECTED" &&
          (!i.ctaToolId || i.ctaToolId.length === 0),
      ).length,
    };

    return ok({ items, counts });
  } catch (err) {
    return handleApiError(err);
  }
}

/** Super: tạo item editorial (CTA tool khuyến nghị gắn ngay). */
export async function POST(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản tạo content queue.");
    }

    const body = contentQueueCreateSchema.parse(await req.json());
    const item = await createContentQueueItem(body);
    return created(item);
  } catch (err) {
    return handleApiError(err);
  }
}
