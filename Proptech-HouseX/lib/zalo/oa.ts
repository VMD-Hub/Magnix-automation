/**
 * Zalo Official Account — access token + CS text message (DNA-D).
 * Không log token / refresh_token.
 */

import { readOaRefreshToken, writeOaRefreshToken, normalizeOaToken } from "@/lib/zalo/oa-token-store";
import { buildOaOpenApiHeaders } from "@/lib/zalo/oa-api-headers";

export type OaSendResult =
  | { ok: true }
  | { ok: false; error: string; skipPermanent?: boolean };

let tokenCache: { token: string; expiresAt: number } | null = null;

export function clearOaTokenCacheForTests(): void {
  tokenCache = null;
}

export function isZaloOaNotifyEnabled(): boolean {
  if (process.env.ZALO_OA_NOTIFY_ENABLED?.trim().toLowerCase() === "false") {
    return false;
  }
  const appId = process.env.ZALO_APP_ID?.trim();
  const secret = normalizeOaToken(process.env.ZALO_APP_SECRET);
  if (!appId || !secret) return false;
  const refresh = readOaRefreshToken();
  const access = normalizeOaToken(process.env.ZALO_OA_ACCESS_TOKEN);
  const validRefresh = Boolean(refresh);
  const validAccess = Boolean(access);
  return validRefresh || validAccess;
}

/** Mã lỗi Zalo OA — user chưa quan tâm OA → không retry outbox. */
function isPermanentOaRecipientError(code: number | string | undefined): boolean {
  const n = Number(code);
  return n === -213 || n === -216 || n === -217;
}

export type OaTokenRefreshResult =
  | { ok: true; source: "refresh" | "static" | "cache"; expiresIn?: number }
  | { ok: false; error: string };

/** Refresh hoặc đọc access token — dùng cho API + diagnose. */
export async function refreshOaAccessToken(): Promise<{
  accessToken: string;
  meta: OaTokenRefreshResult;
}> {
  const staticToken = normalizeOaToken(process.env.ZALO_OA_ACCESS_TOKEN);
  const refresh = readOaRefreshToken();
  const appId = process.env.ZALO_APP_ID?.trim();
  const secret = normalizeOaToken(process.env.ZALO_APP_SECRET);

  if (!appId || !secret) {
    throw new Error("ZALO_APP_ID / ZALO_APP_SECRET required for OA notify");
  }

  const accessOnly =
    process.env.ZALO_OA_TOKEN_MODE?.trim().toLowerCase() === "access_only";
  if (accessOnly && staticToken) {
    return { accessToken: staticToken, meta: { ok: true, source: "static" } };
  }

  if (!refresh && staticToken) {
    return { accessToken: staticToken, meta: { ok: true, source: "static" } };
  }

  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 60_000) {
    return {
      accessToken: tokenCache.token,
      meta: { ok: true, source: "cache" },
    };
  }

  if (!refresh) {
    throw new Error("ZALO_OA_REFRESH_TOKEN or ZALO_OA_ACCESS_TOKEN required");
  }

  const res = await fetch("https://oauth.zaloapp.com/v4/oa/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      secret_key: secret,
    },
    body: new URLSearchParams({
      app_id: appId,
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
    cache: "no-store",
  });

  const data = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    error_name?: string;
    error_description?: string;
  };

  if (!data.access_token) {
    const err =
      data.error_description ??
      data.error_name ??
      `OA access_token failed (${res.status})`;
    throw new Error(
      `${err} — lấy token mới từ API Explorer, cập nhật .env (hoặc ZALO_OA_TOKEN_MODE=access_only + ACCESS_TOKEN).`,
    );
  }

  if (data.refresh_token) {
    writeOaRefreshToken(data.refresh_token);
  }

  tokenCache = {
    token: data.access_token,
    expiresAt: now + (data.expires_in ?? 3600) * 1000,
  };
  return {
    accessToken: data.access_token,
    meta: { ok: true, source: "refresh", expiresIn: data.expires_in },
  };
}

async function getOaAccessToken(): Promise<string> {
  const { accessToken } = await refreshOaAccessToken();
  return accessToken;
}

/** Dùng cho script ops (list followers, v.v.). */
export async function fetchOaAccessToken(): Promise<string> {
  return getOaAccessToken();
}

/** Gửi tin tư vấn (CS) tới user đã quan tâm OA. */
export async function sendOaCsText(params: {
  userId: string;
  text: string;
}): Promise<OaSendResult> {
  const userId = String(params.userId || "").trim();
  const text = String(params.text || "").trim().slice(0, 2000);
  if (!userId || !text) {
    return { ok: false, error: "INVALID_OA_MESSAGE", skipPermanent: true };
  }

  try {
    const accessToken = await getOaAccessToken();
    const res = await fetch("https://openapi.zalo.me/v3.0/oa/message/cs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...buildOaOpenApiHeaders(accessToken),
      },
      body: JSON.stringify({
        recipient: { user_id: userId },
        message: { text },
      }),
      cache: "no-store",
    });

    const data = (await res.json()) as {
      error?: number;
      message?: string;
    };

    if (data.error === 0 || (!data.error && res.ok)) {
      return { ok: true };
    }

    const errMsg =
      data.error != null
        ? `${data.message ?? "OA CS failed"} (error=${data.error})`
        : (data.message ?? `OA CS ${res.status}`);
    if (isPermanentOaRecipientError(data.error)) {
      return { ok: false, error: errMsg, skipPermanent: true };
    }
    return { ok: false, error: errMsg };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
