import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { isZaloOaNotifyEnabled, sendOaCsText } from "@/lib/zalo/oa";
import { getOaCallbackUrl } from "@/lib/zalo/oa-oauth";

const smokeBodySchema = z.object({
  zaloUserId: z.string().min(1, "Cần zaloUserId (user đã follow OA)."),
  text: z.string().max(500).optional(),
});

/** Trạng thái cấu hình DNA-D — không lộ token. */
export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
  }

  let callbackUrl: string | null = null;
  try {
    callbackUrl = getOaCallbackUrl();
  } catch {
    callbackUrl = null;
  }

  return ok({
    notifyEnabled: isZaloOaNotifyEnabled(),
    hasAppCreds: Boolean(
      process.env.ZALO_APP_ID?.trim() && process.env.ZALO_APP_SECRET?.trim(),
    ),
    hasAccessToken: Boolean(process.env.ZALO_OA_ACCESS_TOKEN?.trim()),
    hasRefreshToken: Boolean(process.env.ZALO_OA_REFRESH_TOKEN?.trim()),
    authMode: process.env.ZALO_OA_REFRESH_TOKEN?.trim()
      ? "refresh_token"
      : process.env.ZALO_OA_ACCESS_TOKEN?.trim()
        ? "access_token"
        : "none",
    callbackUrl,
    note:
      "DNA-D không cần Callback nếu dùng ZALO_OA_ACCESS_TOKEN từ API Explorer.",
  });
}

/** Gửi tin test OA CS tới một zaloUserId (admin). */
export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    if (!isZaloOaNotifyEnabled()) {
      return fail(
        503,
        "ZALO_OA_NOT_CONFIGURED",
        "Bật ZALO_OA_NOTIFY_ENABLED và cấu hình token (ACCESS hoặc REFRESH).",
      );
    }

    const body = smokeBodySchema.parse(await req.json());
    const text =
      body.text?.trim() ||
      "[House X] Smoke test DNA-D — Zalo OA milestone notify OK.";

    const result = await sendOaCsText({
      userId: body.zaloUserId,
      text,
    });

    if (result.ok) {
      return ok({ sent: true });
    }

    return fail(
      result.skipPermanent ? 422 : 502,
      result.skipPermanent ? "OA_RECIPIENT_SKIP" : "OA_SEND_FAILED",
      result.error,
    );
  } catch (err) {
    return handleApiError(err);
  }
}
