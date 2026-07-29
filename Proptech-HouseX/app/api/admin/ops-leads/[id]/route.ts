import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  OpsTelesalesAccessError,
  requireOpsTelesalesAccess,
} from "@/lib/admin/ops-telesales-access";
import {
  getOpsLeadForAdmin,
  OpsLeadPatchError,
  patchOpsLeadForAdmin,
  serializeOpsLeadDetail,
} from "@/lib/leads/ops-lead-board";
import {
  assertPartnerReferralConsentForHandOff,
  getPartnerReferralConsentStatus,
  PartnerReferralConsentError,
} from "@/lib/leads/rental-partner-referral";
import { opsLeadPatchSchema } from "@/lib/validation/ops-lead";

type RouteCtx = { params: Promise<{ id: string }> };

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

function accessFail(err: OpsTelesalesAccessError, req: NextRequest) {
  const status = err.code === "UNAUTHORIZED" ? 401 : 403;
  return applyApiCors(fail(status, err.code, err.message), req);
}

async function serializeWithPartnerConsent(
  row: NonNullable<Awaited<ReturnType<typeof getOpsLeadForAdmin>>>,
) {
  const detail = serializeOpsLeadDetail(row);
  if (row.rentalIntent !== "TAX_HELP") {
    return { ...detail, partnerReferralConsent: null };
  }
  const partnerReferralConsent = await getPartnerReferralConsentStatus(row.id);
  return { ...detail, partnerReferralConsent };
}

export async function GET(req: NextRequest, ctx: RouteCtx) {
  try {
    await requireOpsTelesalesAccess(req);

    const { id } = await ctx.params;
    const row = await getOpsLeadForAdmin(id);
    if (!row) {
      return applyApiCors(
        fail(404, "NOT_FOUND", "Không tìm thấy lead Ops."),
        req,
      );
    }

    return applyApiCors(ok(await serializeWithPartnerConsent(row)), req);
  } catch (err) {
    if (err instanceof OpsTelesalesAccessError) return accessFail(err, req);
    return applyApiCors(handleApiError(err), req);
  }
}

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  try {
    const access = await requireOpsTelesalesAccess(req);

    const { id } = await ctx.params;
    const body = opsLeadPatchSchema.parse(await req.json());
    const { rentalPlacement, partnerReferralHanded, ...patch } = body;

    const updated = await patchOpsLeadForAdmin(id, patch);
    if (!updated) {
      return applyApiCors(
        fail(404, "NOT_FOUND", "Không tìm thấy lead Ops."),
        req,
      );
    }

    if (rentalPlacement) {
      const { recordRentalPlacementDeal } = await import(
        "@/lib/leads/rental-commission-deal"
      );
      await recordRentalPlacementDeal({
        leadId: id,
        actorId: access.actorId,
        outcome: rentalPlacement.outcome,
        feeVnd: rentalPlacement.feeVnd,
        monthsFee: rentalPlacement.monthsFee,
        listingCode: rentalPlacement.listingCode,
        lostReason: rentalPlacement.lostReason,
      });
    }

    if (partnerReferralHanded) {
      await assertPartnerReferralConsentForHandOff(id);
      const { recordPartnerReferralHanded } = await import(
        "@/lib/leads/rental-partner-referral"
      );
      await recordPartnerReferralHanded({
        leadId: id,
        actorId: access.actorId,
        kind: partnerReferralHanded.kind,
        partnerLabel: partnerReferralHanded.partnerLabel,
        note: partnerReferralHanded.note,
      });
    }

    const fresh = await getOpsLeadForAdmin(id);
    return applyApiCors(
      ok(await serializeWithPartnerConsent(fresh ?? updated)),
      req,
    );
  } catch (err) {
    if (err instanceof OpsTelesalesAccessError) return accessFail(err, req);
    if (err instanceof OpsLeadPatchError) {
      return applyApiCors(fail(422, err.code, err.message), req);
    }
    if (err instanceof PartnerReferralConsentError) {
      return applyApiCors(fail(422, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
