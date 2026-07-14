/**
 * Auth qua zmp-sdk UMD (`window["zmp-sdk"]`) — KHÔNG import vào Vite bundle.
 */
import { AUTH_DEV_BYPASS } from "@/config";
import {
  loginWithZaloAccessToken,
  loginWithZaloDev,
  type HouseXUser,
} from "@/services/api";

type ZmpApis = {
  getAccessToken: (
    args?: Record<string, unknown>,
  ) => Promise<string> | void;
  getPhoneNumber: (
    args?: Record<string, unknown>,
  ) => Promise<{ token?: string }> | void;
  getUserInfo: (
    args?: Record<string, unknown>,
  ) => Promise<{ userInfo?: { name?: string } }> | void;
  authorize: (args?: Record<string, unknown>) => Promise<unknown> | void;
};

export type ZaloLoginPhase =
  | "idle"
  | "authorize"
  | "phone"
  | "profile"
  | "server"
  | "need_phone"
  | "done";

/** Phiên Zalo đã xin quyền — chờ SĐT để hoàn tất (tránh kẹt getPhoneNumber). */
export type PendingZaloSession = {
  accessToken: string;
  phoneToken?: string;
  name?: string;
  preferredRole: "CUSTOMER" | "BROKER";
};

export class NeedPhoneError extends Error {
  readonly prep: PendingZaloSession;
  constructor(prep: PendingZaloSession) {
    super(
      "Zalo đã kết nối. Nhập số điện thoại bên dưới rồi nhấn Hoàn tất đăng nhập.",
    );
    this.name = "NeedPhoneError";
    this.prep = prep;
  }
}

const AUTHORIZE_MS = 20000;
const PHONE_MS = 12000;
const PROFILE_MS = 5000;
const TOKEN_MS = 10000;

function getZmpApis(): ZmpApis {
  const g = globalThis as unknown as { "zmp-sdk"?: ZmpApis };
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
          `${label} quá lâu (${Math.round(ms / 1000)}s). Thử lại hoặc nhập SĐT để hoàn tất.`,
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

/**
 * Một số bản Zalo chỉ gọi success/fail, Promise treo → luôn gắn callback + Promise.
 */
function callZmp<T>(
  fn: (args?: Record<string, unknown>) => Promise<T> | void,
  args: Record<string, unknown>,
  ms: number,
  label: string,
): Promise<T> {
  return withTimeout(
    new Promise<T>((resolve, reject) => {
      let settled = false;
      const done = (run: () => void) => {
        if (settled) return;
        settled = true;
        run();
      };
      try {
        const ret = fn({
          ...args,
          success: (data: T) => done(() => resolve(data)),
          fail: (err: unknown) => {
            const msg =
              err && typeof err === "object" && "message" in err
                ? String((err as { message: unknown }).message)
                : String(err ?? "Zalo từ chối");
            done(() => reject(new Error(msg)));
          },
        });
        if (ret != null && typeof (ret as Promise<T>).then === "function") {
          (ret as Promise<T>).then(
            (v) => done(() => resolve(v)),
            (e) => done(() => reject(e instanceof Error ? e : new Error(String(e)))),
          );
        }
      } catch (e) {
        done(() => reject(e instanceof Error ? e : new Error(String(e))));
      }
    }),
    ms,
    label,
  );
}

function friendlyZaloError(err: unknown): Error {
  if (err instanceof NeedPhoneError) return err;
  const raw = err instanceof Error ? err.message : String(err ?? "");
  if (/cancel|denied|refuse|từ chối|người dùng/i.test(raw)) {
    return new Error("Bạn đã từ chối quyền. Cho phép SĐT để đăng nhập House X.");
  }
  if (/not found|NotFound|isMp|chỉ hoạt động|Chưa có Zalo SDK/i.test(raw)) {
    return new Error("Chức năng chỉ dùng trong Zalo Mini App.");
  }
  return err instanceof Error ? err : new Error(raw || "Không đăng nhập được Zalo");
}

function extractPhoneToken(res: unknown): string | undefined {
  if (!res || typeof res !== "object") return undefined;
  const o = res as Record<string, unknown>;
  const token = o.token ?? o.code;
  if (typeof token === "string" && token.trim().length > 4) return token.trim();
  return undefined;
}

/** Probe — không gọi SDK nếu chưa có. */
export async function probeZaloMiniApp(): Promise<boolean> {
  try {
    const api = getZmpApis();
    const token = await callZmp<string>(
      api.getAccessToken,
      {},
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
  const preferredRole = opts?.preferredRole ?? "CUSTOMER";
  const phoneFallback = opts?.phoneFallback?.trim();

  try {
    const { authorize, getAccessToken, getPhoneNumber, getUserInfo } =
      getZmpApis();

    onPhase?.("authorize");
    // Một số máy authorize không resolve sau khi đã cấp quyền → không được block vô hạn.
    await Promise.race([
      callZmp(
        authorize,
        { scopes: ["scope.userInfo", "scope.userPhonenumber"] },
        AUTHORIZE_MS,
        "Xin quyền Zalo",
      ).catch(() => undefined),
      new Promise<void>((r) => setTimeout(r, 8000)),
    ]);

    const accessToken = await callZmp<string>(
      getAccessToken,
      {},
      TOKEN_MS,
      "Lấy phiên Zalo",
    );
    if (!accessToken) {
      throw new Error("Không lấy được phiên Zalo. Thử mở lại Mini App.");
    }

    onPhase?.("phone");
    let phoneToken: string | undefined;
    try {
      const phoneRes = await callZmp<{ token?: string }>(
        getPhoneNumber,
        {},
        PHONE_MS,
        "Lấy số điện thoại Zalo",
      );
      phoneToken = extractPhoneToken(phoneRes);
    } catch {
      /* chuyển sang nhập SĐT thay vì kẹt vô hạn */
    }

    onPhase?.("profile");
    let name: string | undefined;
    try {
      const profile = await callZmp<{ userInfo?: { name?: string } }>(
        getUserInfo,
        { autoRequestPermission: true },
        PROFILE_MS,
        "Lấy tên Zalo",
      );
      name = profile?.userInfo?.name;
    } catch {
      /* optional */
    }

    if (!phoneToken && !phoneFallback) {
      onPhase?.("need_phone");
      throw new NeedPhoneError({
        accessToken,
        phoneToken,
        name,
        preferredRole,
      });
    }

    onPhase?.("server");
    const user = await loginWithZaloAccessToken({
      accessToken,
      ...(phoneFallback ? { phone: phoneFallback } : {}),
      phoneToken,
      name,
      preferredRole,
      timeoutMs: 22000,
    });
    onPhase?.("done");
    return user;
  } catch (err) {
    throw friendlyZaloError(err);
  }
}

/** Hoàn tất sau khi đã có phiên Zalo + SĐT người dùng nhập. */
export async function completeZaloLoginWithPhone(
  prep: PendingZaloSession,
  phone: string,
  onPhase?: (phase: ZaloLoginPhase) => void,
): Promise<HouseXUser> {
  const trimmed = phone.trim();
  onPhase?.("server");
  const user = await loginWithZaloAccessToken({
    accessToken: prep.accessToken,
    phone: trimmed,
    phoneToken: prep.phoneToken,
    name: prep.name,
    preferredRole: prep.preferredRole,
    timeoutMs: 22000,
  });
  onPhase?.("done");
  return user;
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
