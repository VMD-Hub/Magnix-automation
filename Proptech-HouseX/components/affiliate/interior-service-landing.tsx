import Link from "next/link";
import type { AffiliateVertical } from "@/lib/content/affiliate-verticals";
import { showcasePagePath } from "@/lib/content/affiliate-verticals";
import { HOUSEX_SERVICES_LABEL } from "@/lib/content/housex-services-copy";
import {
  getFeaturedCaseStudies,
  NHA_DEP_PATH,
  NOI_THAT_MAIN_SERVICES,
  caseStudyPagePath,
  STYLE_IMAGE_KEYS,
  type InteriorStyleSlug,
} from "@/lib/content/noi-that-content";
import {
  VERTICAL_VISUALS,
  cardImageForSlug,
} from "@/lib/content/housex-services-visuals";
import {
  ServiceCtaSection,
  ServiceFaqSection,
  ServiceImageCard,
  ServiceLandingHero,
  ServiceProcessSteps,
  ServiceStatsBand,
  ServiceToolLinks,
  ServiceTrustGrid,
} from "@/components/affiliate/service-landing-parts";
import { StickyCtaBar } from "@/components/affiliate/sticky-cta-bar";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildVerticalCollectionJsonLd,
} from "@/lib/seo/affiliate-json-ld";

export function InteriorServiceLanding({ vertical }: { vertical: AffiliateVertical }) {
  const visual = VERTICAL_VISUALS[vertical.id];
  const featuredProjects = getFeaturedCaseStudies(6);
  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: HOUSEX_SERVICES_LABEL, path: "/dich-vu" },
    { name: vertical.h1, path: vertical.path },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildVerticalCollectionJsonLd(vertical)),
        }}
      />
      {vertical.hubFaqs ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildFaqJsonLd(vertical.hubFaqs)),
          }}
        />
      ) : null}

      <ServiceLandingHero
        eyebrow="Dịch vụ House X · TP.HCM"
        title={vertical.h1}
        intro={vertical.intro}
        heroImage={visual.heroImage}
        heroGradient={visual.heroGradient}
        breadcrumbs={breadcrumbs}
        primaryCta={{ label: "Yêu cầu báo giá / Tư vấn miễn phí", href: "#tu-van" }}
        secondaryCta={{ label: "Xem công trình", href: "#cong-trinh" }}
      />

      <ServiceStatsBand stats={visual.stats} accentBg={visual.accentBg} />

      {/* Dịch vụ chính */}
      <section className="mx-auto max-w-7xl py-14 container-px">
        <h2 className="text-2xl font-bold text-slate-900">Dịch vụ chính</h2>
        <p className="mt-2 max-w-2xl text-slate-600">{vertical.partnerIntro}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {NOI_THAT_MAIN_SERVICES.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="text-2xl text-brand-600" aria-hidden>
                {s.icon}
              </span>
              <h3 className="mt-3 font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <ServiceProcessSteps
        title="Quy trình làm việc"
        steps={visual.process}
        accentText={visual.accentText}
        columns={5}
      />

      {/* Công trình tiêu biểu */}
      <section id="cong-trinh" className="scroll-mt-24 bg-white py-14">
        <div className="mx-auto max-w-7xl container-px">
          <h2 className="text-2xl font-bold text-slate-900">Công trình tiêu biểu</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Mẫu tham khảo từ studio đối tác tại TP.HCM — hình ảnh minh họa, chi phí qua
            liên hệ sau khảo sát.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p) => (
              <ServiceImageCard
                key={p.slug}
                href={caseStudyPagePath(p.slug)}
                image={cardImageForSlug(p.imageKey)}
                badge={p.district}
                title={p.title}
                desc={p.summary}
                cta="Xem công trình →"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Ước tính chi phí — không bảng giá cam kết */}
      <section className="mx-auto max-w-7xl py-14 container-px">
        <div className="proptech-ruby-soft-panel p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Chi phí tham khảo</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            Chi phí thiết kế và thi công phụ thuộc diện tích, hạng mục và vật liệu — thường
            dao động theo từng căn tại TP.HCM. House X{" "}
            <strong className="text-slate-800">không công bố giá cam kết</strong> trên website;
            bạn nhận ước tính chi tiết sau khảo sát hiện trạng.
          </p>
          <ul className="mt-4 space-y-1 text-sm text-slate-600">
            <li>· Thiết kế 2D/3D — báo theo m² và độ phức tạp</li>
            <li>· Thi công hoàn thiện — báo theo hạng mục và bảng vật liệu</li>
            <li>· Decor &amp; nội thất rời — tùy chọn theo ngân sách</li>
          </ul>
          <Link
            href="#tu-van"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Liên hệ nhận ước tính →
          </Link>
        </div>
      </section>

      {/* Phong cách */}
      {vertical.showcases && vertical.showcases.length > 0 ? (
        <section className="border-y border-slate-200 bg-slate-50 py-14">
          <div className="mx-auto max-w-7xl container-px">
            <h2 className="text-2xl font-bold text-slate-900">Phong cách thiết kế</h2>
            <p className="mt-2 text-slate-600">
              Khám phá đặc trưng, vật liệu và công trình mẫu theo từng phong cách.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {vertical.showcases.map((s) => {
                const imageKey =
                  STYLE_IMAGE_KEYS[s.slug as InteriorStyleSlug] ?? s.slug;
                return (
                  <ServiceImageCard
                    key={s.slug}
                    href={showcasePagePath(vertical.path, s.slug)}
                    image={cardImageForSlug(imageKey)}
                    badge={s.tags?.[0]}
                    title={s.title}
                    desc={s.intro}
                    cta="Xem phong cách →"
                  />
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Nhà đẹp inspiration teaser */}
      <section className="mx-auto max-w-7xl py-14 container-px">
        <div className="grid gap-8 overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-2">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[280px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cardImageForSlug("can-ho-dep-y-tuong")}
              alt="Ý tưởng nhà đẹp — phòng khách và decor"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center p-8">
            <h2 className="text-2xl font-bold text-slate-900">Nhà đẹp — Ý tưởng bố trí</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Bảng cảm hứng phòng khách, bếp, phòng ngủ và decor — lọc theo phong cách. Không
              gắn báo giá; dùng để tham khảo trước khi liên hệ thiết kế.
            </p>
            <Link
              href={NHA_DEP_PATH}
              className="mt-6 inline-flex w-fit items-center text-sm font-semibold text-brand-700 hover:underline"
            >
              Khám phá ý tưởng nhà đẹp →
            </Link>
          </div>
        </div>
      </section>

      <ServiceTrustGrid items={visual.trust} accentBg="bg-white" />

      <ServiceToolLinks
        links={[
          { label: "Tính khoản vay mua nhà", href: "/cong-cu/tinh-khoan-vay" },
          { label: "Dịch vụ tài chính", href: "/tai-chinh" },
          { label: "Thẩm định giá", href: "/dinh-gia" },
        ]}
        note="Hành trình Proptech House X — tìm nhà, vay, định giá và nội thất trên cùng nền tảng."
      />

      <ServiceFaqSection
        id="faq"
        title="Câu hỏi thường gặp về nội thất"
        faqs={vertical.hubFaqs ?? []}
      />

      <p className="mx-auto max-w-3xl px-4 pb-6 text-center text-xs text-slate-500 container-px">
        {vertical.disclaimer}
      </p>

      <ServiceCtaSection
        verticalId={vertical.id}
        title="Yêu cầu báo giá / Tư vấn miễn phí"
        subtitle="Mô tả diện tích, quận và phong cách — House X kết nối studio đối tác và phản hồi trong giờ làm việc."
      />

      <div className="mx-auto max-w-7xl pb-8 text-center container-px">
        <Link href="/dich-vu" className="text-sm font-semibold text-brand-700 hover:underline">
          ← Xem tất cả dịch vụ House X
        </Link>
      </div>

      <StickyCtaBar label="Yêu cầu tư vấn" href="#tu-van" />
    </div>
  );
}
