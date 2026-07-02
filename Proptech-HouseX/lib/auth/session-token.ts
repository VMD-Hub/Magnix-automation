import { createHmac, timingSafeEqual } from "crypto";
import type { SessionUser } from "@/lib/auth/session";

const DEFAULT_TTL_DAYS = 30;

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production");
  }
  return "dev-insecure-auth-secret";
}

function signPayload(payloadB64: string): string {
  return createHmac("sha256", secret()).update(payloadB64).digest("base64url");
}

/** Tạo token phiên đã ký: base64url(payload).signature */
export function createSessionToken(
  customerId: string,
  ttlDays = DEFAULT_TTL_DAYS,
): string {
  const exp = Date.now() + ttlDays * 86_400_000;
  const payloadB64 = Buffer.from(
    JSON.stringify({ sub: customerId, exp }),
  ).toString("base64url");
  return `${payloadB64}.${signPayload(payloadB64)}`;
}

/** Xác thực token — trả null nếu hết hạn hoặc chữ ký không hợp lệ. */
export function verifySessionToken(token: string): SessionUser | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = signPayload(payloadB64);

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
    ) as { sub?: string; exp?: number };
    if (typeof parsed.sub !== "string" || typeof parsed.exp !== "number") {
      return null;
    }
    if (Date.now() > parsed.exp) return null;
    return { id: parsed.sub };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE_SEC = DEFAULT_TTL_DAYS * 86_400;
