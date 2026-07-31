import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import {
  PartnerContractError,
  requestPartnerContractOtp,
} from "@/lib/data/partner-contract";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** CTV — gửi OTP email để ký e-contract. */
export async function POST(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        fail(session.status, session.code, session.message),
        req,
      );
    }

    const result = await requestPartnerContractOtp(session.brokerId);
    return applyApiCors(ok(result), req);
  } catch (err) {
    if (err instanceof PartnerContractError) {
      const status =
        err.code === "NOT_FOUND"
          ? 404
          : err.code === "ALREADY_SIGNED"
            ? 409
            : 422;
      return applyApiCors(fail(status, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
