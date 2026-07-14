import { useNavigate } from "react-router-dom";
import { ShortcutGlyph } from "@/components/AppIcons";
import type { HomeServiceItem } from "@/data/home-ia";

export function HomeServicesSection({ items }: { items: HomeServiceItem[] }) {
  const navigate = useNavigate();

  return (
    <section className="home-block" aria-labelledby="services-title">
      <div className="section-head">
        <h2 id="services-title" className="section-title">
          Dịch vụ
        </h2>
      </div>
      <p className="muted section-lead">
        Đồng hành từ vay vốn, định giá đến hoàn thiện và ký gửi sản phẩm.
      </p>
      <div className="service-list">
        {items.map((s) => (
          <button
            key={s.id}
            type="button"
            className="service-row"
            onClick={() =>
              navigate(`/mo?p=${encodeURIComponent(s.path)}`)
            }
          >
            <span className="service-icon">
              <ShortcutGlyph id={s.id} size={20} />
            </span>
            <span className="service-copy">
              <strong>{s.title}</strong>
              <span>{s.desc}</span>
            </span>
            <span className="insight-arrow" aria-hidden>
              →
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
