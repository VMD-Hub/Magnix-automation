import Link from "next/link";
import type { AffiliateVertical } from "@/lib/content/affiliate-verticals";
import { showcasePagePath } from "@/lib/content/affiliate-verticals";
import { HOUSEX_SERVICES_LABEL } from "@/lib/content/housex-services-copy";
import type { InteriorCaseStudy } from "@/lib/content/noi-that-content";
import {
  caseStudyPagePath,
  stylePagePath,
} from "@/lib/content/noi-that-content";
import { cardImageForSlug } from "@/lib/content/housex-services-visuals";
import {
  ServiceCtaSection,
  ServiceLandingHero,
} from "@/components/affiliate/service-landing-parts";
import { VERTICAL_VISUALS } from "@/lib/content/housex-services-visuals";
import {
  buildBreadcrumbJsonLd,
  buildCaseStudyJsonLd,
} from "@/lib/seo/affiliate-json-ld";

export function InteriorCaseStudyPage({
  vertical,
  study,
}: {
  vertical: AffiliateVertical;
  study: InteriorCaseStudy;
}) {
  const visual = VERTICAL_VISUALS[vertical.id];
  const heroImage = cardImageForSlug(study.imageKey);
  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: HOUSEX_SERVICES_LABEL, path: "/dich-vu" },
    { name: "Nội thất", path: vertical.path },
    { name: "Công trình", path: `${vertical.path}#cong-trinh` },
    { name: study.title, path: caseStudyPagePath(study.slug) },
  ];

  const sections = [
    { title: "Thách thức", body: study.challenge },
    { title: "Giải pháp thiết kế", body: study.solution },
    { title: "Quy trình & timeline", body: study.timeline },
    { title: "Vật liệu & hoàn thiện", body: study.materials },
    { title: "Chi phí tham khảo", body: study.costNote },
  ];

  return (
    <article className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildCaseStudyJsonLd(study)),
        }}
      />

      <ServiceLandingHero
        eyebrow={`${study.area} · ${study.district}`}
        title={study.h1}
        intro={study.summary}
        heroImage={heroImage}
        heroGradient={visual.heroGradient}
        breadcrumbs={breadcrumbs}
        primaryCta={{ label: "Yêu cầu tư vấn", href: "#tu-van" }}
        secondaryCta={{
          label: "Phong cách liên quan",
          href: stylePagePath(study.styleSlug),
        }}
      />

      {study.isMock ? (
        <p className="border-b border-amber-200 bg-amber-50 py-2 text-center text-xs text-amber-900">
          Công trình minh họa — hình ảnh tham khảo; chi tiết thực tế qua khảo sát.
        </p>
      ) : null}

      <div className="mx-auto max-w-3xl py-12 container-px">
        {sections.map((s) => (
          <section key={s.title} className="mb-10">
            <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{s.body}</p>
          </section>
        ))}

        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900">Gallery</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {study.galleryKeys.map((key) => (
              <div key={key} className="overflow-hidden rounded-xl border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cardImageForSlug(key)}
                  alt={`${study.title} — tham khảo`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center">
          <p className="text-sm text-slate-700">
            Muốn triển khai phong cách tương tự? Gửi form — House X kết nối studio đối tác tại
            TP.HCM.
          </p>
          <Link
            href={`${vertical.path}#tu-van`}
            className="mt-4 inline-flex h-11 items-center rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Liên hệ nhận ước tính
          </Link>
        </div>

        <p className="mt-10 text-center">
          <Link
            href={showcasePagePath(vertical.path, study.styleSlug)}
            className="text-sm font-semibold text-brand-700 hover:underline"
          >
            ← Xem phong cách {study.styleSlug.replace("-", " ")}
          </Link>
          {" · "}
          <Link href={vertical.path} className="text-sm font-semibold text-brand-700 hover:underline">
            Về trang nội thất
          </Link>
        </p>
      </div>

      <ServiceCtaSection verticalId="noi-that" />
    </article>
  );
}
