/**
 * Auth qua zmp-sdk UMD (`window["zmp-sdk"]`) — KHÔNG import vào Vite bundle.
 * Import zmp-sdk qua bundler dễ làm Mini App trắng màn khi khởi động.
 */
import { AUTH_DEV_BYPASS } from "@/config";
import {
  loginWithZaloAccessToken,
  loginWithZaloDev,
  type HouseXUser,
} from "@/services/api";

type ZmpApis = {
  getAccessToken: (args?: Record<string, unknown>) => Promise<string>;
  getPhoneNumber: (
    args?: Record<string, unknown>,
  ) => Promise<{ token?: string }>;
  getUserInfo: (args?: Record<string, unknown>) => Promise<{
    userInfo?: { name?: string };
  }>;
  authorize: (args?: Record<string, unknown>) => Promise<unknown>;
};

function getZmpApis(): ZmpApis {
  const g = globalThis as unknown as {
    "zmp-sdk"?: ZmpApis;
  };
  const api = g["zmp-sdk"];
  if (!api?.getAccessToken) {
    throw new Error(
      "Chưa có Zalo SDK. Mở Mini App trong Zalo (không dùng trình duyệt thường).",
    );
  }
  return api;
}

function friendlyZaloError(err: unknown): Error {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  if (/cancel|denied|refuse|từ chối|người dùng/i.test(raw)) {
    return new Error("Bạn đã từ chối quyền. Cho phép SĐT để đăng nhập House X.");
  }
  if (/not found|NotFound|isMp|chỉ hoạt động|Chưa có Zalo SDK/i.test(raw)) {
    return new Error("Chức năng chỉ dùng trong Zalo Mini App.");
  }
  return err instanceof Error ? err : new Error(raw || "Không đăng nhập được Zalo");
}

/** Probe — không gọi SDK nếu chưa có (tránh throw lúc vào Tài khoản). */
export async function probeZaloMiniApp(): Promise<boolean> {
  try {
    const g = globalThis as unknown as { "zmp-sdk"?: ZmpApis };
    if (!g["zmp-sdk"]?.getAccessToken) return false;
    const token = await g["zmp-sdk"].getAccessToken({});
    return Boolean(token && token.length > 8);
  } catch {
    return false;
  }
}

export async function loginViaZaloMiniApp(opts?: {
  preferredRole?: "CUSTOMER" | "BROKER";
  phoneFallback?: string;
}): Promise<HouseXUser> {
  try {
    const { authorize, getAccessToken, getPhoneNumber, getUserInfo } =
      getZmpApis();

    await authorize({
      scopes: ["scope.userInfo", "scope.userPhonenumber"],
    }).catch(() => undefined);

    const accessToken = await getAccessToken({});
    if (!accessToken) {
      throw new Error("Không lấy được phiên Zalo. Thử mở lại Mini App.");
    }

    let phoneToken: string | undefined;
    try {
      const phoneRes = await getPhoneNumber({});
      phoneToken = phoneRes?.token;
    } catch {
      /* optional */
    }

    let name: string | undefined;
    try {
      const { userInfo } = await getUserInfo({ autoRequestPermission: true });
      name = userInfo?.name;
    } catch {
      /* optional */
    }

    const phoneFallback = opts?.phoneFallback?.trim();
    if (!phoneToken && !phoneFallback) {
      throw new Error(
        "Cần cho phép số điện thoại Zalo, hoặc nhập SĐT bên dưới rồi nhấn Đăng nhập.",
      );
    }

    return loginWithZaloAccessToken({
      accessToken,
      ...(phoneFallback ? { phone: phoneFallback } : {}),
      phoneToken,
      name,
      preferredRole: opts?.preferredRole,
    });
  } catch (err) {
    throw friendlyZaloError(err);
  }
}

export async function loginWithPhoneInMiniApp(opts: {
  phone: string;
  preferredRole?: "CUSTOMER" | "BROKER";
  asAgent?: boolean;
}): Promise<HouseXUser> {
  const preferredRole =
    opts.preferredRole ?? (opts.asAgent ? "BROKER" : "CUSTOMER");
  const trimmed = opts.phone.trim();

  if (AUTH_DEV_BYPASS) {
    return loginWithZaloDev(trimmed, `dev-${trimmed}`, preferredRole);
  }

  try {
    const { authorize, getAccessToken, getPhoneNumber, getUserInfo } =
      getZmpApis();

    await authorize({
      scopes: ["scope.userInfo", "scope.userPhonenumber"],
    }).catch(() => undefined);

    const accessToken = await getAccessToken({});
    if (!accessToken) {
      throw new Error(
        "Không lấy được phiên Zalo. Mở Mini App trong Zalo rồi thử lại.",
      );
    }

    let phoneToken: string | undefined;
    try {
      const phoneRes = await getPhoneNumber({});
      phoneToken = phoneRes?.token;
    } catch {
      /* optional */
    }

    let name: string | undefined;
    try {
      const { userInfo } = await getUserInfo({ autoRequestPermission: true });
      name = userInfo?.name;
    } catch {
      /* optional */
    }

    return loginWithZaloAccessToken({
      accessToken,
      phone: trimmed,
      phoneToken,
      name,
      preferredRole,
    });
  } catch (err) {
    throw friendlyZaloError(err);
  }
}
