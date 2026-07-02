import type { PrismaClient, ProjectStatus, ProjectType } from "@prisma/client";

/** Accepts either the root PrismaClient or an interactive transaction client. */
type LegalDocReader = Pick<PrismaClient, "projectLegalDoc">;

/** Legal doc that must exist (and be issued) before a NOXH project can open for sale. */
export const NOXH_REQUIRED_DOC_TYPE = "giay_phep_xay_dung";
export const LEGAL_DOC_STATUS_AVAILABLE = "da_co";

export type GateResult =
  | { ok: true }
  | { ok: false; code: "NOXH_MISSING_LEGAL_DOC"; message: string };

/**
 * Rule #6 — NOXH legal gate.
 *
 * A project with `projectType = NHA_O_XA_HOI` may NOT transition its status to
 * `DANG_BAN` unless it already has a `ProjectLegalDoc` with
 * `docType = 'giay_phep_xay_dung'` and `status = 'da_co'`.
 *
 * Non-NOXH projects and any non-`DANG_BAN` target status pass through untouched.
 */
export async function assertNoxhSaleGate(
  prisma: LegalDocReader,
  params: {
    projectId: string;
    projectType: ProjectType;
    targetStatus: ProjectStatus;
  },
): Promise<GateResult> {
  const { projectId, projectType, targetStatus } = params;

  if (projectType !== "NHA_O_XA_HOI" || targetStatus !== "DANG_BAN") {
    return { ok: true };
  }

  const buildingPermit = await prisma.projectLegalDoc.findFirst({
    where: {
      projectId,
      docType: NOXH_REQUIRED_DOC_TYPE,
      status: LEGAL_DOC_STATUS_AVAILABLE,
    },
    select: { id: true },
  });

  if (!buildingPermit) {
    return {
      ok: false,
      code: "NOXH_MISSING_LEGAL_DOC",
      message:
        "Dự án nhà ở xã hội chưa thể chuyển sang DANG_BAN: thiếu giấy phép xây dựng (docType='giay_phep_xay_dung', status='da_co').",
    };
  }

  return { ok: true };
}
