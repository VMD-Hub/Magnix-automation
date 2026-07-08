import { Link } from "react-router-dom";
import type { ProjectCard } from "@/services/projects";
import { mediaUrl } from "@/utils/media";

function typeLabel(t: string) {
  if (t === "NHA_O_XA_HOI") return "NOXH";
  if (t === "THUONG_MAI") return "Thương mại";
  return t;
}

export function ProjectCardView({ project }: { project: ProjectCard }) {
  const img = mediaUrl(project.heroImageUrl);
  const loc = [project.district, project.province].filter(Boolean).join(", ");

  return (
    <Link to={`/du-an/${project.slug}`} className="project-card">
      <div
        className="project-card-media"
        style={img ? { backgroundImage: `url(${img})` } : undefined}
      />
      <div className="project-card-body">
        <span className="chip">{typeLabel(project.projectType)}</span>
        <h2>{project.name}</h2>
        {loc ? <p>{loc}</p> : null}
        {project.unitTypeCount > 0 ? (
          <p className="muted">{project.unitTypeCount} loại căn</p>
        ) : null}
      </div>
    </Link>
  );
}
