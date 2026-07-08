import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { sanitizeWebPath, webAbsoluteUrl } from "@/services/webview";

/**
 * Nhúng trang House X (công cụ, tin tức, pháp lý) trong khung Mini App.
 */
export function WebViewPage() {
  const [params] = useSearchParams();
  const path = params.get("p") ?? "/tin-tuc";

  const safePath = useMemo(() => sanitizeWebPath(path), [path]);
  const src = webAbsoluteUrl(safePath);

  const back =
    safePath.startsWith("/cong-cu") ? "/cong-cu" : "/";

  return (
    <div className="tool-viewer">
      <div className="tool-viewer-bar">
        <Link to={back} className="muted">
          ← Quay lại
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
