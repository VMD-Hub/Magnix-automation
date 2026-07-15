import { useMemo } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  accountHandoffConsumeUrl,
  sanitizeHandoffNext,
  sanitizeWebPath,
  webAbsoluteUrl,
} from "@/services/webview";
import { webPathFromMoLocation } from "@/services/mo-embed";

/**
 * Nhúng trang House X trong khung Mini App.
 * Path ưu tiên: /mo/tai-chinh/vay-mua-nha (ổn định trên Zalo HashRouter).
 * Legacy: /mo?p=… · Handoff: /mo?handoff=1&code=…&next=…
 */
export function WebViewPage() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const isHandoff = params.get("handoff") === "1";
  const handoffCode = params.get("code")?.trim() ?? "";
  const handoffNext = sanitizeHandoffNext(params.get("next"));

  const requested = useMemo(
    () => webPathFromMoLocation(pathname, params.get("p")),
    [pathname, params],
  );

  const safePath = useMemo(() => sanitizeWebPath(requested), [requested]);

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
        <span className="muted tool-viewer-path" title={src}>
          {isHandoff ? "Hồ sơ web" : safePath}
        </span>
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
