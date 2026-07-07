import type { Metadata } from "next";
import { ProjectCatalogPage } from "@/components/projects/project-catalog-page";
import { buildProjectCatalogMetadata } from "@/lib/content/project-catalog-routes";

export const revalidate = 300;

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  return buildProjectCatalogMetadata("THUONG_MAI", page);
}

export default async function ThuongMaiCatalogPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  return (
    <ProjectCatalogPage projectType="THUONG_MAI" page={page} />
  );
}
