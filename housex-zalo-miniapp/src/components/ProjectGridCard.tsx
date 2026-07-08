import { Link } from "react-router-dom";
import type { ProjectCard } from "@/services/projects";
import { formatVnd, mediaUrl } from "@/utils/media";

function typeLabel(t: string) {
  if (t === "NHA_O_XA_HOI") return "NOXH";
  if (t === "THUONG_MAI") return "TM";
  return t;
}

export function ProjectGridCard({
  project,
  priceHint,
}: {
  project: ProjectCard;
  priceHint?: string | null;
}) {
  const img = mediaUrl(project.heroImageUrl);
  const loc = [project.district, project.province].filter(Boolean).join(", ");

  return (
    <Link to={`/du-an/${project.slug}`} className="project-grid-card">
      <div
        className="project-grid-media"
        style={img ? { backgroundImage: `url(${img})` } : undefined}
      >
        <span className="project-grid-badge">{typeLabel(project.projectType)}</span>
      </div>
      <div className="project-grid-body">
        <h3>{project.name}</h3>
        {loc ? <p className="muted">{loc}</p> : null}
        {priceHint ? <p className="project-grid-price">{priceHint}</p> : null}
      </div>
    </Link>
  );
}

export function priceHintFromUnits(
  unitTypes: Array<{ priceFrom: string | null }> | undefined,
): string | null {
  if (!unitTypes?.length) return null;
  const nums = unitTypes
    .map((u) => (u.priceFrom ? Number(u.priceFrom) : NaN))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (!nums.length) return null;
  const min = formatVnd(Math.min(...nums));
  return min ? `Từ ${min}` : null;
}
