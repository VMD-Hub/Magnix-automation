import { Link } from "react-router-dom";
import { NOXH_TOOLS } from "@/services/tools";

const TOOL_ORDER = ["dieu-kien", "vay-60s", "tham-dinh"] as const;

export function ToolsHubPage() {
  const tools = TOOL_ORDER.map(
    (id) => NOXH_TOOLS.find((t) => t.id === id)!,
  ).filter(Boolean);

  return (
    <div>
      <Link to="/" className="muted">
        ← Trang chủ
      </Link>
      <h1 className="brand" style={{ fontSize: 22 }}>
        Kiểm tra NOXH
      </h1>
      <p className="lead">
        Lộ trình 3 bước — tự đánh giá trước khi nhờ tư vấn. Kết quả mang tính
        tham khảo.
      </p>

      {tools.map((t, idx) => (
        <Link
          key={t.id}
          to={`/cong-cu/mo?p=${encodeURIComponent(t.path)}`}
          className="card tool-card"
        >
          <p className="muted" style={{ margin: "0 0 4px" }}>
            Bước {idx + 1}
          </p>
          <h2>{t.title}</h2>
          <p>{t.desc}</p>
          <span className="tool-card-cta">Mở công cụ →</span>
        </Link>
      ))}
    </div>
  );
}
