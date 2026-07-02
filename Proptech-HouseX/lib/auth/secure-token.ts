import { createHash, randomBytes } from "crypto";

/** Token thô gửi qua URL (32 byte, base64url). */
export function generateSecureToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Chỉ lưu hash SHA-256 — không lưu token thô trong DB. */
export function hashAuthToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}
