import Link from "next/link";
import { AFFILIATE_VERTICALS } from "@/lib/content/affiliate-verticals";
import {
  HOUSEX_SERVICES_LABEL,
  HOUSEX_SERVICE_NOTE,
} from "@/lib/content/housex-services-copy";
import {
  HUB_VERTICAL_CARDS,
  SERVICES_HUB_VISUAL,
} from "@/lib/content/housex-services-visuals";
import {
  ServiceLandingHero,
  ServiceProcessSteps,
  ServiceTrustGrid,
} from "@/components/affiliate/service-landing-parts";
import { buildBreadcrumbJsonLd } from "@/lib/seo/affiliate-json-ld";
import { Icon } from "@/components/icons";

export function ServicesHubLanding() {
  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: HOUSEX_SERVICES_LABEL, path: "/dich-vu" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbs)),
        }}
      />

      <ServiceLandingHero
        eyebrow={SERVICES_HUB_VISUAL.eyebrow}
        title={HOUSEX_SERVICES_LABEL}
        intro="Vay vốn, thẩm định giá và thiết kế nội thất — mỗi nhóm có landing riêng với quy trình và form tư vấn."
        heroImage={SERVICES_HUB_VISUAL.heroImage}
        heroGradient="from-ink-900/95 via-ink-800/88 to-brand-900/70"
        breadcrumbs={breadcrumbs}
        primaryCta={{ label: "Tư vấn vay", href: "/tai-chinh" }}
        secondaryCta={{ label: "Định giá BĐS", href: "/dinh-gia" }}
      />

      <section className="proptech-trust-band">
        <div className="mx-auto grid max-w-7xl gap-6 py-8 container-px lg:grid-cols-3">
          {SERVICES_HUB_VISUAL.highlights.map((h) => (
            <div key={h.label} className="proptech-ruby-soft-panel px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                {h.label}
              </p>
              <p className="mt-1 font-semibold text-slate-900">{h.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-14 container-px">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900">Chọn dịch vụ phù hợp</h2>
          <p className="mt-2 text-slate-600">
            Mỗi nhóm dịch vụ có landing riêng — quy trình, báo giá và form tư vấn tích hợp.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {AFFILIATE_VERTICALS.map((v) => {
            const card = HUB_VERTICAL_CARDS[v.id];
            return (
              <Link
                key={v.id}
                href={v.path}
                className="group relative overflow-hidden rounded-3xl border border-[rgba(252,211,77,0.22)] bg-brand-800 shadow-xl"
              >
                <div className="aspect-[4/5] sm:aspect-[3/4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="proptech-catalog-hero__overlay-h absolute inset-0" />
                  <div className="proptech-catalog-hero__overlay-v absolute inset-0" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="rounded-full bg-brand-500/90 px-3 py-1 text-xs font-bold text-white">
                    {card.badge}
                  </span>
                  <h3 className="mt-3 text-xl font-bold">{v.h1}</h3>
                  <p className="mt-2 text-sm text-slate-300 line-clamp-2">{v.intro}</p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-400">
                    {v.services.slice(0, 2).map((s) => (
                      <li key={s.slug}>• {s.title}</li>
                    ))}
                    {v.showcases?.slice(0, 1).map((s) => (
                      <li key={s.slug}>• {s.title}</li>
                    ))}
                    {v.productLines?.slice(0, 2).map((p) => (
                      <li key={p.id}>• {p.title}</li>
                    ))}
                  </ul>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-300">
                    {card.cta} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <ServiceProcessSteps
        title="Quy trình đồng hành HouseX"
        steps={SERVICES_HUB_VISUAL.steps}
      />

      <ServiceTrustGrid
        items={[
          { title: "Chuyên nghiệp & hợp pháp", desc: HOUSEX_SERVICE_NOTE },
          {
            title: "Tích hợp Proptech",
            desc: "Tìm nhà, dự án và công cụ tính vay trên cùng nền tảng.",
          },
          {
            title: "Một đầu mối tư vấn",
            desc: "Hồ sơ vay, thẩm định và nội thất được đồng bộ khi bạn cần.",
          },
        ]}
      />

      <section className="mx-auto max-w-7xl py-14 container-px">
        <h2 className="text-xl font-bold text-slate-900">Bất động sản &amp; công cụ</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { href: "/mua-ban", label: "Mua bán BĐS", Icon: Icon.Compass, desc: "Tin đăng đã kiểm duyệt" },
            { href: "/du-an", label: "Dự án mới", Icon: Icon.Building, desc: "NOXH & dự án nổi bật" },
            {
              href: "/cong-cu/tinh-khoan-vay",
              label: "Tính khoản vay",
              Icon: Icon.Calculator,
              desc: "Miễn phí, xuất PDF",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-600">
                <item.Icon />
              </span>
              <div>
                <p className="font-semibold text-slate-900">{item.label}</p>
                <p className="mt-0.5 text-sm text-slate-500">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl pb-14 container-px">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-800 p-8 text-center text-white sm:flex sm:items-center sm:justify-between sm:text-left">
          <div>
            <h2 className="text-xl font-bold">Sẵn sàng bắt đầu?</h2>
            <p className="mt-1 text-brand-100">Gửi yêu cầu — chúng tôi liên hệ trong giờ làm việc.</p>
          </div>
          <Link
            href="/lien-he"
            className="mt-4 inline-flex h-12 items-center rounded-xl bg-white px-6 text-sm font-semibold text-brand-800 hover:bg-brand-50 sm:mt-0"
          >
            Liên hệ ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
