import { createHash } from "crypto";
import type { NextRequest } from "next/server";

/** IP từ NextRequest (API routes, middleware). */
export function getClientIpFromRequest(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "0.0.0.0";
}

/** IP từ Headers (RSC / Server Components). */
export function getClientIpFromHeaders(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "0.0.0.0";
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export function ipHashFromRequest(req: NextRequest): string {
  return hashIp(getClientIpFromRequest(req));
}

export function ipHashFromHeaders(h: Headers): string {
  return hashIp(getClientIpFromHeaders(h));
}
