import type { Metadata } from "next";
import Link from "next/link";
import { BatTrachTool } from "@/components/tools/bat-trach-tool";
import {
  buildRichFaqJsonLd,
  ToolsFaqSection,
} from "@/components/tools/tools-faq-section";
import { ToolsBreadcrumb } from "@/components/tools/tools-page-hero";
import { ToolsPageHeroEastern } from "@/components/tools/tools-page-hero-eastern";
import {
  BAT_TRACH_COPY,
  BAT_TRACH_INTRO,
  BAT_TRACH_PLACEMENTS,
} from "@/lib/content/bat-trach-copy";
import { BAT_TRACH_FAQ } from "@/lib/content/bat-trach-faq";
import { PHONG_THUY_TOOL_VISUALS } from "@/lib/content/phong-thuy-visual-variants";
import { withOpenGraph } from "@/lib/seo/open-graph";

export const metadata: Metadata = {
  title: BAT_TRACH_COPY.metaTitle,
  description: BAT_TRACH_COPY.metaDescription,
  alternates: { canonical: "/cong-cu/xem-huong-nha" },
  openGraph: withOpenGraph({
    title: BAT_TRACH_COPY.metaTitle,
    description: BAT_TRACH_COPY.metaDescription,
    url: "/cong-cu/xem-huong-nha",
  }),
};

function buildHowToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cách xem hướng nhà hợp tuổi theo Bát trạch",
    description: BAT_TRACH_COPY.metaDescription,
    step: [
      {
        "@type": "HowToStep",
        name: "Nhập năm sinh âm lịch và giới tính",
        text: "Nhập năm sinh âm lịch và giới tính của gia chủ vào công cụ.",
      },
      {
        "@type": "HowToStep",
        name: "Xác định cung mệnh",
        text: "Công cụ tính quái số, xác định cung mệnh và nhóm Đông/Tây tứ mệnh.",
      },
      {
        "@type": "HowToStep",
        name: "Đọc sơ đồ 8 hướng",
        text: "Xem 4 hướng tốt để đặt cửa, giường, bàn thờ và 4 hướng xấu để đặt bếp, nhà vệ sinh.",
      },
    ],
  };
}

export default function Page() {
  const faqJsonLd = buildRichFaqJsonLd(BAT_TRACH_FAQ);
  const howToJsonLd = buildHowToJsonLd();

  return (
    <div className="proptech-section-glow mx-auto max-w-5xl py-8 container-px">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <ToolsBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Công cụ", href: "/cong-cu" },
          { label: "Xem hướng nhà" },
        ]}
      />

      <ToolsPageHeroEastern
        kicker={BAT_TRACH_COPY.kicker}
        title={BAT_TRACH_COPY.title}
        subtitle={BAT_TRACH_COPY.subtitle}
        easternVariant={PHONG_THUY_TOOL_VISUALS["xem-huong-nha"]}
        primaryCta={{
          label: BAT_TRACH_COPY.primaryCta,
          href: BAT_TRACH_COPY.primaryCtaHref,
        }}
        secondaryCta={{
          label: BAT_TRACH_COPY.secondaryCta,
          href: BAT_TRACH_COPY.secondaryCtaHref,
        }}
      />

      <section id="cong-cu" className="scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">
            Nhập thông tin gia chủ
          </h2>
          <Link
            href="/phong-thuy"
            className="text-sm font-medium text-slate-500 hover:text-brand-700"
          >
            Phong thủy nhà ở →
          </Link>
        </div>
        <BatTrachTool />
      </section>

      <section className="mt-14 grid gap-6 sm:grid-cols-2">
        {BAT_TRACH_INTRO.map((item) => (
          <div
            key={item.heading}
            className="rounded-2xl border border-silver-200 bg-white p-5"
          >
            <h2 className="text-base font-bold text-slate-900">{item.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">
          Gợi ý bố trí theo hướng tốt / xấu
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-silver-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Không gian</th>
                <th className="px-4 py-3 font-semibold">Nguyên tắc phong thủy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-silver-100">
              {BAT_TRACH_PLACEMENTS.map((row) => (
                <tr key={row.space} className="bg-white">
                  <td className="px-4 py-3 font-semibold text-slate-800">{row.space}</td>
                  <td className="px-4 py-3 text-slate-600">{row.advice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-lg font-bold text-slate-900">Công cụ liên quan</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/cong-cu/kiem-tra-tuoi-xay-nha"
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Kiểm tra tuổi xây/sửa nhà</p>
            <p className="mt-1 text-sm text-slate-600">
              Tam Tai, Kim Lâu, Hoang Ốc — trước khi động thổ.
            </p>
          </Link>
          <Link
            href="/cong-cu/chon-mau-son-theo-menh"
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Chọn màu sơn theo mệnh</p>
            <p className="mt-1 text-sm text-slate-600">
              Màu nội thất & ngoại thất theo Ngũ hành năm sinh.
            </p>
          </Link>
          <Link
            href="/tinh-tra-gop"
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Tính khoản vay mua nhà</p>
            <p className="mt-1 text-sm text-slate-600">
              Ước tính tiền trả hàng tháng và lịch trả nợ.
            </p>
          </Link>
          <Link
            href="/du-an"
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Dự án bất động sản</p>
            <p className="mt-1 text-sm text-slate-600">
              Khám phá dự án đang mở bán phù hợp hướng nhà.
            </p>
          </Link>
        </div>
      </section>

      <ToolsFaqSection
        className="mt-14"
        heading={BAT_TRACH_COPY.faqHeading}
        items={BAT_TRACH_FAQ}
      />
    </div>
  );
}
