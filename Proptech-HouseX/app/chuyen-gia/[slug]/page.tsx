import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getExpertBySlug,
  listExpertSlugs,
} from "@/lib/content/editorial-trust";
import { EDITORIAL_METHODOLOGY_PATH } from "@/lib/content/editorial-trust";
import { buildPersonJsonLd } from "@/lib/seo/person-json-ld";
import { HOUSEX_PROSE_CLASS } from "@/components/content/document-typography";
import { buildBreadcrumbJsonLd } from "@/lib/seo/affiliate-json-ld";
import { getSiteUrl } from "@/lib/site-config";
import { normalizeSeoDescription, normalizeSeoTitle } from "@/lib/seo/meta-text";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listExpertSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const expert = getExpertBySlug(slug);
  if (!expert) return { title: "Không tìm thấy" };

  return {
    title: normalizeSeoTitle(`${expert.name} — Chuyên gia NOXH`),
    description: normalizeSeoDescription(expert.bio),
    alternates: {
      canonical: `${getSiteUrl()}/chuyen-gia/${slug}`,
    },
  };
}

export default async function ExpertProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const expert = getExpertBySlug(slug);
  if (!expert) notFound();

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Trang chủ", path: "/" },
    { name: expert.name, path: `/chuyen-gia/${expert.slug}` },
  ]);
  const personLd = buildPersonJsonLd(expert);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <article className={`mx-auto max-w-2xl py-10 container-px ${HOUSEX_PROSE_CLASS}`}>
        <nav className="not-prose mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-brand-700">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link href="/doi-ngu" className="hover:text-brand-700">
            Đội ngũ & biên tập
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{expert.name}</span>
        </nav>

        <h1>{expert.name}</h1>
        <p className="text-base font-medium text-slate-600">{expert.jobTitle}</p>

        <h2>Chuyên môn</h2>
        <ul>
          {expert.knowsAbout.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>

        <p>{expert.bio}</p>

        <h2>Tiêu chuẩn biên tập</h2>
        <ul>
          {expert.credentials.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>

        <p>
          <Link href={EDITORIAL_METHODOLOGY_PATH}>Phương pháp biên tập</Link>
          {" · "}
          <Link href="/cong-cu/dieu-kien-noxh">Công cụ kiểm tra NOXH</Link>
          {" · "}
          <Link href="/tin-tuc/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat">
            Pillar điều kiện NOXH
          </Link>
        </p>
      </article>
    </>
  );
}
