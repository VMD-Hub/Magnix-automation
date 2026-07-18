/**
 * One-time handoff: Mini App Bearer → web cookie `hx_session`.
 * Signed HMAC (AUTH_SECRET); TTL ngắn — không log code/PII.
 */
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const HANDOFF_TTL_MS = 60_000;
export const HANDOFF_EXPIRES_IN_SEC = 60;

const ALLOWED_NEXT = new Set([
  "/khach-hang/tai-khoan",
  "/moi-gioi/tai-khoan",
  "/ops/telesales",
]);

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production");
  }
  return "dev-insecure-auth-secret";
}

function signPayload(payloadB64: string): string {
  return createHmac("sha256", secret())
    .update(`miniapp-handoff:${payloadB64}`)
    .digest("base64url");
}

export function isAllowedHandoffNext(path: string): boolean {
  const clean = path.split("?")[0]?.split("#")[0] ?? "";
  return ALLOWED_NEXT.has(clean);
}

export function createMiniappHandoffCode(accountId: string): {
  code: string;
  expiresIn: number;
} {
  const payloadB64 = Buffer.from(
    JSON.stringify({
      sub: accountId,
      exp: Date.now() + HANDOFF_TTL_MS,
      nonce: randomBytes(8).toString("hex"),
      purpose: "miniapp-handoff",
    }),
  ).toString("base64url");
  const code = `${payloadB64}.${signPayload(payloadB64)}`;
  return { code, expiresIn: HANDOFF_EXPIRES_IN_SEC };
}

/** Verify handoff code → account id hoặc null. */
export function verifyMiniappHandoffCode(code: string): string | null {
  const dot = code.lastIndexOf(".");
  if (dot <= 0) return null;

  const payloadB64 = code.slice(0, dot);
  const sig = code.slice(dot + 1);
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
    ) as {
      sub?: string;
      exp?: number;
      purpose?: string;
    };
    if (
      parsed.purpose !== "miniapp-handoff" ||
      typeof parsed.sub !== "string" ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }
    if (Date.now() > parsed.exp) return null;
    return parsed.sub;
  } catch {
    return null;
  }
}
