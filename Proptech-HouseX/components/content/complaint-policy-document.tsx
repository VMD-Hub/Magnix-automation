import Link from "next/link";
import type { BilingualSubsection } from "@/lib/content/legal-appendix-types";
import {
  COMPLAINT_HANDLING_POLICY,
  type ComplaintPillar,
} from "@/lib/content/complaint-handling-policy";
import { getTermsContactBlock } from "@/lib/content/legal-contact";
import {
  DocBilingualParagraph,
  DocBulletList,
  DocKicker,
  DocSectionHeading,
  DocSectionLabel,
  DocSubheading,
} from "@/components/content/document-typography";

function PolicySection({ section }: { section: BilingualSubsection }) {
  return (
    <section id={`muc-${section.id}`} className="scroll-mt-24 border-b border-slate-100 py-6 last:border-0">
      <DocKicker>Mục {section.id}</DocKicker>
      <DocSectionHeading
        vi={section.headingVi}
        en={section.headingEn}
        className="!mt-2 !border-0 !pb-0"
      />
      {section.paragraphs?.map((p) => (
        <DocBilingualParagraph key={p.vi.slice(0, 48)} vi={p.vi} en={p.en} />
      ))}
      {section.bullets && <DocBulletList items={section.bullets} />}
    </section>
  );
}

function PillarCard({ pillar }: { pillar: ComplaintPillar }) {
  return (
    <div className="rounded-2xl border border-silver-200 bg-white p-5 shadow-sm">
      <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
        {pillar.step}
      </span>
      <DocSubheading vi={pillar.titleVi} en={pillar.titleEn} className="!mt-2" />
      <DocBilingualParagraph vi={pillar.descVi} en={pillar.descEn} />
    </div>
  );
}

function ContactBlock() {
  const c = getTermsContactBlock();
  return (
    <div className="not-prose rounded-xl border border-silver-200 bg-slate-50 p-5 text-sm text-slate-700">
      <DocSubheading vi="Liên hệ" en="Contact" className="!mt-0" />
      <ul className="doc-bullets mt-3">
        <li>
          <p className="doc-body-vi">
            <span className="font-semibold text-slate-900">Email (pháp lý):</span>{" "}
            <a href={`mailto:${c.email}`} className="text-brand-700 underline">
              {c.email}
            </a>
          </p>
        </li>
        <li>
          <p className="doc-body-vi">
            <span className="font-semibold text-slate-900">Email (biên tập / báo tin):</span>{" "}
            <a href={`mailto:${c.editorialEmail}`} className="text-brand-700 underline">
              {c.editorialEmail}
            </a>
          </p>
        </li>
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        <Link href="/lien-he" className="font-semibold text-brand-700 underline">
          Form Liên hệ
        </Link>
      </p>
    </div>
  );
}

export function ComplaintPolicyDocument() {
  const p = COMPLAINT_HANDLING_POLICY;

  return (
    <article>
      <header className="border-b border-slate-200 pb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {p.titleVi}
        </h1>
        <p className="mt-1 text-lg font-medium italic text-slate-500">{p.titleEn}</p>
        <DocBilingualParagraph vi={p.leadVi} en={p.leadEn} className="mt-4" />
        <p className="mt-4 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Hiệu lực / Effective:</span>{" "}
          {p.effectiveDate}
          <span className="mx-2 text-slate-300">·</span>
          {p.effectiveDateEn}
          <span className="mx-2 text-slate-300">·</span>
          v{p.version}
        </p>
      </header>

      <section className="not-prose mt-8 proptech-ruby-soft-panel p-6">
        <DocSubheading vi="Tóm tắt — 4 bước xử lý" en="Summary — 4-step handling" className="!mt-0" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {p.pillars.map((pillar) => (
            <PillarCard key={pillar.step} pillar={pillar} />
          ))}
        </div>
        <p className="mt-4 rounded-lg border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-slate-700">
          {p.disclaimer.vi}
          <span className="mt-1 block text-xs italic text-slate-500">{p.disclaimer.en}</span>
        </p>
      </section>

      <section className="not-prose mt-10">
        <DocSectionLabel vi="Bản đầy đủ" en="Full policy" />
        <div className="mt-4">
          {p.sections.map((section) => (
            <PolicySection key={section.id} section={section} />
          ))}
        </div>
      </section>

      <ContactBlock />

      <section className="not-prose mt-8 rounded-xl border border-silver-200 bg-white p-5">
        <DocSubheading vi="Liên kết liên quan" en="Related" className="!mt-0" />
        <ul className="doc-bullets mt-3">
          {p.relatedLinks.map((link) => (
            <li key={link.href}>
              <p className="doc-body-vi">
                <Link href={link.href} className="font-semibold text-brand-700 underline">
                  {link.labelVi}
                </Link>
                <span className="text-slate-400"> — </span>
                <span className="italic text-slate-500">{link.labelEn}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
