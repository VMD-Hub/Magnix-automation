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
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<T> {
  const { timeoutMs, ...fetchInit } = init;
  const headers = new Headers(fetchInit.headers);
  headers.set("Accept", "application/json");
  /**
   * Không gắn X-HouseX-Channel: header custom bắt buộc preflight CORS.
   * Production chưa rebuild sẽ chặn → "Load failed" trong Zalo.
   * Channel gắn query khi cần (xem attachMiniappChannel).
   */
  if (fetchInit.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const url = `${HOUSEX_API_BASE}${attachMiniappChannel(path)}`;
  const signal =
    fetchInit.signal ??
    (typeof timeoutMs === "number" && timeoutMs > 0
      ? AbortSignal.timeout(timeoutMs)
      : undefined);

  let res: Response;
  try {
    res = await fetch(url, {
      ...fetchInit,
      headers,
      ...(signal ? { signal } : {}),
    });
  } catch (err) {
    if (err instanceof Error && /aborted|timeout/i.test(err.name + err.message)) {
      throw new Error(
        "Máy chủ phản hồi quá chậm. Kiểm tra mạng rồi thử lại.",
      );
    }
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
  phone?: string;
  phoneToken?: string;
  name?: string;
  preferredRole?: "CUSTOMER" | "BROKER";
  timeoutMs?: number;
}) {
  if (AUTH_DEV_BYPASS) {
    const phone = opts.phone?.trim();
    if (!phone) {
      throw new Error("Dev login cần số điện thoại.");
    }
    return loginWithZaloDev(
      phone,
      `dev-${phone}`,
      opts.preferredRole ?? "CUSTOMER",
    );
  }
  const data = await apiFetch<{ token: string; user: HouseXUser }>(
    "/api/auth/zalo",
    {
      method: "POST",
      timeoutMs: opts.timeoutMs ?? 22000,
      body: JSON.stringify({
        accessToken: opts.accessToken,
        phone: opts.phone,
        phoneToken: opts.phoneToken,
        name: opts.name,
        preferredRole: opts.preferredRole,
      }),
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

/** Bearer → one-time code để webview Set-Cookie hồ sơ web. */
export async function createMiniappHandoff(): Promise<{
  code: string;
  expiresIn: number;
}> {
  return apiFetch<{ code: string; expiresIn: number }>(
    "/api/auth/miniapp-handoff",
    { method: "POST", body: "{}" },
  );
}

export function logout() {
  setToken(null);
}
