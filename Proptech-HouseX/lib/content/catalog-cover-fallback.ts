import { parseProjectOverview, resolveLandingHeroImage } from "@/lib/content/project-landing";
import { DTA_HAPPY_HOME_IMAGES } from "@/lib/content/dta-happy-home-images";
import { getNoxhStockHeroUrl } from "@/lib/content/noxh-stock-images";
import { getDemoProjectBySlug } from "@/lib/preview/demo-projects";
import { getCatalogSlugs } from "@/lib/seed/catalog-project-slugs";

function u(photoId: string, w = 800, h = 500) {
  return `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;
}

const GENERIC_NOXH = u("photo-1600585154526-990dced4db0d");
const GENERIC_COMMERCIAL = u("photo-1613490493576-7fde63acd811");

/** Ảnh bìa dự phòng khi hero landing thiếu hoặc hotlink lỗi — admin thay sau. */
const SLUG_OVERRIDES: Record<string, string> = {
  "dta-happy-home-nhon-trach": DTA_HAPPY_HOME_IMAGES.hero.url,
};

export function getCatalogCoverUrl(slug: string): string | null {
  if (SLUG_OVERRIDES[slug]) return SLUG_OVERRIDES[slug];

  const stockHero = getNoxhStockHeroUrl(slug);
  if (stockHero) return stockHero;

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
