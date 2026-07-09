import { createHmac } from "crypto";
import { normalizeOaToken } from "@/lib/zalo/oa-token-store";

/** SHA256 HMAC(access_token, app_secret) — bắt buộc khi bật app secret proof trên developers. */
export function buildAppSecretProof(accessToken: string, appSecret: string): string {
  return createHmac("sha256", appSecret).update(accessToken).digest("hex");
}

export function buildOaOpenApiHeaders(accessToken: string): Record<string, string> {
  const secret = normalizeOaToken(process.env.ZALO_APP_SECRET);
  const headers: Record<string, string> = {
    access_token: accessToken,
  };
  if (secret) {
    headers.appsecret_proof = buildAppSecretProof(accessToken, secret);
  }
  return headers;
}
