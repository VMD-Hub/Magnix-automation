import { useEffect, useMemo } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useHomeTabPath } from "@/components/LaneSwitcher";
import { HOUSEX_API_BASE } from "@/config";
import {
  isHxEmbedNavigateMessage,
  isTrustedHouseXOrigin,
  sanitizeMiniNavigatePath,
} from "@/services/embed-bridge";
import {
  sanitizeWebPath,
  webAbsoluteUrl,
} from "@/services/webview";
import { webPathFromMoLocation } from "@/services/mo-embed";

function isServiceWebPath(path: string | null): boolean {
  if (!path) return false;
  return (
    path.startsWith("/tai-chinh") ||
    path.startsWith("/dinh-gia") ||
    path.startsWith("/noi-that") ||
    path.startsWith("/dich-vu") ||
    path.startsWith("/dang-ky")
  );
}

/** Nhãn người dùng — không hiện path kỹ thuật kiểu /dinh-gia. */
function viewerTitle(path: string | null): string {
  if (!path) return "House X";
  if (path.startsWith("/dinh-gia")) return "Định giá";
  if (path.includes("vay-mua-nha")) return "Vay mua nhà";
  if (path.includes("vay-the-chap")) return "Vay thế chấp";
  if (path.includes("vay-sxkd")) return "Vay SXKD";
  if (path.includes("bao-hiem")) return "Bảo hiểm";
  if (path.startsWith("/tai-chinh")) return "Tài chính";
  if (path.startsWith("/noi-that")) return "Nội thất";
  if (path.startsWith("/dich-vu")) return "Dịch vụ";
  if (path.startsWith("/dang-ky")) return "Đăng ký";
  if (path.startsWith("/cong-cu")) return "Công cụ";
  if (path.startsWith("/tin-tuc")) return "Tin tức";
  if (path.startsWith("/khuyen-mai")) return "Ưu đãi";
  return "House X";
}

/**
 * Nhúng trang House X trong khung Mini App.
 * Path: /mo/tai-chinh/... — handoff hồ sơ dùng openWebview (không iframe).
 */
export function WebViewPage() {
  const navigate = useNavigate();
  const homePath = useHomeTabPath();
  const { pathname } = useLocation();
  const { "*": splat } = useParams();
  const [params] = useSearchParams();
  const isHandoff = params.get("handoff") === "1";

  const requested = useMemo(
    () => webPathFromMoLocation(pathname, params.get("p"), splat),
    [pathname, params, splat],
  );

  const safePath = useMemo(
    () => (requested ? sanitizeWebPath(requested) : null),
    [requested],
  );

  const src = useMemo(() => {
    if (!safePath) return null;
    return webAbsoluteUrl(safePath);
  }, [safePath]);

  const back = safePath?.startsWith("/cong-cu")
    ? "/cong-cu"
    : isServiceWebPath(safePath)
      ? "/dich-vu"
      : homePath;

  const backLabel = "← Quay lại";
  const title = viewerTitle(safePath);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!isTrustedHouseXOrigin(e.origin, HOUSEX_API_BASE)) return;
      if (!isHxEmbedNavigateMessage(e.data)) return;
      const path = sanitizeMiniNavigatePath(e.data.path);
      if (!path) return;
      navigate(path === "/" ? homePath : path);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [navigate, homePath]);

  if (isHandoff) {
    return (
      <div className="tool-viewer">
        <div className="tool-viewer-bar">
          <Link to="/tai-khoan" className="tool-viewer-back">
            ← Tài khoản
          </Link>
          <span className="tool-viewer-title">Hồ sơ web</span>
          <span className="tool-viewer-bar-spacer" aria-hidden />
        </div>
        <div className="tool-viewer-error">
          <h2>Mở hồ sơ ngoài khung nhúng</h2>
          <p className="muted">
            Phiên đăng nhập web không gắn được trong khung Mini App (cookie bị
            chặn). Quay lại Tài khoản và bấm «Mở hồ sơ … trên web» — Zalo sẽ mở
            cửa sổ riêng với phiên đúng.
          </p>
          <Link to="/tai-khoan" className="btn">
            Về Tài khoản
          </Link>
        </div>
      </div>
    );
  }

  if (!safePath || !src) {
    return (
      <div className="tool-viewer">
        <div className="tool-viewer-bar">
          <Link to={back} className="tool-viewer-back">
            {backLabel}
          </Link>
          <span className="tool-viewer-title">Không mở được</span>
          <span className="tool-viewer-bar-spacer" aria-hidden />
        </div>
        <div className="tool-viewer-error">
          <h2>Không mở được trang dịch vụ</h2>
          <p className="muted">
            Bản Mini App hoặc web chưa đồng bộ. Vuốt tắt Zalo, quét lại QR Testing
            sau khi VPS chạy deploy web + miniapp.
          </p>
          <Link to={homePath} className="btn">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-viewer">
      <div className="tool-viewer-bar">
        <Link to={back} className="tool-viewer-back">
          {backLabel}
        </Link>
        <span className="tool-viewer-title">{title}</span>
        <span className="tool-viewer-bar-spacer" aria-hidden />
      </div>
      {src ? (
        <iframe
          title={title}
          className="tool-viewer-frame"
          src={src}
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : null}
    </div>
  );
}
