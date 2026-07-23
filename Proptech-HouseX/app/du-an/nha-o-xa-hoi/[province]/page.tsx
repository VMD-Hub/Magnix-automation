import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoxhProvinceHubPage } from "@/components/projects/noxh-province-hub-page";
import {
  buildNoxhProvinceHubMetadata,
  listNoxhProvinceHubsEnabled,
  resolveNoxhProvinceHubEntry,
} from "@/lib/content/noxh-province-hub";

export const revalidate = 300;

/** Chỉ 4 hub hubEnabled — slug khác (kể cả dong-thap/an-giang) → HTTP 404. */
export const dynamicParams = false;

type PageProps = {
  params: Promise<{ province: string }>;
  searchParams: Promise<{ page?: string }>;
};

export function generateStaticParams() {
  return listNoxhProvinceHubsEnabled().map((e) => ({ province: e.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { province } = await params;
  const entry = resolveNoxhProvinceHubEntry(province);
  if (!entry) notFound();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  return buildNoxhProvinceHubMetadata(entry, page);
}

export default async function NoxhProvinceHubRoute({
  params,
  searchParams,
}: PageProps) {
  const { province } = await params;
  const entry = resolveNoxhProvinceHubEntry(province);
  if (!entry) notFound();

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  return <NoxhProvinceHubPage entry={entry} page={page} />;
}
