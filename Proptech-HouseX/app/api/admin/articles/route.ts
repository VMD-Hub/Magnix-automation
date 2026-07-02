import type { NextRequest } from "next/server";
import { created, fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  createArticleFromAdmin,
  listArticlesForAdmin,
} from "@/lib/data/article-admin";
import { articleAdminSaveSchema } from "@/lib/validation/article-admin";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const items = await listArticlesForAdmin();
    return ok({ items });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const body = articleAdminSaveSchema.parse(await req.json());
    const article = await createArticleFromAdmin(body);
    return created({ article });
  } catch (err) {
    return handleApiError(err);
  }
}
