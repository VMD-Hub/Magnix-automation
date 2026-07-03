import type { Metadata } from "next";
import Link from "next/link";
import { EDITORIAL_METHODOLOGY } from "@/lib/content/editorial-methodology";
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
    <article className="mx-auto max-w-2xl py-10 container-px prose prose-slate prose-headings:font-bold prose-a:text-brand-700">
      <nav className="not-prose mb-6 text-sm text-slate-500">
        <Link href="/gioi-thieu" className="hover:text-brand-700">
          Giới thiệu
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">Phương pháp biên tập</span>
      </nav>

      <h1>{m.title}</h1>
      <p>{m.lead}</p>

      {m.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          <ul>
            {s.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
      ))}

      <p>{m.disclaimer}</p>

      <p>
        <Link href="/chuyen-gia/noxh-policy">Nguyễn Vũ — Biên tập viên / Luật sư / Chuyên gia NOXH</Link>
        {" · "}
        <Link href="/tin-tuc/chu-de/noxh">Hub tin NOXH</Link>
        {" · "}
        <Link href="/lien-he">Liên hệ hiệu chỉnh</Link>
      </p>
    </article>
  );
}
