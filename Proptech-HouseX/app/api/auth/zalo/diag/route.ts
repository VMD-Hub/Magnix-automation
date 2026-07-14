import { NextRequest } from "next/server";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/**
 * Chẩn đoán auth Zalo — không trả secret/PII.
 * GET /api/auth/zalo/diag
 */
export async function GET(req: NextRequest) {
  let dbOk = false;
  let dbError: string | undefined;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (e) {
    dbError = e instanceof Error ? e.message.slice(0, 120) : "db_error";
  }

  const bypass = process.env.ZALO_AUTH_DEV_BYPASS === "true";
  const body = {
    ok: dbOk && Boolean(process.env.AUTH_SECRET?.trim()),
    nodeEnv: process.env.NODE_ENV ?? "unknown",
    bypass,
    hasAuthSecret: Boolean(process.env.AUTH_SECRET?.trim()),
    hasZaloAppId: Boolean(process.env.ZALO_APP_ID?.trim()),
    hasZaloAppSecret: Boolean(process.env.ZALO_APP_SECRET?.trim()),
    zaloAppIdSuffix: (process.env.ZALO_APP_ID ?? "").slice(-6) || null,
    dbOk,
    dbError: dbOk ? undefined : dbError,
    hint: bypass
      ? "Nên đặt ZALO_AUTH_DEV_BYPASS=false trên production (accessToken thật vẫn chạy)."
      : null,
  };

  return applyApiCors(ok(body), req);
}
