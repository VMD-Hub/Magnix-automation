import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

const PKCE_COOKIE = "hx_zalo_oauth_pkce";
const PKCE_TTL_MS = 10 * 60_000;
const OA_PERMISSION_URL = "https://oauth.zaloapp.com/v4/oa/permission";
const OA_TOKEN_URL = "https://oauth.zaloapp.com/v4/oa/access_token";

export type OaTokenExchangeResult = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

function adminSecret(): string {
  const s = process.env.ADMIN_SECRET?.trim();
  if (s) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SECRET is required for Zalo OA OAuth");
  }
  return "dev-insecure-admin-secret";
}

function signPayload(payloadB64: string): string {
  return createHmac("sha256", adminSecret()).update(payloadB64).digest("base64url");
}

function base64Url(buf: Buffer): string {
  return buf.toString("base64url");
}

/** PKCE pair cho Zalo OAuth v4 OA. */
export function createPkcePair(): { verifier: string; challenge: string } {
  const verifier = base64Url(randomBytes(32));
  const challenge = base64Url(
    createHash("sha256").update(verifier).digest(),
  );
  return { verifier, challenge };
}

/** Callback URL đăng ký trên developers.zalo.me (domain = Miền ứng dụng). */
export function getOaCallbackUrl(): string {
  const override = process.env.ZALO_OA_CALLBACK_URL?.trim();
  if (override) return override;
  const base = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (!base) {
    throw new Error("NEXT_PUBLIC_SITE_URL or ZALO_OA_CALLBACK_URL required");
  }
  return `${base}/api/zalo/oa/callback`;
}

export function buildOaPermissionUrl(params: {
  appId: string;
  redirectUri: string;
  codeChallenge: string;
}): string {
  const url = new URL(OA_PERMISSION_URL);
  url.searchParams.set("app_id", params.appId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("code_challenge", params.codeChallenge);
  return url.toString();
}

export function createPkceCookieValue(verifier: string): string {
  const exp = Date.now() + PKCE_TTL_MS;
  const payloadB64 = Buffer.from(
    JSON.stringify({ verifier, exp }),
  ).toString("base64url");
  return `${payloadB64}.${signPayload(payloadB64)}`;
}

export function readPkceVerifierFromCookie(
  cookieValue: string | undefined | null,
): string | null {
  if (!cookieValue?.trim()) return null;

  const dot = cookieValue.lastIndexOf(".");
  if (dot <= 0) return null;

  const payloadB64 = cookieValue.slice(0, dot);
  const sig = cookieValue.slice(dot + 1);
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
    ) as { verifier?: string; exp?: number };
    if (!parsed.verifier || typeof parsed.exp !== "number") return null;
    if (Date.now() > parsed.exp) return null;
    return parsed.verifier;
  } catch {
    return null;
  }
}

export const ZALO_OA_PKCE_COOKIE = PKCE_COOKIE;
export const ZALO_OA_PKCE_MAX_AGE_SEC = PKCE_TTL_MS / 1000;

export async function exchangeOaAuthCode(params: {
  appId: string;
  appSecret: string;
  code: string;
  codeVerifier: string;
}): Promise<OaTokenExchangeResult> {
  const res = await fetch(OA_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      secret_key: params.appSecret,
    },
    body: new URLSearchParams({
      app_id: params.appId,
      grant_type: "authorization_code",
      code: params.code,
      code_verifier: params.codeVerifier,
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

  if (!data.access_token || !data.refresh_token) {
    throw new Error(
      data.error_description ??
        data.error_name ??
        `OA token exchange failed (${res.status})`,
    );
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in ?? 3600,
  };
}
