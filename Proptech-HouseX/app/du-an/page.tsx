import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { ProjectCatalogPage } from "@/components/projects/project-catalog-page";
import {
  buildProjectCatalogMetadata,
  projectCatalogPageHref,
  projectCatalogTypeFromLegacyQuery,
} from "@/lib/content/project-catalog-routes";

export const revalidate = 300;

type PageProps = {
  searchParams: Promise<{
    projectType?: string;
    page?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const legacyType = projectCatalogTypeFromLegacyQuery(sp.projectType);
  if (legacyType) {
    return buildProjectCatalogMetadata(legacyType, page);
  }
  return buildProjectCatalogMetadata(undefined, page);
}

export default async function DuAnListPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const legacyType = projectCatalogTypeFromLegacyQuery(sp.projectType);

  if (legacyType) {
    permanentRedirect(projectCatalogPageHref(legacyType, page));
  }

  return <ProjectCatalogPage page={page} />;
}
