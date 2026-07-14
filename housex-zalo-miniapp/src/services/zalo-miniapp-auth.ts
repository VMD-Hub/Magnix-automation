/**
 * Auth qua zmp-sdk trong Zalo Mini App.
 * Ngoài Zalo (browser/Vite) các API sẽ fail — caller dùng fallback.
 */
import {
  authorize,
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
} from "zmp-sdk/apis";
import { AUTH_DEV_BYPASS } from "@/config";
import {
  loginWithZaloAccessToken,
  loginWithZaloDev,
  type HouseXUser,
} from "@/services/api";

function friendlyZaloError(err: unknown): Error {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  if (/cancel|denied|refuse|từ chối|người dùng/i.test(raw)) {
    return new Error("Bạn đã từ chối quyền. Cho phép SĐT để đăng nhập House X.");
  }
  if (/not found|NotFound|isMp|chỉ hoạt động/i.test(raw)) {
    return new Error("Chức năng chỉ dùng trong Zalo Mini App.");
  }
  return err instanceof Error ? err : new Error(raw || "Không đăng nhập được Zalo");
}

/** Thử lấy access token — báo có đang trong Zalo hay không. */
export async function probeZaloMiniApp(): Promise<boolean> {
  try {
    const token = await getAccessToken({});
    return Boolean(token && token.length > 8);
  } catch {
    return false;
  }
}

/**
 * One-tap: xin quyền → accessToken + phoneToken (+ tên nếu có).
 * Server đổi phoneToken → SĐT khi có ZALO_APP_SECRET.
 */
export async function loginViaZaloMiniApp(opts?: {
  preferredRole?: "CUSTOMER" | "BROKER";
  /** Fallback nếu phoneToken không đổi được trên server */
  phoneFallback?: string;
}): Promise<HouseXUser> {
  try {
    await authorize({
      scopes: ["scope.userInfo", "scope.userPhonenumber"],
    }).catch(() => {
      /* một số phiên bản đã cấp quyền mặc định */
    });

    const accessToken = await getAccessToken({});
    if (!accessToken) {
      throw new Error("Không lấy được phiên Zalo. Thử mở lại Mini App.");
    }

    let phoneToken: string | undefined;
    try {
      const phoneRes = await getPhoneNumber({});
      phoneToken = phoneRes?.token;
    } catch {
      /* user từ chối SĐT — dùng phoneFallback */
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

/**
 * Đăng nhập bằng SĐT đã nhập.
 * - Dev bypass: mock zaloUserId
 * - Production trong Zalo: gắn accessToken thật
 */
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
    await authorize({
      scopes: ["scope.userInfo", "scope.userPhonenumber"],
    }).catch(() => undefined);

    const accessToken = await getAccessToken({});
    if (!accessToken) {
      throw new Error("Không lấy được phiên Zalo. Mở Mini App trong Zalo rồi thử lại.");
    }

    let phoneToken: string | undefined;
    try {
      const phoneRes = await getPhoneNumber({});
      phoneToken = phoneRes?.token;
    } catch {
      /* SĐT nhập tay vẫn được */
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
