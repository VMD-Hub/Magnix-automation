import { parseProjectOverview, resolveLandingHeroImage } from "@/lib/content/project-landing";
import { getDemoProjectBySlug } from "@/lib/preview/demo-projects";
import { getCatalogSlugs } from "@/lib/seed/catalog-project-slugs";

function u(photoId: string, w = 800, h = 500) {
  return `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;
}

const GENERIC_NOXH = u("photo-1600585154526-990dced4db0d");
const GENERIC_COMMERCIAL = u("photo-1613490493576-7fde63acd811");

/** Ảnh bìa dự phòng khi hero landing thiếu hoặc hotlink lỗi — admin thay sau. */
const SLUG_OVERRIDES: Record<string, string> = {
  "chung-cu-phuc-loc-tho-noxh": u("photo-1600047509358-52dc686375e8"),
  "dragon-e-home-phu-huu": u("photo-1600607687939-ce8a6c25118c"),
  "eco-residence-long-binh-tan": u("photo-1600566753190-17f0baa2a6a3"),
  "thu-thiem-green-house-thu-duc": u("photo-1600047509800-ba3955280484"),
  "nha-o-xa-hoi-nam-long-2-can-tho": u("photo-1600585154340-be6161a56a0c"),
  "nha-o-xa-hoi-nam-long-hong-phat-can-tho": u("photo-1600566752354-46a8b8f8dfc0"),
  "nha-o-xa-hoi-ly-thuong-kiet": u("photo-1600210492486-724fe641c782"),
  "noxh-kdc-chang-song-phuoc-tan": u("photo-1600585154526-990dced4db0d"),
};

export function getCatalogCoverUrl(slug: string): string | null {
  if (SLUG_OVERRIDES[slug]) return SLUG_OVERRIDES[slug];

  const project = getDemoProjectBySlug(slug);
  if (!project) return null;

  const overview = parseProjectOverview(project.overviewData);
  const hero = resolveLandingHeroImage(overview.landing, project.name);
  if (hero?.url) return hero.url;

  return project.projectType === "NHA_O_XA_HOI" ? GENERIC_NOXH : GENERIC_COMMERCIAL;
}

/** Mọi slug catalog đều có ảnh bìa tối thiểu. */
export function ensureCatalogCoverUrl(slug: string): string {
  return getCatalogCoverUrl(slug) ?? GENERIC_COMMERCIAL;
}

export function allCatalogSlugsHaveCover(): boolean {
  return getCatalogSlugs().every((slug) => Boolean(getCatalogCoverUrl(slug)));
}
