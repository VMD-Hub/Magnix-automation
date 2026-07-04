import Link from "next/link";
import type { BilingualLine, BilingualSubsection, LegalAppendixDoc } from "@/lib/content/legal-appendix-types";
import { getTermsContactBlock } from "@/lib/content/legal-contact";
import {
  DocBilingualParagraph,
  DocBulletList,
  DocKicker,
  DocNumberedList,
  DocSectionHeading,
  DocSubheading,
} from "@/components/content/document-typography";

function SubsectionBlock({ section }: { section: BilingualSubsection }) {
  return (
    <section id={section.id} className="scroll-mt-24 border-b border-slate-100 py-6 last:border-0">
      <DocKicker>{section.id}</DocKicker>
      <DocSectionHeading
        vi={section.headingVi}
        en={section.headingEn}
        className="!mt-2 !border-0 !pb-0"
      />
      {section.paragraphs?.map((p) => (
        <DocBilingualParagraph key={p.vi.slice(0, 48)} vi={p.vi} en={p.en} />
      ))}
      {section.bullets && <DocBulletList items={section.bullets} />}
      {section.numbered && <DocNumberedList items={section.numbered} />}
      {section.trailingParagraphs?.map((p) => (
        <DocBilingualParagraph key={p.vi.slice(0, 48)} vi={p.vi} en={p.en} />
      ))}
    </section>
  );
}

function ContactDetailsBlock() {
  const c = getTermsContactBlock();
  return (
    <div className="not-prose mt-8 rounded-xl border border-silver-200 bg-slate-50 p-5 text-sm text-slate-700">
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
            <span className="font-semibold text-slate-900">Email (biên tập / hỗ trợ):</span>{" "}
            <a href={`mailto:${c.editorialEmail}`} className="text-brand-700 underline">
              {c.editorialEmail}
            </a>
          </p>
        </li>
        <li>
          <p className="doc-body-vi">
            <span className="font-semibold text-slate-900">Địa chỉ / Address:</span> {c.address}
          </p>
        </li>
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        Hoặc gửi form tại{" "}
        <Link href="/lien-he" className="font-semibold text-brand-700 underline">
          trang Liên hệ
        </Link>
        .
      </p>
    </div>
  );
}

export function BilingualAppendixDocument({ doc }: { doc: LegalAppendixDoc }) {
  return (
    <article className="mx-auto max-w-3xl py-10 container-px">
      <nav className="not-prose text-sm text-slate-600">
        <Link href={doc.parentHref} className="font-semibold text-brand-700 underline">
          ← {doc.parentLabelVi}
        </Link>
        <span className="mx-2 text-slate-300">/</span>
        <span className="italic text-slate-500">{doc.parentLabelEn}</span>
      </nav>

      <header className="mt-6 border-b border-slate-200 pb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {doc.titleVi}
        </h1>
        <p className="mt-1 text-lg font-medium italic text-slate-500">{doc.titleEn}</p>
        <p className="mt-4 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Hiệu lực / Effective:</span>{" "}
          {doc.effectiveDate}
          <span className="mx-2 text-slate-300">·</span>
          {doc.effectiveDateEn}
          <span className="mx-2 text-slate-300">·</span>
          v{doc.version}
        </p>
      </header>

      <div className="mt-8">
        {doc.subsections.map((section) => (
          <SubsectionBlock key={section.id} section={section} />
        ))}
      </div>

      <ContactDetailsBlock />

      <footer className="not-prose mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
        <p>
          Phụ lục này là một phần của{" "}
          <Link href="/dieu-khoan" className="font-semibold text-brand-700 underline">
            Điều khoản sử dụng House X
          </Link>
          . / This appendix forms part of the House X Terms of Use.
        </p>
        <p className="mt-3">
          <Link href="/chinh-sach-khieu-nai" className="text-brand-700 underline">
            Chính sách xử lý khiếu nại
          </Link>
          <span className="mx-2 text-slate-300">·</span>
          <Link href="/dieu-khoan/phu-luc-a" className="text-brand-700 underline">
            Phụ lục A — SLA báo cáo
          </Link>
          <span className="mx-2 text-slate-300">·</span>
          <Link href="/dieu-khoan/phu-luc-b" className="text-brand-700 underline">
            Phụ lục B — Hoàn tiền
          </Link>
        </p>
      </footer>
    </article>
  );
}
