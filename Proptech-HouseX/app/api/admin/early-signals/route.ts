import type { NextRequest } from "next/server";
import { created, fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import {
  createEarlySignal,
  listEarlySignalsForAdmin,
} from "@/lib/data/early-signal";
import {
  earlySignalCreateSchema,
  earlySignalListQuerySchema,
} from "@/lib/validation/early-signal";
import type { EarlySignalStatus } from "@prisma/client";

/** Super: danh sách tin sớm theo status. */
export async function GET(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản (L3) truy cập tin sớm.");
    }

    const parsed = earlySignalListQuerySchema.parse({
      status: req.nextUrl.searchParams.get("status") ?? undefined,
    });

    const [items, all] = await Promise.all([
      listEarlySignalsForAdmin(parsed.status as EarlySignalStatus | "ALL"),
      listEarlySignalsForAdmin("ALL"),
    ]);

    const counts = {
      pendingL3: all.filter((i) => i.status === "PENDING_L3").length,
      packaged: all.filter((i) => i.status === "PACKAGED").length,
      captured: all.filter((i) => i.status === "CAPTURED").length,
      approved: all.filter((i) => i.status === "APPROVED").length,
      rejected: all.filter((i) => i.status === "REJECTED").length,
      published: all.filter((i) => i.status === "PUBLISHED").length,
      total: all.length,
    };

    return ok({ items, counts });
  } catch (err) {
    return handleApiError(err);
  }
}

/** Super: tạo bản ghi intake tin sớm. */
export async function POST(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản (L3) tạo tin sớm.");
    }

    const body = earlySignalCreateSchema.parse(await req.json());
    const item = await createEarlySignal(body);
    return created(item);
  } catch (err) {
    return handleApiError(err);
  }
}
