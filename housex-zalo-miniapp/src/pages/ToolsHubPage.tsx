import { Link } from "react-router-dom";
import { NOXH_TOOLS } from "@/services/tools";

export function ToolsHubPage() {
  return (
    <div>
      <Link to="/" className="muted">
        ← Trang chủ
      </Link>
      <h1 className="brand" style={{ fontSize: 22 }}>
        Công cụ NOXH
      </h1>
      <p className="lead">
        Chọn công cụ bên dưới. Nội dung đồng bộ House X.
      </p>

      {NOXH_TOOLS.map((t) => (
        <Link
          key={t.id}
          to={`/cong-cu/mo?p=${encodeURIComponent(t.path)}`}
          className="card tool-card"
        >
          <h2>{t.title}</h2>
          <p>{t.desc}</p>
          <span className="tool-card-cta">Mở công cụ →</span>
        </Link>
      ))}
    </div>
  );
}
