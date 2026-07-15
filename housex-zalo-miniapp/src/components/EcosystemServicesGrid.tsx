import { useNavigate } from "react-router-dom";
import { ShortcutGlyph } from "@/components/AppIcons";
import type { HomeServiceItem } from "@/data/home-ia";
import { openHouseXWeb } from "@/services/open-housex-web";

type Props = {
  items: HomeServiceItem[];
  lead?: string;
  title?: string;
  titleId?: string;
};

/** Lưới icon dịch vụ — nhúng #/mo/... trong shell Mini App (giữ cảm giác app). */
export function EcosystemServicesGrid({
  items,
  lead = "Chọn dịch vụ bạn cần hỗ trợ — xem điều kiện, quy trình và gửi yêu cầu tư vấn.",
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
        <span className="muted" style={{ fontSize: 11 }}>
          bản dịch vụ 15g
        </span>
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
            onClick={() => {
              void openHouseXWeb(s.path, navigate);
            }}
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
