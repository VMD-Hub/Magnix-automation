import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HomeBrandHeader } from "@/components/HomeBrandHeader";
import { HomeBannerCarousel } from "@/components/HomeBannerCarousel";
import { PromoTeaser } from "@/components/PromoTeaser";
import { HomeInsightsSection } from "@/components/HomeInsightsSection";
import { ProjectGridCard } from "@/components/ProjectGridCard";
import { ShortcutGrid } from "@/components/ShortcutGrid";
import {
  HOME_BANNERS,
  HOME_INSIGHTS,
  HOME_SHORTCUTS,
} from "@/data/home-content";
import { listProjects, type ProjectCard } from "@/services/projects";

export function HomePage() {
  const [items, setItems] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await listProjects({
          projectType: "NHA_O_XA_HOI",
          status: "DANG_BAN",
          pageSize: 20,
        });
        let list = data.items;
        if (list.length === 0) {
          const fallback = await listProjects({ pageSize: 20 });
          list = fallback.items;
        }
        if (alive) setItems(list);
      } catch (e) {
        if (alive) {
          setErr(e instanceof Error ? e.message : "Không tải được dự án");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="home-page">
      <HomeBrandHeader />

      <HomeBannerCarousel banners={HOME_BANNERS} />
      <PromoTeaser />
      <ShortcutGrid items={HOME_SHORTCUTS} />

      <section id="projects" className="home-projects" aria-labelledby="projects-title">
        <div className="section-head">
          <h2 id="projects-title" className="section-title">
            Dự án nổi bật
          </h2>
          <Link to="/tu-van" className="muted">
            Tư vấn ngay
          </Link>
        </div>
        <p className="muted" style={{ margin: "0 0 12px" }}>
          Sản phẩm trung tâm — chọn dự án để xem landing đầy đủ.
        </p>

        {loading ? <p className="muted">Đang tải dự án…</p> : null}
        {err ? <p className="err">{err}</p> : null}
        {!loading && !err && items.length === 0 ? (
          <div className="card">
            <p>Chưa có dự án. Vui lòng thử lại sau.</p>
          </div>
        ) : null}

        <div className="project-grid">
          {items.map((p) => (
            <ProjectGridCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      <HomeInsightsSection items={HOME_INSIGHTS} />

      <p className="home-foot muted">
        House X · timnhaxahoi.com · Kết quả công cụ mang tính tham khảo.
      </p>
    </div>
  );
}
