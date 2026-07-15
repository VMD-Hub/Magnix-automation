import { Link } from "react-router-dom";
import { PageBrandHeader } from "@/components/PageBrandHeader";
import { ShortcutGlyph } from "@/components/AppIcons";
import { HOME_TOOLS_CORE } from "@/data/home-ia";
import { moEmbedHref } from "@/services/mo-embed";

export function ToolsHubPage() {
  return (
    <div>
      <PageBrandHeader
        kicker="CÔNG CỤ"
        title="Bộ công cụ House X"
        lead="Tự đánh giá trước khi nhờ tư vấn — mở trong Mini App, không nhảy trình duyệt ngoài."
        backTo="/"
      />

      <div className="tool-hub-list">
        {HOME_TOOLS_CORE.map((t) => (
          <Link key={t.id} to={moEmbedHref(t.path)} className="card tool-card">
            <span className="tool-hub-icon">
              <ShortcutGlyph id={t.id} size={20} />
            </span>
            <h2>{t.title}</h2>
            <span className="tool-card-cta">Mở công cụ →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
