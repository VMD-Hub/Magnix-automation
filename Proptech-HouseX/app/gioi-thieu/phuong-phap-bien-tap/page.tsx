import type { Metadata } from "next";
import {
  CriteriaGrid,
  MethodologyCtaLinks,
  MethodologyFlowchart,
} from "@/components/content/methodology-sections";
import {
  DocCategoryTitle,
  DocPlainBulletList,
  DocSubheading,
  HOUSEX_PROSE_CLASS,
} from "@/components/content/document-typography";
import { TrustBreadcrumb } from "@/components/content/trust-page-sections";
import { EDITORIAL_METHODOLOGY } from "@/lib/content/editorial-methodology";
import { cn } from "@/lib/ui/cn";
import { getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: EDITORIAL_METHODOLOGY.metaTitle,
  description: EDITORIAL_METHODOLOGY.metaDescription,
  alternates: {
    canonical: `${getSiteUrl()}/gioi-thieu/phuong-phap-bien-tap`,
  },
};

export default function PhuongPhapBienTapPage() {
  const m = EDITORIAL_METHODOLOGY;

  return (
    <div className="mx-auto max-w-3xl py-10 container-px">
      <TrustBreadcrumb
        items={[
          { label: "Giới thiệu", href: "/gioi-thieu" },
          { label: "Phương pháp biên tập" },
        ]}
      />

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{m.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">{m.lead}</p>

      <section className="mt-10">
        <h2 className="text-xl font-extrabold text-slate-900">{m.overviewTitle}</h2>
        <MethodologyFlowchart steps={m.overviewSteps} className="mt-4" />
      </section>

      <div className="mt-12 space-y-10">
        {m.steps.map((step) => (
          <section key={step.id} className="rounded-2xl border border-silver-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Bước {step.id}
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-slate-900">{step.heading}</h2>
            <p className="mt-2 doc-body-vi">{step.summary}</p>
            <DocPlainBulletList items={step.bullets} className="mt-4" />
          </section>
        ))}
      </div>

      <CriteriaGrid
        title={m.displayCriteria.title}
        required={m.displayCriteria.required}
        recommended={m.displayCriteria.recommended}
        excluded={m.displayCriteria.excluded}
      />

      <section className={cn("mt-12", HOUSEX_PROSE_CLASS)}>
        <h2>{m.techAndHuman.title}</h2>
        <p>{m.techAndHuman.body}</p>

        <h2>{m.verificationGuide.title}</h2>
        <ul>
          {m.verificationGuide.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-2xl border border-silver-200 bg-slate-50 p-6">
        <DocSubheading vi={m.noxhEditorial.title} className="!mt-0" />
        <p className="doc-body-vi mt-2">{m.noxhEditorial.lead}</p>
        {m.noxhEditorial.sections.map((s) => (
          <div key={s.heading} className="mt-5">
            <DocCategoryTitle className="!text-[0.9375rem] !normal-case !tracking-normal">
              {s.heading}
            </DocCategoryTitle>
            <DocPlainBulletList items={s.bullets} />
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-extrabold text-slate-900">Liên quan</h2>
        <MethodologyCtaLinks links={m.ctas} className="mt-4" />
      </section>

      <p className="mt-8 text-sm text-slate-500">{m.disclaimer}</p>
    </div>
  );
}
