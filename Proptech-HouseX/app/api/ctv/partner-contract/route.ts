import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import {
  getPartnerContractState,
  PartnerContractError,
} from "@/lib/data/partner-contract";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** CTV — trạng thái e-contract + điều khoản phiên bản hiện tại. */
export async function GET(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        fail(session.status, session.code, session.message),
        req,
      );
    }

    const state = await getPartnerContractState(session.brokerId);
    return applyApiCors(ok(state), req);
  } catch (err) {
    if (err instanceof PartnerContractError) {
      return applyApiCors(fail(404, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
