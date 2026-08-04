import type { NextRequest } from "next/server";
import { z } from "zod";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  archiveArticleFromAdmin,
  deleteArticleFromAdmin,
  getArticleForAdmin,
  updateArticleFromAdmin,
} from "@/lib/data/article-admin";
import { articleAdminSaveSchema } from "@/lib/validation/article-admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: RouteContext) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const { id } = await ctx.params;
    const article = await getArticleForAdmin(id);
    if (!article) return fail(404, "NOT_FOUND", "Không tìm thấy bài viết.");
    return ok({ article });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const { id } = await ctx.params;
    const body = articleAdminSaveSchema.parse(await req.json());
    const article = await updateArticleFromAdmin(id, body);
    return ok({ article });
  } catch (err) {
    return handleApiError(err);
  }
}

const articleStatusActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("archive") }),
  z.object({ action: z.literal("delete") }),
]);

export async function POST(req: NextRequest, ctx: RouteContext) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const { id } = await ctx.params;
    const body = articleStatusActionSchema.parse(await req.json());
    if (body.action === "archive") {
      const article = await archiveArticleFromAdmin(id);
      return ok({ article });
    }
    const stub = await deleteArticleFromAdmin(id);
    return ok({ deleted: true, suppressed: stub });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const { id } = await ctx.params;
    const stub = await deleteArticleFromAdmin(id);
    return ok({ deleted: true, suppressed: stub });
  } catch (err) {
    return handleApiError(err);
  }
}
