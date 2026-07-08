import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  getSessionUser,
  getSessionUserFromRequest,
} from "@/lib/auth/session";
import { loadSessionProfile } from "@/lib/auth/session-profile";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

export async function GET(req: NextRequest) {
  const session =
    getSessionUserFromRequest(req) ?? (await getSessionUser());
  if (!session) {
    return applyApiCors(ok({ user: null }), req);
  }

  const profile = await loadSessionProfile(session);
  return applyApiCors(ok({ user: profile }), req);
}
