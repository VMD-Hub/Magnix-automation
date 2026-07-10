import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { AdminRole } from "@/lib/admin/roles";

export const ADMIN_COOKIE = "hx_admin";
const DEFAULT_TTL_HOURS = 8;

export type AdminSession = {
  role: AdminRole;
};

function signingSecret(): string | null {
  const s = process.env.ADMIN_SECRET?.trim();
  if (s) return s;
  if (process.env.NODE_ENV === "production") return null;
  return "dev-insecure-admin-secret";
}

function signPayload(payloadB64: string): string | null {
  const s = signingSecret();
  if (!s) return null;
  return createHmac("sha256", s).update(payloadB64).digest("base64url");
}

export function resolveAdminRoleFromSecret(
  provided: string | null | undefined,
): AdminRole | null {
  const value = provided?.trim();
  if (!value) return null;

  const superSecret = process.env.ADMIN_SECRET?.trim();
  const opsSecret = process.env.ADMIN_OPS_SECRET?.trim();

  if (superSecret && value === superSecret) return "super";
  if (opsSecret && value === opsSecret) return "ops";
  return null;
}

export function createAdminSessionToken(
  role: AdminRole = "super",
  ttlHours = DEFAULT_TTL_HOURS,
): string {
  const exp = Date.now() + ttlHours * 3_600_000;
  const payloadB64 = Buffer.from(
    JSON.stringify({ scope: "admin", role, exp }),
  ).toString("base64url");
  const sig = signPayload(payloadB64);
  if (!sig) {
    throw new Error("ADMIN_SECRET is required in production");
  }
  return `${payloadB64}.${sig}`;
}

export function parseAdminSessionToken(
  token: string | undefined | null,
): (AdminSession & { exp: number }) | null {
  if (!token?.trim()) return null;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = signPayload(payloadB64);
  if (!expected) return null;

  try {
    if (
      sig.length !== expected.length ||
      !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    ) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8"),
    ) as { scope?: string; role?: AdminRole; exp?: number };
    if (parsed.scope !== "admin" || typeof parsed.exp !== "number") return null;
    if (Date.now() > parsed.exp) return null;
    const role = parsed.role === "ops" ? "ops" : "super";
    return { role, exp: parsed.exp };
  } catch {
    return null;
  }
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  return parseAdminSessionToken(token) !== null;
}

export const ADMIN_MAX_AGE_SEC = DEFAULT_TTL_HOURS * 3_600;

export function getAdminSessionFromRequest(req: NextRequest): AdminSession | null {
  try {
    const headerRole = resolveAdminRoleFromSecret(req.headers.get("x-admin-secret"));
    if (headerRole) return { role: headerRole };

    const parsed = parseAdminSessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
    return parsed ? { role: parsed.role } : null;
  } catch {
    return null;
  }
}

/** Cookie phiên admin (Server Component / Route Handler). */
export async function getAdminSessionFromCookies(): Promise<AdminSession | null> {
  try {
    const store = await cookies();
    const parsed = parseAdminSessionToken(store.get(ADMIN_COOKIE)?.value);
    return parsed ? { role: parsed.role } : null;
  } catch {
    return null;
  }
}

/** Cookie hoặc header `x-admin-secret` (API / middleware). */
export function isAdminAuthorized(req: NextRequest): boolean {
  return getAdminSessionFromRequest(req) !== null;
}

export function isSuperAdminAuthorized(req: NextRequest): boolean {
  return getAdminSessionFromRequest(req)?.role === "super";
}
