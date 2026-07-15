import { useMemo } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import {
  accountHandoffConsumeUrl,
  sanitizeHandoffNext,
  sanitizeWebPath,
  webAbsoluteUrl,
} from "@/services/webview";
import { webPathFromMoLocation } from "@/services/mo-embed";

/**
 * Nhúng trang House X trong khung Mini App.
 * Path: /mo/tai-chinh/vay-mua-nha (splat) · legacy ?p= · handoff ?handoff=1
 * Không fallback âm thầm sang /tin-tuc.
 */
export function WebViewPage() {
  const { pathname } = useLocation();
  const { "*": splat } = useParams();
  const [params] = useSearchParams();
  const isHandoff = params.get("handoff") === "1";
  const handoffCode = params.get("code")?.trim() ?? "";
  const handoffNext = sanitizeHandoffNext(params.get("next"));

  const requested = useMemo(
    () => webPathFromMoLocation(pathname, params.get("p"), splat),
    [pathname, params, splat],
  );

  const safePath = useMemo(
    () => (requested ? sanitizeWebPath(requested) : null),
    [requested],
  );

  const src = useMemo(() => {
    if (isHandoff && handoffCode) {
      return accountHandoffConsumeUrl(handoffCode, handoffNext);
    }
    if (!safePath) return null;
    return webAbsoluteUrl(safePath);
  }, [isHandoff, handoffCode, handoffNext, safePath]);

  const back = isHandoff
    ? "/tai-khoan"
    : safePath?.startsWith("/cong-cu")
      ? "/cong-cu"
      : "/";

  const backLabel = isHandoff ? "← Tài khoản" : "← Quay lại";

  if (!isHandoff && (!safePath || !src)) {
    return (
      <div className="tool-viewer">
        <div className="tool-viewer-bar">
          <Link to={back} className="muted">
            {backLabel}
          </Link>
        </div>
        <div className="tool-viewer-error">
          <h2>Không mở được trang dịch vụ</h2>
          <p>
            Path: <code>{requested ?? "(trống)"}</code>
          </p>
          <p className="muted">
            Bản Mini App hoặc web chưa đồng bộ. Vuốt tắt Zalo, quét lại QR Testing
            sau khi VPS chạy deploy web + miniapp.
          </p>
          <Link to="/" className="btn">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-viewer">
      <div className="tool-viewer-bar">
        <Link to={back} className="muted">
          {backLabel}
        </Link>
        <span className="muted tool-viewer-path" title={src ?? undefined}>
          {isHandoff ? "Hồ sơ web" : safePath}
        </span>
        {src ? (
          <a className="muted" href={src} target="_blank" rel="noreferrer">
            Mở rộng
          </a>
        ) : null}
      </div>
      {src ? (
        <iframe
          title="House X"
          className="tool-viewer-frame"
          src={src}
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : null}
    </div>
  );
}
