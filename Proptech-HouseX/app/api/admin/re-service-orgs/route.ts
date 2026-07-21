import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import {
  listReServiceOrgs,
  type ReServiceAdminUnit,
  type ReServiceOpsStatus,
  type ReServiceUnitType,
} from "@/lib/admin/re-service-org-registry";

/** Chủ quản: registry tổ chức KD dịch vụ BĐS (nội bộ, seed). */
export async function GET(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(
        403,
        "FORBIDDEN",
        "Chỉ Chủ quản xem registry tổ chức dịch vụ BĐS.",
      );
    }

    const sp = req.nextUrl.searchParams;
    const adminUnit = (sp.get("adminUnit") ?? "ALL") as
      | ReServiceAdminUnit
      | "ALL";
    const unitType = (sp.get("unitType") ?? "ALL") as
      | ReServiceUnitType
      | "ALL";
    const opsStatus = (sp.get("opsStatus") ?? "ALL") as
      | ReServiceOpsStatus
      | "ALL";
    const q = sp.get("q") ?? undefined;

    const data = listReServiceOrgs({ adminUnit, unitType, opsStatus, q });
    return ok(data);
  } catch (err) {
    return handleApiError(err);
  }
}
