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

export type ZaloLoginPhase =
  | "idle"
  | "authorize"
  | "phone"
  | "profile"
  | "server"
  | "done";

const SDK_STEP_MS = 28000;

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

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => {
      reject(
        new Error(
          `${label} quá lâu (${Math.round(ms / 1000)}s). Đóng Mini App rồi mở lại, hoặc nhập SĐT bên dưới.`,
        ),
      );
    }, ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
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
    const token = await withTimeout(
      g["zmp-sdk"].getAccessToken({}),
      8000,
      "Kiểm tra phiên Zalo",
    );
    return Boolean(token && token.length > 8);
  } catch {
    return false;
  }
}

export async function loginViaZaloMiniApp(opts?: {
  preferredRole?: "CUSTOMER" | "BROKER";
  phoneFallback?: string;
  onPhase?: (phase: ZaloLoginPhase) => void;
}): Promise<HouseXUser> {
  const onPhase = opts?.onPhase;
  try {
    const { authorize, getAccessToken, getPhoneNumber, getUserInfo } =
      getZmpApis();

    onPhase?.("authorize");
    await withTimeout(
      authorize({
        scopes: ["scope.userInfo", "scope.userPhonenumber"],
      }).catch(() => undefined),
      SDK_STEP_MS,
      "Xin quyền Zalo",
    );

    const accessToken = await withTimeout(
      getAccessToken({}),
      12000,
      "Lấy phiên Zalo",
    );
    if (!accessToken) {
      throw new Error("Không lấy được phiên Zalo. Thử mở lại Mini App.");
    }

    onPhase?.("phone");
    let phoneToken: string | undefined;
    try {
      const phoneRes = await withTimeout(
        getPhoneNumber({}),
        SDK_STEP_MS,
        "Lấy số điện thoại Zalo",
      );
      phoneToken = phoneRes?.token;
    } catch (phoneErr) {
      if (!opts?.phoneFallback?.trim()) {
        throw phoneErr;
      }
    }

    onPhase?.("profile");
    let name: string | undefined;
    try {
      const { userInfo } = await withTimeout(
        getUserInfo({ autoRequestPermission: true }),
        12000,
        "Lấy tên Zalo",
      );
      name = userInfo?.name;
    } catch {
      /* optional */
    }

    const phoneFallback = opts?.phoneFallback?.trim();
    if (!phoneToken && !phoneFallback) {
      throw new Error(
        "Cần cho phép số điện thoại Zalo, hoặc nhập SĐT bên dưới rồi nhấn lại.",
      );
    }

    onPhase?.("server");
    const user = await loginWithZaloAccessToken({
      accessToken,
      ...(phoneFallback ? { phone: phoneFallback } : {}),
      phoneToken,
      name,
      preferredRole: opts?.preferredRole,
    });
    onPhase?.("done");
    return user;
  } catch (err) {
    throw friendlyZaloError(err);
  }
}

export async function loginWithPhoneInMiniApp(opts: {
  phone: string;
  preferredRole?: "CUSTOMER" | "BROKER";
  asAgent?: boolean;
  onPhase?: (phase: ZaloLoginPhase) => void;
}): Promise<HouseXUser> {
  const preferredRole =
    opts.preferredRole ?? (opts.asAgent ? "BROKER" : "CUSTOMER");
  const trimmed = opts.phone.trim();
  const onPhase = opts.onPhase;

  if (AUTH_DEV_BYPASS) {
    onPhase?.("server");
    const user = await loginWithZaloDev(trimmed, `dev-${trimmed}`, preferredRole);
    onPhase?.("done");
    return user;
  }

  return loginViaZaloMiniApp({
    preferredRole,
    phoneFallback: trimmed,
    onPhase,
  });
}
