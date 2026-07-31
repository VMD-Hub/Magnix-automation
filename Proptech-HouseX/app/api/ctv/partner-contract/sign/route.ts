import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import {
  PartnerContractError,
  signPartnerContract,
} from "@/lib/data/partner-contract";
import { partnerContractSignSchema } from "@/lib/validation/partner-contract";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** CTV — xác nhận OTP (+ canvas tuỳ chọn) → SIGNED. */
export async function POST(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        fail(session.status, session.code, session.message),
        req,
      );
    }

    const body = partnerContractSignSchema.parse(await req.json());
    const result = await signPartnerContract({
      brokerId: session.brokerId,
      otp: body.otp,
      accepted: body.accepted,
      signatureDataUrl: body.signatureDataUrl,
    });
    return applyApiCors(ok(result), req);
  } catch (err) {
    if (err instanceof PartnerContractError) {
      const status =
        err.code === "NOT_FOUND"
          ? 404
          : err.code.startsWith("OTP_")
            ? 422
            : 422;
      return applyApiCors(fail(status, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
