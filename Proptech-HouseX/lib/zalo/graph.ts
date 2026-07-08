/**
 * Zalo Graph helpers — Mini App access token verify (ADR-014).
 * Không log accessToken / phone.
 */

export type ZaloMeProfile = {
  id: string;
  name?: string;
};

type ZaloMeResponse = {
  id?: string;
  name?: string;
  error?: number | string;
  message?: string;
};

export async function fetchZaloMe(accessToken: string): Promise<ZaloMeProfile> {
  const url = new URL("https://graph.zalo.me/v2.0/me");
  url.searchParams.set("fields", "id,name");
  url.searchParams.set("access_token", accessToken);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const data = (await res.json()) as ZaloMeResponse;
  if (!data.id) {
    const msg = data.message ?? String(data.error ?? res.status);
    throw new ZaloAuthError("ZALO_TOKEN_INVALID", `Zalo token không hợp lệ: ${msg}`);
  }
  return { id: String(data.id), name: data.name ? String(data.name) : undefined };
}

/**
 * Đổi phoneToken (Mini App getPhoneNumber) → số điện thoại.
 * Cần ZALO_APP_ID + ZALO_APP_SECRET. Nếu thiếu secret → bỏ qua (caller dùng phone từ client).
 */
export async function exchangeZaloPhoneToken(
  phoneToken: string,
): Promise<string | null> {
  const appId = process.env.ZALO_APP_ID?.trim();
  const secret = process.env.ZALO_APP_SECRET?.trim();
  if (!appId || !secret) return null;

  const res = await fetch("https://graph.zalo.me/v2.0/me/info", {
    method: "GET",
    headers: {
      access_token: phoneToken,
      code: phoneToken,
      secret_key: secret,
    },
    cache: "no-store",
  });

  const data = (await res.json()) as {
    data?: { number?: string };
    number?: string;
    error?: number;
    message?: string;
  };

  const number = data.data?.number ?? data.number;
  if (!number) return null;
  return String(number);
}

export class ZaloAuthError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ZaloAuthError";
  }
}
