import { createHash } from "crypto";
import type { NextRequest } from "next/server";

/** Lấy IP client từ header proxy (x-forwarded-for / x-real-ip). */
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "0.0.0.0";
}

/** Hash IP để không lưu PII thô (dùng cho dedup/rate-limit key). */
export function ipHash(req: NextRequest): string {
  return createHash("sha256").update(getClientIp(req)).digest("hex").slice(0, 16);
}
