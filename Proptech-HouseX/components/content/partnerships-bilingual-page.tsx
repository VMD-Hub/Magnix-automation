import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import type { BilingualLine, PartnershipProcessStep } from "@/lib/content/partnerships-page-content";
import { PARTNERSHIPS_PAGE } from "@/lib/content/partnerships-page-content";
import {
  DocBlockLabel,
  DocBilingualParagraph,
  DocCardBulletList,
  DocSectionHeading,
  DocSubheading,
} from "@/components/content/document-typography";

function AudienceBlock({
  headingVi,
  headingEn,
  introVi,
  introEn,
  benefitsLabelVi,
  benefitsLabelEn,
  benefits,
}: {
  headingVi: string;
  headingEn: string;
  introVi: string;
  introEn: string;
  benefitsLabelVi: string;
  benefitsLabelEn: string;
  benefits: readonly BilingualLine[];
}) {
  return (
    <section className="rounded-2xl border border-silver-200 bg-white p-6 shadow-sm">
      <DocSectionHeading vi={headingVi} en={headingEn} className="!mt-0 !border-0 !pb-0" />
      <DocBilingualParagraph vi={introVi} en={introEn} className="mt-4" />
      <DocBlockLabel vi={benefitsLabelVi} en={benefitsLabelEn} />
      <DocCardBulletList items={benefits} />
    </section>
  );
}

function ProcessTimeline({ steps }: { steps: readonly PartnershipProcessStep[] }) {
  return (
    <ol className="mt-6 space-y-4">
      {steps.map((step, i) => (
        <li
          key={step.titleVi}
          className="flex gap-4 rounded-2xl border border-silver-200 bg-white p-5 shadow-sm"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
            {i + 1}
          </span>
          <div>
            <DocSubheading vi={step.titleVi} en={step.titleEn} className="!mt-0" />
            <DocBilingualParagraph vi={step.descVi} en={step.descEn} />
          </div>
        </li>
      ))}
    </ol>
  );
}

function PartnershipCtaRow() {
  const ctas = PARTNERSHIPS_PAGE.ctas;
  return (
    <div className="not-prose flex flex-wrap gap-3">
      <ButtonLink href={ctas[0].href} size="md">
        {ctas[0].labelVi}
      </ButtonLink>
      <ButtonLink href={ctas[1].href} variant="outline" size="md">
        {ctas[1].labelVi}
      </ButtonLink>
      <ButtonLink href={ctas[2].href} variant="outline" size="md">
        {ctas[2].labelVi}
      </ButtonLink>
    </div>
  );
}

export function PartnershipsBilingualPage() {
  const p = PARTNERSHIPS_PAGE;

  return (
    <>
      <header className="border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          {p.kickerVi}
          <span className="ml-2 font-normal normal-case italic text-slate-500">/ {p.kickerEn}</span>
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {p.h1Vi}
        </h1>
        <p className="mt-1 text-lg font-medium italic text-slate-500">{p.h1En}</p>

        <p className="mt-6 text-xl font-bold text-slate-900 sm:text-2xl">{p.heroSubtitleVi}</p>
        <p className="text-base font-medium italic text-slate-500">{p.heroSubtitleEn}</p>

        <DocBilingualParagraph vi={p.heroIntroVi} en={p.heroIntroEn} className="mt-4 text-lg" />
        <DocBilingualParagraph vi={p.heroLeadVi} en={p.heroLeadEn} className="mt-4" />
      </header>

      <PartnershipCtaRow />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <AudienceBlock {...p.brokers} />
        <AudienceBlock {...p.owners} />
      </div>

      <section className="mt-12">
        <DocSectionHeading vi={p.whyPartner.headingVi} en={p.whyPartner.headingEn} className="!mt-0 !border-0 !pb-0" />
        <DocBilingualParagraph vi={p.whyPartner.introVi} en={p.whyPartner.introEn} className="mt-4" />
        <DocBlockLabel vi={p.whyPartner.benefitsLabelVi} en={p.whyPartner.benefitsLabelEn} />
        <DocCardBulletList items={p.whyPartner.benefits} />
      </section>

      <section className="mt-12">
        <DocSectionHeading vi={p.process.headingVi} en={p.process.headingEn} className="!mt-0 !border-0 !pb-0" />
        <DocBilingualParagraph vi={p.process.introVi} en={p.process.introEn} className="mt-4" />
        <ProcessTimeline steps={p.process.steps} />
      </section>

      <section className="mt-12 proptech-ruby-soft-panel p-6">
        <DocSectionHeading vi={p.standards.headingVi} en={p.standards.headingEn} className="!mt-0 !border-0 !pb-0" />
        <DocBilingualParagraph vi={p.standards.introVi} en={p.standards.introEn} className="mt-4" />
        <DocCardBulletList items={p.standards.bullets} />
        <p className="mt-4 text-sm text-slate-600">
          Chi tiết kiểm duyệt:{" "}
          <Link
            href={p.standards.methodologyHref}
            className="font-semibold text-brand-700 underline"
          >
            Phương pháp biên tập
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <DocSectionHeading vi={p.ctv.headingVi} en={p.ctv.headingEn} className="!mt-0 !border-0 !pb-0" />
        <DocBilingualParagraph vi={p.ctv.introVi} en={p.ctv.introEn} className="mt-4" />
        <DocBlockLabel vi={p.ctv.suitableLabelVi} en={p.ctv.suitableLabelEn} />
        <DocCardBulletList items={p.ctv.suitableFor} />
        <p className="mt-4">
          <Link href={p.ctv.href} className="text-sm font-semibold text-brand-700 underline">
            {p.ctas[2].labelVi} →
          </Link>
        </p>
      </section>

      <section className="mt-12 rounded-2xl border border-silver-200 bg-white p-6 shadow-sm">
        <DocSectionHeading vi={p.contact.headingVi} en={p.contact.headingEn} className="!mt-0 !border-0 !pb-0" />
        <DocBilingualParagraph vi={p.contact.introVi} en={p.contact.introEn} className="mt-4" />
        <PartnershipCtaRow />
      </section>
    </>
  );
}
