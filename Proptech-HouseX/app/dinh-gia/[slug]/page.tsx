import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, getVertical } from "@/lib/content/affiliate-verticals";
import { AffiliateServicePage } from "@/components/affiliate/affiliate-service-page";

const VERTICAL_ID = "dinh-gia" as const;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getVertical(VERTICAL_ID).services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(VERTICAL_ID, slug);
  if (!service) return { title: "Không tìm thấy" };
  const vertical = getVertical(VERTICAL_ID);
  return {
    title: service.title,
    description: service.metaDescription,
    alternates: { canonical: `${vertical.path}/${slug}` },
  };
}

export default async function DinhGiaServicePage({ params }: Props) {
  const { slug } = await params;
  const vertical = getVertical(VERTICAL_ID);
  const service = getService(VERTICAL_ID, slug);
  if (!service) notFound();
  return <AffiliateServicePage vertical={vertical} service={service} />;
}
