import { useNavigate } from "react-router-dom";
import type { HomeArticleItem } from "@/data/home-ia";
import { mediaUrl } from "@/utils/media";

/** Tin / chính sách — ảnh + tiêu đề bài (không lẫn tiện ích / promo). */
export function HomeNewsSection({ items }: { items: HomeArticleItem[] }) {
  const navigate = useNavigate();

  return (
    <section className="home-block" aria-labelledby="news-title">
      <div className="section-head">
        <h2 id="news-title" className="section-title">
          Tin tức & chính sách
        </h2>
      </div>
      <p className="muted section-lead">
        Nghị định, điều kiện mua nhà, tín dụng và quy trình — cập nhật để bạn nắm rõ.
      </p>
      <div className="news-list">
        {items.map((a) => {
          const img = mediaUrl(a.imageUrl);
          return (
            <button
              key={a.id}
              type="button"
              className="news-card"
              onClick={() =>
                navigate(`/mo?p=${encodeURIComponent(a.path)}`)
              }
            >
              <div
                className="news-card-media"
                style={
                  img
                    ? { backgroundImage: `url(${img})` }
                    : { background: "var(--hx-ruby-gradient)" }
                }
              />
              <div className="news-card-body">
                <h3>{a.title}</h3>
                <p>{a.dek}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
