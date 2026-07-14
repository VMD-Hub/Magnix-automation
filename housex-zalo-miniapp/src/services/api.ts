import {
  AUTH_DEV_BYPASS,
  HOUSEX_API_BASE,
  TOKEN_STORAGE_KEY,
} from "../config";

export type HouseXUser = {
  id: string;
  role: "CUSTOMER" | "BROKER" | string;
  name: string;
  phoneMasked: string;
  email?: string;
  emailVerified?: boolean;
  brokerId?: string;
  brokerType?: string;
  ctvCode?: string | null;
  ctvApplicationStatus?: string | null;
};

type ApiOk<T> = { data: T };
type ApiErr = { error: { code: string; message: string } };

function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function friendlyNetworkError(err: unknown): Error {
  const msg = err instanceof Error ? err.message : String(err);
  if (
    /failed to fetch|networkerror|load failed|network request failed/i.test(
      msg,
    )
  ) {
    return new Error(
      "Không kết nối được máy chủ House X. Kiểm tra mạng hoặc thử lại.",
    );
  }
  return err instanceof Error ? err : new Error(msg || "Lỗi không xác định");
}

/** Query channel — không dùng custom header (tránh CORS preflight fail). */
function attachMiniappChannel(path: string): string {
  if (path.includes("hxChannel=")) return path;
  const join = path.includes("?") ? "&" : "?";
  return `${path}${join}hxChannel=miniapp`;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  /**
   * Không gắn X-HouseX-Channel: header custom bắt buộc preflight CORS.
   * Production chưa rebuild sẽ chặn → "Load failed" trong Zalo.
   * Channel gắn query khi cần (xem attachMiniappChannel).
   */
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const url = `${HOUSEX_API_BASE}${attachMiniappChannel(path)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers,
    });
  } catch (err) {
    throw friendlyNetworkError(err);
  }

  let json: (ApiOk<T> & ApiErr) | null = null;
  try {
    json = (await res.json()) as ApiOk<T> & ApiErr;
  } catch {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    throw new Error("Phản hồi API không hợp lệ");
  }

  if (!res.ok) {
    throw new Error(json.error?.message ?? `HTTP ${res.status}`);
  }
  return json.data;
}

export async function loginWithZaloDev(
  phone: string,
  zaloUserId: string,
  preferredRole: "CUSTOMER" | "BROKER" = "CUSTOMER",
) {
  const data = await apiFetch<{ token: string; user: HouseXUser }>(
    "/api/auth/zalo",
    {
      method: "POST",
      body: JSON.stringify({
        zaloUserId:
          preferredRole === "BROKER" ? `broker-${zaloUserId}` : zaloUserId,
        phone,
        preferredRole,
        name:
          preferredRole === "BROKER"
            ? "HouseX Agent (dev)"
            : "House X (dev)",
      }),
    },
  );
  setToken(data.token);
  return data.user;
}

/**
 * Production path — gọi từ trang Tài khoản khi chạy trong Zalo.
 * Dev bypass: loginWithZaloDev.
 */
export async function loginWithZaloAccessToken(opts: {
  accessToken: string;
  phone: string;
  phoneToken?: string;
  name?: string;
}) {
  if (AUTH_DEV_BYPASS) {
    return loginWithZaloDev(opts.phone, `dev-${opts.phone}`);
  }
  const data = await apiFetch<{ token: string; user: HouseXUser }>(
    "/api/auth/zalo",
    {
      method: "POST",
      body: JSON.stringify(opts),
    },
  );
  setToken(data.token);
  return data.user;
}

export async function fetchMe(): Promise<HouseXUser | null> {
  if (!getToken()) return null;
  const data = await apiFetch<{ user: HouseXUser | null }>("/api/auth/me");
  return data.user;
}

export function logout() {
  setToken(null);
}
