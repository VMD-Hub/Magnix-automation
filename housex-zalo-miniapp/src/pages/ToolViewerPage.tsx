import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toolAbsoluteUrl } from "@/services/tools";

/**
 * Nhúng công cụ House X (Next.js) trong khung Mini App.
 * Local: cần API/dev server ở VITE_HOUSEX_API_BASE (vd. :3000).
 */
export function ToolViewerPage() {
  const [params] = useSearchParams();
  const path = params.get("p") ?? "/cong-cu/dieu-kien-noxh";

  const safePath = useMemo(() => {
    if (!path.startsWith("/cong-cu/")) return "/cong-cu/dieu-kien-noxh";
    if (path.includes("://") || path.includes("..")) {
      return "/cong-cu/dieu-kien-noxh";
    }
    return path;
  }, [path]);

  const src = toolAbsoluteUrl(safePath);

  return (
    <div className="tool-viewer">
      <div className="tool-viewer-bar">
        <Link to="/cong-cu" className="muted">
          ← Công cụ
        </Link>
        <a className="muted" href={src} target="_blank" rel="noreferrer">
          Mở rộng
        </a>
      </div>
      <iframe
        title="Công cụ House X"
        className="tool-viewer-frame"
        src={src}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
