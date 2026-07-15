/**
 * Mở trang House X từ Mini App.
 * Ưu tiên Zalo openWebview (ổn định hơn iframe + HashRouter).
 * Không bao giờ âm thầm đẩy sang /tin-tuc.
 */
import type { NavigateFunction } from "react-router-dom";
import { HOUSEX_API_BASE } from "@/config";
import { moEmbedHref } from "@/services/mo-embed";
import { sanitizeWebPath } from "@/services/webview";

type ZmpOpenWebview = {
  openWebview?: (args?: Record<string, unknown>) => Promise<unknown> | void;
};

function findZmp(): ZmpOpenWebview | null {
  const g = globalThis as Record<string, unknown>;
  for (const name of ["zmp-sdk", "zmp", "zmpsdk", "zmpSdk"]) {
    const v = g[name];
    if (v && typeof v === "object" && typeof (v as ZmpOpenWebview).openWebview === "function") {
      return v as ZmpOpenWebview;
    }
  }
  return null;
}

function callOpenWebview(url: string): Promise<void> {
  const api = findZmp();
  if (!api?.openWebview) {
    return Promise.reject(new Error("NO_OPEN_WEBVIEW"));
  }
  return new Promise((resolve, reject) => {
    let settled = false;
    const done = (run: () => void) => {
      if (settled) return;
      settled = true;
      run();
    };
    try {
      const ret = api.openWebview!({
        url,
        config: { style: "normal", leftButton: "back" },
        success: () => done(() => resolve()),
        fail: (err: unknown) =>
          done(() =>
            reject(err instanceof Error ? err : new Error(String(err ?? "fail"))),
          ),
      });
      if (ret != null && typeof (ret as Promise<unknown>).then === "function") {
        (ret as Promise<unknown>).then(
          () => done(() => resolve()),
          (e) => done(() => reject(e instanceof Error ? e : new Error(String(e)))),
        );
      }
    } catch (e) {
      done(() => reject(e instanceof Error ? e : new Error(String(e))));
    }
  });
}

/**
 * @returns path đã sanitize hoặc null nếu không được phép
 */
export function resolveHouseXPath(webPath: string): string | null {
  return sanitizeWebPath(webPath);
}

export async function openHouseXWeb(
  webPath: string,
  navigate: NavigateFunction,
): Promise<void> {
  const path = resolveHouseXPath(webPath);
  if (!path) {
    console.warn("[HouseX] blocked web path", webPath);
    window.alert(
      `Không mở được trang này trong Mini App:\n${webPath}\n\nThử lại sau khi cập nhật bản mới, hoặc mở trên timnhaxahoi.com.`,
    );
    return;
  }

  const url = `${HOUSEX_API_BASE}${withEmbed(path)}`;

  try {
    await callOpenWebview(url);
    return;
  } catch {
    /* fallback iframe route */
  }

  navigate(moEmbedHref(path));
}

function withEmbed(path: string): string {
  if (path.includes("hx_embed=")) return path;
  return `${path}${path.includes("?") ? "&" : "?"}hx_embed=miniapp`;
}
