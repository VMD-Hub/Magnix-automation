/**
 * Mở trang House X từ Mini App — giữ cảm giác app.
 * Luôn nhúng trong shell Mini App (`#/mo/...` + tab bar), không nhảy Zalo openWebview
 * (webview full-page làm đứt kỳ vọng “đang dùng app”).
 * Không bao giờ âm thầm đẩy sang /tin-tuc.
 */
import type { NavigateFunction } from "react-router-dom";
import { moEmbedHref } from "@/services/mo-embed";
import { sanitizeWebPath } from "@/services/webview";

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

  navigate(moEmbedHref(path));
}
