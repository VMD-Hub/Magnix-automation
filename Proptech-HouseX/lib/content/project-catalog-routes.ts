import type { Metadata } from "next";
import {
  NOXH_CATALOG_SEO_DESCRIPTION,
  NOXH_CATALOG_SEO_TITLE,
} from "@/lib/content/messaging/noxh-public";
import {
  projectCatalogCanonicalUrl,
  type ProjectCatalogDbType,
} from "@/lib/content/project-catalog-paths";
import { getSiteUrl } from "@/lib/site-config";

export {
  COMMERCIAL_CATALOG_PATH,
  NOXH_CATALOG_PATH,
  PROJECT_CATALOG_BASE_PATH,
  PROJECT_CATALOG_TYPE_SLUGS,
  isProjectCatalogTypeSlug,
  projectCatalogPageHref,
  projectCatalogPathForType,
  projectCatalogTypeFromLegacyQuery,
  projectCatalogTypeFromSegmentSlug,
  type ProjectCatalogDbType,
} from "@/lib/content/project-catalog-paths";

export const COMMERCIAL_CATALOG_SEO_TITLE =
  "Dự án thương mại — TP.HCM & vùng ven" as const;

export const COMMERCIAL_CATALOG_SEO_DESCRIPTION =
  "Danh mục dự án BĐS thương mại trên House X: căn hộ, nhà phố và đô thị mới tại TP.HCM cùng các tỉnh lân cận — thông tin giá và tiến độ minh bạch." as const;

export function buildProjectCatalogMetadata(
  projectType: ProjectCatalogDbType | undefined,
  page: number,
): Metadata {
  const isNoxh = projectType === "NHA_O_XA_HOI";
  const isCommercial = projectType === "THUONG_MAI";

  const title = isNoxh
    ? NOXH_CATALOG_SEO_TITLE
    : isCommercial
      ? COMMERCIAL_CATALOG_SEO_TITLE
      : "Dự án bất động sản trên House X";

  const description = isNoxh
    ? NOXH_CATALOG_SEO_DESCRIPTION
    : isCommercial
      ? COMMERCIAL_CATALOG_SEO_DESCRIPTION
      : "Danh mục dự án thương mại và nhà ở xã hội trên House X — giá, tiến độ và điều kiện mua có căn cứ.";

  return {
    title,
    description,
    alternates: {
      canonical: projectCatalogCanonicalUrl(projectType, page, getSiteUrl()),
    },
  };
}
