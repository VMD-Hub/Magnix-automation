import Link from "next/link";
import type { ProjectDetail } from "@/lib/data/project";
import { parseProjectOverview, resolveLandingHeroImage } from "@/lib/content/project-landing";
import { ensureNoxhLandingMedia } from "@/lib/content/noxh-stock-images";
import { NOXH_REGION_TAGLINE } from "@/lib/content/messaging/noxh-public";
import { ProjectLocationSection } from "@/components/projects/project-location-section";
import { getProjectMarketplaceListings } from "@/lib/data/listing";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import type { ArticleCardData } from "@/lib/data/article-types";
import { getArticlesForProjectSlug } from "@/lib/data/article-public";
import { ProjectRelatedArticles } from "@/components/articles/project-related-articles";
import { ProjectInventorySection } from "@/components/projects/project-inventory-section";
import { LeadContactForm } from "@/components/leads/lead-contact-form";
import type { ProjectInventoryPageData } from "@/lib/data/project-unit";
import type { ProjectInventoryPageFilters } from "@/lib/validation/project-unit";
import { buildFaqJsonLd } from "@/lib/seo/affiliate-json-ld";
import {
  LISTING_TIER_LABEL,
  PROJECT_STATUS_LABEL,
  PROJECT_TYPE_LABEL,
  TRANSACTION_TYPE_LABEL,
  formatArea,
  formatVnd,
  legalDocLabel,
  LEGAL_DOC_STATUS_LABEL,
  propertyTypeLabel,
} from "@/lib/format";

type Props = {
  project: ProjectDetail;
  /** Truyền từ trang preview — bỏ qua truy vấn DB. */
  marketplaceListings?: ProjectLandingListingCard[];
  relatedArticles?: ArticleCardData[];
  inventory?: ProjectInventoryPageData | null;
  inventoryFilters?: ProjectInventoryPageFilters;
};

export async function ProjectLandingView({
  project,
  marketplaceListings: marketplaceListingsOverride,
  relatedArticles: relatedArticlesOverride,
  inventory,
  inventoryFilters = {},
}: Props) {
  const [marketplaceListings, relatedArticles] = await Promise.all([
    marketplaceListingsOverride ??
      getProjectMarketplaceListings(project.id).catch(() => []),
    relatedArticlesOverride ??
      getArticlesForProjectSlug(project.slug, 6),
  ]);

  return (
    <ProjectLandingContent
      project={project}
      marketplaceListings={marketplaceListings}
      relatedArticles={relatedArticles}
      inventory={inventory}
      inventoryFilters={inventoryFilters}
    />
  );
}

export function ProjectLandingContent({
  project,
  marketplaceListings = [],
  relatedArticles = [],
  inventory = null,
  inventoryFilters = {},
}: {
  project: ProjectDetail;
  marketplaceListings?: ProjectLandingListingCard[];
  relatedArticles?: ArticleCardData[];
  inventory?: ProjectInventoryPageData | null;
  inventoryFilters?: ProjectInventoryPageFilters;
}) {
  const isNoxh = project.projectType === "NHA_O_XA_HOI";
  const overview = parseProjectOverview(project.overviewData);
  const landingRaw = overview.landing;
  const landing =
    landingRaw && isNoxh
      ? ensureNoxhLandingMedia(landingRaw, project.slug)
      : landingRaw;

  const stats: { label: string; value: string }[] = [];
  if (overview.totalUnits != null)
    stats.push({
      label: "Số căn",
      value: overview.totalUnits.toLocaleString("vi-VN"),
    });
  if (overview.blocks != null)
    stats.push({ label: "Block / tòa", value: String(overview.blocks) });
  if (project.totalArea != null)
    stats.push({ label: "Tổng diện tích", value: `${project.totalArea} ha` });
  if (project.density != null)
    stats.push({ label: "Mật độ xây dựng", value: `${project.density}%` });
  if (project.handoverDate)
    stats.push({
      label: "Bàn giao",
      value: new Date(project.handoverDate).toLocaleDateString("vi-VN"),
    });
  stats.push({
    label: "Loại hình",
    value: PROJECT_TYPE_LABEL[project.projectType] ?? project.projectType,
  });

  const faqJsonLd =
    landing && landing.faqs.length > 0
      ? buildFaqJsonLd(landing.faqs)
      : null;

  const heroImage = resolveLandingHeroImage(landing, project.name);
  const minUnitPrice = project.unitTypes.reduce<number | null>((min, u) => {
    if (u.priceFrom == null) return min;
    const p = Number(u.priceFrom.toString());
    if (!Number.isFinite(p)) return min;
    return min == null || p < min ? p : min;
  }, null);
  const priceFromLabel = minUnitPrice != null ? formatVnd(minUnitPrice) : null;
  const hasInventory = (inventory?.summary.total ?? 0) > 0;

  return (
    <div className="min-h-screen bg-silver-50 text-[#333333]">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Hero + banner */}
      <section className="lux-hero relative isolate min-h-[420px] overflow-hidden text-white sm:min-h-[480px] lg:min-h-[520px]">
        <div className="lux-hero-mesh" aria-hidden />
        {heroImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage.url}
              alt=""
              aria-hidden
              className="lux-hero-project-photo lux-hero-photo absolute inset-0 h-full w-full object-cover object-center opacity-30"
              fetchPriority="high"
            />
            <div
              className="lux-hero-project-overlay-r absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/75 to-brand-900/20 lg:to-brand-900/10"
              aria-hidden
            />
            <div
              className="lux-hero-project-overlay-t absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-ink-900/20"
              aria-hidden
            />
          </>
        )}
        {!heroImage && (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        )}

        <div className="relative z-[2] mx-auto flex min-h-[420px] max-w-6xl flex-col justify-end px-6 py-10 sm:min-h-[480px] sm:py-14 lg:min-h-[520px] lg:max-w-7xl lg:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-300">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/du-an" className="hover:text-white">
                  Dự án
                </Link>
              </li>
              <li aria-hidden className="text-slate-500">
                /
              </li>
              <li className="text-slate-200">{project.district}</li>
            </ol>
          </nav>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span
              className={
                isNoxh
                  ? "rounded-full bg-emerald-400 px-3 py-1 font-semibold text-emerald-950"
                  : "rounded-full bg-emerald-500/90 px-3 py-1 font-medium"
              }
            >
              {PROJECT_STATUS_LABEL[project.status] ?? project.status}
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
              {PROJECT_TYPE_LABEL[project.projectType] ?? project.projectType}
            </span>
            {project.developer?.verified && (
              <span className="rounded-full bg-sky-400/90 px-3 py-1 font-medium text-sky-950">
                CĐT đã xác thực
              </span>
            )}
            {priceFromLabel && (
              <span className="rounded-full bg-gold-500/95 px-3 py-1 font-bold text-ink-900 shadow-sm shadow-gold-500/30">
                Giá từ {priceFromLabel}
              </span>
            )}
          </div>

          <div className="mt-6 max-w-3xl">
            {isNoxh && (
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-emerald-200/95 sm:text-base">
                {NOXH_REGION_TAGLINE}
              </p>
            )}
            <h1 className="lux-hero-title text-3xl font-bold tracking-tight drop-shadow-sm sm:text-4xl lg:text-5xl lg:leading-[1.1]">
              {project.name}
            </h1>
            {landing?.heroSubtitle && (
              <p className="lux-hero-lead mt-4 text-lg leading-relaxed text-slate-100 sm:text-xl">
                {landing.heroSubtitle}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="flex max-w-2xl items-start gap-2 text-base text-slate-200">
              <svg
                className="mt-1 h-4 w-4 shrink-0 text-brand-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span>
                {[project.address, project.ward, project.district, project.province]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </p>
            {project.developer && (
              <div className="inline-flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-md">
                {project.developer.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.developer.logoUrl}
                    alt=""
                    className="h-10 w-10 rounded-lg bg-white object-contain p-0.5"
                  />
                )}
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-300">
                    Chủ đầu tư
                  </p>
                  <p className="font-semibold">{project.developer.name}</p>
                </div>
              </div>
            )}
          </div>

          {landing?.ctaLabel && landing.ctaHref && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={landing.ctaHref}
                className="lux-gold-cta relative inline-flex h-11 items-center rounded-xl bg-gold-500 px-6 font-semibold text-white"
              >
                {landing.ctaLabel}
              </Link>
              {hasInventory && (
                <a
                  href="#project-inventory-heading"
                  className="inline-flex h-11 items-center rounded-xl border border-white/30 bg-white/10 px-6 font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Xem bảng hàng
                </a>
              )}
              {relatedArticles.length > 0 && (
                <a
                  href="#project-related-articles"
                  className="inline-flex h-11 items-center rounded-xl border border-white/30 bg-white/10 px-6 font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Bài liên quan
                </a>
              )}
              <a
                href="#project-gallery-heading"
                className="inline-flex h-11 items-center rounded-xl border border-white/30 bg-white/10 px-6 font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Xem hình ảnh
              </a>
            </div>
          )}
          {!landing?.ctaLabel && hasInventory && (
            <div className="mt-8">
              <a
                href="#project-inventory-heading"
                className="lux-gold-cta relative inline-flex h-11 items-center rounded-xl bg-gold-500 px-6 font-semibold text-white"
              >
                Xem bảng hàng
              </a>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-6 py-12">
        {stats.length > 0 && (
          <section aria-label="Thông số dự án">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="lux-stat-card p-4"
                >
                  <div className="text-[11px] font-medium uppercase tracking-wide text-[#888888]">
                    {s.label}
                  </div>
                  <div className="mt-1.5 text-lg font-bold text-[#333333]">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {landing && landing.highlights.length > 0 && (
          <section>
            <h2 className="lux-heading-accent text-2xl font-bold">
              Điểm nổi bật {project.name}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {landing.highlights.map((h, i) => (
                <article
                  key={h.title}
                  className="proptech-card p-5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
                    {i + 1}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">
                    {h.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {h.text}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {project.description && (
          <section className="lux-detail-panel p-6 sm:p-8">
            <h2 className="lux-heading-accent text-2xl font-bold">
              Tổng quan dự án {project.name}?
            </h2>
            <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-[#555555]">
              {project.description}
            </p>
          </section>
        )}

        {landing && landing.amenities.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              Tiện ích nội khu có gì?
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {landing.amenities.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-emerald-200/80 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900"
                >
                  {a}
                </li>
              ))}
            </ul>
          </section>
        )}

        <ProjectLocationSection
          projectName={project.name}
          mapImage={landing?.locationMapImage}
          locationNotes={landing?.locationNotes}
        />

        {project.unitTypes.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              Loại hình sản phẩm tại {project.name}?
            </h2>
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="bg-slate-800 text-slate-100">
                    <tr>
                      <th className="px-4 py-3.5 font-semibold">Tên</th>
                      <th className="px-4 py-3.5 font-semibold">Diện tích</th>
                      <th className="px-4 py-3.5 font-semibold">Phòng ngủ</th>
                      <th className="px-4 py-3.5 font-semibold">Giá từ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.unitTypes.map((u, i) => (
                      <tr
                        key={u.id}
                        className={
                          i % 2 === 0
                            ? "border-t border-slate-100 bg-white"
                            : "border-t border-slate-100 bg-slate-50/80"
                        }
                      >
                        <td className="px-4 py-3.5 font-medium text-slate-900">
                          {u.name}
                        </td>
                        <td className="px-4 py-3.5 text-slate-700">
                          {formatArea(u.areaMin, u.areaMax) ?? "—"}
                        </td>
                        <td className="px-4 py-3.5 text-slate-700">
                          {u.bedrooms ?? "—"}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-brand-700">
                          {formatVnd(u.priceFrom) ?? "Liên hệ"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {inventory && inventory.summary.total > 0 && (
          <ProjectInventorySection
            projectSlug={project.slug}
            projectName={project.name}
            inventory={inventory}
            filters={inventoryFilters}
          />
        )}

        {relatedArticles.length > 0 && (
          <ProjectRelatedArticles
            projectName={project.name}
            projectSlug={project.slug}
            articles={relatedArticles}
            isNoxh={isNoxh}
          />
        )}

        {project.legalDocs.length > 0 && (
          <section id="project-legal-heading">
            <h2 className="text-2xl font-bold text-slate-900">
              Pháp lý {project.name} đã có những gì?
            </h2>
            <ul className="mt-5 space-y-2">
              {project.legalDocs.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm"
                >
                  <span className="font-medium text-slate-900">
                    {legalDocLabel(d.docType)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-0.5 text-sm font-medium text-emerald-800">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                      aria-hidden
                    />
                    {LEGAL_DOC_STATUS_LABEL[d.status] ?? d.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {landing && landing.gallery.length > 0 && (
          <section id="project-gallery-heading">
            <h2 className="text-2xl font-bold text-slate-900">
              Hình ảnh dự án
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {landing.gallery.map((g, i) => (
                <figure
                  key={`${g.url}-${i}`}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.url}
                    alt={g.caption ?? project.name}
                    className="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                  {g.caption && (
                    <figcaption className="border-t border-slate-100 px-3 py-2.5 text-sm text-slate-600">
                      {g.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {landing && landing.services && landing.services.length > 0 && isNoxh && (
          <section aria-label="Dịch vụ HouseX">
            <h2 className="text-2xl font-bold text-slate-900">
              HouseX đồng hành hành trình sở hữu NOXH?
            </h2>
            <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600">
              Từ rà soát điều kiện, tính vay NHCSXH đến tra cứu pháp lý — HouseX gom
              hành trình trên một nền tảng, minh bạch dữ liệu như mô hình proptech
              chuyên nghiệp.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {landing.services.map((s) => {
                const inner = (
                  <>
                    <h3 className="text-base font-semibold text-slate-900">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {s.text}
                    </p>
                    {s.href && (
                      <span className="mt-3 inline-block text-sm font-semibold text-brand-700">
                        Tìm hiểu →
                      </span>
                    )}
                  </>
                );
                const cls =
                  "rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md";
                return s.href ? (
                  <Link key={s.title} href={s.href} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <article key={s.title} className={cls}>
                    {inner}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {landing && landing.faqs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              Câu hỏi thường gặp về {project.name}
            </h2>
            <dl className="mt-5 space-y-3">
              {landing.faqs.map((f) => (
                <div
                  key={f.q}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <dt className="text-base font-semibold text-slate-900 sm:text-lg">
                    {f.q}
                  </dt>
                  <dd className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {marketplaceListings.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              Tin ký gửi tại {project.name}?
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Sản phẩm đang được môi giới rao bán/cho thuê tại dự án này.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {marketplaceListings.map((l) => (
                <Link
                  key={l.id}
                  href={`/tin-dang/${l.code}`}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-brand-200 hover:shadow-md"
                >
                  {l.media[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={l.media[0].url}
                      alt={l.code}
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-video w-full bg-slate-100" />
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800">
                        {TRANSACTION_TYPE_LABEL[l.transactionType]}
                      </span>
                      {l.tier !== "FREE" && (
                        <span className="rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-800">
                          {LISTING_TIER_LABEL[l.tier]}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-medium text-slate-900">
                      {propertyTypeLabel(l.propertyType)}
                    </p>
                    <p className="mt-1 text-lg font-bold text-brand-700">
                      {formatVnd(l.price) ?? "Liên hệ"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {l.broker.fullName}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section id="project-lead-form" className="scroll-mt-24">
          <LeadContactForm
            projectId={project.id}
            title={`Tư vấn ${project.name}`}
            defaultOpen
            placeholderMessage="Ví dụ: quan tâm 2PN, ngân sách 4 tỷ, muốn xem thực tế…"
          />
        </section>

        {landing?.ctaLabel && landing.ctaHref && (
          <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-10 text-center text-white sm:px-10 sm:py-12">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Quan tâm {project.name}?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-brand-100">
              {landing.ctaSubtext ??
                "Tư vấn chi tiết hơn về dự án — liên hệ với chúng tôi."}
            </p>
            <Link
              href={landing.ctaHref}
              className="mt-7 inline-flex h-12 items-center rounded-xl bg-white px-8 text-base font-semibold text-brand-800 shadow-sm transition hover:bg-brand-50"
            >
              {landing.ctaLabel}
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
