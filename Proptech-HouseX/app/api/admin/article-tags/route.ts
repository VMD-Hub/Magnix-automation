import type { NextRequest } from "next/server";
import { created, fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  listProjectsForArticlePicker,
  listTagsForAdmin,
  upsertArticleTag,
} from "@/lib/data/article-admin";
import { articleTagAdminSchema } from "@/lib/validation/article-admin";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const [tags, projects] = await Promise.all([
      listTagsForAdmin(),
      listProjectsForArticlePicker(),
    ]);
    return ok({ tags, projects });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const body = articleTagAdminSchema.parse(await req.json());
    const tag = await upsertArticleTag(body);
    return created({ tag });
  } catch (err) {
    return handleApiError(err);
  }
}
