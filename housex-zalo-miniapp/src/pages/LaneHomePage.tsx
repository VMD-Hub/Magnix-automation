import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppStateCard } from "@/components/AppStateCard";
import { CrossLaneTeaser } from "@/components/CrossLaneTeaser";
import { HomeBrandHeader } from "@/components/HomeBrandHeader";
import { HomeContextHeader } from "@/components/HomeContextHeader";
import { HomeNewsSection } from "@/components/HomeNewsSection";
import { HomeServicesSection } from "@/components/HomeServicesSection";
import { HomeToolsSection } from "@/components/HomeToolsSection";
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
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setPreferredLane(lane);
  }, [lane]);

  const retry = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

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
  }, [lane, reloadKey]);

  return (
    <div className={`home-page home-page--${lane}`}>
      <HomeContextHeader />
      <HomeBrandHeader
        valueLine={copy.valueLine}
        supportLine={copy.supportLine}
      />
      {copy.showPromo ? <PromoTeaser /> : null}

      <ShortcutGrid items={copy.quickActions} />

      <HomeServicesSection items={copy.services} />
      <HomeToolsSection items={copy.tools} />

      <section id="projects" className="home-projects" aria-labelledby="projects-title">
        <div className="section-head">
          <h2 id="projects-title" className="section-title">
            {copy.projectsTitle}
          </h2>
          <Link to="/tu-van" className="muted">
            Tư vấn ngay
          </Link>
        </div>
        <p className="muted section-lead">{copy.projectsLead}</p>

        {loading ? (
          <div className="project-grid-skeleton" aria-busy="true">
            <div className="skel-card" />
            <div className="skel-card" />
          </div>
        ) : null}

        {err ? (
          <AppStateCard
            title="Không tải được dự án"
            message={err}
            onRetry={retry}
            busy={loading}
          />
        ) : null}

        {!loading && !err && items.length === 0 ? (
          <AppStateCard
            title="Chưa có dự án"
            message="Chưa có dự án trong phân khúc này. Thử lại sau hoặc đổi mục tiêu ở header."
            onRetry={retry}
          />
        ) : null}

        {!loading && !err && items.length > 0 ? (
          <div className="project-grid">
            {items.map((p) => (
              <ProjectGridCard key={p.id} project={p} />
            ))}
          </div>
        ) : null}
      </section>

      <CrossLaneTeaser currentLane={lane} />
      <HomeNewsSection items={copy.articles} />

      <p className="home-foot muted">House X · timnhaxahoi.com</p>
    </div>
  );
}
