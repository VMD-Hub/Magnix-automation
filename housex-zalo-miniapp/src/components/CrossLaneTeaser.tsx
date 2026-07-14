import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProjectGridCard } from "@/components/ProjectGridCard";
import {
  CCTM_FEATURED_SLUGS,
  NOXH_FEATURED_SLUGS,
} from "@/data/home-featured-projects";
import {
  getProject,
  listProjects,
  mapProjectCard,
  type ProjectCard,
} from "@/services/projects";
import {
  LANE_LABELS,
  laneHomePath,
  oppositeLane,
  projectTypeForLane,
  type UserLane,
} from "@/services/lane";

const TEASER_LIMIT = 2;

/** Gợi ý dự án lane đối diện — cuối Home, không trộn filter chính. */
export function CrossLaneTeaser({ currentLane }: { currentLane: UserLane }) {
  const other = oppositeLane(currentLane);
  const [items, setItems] = useState<ProjectCard[]>([]);

  useEffect(() => {
    let alive = true;
    const featured =
      other === "noxh" ? NOXH_FEATURED_SLUGS : CCTM_FEATURED_SLUGS;

    (async () => {
      try {
        const data = await listProjects({
          projectType: projectTypeForLane(other),
          status: "DANG_BAN",
          pageSize: 10,
        });
        const bySlug = new Map(data.items.map((p) => [p.slug, p]));

        for (const slug of featured) {
          if (bySlug.has(slug) || bySlug.size >= TEASER_LIMIT) continue;
          try {
            const detail = await getProject(slug);
            bySlug.set(slug, mapProjectCard(detail));
          } catch {
            /* chưa seed */
          }
        }

        const ordered = featured
          .map((s) => bySlug.get(s))
          .filter((p): p is ProjectCard => p != null)
          .slice(0, TEASER_LIMIT);

        const fill = data.items
          .filter((p) => !ordered.some((o) => o.id === p.id))
          .slice(0, TEASER_LIMIT - ordered.length);

        if (alive) setItems([...ordered, ...fill].slice(0, TEASER_LIMIT));
      } catch {
        if (alive) setItems([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, [other]);

  if (items.length === 0) return null;

  return (
    <section className="cross-lane" aria-labelledby={`cross-lane-${other}`}>
      <div className="section-head">
        <h2 id={`cross-lane-${other}`} className="section-title section-title--sm">
          {LANE_LABELS[other]}
        </h2>
        <Link to={laneHomePath(other)} className="muted">
          Xem tất cả →
        </Link>
      </div>
      <p className="muted cross-lane-lead">
        Gợi ý dự án khác phù hợp — bạn có thể đổi mục tiêu bất cứ lúc nào.
      </p>
      <div className="project-grid project-grid--teaser">
        {items.map((p) => (
          <ProjectGridCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
