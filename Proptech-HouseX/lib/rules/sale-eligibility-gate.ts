import type { ProjectStatus, ProjectType } from "@prisma/client";

export type SaleEligibilityResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

/**
 * Phase B — cổng tối thiểu trước khi nhận giữ suất / cọc.
 * Mở rộng ADR-013 (GPXD + thông báo Sở XD) ở Phase C.
 */
export function assertProjectAcceptsBookings(params: {
  projectStatus: ProjectStatus;
  projectType: ProjectType;
}): SaleEligibilityResult {
  if (params.projectStatus !== "DANG_BAN") {
    return {
      ok: false,
      code: "PROJECT_NOT_OPEN",
      message: "Dự án chưa mở bán — chưa nhận giữ suất.",
    };
  }
  return { ok: true };
}

/** Chỉ căn AVAILABLE mới nhận thêm giữ suất. Lock chỉ khi chuyển cọc thủ công. */
export function assertUnitAcceptsBookings(
  unitStatus: string,
): SaleEligibilityResult {
  if (unitStatus !== "AVAILABLE") {
    return {
      ok: false,
      code: "UNIT_NOT_AVAILABLE",
      message:
        "Căn không còn nhận giữ suất (đã cọc hoặc không còn mở bán).",
    };
  }
  return { ok: true };
}
