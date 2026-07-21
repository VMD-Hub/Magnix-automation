import type { NextRequest } from "next/server";
import { created, fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import {
  PARTNER_TARGET_ACTIVE_SOFT_CAP,
  countActivePartnerTargets,
  createPartnerTarget,
  listPartnerTargets,
} from "@/lib/data/partner-target";
import {
  partnerTargetListQuerySchema,
  partnerTargetWriteSchema,
} from "@/lib/validation/partner-target";
import type { PartnerTargetStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản xem partner targets.");
    }

    const parsed = partnerTargetListQuerySchema.parse({
      status: req.nextUrl.searchParams.get("status") ?? undefined,
    });

    const [items, all, activeCount] = await Promise.all([
      listPartnerTargets(parsed.status as PartnerTargetStatus | "ALL"),
      listPartnerTargets("ALL"),
      countActivePartnerTargets(),
    ]);

    const counts = {
      target: all.filter((i) => i.status === "TARGET").length,
      contacted: all.filter((i) => i.status === "CONTACTED").length,
      meeting: all.filter((i) => i.status === "MEETING").length,
      partner: all.filter((i) => i.status === "PARTNER").length,
      paused: all.filter((i) => i.status === "PAUSED").length,
      drop: all.filter((i) => i.status === "DROP").length,
      total: all.length,
      active: activeCount,
      softCap: PARTNER_TARGET_ACTIVE_SOFT_CAP,
      overCap: activeCount > PARTNER_TARGET_ACTIVE_SOFT_CAP,
    };

    return ok({ items, counts });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản tạo partner target.");
    }

    const body = partnerTargetWriteSchema.parse(await req.json());
    const item = await createPartnerTarget(body);
    return created(item);
  } catch (err) {
    return handleApiError(err);
  }
}
