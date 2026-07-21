import type { NextRequest } from "next/server";
import { created, fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import {
  createContentDraft,
  listContentDraftsForAdmin,
} from "@/lib/data/content-draft";
import {
  contentDraftListQuerySchema,
  contentDraftWriteSchema,
} from "@/lib/validation/content-draft";
import type { ContentDraftStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản truy cập content drafts.");
    }

    const parsed = contentDraftListQuerySchema.parse({
      status: req.nextUrl.searchParams.get("status") ?? undefined,
    });

    const [items, all] = await Promise.all([
      listContentDraftsForAdmin(
        parsed.status as ContentDraftStatus | "ALL" | "SCHEDULED",
      ),
      listContentDraftsForAdmin("ALL"),
    ]);

    const counts = {
      draft: all.filter((i) => i.status === "DRAFT").length,
      pendingL3: all.filter((i) => i.status === "PENDING_L3").length,
      approved: all.filter((i) => i.status === "APPROVED").length,
      rejected: all.filter((i) => i.status === "REJECTED").length,
      published: all.filter((i) => i.status === "PUBLISHED").length,
      scheduled: all.filter(
        (i) => i.scheduledAt != null && i.status !== "PUBLISHED",
      ).length,
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

export async function POST(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản tạo content draft.");
    }
    const body = contentDraftWriteSchema.parse(await req.json());
    return created(await createContentDraft(body));
  } catch (err) {
    return handleApiError(err);
  }
}
