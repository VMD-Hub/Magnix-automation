import { useNavigate } from "react-router-dom";
import type { HomeInsightLink } from "@/data/home-content";

export function HomeInsightsSection({ items }: { items: HomeInsightLink[] }) {
  const navigate = useNavigate();

  return (
    <section className="home-insights" aria-labelledby="insights-title">
      <h2 id="insights-title" className="section-title">
        Tin tức & pháp lý
      </h2>
      <p className="muted" style={{ margin: "0 0 12px" }}>
        Kiến thức nền — chứng minh House X là nền tảng BĐS, không chỉ thu lead.
      </p>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className="insight-row card"
          onClick={() =>
            navigate(`/mo?p=${encodeURIComponent(item.path)}`)
          }
        >
          <div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
          <span className="insight-arrow" aria-hidden>
            →
          </span>
        </button>
      ))}
    </section>
  );
}
