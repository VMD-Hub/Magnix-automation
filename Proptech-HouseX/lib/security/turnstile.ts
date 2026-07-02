import { getClientIpFromRequest } from "@/lib/security/client-ip";
import type { NextRequest } from "next/server";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function turnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}

export function turnstileSiteKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  return key || undefined;
}

type VerifyResult = { ok: true } | { ok: false; reason: string };

/** Xác minh token Turnstile. Bỏ qua nếu chưa cấu hình secret (dev). */
export async function verifyTurnstileToken(
  req: NextRequest,
  token: string | undefined | null,
): Promise<VerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return { ok: true };

  if (!token?.trim()) {
    return { ok: false, reason: "Thiếu mã xác minh. Vui lòng thử lại." };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token.trim(),
      remoteip: getClientIpFromRequest(req),
    });

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });

    const json = (await res.json()) as { success?: boolean };
    if (json.success) return { ok: true };
    return { ok: false, reason: "Xác minh không thành công. Vui lòng thử lại." };
  } catch {
    return { ok: false, reason: "Không thể xác minh. Thử lại sau." };
  }
}
