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

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${HOUSEX_API_BASE}${path}`, {
    ...init,
    headers,
  });

  const json = (await res.json()) as ApiOk<T> & ApiErr;
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
