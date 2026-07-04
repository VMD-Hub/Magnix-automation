import type { Metadata } from "next";
import Link from "next/link";
import { ContactChannelList, EditorialRoleGrid, ExpertAdvisoryCard, NumberedSteps, TeamMemberCard } from "@/components/content/team-editorial-sections";
import { PageCtaBand, TrustBreadcrumb } from "@/components/content/trust-page-sections";
import { HOUSEX_PROSE_CLASS } from "@/components/content/document-typography";
import {
  getExpertBySlug,
  EDITORIAL_METHODOLOGY_PATH,
} from "@/lib/content/editorial-trust";
import { TEAM_EDITORIAL_PAGE } from "@/lib/content/team-editorial-content";
import { getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: TEAM_EDITORIAL_PAGE.metaTitle,
  description: TEAM_EDITORIAL_PAGE.metaDescription,
  alternates: { canonical: `${getSiteUrl()}/doi-ngu` },
};

export default function DoiNguPage() {
  const p = TEAM_EDITORIAL_PAGE;

  return (
    <div className="mx-auto max-w-3xl py-10 container-px">
      <TrustBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Giới thiệu", href: "/gioi-thieu" },
          { label: "Đội ngũ & biên tập" },
        ]}
      />

      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {p.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">{p.intro}</p>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-extrabold text-slate-900">{p.leadership.heading}</h2>
        <div className="mt-6 space-y-4">
          {p.leadership.members.map((m) => (
            <TeamMemberCard key={m.id} member={m} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-extrabold text-slate-900">{p.editorialTeam.heading}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.editorialTeam.intro}</p>
        <div className="mt-6">
          <EditorialRoleGrid roles={p.editorialTeam.roles} />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-extrabold text-slate-900">{p.advisoryExperts.heading}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.advisoryExperts.intro}</p>
        <div className="mt-6 space-y-4">
          {p.advisoryExperts.expertSlugs.map((slug) => {
            const expert = getExpertBySlug(slug);
            if (!expert) return null;
            return (
              <ExpertAdvisoryCard
                key={slug}
                name={expert.name}
                jobTitle={expert.jobTitle}
                bio={expert.bio}
                reviewNote="Rà soát nội dung NOXH — cập nhật khi có nghị định mới"
              />
            );
          })}
        </div>
      </section>

      <section className={`mb-12 ${HOUSEX_PROSE_CLASS}`}>
        <h2>{p.responsibilities.heading}</h2>
        <ul>
          {p.responsibilities.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-extrabold text-slate-900">{p.workflow.heading}</h2>
        <NumberedSteps steps={p.workflow.steps} className="mt-4" />
        <p className="mt-4 text-sm text-slate-600">
          Chi tiết:{" "}
          <Link href={EDITORIAL_METHODOLOGY_PATH} className="font-semibold text-brand-700 underline">
            Phương pháp biên tập
          </Link>
        </p>
      </section>

      <section className={`mb-12 ${HOUSEX_PROSE_CLASS}`}>
        <h2>{p.culture.heading}</h2>
        <ul>
          {p.culture.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-extrabold text-slate-900">{p.contact.heading}</h2>
        <div className="mt-6">
          <ContactChannelList channels={p.contact.channels} />
        </div>
      </section>

      <section className="rounded-2xl border border-brand-100 bg-brand-50/50 p-6">
        <h2 className="text-lg font-extrabold text-slate-900">{p.cta.title}</h2>
        <p className="mt-2 text-sm text-slate-600">{p.cta.body}</p>
        <PageCtaBand
          className="mt-4 border-0 bg-transparent p-0"
          primary={p.cta.primary}
          secondary={p.cta.secondary}
        />
      </section>
    </div>
  );
}
