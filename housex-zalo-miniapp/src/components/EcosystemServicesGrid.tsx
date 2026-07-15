import { useNavigate } from "react-router-dom";
import { ShortcutGlyph } from "@/components/AppIcons";
import type { HomeServiceItem } from "@/data/home-ia";
import { moEmbedHref } from "@/services/mo-embed";

type Props = {
  items: HomeServiceItem[];
  lead?: string;
  title?: string;
  titleId?: string;
};

/** Lưới icon dịch vụ — hệ sinh thái thu nhập & uy tín House X. */
export function EcosystemServicesGrid({
  items,
  lead = "Vay · bảo hiểm · định giá · nội thất — đồng hành trọn hành trình, tạo niềm tin với khách.",
  title = "Dịch vụ",
  titleId = "services-title",
}: Props) {
  const navigate = useNavigate();

  return (
    <section className="home-block" aria-labelledby={titleId}>
      <div className="section-head">
        <h2 id={titleId} className="section-title">
          {title}
        </h2>
      </div>
      <p className="muted section-lead">{lead}</p>
      <div className="shortcut-grid" role="list">
        {items.map((s) => (
          <button
            key={s.id}
            type="button"
            className="shortcut-item"
            role="listitem"
            title={s.title}
            aria-label={`${s.label}: ${s.desc}`}
            onClick={() => navigate(moEmbedHref(s.path))}
          >
            <span className="shortcut-icon">
              <ShortcutGlyph id={s.id} size={28} />
            </span>
            <span className="shortcut-label">{s.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
