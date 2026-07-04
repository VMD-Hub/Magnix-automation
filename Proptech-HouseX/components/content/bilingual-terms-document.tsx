import Link from "next/link";
import type {
  BilingualSection,
  TermsChangeLogEntry,
  TERMS_OF_USE,
} from "@/lib/content/terms-of-use-content";
import { getTermsContactBlock } from "@/lib/content/legal-contact";
import {
  DocBilingualParagraph,
  DocKicker,
  DocSectionHeading,
  DocSectionLabel,
  DocSubheading,
} from "@/components/content/document-typography";

type TermsContent = typeof TERMS_OF_USE;

function BilingualClauseBlock({
  id,
  vi,
  en,
}: {
  id: string;
  vi: string;
  en: string;
}) {
  return (
    <div className="border-b border-slate-100 py-4 last:border-0">
      <DocKicker>{id}</DocKicker>
      <DocBilingualParagraph vi={vi} en={en} />
    </div>
  );
}

function SectionHeading({ vi, en }: { vi: string; en: string }) {
  return <DocSectionHeading vi={vi} en={en} className="not-prose scroll-mt-24" />;
}

function ContactDetailsBlock() {
  const c = getTermsContactBlock();
  return (
    <div className="not-prose mt-4 rounded-xl border border-silver-200 bg-slate-50 p-5 text-sm text-slate-700">
      <ul className="space-y-2">
        <li>
          <span className="font-semibold text-slate-900">Email (pháp lý):</span>{" "}
          <a href={`mailto:${c.email}`} className="text-brand-700 underline">
            {c.email}
          </a>
        </li>
        <li>
          <span className="font-semibold text-slate-900">Email (biên tập / báo tin sai):</span>{" "}
          <a href={`mailto:${c.editorialEmail}`} className="text-brand-700 underline">
            {c.editorialEmail}
          </a>
        </li>
        <li>
          <span className="font-semibold text-slate-900">Địa chỉ / Address:</span> {c.address}
        </li>
        <li>
          <span className="font-semibold text-slate-900">Điện thoại / Phone:</span>{" "}
          <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="text-brand-700">
            {c.phone}
          </a>
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

function ChangeLogTable({ entries }: { entries: readonly TermsChangeLogEntry[] }) {
  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-silver-200">
      <table className="w-full min-w-[320px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-2 font-semibold">Ngày / Date</th>
            <th className="px-4 py-2 font-semibold">Thay đổi / Change</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.date} className="border-t border-slate-100">
              <td className="px-4 py-3 align-top font-medium text-slate-800">{e.date}</td>
              <td className="px-4 py-3 align-top text-slate-600">
                <p>{e.noteVi}</p>
                <p className="mt-1 text-xs italic text-slate-500">{e.noteEn}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BilingualTermsDocument({ terms }: { terms: TermsContent }) {
  const t = terms;

  return (
    <article className="mx-auto max-w-3xl py-10 container-px">
      <header className="border-b border-slate-200 pb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {t.titleVi}
        </h1>
        <p className="mt-1 text-lg font-medium italic text-slate-500">{t.titleEn}</p>
        <p className="mt-4 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Hiệu lực / Effective:</span>{" "}
          {t.effectiveDate}
          <span className="mx-2 text-slate-300">·</span>
          {t.effectiveDateEn}
          <span className="mx-2 text-slate-300">·</span>
          v{t.version}
        </p>
      </header>

      <section className="not-prose mt-8 rounded-2xl border border-brand-100 bg-brand-50/40 p-6">
        <DocSubheading vi={t.plainSummary.headingVi} en={t.plainSummary.headingEn} className="!mt-0" />
        <div className="mt-4 space-y-3">
          {t.plainSummary.paragraphs.map((p) => (
            <DocBilingualParagraph key={p.vi.slice(0, 40)} vi={p.vi} en={p.en} />
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-600">
          ↓ Bản pháp lý chi tiết bên dưới / Full legal text below
        </p>
      </section>

      <section className="not-prose mt-10">
        <DocSectionLabel vi="Lịch sử thay đổi" en="Change log" />
        <div className="mt-3">
          <ChangeLogTable entries={t.changeLog} />
        </div>
      </section>

      <div className="mt-10">
        {t.sections.map((section: BilingualSection) => (
          <section key={section.number} id={`section-${section.number}`}>
            <SectionHeading vi={`${section.number}. ${section.headingVi}`} en={section.headingEn} />
            <div className="mt-2">
              {section.clauses.map((clause) => (
                <BilingualClauseBlock key={clause.id} {...clause} />
              ))}
            </div>
            {section.number === 14 && <ContactDetailsBlock />}
          </section>
        ))}
      </div>

      <section className="not-prose mt-10 rounded-xl border border-silver-200 bg-white p-5">
        <DocSubheading vi="Phụ lục & liên kết" en="Appendices" className="!mt-0" />
        <ul className="doc-bullets mt-3">
          {t.appendices.map((a) => (
            <li key={a.href}>
              <Link href={a.href} className="font-semibold text-brand-700 underline">
                {a.labelVi}
              </Link>
              <span className="text-slate-400"> — </span>
              <span className="italic text-slate-500">{a.labelEn}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="not-prose mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
        <p>{t.disclaimerVi}</p>
        <p className="mt-2 italic">{t.disclaimerEn}</p>
        <p className="mt-4">
          <Link href="/bao-mat" className="font-semibold text-brand-700 underline">
            Chính sách bảo mật / Privacy Policy
          </Link>
        </p>
      </footer>
    </article>
  );
}
