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

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
  } catch {
    throw new ZaloAuthError(
      "ZALO_NETWORK",
      "Không xác thực được Zalo (mạng chậm). Thử lại sau ít giây.",
    );
  }

  const data = (await res.json()) as ZaloMeResponse;
  if (!data.id) {
    const msg = data.message ?? String(data.error ?? res.status);
    throw new ZaloAuthError("ZALO_TOKEN_INVALID", `Zalo token không hợp lệ: ${msg}`);
  }
  return { id: String(data.id), name: data.name ? String(data.name) : undefined };
}

/**
 * Đổi code từ Mini App getPhoneNumber → số điện thoại.
 * Bắt buộc: accessToken (getAccessToken) + code (getPhoneNumber) + secret_key.
 * Không gửi phoneToken vào header access_token — Zalo sẽ trả lỗi / số rỗng.
 * Thiếu secret → null (caller dùng phone nhập tay nếu có).
 */
export async function exchangeZaloPhoneToken(
  phoneCode: string,
  accessToken: string,
): Promise<string | null> {
  const secret = process.env.ZALO_APP_SECRET?.trim();
  if (!secret || !accessToken?.trim() || !phoneCode?.trim()) return null;

  let res: Response;
  try {
    res = await fetch("https://graph.zalo.me/v2.0/me/info", {
      method: "GET",
      headers: {
        access_token: accessToken,
        code: phoneCode,
        secret_key: secret,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
  } catch {
    return null;
  }

  const data = (await res.json()) as {
    data?: { number?: string };
    number?: string;
    error?: number;
    message?: string;
  };

  const number = data.data?.number ?? data.number;
  if (!number) {
    // Không throw — caller fallback sang phone nhập tay; log mã lỗi an toàn.
    if (data.error != null && data.error !== 0) {
      console.warn(
        "[zalo/phone] exchange failed",
        typeof data.error === "number" ? data.error : "err",
      );
    }
    return null;
  }
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
