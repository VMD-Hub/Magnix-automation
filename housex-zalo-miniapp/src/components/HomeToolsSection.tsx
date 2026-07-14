import { Link, useNavigate } from "react-router-dom";
import { ShortcutGlyph } from "@/components/AppIcons";
import type { HomeToolItem } from "@/data/home-ia";

export function HomeToolsSection({ items }: { items: HomeToolItem[] }) {
  const navigate = useNavigate();

  return (
    <section className="home-block" aria-labelledby="tools-title">
      <div className="section-head">
        <h2 id="tools-title" className="section-title">
          Công cụ
        </h2>
        <Link to="/cong-cu" className="muted">
          Tất cả →
        </Link>
      </div>
      <p className="muted section-lead">
        Tự kiểm tra trước khi quyết định — miễn phí, kết quả tức thì.
      </p>
      <div className="tool-chip-grid">
        {items.map((t) => (
          <button
            key={t.id}
            type="button"
            className="tool-chip"
            onClick={() =>
              navigate(`/mo?p=${encodeURIComponent(t.path)}`)
            }
          >
            <span className="tool-chip-icon">
              <ShortcutGlyph id={t.id} size={18} />
            </span>
            <span className="tool-chip-label">{t.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
