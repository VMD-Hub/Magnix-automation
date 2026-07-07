export const PROJECT_CATALOG_BASE_PATH = "/du-an" as const;

/** Hub danh mục NOXH — URL SEO thay cho ?projectType=NHA_O_XA_HOI */
export const NOXH_CATALOG_PATH = "/du-an/nha-o-xa-hoi" as const;

/** Hub danh mục thương mại — URL SEO thay cho ?projectType=THUONG_MAI */
export const COMMERCIAL_CATALOG_PATH = "/du-an/thuong-mai" as const;

export type ProjectCatalogDbType = "NHA_O_XA_HOI" | "THUONG_MAI";

/** Slug segment dành riêng — không dùng làm landing dự án. */
export const PROJECT_CATALOG_TYPE_SLUGS = new Set([
  "nha-o-xa-hoi",
  "thuong-mai",
]);

const TYPE_TO_PATH: Record<ProjectCatalogDbType, string> = {
  NHA_O_XA_HOI: NOXH_CATALOG_PATH,
  THUONG_MAI: COMMERCIAL_CATALOG_PATH,
};

const SEGMENT_TO_TYPE: Record<string, ProjectCatalogDbType> = {
  "nha-o-xa-hoi": "NHA_O_XA_HOI",
  "thuong-mai": "THUONG_MAI",
};

export function isProjectCatalogTypeSlug(slug: string): boolean {
  return PROJECT_CATALOG_TYPE_SLUGS.has(slug);
}

export function projectCatalogTypeFromSegmentSlug(
  slug: string,
): ProjectCatalogDbType | undefined {
  return SEGMENT_TO_TYPE[slug];
}

export function projectCatalogPathForType(
  projectType: ProjectCatalogDbType,
): string {
  return TYPE_TO_PATH[projectType];
}

export function projectCatalogTypeFromLegacyQuery(
  value: string | undefined,
): ProjectCatalogDbType | undefined {
  if (value === "NHA_O_XA_HOI" || value === "THUONG_MAI") return value;
  return undefined;
}

export function projectCatalogPageHref(
  projectType: ProjectCatalogDbType | undefined,
  page: number,
): string {
  const base = projectType
    ? projectCatalogPathForType(projectType)
    : PROJECT_CATALOG_BASE_PATH;
  return page > 1 ? `${base}?page=${page}` : base;
}

export function projectCatalogCanonicalUrl(
  projectType: ProjectCatalogDbType | undefined,
  page: number,
  siteUrl: string,
): string {
  const href = projectCatalogPageHref(projectType, Math.max(1, page));
  return `${siteUrl}${href}`;
}
