import { isZaloOaNotifyEnabled, sendOaCsText } from "@/lib/zalo/oa";
import type { MessagingSendResult } from "@/lib/messaging/types";

export function isTelesalesOaSendEnabled(): boolean {
  return isZaloOaNotifyEnabled();
}

export async function sendTelesalesOaText(params: {
  zaloUserId: string;
  text: string;
}): Promise<MessagingSendResult> {
  if (!isTelesalesOaSendEnabled()) {
    return { ok: false, error: "OA_DISABLED", skip: true };
  }
  const result = await sendOaCsText({
    userId: params.zaloUserId,
    text: params.text,
  });
  if (result.ok) return { ok: true };
  return {
    ok: false,
    error: result.error,
    skip: Boolean(result.skipPermanent),
  };
}
