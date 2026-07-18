/**
 * Handoff Mini App Bearer → cookie web phải mở top-level (Zalo openWebview).
 * Không nhúng consume URL trong #/mo iframe — SameSite cookie bị chặn → «Vui lòng đăng nhập».
 */
import { accountHandoffConsumeUrl } from "@/services/webview";

type ZmpOpenWebview = {
  openWebview?: (args: Record<string, unknown>) => Promise<unknown> | void;
};

const SDK_NAMES = ["zmp-sdk", "zmp", "ZMPSDK", "zmpSdk"] as const;

function getZmp(): ZmpOpenWebview | null {
  const g = globalThis as unknown as Record<string, unknown>;
  for (const name of SDK_NAMES) {
    const v = g[name];
    if (v && typeof v === "object" && "openWebview" in v) {
      return v as ZmpOpenWebview;
    }
  }
  return null;
}

function openViaZmp(url: string): Promise<void> {
  const zmp = getZmp();
  if (!zmp?.openWebview) {
    return Promise.reject(new Error("NO_ZMP_OPEN_WEBVIEW"));
  }
  return new Promise((resolve, reject) => {
    let settled = false;
    const done = (fn: () => void) => {
      if (settled) return;
      settled = true;
      fn();
    };
    try {
      const ret = zmp.openWebview!({
        url,
        success: () => done(() => resolve()),
        fail: (err: unknown) => {
          const msg =
            err && typeof err === "object" && "message" in err
              ? String((err as { message: unknown }).message)
              : "Không mở được webview Zalo.";
          done(() => reject(new Error(msg)));
        },
      });
      if (ret && typeof (ret as Promise<unknown>).then === "function") {
        (ret as Promise<unknown>).then(
          () => done(() => resolve()),
          (e) =>
            done(() =>
              reject(e instanceof Error ? e : new Error(String(e))),
            ),
        );
      }
    } catch (e) {
      done(() =>
        reject(e instanceof Error ? e : new Error("openWebview thất bại")),
      );
    }
  });
}

/**
 * Mở consume handoff ở cửa sổ web Zalo (first-party với timnhaxahoi.com).
 */
export async function openAccountHandoffWeb(input: {
  code: string;
  nextPath: string;
}): Promise<void> {
  const url = accountHandoffConsumeUrl(input.code, input.nextPath);
  try {
    await openViaZmp(url);
    return;
  } catch {
    /* fallback below */
  }
  // Fallback: top-level navigate (thoát Mini App shell) — vẫn tốt hơn iframe.
  window.location.assign(url);
}
