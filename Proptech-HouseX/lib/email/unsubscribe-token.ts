import { createHmac, createHash, timingSafeEqual } from "crypto";
import { getSiteUrl } from "@/lib/site-config";
import {
  EMAIL_NURTURE_CHANNEL,
  MARKETING_PURPOSE,
} from "@/lib/sales-core/marketing-email-consent";

const TOKEN_VERSION = 1 as const;
/** Default TTL for unsubscribe links in marketing mail (P1). P0 ops can re-issue. */
export const EMAIL_UNSUBSCRIBE_TTL_SEC = 90 * 24 * 60 * 60;

type UnsubscribePayload = {
  v: typeof TOKEN_VERSION;
  leadId: string;
  purpose: typeof MARKETING_PURPOSE;
  channel: typeof EMAIL_NURTURE_CHANNEL;
  exp: number;
};

function signingSecret(): string {
  const secret =
    process.env.EMAIL_UNSUBSCRIBE_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error("EMAIL_UNSUBSCRIBE_SECRET_or_AUTH_SECRET_required");
  }
  return secret;
}

function encodePayload(payload: UnsubscribePayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(raw: string): UnsubscribePayload | null {
  try {
    const json = Buffer.from(raw, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as UnsubscribePayload;
    if (
      parsed?.v !== TOKEN_VERSION ||
      typeof parsed.leadId !== "string" ||
      parsed.purpose !== MARKETING_PURPOSE ||
      parsed.channel !== EMAIL_NURTURE_CHANNEL ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function signBody(body: string): string {
  return createHmac("sha256", signingSecret()).update(body).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Issue opaque one-click unsubscribe token for a lead. */
export function issueEmailUnsubscribeToken(
  leadId: string,
  ttlSec: number = EMAIL_UNSUBSCRIBE_TTL_SEC,
): string {
  const payload: UnsubscribePayload = {
    v: TOKEN_VERSION,
    leadId: leadId.trim(),
    purpose: MARKETING_PURPOSE,
    channel: EMAIL_NURTURE_CHANNEL,
    exp: Math.floor(Date.now() / 1000) + ttlSec,
  };
  const body = encodePayload(payload);
  return `${body}.${signBody(body)}`;
}

export type VerifiedUnsubscribeToken = {
  leadId: string;
  purpose: string;
  channel: string;
  /** Hash fragment for withdraw idempotency (not the raw token). */
  tokenKey: string;
};

/** Verify token; returns null if invalid/expired. Does not mutate DB. */
export function verifyEmailUnsubscribeToken(
  raw: string,
): VerifiedUnsubscribeToken | null {
  const trimmed = raw.trim();
  const dot = trimmed.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = trimmed.slice(0, dot);
  const sig = trimmed.slice(dot + 1);
  if (!body || !sig) return null;

  let expected: string;
  try {
    expected = signBody(body);
  } catch {
    return null;
  }
  if (!safeEqual(sig, expected)) return null;

  const payload = decodePayload(body);
  if (!payload) return null;
  if (payload.exp * 1000 < Date.now()) return null;

  return {
    leadId: payload.leadId,
    purpose: payload.purpose,
    channel: payload.channel,
    tokenKey: createHash("sha256").update(trimmed).digest("hex").slice(0, 32),
  };
}

export function buildEmailUnsubscribeUrl(token: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  return `${base}/huy-dang-ky-email?token=${encodeURIComponent(token)}`;
}

/** Convenience for P1 marketing payloads. */
export function buildEmailUnsubscribeUrlForLead(leadId: string): string {
  return buildEmailUnsubscribeUrl(issueEmailUnsubscribeToken(leadId));
}
