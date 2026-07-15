import { useNavigate } from "react-router-dom";
import { PageBrandHeader } from "@/components/PageBrandHeader";
import { ShortcutGlyph } from "@/components/AppIcons";
import { HOME_TOOLS_CORE } from "@/data/home-ia";
import { openHouseXWeb } from "@/services/open-housex-web";

export function ToolsHubPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageBrandHeader
        kicker="CÔNG CỤ"
        title="Bộ công cụ House X"
        lead="Tự đánh giá trước khi nhờ tư vấn — mở trong Mini App."
        backTo="/"
      />

      <div className="tool-hub-list">
        {HOME_TOOLS_CORE.map((t) => (
          <button
            key={t.id}
            type="button"
            className="card tool-card"
            style={{
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onClick={() => {
              void openHouseXWeb(t.path, navigate);
            }}
          >
            <span className="tool-hub-icon">
              <ShortcutGlyph id={t.id} size={20} />
            </span>
            <h2>{t.title}</h2>
            <span className="tool-card-cta">Mở công cụ →</span>
          </button>
        ))}
      </div>
    </div>
  );
}
