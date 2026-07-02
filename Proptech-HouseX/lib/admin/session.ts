import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "hx_admin";
const DEFAULT_TTL_HOURS = 8;

function secret(): string {
  const s = process.env.ADMIN_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SECRET is required in production");
  }
  return "dev-insecure-admin-secret";
}

function signPayload(payloadB64: string): string {
  return createHmac("sha256", secret()).update(payloadB64).digest("base64url");
}

export function createAdminSessionToken(ttlHours = DEFAULT_TTL_HOURS): string {
  const exp = Date.now() + ttlHours * 3_600_000;
  const payloadB64 = Buffer.from(
    JSON.stringify({ scope: "admin", exp }),
  ).toString("base64url");
  return `${payloadB64}.${signPayload(payloadB64)}`;
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token?.trim()) return false;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;

  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = signPayload(payloadB64);

  try {
    if (
      sig.length !== expected.length ||
      !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    ) {
      return false;
    }
  } catch {
    return false;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8"),
    ) as { scope?: string; exp?: number };
    if (parsed.scope !== "admin" || typeof parsed.exp !== "number") return false;
    return Date.now() <= parsed.exp;
  } catch {
    return false;
  }
}

export const ADMIN_MAX_AGE_SEC = DEFAULT_TTL_HOURS * 3_600;

/** Cookie phiên admin (Server Component / Route Handler). */
export async function getAdminSessionFromCookies(): Promise<boolean> {
  const store = await cookies();
  return verifyAdminSessionToken(store.get(ADMIN_COOKIE)?.value);
}

/** Cookie hoặc header `x-admin-secret` (API / middleware). */
export function isAdminAuthorized(req: NextRequest): boolean {
  const envSecret = process.env.ADMIN_SECRET;
  const header = req.headers.get("x-admin-secret");
  if (envSecret && header === envSecret) return true;
  return verifyAdminSessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
}
