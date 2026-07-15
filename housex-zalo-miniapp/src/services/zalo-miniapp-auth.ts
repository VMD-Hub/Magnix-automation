/**
 * Auth qua zmp-sdk UMD (`window["zmp-sdk"]`) — KHÔNG import vào Vite bundle.
 */
import { AUTH_DEV_BYPASS, HOUSEX_API_BASE } from "@/config";
import {
  fetchServerAuthDiag,
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

/**
 * Tên global UMD có thể gặp tùy cách runtime Zalo nạp listSyncJS.
 * Chuẩn hiện tại (zmp-sdk >= 2.x): globalThis["zmp-sdk"].
 * Thêm fallback phòng khi bundle/tên khác — tránh "Chưa có Zalo SDK" giả.
 */
const SDK_GLOBAL_CANDIDATES = [
  "zmp-sdk",
  "zmp",
  "ZMPSDK",
  "zmpSdk",
  "ZaloMiniApp",
] as const;

function looksLikeZmp(v: unknown): v is ZmpApis {
  return (
    typeof v === "object" &&
    v !== null &&
    typeof (v as ZmpApis).getAccessToken === "function"
  );
}

/** Trả API + tên global đã tìm thấy (null nếu không có SDK). */
function findZmpApis(): { api: ZmpApis; globalName: string } | null {
  const g = globalThis as unknown as Record<string, unknown>;
  for (const name of SDK_GLOBAL_CANDIDATES) {
    const candidate = g[name];
    if (looksLikeZmp(candidate)) {
      return { api: candidate, globalName: name };
    }
  }
  return null;
}

function getZmpApis(): ZmpApis {
  const found = findZmpApis();
  if (!found) {
    throw new Error(
      "Chưa có Zalo SDK. Mở Mini App trong Zalo (không dùng trình duyệt thường).",
    );
  }
  return found.api;
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
  if (!res || typeof res !== "object") {
    return typeof res === "string" && res.trim().length > 4 ? res.trim() : undefined;
  }
  const o = res as Record<string, unknown>;
  const token = o.token ?? o.code;
  if (typeof token === "string" && token.trim().length > 4) return token.trim();
  return undefined;
}

/** getAccessToken đôi khi trả string, đôi khi { token } / { accessToken }. */
function extractAccessToken(res: unknown): string | undefined {
  if (typeof res === "string" && res.trim().length > 8) return res.trim();
  if (!res || typeof res !== "object") return undefined;
  const o = res as Record<string, unknown>;
  for (const key of ["token", "accessToken", "access_token"]) {
    const v = o[key];
    if (typeof v === "string" && v.trim().length > 8) return v.trim();
  }
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

    const accessRaw = await callZmp<unknown>(
      getAccessToken,
      {},
      TOKEN_MS,
      "Lấy phiên Zalo",
    );
    const accessToken = extractAccessToken(accessRaw);
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

    // Môi giới: bắt buộc token SĐT từ Zalo (không chấp nhận nhập tay).
    if (preferredRole === "BROKER" && !phoneToken && !AUTH_DEV_BYPASS) {
      onPhase?.("need_phone");
      throw new Error(
        "Môi giới phải cho phép chia sẻ số điện thoại đang dùng Zalo. Nhấn Cho phép trên popup Zalo rồi thử lại.",
      );
    }

    onPhase?.("server");
    // Ưu tiên SĐT Zalo (đã xác minh). Chỉ dùng số nhập tay khi Zalo không trả phoneToken.
    const user = await loginWithZaloAccessToken({
      accessToken,
      ...(phoneToken ? { phoneToken } : {}),
      ...(!phoneToken && phoneFallback ? { phone: phoneFallback } : {}),
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

/**
 * Hoàn tất khi Zalo đã kết nối nhưng chưa chia sẻ SĐT.
 * Chỉ dùng cho khách (CUSTOMER) — số nhập tay = SĐT liên hệ.
 * Môi giới không đi nhánh này.
 */
export async function completeZaloLoginWithPhone(
  prep: PendingZaloSession,
  phone: string,
  onPhase?: (phase: ZaloLoginPhase) => void,
): Promise<HouseXUser> {
  if (prep.preferredRole === "BROKER" && !AUTH_DEV_BYPASS) {
    throw new Error(
      "Môi giới cần cho phép chia sẻ SĐT Zalo — không dùng số nhập tay.",
    );
  }
  const trimmed = phone.trim();
  onPhase?.("server");
  const user = await loginWithZaloAccessToken({
    accessToken: prep.accessToken,
    // Ưu tiên token Zalo nếu đã có; không thì SĐT liên hệ nhập tay.
    ...(prep.phoneToken ? { phoneToken: prep.phoneToken } : { phone: trimmed }),
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

/* ------------------------------------------------------------------ *
 * Chẩn đoán trên máy (Zalo WebView không có DevTools).
 * Mục tiêu: chỉ ra CHÍNH XÁC bước hỏng — SDK global / accessToken /
 * số điện thoại / máy chủ — thay vì đoán mò rồi sửa mù.
 * ------------------------------------------------------------------ */

export type DiagStatus = "ok" | "warn" | "fail";

export type DiagLine = {
  key: string;
  label: string;
  status: DiagStatus;
  detail: string;
};

/** Soi các global UMD khả dĩ — xác nhận SDK có được nạp không. */
export function inspectZaloSdkGlobals(): {
  found: boolean;
  globalName: string | null;
  keyCount: number;
  hasGetAccessToken: boolean;
  hasGetPhoneNumber: boolean;
  hasAuthorize: boolean;
  presentGlobals: string[];
} {
  const g = globalThis as unknown as Record<string, unknown>;
  const presentGlobals = SDK_GLOBAL_CANDIDATES.filter(
    (n) => g[n] != null && typeof g[n] === "object",
  );
  const found = findZmpApis();
  const api = found?.api as Record<string, unknown> | undefined;
  return {
    found: Boolean(found),
    globalName: found?.globalName ?? null,
    keyCount: api ? Object.keys(api).length : 0,
    hasGetAccessToken: typeof api?.getAccessToken === "function",
    hasGetPhoneNumber: typeof api?.getPhoneNumber === "function",
    hasAuthorize: typeof api?.authorize === "function",
    presentGlobals,
  };
}

function short(value: string, max = 96): string {
  const s = value.replace(/\s+/g, " ").trim();
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

/**
 * Chạy toàn bộ chuỗi kiểm tra và trả về báo cáo hiển thị ngay trên UI.
 * Không ném lỗi — mọi bước đều được nuốt và ghi lại trạng thái.
 */
export async function runZaloDiagnostics(): Promise<DiagLine[]> {
  const lines: DiagLine[] = [];

  // 1) API base — localhost trong Zalo = chắc chắn hỏng.
  let apiHost = HOUSEX_API_BASE;
  try {
    apiHost = new URL(HOUSEX_API_BASE).host;
  } catch {
    /* keep raw */
  }
  const badApi = /localhost|127\.0\.0\.1/i.test(apiHost);
  lines.push({
    key: "api-base",
    label: "Máy chủ API",
    status: badApi ? "fail" : "ok",
    detail: badApi
      ? `${apiHost} — bản build sai (Zalo không gọi được localhost). Build lại với VITE_HOUSEX_API_BASE=https://timnhaxahoi.com`
      : apiHost,
  });

  // 2) SDK global — nguyên nhân số 1 khiến nút Zalo "không làm gì".
  const sdk = inspectZaloSdkGlobals();
  lines.push({
    key: "sdk-global",
    label: "Zalo SDK (global UMD)",
    status: sdk.found ? "ok" : "fail",
    detail: sdk.found
      ? `Tìm thấy global "${sdk.globalName}" · ${sdk.keyCount} API · getAccessToken=${sdk.hasGetAccessToken} getPhoneNumber=${sdk.hasGetPhoneNumber}`
      : `Không thấy SDK. Global object hiện có: [${sdk.presentGlobals.join(", ") || "none"}]. ` +
        `Kiểm tra listSyncJS trong app-config.json có assets/zmp-sdk.umd.js và mở app TỪ TRONG Zalo.`,
  });

  // 3) getAccessToken — token thật để máy chủ verify /v2.0/me.
  if (sdk.found) {
    try {
      const api = getZmpApis();
      const raw = await callZmp<unknown>(
        api.getAccessToken,
        {},
        TOKEN_MS,
        "getAccessToken",
      );
      const token = extractAccessToken(raw);
      lines.push({
        key: "access-token",
        label: "getAccessToken",
        status: token ? "ok" : "fail",
        detail: token
          ? `OK · độ dài ${token.length}`
          : `SDK trả về nhưng không có token hợp lệ: ${short(JSON.stringify(raw))}`,
      });
    } catch (err) {
      lines.push({
        key: "access-token",
        label: "getAccessToken",
        status: "fail",
        detail: short(err instanceof Error ? err.message : String(err)),
      });
    }

    // 4) getPhoneNumber — tùy chọn; lỗi -201/-202 = user/app chưa cấp quyền SĐT.
    try {
      const api = getZmpApis();
      const raw = await callZmp<{ token?: string }>(
        api.getPhoneNumber,
        {},
        PHONE_MS,
        "getPhoneNumber",
      );
      const phoneToken = extractPhoneToken(raw);
      lines.push({
        key: "phone-token",
        label: "getPhoneNumber",
        status: phoneToken ? "ok" : "warn",
        detail: phoneToken
          ? "OK · có token SĐT (máy chủ cần ZALO_APP_SECRET để đổi ra số)"
          : "Không có token SĐT — dùng nhập tay. Nếu cần tự động: bật quyền SĐT cho Mini App + user đồng ý.",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      lines.push({
        key: "phone-token",
        label: "getPhoneNumber",
        status: "warn",
        detail: `${short(msg)} — vẫn đăng nhập được bằng SĐT nhập tay.`,
      });
    }
  }

  // 5) Máy chủ auth — AUTH_SECRET / DB / bypass.
  try {
    const d = await fetchServerAuthDiag();
    const problems: string[] = [];
    if (!d.hasAuthSecret) problems.push("thiếu AUTH_SECRET (không tạo được phiên)");
    if (!d.dbOk) problems.push(`DB lỗi: ${short(d.dbError ?? "", 40)}`);
    if (d.bypass && d.nodeEnv === "production")
      problems.push("ZALO_AUTH_DEV_BYPASS=true trên production");
    lines.push({
      key: "server",
      label: "Máy chủ auth (/api/auth/zalo/diag)",
      status: problems.length ? "fail" : "ok",
      detail: problems.length
        ? problems.join(" · ")
        : `OK · env=${d.nodeEnv} · AppSecret=${d.hasZaloAppSecret} · DB ok`,
    });
  } catch (err) {
    lines.push({
      key: "server",
      label: "Máy chủ auth (/api/auth/zalo/diag)",
      status: "fail",
      detail: short(err instanceof Error ? err.message : String(err)),
    });
  }

  return lines;
}
