import type { NoxhObjectGroupId } from "@/lib/finance/noxh-rules";
import type { LeadTier } from "@/lib/finance/noxh-lead";
import {
  createPlatformNoxhCase,
  PlatformNoxhCaseError,
} from "@/lib/data/noxh-case";
import { prisma } from "@/lib/prisma";

/** Bật auto tạo hồ sơ Ops khi wizard trả tier HOT (mặc định true). */
export function isWizardHotAutoCaseEnabled(): boolean {
  const raw = process.env.NOXH_WIZARD_HOT_AUTO_CASE;
  if (raw === undefined || raw === "") return true;
  return raw.trim().toLowerCase() === "true";
}

export function shouldAutoCreatePlatformCaseForWizardTier(
  tier: LeadTier,
): boolean {
  return tier === "HOT" && isWizardHotAutoCaseEnabled();
}

export function buildWizardHotOpsNote(params: {
  reasonCodes: string[];
  recommendedAction: string;
  rulesVersion: string;
}): string {
  const codes = params.reasonCodes.join(", ") || "eligible_ready";
  return [
    "Auto: công cụ NOXH tier HOT",
    `reason=${codes}`,
    `rules=${params.rulesVersion}`,
    params.recommendedAction,
  ].join(" · ");
}

/**
 * Tạo hồ sơ NOXH platform (brokerId null) từ lead wizard HOT.
 * Idempotent theo leadId — submit trùng trả case hiện có.
 */
export async function ensurePlatformNoxhCaseFromWizardHot(params: {
  leadId: string;
  customerName: string;
  phone: string;
  objectGroup: NoxhObjectGroupId;
  intendToBorrow: boolean;
  reasonCodes: string[];
  recommendedAction: string;
  rulesVersion: string;
}) {
  const opsNote = buildWizardHotOpsNote({
    reasonCodes: params.reasonCodes,
    recommendedAction: params.recommendedAction,
    rulesVersion: params.rulesVersion,
  });

  try {
    return await createPlatformNoxhCase({
      leadId: params.leadId,
      customerName: params.customerName,
      phone: params.phone,
      objectGroup: params.objectGroup,
      intendToBorrow: params.intendToBorrow,
      opsNote,
    });
  } catch (err) {
    if (
      err instanceof PlatformNoxhCaseError &&
      err.code === "CASE_EXISTS" &&
      err.existingCaseId
    ) {
      const existing = await prisma.noxhCase.findUnique({
        where: { id: err.existingCaseId },
        select: { id: true, code: true },
      });
      if (existing) {
        return {
          case: existing,
          created: false as const,
        };
      }
    }
    throw err;
  }
}
