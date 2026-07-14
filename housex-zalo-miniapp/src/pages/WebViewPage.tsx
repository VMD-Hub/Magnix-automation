import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  accountHandoffConsumeUrl,
  sanitizeHandoffNext,
  sanitizeWebPath,
  webAbsoluteUrl,
} from "@/services/webview";

/**
 * Nhúng trang House X (công cụ, tin tức, hồ sơ web SoR) trong khung Mini App.
 * Handoff: /mo?handoff=1&code=…&next=/khach-hang/tai-khoan
 */
export function WebViewPage() {
  const [params] = useSearchParams();
  const path = params.get("p") ?? "/tin-tuc";
  const isHandoff = params.get("handoff") === "1";
  const handoffCode = params.get("code")?.trim() ?? "";
  const handoffNext = sanitizeHandoffNext(params.get("next"));

  const safePath = useMemo(() => sanitizeWebPath(path), [path]);

  const src = useMemo(() => {
    if (isHandoff && handoffCode) {
      return accountHandoffConsumeUrl(handoffCode, handoffNext);
    }
    return webAbsoluteUrl(safePath);
  }, [isHandoff, handoffCode, handoffNext, safePath]);

  const back = isHandoff
    ? "/tai-khoan"
    : safePath.startsWith("/cong-cu")
      ? "/cong-cu"
      : "/";

  const backLabel = isHandoff ? "← Tài khoản" : "← Quay lại";

  return (
    <div className="tool-viewer">
      <div className="tool-viewer-bar">
        <Link to={back} className="muted">
          {backLabel}
        </Link>
        <a className="muted" href={src} target="_blank" rel="noreferrer">
          Mở rộng
        </a>
      </div>
      <iframe
        title="House X"
        className="tool-viewer-frame"
        src={src}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
