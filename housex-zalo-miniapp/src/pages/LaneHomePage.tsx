import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CrossLaneTeaser } from "@/components/CrossLaneTeaser";
import { HomeBannerCarousel } from "@/components/HomeBannerCarousel";
import { HomeBrandHeader } from "@/components/HomeBrandHeader";
import { HomeInsightsSection } from "@/components/HomeInsightsSection";
import { PromoTeaser } from "@/components/PromoTeaser";
import { ProjectGridCard } from "@/components/ProjectGridCard";
import { ShortcutGrid } from "@/components/ShortcutGrid";
import {
  featuredSlugsForLane,
  sortProjectsFeaturedFirst,
} from "@/data/home-featured-projects";
import { laneHomeCopy } from "@/data/home-lane-content";
import {
  getProject,
  listProjects,
  mapProjectCard,
  type ProjectCard,
} from "@/services/projects";
import { projectTypeForLane, setPreferredLane, type UserLane } from "@/services/lane";

type Props = {
  lane: UserLane;
};

export function LaneHomePage({ lane }: Props) {
  const copy = laneHomeCopy(lane);
  const [items, setItems] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setPreferredLane(lane);
  }, [lane]);

  useEffect(() => {
    let alive = true;
    const featured = featuredSlugsForLane(lane);

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await listProjects({
          projectType: projectTypeForLane(lane),
          status: "DANG_BAN",
          pageSize: 40,
        });
        const bySlug = new Map(data.items.map((p) => [p.slug, p]));

        for (const slug of featured) {
          if (bySlug.has(slug)) continue;
          try {
            const detail = await getProject(slug);
            bySlug.set(slug, mapProjectCard(detail));
          } catch {
            /* chưa seed trên API */
          }
        }

        const list = sortProjectsFeaturedFirst([...bySlug.values()], featured);
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
  }, [lane]);

  return (
    <div className={`home-page home-page--${lane}`}>
      <HomeBrandHeader lane={lane} kicker={copy.kicker} />

      <HomeBannerCarousel banners={copy.banners} />
      {copy.showPromo ? <PromoTeaser /> : null}
      <ShortcutGrid items={copy.shortcuts} />

      <section id="projects" className="home-projects" aria-labelledby="projects-title">
        <div className="section-head">
          <h2 id="projects-title" className="section-title">
            {copy.projectsTitle}
          </h2>
          <Link to="/tu-van" className="muted">
            Tư vấn ngay
          </Link>
        </div>
        <p className="muted" style={{ margin: "0 0 12px" }}>
          {copy.projectsLead}
        </p>

        {loading ? <p className="muted">Đang tải dự án…</p> : null}
        {err ? <p className="err">{err}</p> : null}
        {!loading && !err && items.length === 0 ? (
          <div className="card">
            <p>Chưa có dự án trong phân khúc này. Thử lại sau hoặc đổi mục tiêu ở header.</p>
          </div>
        ) : null}

        <div className="project-grid">
          {items.map((p) => (
            <ProjectGridCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      <CrossLaneTeaser currentLane={lane} />
      <HomeInsightsSection items={copy.insights} />

      <p className="home-foot muted">
        House X · timnhaxahoi.com · Kết quả công cụ mang tính tham khảo.
      </p>
    </div>
  );
}
