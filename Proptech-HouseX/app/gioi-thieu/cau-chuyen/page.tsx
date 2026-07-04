import type { Metadata } from "next";
import Link from "next/link";
import {
  FounderNoteBlock,
  StoryPullQuote,
} from "@/components/content/founder-story-sections";
import { TrustBreadcrumb, PageCtaBand } from "@/components/content/trust-page-sections";
import { HOUSEX_PROSE_CLASS } from "@/components/content/document-typography";
import { BRAND_STORY, FOUNDER_NOTE } from "@/lib/content/trust-hub-content";
import { getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: BRAND_STORY.metaTitle,
  description: BRAND_STORY.metaDescription,
  alternates: { canonical: `${getSiteUrl()}/gioi-thieu/cau-chuyen` },
};

export default function CauChuyenPage() {
  const s = BRAND_STORY;
  const [opening, ...rest] = s.narrative;

  return (
    <article className="mx-auto max-w-2xl py-10 container-px">
      <TrustBreadcrumb
        items={[
          { label: "Giới thiệu", href: "/gioi-thieu" },
          { label: "Câu chuyện" },
        ]}
      />

      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          {s.title}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {s.subtitle}
        </h1>
      </header>

      <div className={`${HOUSEX_PROSE_CLASS} prose-lg`}>
        <p>{opening}</p>

        <StoryPullQuote
          text={s.pullQuote.text}
          attribution={s.pullQuote.attribution}
        />

        {rest.map((p) => (
          <p key={p.slice(0, 56)}>{p}</p>
        ))}

        <p className="not-prose text-center">
          <span className="inline-block rounded-full bg-brand-900 px-5 py-2 text-sm font-bold tracking-wide text-gold-400">
            {s.closingTagline}
          </span>
        </p>
      </div>

      <FounderNoteBlock note={FOUNDER_NOTE} id="founder" className="mt-12" />

      <p className="mt-8 text-sm text-slate-600">
        <Link href="/gioi-thieu/phuong-phap-bien-tap" className="font-semibold text-brand-700 underline">
          Phương pháp biên tập
        </Link>
        {" · "}
          <Link href="/doi-ngu" className="font-semibold text-brand-700 underline">
            Đội ngũ & biên tập
          </Link>
        {" · "}
        <Link href="/lien-he" className="font-semibold text-brand-700 underline">
          Báo tin sai / góp ý
        </Link>
      </p>

      <PageCtaBand
        className="mt-10"
        primary={{ label: "Tìm nhà", href: "/mua-ban" }}
        secondary={{ label: "Hợp tác đăng tin", href: "/hop-tac" }}
      />

    </article>
  );
}
